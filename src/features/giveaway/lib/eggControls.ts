/**
 * The channel between the Egg Catch button HUD (React) and the scene: React
 * writes the held direction, the scene reads it every frame. Desktop arrow /
 * A-D keys are handled inside the scene, so they don't go through here.
 */
export interface EggControls {
  /** Held horizontal direction: -1 left, 0 none, 1 right (read by the scene). */
  move: number;
  /** Set the held direction (called from the button HUD). */
  set: (dir: number) => void;
}
