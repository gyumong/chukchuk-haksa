'use client';

import Image from 'next/image';
import styles from './ErrorScreen.module.scss';

const ErrorScreen = ({ errorMessage }: { errorMessage?: string }) => {
  return (
    <div className={styles.container}>
      <div className={styles.errorImage}>
        <Image src="/images/illustrations/CommonError.png" alt="Error" width={300} height={300} />
      </div>
      <div className="gap-40" />
      <div className="--title-lg-bold">{errorMessage}</div>
    </div>
  );
};

export default ErrorScreen;
