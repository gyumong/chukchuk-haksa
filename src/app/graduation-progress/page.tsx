'use client';

import { useEffect, useState } from 'react';
import type { Database } from '@/types/supabase';
import styles from './page.module.scss';

type CourseAreaType = Database['public']['Enums']['course_area_type'];

interface Course {
  courseName: string;
  credits: number;
  grade: string;
  semester: string;
}

interface AreaProgress {
  areaType: CourseAreaType;
  requiredCredits: number;
  earnedCredits: number;
  requiredElectiveCourses: number | null;
  completedElectiveCourses: number;
  totalElectiveCourses: number | null;
  courses: Course[] | null;
}

export default function GraduationProgressPage() {
  const [areaProgress, setAreaProgress] = useState<AreaProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGraduationProgress() {
      try {
        const response = await fetch('/api/graduation-progress');
        if (!response.ok) {
          throw new Error('졸업요건 조회에 실패했습니다.');
        }
        const data = await response.json();
        setAreaProgress(data.areaProgress);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchGraduationProgress();
  }, []);

  if (isLoading) {
    return <div></div>;
  }
  if (error) {
    return <div>에러: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>졸업요건 확인</h1>

      {areaProgress.map(area => (
        <div key={area.areaType} className={styles.areaCard}>
          <div
            className={`${styles.areaCardContent} ${
              area.earnedCredits >= area.requiredCredits
                ? styles.areaCardContentCompleted
                : styles.areaCardContentIncomplete
            }`}
          >
            <div className={styles.areaHeader}>
              <div className={styles.areaInfo}>
                <span
                  className={`${styles.areaType} ${
                    area.earnedCredits >= area.requiredCredits ? styles.areaTypeCompleted : styles.areaTypeIncomplete
                  }`}
                >
                  {area.areaType}
                </span>
                <span
                  className={
                    area.earnedCredits >= area.requiredCredits ? styles.creditsCompleted : styles.creditsIncomplete
                  }
                >
                  {area.earnedCredits} / {area.requiredCredits}
                </span>
                {area.earnedCredits >= area.requiredCredits && (
                  <div className={styles.checkmark}>
                    <div className={styles.checkmarkIcon}></div>
                  </div>
                )}
              </div>
            </div>

            {area.courses && area.courses.length > 0 && (
              <div className={styles.coursesList}>
                {area.courses.map((course, idx) => (
                  <div key={idx} className={styles.courseItem}>
                    <span
                      className={`${styles.courseName} ${
                        area.earnedCredits >= area.requiredCredits
                          ? styles.courseNameCompleted
                          : styles.courseNameIncomplete
                      }`}
                    >
                      {course.courseName}
                    </span>
                    <div className={styles.courseInfo}>
                      <span
                        className={
                          area.earnedCredits >= area.requiredCredits
                            ? styles.courseCreditsCompleted
                            : styles.courseCreditsIncomplete
                        }
                      >
                        {course.credits}학점
                      </span>
                      <span className={getGradeStyleClass(course.grade)}>{course.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function getGradeStyleClass(grade: string): string {
  switch (grade) {
    case 'A+':
    case 'A0':
      return styles.gradeA;
    case 'B+':
    case 'B0':
      return styles.gradeB;
    case 'C+':
    case 'C0':
      return styles.gradeC;
    default:
      return styles.gradeDefault;
  }
}
