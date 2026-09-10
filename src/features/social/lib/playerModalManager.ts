import type { FactionName } from "features/game/types/game";
import type { BumpkinParts } from "lib/utils/tokenUriBuilder";

export type PlayerModalPlayer = {
  farmId: number;
  username?: string;
  clothing?: BumpkinParts;
  experience?: number;
  /**
   * Ascension band — needed to read `experience` as a level. Only set when the modal
   * is opened from a local context; remote MMO players don't sync it yet, so consumers
   * must default to 0.
   */
  ascensionLevel?: number;
  faction?: FactionName;
};

/**
 * How long after the modal closes it still swallows Escape. Only needs to
 * outlast the keypress that closed it - see `isBlockingEscape`.
 */
const ESCAPE_GRACE_MS = 150;

class PlayerModalManager {
  private readonly listeners = new Set<(player: PlayerModalPlayer) => void>();
  private isOpen = false;
  private closedAt = 0;

  public open(player: PlayerModalPlayer) {
    this.isOpen = true;
    this.listeners.forEach((cb) => {
      cb(player);
    });
  }

  /** Called by the modal as it closes. */
  public close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.closedAt = Date.now();
  }

  /**
   * Whether a full screen page underneath should ignore an Escape keypress.
   *
   * Those pages close themselves from their own document listener, and the
   * modal's handler can run either side of it depending on the order the two
   * were registered - so checking "is the modal open" alone is a race. The
   * grace window covers the case where the modal got to the same keypress
   * first and has already closed by the time the page looks.
   */
  public isBlockingEscape(): boolean {
    return this.isOpen || Date.now() - this.closedAt < ESCAPE_GRACE_MS;
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
