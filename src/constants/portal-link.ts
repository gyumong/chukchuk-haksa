export const RESYNC_JOB_ID_KEY = 'resync_job_id';
export const PORTAL_LOGIN_JOB_ID_KEY = 'portal_login_job_id';

// 포털 연동 일시 비활성화 스위치. true 면 홈 진입 시 공지 모달을 띄우고, 연동/재연동 진입점과
// submitPortalLink 를 모두 막는다. 복구 시 false 로 바꿔 배포하면 원래 동작으로 돌아온다.
export const PORTAL_LINK_DISABLED = true;

export const PORTAL_LINK_DISABLED_MESSAGE =
  '현재 포털 연동 기능에 문제가 생겨 일시적으로 비활성화했습니다.\n빠른 시일 내에 복구하겠습니다.\n불편을 드려 죄송합니다.\n\n- 척척학사 팀';
