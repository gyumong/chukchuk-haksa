import AcademicSummaryCard from "../../../../components/AcademicSummaryCard/AcademicSummaryCard";
import SectionCourses from "./SectionCourses/SectionCourses";
import type { CourseDetail } from "@/types/api/academic";

interface AcademicDetailProps {
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

export default function AcademicDetailContent({data}: {data: AcademicDetailProps}) {

  console.log('data',data);
    return (
      <>
        {/* 학기 성적 요약 */}
        <AcademicSummaryCard
          earnedCredits={data.semesterGrades[0].earnedCredits}
          gpa={data.semesterGrades[0].semesterGpa} 
          classRank={data.semesterGrades[0].classRank}
          totalStudents={data.semesterGrades[0].totalStudents}
        />
        <div className="gap-24"></div>
        {/* 전공 과목 목록 */}
        <SectionCourses title="전공" courses={data.courses.major} />
        {/* 교양 과목 목록 */}
        <div className="gap-24"></div>
        <SectionCourses title="교양" courses={data.courses.liberal} />
      </>
    );
  }
  