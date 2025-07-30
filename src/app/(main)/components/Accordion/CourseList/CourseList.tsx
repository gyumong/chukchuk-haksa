import type { CourseListProps } from '../types';
import styles from './CourseList.module.scss';

export default function CourseList({ courses, isCompleted }: CourseListProps) {
  return (
    <div className={`${styles.container} ${isCompleted ? styles.completed : ''}`}>
      {courses.map((course, index) => (
        <div key={`${course.courseName}-${index}`} className={styles.courseItem}>
          <div className={styles.courseInfo}>
            <span className={styles.courseName}>{course.courseName}</span>
            <span className={styles.semester}>{course.year}-{course.semester}</span>
          </div>
          <div className={styles.courseGrade}>
            <span className={styles.credits}>{course.credits}학점</span>
            <span data-grade={course.grade} className={styles.grade}>
              {course.grade}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
