'use client';

import { useCallback, useState } from 'react';
import { FixedButton } from '@/components/ui';
import { AgreementItem, FunnelHeadline, PrivacyPolicySheet } from '../components';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';

export default function Agreement() {

  const router = useRouter();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleCheckChange = useCallback((checked: boolean) => {
    setIsAgreed(checked);
  }, []);

  const handleOpenSheet = useCallback(() => {
    setIsSheetOpen(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false);
  }, []);

  const handleAgree = useCallback(() => {
    router.push('/scraping');
  }, []);

  return (
    <div className={styles.container}>
      <FunnelHeadline
        title="척척학사 이용을 위해<br/>
            학교 연동이 필요해요"
        description="척척학사에서 수집하는 개인 정보는<br/>
            학교 연동 후 즉시 폐기됩니다."
      />
      <div className={styles.agreementList}>
        <AgreementItem
          title="개인 정보 수집 및 이용 동의"
          onCheckChange={handleCheckChange}
          onClick={handleOpenSheet}
        />
      </div>
      <FixedButton disabled={!isAgreed} onClick={handleAgree}>다음</FixedButton>
      <PrivacyPolicySheet isOpen={isSheetOpen} onClose={handleCloseSheet} />
    </div>
  );
}
