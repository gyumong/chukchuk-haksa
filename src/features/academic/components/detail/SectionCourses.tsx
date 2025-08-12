import GradeCard from './GradeCard';
import styles from './SectionCourses.module.scss';
import type { CourseDetail } from '../../types/graduation';

interface SectionCoursesProps {
  title: string;
  courses: CourseDetail[];
}

const SectionCourses = ({ title, courses }: SectionCoursesProps) => {
  return (
    <>
      <div className={styles.sectionTitle}>
        {title} ({courses.length})
      </div>
      <div className={styles.spacing}></div>
      <div className={styles.cardsContainer}>
        {courses.map(course => (
          <GradeCard
            key={course.courseCode}
            courseCode={course.courseCode || ''}
            courseType={course.areaType || ''}
            credits={course.credits || 0}
            professor={course.professor || ''}
            courseName={course.courseName || ''}
            grade={course.grade || ''}
            originalScore={course.originalScore || 0}
          />
        ))}
      </div>
    </>
  );
};

export default SectionCourses;