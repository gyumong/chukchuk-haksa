'use client';

import Image from 'next/image';
import { FunnelHeadline } from '@/app/(funnel)/components';
import { ErrorModal, FixedButton } from '@/components/ui';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useWithdrawDisplayName } from '@/features/dashboard/apis/queries/useWithdrawDisplayName';
import { useDeleteUserMutation } from '@/features/user/apis/queries/useDeleteUserMutation';
import { isInWebView, withdraw } from '@/lib/webview';
import { useMutationErrorHandler } from '@/shared/hooks/useMutationErrorHandler';
// 웹 /delete 와 동일한 확인 화면 레이아웃을 재사용한다.
import styles from '@/app/(setting)/delete/page.module.scss';

/**
 * MPA 탈퇴 확인 페이지.
 * /mpa/me '탈퇴하기' → 이 페이지로 이동(네이티브 팝업/직접 bridge 대체).
 * 버튼 → 실제 백엔드 탈퇴 + 세션 정리 후, 웹뷰면 'withdraw' 브릿지로 네이티브에 후처리 위임(웹은 / 이동).
 *
 * 이름은 인사말 개인화용일 뿐이라 미연동 유저(프로필 없음)도 탈퇴 가능하도록 useWithdrawDisplayName
 * (비-suspense)으로 옵셔널 조회한다. 과거엔 useProfileQuery(suspense)가 미연동 401/404 로 throw 해
 * 탈퇴 버튼이 에러화면에 가려졌다.
 */
const MpaDeletePage = () => {
  const mutation = useDeleteUserMutation();
  const displayName = useWithdrawDisplayName();
  const { clearAuth } = useAuth();
  const { handleMutationError, modalState, closeModal, retry, goToInquiry } = useMutationErrorHandler();

  const handleDelete = async () => {
    try {
      // 실제 백엔드 탈퇴 (DELETE /api/users/delete)
      await mutation.mutateAsync();
      // 웹뷰면 네이티브에 탈퇴 완료를 통지해 후처리(웹뷰 dismiss·로그아웃)를 위임한다. withdraw() 의 반환값은
      // postMessage '전달' 성공일 뿐 네이티브의 dismiss 를 보장하지 않으므로, 이를 dismiss 증거로 신뢰하지 않는다.
      if (isInWebView()) {
        withdraw();
      }
      // 네이티브 dismiss 여부와 무관하게 항상 세션 + 인메모리 토큰 + React Query 캐시를 폐기하고 랜딩으로
      // hard navigate 한다. 이렇게 해야 dismiss 실패 시에도 탈퇴된 계정 화면에 유효 세션이 남지 않고,
      // 즉시 이동(replace)으로 버튼 재탭(중복 탈퇴 호출)도 차단된다. (웹 /delete 의 안전 패턴과 동일)
      await clearAuth();
      window.location.replace('/');
    } catch (err) {
      handleMutationError(err, handleDelete);
    }
  };

  return (
    <div className={styles.container}>
      <div className="gap-14" />
      <FunnelHeadline
        title={displayName ? `${displayName}님 <br/>척척학사를 떠나시겠어요?` : '척척학사를 <br/>떠나시겠어요?'}
        highlightText={displayName}
        description="다음 패치가 있기 전까지 재가입이 불가능합니다.<br/>척척학사에서 수집하는 개인 정보는<br/>탈퇴 즉시 폐기됩니다."
      />
      <div className={styles.imageWrapper}>
        <Image src="/images/illustrations/Leave.png" alt="leave 이미지" width={300} height={300} />
      </div>
      <FixedButton
        variant="error"
        onClick={handleDelete}
        disabled={mutation.isPending}
        isLoading={mutation.isPending}
      >
        탈퇴하기
      </FixedButton>
      <ErrorModal
        isOpen={modalState.isOpen}
        message={modalState.message}
        code={modalState.code}
        onRetry={modalState.showRetry ? retry : undefined}
        onInquiry={() => {
          closeModal();
          goToInquiry();
        }}
        onClose={closeModal}
      />
    </div>
  );
};

export default MpaDeletePage;