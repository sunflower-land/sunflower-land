import { BumpkinParts } from "lib/utils/tokenUriBuilder";

export type WaveModalData = {
  wavedAtClothing: BumpkinParts;
};

class WaveModalManager {
  public isOpen = false;

  private listener?: (data: WaveModalData) => void;

  public open(data: WaveModalData) {
    if (this.listener) {
      this.listener(data);
    }
  }

  public setIsOpen(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  public listen(cb: (data: WaveModalData) => void) {
    this.listener = cb;
  }
}

export const waveModalManager = new WaveModalManager();
