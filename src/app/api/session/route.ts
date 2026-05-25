import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';
import { getSession } from '@/lib/auth/session';
import { refreshTokensFromBackend } from '@/lib/auth/refreshToken';
import { getApiBaseUrl } from '@/config/environment';

export const dynamic = 'force-dynamic';

const STUDENT_PROFILE_PROBE_TIMEOUT_MS = 3_000;
// fast path 에서 토큰 잔여 시간 안전 마진. exp 가 지금 + 이 값 보다 멀리 있어야 probe 생략.
// 60s 는 임의 — 너무 짧으면 fast path 도중 만료될 위험, 너무 길면 fast path 적중률 떨어짐.
const FAST_PATH_TOKEN_BUFFER_MS = 60_000;

type ProbeResult = 'ok' | 'unauthorized' | 'not-linked' | 'error';

// JWT 의 exp 클레임을 디코드해 토큰 만료 여유를 검사한다. 서명 검증 안 함 —
// 위조 토큰 차단은 백엔드 책임이고, 여기선 fast-path 자격 판정용으로만 쓴다.
// 형식 이상·exp 없음·디코드 실패는 모두 false 반환해 기존 probe 경로로 폴백.
function hasTokenTimeLeft(accessToken: string, bufferMs: number): boolean {
  try {
    const parts = accessToken.split('.');
    if (parts.length < 2) {
      return false;
    }
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf-8')) as { exp?: number };
    if (typeof payload.exp !== 'number') {
      return false;
    }
    return payload.exp * 1000 > Date.now() + bufferMs;
  } catch {
    return false;
  }
}

// 백엔드 `/api/student/profile` 호출 결과를 네 종류로 분류해서 반환한다.
// - 'ok' (200)            → accessToken 유효 + 사용자가 portal-link 완료된 상태
// - 'unauthorized' (401)  → accessToken 만료/무효. refresh 가 필요한 신호
// - 'not-linked' (404)    → accessToken 유효 + 학생 프로필 없음 (S01, STUDENT_NOT_FOUND).
//                            funnel 로 보내야 할 정상 상태이지 세션 destroy 사유가 아님.
// - 'error' (그 외)       → 백엔드/네트워크 일시 오류 (5xx, timeout). refresh 시도해 expired-JWT hang 회복.
//
// GET 에서 토큰 유효성 검증과 isPortalLinked 승격을 한 번의 백엔드 호출로 수행하고,
// POST 에서 세션 생성 시 isPortalLinked 초기값을 결정한다.
async function probeStudentProfile(accessToken: string): Promise<ProbeResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), STUDENT_PROFILE_PROBE_TIMEOUT_MS);
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/student/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
      cache: 'no-store',
    });
    if (response.status === 401) {
      return 'unauthorized';
    }
    if (response.status === 404) {
      return 'not-linked';
    }
    if (response.ok) {
      return 'ok';
    }
    return 'error';
  } catch (error) {
    if (!(error instanceof Error && error.name === 'AbortError')) {
      captureException(error, {
        tags: { scope: 'session', action: 'probeStudentProfile' },
        extra: { endpoint: '/api/student/profile', timeoutMs: STUDENT_PROFILE_PROBE_TIMEOUT_MS },
      });
    }
    return 'error';
  } finally {
    clearTimeout(timeoutId);
  }
}

