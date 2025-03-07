export class PortalConnection {
  private constructor(
    private readonly connected: boolean,
    private readonly connectedAt: Date | null,
    private readonly lastSyncedAt: Date | null
  ) {}

  static create(): PortalConnection {
    return new PortalConnection(false, null, null);
  }

  static reconnect(): PortalConnection {
    return new PortalConnection(true, new Date(), null);
  }

  static reconstitute(connected: boolean, connectedAt: Date | null, lastSyncedAt: Date | null): PortalConnection {
    return new PortalConnection(connected, connectedAt, lastSyncedAt);
  }

  connect(): PortalConnection {
    if (this.connected) {
      throw new PortalConnectionError('이미 포털과 연동된 상태입니다.');
    }
    return new PortalConnection(true, new Date(), null);
  }

  disconnect(): PortalConnection {
    if (!this.connected) {
      throw new PortalConnectionError('포털과 연동되지 않은 상태입니다.');
    }
    return new PortalConnection(false, null, null);
  }

  sync(): PortalConnection {
    if (!this.connected) {
      throw new PortalConnectionError('포털과 연동되지 않은 상태입니다.');
    }
    return new PortalConnection(true, this.connectedAt, new Date());
  }

  isConnected(): boolean {
    return this.connected;
  }

  getConnectedAt(): Date | null {
    return this.connectedAt;
  }

  getLastSyncedAt(): Date | null {
    return this.lastSyncedAt;
  }
}

export class PortalConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PortalConnectionError';
  }
}
