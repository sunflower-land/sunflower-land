import type { PopPhase } from "./pop";

/** One line of the end-of-round pop reveal. */
export type PopVictim = {
  name: string;
  waters: number;
  isSelf: boolean;
};

/** What the scene publishes to the HUD when a round resolves. */
export type PopReveal = {
  /** 1-based round this reveal is for. */
  round: number;
  /** Who popped, biggest waterer first. */
  victims: PopVictim[];
  /** Did the local player's pumpkin survive THIS round? */
  survived: boolean;
  /** The local player's waters that round — banked if they survived, lost if
   * they popped. */
  myWaters: number;
  /** Their total banked score after this round. */
  banked: number;
  /** The lowest water count that popped — water this much and you pop. */
  cap: number;
  /** Waters the last surviving player got away with — the safe line. */
  safeLine: number;
  /** Bumped every reveal so the HUD re-animates. */
  nonce: number;
};

/**
 * The channel between the Pumpkin Pop HUD (React) and the scene.
 *
 * The button bumps `taps`, which the scene drains each frame; everything else
 * is written BY the scene and read by the HUD, so the round clock, your water
 * count and the pop reveal are all driven off the scene's single game clock
 * rather than a second one in React.
 */
export interface PopControls {
  /** Pending taps, drained by the scene. */
  taps: number;
  /** Register a tap (called from the water button). */
  water: () => void;

  // --- scene → HUD ---
  /** 1-based round number. */
  round: number;
  phase: PopPhase;
  /** ms left in the current phase. */
  msLeft: number;
  /** The local player's waters this round — at risk until the reveal. */
  myWaters: number;
  /**
   * Their BANKED score: the sum of every round's waters where their pumpkin
   * survived. A popped round banks zero — the round's waters are lost, but
   * nothing already banked is ever taken away.
   */
  banked: number;
  /** The last resolved round, for the reveal overlay. */
  reveal: PopReveal | null;
}
