'use client';

import Image from 'next/image';
import styles from './MaintenancePage.module.scss';

interface MaintenancePageProps {
  message?: string;
}

const MaintenancePage = ({ message }: MaintenancePageProps) => {
  const defaultMessage = '시스템 점검 중입니다.\n잠시 후 다시 이용해주세요.';
  
  return (
    <div className={styles.container}>
      <div className={styles.errorImage}>
        <Image src="/images/illustrations/CommonError.png" alt="점검 중" width={300} height={300} />
      </div>
      <div className="gap-40" />
      <div className={styles.title}>척척학사</div>
      <div className="gap-20" />
      <div className={styles.errorMessage}>{message || defaultMessage}</div>
    </div>
  );
};

export default MaintenancePage;