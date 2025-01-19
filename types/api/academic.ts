// 학기별 성적 정보
export interface SemesterGrade {
    year: number;                  // 이수년도
    semester: string;             // 학기 (1, 2, 여름, 겨울)
    earnedCredits: number;        // 취득학점
    attemptedCredits: number;     // 신청학점
    semesterGpa: number;          // 평점평균
    classRank?: number;           // 석차 (있는 경우)
    totalStudents?: number;       // 전체 학생 수 (있는 경우)
  }
  
  // 과목 정보
  export interface CourseDetail {
    courseName: string;           // 과목명
    courseCode: string;           // 학수번호
    areaType: string;            // 영역 (전공, 교양 등)
    credits: number;             // 학점
    professor: string;           // 교수명
    grade: string;               // 성적 (A+, B0 등)
    score?: number;              // 실점수 (있는 경우)
    isRetake: boolean;           // 재수강 여부
    isOnline: boolean;           // 사이버강의 여부
    year: number;                // 이수년도
    semester: number;            // 이수학기코드
    originalScore?: number;      // 원점수 (있는 경우)
  }
  
  // API 요청 파라미터
  export interface AcademicRecordParams {
    year: number;                // 이수년도
    semesterCode: number;        // 이수학기코드
  }
  
  type CourseAreaType = 
  | "중핵"  // 중요핵심교양
  | "기교"  // 기초교양
  | "선교"  // 선택교양
  | "소교"  // 소양교양
  | "전교"  // 전공교양
  | "전취"  // 전공필수
  | "전핵"  // 전공핵심
  | "전선"  // 전공선택
  | "일선"  // 일반선택

  export type CourseCategory = 'major' | 'liberal' | 'general';

// 과목 영역별 분류 함수

// 과목 영역별 분류 함수
export function getCourseCategory(areaType: CourseAreaType): CourseCategory {
  // 전공 과목
  if (areaType === '전핵' || areaType === '전선') {
    return 'major';
  }
  // 교양 과목 (일선 포함)
  return 'liberal';
}


  // API 응답
  export interface AcademicRecordResponse {
    semesterGrades: SemesterGrade[];
    courses: {
      major: CourseDetail[];     // 전공 과목 (전취, 전핵, 전선, 전교)
      liberal: CourseDetail[];   // 교양 과목 (중핵, 기교, 선교, 소교)
    };
    summary: {
      totalEarnedCredits: number;
      cumulativeGpa: number;
      majorGpa: number;
      percentile: number;
    };
  }