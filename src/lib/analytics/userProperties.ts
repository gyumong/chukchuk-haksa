import { version as PACKAGE_VERSION } from '../../../package.json';
import { setUserPropertiesInternal } from '@/lib/analytics/amplitude';

// `sys_web_version` 의 소스. build-time import — process.env.npm_package_version 은
// Yarn 4/Turbopack 환경에서 누락되는 케이스가 있어 직접 import 가 더 안전.
// tsconfig 의 resolveJsonModule (Next.js 기본 ON) 에 의존.
export const WEB_VERSION = PACKAGE_VERSION;

// 텍소노미 (Notion) — UserProperties.
// `sys_platform` / `sys_app_version` 은 웹/MPA WebView 둘 다 *절대 set 하지 않음* — 네이티브 앱 책임.
// 크로스 플랫폼 식별은 동일한 analyticsId(user_id) 로 묶이며 device_id 는 분리.
//
// 학번·학과·전공·입학년도·학년 등 개인 식별 속성은 제품 결정에 따라 더 이상 전송하지 않는다.
// 현재 웹이 attach 하는 UserProperty 는 `sys_web_version` 뿐(AnalyticsProvider 가 익명 단계에서 set).
interface AllowedUserProperties {
  sys_web_version?: string;
}

// 타입 안전 wrapper — 정의되지 않은 키 차단. 텍소노미가 확장되면 AllowedUserProperties 에 추가.
export function setUserProperties(props: AllowedUserProperties): void {
  setUserPropertiesInternal(props as Record<string, string | number | boolean>);
}
