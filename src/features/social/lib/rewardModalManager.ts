import { FactionName } from "features/game/types/game";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

export type RewardModalPlayer = {
  farmId: number;
  username?: string;
  clothing?: BumpkinParts;
  experience?: number;
  faction?: FactionName;
};

class RewardModalManager {
  public isOpen = false;
  private isClosing = false;

  private listener?: (player: RewardModalPlayer) => void;

  public open(player: RewardModalPlayer) {
    // Don't open if we're in the process of closing
    if (this.isClosing) {
      return;
    }
    if (this.listener) {
      this.listener(player);
    }
  }

  public setIsOpen(isOpen: boolean) {
    this.isOpen = isOpen;
    if (!isOpen) {
      // Set closing flag when closing, clear it after a short delay
      this.isClosing = true;
      setTimeout(() => {
        this.isClosing = false;
      }, 200);
    } else {
      this.isClosing = false;
    }
  }

  public listen(cb: (player: RewardModalPlayer) => void) {
    this.listener = cb;
  }
}

export const rewardModalManager = new RewardModalManager();
