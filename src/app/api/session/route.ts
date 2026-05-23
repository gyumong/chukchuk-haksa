import { NextResponse } from 'next/server';
import { captureException } from '@sentry/nextjs';
import { getSession } from '@/lib/auth/session';
import { getApiBaseUrl } from '@/config/environment';

export const dynamic = 'force-dynamic';

const PORTAL_LINKED_PROBE_TIMEOUT_MS = 3_000;

// isPortalLinked 는 클라이언트가 전달한 값을 신뢰하지 않고, 백엔드 probe 결과로만 결정한다.
// POST 시점(세션 생성)에서도 probe 를 실행해 첫 응답부터 정확한 값을 반환하며,
// POST probe 가 실패(타임아웃·네트워크)한 경우 GET 핸들러가 동일한 probe 로 재시도(fallback)한다.
// 한 번 true 로 승격되면 이후 호출은 추가 백엔드 호출 없이 즉시 응답한다.
async function probePortalLinked(accessToken: string): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PORTAL_LINKED_PROBE_TIMEOUT_MS);
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/student/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
      cache: 'no-store',
    });
    return response.ok;
  } catch (error) {
    // 타임아웃(AbortError)은 예상된 경로라 캡처하지 않고, 그 외 네트워크/예외만 관측한다.
    if (!(error instanceof Error && error.name === 'AbortError')) {
      captureException(error, {
        tags: { scope: 'session', action: 'probePortalLinked' },
        extra: { endpoint: '/api/student/profile', timeoutMs: PORTAL_LINKED_PROBE_TIMEOUT_MS },
      });
    }
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET() {
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  if (session.isPortalLinked !== true) {
    const linked = await probePortalLinked(session.accessToken);
    if (linked) {
      session.isPortalLinked = true;
      await session.save();
    }
  }

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
// 세션 승격되는 경로 차단. probe 가 실패하면 false 로 저장되고 GET 핸들러가 다음 호출 때 재시도.
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

  const isPortalLinked = await probePortalLinked(accessToken);

  const session = await getSession();
  session.accessToken = accessToken;
  session.refreshToken = refreshToken;
  session.isPortalLinked = isPortalLinked;
  await session.save();

  return NextResponse.json({ ok: true, isPortalLinked });
}
