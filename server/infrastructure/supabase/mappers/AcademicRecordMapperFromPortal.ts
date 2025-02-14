// server/infrastructure/supabase/mappers/AcademicRecordMapperFromPortal.ts
import { AcademicRecord } from '@/server/domain/academic-record/models/AcademicRecord';
// 기존에 정의한 에러 클래스 사용 (없다면 새로 정의)
import type { PortalAcademicData, PortalSemesterGrade } from '@/server/infrastructure/portal/dto/PortalDataType';
import { InvalidDataError } from './AcademicRecordMapper';

export class AcademicRecordMapperFromPortal {
  /**
   * PortalAcademicData를 AcademicRecord 도메인 모델로 변환한다.
   * enrollments(수강 이력)는 포털 데이터에 포함되지 않으므로 빈 배열로 설정한다.
   *
   * @param studentId - 학생의 ID (도메인 모델에 할당할 때 필요)
   * @param academicData - 포털에서 정제한 학업 정보 데이터
   * @returns AcademicRecord 도메인 모델
   */
  static fromPortalAcademicData(studentId: string, academicData: PortalAcademicData): AcademicRecord {
    if (!studentId) {
      throw new InvalidDataError('Student ID is required');
    }

    // PortalGradeSummary에 포함된 각 학기별 성적 데이터를 도메인 모델의 학기별 성적 객체로 변환
    const semesterGrades = academicData.grades.semesters.map((grade: PortalSemesterGrade) => {
      return {
        year: grade.year,
        semester: grade.semester,
        // Portal에서는 appliedCredits로 신청 학점을, earnedCredits로 취득 학점을 제공한다고 가정
        attemptedCredits: grade.appliedCredits,
        earnedCredits: grade.earnedCredits,
        semesterGpa: grade.semesterGpa,
        // Portal의 score 값을 학기 백분위(score 또는 percentile)로 매핑
        semesterPercentile: grade.score,
        // Portal 데이터에는 attemptedCreditsGpa 정보가 없으므로 null 처리
        attemptedCreditsGpa: null,
        // ranking 정보가 있으면 classRank와 totalStudents로 매핑 (없으면 null)
        classRank: grade.ranking ? grade.ranking.rank : null,
        totalStudents: grade.ranking ? grade.ranking.total : null,
      };
    });

    // 전체 성적 요약은 PortalAcademicSummary에서 가져온다.
    const summary = {
      totalAttemptedCredits: academicData.summary.appliedCredits,
      totalEarnedCredits: academicData.summary.totalCredits,
      cumulativeGpa: academicData.summary.gpa,
      percentile: academicData.summary.score,
      attemptedCreditsGpa: null, // 정보 없음
    };

    // 수강 이력(Enrollments)은 포털 데이터에서 제공하지 않으므로, 추후 다른 로직에서 채워지거나 빈 배열로 둔다.
    const enrollments: any[] = [];

    // AcademicRecord 도메인 모델 생성 (AcademicRecord.create 내부에서는 SemesterGrade, AcademicSummary, CourseEnrollments 등으로 구성)
    return AcademicRecord.create({
      studentId,
      semesters: semesterGrades,
      total: summary,
      enrollments: enrollments,
    });
  }
}
