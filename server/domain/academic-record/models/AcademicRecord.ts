import { AcademicSummary } from './AcademicSummary';
import { CourseEnrollment } from './CourseEnrollment';
import { CourseEnrollments } from './CourseEnrollments';
import { GradeType } from './Grade';
import { SemesterGrade } from './SemesterGrade';

// server/domain/academic-record/models/AcademicRecord.ts
export class AcademicRecord {
  constructor(
    private readonly studentId: string | null,
    private readonly semesters: SemesterGrade[],
    private readonly summary: AcademicSummary,
    private readonly courseEnrollments: CourseEnrollments
  ) {}

  static create(params: {
    studentId: string | null;
    semesters: {
      year: number;
      semester: number;
      attemptedCredits: number | null;
      earnedCredits: number | null;
      semesterGpa: number | null;
      semesterPercentile: number | null;
      attemptedCreditsGpa: number | null;
      classRank: number | null;
      totalStudents: number | null;
    }[];
    total: {
      totalAttemptedCredits: number | null;
      totalEarnedCredits: number | null;
      cumulativeGpa: number | null;
      percentile: number | null;
      attemptedCreditsGpa: number | null;
    };
    enrollments: {
      offeringId: number;
      grade?: GradeType;
      points: number;
      isRetake: boolean;
      originalScore?: number;
    }[];
  }): AcademicRecord {
    const semesterGrades = params.semesters.map(
      sem =>
        new SemesterGrade(
          sem.year,
          sem.semester,
          sem.attemptedCredits,
          sem.earnedCredits,
          sem.semesterGpa,
          sem.semesterPercentile,
          sem.attemptedCreditsGpa,
          sem.classRank,
          sem.totalStudents
        )
    );

    const summary = new AcademicSummary(
      params.total.totalAttemptedCredits,
      params.total.totalEarnedCredits,
      params.total.cumulativeGpa,
      params.total.percentile,
      params.total.attemptedCreditsGpa
    );

    const enrollments = params.enrollments.map(enrollment =>
      CourseEnrollment.create({
        studentId: params.studentId,
        offeringId: enrollment.offeringId,
        grade: enrollment.grade,
        points: enrollment.points,
        isRetake: enrollment.isRetake,
        originalScore: enrollment.originalScore,
      })
    );

    return new AcademicRecord(params.studentId, semesterGrades, summary, CourseEnrollments.create(enrollments));
  }

  getStudentId(): string | null {
    return this.studentId;
  }

  getSemesters(): SemesterGrade[] {
    if (!this.semesters) {
      return [];
    }

    return [...this.semesters].sort((a, b) => {
      if (b.getYear() !== a.getYear()) return b.getYear() - a.getYear();
      return b.getSemester() - a.getSemester();
    });
  }

  getSemesterByYearAndSemester(year: number, semester: number): SemesterGrade | undefined {
    return this.semesters.find(sem => sem.getYear() === year && sem.getSemester() === semester);
  }

  getLatestSemester(): SemesterGrade | undefined {
    return this.getSemesters()[0];
  }

  getSummary(): AcademicSummary {
    return this.summary;
  }

  getCourseEnrollments(): CourseEnrollments {
    return this.courseEnrollments;
  }

  getEnrollmentsBySemester(year: number, semester: number): CourseEnrollments {
    return this.courseEnrollments.getBySemester(year, semester);
  }

  getTotalEarnedCredits(): number | null {
    if (!this.summary.getTotalEarnedCredits()) {
      return null;
    }
    return this.summary.getTotalEarnedCredits();
  }

  getCumulativeGpa(): number | null {
    if (!this.summary.getCumulativeGpa()) {
      return null;
    }
    return this.summary.getCumulativeGpa();
  }

  getPercentile(): number | null {
    if (!this.summary.getPercentile()) {
      return null;
    }
    return this.summary.getPercentile();
  }

  validateGradeConsistency(): boolean {
    const calculatedGPA = this.courseEnrollments.calculateGPA();
    const reportedGPA = this.summary.getCumulativeGpa();

    if (!calculatedGPA || !reportedGPA) {
      return false;
    }

    return Math.abs(calculatedGPA - reportedGPA) < 0.01;
  }

  validateCreditsConsistency(): boolean {
    const calculatedCredits = this.courseEnrollments.calculateEarnedCredits();
    const reportedCredits = this.summary.getTotalEarnedCredits();

    return calculatedCredits === reportedCredits;
  }

  getCompletedCourses(): CourseEnrollments {
    return this.courseEnrollments.getCompleted();
  }

  getPassedCourses(): CourseEnrollments {
    return this.courseEnrollments.getPassed();
  }

  getRetakeCourses(): CourseEnrollments {
    return this.courseEnrollments.getRetakes();
  }

  getEligibleForRetakeCourses(): CourseEnrollments {
    return this.courseEnrollments.getEligibleForRetake();
  }

  hasPassedCourse(offeringId: number): boolean {
    return this.courseEnrollments.hasPassedCourse(offeringId);
  }

  isCurrentlyEnrolled(offeringId: number): boolean {
    return this.courseEnrollments.isCurrentlyEnrolled(offeringId);
  }

  canTakeCourse(offeringId: number): boolean {
    return !this.hasPassedCourse(offeringId) && !this.isCurrentlyEnrolled(offeringId);
  }
}
