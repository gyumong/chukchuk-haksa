import type { ErrorResponseWrapper } from './data-contracts';
import type { HttpResponse } from './http-client';

export class ApiError extends Error {
  override name = 'ApiError';
  status?: number;
  data?: unknown;

  constructor(
    message: string,
    public response?: HttpResponse<unknown, ErrorResponseWrapper>,
    options?: { cause?: unknown } // Node.js 16+/ES2022 cause 지원
  ) {
    super(message);
    if (options?.cause) {
      // ES2022 `Error.cause` 지원
      (this as any).cause = options.cause;
    }

    // 편의용 필드
    this.status = response?.status;
    this.data = response?.data;
  }

  /** 에러 응답 메시지를 추출해서 보여줍니다. */
  get errorMessage(): string | undefined {
    const message = (this.response?.data as any)?.message;
    return typeof message === 'string' ? message : undefined;
  }

  toString(): string {
    return `[ApiError ${this.status}] ${this.message}`;
  }
}
