import { useSuspenseQuery } from '@tanstack/react-query';
import { academicQueryKeys } from '../queryKey';
import { fetchAcademicRecord } from '../service';

export function useAcademicRecordQuery(year: number, semester: number) {
  return useSuspenseQuery({
    queryKey: academicQueryKeys.record(year, semester),
    queryFn: () => fetchAcademicRecord(year, semester),
  });
}