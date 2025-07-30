export const academicQueryKeys = {
  all: ['academic'] as const,
  records: () => [...academicQueryKeys.all, 'records'] as const,
  record: (year: number, semester: number) => [...academicQueryKeys.records(), year, semester] as const,
  semesters: () => [...academicQueryKeys.all, 'semesters'] as const,
  summary: () => [...academicQueryKeys.all, 'summary'] as const,
  semesterGrades: () => [...academicQueryKeys.all, 'semesterGrades'] as const,
  graduationProgress: () => [...academicQueryKeys.all, 'graduationProgress'] as const,
} as const;