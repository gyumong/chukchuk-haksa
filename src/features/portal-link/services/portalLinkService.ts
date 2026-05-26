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

export async function submitPortalLink({ username, password, idempotencyKey }: SubmitPortalLinkParams) {
  return ApiResponseHandler.handleAsyncResponse<AcceptedResponse>(
    portalLinkApi.createPortalLinkJob(
      { portal_type: 'suwon', username, password },
      { headers: { 'Idempotency-Key': idempotencyKey } }
    )
  );
}

export async function getJobStatus(jobId: string) {
  return ApiResponseHandler.handleAsyncResponse<JobStatusResponse>(portalJobQueryApi.getJobStatus(jobId));
}

export async function getJobSummary(jobId: string) {
  return ApiResponseHandler.handleAsyncResponse<JobSummaryResponse>(portalJobQueryApi.getJobSummary(jobId));
}
