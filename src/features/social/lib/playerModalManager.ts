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
  private readonly listeners = new Set<(player: PlayerModalPlayer) => void>();

  public open(player: PlayerModalPlayer) {
    this.listeners.forEach((cb) => {
      cb(player);
    });
  }

  /** Subscribe to open events; call the returned function on unmount. */
  public listen(cb: (player: PlayerModalPlayer) => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }
}

export const playerModalManager = new PlayerModalManager();
