'use client';

import { useEffect, useState } from 'react';
import AcademicSummaryCard from '@/app/(main)/components/AcademicSummaryCard/AcademicSummaryCard';
import { CourseAccordion } from '@/app/(main)/components/Accordion';
import SemesterGradeCard from '@/app/(main)/components/SemesterGradeCard/SemesterGradeCard';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { getSemesterFromCode } from '@/lib/utils/semester';
import type { Database } from '@/types/supabase';
import styles from './page.module.scss';

type CourseAreaType = Database['public']['Enums']['course_area_type'];

interface Course {
  name: string;
  semester: string;
  credits: number;
  grade: string;
}

interface AreaProgress {
  area_type: CourseAreaType;
  required_credits: number;
  earned_credits: number;
  required_elective_courses: number;
  completed_elective_courses: number;
  total_elective_courses: number;
  courses: Course[];
}

interface AcademicSummary {
  totalEarnedCredits: number;
  cumulativeGpa: number;
  percentile: number;
}

interface SemesterGrade {
  year: number;
  semester: number | string;
  earnedCredits: number;
  semesterGpa: number;
}

export default function GraduationProgressPage() {
  const router = useInternalRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [areaProgress, setAreaProgress] = useState<AreaProgress[]>([]);
  const [academicSummary, setAcademicSummary] = useState<AcademicSummary>({
    totalEarnedCredits: 0,
    cumulativeGpa: 0,
    percentile: 0,
  });
  const [semesterGrades, setSemesterGrades] = useState<SemesterGrade[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/graduation-progress');
        if (!response.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다.');
        }

        const data = await response.json();

        // 데이터 형식 변환
        const formattedGraduationProgress = data.graduationProgress.map((area: any) => ({
          area_type: area.areaType,
          required_credits: area.requiredCredits,
          earned_credits: area.earnedCredits,
          required_elective_courses: area.requiredElectiveCourses,
          completed_elective_courses: area.completedElectiveCourses,
          total_elective_courses: area.totalElectiveCourses,
          courses:
            area.courses?.length > 0
              ? area.courses
                  .filter(
                    (course: any) => course.courseName !== null && course.credits !== null && course.grade !== null
                  )
                  .map((course: any) => ({
                    name: course.courseName,
                    semester:
                      course.year && course.semester
                        ? `${course.year % 100}-${getSemesterFromCode(course.semester)}`
                        : null,
                    credits: course.credits,
                    grade: course.grade,
                  }))
              : [],
        }));

        setAcademicSummary({
          totalEarnedCredits: data.academicSummary.totalEarnedCredits,
          cumulativeGpa: data.academicSummary.cumulativeGpa,
          percentile: data.academicSummary.percentile,
        });

        setSemesterGrades(
          data.semesterGrades.map((grade: any) => ({
            year: grade.year,
            semester: getSemesterFromCode(grade.semester),
            earnedCredits: grade.earnedCredits,
            semesterGpa: grade.semesterGpa,
          }))
        );

        setAreaProgress(formattedGraduationProgress);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div></div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  function calculateAcademicLevel(semesters: SemesterGrade[]) {
    // 학기 데이터를 정렬 (년도 및 학기 순서 기준)
    if (!semesters || semesters.length === 0) {
      return {
        start: '1학년 1학기',
        end: '1학년 1학기',
      };
    }

    semesters.sort((a, b) => {
      const yearDiff = a.year - b.year;
      if (yearDiff !== 0) {
        return yearDiff;
      }

      // 학기 순서를 1학기 -> 여름학기 -> 2학기 -> 겨울학기로 정렬
      const semesterOrder = { '1': 1, 여름: 2, '2': 3, 겨울: 4 } as const;
      return (
        semesterOrder[a.semester as unknown as keyof typeof semesterOrder] -
        semesterOrder[b.semester as unknown as keyof typeof semesterOrder]
      );
    });

    let lastGrade = 1; // 현재 학년
    let lastSemesterName = '1학기'; // 현재 학기명
    let leftover = false; // 정규학기 조합 상태 플래그

    // 학기별 학년 및 학기 계산
    const results = semesters.map(entry => {
      const { year, semester } = entry;

      if (semester === '1' || semester === '2') {
        // 정규학기 처리
        if (semester === '1' && leftover) {
          // 1학기인데 이전 학기에 leftover가 있으면 학년 증가
          lastGrade++;
          leftover = false;
        } else if (semester === '2') {
          // 2학기가 오면 leftover를 true로 변경
          leftover = true;
        }

        // 학기명 업데이트
        lastSemesterName = semester === '1' ? '1학기' : '2학기';
      } else {
        // 계절학기 처리
        lastSemesterName = semester === '여름' ? '여름학기' : '겨울학기';
      }

      // 결과 반환
      return {
        year,
        semesterName: lastSemesterName,
        grade: lastGrade,
      };
    });

    // 시작 학기와 마지막 학기 추출
    const start = results[0];
    const end = results[results.length - 1];

    return {
      start: `${start.grade}학년 ${start.semesterName}`,
      end: `${end.grade}학년 ${end.semesterName}`,
    };
  }

  const { start, end } = calculateAcademicLevel(semesterGrades);

  function parseSemester(semester: string): number {
    switch (semester) {
      case '1':
        return 10;
      case '2':
        return 20;
      case '여름':
        return 15;
      case '겨울':
        return 25;
      default:
        return 10; // 기본값
    }
  }
  const handleClickSemesterGradeCard = () => {
    router.push(ROUTES.ACADEMIC_DETAIL, {
      params: [semesterGrades[semesterGrades.length - 1].year, parseSemester(String(semesterGrades[semesterGrades.length - 1].semester))],
    });
  };

  return (
    <div className={styles.container}>
      <div className="gap-8"></div>
      {semesterGrades.length === 0 ? (
        <div>학기 데이터가 없습니다.</div>
      ) : (
        <SemesterGradeCard startSemester={start} endSemester={end} onClick={handleClickSemesterGradeCard} />
      )}
      <div className="gap-28"></div>
      <div className={styles.sectionTitle}>전체 수강내역</div>
      <div className="gap-12"></div>
      <AcademicSummaryCard
        earnedCredits={academicSummary.totalEarnedCredits}
        gpa={academicSummary.cumulativeGpa}
        percentile={academicSummary.percentile}
      />
      <div className="gap-12"></div>
      {areaProgress
        .filter(area => area.required_credits > 0)
        .map((area, index) => (
          <div key={area.area_type}>
            <CourseAccordion
              title={area.area_type}
              currentCredits={area.earned_credits}
              requiredCredits={area.required_credits}
              isCompleted={area.earned_credits >= area.required_credits}
              requiredElectiveCredits={area.required_elective_courses}
              courses={area.courses}
            />
            {index < areaProgress.length - 1 && <div className="gap-12"></div>}
          </div>
        ))}
    </div>
  );
}
