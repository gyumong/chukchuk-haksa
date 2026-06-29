import { lectureEvaluationsApi } from '@/shared/api/client';
import type {
  LectureEvaluationRequiredApiResponse,
  LectureEvaluationSkipApiResponse,
  LectureEvaluationSubmitApiResponse,
  SkipRequest,
  SubmitRequest,
} from '@/shared/api/data-contracts';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import type {
  LectureEvaluationStatusResponse,
  SkipLectureEvaluationRequest,
  SubmitLectureEvaluationsRequest,
} from '../types';
import {
  LectureEvaluationStatusResponseSchema,
  SkipLectureEvaluationRequestSchema,
  SubmitLectureEvaluationsRequestSchema,
} from './schema';

export async function fetchLectureEvaluationStatus(): Promise<LectureEvaluationStatusResponse> {
  const response = await ApiResponseHandler.handleAsyncResponse<LectureEvaluationRequiredApiResponse>(
    lectureEvaluationsApi.getRequired()
  );

  return LectureEvaluationStatusResponseSchema.parse(response.data);
}

export async function submitLectureEvaluations(
  request: SubmitLectureEvaluationsRequest
): Promise<LectureEvaluationSubmitApiResponse['data']> {
  const parsedRequest = SubmitLectureEvaluationsRequestSchema.parse(request);
  const response = await ApiResponseHandler.handleAsyncResponse<LectureEvaluationSubmitApiResponse>(
    lectureEvaluationsApi.submit(parsedRequest satisfies SubmitRequest)
  );

  return response.data;
}

export async function skipLectureEvaluation(
  request: SkipLectureEvaluationRequest
): Promise<LectureEvaluationSkipApiResponse['data']> {
  const parsedRequest = SkipLectureEvaluationRequestSchema.parse(request);
  const response = await ApiResponseHandler.handleAsyncResponse<LectureEvaluationSkipApiResponse>(
    lectureEvaluationsApi.skip(parsedRequest satisfies SkipRequest)
  );

  return response.data;
}
