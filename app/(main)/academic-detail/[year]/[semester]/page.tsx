
import { Suspense } from 'react';
import AcademicDetailContent from './components/AcademicDetailContent';
import { getSemesters } from './apis/getSemesters';
import { getAcademicDetail } from './apis/getAcademicDetail';
import SemesterSlider from './components/SemesterSlider';

export const fetchCache = 'force-cache';

export default async function AcademicDetailPage({params}: {params: Promise<{year: number, semester: number}>}) {
  const {year, semester} = await params;

  const [semesters, data] = await Promise.all([
    getSemesters(),
    getAcademicDetail(year, semester),
  ]);
  
  return (
    <Suspense fallback={<div></div>}>
      <div className="gap-8"></div>
      <SemesterSlider currentYear={year} currentSemester={semester} semesters={semesters} />
      <div className="gap-20"></div>
      <AcademicDetailContent data={data} />
    </Suspense>
  );
}

