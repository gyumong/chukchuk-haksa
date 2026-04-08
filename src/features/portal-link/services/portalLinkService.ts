import { portalJobQueryApi, portalLinkApi } from '@/shared/api/client';
import type {
  SuccessResponseAcceptedResponse,
  SuccessResponseJobStatusResponse,
  SuccessResponseJobSummaryResponse,
} from '@/shared/api/data-contracts';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import { generateIdempotencyKey } from '@/shared/api/utils/idempotency';

interface SubmitPortalLinkParams {
  username: string;
  password: string;
}

export async function submitPortalLink({ username, password }: SubmitPortalLinkParams) {
  const idempotencyKey = await generateIdempotencyKey(username, password);

  console.log('[PortalLink] 연동 요청 시작', { username, idempotencyKey });

  const response = await ApiResponseHandler.handleAsyncResponse<SuccessResponseAcceptedResponse>(
    portalLinkApi.createPortalLinkJob(
      { portal_type: 'suwon', username, password },
      { headers: { 'Idempotency-Key': idempotencyKey } }
    )
  );

  console.log('[PortalLink] 연동 요청 응답', response);

  return response;
}

export async function getJobStatus(jobId: string) {
  console.log('[PortalLink] 폴링 요청', { jobId });

  const response = await ApiResponseHandler.handleAsyncResponse<SuccessResponseJobStatusResponse>(
    portalJobQueryApi.getJobStatus({ jobId })
  );

  console.log('[PortalLink] 폴링 응답', { jobId, status: response?.data?.status, response });

  return response;
}

export async function getJobSummary(jobId: string) {
  console.log('[PortalLink] 요약 조회 요청', { jobId });

  const response = await ApiResponseHandler.handleAsyncResponse<SuccessResponseJobSummaryResponse>(
    portalJobQueryApi.getJobSummary({ jobId })
  );

  console.log('[PortalLink] 요약 조회 응답', response);

  return response;
}
