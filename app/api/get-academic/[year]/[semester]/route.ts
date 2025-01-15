import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type CourseAreaType = Database['public']['Enums']['course_area_type'];

interface CourseDetail {
  id: string;
  courseName: string;           // 과목명
  courseCode: string;           // 학수번호
  areaType: CourseAreaType;     // 영역 (전공, 교양 등)
  credits: number;             // 학점
  professor: string;           // 교수명
  grade: string;               // 성적 (A+, B0 등)
  score?: number;              // 실점수 (있는 경우)
  isRetake: boolean;           // 재수강 여부
  isOnline: boolean;           // 사이버강의 여부
  year: number;                // 이수년도
  semester: number;            // 이수학기코드
  originalScore: number;        // 실 점수
}

interface AcademicRecordResponse {
  semesterGrades: {
    year: number;                  // 이수년도
    semester: string;             // 학기 (1, 2, 여름, 겨울)
    earnedCredits: number;        // 취득학점
    attemptedCredits: number;     // 신청학점
    semesterGpa: number;          // 평점평균
    classRank?: number;           // 석차 (있는 경우)
    totalStudents?: number;       // 전체 학생 수 (있는 경우)
  }[];
  courses: {
    major: CourseDetail[];     // 전공 과목 (전취, 전핵, 전선, 전교)
    liberal: CourseDetail[];   // 교양 과목 (중핵, 기교, 선교, 소교, 일선)
  };
  summary: {
    totalEarnedCredits: number;  // 총 취득학점
    cumulativeGpa: number;       // 전체 평점평균
    majorGpa: number;            // 전공 평점평균
    percentile: number;          // 백분위
  };
}

function getCourseCategory(areaType: CourseAreaType): 'major' | 'liberal' {
  // 전공 과목
  if (areaType === '전핵' || areaType === '전선') {
    return 'major';
  }
  // 교양 과목 (일선 포함)
  return 'liberal';
}

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string; semester: string } }
) {
  try {
    const supabase = createClient();
    
    // 인증된 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const year = parseInt(params.year);
    const semester = parseInt(params.semester);

    if (isNaN(year) || isNaN(semester)) {
      return NextResponse.json({ error: '잘못된 파라미터입니다.' }, { status: 400 });
    }

    // 학기별 성적 조회
    const { data: semesterGrades, error: gradesError } = await supabase
      .from('semester_academic_records')
      .select('*')
      .eq('student_id', user.id)
      .eq('year', year)
      .eq('semester', semester);

    if (gradesError) {
      throw gradesError;
    }

    // 모든 과목 성적 조회
    const { data: courses, error: coursesError } = await supabase
    .from('student_courses')
    .select(`
      id,
      student_id,
      original_score, 
      grade,
      course_offerings!inner (
        course_id,
        points,
        professor_id,
        is_video_lecture,
        faculty_division_name,
        courses (
          course_code,
          course_name
        ),
        professor!professor_id (
          id,
          professor_name
        )
      )
    `)
    .eq('student_id', user.id)
    .eq('course_offerings.year', year)
    .eq('course_offerings.semester', semester);

    console.log('@@@@@@@@@@@@@', courses);
    if (coursesError) {
      console.error('@@@@@@@@@@@@@', coursesError);
      throw coursesError;
    }

    // 과목 데이터를 카테고리별로 분류

const categorizedCourses = courses?.reduce((acc, course) => {
  const category = getCourseCategory(course.course_offerings.faculty_division_name);
  const courseDetail: CourseDetail = {
    courseName: course.course_offerings.courses.course_name,
    courseCode: course.course_offerings.courses.course_code,
    areaType: course.course_offerings.faculty_division_name,
    credits: course.course_offerings.points,
    professor: course.course_offerings.professor?.professor_name || '미지정',
    grade: course.grade,
    score: course.points,
    isRetake: course.is_retake || false,
    isOnline: course.course_offerings.is_video_lecture || false,
    year: course.course_offerings.year,
    semester: course.course_offerings.semester,
    originalScore: course.original_score,
  };
  acc[category].push(courseDetail);
  return acc;
}, {
  major: [] as CourseDetail[],
  liberal: [] as CourseDetail[],
}) || { major: [], liberal: [] };

    // 전공 평점 계산
    const majorGpa = calculateMajorGpa(categorizedCourses.major);

    // 응답 데이터 구성
    const response: AcademicRecordResponse = {
      semesterGrades: semesterGrades.map(grade => ({
        year: grade.year,
        semester: grade.semester.toString(),
        earnedCredits: grade.earned_credits,
        attemptedCredits: grade.attempted_credits,
        semesterGpa: grade.semester_gpa,
        classRank: grade.class_rank,
        totalStudents: grade.total_students,
      })),
      courses: categorizedCourses,
      summary: {
        totalEarnedCredits: semesterGrades[0]?.earned_credits || 0,
        cumulativeGpa: semesterGrades[0]?.semester_gpa || 0,
        majorGpa,
        percentile: semesterGrades[0]?.semester_percentile || 0,
      },
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Failed to fetch academic records:', error);
    return NextResponse.json(
      { error: '성적 정보 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 전공 평점 계산 함수
function calculateMajorGpa(majorCourses: CourseDetail[]): number {
  if (!majorCourses.length) return 0;
  
  const gradePoints = {
    'A+': 4.5, 'A0': 4.0,
    'B+': 3.5, 'B0': 3.0,
    'C+': 2.5, 'C0': 2.0,
    'D+': 1.5, 'D0': 1.0,
    'F': 0.0
  };
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  majorCourses.forEach(course => {
    if (course.grade in gradePoints) {
      const points = gradePoints[course.grade as keyof typeof gradePoints];
      totalPoints += points * course.credits;
      totalCredits += course.credits;
    }
  });
  
  return totalCredits ? totalPoints / totalCredits : 0;
}