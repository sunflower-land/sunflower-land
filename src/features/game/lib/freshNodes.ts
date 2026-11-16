import { OIL_RESERVE_RECOVERY_TIME } from "../events/landExpansion/drillOilReserve";
import { CROPS, type CropName } from "../types/crops";
import {
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
  type PatchFruitName,
} from "../types/fruits";
import type { RockName } from "../types/resources";
import { TREE_RECOVERY_TIME } from "./constants";
import { RESOURCE_RECOVERY_TIME } from "./resourceNodes";

/**
 * Timers for nodes created already READY: placed from the inventory, revealed
 * with new land, upgraded or laid out. Each starts with its full raw base
 * duration as `baseDurationMs`, so it is on the speed-rate model from the
 * moment it exists. Its start is 0, so it reads as ready; boost windows can
 * only bring a finish earlier.
 *
 * The raw base (not the permanent-boosted one a harvest stamps) is what the
 * node would read as with no marker, so nothing about it changes for the player.
 * Mirrors the API's `freshNodes.ts`.
 */
export const freshRockTimer = (rock: RockName) => ({
  minedAt: 0,
  baseDurationMs: RESOURCE_RECOVERY_TIME[rock] * 1000,
});

export const freshTreeTimer = () => ({
  choppedAt: 0,
  baseDurationMs: TREE_RECOVERY_TIME * 1000,
});

export const freshOilTimer = () => ({
  drilledAt: 0,
  baseDurationMs: OIL_RESERVE_RECOVERY_TIME * 1000,
});

export const freshCropTimer = (name: CropName) => ({
  name,
  plantedAt: 0,
  baseDurationMs: CROPS[name].harvestSeconds * 1000,
});

export const freshFruitTimer = (name: PatchFruitName) => ({
  name,
  plantedAt: 0,
  harvestedAt: 0,
  baseDurationMs: PATCH_FRUIT_SEEDS[PATCH_FRUIT[name].seed].plantSeconds * 1000,
});
