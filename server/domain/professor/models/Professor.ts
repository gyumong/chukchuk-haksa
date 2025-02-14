// server/domain/professor/models/Professor.ts
import { Id } from '@/server/domain/shared/models/Id';

export class Professor {
  private constructor(
    private readonly id: Id<number>,
    private readonly professorName: string,
    private readonly professorCode: string | null,
    private readonly departmentId: number | null
  ) {}

  static create(params: { professorName: string; professorCode?: string; departmentId?: number }): Professor {
    if (!params.professorName) {
      throw new Error('Professor name is required');
    }

    return new Professor(
      Id.create<number>(),
      params.professorName,
      params.professorCode ?? null,
      params.departmentId ?? null
    );
  }

  static reconstitute(params: {
    id: number;
    professorName: string;
    professorCode?: string;
    departmentId?: number;
  }): Professor {
    return new Professor(
      Id.of(params.id),
      params.professorName,
      params.professorCode ?? null,
      params.departmentId ?? null
    );
  }

  getId(): Id<number> {
    return this.id;
  }

  getProfessorName(): string {
    return this.professorName;
  }

  getProfessorCode(): string | null {
    return this.professorCode;
  }

  getDepartmentId(): number | null {
    return this.departmentId;
  }
}
