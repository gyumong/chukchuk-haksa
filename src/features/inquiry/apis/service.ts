import { reportsApi } from '@/shared/api/client';
import type {
  CreateRequest,
  GetMyReportsParams,
  ReportCreateApiResponse,
  ReportDetailApiResponse,
  ReportListApiResponse,
} from '@/shared/api/data-contracts';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';

export async function getMyReports(params: GetMyReportsParams = { page: 0, size: 50 }) {
  const response = await ApiResponseHandler.handleAsyncResponse<ReportListApiResponse>(
    reportsApi.getMyReports(params)
  );
  return response.data;
}

/**
 * 문의를 등록한다. 같은 제출의 재시도에는 최초 요청과 같은 키·본문을 넘겨야
 * 서버가 새 문의를 만들지 않고 기존 문의 ID 를 돌려준다.
 */
export async function createReport(data: CreateRequest, idempotencyKey: string) {
  const response = await ApiResponseHandler.handleAsyncResponse<ReportCreateApiResponse>(
    reportsApi.create(data, { headers: { 'Idempotency-Key': idempotencyKey } })
  );
  return response.data;
}

export async function getReportDetail(reportId: string) {
  const response = await ApiResponseHandler.handleAsyncResponse<ReportDetailApiResponse>(
    reportsApi.getDetail(reportId)
  );
  return response.data;
}
