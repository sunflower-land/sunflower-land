/**
 * The channel between the Fishing cast button (React) and the scene. A tap bumps
 * `casts`; the scene drains it each frame and casts if the line is free. Desktop
 * SPACE is handled inside the scene, so it skips this.
 *
 * The scene reports each resolved cast back through `lastResult` (caught a fish
 * for some XP, or missed), which the HUD reads to flash feedback. `nonce` bumps
 * every cast so the HUD re-fires even on a repeat outcome.
 */
export interface FishingControls {
  /** Pending casts, drained by the scene. */
  casts: number;
  /** Register a cast (called from the button HUD). */
  cast: () => void;
  /** scene → HUD: the last resolved cast. */
  lastResult: {
    /** How many fish that cast caught (0 = a miss). */
    count: number;
    /** Total XP won across all fish caught this cast (0 on a miss). */
    xp: number;
    nonce: number;
  } | null;
  /** scene → HUD: true while a cast is mid-flight (button disabled). */
  casting: boolean;
}
