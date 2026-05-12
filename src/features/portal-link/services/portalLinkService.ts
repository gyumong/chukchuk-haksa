import { portalJobQueryApi, portalLinkApi } from '@/shared/api/client';
import type {
  SuccessResponseAcceptedResponse,
  SuccessResponseJobStatusResponse,
  SuccessResponseJobSummaryResponse,
} from '@/shared/api/data-contracts';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';

interface SubmitPortalLinkParams {
  username: string;
  password: string;
  idempotencyKey: string;
}

export async function submitPortalLink({ username, password, idempotencyKey }: SubmitPortalLinkParams) {
  const response = await ApiResponseHandler.handleAsyncResponse<SuccessResponseAcceptedResponse>(
    portalLinkApi.createPortalLinkJob(
      { portal_type: 'suwon', username, password },
      { headers: { 'Idempotency-Key': idempotencyKey } }
    )
  );

  return response;
}

export async function getJobStatus(jobId: string) {
  const response = await ApiResponseHandler.handleAsyncResponse<SuccessResponseJobStatusResponse>(
    portalJobQueryApi.getJobStatus(jobId)
  );

  return response;
}

export async function getJobSummary(jobId: string) {
  const response = await ApiResponseHandler.handleAsyncResponse<SuccessResponseJobSummaryResponse>(
    portalJobQueryApi.getJobSummary(jobId)
  );

  return response;
}
