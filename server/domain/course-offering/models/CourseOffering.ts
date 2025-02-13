// server/domain/course/models/CourseOffering.ts
import { Id } from '@/server/domain/shared/models/Id';

export const EvaluationType = {
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative',
} as const;

export type EvaluationType = (typeof EvaluationType)[keyof typeof EvaluationType];

export const CourseAreaType = {
  중핵: '중핵',
  기교: '기교',
  선교: '선교',
  소교: '소교',
  전교: '전교',
  전취: '전취',
  전핵: '전핵',
  전선: '전선',
  일선: '일선',
} as const;

export type CourseAreaType = (typeof CourseAreaType)[keyof typeof CourseAreaType];

export class CourseOffering {
  private constructor(
    private readonly id: Id<number>,
    private readonly courseId: number,
    private readonly year: number,
    private readonly semester: number,
    private readonly classSection: string | null,
    private readonly professorId: number,
    private readonly departmentId: number | null,
    private readonly scheduleSummary: string | null,
    private readonly evaluationType: EvaluationType | null,
    private readonly isVideoLecture: boolean,
    private readonly subjectEstablishmentSemester: number | null,
    private readonly facultyDivisionName: CourseAreaType | null,
    private readonly areaCode: number | null,
    private readonly originalAreaCode: number | null,
    private readonly points: number | null,
    private readonly hostDepartment: string | null
  ) {}

  static create(params: {
    courseId: number;
    year: number;
    semester: number;
    classSection?: string;
    professorId: number;
    departmentId?: number;
    scheduleSummary?: string;
    evaluationType?: EvaluationType;
    isVideoLecture?: boolean;
    subjectEstablishmentSemester?: number;
    facultyDivisionName?: CourseAreaType;
    areaCode?: number;
    originalAreaCode?: number;
    points?: number;
    hostDepartment?: string;
  }): CourseOffering {
    if (!params.courseId) {
      throw new Error('Course ID is required');
    }

    if (!params.year) {
      throw new Error('Year is required');
    }
    if (!params.semester) {
      throw new Error('Semester is required');
    }

    return new CourseOffering(
      Id.create<number>(),
      params.courseId,
      params.year,
      params.semester,
      params.classSection ?? null,
      params.professorId,
      params.departmentId ?? null,
      params.scheduleSummary ?? null,
      params.evaluationType ?? null,
      params.isVideoLecture ?? false,
      params.subjectEstablishmentSemester ?? null,
      params.facultyDivisionName ?? null,
      params.areaCode ?? null,
      params.originalAreaCode ?? null,
      params.points ?? null,
      params.hostDepartment ?? null
    );
  }

  static reconstitute(params: {
    id: number;
    courseId: number;
    year: number;
    semester: number;
    classSection?: string;
    professorId: number;
    departmentId?: number;
    scheduleSummary?: string;
    evaluationType?: EvaluationType;
    isVideoLecture?: boolean;
    subjectEstablishmentSemester?: number;
    facultyDivisionName?: CourseAreaType;
    areaCode?: number;
    originalAreaCode?: number;
    points?: number;
    hostDepartment?: string;
  }): CourseOffering {
    return new CourseOffering(
      Id.of(params.id),
      params.courseId,
      params.year,
      params.semester,
      params.classSection ?? null,
      params.professorId,
      params.departmentId ?? null,
      params.scheduleSummary ?? null,
      params.evaluationType ?? null,
      params.isVideoLecture ?? false,
      params.subjectEstablishmentSemester ?? null,
      params.facultyDivisionName ?? null,
      params.areaCode ?? null,
      params.originalAreaCode ?? null,
      params.points ?? null,
      params.hostDepartment ?? null
    );
  }

  getId(): Id<number> {
    return this.id;
  }

  getCourseId(): number {
    return this.courseId;
  }

  getYear(): number {
    return this.year;
  }

  getSemester(): number {
    return this.semester;
  }

  getClassSection(): string | null {
    return this.classSection;
  }

  getProfessorId(): number | null {
    return this.professorId;
  }

  getDepartmentId(): number | null {
    return this.departmentId;
  }

  getScheduleSummary(): string | null {
    return this.scheduleSummary;
  }

  getEvaluationType(): EvaluationType | null {
    return this.evaluationType;
  }

  getIsVideoLecture(): boolean {
    return this.isVideoLecture;
  }

  getSubjectEstablishmentSemester(): number | null {
    return this.subjectEstablishmentSemester;
  }

  getFacultyDivisionName(): CourseAreaType | null {
    return this.facultyDivisionName;
  }

  getAreaCode(): number | null {
    return this.areaCode;
  }

  getOriginalAreaCode(): number | null {
    return this.originalAreaCode;
  }

  getPoints(): number | null {
    return this.points;
  }

  getHostDepartment(): string | null {
    return this.hostDepartment;
  }
}
