import { Id } from '../../shared/models/Id';

export class Department {
  private constructor(
    private readonly id: Id<number> | null,
    private readonly code: string,
    private readonly name: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.code || this.code.trim().length === 0) {
      throw new DepartmentValidationError('학과 코드는 필수입니다.');
    }
    if (!this.name || this.name.trim().length === 0) {
      throw new DepartmentValidationError('학과명은 필수입니다.');
    }
  }

  static create(code: string, name: string): Department {
    return new Department(null, code, name); // 새로 생성 시 id는 null
  }

  static reconstitute(id: number, code: string, name: string): Department {
    return new Department(Id.of(id), code, name);
  }

  getId(): Id<number> | null {
    return this.id;
  }

  getCode(): string {
    return this.code;
  }

  getName(): string {
    return this.name;
  }
}

export class DepartmentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DepartmentValidationError';
  }
}
