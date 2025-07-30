import { z } from 'zod';

export const StudentProfileSchema = z.object({
  name: z.string().default(''),
  studentCode: z.string().default(''),
  departmentName: z.string().default(''),
  majorName: z.string().default(''),
  gradeLevel: z.number().default(0),
  currentSemester: z.number().default(0),
  status: z.string().default(''),
  lastUpdatedAt: z.string().default(''),
  lastSyncedAt: z.string().default(''),
});

export type StudentProfile = z.infer<typeof StudentProfileSchema>;
