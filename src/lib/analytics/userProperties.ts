import { version as PACKAGE_VERSION } from '../../../package.json';
import { setUserPropertiesInternal } from '@/lib/analytics/amplitude';

// `sys_web_version` 의 소스. build-time import — process.env.npm_package_version 은
// Yarn 4/Turbopack 환경에서 누락되는 케이스가 있어 직접 import 가 더 안전.
// tsconfig 의 resolveJsonModule (Next.js 기본 ON) 에 의존.
export const WEB_VERSION = PACKAGE_VERSION;

// 텍소노미 (Notion) — UserProperties.
// `sys_platform` 은 웹/MPA WebView 둘 다 *절대 set 하지 않음* — 네이티브 앱 책임.
// 크로스 플랫폼 식별은 동일한 analyticsId(user_id) 로 묶이며 device_id 는 분리.
// `sys_app_version` 도 동일 — 네이티브 책임.
//
// TODO(backend): `timetable_count` / `course_count` 는 현재 StudentProfileSchema 에 부재 +
// 시간표 기능 자체가 native-only. 백엔드가 profile 응답에 노출하거나 별도 endpoint 추가 후
// `useProfileQuery` queryFn 에서 setUserProperties 호출 추가 (후속 PR).
interface AllowedUserProperties {
  sys_web_version?: string;
}

// 타입 안전 wrapper — 정의되지 않은 키 차단. 텍소노미가 확장되면 AllowedUserProperties 에 추가.
export function setUserProperties(props: AllowedUserProperties): void {
  setUserPropertiesInternal(props as Record<string, string | number | boolean>);
}
