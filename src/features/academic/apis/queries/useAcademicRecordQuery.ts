import { useQuery } from '@tanstack/react-query';
import { academicQueryKeys } from '../queryKey';
import { fetchAcademicRecord } from '../service';

export function useAcademicRecordQuery(year: number, semester: number, enabled: boolean = true) {
  return useQuery({
    queryKey: academicQueryKeys.record(year, semester),
    queryFn: () => fetchAcademicRecord(year, semester),
    enabled: enabled && Boolean(year && semester),
  });
}