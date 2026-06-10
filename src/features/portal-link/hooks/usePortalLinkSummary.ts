import { useQuery } from '@tanstack/react-query';
import { getJobSummary } from '../services/portalLinkService';

/**
 * 포털 연동 job 의 summary(studentInfo·status)를 조회한다.
 *
 * 호출부가 `enabled` 로 조회 시점을 직접 정한다:
 * - funnel: 폴링이 succeeded 일 때(studentInfo 확보) + 타임아웃 회복 확인
 * - resync/portal-login: 3분 타임아웃 회복 확인 전용
 *
 * 타임아웃 직후 마지막 폴링을 놓쳐 succeeded 를 못 받은 경우, 이 조회의 status/studentInfo 로
 * 실제 성공 여부를 한 번 더 확인해 false-timeout 을 구제한다. (jobId 는 타임아웃 후에도 유효)
 */
export function usePortalLinkSummary(jobId: string | null, enabled: boolean) {
  return useQuery({
    queryKey: ['portal-link-summary', jobId],
    queryFn: () => {
      if (!jobId) {
        throw new Error('jobId is required to fetch portal link summary');
      }
      return getJobSummary(jobId);
    },
    enabled: Boolean(jobId) && enabled,
  });
}
