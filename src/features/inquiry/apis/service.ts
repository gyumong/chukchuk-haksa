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

export async function createReport(data: CreateRequest) {
  const response = await ApiResponseHandler.handleAsyncResponse<ReportCreateApiResponse>(reportsApi.create(data));
  return response.data;
}

export async function getReportDetail(reportId: string) {
  const response = await ApiResponseHandler.handleAsyncResponse<ReportDetailApiResponse>(
    reportsApi.getDetail(reportId)
  );
  return response.data;
}