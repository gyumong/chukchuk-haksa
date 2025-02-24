// server/infrastructure/portal/client/PortalClient.ts
import type { RawPortalData } from '../dto/PortalRowDataType';

export class PortalClient {
  private readonly baseUrl = process.env.AWS_URL!;

  async login(username: string, password: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '로그인 중 오류가 발생했습니다.');
    }

    return response.ok;
  }

  async scrapeAll(username: string, password: string): Promise<RawPortalData> {
    const response = await fetch(`${this.baseUrl}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('아이디나 비밀번호가 일치하지 않습니다.\n학교 홈페이지에서 확인해주세요.', {
          cause: response.status,
        });
      }
      if (response.status === 423) {
        throw new Error('계정이 잠겼습니다. 포털사이트로 돌아가서 학번/사번 찾기 및 비밀번호 재발급을 진행해주세요', {
          cause: response.status,
        });
      }
      throw new Error('크롤링 중 오류가 발생했습니다.');
    }

    return response.json();
  }
}
