import type { BumpkinParts } from "lib/utils/tokenUriBuilder";
import type { GiveawayPhase } from "./phase";

/**
 * The single object shared from React into the Phaser mini-game via the game
 * registry. The scene polls the getters every frame (so it always sees the
 * latest board/phase) and calls `onFinish` when the local player crosses the
 * line. Keeping this a stable object avoids re-creating the Phaser game on every
 * React render.
 */
export interface GiveawayBridge {
  giveawayId: string;
  playerId: number;
  playerClothing: BumpkinParts;

  /** All ranked participant farm IDs (best-first). */
  getParticipants: () => number[];
  /** farmId → username, for the top ranks we know names for. */
  getUsernames: () => Record<number, string>;
  getPhase: () => GiveawayPhase;
  /** Absolute epoch-ms the race clock is anchored to (giveaway startAt). */
  getRaceStartAt: () => number;

  /**
   * Called periodically during the race with the metres covered so far, so the
   * server board stays live. Safe to call repeatedly — only increases are sent.
   */
  onProgress: (metres: number) => void;

  /** Called once, when the 30s race clock is up, with the final metres. */
  onFinish: (metres: number) => void;
}
