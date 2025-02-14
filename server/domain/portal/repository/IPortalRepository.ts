import { PortalData } from '../../student/dto/PortalData';

export interface IPortalRepository {
  login(username: string, password: string): Promise<boolean>;
  fetchPortalData(username: string, password: string): Promise<PortalData>;
}
