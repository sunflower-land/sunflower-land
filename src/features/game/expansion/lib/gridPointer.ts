/**
 * Client-pixel -> grid-cell conversion for landscaping drag interactions.
 *
 * The DOM farm derives this from #genesisBlock's bounding rect; the Phaser
 * farm has no such element, so the engine registers a camera-based converter
 * here and DOM callers (LandscapingQuickPanel) prefer it when present.
 */

export type ClientToGrid = (
  clientX: number,
  clientY: number,
) => { gridX: number; gridY: number };

let override: ClientToGrid | undefined;

export function setClientToGridOverride(fn: ClientToGrid | undefined) {
  override = fn;
}

export function getClientToGridOverride(): ClientToGrid | undefined {
  return override;
}
