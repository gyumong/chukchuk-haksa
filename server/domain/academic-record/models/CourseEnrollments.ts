import { CourseEnrollment } from './CourseEnrollment';

// server/domain/academic-record/models/CourseEnrollments.ts
export class CourseEnrollments {
  constructor(private readonly enrollments: CourseEnrollment[]) {}

  static create(enrollments: CourseEnrollment[]): CourseEnrollments {
    return new CourseEnrollments(enrollments);
  }

  getAll(): CourseEnrollment[] {
    return [...this.enrollments];
  }

  getBySemester(year: number, semester: number): CourseEnrollments {
    // TODO: offering_id를 통해 course_offerings 테이블과 조인 필요
    return new CourseEnrollments([]);
  }

  getCompleted(): CourseEnrollments {
    return new CourseEnrollments(this.enrollments.filter(e => e.isCompleted()));
  }

  getPassed(): CourseEnrollments {
    return new CourseEnrollments(this.enrollments.filter(e => e.isPassed()));
  }

  getRetakes(): CourseEnrollments {
    return new CourseEnrollments(this.enrollments.filter(e => e.isRetake()));
  }

  getEligibleForRetake(): CourseEnrollments {
    return new CourseEnrollments(this.enrollments.filter(e => e.isEligibleForRetake()));
  }

  hasPassedCourse(offeringId: number): boolean {
    return this.enrollments.some(e => e.isPassed() && e.getOfferingId() === offeringId);
  }

  isCurrentlyEnrolled(offeringId: number): boolean {
    return this.enrollments.some(e => e.getOfferingId() === offeringId && !e.isCompleted());
  }

  calculateEarnedCredits(): number {
    return this.enrollments.filter(e => e.isPassed()).reduce((sum, e) => sum + e.getPoints(), 0);
  }

  calculateGPA(): number {
    const completedCourses = this.enrollments.filter(e => e.isCompleted());
    const totalPoints = completedCourses.reduce((sum, e) => sum + e.getPoints(), 0);
    const totalGradePoints = completedCourses.reduce((sum, e) => sum + e.getPoints() * e.getGradePoint(), 0);

    return totalPoints > 0 ? totalGradePoints / totalPoints : 0;
  }
}
