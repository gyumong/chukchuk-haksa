'use client';

import Image from 'next/image';
import { FunnelHeadline } from '@/app/(funnel)/components';
import { FixedButton } from '@/components/ui';
import { withdraw } from '@/lib/webview';
// 웹 /delete 와 동일한 확인 화면 레이아웃을 재사용한다.
import styles from '@/app/(setting)/delete/page.module.scss';

/**
 * MPA 탈퇴 확인 페이지.
 * /mpa/me 의 '탈퇴하기' 가 (네이티브 팝업/직접 bridge 가 아니라) 이 페이지로 이동하고,
 * 여기서 '탈퇴하기' 버튼을 누르면 'withdraw' 브릿지 이벤트를 송출한다. 실제 탈퇴 처리는 네이티브가 수행한다.
 */
const MpaDeletePage = () => {
  return (
    <div className={styles.container}>
      <div className="gap-14" />
      <FunnelHeadline
        title="척척학사를<br/>떠나시겠어요?"
        description="다음 패치가 있기 전까지 재가입이 불가능합니다.<br/>척척학사에서 수집하는 개인 정보는<br/>탈퇴 즉시 폐기됩니다."
      />
      <div className={styles.imageWrapper}>
        <Image src="/images/illustrations/Leave.png" alt="leave 이미지" width={300} height={300} />
      </div>
      <FixedButton variant="error" onClick={() => withdraw()}>
        탈퇴하기
      </FixedButton>
    </div>
  );
};

export default MpaDeletePage;
