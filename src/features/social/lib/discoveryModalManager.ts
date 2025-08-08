class DiscoveryModalManager {
  private listener?: () => void;

  public open() {
    if (this.listener) {
      this.listener();
    }
  }

  public listen(cb: () => void) {
    this.listener = cb;
  }
}

export const discoveryModalManager = new DiscoveryModalManager();
