// server/domain/student/models/Student.ts
import { Id } from '../../shared/models/Id';
import type { StudentStatusType } from './AcademicInfo';
import { AcademicInfo, StudentStatus } from './AcademicInfo';

export class Student {
  private constructor(
    private readonly id: Id<string> | null, // 새로 생성시 null
    private readonly userId: string,
    private readonly code: string,
    private readonly name: string,
    private readonly departmentId: number, // number로 변경
    private readonly majorId: number, // number로 변경
    private readonly secondaryMajorId: number | null,
    private readonly targetGpa: number | null,
    private readonly academic: AcademicInfo
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.code || this.code.trim().length === 0) {
      throw new StudentValidationError('학번은 필수입니다.');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new StudentValidationError('이름은 필수입니다.');
    }
    if (!this.userId) {
      throw new StudentValidationError('사용자 ID는 필수입니다.');
    }
    if (!this.departmentId) {
      throw new StudentValidationError('학과 ID는 필수입니다.');
    }
    if (!this.majorId) {
      throw new StudentValidationError('전공 ID는 필수입니다.');
    }
  }

  static create(params: {
    userId: string;
    code: string;
    name: string;
    departmentId: number;
    majorId: number;
    secondaryMajorId?: number | null;
    targetGpa?: number;
    academic: {
      admissionYear: number;
      semester: number;
      isTransfer: boolean;
      status: StudentStatusType;
      gradeLevel: number;
      completedSemesters: number;
    };
  }): Student {
    return new Student(
      null,
      params.userId,
      params.code,
      params.name,
      params.departmentId,
      params.majorId,
      params.secondaryMajorId ?? null,
      params.targetGpa ?? null,
      AcademicInfo.create(params.academic)
    );
  }

  static reconstitute(params: {
    id: string;
    userId: string;
    code: string;
    name: string;
    departmentId: number;
    majorId: number;
    secondaryMajorId: number | null;
    targetGpa: number | null;
    academic: {
      admissionYear: number;
      semester: number;
      isTransfer: boolean;
      status: StudentStatusType;
      gradeLevel: number;
      completedSemesters: number;
    };
  }): Student {
    return new Student(
      Id.of(params.id),
      params.userId,
      params.code,
      params.name,
      params.departmentId,
      params.majorId,
      params.secondaryMajorId,
      params.targetGpa ?? null,
      AcademicInfo.create(params.academic)
    );
  }

  getId(): Id<string> | null {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getCode(): string {
    return this.code;
  }

  getName(): string {
    return this.name;
  }

  getDepartmentId(): number {
    return this.departmentId;
  }

  getMajorId(): number {
    return this.majorId;
  }

  getSecondaryMajorId(): number | null {
    return this.secondaryMajorId;
  }

  getTargetGpa(): number | null {
    return this.targetGpa;
  }

  getAcademicInfo(): AcademicInfo {
    return this.academic;
  }

  equals(other: Student): boolean {
    if (!(other instanceof Student)) {
      return false;
    }

    return this.code === other.code && this.userId === other.userId;
  }

  // 비즈니스 로직
  isEnrolled(): boolean {
    return this.academic.getStatus() === StudentStatus.재학;
  }

  canTakeClasses(): boolean {
    return this.isEnrolled();
  }
  updateTargetGpa(targetGpa: number): void {
    if (targetGpa < 0 || targetGpa > 4.5) {
      throw new StudentValidationError('유효하지 않은 목표 학점입니다.');
    }
  }
}

export class StudentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StudentValidationError';
  }
}
