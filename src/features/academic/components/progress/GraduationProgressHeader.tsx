import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import SemesterGradeCard from '@/app/(main)/components/SemesterGradeCard/SemesterGradeCard';
import { getSemesterDisplay } from '@/lib/utils/semester';
import type { SemesterGrade } from '../../types/graduation';

interface GraduationProgressHeaderProps {
  semesterGrades: SemesterGrade[];
}

export default function GraduationProgressHeader({ semesterGrades }: GraduationProgressHeaderProps) {
  const router = useInternalRouter();

  const calculateAcademicLevel = (semesters: SemesterGrade[]) => {
    if (!semesters || semesters.length === 0) {
      return { start: '1학년 1학기', end: '1학년 1학기' };
    }

    // 학기 데이터를 정렬 (년도 및 학기 순서 기준)
    const sortedSemesters = [...semesters].sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.semester - b.semester;
    });

    const firstSemester = sortedSemesters[0];
    const lastSemester = sortedSemesters[sortedSemesters.length - 1];

    return {
      start: `${firstSemester.year}년 ${getSemesterDisplay(firstSemester.semester)}`,
      end: `${lastSemester.year}년 ${getSemesterDisplay(lastSemester.semester)}`,
    };
  };

  const handleClickSemesterGradeCard = () => {
    const latestSemester = semesterGrades[semesterGrades.length - 1];
    router.push(ROUTES.ACADEMIC_DETAIL, {
      query: {
        year: latestSemester.year,
        semester: latestSemester.semester,
      },
    });
  };

  if (semesterGrades.length === 0) {
    return <div>학기 데이터가 없습니다.</div>;
  }

  const { start, end } = calculateAcademicLevel(semesterGrades);

  return (
    <>
      <div style={{ marginBottom: '8px' }}></div>
      <SemesterGradeCard 
        startSemester={start} 
        endSemester={end} 
        onClick={handleClickSemesterGradeCard} 
      />
      <div style={{ marginBottom: '28px' }}></div>
    </>
  );
}