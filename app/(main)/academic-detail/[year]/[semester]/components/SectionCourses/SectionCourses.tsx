import GradeCard from '../GradeCard/GradeCard';
import styles from './SectionCourses.module.scss';

interface SectionCoursesProps {
  title: string;
  courses: Array<{
    courseCode: string;
    courseName: string;
    areaType: string;
    professor: string;
    credits: number;
    grade: string;
    originalScore?: number;
  }>;
}

const SectionCourses = ({ title, courses }: SectionCoursesProps) => {
  return (
    <>
      <div className={styles.sectionTitle}>
        {title} ({courses.length})
      </div>
      <div className="gap-12"></div>
      <div className={styles.cardsContainer}>
        {courses.map(course => (
          <GradeCard
            key={course.courseCode}
            courseCode={course.courseCode}
            courseType={course.areaType}
            credits={course.credits}
            professor={course.professor}
            courseName={course.courseName}
            grade={course.grade}
            originalScore={course.originalScore ?? 0}
          />
        ))}
      </div>
    </>
  );
};

export default SectionCourses;
