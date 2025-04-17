'use client';

import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import styles from './SemesterSlider.module.scss';

interface Semester {
  year: number;
  semester: number;
}

interface SemesterSliderProps {
  currentYear: number;
  currentSemester: number;
  semesters: Semester[];
}

export default function SemesterSlider({ currentYear, currentSemester , semesters}: SemesterSliderProps) {
  const router = useInternalRouter();


  const handleSemesterClick = (year: number, semester: number) => {
    router.replace(ROUTES.ACADEMIC_DETAIL, { params: [year, semester] });
  };

  const getSemesterLabel = (semester: number): string => {
    switch (semester) {
      case 10:
        return '1학기';
      case 15:
        return '여름학기';
      case 20:
        return '2학기';
      case 25:
        return '겨울학기';
      default:
        return '';
    }
  };


  return (
    <div className={styles.sliderContainer}>
      {semesters.map(sem => (
        <button
          key={`${sem.year}-${sem.semester}`}
          className={`${styles.semesterButton} ${
            sem.year === currentYear && sem.semester === currentSemester ? styles.active : ''
          }`}
          onClick={() => handleSemesterClick(sem.year, sem.semester)}
        >
          {sem.year}년 {getSemesterLabel(sem.semester)}
        </button>
      ))}
    </div>
  );
}
