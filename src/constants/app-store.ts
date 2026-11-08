// 웹 서비스 종료(앱 전용 전환) 스위치. true 면 웹 랜딩(/)과 홈(/main) 진입 시 원래 화면 대신 앱 설치 안내 화면을 띄운다.
// 웹뷰(/mpa/*)는 영향 없음.
// staging(dev 브랜치 배포)과 로컬 개발 서버에서는 기존 웹을 그대로 열어 QA 에 쓴다.
// 그 외(production, 배포 환경 값 누락)는 모두 막는다. NEXT_PUBLIC_* 는 빌드 시 inline 되므로 CI 빌드 env 기준이다.
const IS_WEB_OPEN_ENV =
  process.env.NEXT_PUBLIC_DEPLOY_ENV === 'staging' || process.env.NODE_ENV === 'development';

export const WEB_UNSUPPORTED = !IS_WEB_OPEN_ENV;

export const APP_STORE_URL = 'https://apps.apple.com/kr/app/%EC%B2%99%EC%B2%99%ED%95%99%EC%82%AC/id6747005390';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.kunize.uswtimetable&hl=ko';
