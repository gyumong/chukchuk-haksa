import type { PortalData } from '../../../infrastructure/portal/dto/PortalDataType';

export interface IPortalRepository {
  /**
   * 포털 로그인을 수행합니다.
   * @param username 학번
   * @param password 비밀번호
   *  @returns 로그인 성공 여부

   */
  login(username: string, password: string): Promise<boolean>;

  /**
   * 포털에서 사용자 데이터를 가져옵니다.
   * @param username 학번
   * @param password 비밀번호
   * @returns 포탈 데이터
   */
  fetchPortalData(username: string, password: string): Promise<PortalData>;
}
