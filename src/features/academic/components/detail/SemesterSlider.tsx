'use client';

import { useSemesterSlider } from '../../hooks/useSemesterSlider';
import styles from './SemesterSlider.module.scss';

interface SemesterSliderProps {
  currentYear: number;
  currentSemester: number;
}

export default function SemesterSlider({ currentYear, currentSemester }: SemesterSliderProps) {
  const { semesterItems, handleSemesterClick } = useSemesterSlider(currentYear, currentSemester);

  return (
    <div className={styles.sliderContainer}>
      {semesterItems.map(item => (
        <button
          key={`${item.year}-${item.semester}`}
          className={`${styles.semesterButton} ${item.isActive ? styles.active : ''}`}
          onClick={() => handleSemesterClick(item.year, item.semester)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
