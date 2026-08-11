/**
 * The four race buttons, shared by the Phaser scene and the React button HUD so
 * the colours + key mappings never drift apart. Order matters: index 0..3 maps
 * to A, S, D, F on the keyboard.
 */
export const RACE_COLORS = [
  { name: "red", key: "A", hex: 0xe04e3a, css: "#e04e3a" },
  { name: "green", key: "S", hex: 0x4caf50, css: "#4caf50" },
  { name: "yellow", key: "D", hex: 0xf2c14e, css: "#f2c14e" },
  { name: "blue", key: "F", hex: 0x4a90d9, css: "#4a90d9" },
] as const;

/**
 * The tiny two-way channel between the React button HUD and the Phaser race
 * scene (shared via the game registry under `"raceControls"`):
 *
 * - **scene → React**: the scene calls `setTarget(colour)` whenever the colour
 *   you need to press changes, so the HUD can highlight that button (or `null`
 *   when the race isn't running).
 * - **React → scene**: a tap/click pushes the colour index onto `queue`; the
 *   scene drains it every frame and hops if it matches the target. Desktop
 *   keyboard (A/S/D/F) is handled directly in the scene, so it skips the queue.
 * - **scene → React (`onFeedback`)**: after the scene resolves a press (from a
 *   key OR a tap) it reports which button was pressed and whether it was right,
 *   so the HUD can animate that button and show a cross on a wrong one.
 */
export interface RaceControls {
  setTarget: (color: number | null) => void;
  queue: number[];
  onFeedback: (color: number, correct: boolean) => void;
}