// GET /api/session: 클라이언트 하이드레이션 진입점.
// 1. 쿠키에서 토큰 꺼냄
// 2. 백엔드 probe 로 유효성 검증
// 3. probe 분기:
//    - 'ok'                      → isPortalLinked true 로 승격, 200
//    - 'not-linked'              → 토큰 유효, 학생 프로필만 없음. refresh 없이 false 로 200
//    - session 이 unlinked 라고 자체 선언 + probe 가 'unauthorized'/'error'
//        → fresh signin 직후 백엔드가 spec 외 status 반환하는 케이스 (401, 5xx 등).
//           토큰 무효 신호가 아니라 미연동 사용자 응답일 뿐이므로 refresh/destroy 없이 false 로 200
//    - 그 외 'unauthorized'/'error' (linked 상태에서 probe 실패) → 토큰 문제 가능성. refresh 시도
// 4. refresh 실패 또는 refresh 후 재-probe 가 'unauthorized' (그리고 unlinked 자체 선언 아니면)
//    → 세션 폐기 + 401
//
// probe 가 'error' (타임아웃·5xx) 일 때도 refresh 시도하는 이유 — 백엔드가 만료 JWT 처리 중 hang 해서
// probe 가 401 을 못 받고 timeout 으로 'error' 떨어지는 케이스 관측됨 (Sentry CCHAKSA-56).
// refresh 엔드포인트는 별도 refreshToken 으로 호출되어 expired-token hang 영향 없음 → 새 토큰 발급 가능.
//
// 'not-linked' (404, S01) 는 신규/포털 미연동 사용자의 정상 funnel 상태. 이걸 refresh/destroy 로
// 처리하면 갓 signin 한 미연동 사용자가 /auth/success → GET /api/session → 401 → '/' 리다이렉트로
// 튕기는 버그가 발생. /portal-login 으로 보내야 하는 신호일 뿐 세션 무효 신호가 아님.
//
// 추가: 백엔드가 spec 과 달리 미연동 사용자에게 401/5xx 를 줘도 (실제 production 관측) session 이
// 자체적으로 isPortalLinked:false 라고 선언한 상태면 — 그 토큰은 방금 signin/refresh 로 발급된
// 신선한 토큰이므로 토큰 무효 신호로 해석하면 안 됨. destroy 하지 않고 false 로 응답.
//
// refresh 실패 시 분기 단순화: probe 가 'unauthorized' 든 'error' 든 무조건 세션 폐기 (단, 위의
// unlinked 선언 케이스 제외). 사용자가 깨진 화면에 갇히는 것보다 로그인 화면으로 보내는 게 명확.
//
// isPortalLinked 는 probe 결과(`'ok'`)로만 true 로 승격 — 클라이언트 임의 값 신뢰 안 함.
export async function GET() {
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  // Fast path: 이미 portal-link 승격됐고 토큰이 충분히 남아있으면 백엔드 probe 생략.
  // 매 GET 마다 도는 probeStudentProfile (~200ms~3s) 이 isPortalLinked 변경 체감 지연의 주범.
  // - isPortalLinked === true 일 때만 적용 (false → true 승격은 여전히 probe 필요)
  // - JWT exp 가 충분히 남았으면 만료 가능성 낮음 — backend revoke 케이스는 다음 API 호출의
  //   401 fallback 에서 잡혀 refresh 자동 발동 (이미 그 경로 존재)
  // - 쿠키 maxAge 롤링 위해 session.save() 는 유지 (encrypt 만 수행, 네트워크 없음)
  if (session.isPortalLinked === true && hasTokenTimeLeft(session.accessToken, FAST_PATH_TOKEN_BUFFER_MS)) {
    await session.save();
    return NextResponse.json({
      accessToken: session.accessToken,
      isPortalLinked: session.isPortalLinked,
    });
  }

  let probe = await probeStudentProfile(session.accessToken);

  // 미연동 사용자 (S01) — 토큰은 유효. refresh/destroy 경로 진입 없이 즉시 응답.
  if (probe === 'not-linked') {
    if (session.isPortalLinked !== false) {
      session.isPortalLinked = false;
    }
    await session.save();
    return NextResponse.json({
      accessToken: session.accessToken,
      isPortalLinked: false,
    });
  }

  // session 이 unlinked 라고 자체 선언한 상태에서 probe 가 실패하면 — backend 가 spec 외
  // status (401/5xx) 로 미연동 사용자를 표현했을 가능성이 큼. 토큰은 fresh 한데 destroy 하면
  // 사용자가 / 로 튕김. 토큰 신뢰하고 false 로 응답.
  if (probe !== 'ok' && session.isPortalLinked === false) {
    await session.save();
    return NextResponse.json({
      accessToken: session.accessToken,
      isPortalLinked: false,
    });
  }

  if (probe !== 'ok') {
    const refreshed = session.refreshToken ? await refreshTokensFromBackend(session.refreshToken) : null;

    if (!refreshed) {
      await session.destroy();
      return NextResponse.json({ error: 'SESSION_EXPIRED' }, { status: 401 });
    }

    session.accessToken = refreshed.accessToken;
    session.refreshToken = refreshed.refreshToken;

    // 새 토큰으로 probe 재시도 — 유효성 재확인 + isPortalLinked 판단.
    probe = await probeStudentProfile(session.accessToken);

    if (probe === 'unauthorized') {
      // refresh 가 발급한 토큰조차 거부 → 백엔드 상태 이상. 세션 폐기.
      await session.destroy();
      return NextResponse.json({ error: 'SESSION_EXPIRED' }, { status: 401 });
    }

    if (probe === 'not-linked') {
      // refresh 직후에도 미연동 상태. 새 토큰 유지하면서 false 로 응답.
      if (session.isPortalLinked !== false) {
        session.isPortalLinked = false;
      }
      await session.save();
      return NextResponse.json({
        accessToken: session.accessToken,
        isPortalLinked: false,
      });
    }
    // probe === 'error' 면 새 토큰 그대로 유지 — 다음 호출에서 다시 시도.
  }

  if (probe === 'ok' && session.isPortalLinked !== true) {
    session.isPortalLinked = true;
  }

  await session.save();

  return NextResponse.json({
    accessToken: session.accessToken,
    isPortalLinked: session.isPortalLinked ?? false,
    analyticsId: session.analyticsId,
  });
}

export async function DELETE() {
  const session = await getSession();
  await session.destroy();
  return NextResponse.json({ ok: true });
}

interface SessionExchangeBody {
  accessToken?: unknown;
  refreshToken?: unknown;
}

// 네이티브 앱이 보유한 ac/re 토큰을 cchaksa_session 쿠키로 익스체인지.
// 시퀀스: docs/mpa-school-link-handoff.md
// isPortalLinked 는 요청 바디에서 받지 않고 백엔드 probe 결과로 결정 — 클라이언트 임의 값으로
// 세션 승격되는 경로 차단. probe 가 일시 실패(`'error'`)면 false 로 저장되고, 다음 GET 에서 재시도.
// TODO(backend): 토큰 진위 검증 엔드포인트가 추가되면 sealData 직전 호출해 위조 토큰 차단.
export async function POST(request: Request) {
  let body: SessionExchangeBody;
  try {
    body = (await request.json()) as SessionExchangeBody;
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  const { accessToken, refreshToken } = body;

  if (typeof accessToken !== 'string' || accessToken.length === 0) {
    return NextResponse.json({ error: 'MISSING_ACCESS_TOKEN' }, { status: 400 });
  }
  if (typeof refreshToken !== 'string' || refreshToken.length === 0) {
    return NextResponse.json({ error: 'MISSING_REFRESH_TOKEN' }, { status: 400 });
  }

  const probe = await probeStudentProfile(accessToken);
  const isPortalLinked = probe === 'ok';

  const session = await getSession();
  session.accessToken = accessToken;
  session.refreshToken = refreshToken;
  session.isPortalLinked = isPortalLinked;
  await session.save();

  return NextResponse.json({ ok: true, isPortalLinked });
}
