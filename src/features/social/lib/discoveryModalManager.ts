import { DiscoveryTab } from "../Discovery";

class DiscoveryModalManager {
  private listener?: (tab: DiscoveryTab) => void;

  public open(tab: DiscoveryTab) {
    if (this.listener) {
      this.listener(tab);
    }
  }

  public listen(cb: (tab: DiscoveryTab) => void) {
    this.listener = cb;
  }
}

export const discoveryModalManager = new DiscoveryModalManager();
