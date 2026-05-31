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
// 학번/학과 등 사용자 식별 속성은 제품 결정에 따라 전송한다(인증 시크릿 제외).
// 프로필 기반 세팅은 UserPropertiesSync 컴포넌트가 담당. 키 이름은 Notion 텍소노미와 대조해 확정할 것.
// TODO(backend): `timetable_count` / `course_count` 는 StudentProfileSchema 부재 + native-only → 백엔드 노출 후 추가.
interface AllowedUserProperties {
  sys_web_version?: string;
  /** 학번 */
  student_code?: string;
  /** 학과 (departmentName) */
  department?: string;
  /** 전공 (majorName) */
  major?: string;
  /** 입학년도 (학번 앞 2자리) */
  admission_year?: string;
  /** 학년 */
  grade_level?: number;
  /** 복수전공명 (있을 때만) */
  dual_major?: string;
}

// 타입 안전 wrapper — 정의되지 않은 키 차단. 텍소노미가 확장되면 AllowedUserProperties 에 추가.
export function setUserProperties(props: AllowedUserProperties): void {
  setUserPropertiesInternal(props as Record<string, string | number | boolean>);
}
