export interface IAuthService {
  getAuthenticatedUserId(): Promise<string>;
}
