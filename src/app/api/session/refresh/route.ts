import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getApiBaseUrl } from '@/config/environment';
import type { RefreshTokenApiResponse } from '@/shared/api/data-contracts';

export const dynamic = 'force-dynamic';

const REFRESH_TIMEOUT_MS = 10_000;

export async function POST() {
  const session = await getSession();

  if (!session.refreshToken) {
    return NextResponse.json({ error: 'NO_REFRESH_TOKEN' }, { status: 401 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS);

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
      signal: controller.signal,
    });

    if (!response.ok) {
      session.destroy();
      return NextResponse.json({ error: 'REFRESH_FAILED' }, { status: 401 });
    }

    const payload = (await response.json()) as RefreshTokenApiResponse;

    if (!payload.success || !payload.data?.accessToken || !payload.data?.refreshToken) {
      session.destroy();
      return NextResponse.json({ error: 'REFRESH_FAILED' }, { status: 401 });
    }

    session.accessToken = payload.data.accessToken;
    session.refreshToken = payload.data.refreshToken;
    await session.save();

    return NextResponse.json({ accessToken: payload.data.accessToken });
  } catch (error) {
    session.destroy();
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('[session/refresh] timed out after', REFRESH_TIMEOUT_MS, 'ms');
      return NextResponse.json({ error: 'REFRESH_TIMEOUT' }, { status: 504 });
    }
    console.error('[session/refresh] unexpected error', error);
    return NextResponse.json({ error: 'REFRESH_ERROR' }, { status: 500 });
  } finally {
    clearTimeout(timeoutId);
  }
}
