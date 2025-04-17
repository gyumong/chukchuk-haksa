import type { GradeResponseDTO, MergedSemesterDTO, StudentDTO } from '@/types';

export async function scrapeSuwonAll(
  username: string,
  password: string
): Promise<{
  student: StudentDTO;
  semesters: MergedSemesterDTO[];
  academicRecords: GradeResponseDTO;
}> {
  const response = await fetch(`${process.env.AWS_URL}/scrape`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '크롤링 중 오류가 발생했습니다.');
  }

  return response.json();
}
