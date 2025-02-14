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
      const error = await response.json();
      throw new Error(error.message || '크롤링 중 오류가 발생했습니다.');
    }

    return response.json();
  }
}
