export class PortalConnection {
  private constructor(
    private readonly connected: boolean,
    private readonly connectedAt: Date | null
  ) {}

  static create(): PortalConnection {
    return new PortalConnection(false, null);
  }

  static reconnect(): PortalConnection {
    return new PortalConnection(true, new Date());
  }

  static reconstitute(connected: boolean, connectedAt: Date | null): PortalConnection {
    return new PortalConnection(connected, connectedAt);
  }

  connect(): PortalConnection {
    if (this.connected) {
      throw new PortalConnectionError('이미 포털과 연동된 상태입니다.');
    }
    return new PortalConnection(true, new Date());
  }

  disconnect(): PortalConnection {
    if (!this.connected) {
      throw new PortalConnectionError('포털과 연동되지 않은 상태입니다.');
    }
    return new PortalConnection(false, null);
  }

  sync(): PortalConnection {
    if (!this.connected) {
      throw new PortalConnectionError('포털과 연동되지 않은 상태입니다.');
    }
    return new PortalConnection(true, this.connectedAt);
  }

  isConnected(): boolean {
    return this.connected;
  }

  getConnectedAt(): Date | null {
    return this.connectedAt;
  }
}

export class PortalConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PortalConnectionError';
  }
}
