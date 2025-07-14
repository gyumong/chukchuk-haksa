'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FunnelHeadline } from '@/app/(funnel)/components';
import { FixedButton } from '@/components/ui';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { userApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import styles from './page.module.scss';

const DeletePage = () => {
  const router = useInternalRouter();
  // TODO style gap 관련하여 dvh 처리? 고민
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('정말 탈퇴하시겠습니까?')) {
      return;
    }

    setIsLoading(true);
    try {
      await ApiResponseHandler.handleAsyncResponse(
        userApi.deleteUser()
      );
      
      alert('탈퇴가 완료되었습니다.');
      router.push('/'); // 메인 페이지 등으로 이동
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className="gap-14" />
      <FunnelHeadline
        title="김척척님 <br/>척척학사를 떠나시겠어요?"
        highlightText="김척척"
        description="다음 패치가 있기 전까지 재가입이 불가능합니다.<br/>척척학사에서 수집하는 개인 정보는<br/>탈퇴 즉시 폐기됩니다."
      />
      <div className={styles.imageWrapper}>
        <Image src="/images/illustrations/Leave.png" alt="leave 이미지" width={300} height={300} />
      </div>
      <FixedButton variant="error" onClick={handleDelete} disabled={isLoading}>
        {isLoading ? '탈퇴 중...' : '탈퇴하기'}
      </FixedButton>
    </div>
  );
};

export default DeletePage;
