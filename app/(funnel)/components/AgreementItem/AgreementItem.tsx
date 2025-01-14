'use client';

import { useCallback, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from './AgreementItem.module.scss';

interface AgreementItemProps {
  title: string;
  onClick?: () => void;
  onCheckChange?: (checked: boolean) => void;
}

export default function AgreementItem({ title, onClick, onCheckChange }: AgreementItemProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // 상위 onClick 이벤트 전파 방지
      setIsChecked(prev => !prev);
      onCheckChange?.(!isChecked);
    },
    [isChecked, onCheckChange]
  );

  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.leftContent}>
        <div className={styles.checkIcon} onClick={handleCheckClick}>
          <Icon name={isChecked ? 'check-status-on' : 'check-status-off'} size={24} />
        </div>
        <span className={styles.title}>{title}</span>
      </div>
      <Icon name="arrow-right" size={24} />
    </div>
  );
}
