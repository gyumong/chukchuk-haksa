import { Id } from '../../shared/models/Id';
import { PortalConnection } from './PorrtalConnection';

export class User {
  private constructor(
    private readonly id: Id<string>,
    private portalConnection: PortalConnection
  ) {}

  static create(): User {
    return new User(Id.create<string>(), PortalConnection.create());
  }

  static reconstitute(id: string, connected: boolean, connectedAt: Date | null, lastSyncedAt: Date | null): User {
    return new User(Id.of(id), PortalConnection.reconstitute(connected, connectedAt, lastSyncedAt));
  }

  connectPortal(): void {
    this.portalConnection = this.portalConnection.connect();
  }

  disconnectPortal(): void {
    this.portalConnection = this.portalConnection.disconnect();
  }

  syncPortal(): void {
    this.portalConnection = this.portalConnection.sync();
  }

  // Getters
  getId(): Id<string> {
    return this.id;
  }

  getPortalConnection(): PortalConnection {
    return this.portalConnection;
  }

  isPortalConnected(): boolean {
    return this.portalConnection.isConnected();
  }
}
