import { describe, it, expect } from 'vitest';
import { unwrapData } from '../portalLinkService';

describe('unwrapData', () => {
  it('SpringBoot 래퍼({ success, data, message }) 응답에서 data 를 추출한다', () => {
    // 실제 백엔드(202 Accepted)가 내려주는 래퍼 형태
    const wrapped = {
      success: true,
      data: {
        job_id: '528f6966-d4ca-45ac-8fd6-c41f9f014bb8',
        polling_endpoint: '/portal/link/jobs/528f6966-d4ca-45ac-8fd6-c41f9f014bb8',
        status: 'accepted',
      },
      message: '요청 성공',
    };

    expect(unwrapData(wrapped)).toEqual({
      job_id: '528f6966-d4ca-45ac-8fd6-c41f9f014bb8',
      polling_endpoint: '/portal/link/jobs/528f6966-d4ca-45ac-8fd6-c41f9f014bb8',
      status: 'accepted',
    });
  });

  it('래퍼의 job_id 를 flat 으로 노출해 호출부가 .job_id 로 읽을 수 있다', () => {
    const wrapped = { success: true, data: { job_id: 'abc' }, message: '요청 성공' };
    expect(unwrapData(wrapped).job_id).toBe('abc');
  });

  it('이미 flat 한 응답은 그대로 반환한다 (백엔드가 추후 flat 전환해도 동작)', () => {
    const flat = { job_id: 'abc', status: 'accepted' };
    expect(unwrapData(flat)).toBe(flat);
  });

  it('success/data 키가 없는 객체는 래퍼로 오인하지 않는다', () => {
    const jobStatus = { status: 'succeeded', error_code: null };
    expect(unwrapData(jobStatus)).toBe(jobStatus);
  });

  it('null 을 안전하게 통과시킨다', () => {
    expect(unwrapData(null as unknown as { status: string })).toBeNull();
  });
});
