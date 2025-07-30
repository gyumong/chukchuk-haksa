import { academicRecordApi, semesterRecordApi, graduationApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import type { 
  AcademicRecordApiResponse, 
  StudentSemesterListApiResponse,
  AcademicSummaryApiResponse,
  SemesterGradesApiResponse,
  GraduationProgressApiResponse
} from '@/shared/api/data-contracts';
import type { AcademicRecordData, AcademicSummary, SemesterGrade, AreaProgress } from '../types/graduation';

/**
 * 학기별 성적 및 수강 과목 정보를 API로부터 가져온다.
 */
export async function fetchAcademicRecord(year: number, semester: number): Promise<AcademicRecordData> {
  const response = await ApiResponseHandler.handleAsyncResponse<AcademicRecordApiResponse>(
    academicRecordApi.getAcademicRecord({ year, semester })
  );
  return response.data;
}

/**
 * 사용자의 모든 학기 정보를 API로부터 가져온다.
 */
export async function fetchSemesterList() {
  const response = await ApiResponseHandler.handleAsyncResponse<StudentSemesterListApiResponse>(
    semesterRecordApi.getSemesterRecord()
  );
  return response.data;
}

/**
 * 학업 요약 정보를 API로부터 가져온다.
 */
export async function fetchAcademicSummary(): Promise<AcademicSummary> {
  const response = await ApiResponseHandler.handleAsyncResponse<AcademicSummaryApiResponse>(
    academicRecordApi.getAcademicSummary()
  );
  return response.data;
}

/**
 * 학기별 성적 정보를 API로부터 가져온다.
 */
export async function fetchSemesterGrades(): Promise<SemesterGrade[]> {
  const response = await ApiResponseHandler.handleAsyncResponse<SemesterGradesApiResponse>(
    semesterRecordApi.getSemesterGrades()
  );
  return response.data;
}

/**
 * 졸업 진도 정보를 API로부터 가져온다. (서버 스키마 그대로 사용)
 */
export async function fetchGraduationProgress(): Promise<AreaProgress[]> {
  const response = await ApiResponseHandler.handleAsyncResponse<GraduationProgressApiResponse>(
    graduationApi.getGraduationProgress()
  );
  
  // 서버 응답을 그대로 반환
  return response.data.graduationProgress;
}