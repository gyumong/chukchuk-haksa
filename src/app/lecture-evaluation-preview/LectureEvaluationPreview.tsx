'use client';

import { useState } from 'react';
import { LectureEvaluationForm } from '@/features/lecture-evaluation/components';
import type { LectureEvaluationGrade, SubmitLectureEvaluationsRequest } from '@/features/lecture-evaluation/types';
import styles from './page.module.scss';

const MOCK_GRADES: LectureEvaluationGrade[] = [
  {
    courseName: '컴퓨터네트워크',
    courseCode: '06547',
    courseId: 1,
    areaType: '전공선택',
    credits: 3,
    professor: '김민규',
    professorId: 10,
    grade: 'A+',
    score: 98,
  },
  {
    courseName: '운영체제',
    courseCode: '06548',
    courseId: 2,
    areaType: '전공필수',
    credits: 3,
    professor: '홍길동',
    professorId: 11,
    grade: 'B+',
    score: 85,
  },
  {
    courseName: '진로설계와자기계발',
    courseCode: '00001',
    courseId: 3,
    areaType: '교양선택',
    credits: 1,
    professor: '이수원',
    professorId: 12,
    grade: 'P',
    score: null,
    liberalAreaCode: 7,
  },
];

export default function LectureEvaluationPreview() {
  const [submittedRequest, setSubmittedRequest] = useState<SubmitLectureEvaluationsRequest | null>(null);
  const [isSkipped, setIsSkipped] = useState(false);

  const handleSubmit = (request: SubmitLectureEvaluationsRequest) => {
    setIsSkipped(false);
    setSubmittedRequest(request);
  };

  const handleSkip = () => {
    setSubmittedRequest(null);
    setIsSkipped(true);
  };

  return (
    <main className={styles.page}>
      <LectureEvaluationForm
        year={2026}
        semester={10}
        grades={MOCK_GRADES}
        onSubmit={handleSubmit}
        onSkip={handleSkip}
      />

      {(submittedRequest || isSkipped) && (
        <aside className={styles.result} aria-live="polite">
          <div className={styles.resultHeader}>
            <strong>{isSkipped ? '건너뛰기 클릭됨' : '제출 payload'}</strong>
            <button
              type="button"
              onClick={() => {
                setSubmittedRequest(null);
                setIsSkipped(false);
              }}
            >
              닫기
            </button>
          </div>
          {submittedRequest && <pre>{JSON.stringify(submittedRequest, null, 2)}</pre>}
          {isSkipped && <p>현재는 미확정 동작이므로 상태 저장이나 화면 이동을 수행하지 않습니다.</p>}
        </aside>
      )}
    </main>
  );
}
