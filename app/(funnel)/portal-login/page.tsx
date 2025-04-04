'use client';

import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { FunnelHeadline, SchoolCard } from '../components';
import styles from './page.module.scss';
import { PortalLoginForm } from './components/PortalLoginForm/PortalLoginForm';

export default function PortalLogin() {


  const router = useInternalRouter();

  const onSuccess = () => {
    router.push(`${ROUTES.FUNNEL.AGREEMENT}`);
  };

  return (
    <div className={styles.container}>
      <FunnelHeadline
        title="재학 중인 학교<br/>계정을 연동해주세요"
        description="척척학사에서 수집하는 개인 정보는<br/>학교 연동 후 즉시 폐기됩니다."
      />
      <SchoolCard schoolName="수원대학교" />
      <div className="gap-12"></div>
      <PortalLoginForm onSuccess={onSuccess} />
    </div>
  );
}
