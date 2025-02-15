'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { FunnelHeadline, ScoreInput } from '../components';
import styles from './page.module.scss';

export default function TargetScorePage() {
  const [score, setScore] = useState('3.5');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/target-gpa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetGpa: parseFloat(score),
        }),
      });

      console.log(response);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '목표 학점 설정에 실패했습니다.');
      }

      router.push(`${ROUTES.MAIN}`);
    } catch (error) {
      console.error('Failed to set target score:', error);
      alert(error instanceof Error ? error.message : '목표 학점 설정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <FunnelHeadline
        title="목표로 하시는<br/>졸업 학점을 입력해 주세요"
        description="목표 학점으로 졸업할 수 있게<br/>척척학사에서 도와드릴게요"
        highlightText="졸업 학점"
      />
      <div className="gap-100" />
      <ScoreInput value={score} onChange={setScore} />
      <FixedButton onClick={handleSubmit} isLoading={isLoading}>
        다음
      </FixedButton>
    </div>
  );
}
