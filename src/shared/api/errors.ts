import { getUserMessage } from '../user-messages';

export class ApiError extends Error {
  code: string;
  status: number;
  appCode: string;

  constructor(message: string, code: string = '', status: number = 0, appCode: string = '') {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.appCode = appCode;
  }

  // 사용자에게 보여줄 수 있는 메시지 제공
  get userMessage(): string {
    return getUserMessage(this.status, this.appCode, this.message);
  }
}
