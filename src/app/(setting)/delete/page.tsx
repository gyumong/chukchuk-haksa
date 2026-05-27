'use client';

import { setCookie } from 'cookies-next';
import Image from 'next/image';
import { FunnelHeadline } from '@/app/(funnel)/components';
import { FixedButton } from '@/components/ui';
import { useProfileQuery } from '@/features/dashboard/apis/queries/useProfileQuery';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useDeleteUserMutation } from '@/features/user/apis/queries/useDeleteUserMutation';
import styles from './page.module.scss';

// 탈퇴 직후 재로그인 시 백엔드가 portal_link 잔존으로 isPortalLinked:true 를 돌려주는 케이스
// 대비. /auth/callback 이 이 마커를 보면 강제로 학교 연동 화면으로 보낸다. 30분이면 충분.
const POST_DELETE_COOKIE = 'cchaksa_post_delete';
const POST_DELETE_TTL_SECONDS = 30 * 60;

const DeletePage = () => {
  const mutation = useDeleteUserMutation();
  const { data: profile } = useProfileQuery();
  const { clearAuth } = useAuth();

  const handleDelete = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) {
      return;
    }

    try {
      await mutation.mutateAsync();
      setCookie(POST_DELETE_COOKIE, '1', {
        maxAge: POST_DELETE_TTL_SECONDS,
        sameSite: 'lax',
        path: '/',
      });
      // 서버 세션 + 인메모리 토큰 + React Query 캐시 폐기. AuthContext 가 hard navigate 직후
      // 빈 상태로 마운트되도록 보장.
      await clearAuth();
      alert('탈퇴가 완료되었습니다.');
      window.location.replace('/');
    } catch (err) {
      alert(err instanceof Error ? err.message : '탈퇴 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <div className="gap-14" />
      <FunnelHeadline
        title={`${profile.name}님 <br/>척척학사를 떠나시겠어요?`}
        highlightText={profile.name}
        description="다음 패치가 있기 전까지 재가입이 불가능합니다.<br/>척척학사에서 수집하는 개인 정보는<br/>탈퇴 즉시 폐기됩니다."
      />
      <div className={styles.imageWrapper}>
        <Image src="/images/illustrations/Leave.png" alt="leave 이미지" width={300} height={300} />
      </div>
      <FixedButton variant="error" onClick={handleDelete} disabled={mutation.isPending} isLoading={mutation.isPending}>
        탈퇴하기
      </FixedButton>
    </div>
  );
};

export default DeletePage;
