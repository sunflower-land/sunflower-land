import type { AOEItemName } from "../expansion/placeable/lib/collisionDetection";
import type { CollectibleName } from "../types/craftables";
import type { AOE, GameState } from "../types/game";
import {
  computeReadyAt,
  getCropFertiliserWindows,
  getCropPlotBoostWindows,
} from "./boostWindows";

/**
 * Important: for yield boosts, the gameState.aoe object contains when the boost was last used.
 */
export const canUseYieldBoostAOE = (
  aoe: AOE,
  item: AOEItemName,
  { dx, dy }: { dx: number; dy: number },
  cooldownTime: number,
  createdAt: number,
) => {
  const aoeIdleTime = createdAt - (aoe[item]?.[dx]?.[dy] ?? 0);
  return aoeIdleTime >= cooldownTime;
};

/**
 * Important: for time boosts, the gameState.aoe object contains when the boost is next available.
 */
export const canUseTimeBoostAOE = (
  aoe: AOE,
  item: AOEItemName,
  { dx, dy }: { dx: number; dy: number },
  createdAt: number,
) => {
  const aoeReadyAt = aoe[item]?.[dx]?.[dy] ?? 0;
  return createdAt >= aoeReadyAt;
};

export const setAOELastUsed = (
  aoe: AOE,
  item: AOEItemName,
  { dx, dy }: { dx: number; dy: number },
  createdAt: number,
): void => {
  aoe[item] = aoe[item] ?? {};
  aoe[item][dx] = aoe[item][dx] ?? {};
  aoe[item][dx][dy] = createdAt;
};

export const setAOEAvailableAt = (
  aoe: AOE,
  item: AOEItemName,
  { dx, dy }: { dx: number; dy: number },
  createdAt: number,
  waitTime: number,
): void => {
  aoe[item] = aoe[item] ?? {};
  aoe[item][dx] = aoe[item][dx] ?? {};
  aoe[item][dx][dy] = createdAt + waitTime;
};

/**
 * Re-sync the Basic Scarecrow time-AOE for every growing WINDOWED crop so each
 * cell's stored `availableAt` tracks the crop's live (boosted) ready time. Call
 * after any change to the active boost windows (a boost collectible placed, Power
 * Hour / sunshower started). Without it, a crop that speeds up mid-grow leaves
 * its cell's AOE frozen at the old, later ready time, and a replant in the gap is
 * wrongly denied the Basic Scarecrow boost. Only cells that already hold an AOE
 * entry (the crop was planted with the boost) are touched. Legacy crops (no
 * `baseDurationMs`) are untouched — their ready time doesn't move. Idempotent
 * when the windows are unchanged.
 */
export function refreshBasicScarecrowTimeAOE(game: GameState): void {
  const scarecrow = game.collectibles["Basic Scarecrow"]?.[0];
  if (!scarecrow?.coordinates) return;

  const windows = getCropPlotBoostWindows(game);

  Object.values(game.crops).forEach((plot) => {
    const crop = plot.crop;
    if (
      !crop ||
      crop.baseDurationMs === undefined ||
      plot.x === undefined ||
      plot.y === undefined
    ) {
      return;
    }

    const dx = plot.x - scarecrow.coordinates!.x;
    const dy = plot.y - scarecrow.coordinates!.y;
    if (game.aoe["Basic Scarecrow"]?.[dx]?.[dy] === undefined) return;

    game.aoe["Basic Scarecrow"]![dx]![dy] = computeReadyAt({
      startedAt: crop.plantedAt,
      baseDurationMs: crop.baseDurationMs,
      windows: [...windows, ...getCropFertiliserWindows(plot.fertiliser)],
    });
  });
}

export function isCollectibleOnFarm({
  name,
  game,
}: {
  name: CollectibleName;
  game: GameState;
}) {
  const placedOnFarm =
    game.collectibles[name] &&
    game.collectibles[name]?.some(
      (placed) => (placed.readyAt ?? 0) <= Date.now() && placed.coordinates,
    );

  return placedOnFarm;
}
