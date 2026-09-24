import type { DesignatedCourseProgress } from '../../../types/graduation';
import { getDesignatedCourseStatusLabel } from '../../../utils/transferProgressUtils';
import styles from './DesignatedCourseList.module.scss';

interface DesignatedCourseListProps {
  courses: DesignatedCourseProgress[];
  /** 지정과목 카드가 완료(다크) 상태일 때 텍스트 색 반전. */
  isCompleted: boolean;
  /** 지정과목 스냅샷이 오래돼 포털 새로고침이 필요한지. */
  needsRefresh?: boolean;
}

// 편입생 지정과목 목록 — 과목명·학점·이수 상태. CourseList(학기·성적)와 데이터 형태가 달라 별도 컴포넌트.
export default function DesignatedCourseList({ courses, isCompleted, needsRefresh }: DesignatedCourseListProps) {
  if (courses.length === 0) {
    return (
      <p className={`${styles.empty} ${isCompleted ? styles.completed : ''}`}>
        {needsRefresh ? '포털을 새로고침하면 지정과목을 확인할 수 있어요.' : '등록된 지정과목이 없어요.'}
      </p>
    );
  }

  return (
    <div className={`${styles.container} ${isCompleted ? styles.completed : ''}`}>
      {needsRefresh && <p className={styles.notice}>포털을 새로고침하면 최신 이수 현황으로 갱신돼요.</p>}
      {courses.map((course, index) => {
        const status = course.status ?? 'UNKNOWN';
        return (
          <div key={course.courseCode ?? `${course.courseName}-${index}`} className={styles.item}>
            <div className={styles.info}>
              <span className={styles.name}>{course.courseName}</span>
              {course.courseCode && <span className={styles.code}>{course.courseCode}</span>}
            </div>
            <div className={styles.meta}>
              {course.credits != null && <span className={styles.credits}>{course.credits}학점</span>}
              <span data-status={status} className={styles.status}>
                {getDesignatedCourseStatusLabel(status)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
