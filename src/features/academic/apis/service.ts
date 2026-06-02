import { academicRecordApi, semesterRecordApi, graduationApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import type {
  AcademicRecordApiResponse,
  StudentSemesterListApiResponse,
  AcademicSummaryApiResponse,
  SemesterGradesApiResponse,
  GraduationProgressApiResponse,
  GraduationProgressResponse,
  LanguageCertRequirementApiResponse,
  LanguageCertRequirementResponse
} from '@/shared/api/data-contracts';
import type { AcademicRecordData, AcademicSummary, SemesterGrade } from '../types/graduation';

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
 * 졸업 진도 응답 전체를 가져온다.
 * 영역별 이수현황(graduationProgress) 외에 외국어 인증 충족 여부(languageCertFulfilled)·
 * 포털 새로고침 필요 여부(languageCertNeedsRefresh) 등 메타데이터를 포함한다.
 * 영역 배열만 필요한 소비부는 useGraduationProgressQuery 의 select 로 추출한다.
 */
export async function fetchGraduationProgressResponse(): Promise<GraduationProgressResponse> {
  const response = await ApiResponseHandler.handleAsyncResponse<GraduationProgressApiResponse>(
    graduationApi.getGraduationProgress()
  );

  return response.data;
}

/**
 * 외국어 인증 기준(학과·입학년도별 시험 통과 기준)을 가져온다.
 * 미매핑 학과도 200 으로 내려오며 matchStatus='UNMAPPED' 로 구분된다.
 */
export async function fetchLanguageCertRequirement(): Promise<LanguageCertRequirementResponse> {
  const response = await ApiResponseHandler.handleAsyncResponse<LanguageCertRequirementApiResponse>(
    graduationApi.getLanguageCertRequirement()
  );

  return response.data;
}