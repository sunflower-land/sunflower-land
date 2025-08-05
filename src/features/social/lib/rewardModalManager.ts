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

  private listener?: (player: RewardModalPlayer) => void;

  public open(player: RewardModalPlayer) {
    if (this.listener) {
      this.listener(player);
    }
  }

  public setIsOpen(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  public listen(cb: (player: RewardModalPlayer) => void) {
    this.listener = cb;
  }
}

export const rewardModalManager = new RewardModalManager();
