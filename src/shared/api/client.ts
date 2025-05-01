import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';
import { type ApiConfig, HttpClient } from '@/shared/api/http-client';
/** User API (회원/인증) */
import { User as UserApi } from '@/shared/api/User';

/* ─────────────────────────────  공통 옵션  ───────────────────────────── */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://dev.api.cchaksa.com';

/** Sentry Enrich + 쿠키 Jar + 기본 fetch 옵션을 묶은 재사용 Config */
const baseConfig: ApiConfig = {
  baseUrl: BASE_URL,

  /* 1) ✅ 쿠키 Jar → 백엔드(JWT) 전달 */
  securityWorker: async () => {
    try {
      const cookieStore = cookies();
      const cookieJar = (await cookieStore)
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join('; ');

      return cookieJar ? { headers: { Cookie: cookieJar } } : {};
    } catch {
      // (클라이언트 등) 쿠키 API 사용 불가 영역
      return {};
    }
  },

  /* 2) ✅ Data-Cache Opt-out (사용자 개인화 데이터) */
  baseApiParams: {
    cache: 'no-store', // 필요 시 개별 fetch 에서 next:{ revalidate, tags } 로 덮어쓰기
    credentials: 'include',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  },

  /* 3) ✅ customFetch — Sentry 트레이싱 & 로깅 */
  customFetch: async (...args) => {
    try {
      return await fetch(...args);
    } catch (err: any) {
      /* enrich */
      Sentry.withScope(scope => {
        scope.setLevel('fatal');
        if (args.length) {
          const url = typeof args[0] === 'string' ? args[0] : args[0].url;
          scope.setTag('route', url);
        }
        Sentry.captureException(err);
      });
      throw err;
    }
  },
};

/* ─────────────────────────────  싱글턴 인스턴스  ───────────────────────────── */

/** raw `HttpClient` (경로/타입 모르게 fetch 만 필요할 때) */
export const http = new HttpClient(baseConfig);

/*  서비스-별 API 클래스 인스턴스도 필요할 때 내보내기  */
export { User } from '@/shared/api/User'; // 타입 재-export
export { Student } from '@/shared/api/Student';
export { AcademicRecord } from '@/shared/api/AcademicRecord';
export { Graduation } from '@/shared/api/Graduation';
export { SemesterRecord } from '@/shared/api/SemesterRecord';

export const userApi = new UserApi(baseConfig);

/* 필요하다면 다른 서비스-별 export 도 동일 패턴으로… */
