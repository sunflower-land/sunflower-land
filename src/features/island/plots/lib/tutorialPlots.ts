import { isReadyToHarvest } from "features/game/events/landExpansion/harvest";
import { CROPS } from "features/game/types/crops";
import type { GameState } from "features/game/types/game";
import { getKeys } from "lib/object";

/** The first expansion reveals a 3 x 3 grid of preloaded Sunflowers. */
export const TUTORIAL_PLOT_COUNT = 9;

/** The second expansion reveals a 4 x 2 block of preloaded Rhubarb. */
export const TUTORIAL_RHUBARB_COUNT = 8;

/**
 * Placed plot ids in the order the tutorial arrow walks them: the bottom row
 * right to left, the row above left to right, and so on, so every step lands
 * on a neighbouring plot and a 3 x 3 grid ends top left. Working upwards keeps
 * the arrow, which hangs off a plot's bottom right corner, over plots the
 * player has already dealt with.
 *
 * Ordered by position, never by id - plot ids are random strings.
 */
export function getSnakeOrder(crops: GameState["crops"]): string[] {
  const placed = getKeys(crops).filter(
    (id) => crops[id].x !== undefined && crops[id].y !== undefined,
  );

  // Bottom row first: a lower y is further down the map.
  const rows = [...new Set(placed.map((id) => crops[id].y as number))].sort(
    (a, b) => a - b,
  );

  return rows.flatMap((y, rowIndex) => {
    const rightToLeft = placed
      .filter((id) => crops[id].y === y)
      .sort((a, b) => (crops[b].x as number) - (crops[a].x as number));

    return rowIndex % 2 === 0 ? rightToLeft : rightToLeft.reverse();
  });
}

export function getTotalCropsHarvested(game: GameState): number {
  return getKeys(CROPS).reduce(
    (total, crop) => total + (game.farmActivity?.[`${crop} Harvested`] ?? 0),
    0,
  );
}

/**
 * Whether the player is still working through their first Rhubarb. Food is the
 * only source of experience and the Rhubarb is what the first meal is cooked
 * from, so a Bumpkin with any experience is long past this step - which keeps
 * the walk away from older accounts that never left the tutorial island.
 */
export function isHarvestingFirstRhubarb(game: GameState): boolean {
  return (
    game.island.type === "basic" &&
    (game.bumpkin.experience ?? 0) === 0 &&
    (game.farmActivity?.["Rhubarb Harvested"] ?? 0) < TUTORIAL_RHUBARB_COUNT
  );
}

/**
 * The one plot the tutorial arrow points at while a new player harvests their
 * first crops: the earliest plot in the snake that is ready to harvest. Derived
 * from the farm, not from stored progress, so it survives a reload and copes
 * with plots harvested out of order.
 */
export function getTutorialHarvestPlot({
  game,
  now,
}: {
  game: GameState;
  now: number;
}): string | undefined {
  if (game.island.type !== "basic") return undefined;

  const isReady = (id: string) => {
    const { crop, fertiliser } = game.crops[id];

    return (
      !!crop && isReadyToHarvest(now, crop, CROPS[crop.name], game, fertiliser)
    );
  };

  // First pass: every crop on the farm is part of the walk.
  if (getTotalCropsHarvested(game) < TUTORIAL_PLOT_COUNT) {
    return getSnakeOrder(game.crops).find(isReady);
  }

  // Second pass: only the Rhubarb the next expansion reveals. By now the player
  // is replanting Sunflowers on their own, so those are left alone.
  //
  // The order is still taken over every plot, not just the ones holding
  // Rhubarb: a harvested plot loses its crop, so ordering a shrinking subset
  // would renumber the rows mid-walk and flip the direction of the last row.
  if (isHarvestingFirstRhubarb(game)) {
    return getSnakeOrder(game.crops).find(
      (id) => game.crops[id].crop?.name === "Rhubarb" && isReady(id),
    );
  }

  return undefined;
}

export function getTotalCropsPlanted(game: GameState): number {
  return getKeys(CROPS).reduce(
    (total, crop) => total + (game.farmActivity?.[`${crop} Planted`] ?? 0),
    0,
  );
}

/**
 * The one plot the tutorial arrow points at while a new player plants their
 * first seeds: the earliest empty plot in the snake, for as long as they are
 * holding crop seeds. Harvesting comes first - while a harvest arrow is due
 * there is no plant arrow, so only one arrow is ever on the farm.
 */
export function getTutorialPlantPlot({
  game,
  now,
}: {
  game: GameState;
  now: number;
}): string | undefined {
  if (game.island.type !== "basic") return undefined;
  if (getTotalCropsPlanted(game) >= TUTORIAL_PLOT_COUNT) return undefined;
  if (getTutorialHarvestPlot({ game, now })) return undefined;

  const hasSeeds = getKeys(CROPS).some((crop) =>
    game.inventory[`${crop} Seed`]?.greaterThan(0),
  );
  if (!hasSeeds) return undefined;

  return getSnakeOrder(game.crops).find((id) => !game.crops[id].crop);
}
