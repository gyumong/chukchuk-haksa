import styles from './GradeCard.module.scss';

interface GradeCardProps {
  courseCode: string;
  courseType: string;
  credits: number;
  professor: string;
  courseName: string;
  grade: string;
  originalScore: number;
}

const GradeCard = ({
  courseCode,
  courseType,
  credits,
  professor,
  courseName,
  grade,
  originalScore
}: GradeCardProps) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <span className={styles.courseInfo}>
          {courseCode} I {courseType} I {credits}학점
        </span>
        <span className={styles.professorInfo}>
          {professor} 교수
        </span>
      </div>
      
      <div className={styles.cardBody}>
        <div className={styles.courseNameWrapper}>
          <span className={styles.courseName}>{courseName}</span>
        </div>
        <div className={styles.gradeWrapper}>
          <span data-grade={grade} className={styles.grade}>{grade}</span>
          <span className={styles.score}>{originalScore}</span>
        </div>
      </div>
    </div>
  );
};

export default GradeCard;