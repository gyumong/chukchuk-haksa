// server/domain/academic-record/models/AcademicSummary.ts
export class AcademicSummary {
  constructor(
    private readonly totalAttemptedCredits: number | null,
    private readonly totalEarnedCredits: number | null,
    private readonly cumulativeGpa: number | null,
    private readonly percentile: number | null,
    private readonly attemptedCreditsGpa: number | null
  ) {}

  getTotalAttemptedCredits(): number | null {
    return this.totalAttemptedCredits;
  }

  getTotalEarnedCredits(): number | null {
    return this.totalEarnedCredits;
  }

  getCumulativeGpa(): number | null {
    return this.cumulativeGpa;
  }

  getPercentile(): number | null {
    return this.percentile;
  }

  getAttemptedCreditsGpa(): number | null {
    return this.attemptedCreditsGpa;
  }

  getRemainingCredits(totalRequiredCredits: number): number | null {
    return this.totalEarnedCredits ? Math.max(0, totalRequiredCredits - this.totalEarnedCredits) : null;
  }

  getCompletionRate(totalRequiredCredits: number): number | null {
    return this.totalEarnedCredits ? (this.totalEarnedCredits / totalRequiredCredits) * 100 : null;
  }

  isHonorsEligible(): boolean {
    if (!this.cumulativeGpa) return false;
    return this.cumulativeGpa >= 4.0;
  }
}
