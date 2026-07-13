import { useState } from 'react';
import { Button } from '@/components/ui';
import { getApiBaseUrl, getEnvironment } from '@/config/environment';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import styles from './EnvBanner.module.scss';

interface EnvBannerProps {
  hasSession: boolean;
  isPortalLinked: boolean | null;
}

// null 은 '연동 안 됨'이 아니라 세션 조회 전/실패라서 '아니오'로 단정하면 오해를 부른다.
const getPortalLinkedLabel = (isPortalLinked: boolean | null): string => {
  if (isPortalLinked === null) {
    return '미상';
  }
  return isPortalLinked ? '예' : '아니오';
};

export function EnvBanner({ hasSession, isPortalLinked }: EnvBannerProps) {
  const { clearAuth } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await clearAuth();
    // 토큰 store 뿐 아니라 각 섹션의 쿼리 캐시까지 확실히 비우려고 전체 리로드한다.
    window.location.reload();
  };

  return (
    <div className={styles.banner}>
      <div className={styles.envGroup}>
        <div className={styles.row}>
          <span className={styles.key}>env</span>
          <code className={styles.value}>{getEnvironment()}</code>
        </div>
        <div className={styles.row}>
          <span className={styles.key}>API</span>
          <code className={styles.value}>{getApiBaseUrl()}</code>
        </div>
        <p className={styles.note}>이 페이지는 dev 전용입니다. 프로덕션 배포에서는 404 로 처리됩니다.</p>
      </div>

      <div className={styles.sessionGroup}>
        {hasSession ? (
          <>
            <span className={styles.sessionText}>세션 있음 (포털연동: {getPortalLinkedLabel(isPortalLinked)})</span>
            <Button type="button" variant="secondary" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
              로그아웃
            </Button>
          </>
        ) : (
          <span className={styles.sessionText}>
            세션 없음 — 아래 ①에서 테스트 계정을 만들고 [이 계정으로 전환]을 누르세요
          </span>
        )}
      </div>
    </div>
  );
}
