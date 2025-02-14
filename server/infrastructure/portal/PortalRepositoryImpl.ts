import type { IPortalRepository } from '@/server/domain/portal/repository/IPortalRepository';
import type { PortalData } from '@/server/infrastructure/portal/dto/PortalDataType';
import { PortalClient } from './client/PortalClient';
import { PortalDataMapper } from './mapper/PortalDataMapper';

export class PortalRepositoryImpl implements IPortalRepository {
  private readonly portalClient = new PortalClient();

  async login(username: string, password: string): Promise<boolean> {
    return this.portalClient.login(username, password);
  }

  async fetchPortalData(username: string, password: string): Promise<PortalData> {
    const rawData = await this.portalClient.scrapeAll(username, password);
    return PortalDataMapper.toPortalData(rawData);
  }
}
