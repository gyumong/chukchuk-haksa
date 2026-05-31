import { NextResponse } from 'next/server';
import { ENV } from '@/config/environment';

export const dynamic = 'force-dynamic';

// 클라이언트(reportClientError)에서 받은 예외를 Discord 웹훅으로 포워딩하는 서버 프록시.
// 웹훅 URL 은 서버 env(DISCORD_ERROR_WEBHOOK_URL)로만 보관 — 클라 번들 노출/CORS 회피.
// 미설정 시 조용히 no-op. 어떤 경우에도 클라이언트엔 204 반환(보고 실패가 앱을 깨면 안 됨).

interface ClientErrorPayload {
  name?: string;
  message?: string;
  stack?: string;
  context?: Record<string, unknown>;
  url?: string;
  userAgent?: string;
  ts?: string;
}

const DISCORD_TIMEOUT_MS = 3_000;

// Discord embed field value 는 최대 1024자. 코드블록 래핑(약 8자) 여유까지 고려해 보수적으로 자른다.
function clip(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

export async function POST(request: Request) {
  if (!ENV.DISCORD_ERROR_WEBHOOK_URL) {
    return new NextResponse(null, { status: 204 });
  }

  let body: ClientErrorPayload;
  try {
    body = (await request.json()) as ClientErrorPayload;
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const name = clip(String(body.name ?? 'Error'), 100);
  const message = clip(String(body.message ?? ''), 800);
  const stack = clip(String(body.stack ?? ''), 1000);
  const url = clip(String(body.url ?? ''), 500) || '(none)';
  const ua = clip(String(body.userAgent ?? ''), 300) || '(none)';
  const scope = body.context && typeof body.context.scope === 'string' ? body.context.scope : 'unknown';
  const ctxJson = body.context ? clip(JSON.stringify(body.context), 900) : '';

  const embed = {
    title: clip(`${name}: ${message}`, 256),
    color: 0xff5751,
    fields: [
      { name: 'scope', value: scope, inline: true },
      { name: 'URL', value: url },
      ...(ctxJson ? [{ name: 'context', value: `\`\`\`json\n${ctxJson}\n\`\`\`` }] : []),
      ...(stack ? [{ name: 'stack', value: `\`\`\`\n${stack}\n\`\`\`` }] : []),
      { name: 'UA', value: ua },
    ],
    timestamp: typeof body.ts === 'string' ? body.ts : new Date().toISOString(),
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DISCORD_TIMEOUT_MS);
    await fetch(ENV.DISCORD_ERROR_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: '척척학사 에러봇', embeds: [embed] }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
  } catch {
    // 웹훅 전송 실패/타임아웃은 무시.
  }

  return new NextResponse(null, { status: 204 });
}
