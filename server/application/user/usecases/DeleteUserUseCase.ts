// server/application/user/usecases/DeleteUserUseCase.ts
import type { IUserRepository } from '@/server/domain/user/repositories/IUserRepository';

export interface DeleteUserResult {
  isSuccess: boolean;
  error?: string;
}

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<DeleteUserResult> {
    try {
      // 소프트 삭제
      await this.userRepository.delete(userId);
      return { isSuccess: true };
    } catch (error) {
      return { isSuccess: false, error: error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.' };
    }
  }
}
