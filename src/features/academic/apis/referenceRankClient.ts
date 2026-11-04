import { createApiClient } from '@/shared/api/client';
import type { ErrorResponseWrapper } from '@/shared/api/data-contracts';
import { HttpClient } from '@/shared/api/http-client';
import type { RequestParams } from '@/shared/api/http-client';
import type { ReferenceRank } from '../types/referenceRank';

interface ReferenceRankEnvelope {
  success: boolean;
  data: ReferenceRank;
  message: string;
}

/**
 * 생성 클라이언트에 엔드포인트가 들어오기 전까지 쓰는 임시 클라이언트.
 * createApiClient 를 거쳐 기존 API 와 같은 에러 변환·보고 경로를 탄다.
 * `yarn api:update` 로 생성되면 이 파일을 지우고 academicRecordApi 로 교체한다.
 */
class ReferenceRankClient extends HttpClient {
  getReferenceRank = (query: { year: number; semester: number }, params: RequestParams = {}) =>
    this.request<ReferenceRankEnvelope, ErrorResponseWrapper>({
      path: '/api/academic-records/reference-rank',
      method: 'GET',
      query,
      secure: true,
      format: 'json',
      ...params,
    });
}

export const referenceRankApi = createApiClient(ReferenceRankClient);
