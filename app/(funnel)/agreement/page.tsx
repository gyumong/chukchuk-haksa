'use client';

import { FixedButton } from '@/components/ui';
import { FunnelHeadline } from '../components';
import styles from './page.module.scss';

export default function Agreement() {
  return (
    <div className={styles.container}>
      <FunnelHeadline
        title="척척학사 이용을 위해<br/>
            학교 연동이 필요해요"
        description="척척학사에서 수집하는 개인 정보는<br/>
            학교 연동 후 즉시 폐기됩니다."
      />
      <FixedButton>다음</FixedButton>
    </div>
  );
}
