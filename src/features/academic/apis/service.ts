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

  // 생성된 타입은 courses.major/liberal/etc 를 필수 배열로 선언하지만, 백엔드가 일부 학기에서
  // 'etc'(기타, PR #202 신규 필드) 등을 생략해 내려준다(런타임 undefined). 이 경우 page 의
  // `courses.etc.length` 접근이 "Cannot read properties of undefined (reading 'length')" 로
  // 터진다. 타입 계약(항상 배열)에 맞춰 누락 필드를 빈 배열로 정규화한다.
  const data = response.data;
  return {
    ...data,
    courses: {
      major: data.courses?.major ?? [],
      liberal: data.courses?.liberal ?? [],
      etc: data.courses?.etc ?? [],
    },
  };
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