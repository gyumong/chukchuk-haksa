// server/domain/academic-record/models/SemesterGrade.ts
export class SemesterGrade {
  constructor(
    private readonly year: number,
    private readonly semester: number,
    private readonly attemptedCredits: number | null,
    private readonly earnedCredits: number | null,
    private readonly semesterGpa: number | null,
    private readonly semesterPercentile: number | null,
    private readonly attemptedCreditsGpa: number | null,
    private readonly classRank: number | null,
    private readonly totalStudents: number | null
  ) {}

  getYear(): number {
    return this.year;
  }

  getSemester(): number {
    return this.semester;
  }

  getAttemptedCredits(): number | null {
    return this.attemptedCredits;
  }

  getEarnedCredits(): number | null {
    return this.earnedCredits;
  }

  getSemesterGpa(): number | null {
    return this.semesterGpa;
  }

  getSemesterPercentile(): number | null {
    return this.semesterPercentile;
  }

  getAttemptedCreditsGpa(): number | null {
    return this.attemptedCreditsGpa;
  }

  getClassRank(): number | null {
    return this.classRank;
  }

  getTotalStudents(): number | null {
    return this.totalStudents;
  }

  getPercentile(): number | null {
    if (!this.classRank || !this.totalStudents || this.totalStudents === 0) {
      return null;
    }
    return (this.classRank / this.totalStudents) * 100;
  }

  toString(): string {
    return `${this.year}-${this.semester}`;
  }

  equals(other: SemesterGrade): boolean {
    return this.year === other.year && this.semester === other.semester;
  }

  isAfter(other: SemesterGrade): boolean {
    if (!this.year || !other.year) {
      return false;
    }
    if (this.year !== other.year) {
      return this.year > other.year;
    }
    if (!this.semester || !other.semester) {
      return false;
    }
    return this.semester > other.semester;
  }

  isBefore(other: SemesterGrade): boolean {
    if (!this.year || !other.year) {
      return false;
    }
    if (this.year !== other.year) {
      return this.year < other.year;
    }
    if (!this.semester || !other.semester) {
      return false;
    }
    return this.semester < other.semester;
  }
}
