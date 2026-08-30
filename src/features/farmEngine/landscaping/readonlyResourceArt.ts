import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import type { GameState, TemperateSeasonName } from "features/game/types/game";
import type { ResourceName } from "features/game/types/resources";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { getCurrentBiome } from "features/island/biomes/biomes";
import {
  TREE_SIZE_VARIANTS,
  TREE_VARIANTS,
} from "features/island/lib/alternateArt";
import type { TreeName } from "features/game/types/resources";

/**
 * Landscaping ghost art for RESOURCES, ported from the DOM's
 * READONLY_RESOURCE_COMPONENTS [island/resources/Resource.tsx] so the
 * placement preview shows the real sprite at the real offsets instead of an
 * ITEM_DETAILS approximation.
 *
 * Offsets are source px inside the placeable's tile box; `top` measures down
 * from the box top, `bottom` up from the box bottom (the DOM uses whichever
 * the component happened to use, so both are supported).
 *
 * Regenerate the geometry with
 * `node docs/phaser-farm-migration/scripts/extract-readonly-resources.js`.
 */

export type ResourceGhostArt = {
  texture: string;
  width: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};

const SQUARE = 16;
const TREE_TILE_WIDTH = RESOURCE_DIMENSIONS.Tree.width * SQUARE;
const TREE_TILE_HEIGHT = RESOURCE_DIMENSIONS.Tree.height * SQUARE;

/** Trees size per biome/season, so their geometry is computed, not tabled. */
const TREE_NAMES: TreeName[] = ["Tree", "Ancient Tree", "Sacred Tree"];

const STATIC: Partial<Record<ResourceName, () => ResourceGhostArt>> = {
  "Crop Plot": () => ({
    texture: SUNNYSIDE.resource.plot,
    width: 20,
    bottom: 4,
    right: 2,
  }),
  "Gold Rock": () => ({
    texture: ITEM_DETAILS["Gold Rock"].image,
    width: 14,
    top: 3,
    left: 1,
  }),
  "Iron Rock": () => ({
    texture: ITEM_DETAILS["Iron Rock"].image,
    width: 14,
    top: 3,
    left: 1,
  }),
  "Stone Rock": () => ({
    texture: ITEM_DETAILS["Stone Rock"].image,
    width: 14,
    top: 3,
    left: 1,
  }),
  "Fused Stone Rock": () => ({
    texture: ITEM_DETAILS["Fused Stone Rock"].image,
    width: 15,
    top: 1,
    left: 0.238,
  }),
  "Reinforced Stone Rock": () => ({
    texture: ITEM_DETAILS["Reinforced Stone Rock"].image,
    width: 15,
    top: -0.523,
    left: 0.62,
  }),
  "Refined Iron Rock": () => ({
    texture: ITEM_DETAILS["Refined Iron Rock"].image,
    width: 15,
    top: 3,
    left: 1,
  }),
  "Tempered Iron Rock": () => ({
    texture: ITEM_DETAILS["Tempered Iron Rock"].image,
    width: 15,
    top: 1,
    left: 1,
  }),
  "Pure Gold Rock": () => ({
    texture: ITEM_DETAILS["Pure Gold Rock"].image,
    width: 15,
    top: 3,
    left: 1,
  }),
  "Prime Gold Rock": () => ({
    texture: ITEM_DETAILS["Prime Gold Rock"].image,
    width: 15,
    top: 1,
    left: 1,
  }),
  "Crimstone Rock": () => ({
    texture: ITEM_DETAILS["Crimstone Rock"].image,
    width: 24,
    top: 3,
    left: 4,
  }),
  "Sunstone Rock": () => ({
    texture: ITEM_DETAILS["Sunstone Rock"].image,
    width: 24,
    bottom: 1,
    left: 4,
  }),
  "Ascension Crystal": () => ({
    texture: ITEM_DETAILS["Ascension Crystal"].image,
    width: 27,
    bottom: 1,
    left: 2,
  }),
  "Oil Reserve": () => ({
    texture: ITEM_DETAILS["Oil Reserve"].image,
    width: 30,
  }),
  "Fruit Patch": () => ({
    texture: ITEM_DETAILS["Fruit Patch"].image,
    width: 30,
    top: 2,
    left: 1,
  }),
  Boulder: () => ({
    texture: ITEM_DETAILS["Boulder"].image,
    width: 32,
    bottom: -4,
  }),
  Beehive: () => ({ texture: ITEM_DETAILS["Beehive"].image, width: 16 }),
  "Flower Bed": () => ({
    texture: ITEM_DETAILS["Flower Bed"].image,
    width: 48,
  }),
  "Lava Pit": () => ({ texture: ITEM_DETAILS["Lava Pit"].image, width: 32 }),
};

/** The DOM's readonly ghost art for a resource, if it has one. */
export function readonlyResourceArt(
  name: string,
  game: GameState,
  season: TemperateSeasonName,
): ResourceGhostArt | undefined {
  if (TREE_NAMES.includes(name as TreeName)) {
    const biome = getCurrentBiome(game.island);
    const tree = name as TreeName;
    const { width, height } = TREE_SIZE_VARIANTS(biome, tree);
    // [Resource.tsx treeStyle] centre the trunk, drop the base on the tile.
    return {
      texture: TREE_VARIANTS(biome, season, tree),
      width,
      bottom: height - TREE_TILE_HEIGHT,
      left: (TREE_TILE_WIDTH - width) / 2,
    };
  }
  return STATIC[name as ResourceName]?.();
}
