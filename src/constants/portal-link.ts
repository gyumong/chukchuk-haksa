export const RESYNC_JOB_ID_KEY = 'resync_job_id';
export const PORTAL_LOGIN_JOB_ID_KEY = 'portal_login_job_id';

// 포털 연동 일시 비활성화 스위치. true 면 홈 진입 시 공지 모달을 띄우고, 연동/재연동 진입점과
// submitPortalLink 를 모두 막는다. 복구 시 false 로 바꿔 배포하면 원래 동작으로 돌아온다.
export const PORTAL_LINK_DISABLED = true;

// 홈 진입·정보 업데이트 탭 시 뜨는 공지 모달.
export const PORTAL_LINK_DISABLED_NOTICE_TITLE = '포털 연동 일시 중단 안내';
export const PORTAL_LINK_DISABLED_NOTICE =
  '학교 포털 연동에 문제가 생겨\n연동 기능을 잠시 중단했어요.\n\n이전에 불러온 학업 정보는 그대로 볼 수 있어요.\n최대한 빨리 복구할게요. 불편을 드려 죄송해요.\n\n척척학사 팀 드림';

// 연동 폼 안내 문구 / 연동 요청 차단 에러 메시지 (짧게).
export const PORTAL_LINK_DISABLED_MESSAGE = '지금은 포털 연동을 잠시 중단했어요.\n최대한 빨리 복구할게요.';
