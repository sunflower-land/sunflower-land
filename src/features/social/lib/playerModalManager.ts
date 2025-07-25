import { FactionName } from "features/game/types/game";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

export type PlayerModalPlayer = {
  farmId: number;
  username?: string;
  clothing?: BumpkinParts;
  experience?: number;
  faction?: FactionName;
};

class PlayerModalManager {
  private listener?: (player: PlayerModalPlayer) => void;

  public open(player: PlayerModalPlayer) {
    if (this.listener) {
      this.listener(player);
    }
  }

  public listen(cb: (player: PlayerModalPlayer) => void) {
    this.listener = cb;
  }
}

export const playerModalManager = new PlayerModalManager();
