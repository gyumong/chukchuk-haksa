import { portalJobQueryApi, portalLinkApi } from '@/shared/api/client';
import type {
  AcceptedResponse,
  JobStatusResponse,
  JobSummaryResponse,
} from '@/shared/api/data-contracts';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';

interface SubmitPortalLinkParams {
  username: string;
  password: string;
  idempotencyKey: string;
}

type MaybeWrapped<T> = T | { success: boolean; data: T; message?: string };

/**
 * 백엔드 포털 연동 엔드포인트는 SpringBoot 공통 래퍼(`{ success, data, message }`)로 응답한다.
 * 그러나 `yarn api:update` 로 재생성된 swagger 타입(`AcceptedResponse` 등)은 래퍼 안쪽
 * payload 모양만 기술하고, 공용 `ApiResponseHandler` 는 래퍼를 언랩하지 않는다. 따라서
 * 런타임 응답이 래퍼면 `data` 를 추출해 flat 으로 정규화한다 (이미 flat 이면 그대로 둔다).
 *
 * 이 언랩이 없으면 호출부가 읽는 `.job_id` / `.status` 가 `undefined` 가 되어 202 정상 응답을
 * "연동 요청에 실패" 로 오판한다 — PR #202 가 호출부를 `.data.X → .X` 로 평탄화하면서 이
 * 언랩을 누락해 발생한 `/resync/login`·`/portal-login` 회귀를 복구한다. 백엔드가 추후 flat
 * 응답으로 전환해도 그대로 동작한다.
 */
export function unwrapData<T>(response: MaybeWrapped<T>): T {
  if (response !== null && typeof response === 'object' && 'success' in response && 'data' in response) {
    return (response as { data: T }).data;
  }
  return response as T;
}

export async function submitPortalLink({ username, password, idempotencyKey }: SubmitPortalLinkParams) {
  const response = await ApiResponseHandler.handleAsyncResponse<MaybeWrapped<AcceptedResponse>>(
    portalLinkApi.createPortalLinkJob(
      { portal_type: 'suwon', username, password },
      { headers: { 'Idempotency-Key': idempotencyKey } }
    )
  );

  return unwrapData(response);
}

export async function getJobStatus(jobId: string) {
  const response = await ApiResponseHandler.handleAsyncResponse<MaybeWrapped<JobStatusResponse>>(
    portalJobQueryApi.getJobStatus(jobId)
  );

  return unwrapData(response);
}

export async function getJobSummary(jobId: string) {
  const response = await ApiResponseHandler.handleAsyncResponse<MaybeWrapped<JobSummaryResponse>>(
    portalJobQueryApi.getJobSummary(jobId)
  );

  return unwrapData(response);
}
