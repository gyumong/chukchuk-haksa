import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';
import { getSession } from '@/lib/auth/session';
import { refreshTokensFromBackend } from '@/lib/auth/refreshToken';
import { getApiBaseUrl } from '@/config/environment';

export const dynamic = 'force-dynamic';

const STUDENT_PROFILE_PROBE_TIMEOUT_MS = 3_000;

type ProbeResult = 'ok' | 'unauthorized' | 'error';

// 백엔드 `/api/student/profile` 호출 결과를 세 종류로 분류해서 반환한다.
// - 'ok' (200)            → accessToken 유효 + 사용자가 portal-link 완료된 상태
// - 'unauthorized' (401)  → accessToken 만료/무효. refresh 가 필요한 신호
// - 'error' (그 외)       → 백엔드/네트워크 일시 오류. 상태 변경 없이 fallback 으로 처리
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
// 3. 만료(401) 이고 refreshToken 있으면 서버 측에서 refresh 실행 → 다시 probe
// 4. 회복 불가능하면 세션 폐기 후 401 응답 → 클라이언트가 로그아웃 흐름 진입
//
// 이로써 클라이언트가 만료된 토큰으로 첫 API 호출하다 401 받아 fallback UI 도배되는 케이스를 차단.
// isPortalLinked 는 probe 결과(`'ok'`)로만 true 로 승격 — 클라이언트 임의 값 신뢰 안 함.
export async function GET() {
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  let probe = await probeStudentProfile(session.accessToken);

  if (probe === 'unauthorized') {
    const refreshed = session.refreshToken ? await refreshTokensFromBackend(session.refreshToken) : null;

    if (!refreshed) {
      session.destroy();
      return NextResponse.json({ error: 'SESSION_EXPIRED' }, { status: 401 });
    }

    session.accessToken = refreshed.accessToken;
    session.refreshToken = refreshed.refreshToken;

    // 새 토큰으로 probe 재시도 — 유효성 재확인 + isPortalLinked 판단.
    probe = await probeStudentProfile(session.accessToken);

    if (probe === 'unauthorized') {
      // refresh 가 발급한 토큰조차 거부 → 백엔드 상태 이상. 세션 폐기.
      session.destroy();
      return NextResponse.json({ error: 'SESSION_EXPIRED' }, { status: 401 });
    }
  }

  if (probe === 'ok' && session.isPortalLinked !== true) {
    session.isPortalLinked = true;
  }

  await session.save();

  return NextResponse.json({
    accessToken: session.accessToken,
    isPortalLinked: session.isPortalLinked ?? false,
  });
}

export async function DELETE() {
  const session = await getSession();
  session.destroy();
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
