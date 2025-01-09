import React from 'react';
import { Icon } from '../ui/Icon';
import styles from './SchoolCard.module.scss';

interface SchoolCardProps {
  schoolName: string;
}

export default function SchoolCard({ schoolName }: SchoolCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Icon name="school" size={24} />
      </div>
      <span className={styles.schoolName}>{schoolName}</span>
    </div>
  );
}
