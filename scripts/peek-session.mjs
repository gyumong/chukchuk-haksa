// cchaksa_session(iron-session) 쿠키를 봉인 해제해 내용을 확인하는 일회성 디버깅 스크립트.
// 스크립트 자체에는 비밀값이 없다 — SESSION_SECRET 은 반드시 env 로만 주입한다.
// 인자로 넘기는 쿠키 값과 secret 은 셸 히스토리에 남으므로 취급에 주의.
//
// 사용법:
//   로컬 쿠키 (.env의 secret 자동 주입):
//     node --env-file=.env scripts/peek-session.mjs 'Fe26.2**...'
//   운영/스테이징 쿠키 (그 환경의 secret 직접 지정):
//     SESSION_SECRET='<PROD/STAGING secret>' node scripts/peek-session.mjs 'Fe26.2**...'
//
// 주의: 봉인은 secret에 1:1로 묶인다. 쿠키를 발급한 환경과 다른 secret으로 풀면
//        'Bad hmac value'로 throw 된다 (쿠키 손상이 아니라 secret 불일치).

import { unsealData } from 'iron-session';

// src/lib/auth/session.ts 의 SESSION_MAX_AGE_SECONDS(30일)와 동일하게 맞춘다.
// 봉인 TTL 검증에 쓰이므로 라우트의 unseal 동작을 그대로 재현하려면 일치해야 한다.
const TTL_SECONDS = 60 * 60 * 24 * 30;

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

const seal = process.argv[2];
const password = process.env.SESSION_SECRET;

if (!seal) {
  fail(
    "쿠키 값(seal)을 인자로 넘기세요.\n" +
      "  예: node --env-file=.env scripts/peek-session.mjs 'Fe26.2**...'\n" +
      '  (DevTools → Application → Cookies → cchaksa_session 의 값)',
  );
}
if (!password) {
  fail(
    'SESSION_SECRET 이 비어 있습니다.\n' +
      '  로컬: node --env-file=.env ...\n' +
      "  운영/스테이징: SESSION_SECRET='<그 환경의 secret>' node ...",
  );
}

try {
  const data = await unsealData(seal, { password, ttl: TTL_SECONDS });
  console.log('\n✓ unseal 성공\n');
  console.log(data);

  // 토큰은 길어서 객체 출력에서 잘릴 수 있으니 존재 여부/만료만 요약한다.
  if (data?.accessToken) {
    const parts = String(data.accessToken).split('.');
    if (parts.length >= 2) {
      try {
        const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
        const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf-8'));
        if (typeof payload.exp === 'number') {
          const left = payload.exp * 1000 - Date.now();
          const mins = Math.round(left / 60000);
          console.log(
            `\naccessToken exp: ${new Date(payload.exp * 1000).toISOString()} ` +
              `(${left > 0 ? `${mins}분 남음` : `${-mins}분 전 만료`})`,
          );
        }
      } catch {
        // JWT 디코드 실패는 무시 — 봉인 해제 자체는 성공했으므로 본문 출력으로 충분.
      }
    }
  }
  console.log();
} catch (error) {
  // iron-session 의 unseal 에러명을 그대로 노출 — fix/iron-session-unseal-500 의
  // '흡수 vs throw' 분류(src/lib/auth/session.ts:35-42)를 실물로 확인하기 위함.
  const name = error?.name ?? 'Error';
  const msg = error?.message ?? String(error);
  console.error(`\n✗ unseal 실패 [${name}]: ${msg}`);
  if (/bad hmac value/i.test(msg)) {
    console.error(
      '  → 십중팔구 secret 불일치. 이 쿠키를 발급한 환경(local/staging/prod)의\n' +
        '     SESSION_SECRET 으로 다시 시도하세요. (쿠키 손상과 메시지가 동일합니다.)',
    );
  }
  console.error();
  process.exit(1);
}
