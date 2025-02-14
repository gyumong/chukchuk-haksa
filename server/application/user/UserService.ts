// application/user/services/UserService.ts
import type { IAuthService } from '@/server/domain/auth/IAuthService';
import type { IUserRepository, StudentInitializationData } from '@/server/domain/user/repositories/IUserRepository';

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService
  ) {}

  // 현재 인증된 유저의 포털 연동 상태를 반환하는 메서드
  async checkUserPortalConnection(): Promise<boolean> {
    const userId = await this.authService.getAuthenticatedUserId();
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found.`);
    }
    return user.isPortalConnected();
  }

  async initializePortalConnection(studentData: StudentInitializationData): Promise<void> {
    const userId = await this.authService.getAuthenticatedUserId();
    const user = await this.userRepository.findById(userId);
    if (user && user.isPortalConnected()) {
      throw new Error('이미 연동된 유저입니다.');
    }
    // 도메인 로직에 따라 상태 변경 (예: user.connectPortal() 호출 가능)
    await this.userRepository.initializePortalConnection(userId, studentData);
  }
}
