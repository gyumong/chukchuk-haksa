export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string = '', status: number = 0) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }

  // 사용자에게 보여줄 수 있는 메시지 제공
  get userMessage(): string {
    return this.message;
  }
}
