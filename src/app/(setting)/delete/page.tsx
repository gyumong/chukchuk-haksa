'use client';

import Image from 'next/image';
import { FunnelHeadline } from '@/app/(funnel)/components';
import { FixedButton } from '@/components/ui';
import { useProfileQuery } from '@/features/dashboard/apis/queries/useProfileQuery';
import { useDeleteUserMutation } from '@/features/user/apis/queries/useDeleteUserMutation';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import styles from './page.module.scss';

const DeletePage = () => {
  const router = useInternalRouter();
  const mutation = useDeleteUserMutation();
  const { data: profile } = useProfileQuery();

  const handleDelete = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) {
      return;
    }

    try {
      await mutation.mutateAsync();
      alert('탈퇴가 완료되었습니다.');
      router.push('/');
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
