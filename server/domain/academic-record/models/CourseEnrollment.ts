import { Grade, GradeType } from './Grade';

// server/domain/academic-record/models/CourseEnrollment.ts
export class CourseEnrollment {
  constructor(
    private readonly studentId: string | null,
    private readonly offeringId: number | null,
    private readonly grade: Grade,
    private readonly points: number,
    private readonly retakeStatus: boolean | null,
    private readonly originalScore?: number | null
  ) {}

  static create(params: {
    studentId: string | null;
    offeringId: number | null;
    grade?: GradeType;
    points: number;
    isRetake: boolean;
    originalScore?: number | null;
  }): CourseEnrollment {
    return new CourseEnrollment(
      params.studentId,
      params.offeringId,
      params.grade ? new Grade(params.grade) : Grade.createInProgress(),
      params.points,
      params.isRetake,
      params.originalScore
    );
  }

  getStudentId(): string | null {
    return this.studentId;
  }

  getOfferingId(): number | null {
    return this.offeringId;
  }

  getGrade(): GradeType {
    return this.grade.getValue();
  }

  getPoints(): number {
    return this.points ?? 0;
  }

  isRetake(): boolean | null {
    return this.retakeStatus;
  }

  getOriginalScore(): number | null | undefined {
    return this.originalScore;
  }

  isCompleted(): boolean {
    return this.grade.isCompleted();
  }

  isPassed(): boolean {
    return this.grade.isPassingGrade();
  }

  getGradePoint(): number {
    return this.grade.getGradePoint();
  }

  // 재수강 관련 메서드
  isEligibleForRetake(): boolean {
    return (
      !this.isRetake() && this.isCompleted() && (this.grade.getValue() === GradeType.F || this.getGradePoint() <= 2.0)
    ); // C0 이하
  }
}
