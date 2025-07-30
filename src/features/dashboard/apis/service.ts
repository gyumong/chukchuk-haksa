import { academicRecordApi, studentApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import { StudentProfileSchema } from './schema';

/**
 * 학생 프로필 정보를 API로부터 가져오고, 도메인 모델로 매핑한다.
 */
export async function fetchStudentProfile() {
  const response = await ApiResponseHandler.handleAsyncResponse(
    studentApi.getProfile()
  );
  const parsed = StudentProfileSchema.parse(response.data);
  return parsed;
}

/**
 * 학생의 학업 요약 정보를 API로부터 가져온다.
 */
export async function fetchAcademicSummary() {
  const response = await ApiResponseHandler.handleAsyncResponse(
    academicRecordApi.getAcademicSummary()
  );
  return response;
}
