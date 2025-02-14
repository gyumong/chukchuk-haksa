// server/domain/academic-record/models/Grade.ts
export enum GradeType {
  AP = 'A+',
  A0 = 'A0',
  BP = 'B+',
  B0 = 'B0',
  CP = 'C+',
  C0 = 'C0',
  DP = 'D+',
  D0 = 'D0',
  F = 'F',
  P = 'P',
  NP = 'NP',
  IP = 'IP', // In Progress
}

export class Grade {
  constructor(private readonly value: GradeType) {}

  static createInProgress(): Grade {
    return new Grade(GradeType.IP);
  }

  getValue(): GradeType {
    return this.value;
  }

  isCompleted(): boolean {
    return this.value !== GradeType.IP;
  }

  getGradePoint(): number {
    const gradePoints: Record<GradeType, number> = {
      'A+': 4.5,
      A0: 4.0,
      'B+': 3.5,
      B0: 3.0,
      'C+': 2.5,
      C0: 2.0,
      'D+': 1.5,
      D0: 1.0,
      F: 0.0,
      P: 0.0,
      NP: 0.0,
      IP: 0.0,
    };
    return gradePoints[this.value];
  }

  isPassingGrade(): boolean {
    return this.value !== GradeType.F && this.value !== GradeType.NP && this.value !== GradeType.IP;
  }
}
