import type { CourseDetail } from '@/types/api/academic';
import { cache } from 'react';

interface IAcademicDetailProps {
  semesterGrades: Array<{
    year: number;
    semester: string;
    earnedCredits: number;
    attemptedCredits: number;
    semesterGpa: number;
    classRank?: number;
    totalStudents?: number;
  }>;
  courses: {
    major: CourseDetail[];
    liberal: CourseDetail[];
  };
}
export const getAcademicDetail = cache(async (year: number, semester: number) : Promise<IAcademicDetailProps> => {
  console.log('🔥 실제 fetch 발생! [getAcademicDetail]');
  // const cookieStore = await cookies();
  // const token = cookieStore.getAll();

  const abtoken = process.env.TEST_TOKEN;
  const token = process.env.TEST_TOKEN2;


  const res = await fetch(`http://localhost:3000/api/get-academic/${year}/${semester}`, {
    cache: 'force-cache', 
    credentials: 'include',
    headers: {
      'Cookie': `${abtoken}; ${token}`,
    },
    next: {
      revalidate: 60 * 60 * 24,
      tags: [`academic-detail-${year}-${semester}`],
    },
  });
  
  const result = await res.json();



  
  return {
    semesterGrades: result.semesterGrades,
    courses: result.courses,
  };
});