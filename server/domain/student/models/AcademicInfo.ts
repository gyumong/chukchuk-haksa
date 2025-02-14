// server/domain/student/models/AcademicInfo.ts
export const StudentStatus = {
  재학: '재학',
  휴학: '휴학',
  졸업: '졸업',
  제적: '제적',
  수료: '수료',
} as const;

export type StudentStatusType = (typeof StudentStatus)[keyof typeof StudentStatus];
export class AcademicInfo {
  private constructor(
    private readonly admissionYear: number,
    private readonly semester: number,
    private readonly isTransfer: boolean,
    private readonly status: StudentStatusType,
    private readonly gradeLevel: number,
    private readonly completedSemesters: number
  ) {
    this.validate();
  }

  private validate(): void {
    const currentYear = new Date().getFullYear();

    if (this.admissionYear < 1900 || this.admissionYear > currentYear) {
      throw new AcademicInfoValidationError('유효하지 않은 입학년도입니다.');
    }

    if (this.semester !== 1 && this.semester !== 2) {
      throw new AcademicInfoValidationError('유효하지 않은 학기입니다.');
    }

    if (this.gradeLevel < 1 || this.gradeLevel > 4) {
      throw new AcademicInfoValidationError('유효하지 않은 학년입니다.');
    }

    if (this.completedSemesters < 0 || this.completedSemesters > 8) {
      throw new AcademicInfoValidationError('유효하지 않은 이수학기입니다.');
    }

    if (!Object.values(StudentStatus).includes(this.status)) {
      throw new AcademicInfoValidationError('유효하지 않은 학적상태입니다.');
    }
  }

  static create(params: {
    admissionYear: number;
    semester: number;
    isTransfer: boolean;
    status: StudentStatusType;
    gradeLevel: number;
    completedSemesters: number;
  }): AcademicInfo {
    return new AcademicInfo(
      params.admissionYear,
      params.semester,
      params.isTransfer,
      params.status,
      params.gradeLevel,
      params.completedSemesters
    );
  }

  // Getters
  getAdmissionYear(): number {
    return this.admissionYear;
  }

  getSemester(): number {
    return this.semester;
  }

  getIsTransfer(): boolean {
    return this.isTransfer;
  }

  getStatus(): StudentStatusType {
    return this.status;
  }

  getGradeLevel(): number {
    return this.gradeLevel;
  }

  getCompletedSemesters(): number {
    return this.completedSemesters;
  }

  // 비즈니스 로직
  isEnrolled(): boolean {
    return this.status === StudentStatus.재학;
  }

  isOnLeave(): boolean {
    return this.status === StudentStatus.휴학;
  }

  isGraduated(): boolean {
    return this.status === StudentStatus.졸업;
  }

  isWithdrawn(): boolean {
    return this.status === StudentStatus.제적;
  }

  isCompleted(): boolean {
    return this.status === StudentStatus.수료;
  }

  canTakeClasses(): boolean {
    return this.isEnrolled();
  }

  isFirstSemester(): boolean {
    return this.completedSemesters === 0;
  }

  equals(other: AcademicInfo): boolean {
    return (
      this.admissionYear === other.admissionYear &&
      this.semester === other.semester &&
      this.isTransfer === other.isTransfer &&
      this.status === other.status &&
      this.gradeLevel === other.gradeLevel &&
      this.completedSemesters === other.completedSemesters
    );
  }
}

export class AcademicInfoValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AcademicInfoValidationError';
  }
}
