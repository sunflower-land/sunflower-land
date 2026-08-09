import type { JumpQuality } from "./jumpScoring";

/**
 * The channel between the Jumper tap button (React) and the scene. A tap bumps
 * `taps`; the scene drains it each frame (jumping if it's landed). Desktop SPACE
 * is handled inside the scene, so it skips this.
 */
export interface JumpControls {
  /** Pending taps, drained by the scene. */
  taps: number;
  /** Register a tap (called from the button HUD). */
  tap: () => void;
  /** Marker angle around the ring (radians) — written by the scene each frame,
   * read by the button HUD to spin its ring. */
  theta: number;
  /** scene → HUD: the last graded tap, for the tick + feedback animation.
   * `nonce` bumps every tap so the HUD re-fires even on a repeat. */
  lastTap: { angle: number; quality: JumpQuality; nonce: number } | null;
}
