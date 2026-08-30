import type { GameState } from "../types/game";
import type { BuildingName } from "../types/buildings";
import { BUILDINGS_DIMENSIONS } from "../types/buildings";
import type { CollectibleName } from "../types/craftables";
import { COLLECTIBLES_DIMENSIONS } from "../types/craftables";
import { RESOURCE_DIMENSIONS } from "../types/resources";
import { getKeys } from "lib/object";

/**
 * Dev-harness farm layouts (ART_MODE only), selected by the DevPanel's Layout
 * dropdown. Each preset bundles its own land size and repositions the fixture
 * so nothing overlaps — items flow left to right in bands with a one-tile gap
 * between neighbours and an empty row between sections.
 *
 * Presets REPOSITION the fixture's existing entries rather than fabricating
 * new ones, so every item keeps the state it was authored with (growing crops,
 * the sick cow, spent weather shields, expiring boosts...).
 */

export type LandLayout = "basic" | "everything" | "stress";

/** Land size each preset implies, so one dropdown covers both. */
export const LAYOUT_EXPANSIONS: Record<LandLayout, string> = {
  basic: "9",
  everything: "42",
  stress: "42",
};

/** How many crops/trees a "basic" starter farm keeps. */
const BASIC_CROPS = 8;
const BASIC_TREES = 3;

type Placement = { x: number; y: number };

/**
 * Lays entries out along a row, advancing by each item's own width plus a
 * one-tile gap, wrapping to a lower row when the band runs out of width.
 */
class Band {
  private cursorX: number;
  private rowY: number;
  private rowHeight = 0;

  constructor(
    private readonly startX: number,
    private readonly maxX: number,
    startY: number,
    /** Rows within a band are separated by this many empty tiles. */
    private readonly rowGap = 1,
  ) {
    this.cursorX = startX;
    this.rowY = startY;
  }

  /** Reserve a width x height slot and return its origin. */
  place(width: number, height: number): Placement {
    if (this.cursorX + width - 1 > this.maxX && this.cursorX > this.startX) {
      // Wrap: drop below the tallest item on the finished row.
      this.rowY -= this.rowHeight + this.rowGap;
      this.cursorX = this.startX;
      this.rowHeight = 0;
    }
    const at = { x: this.cursorX, y: this.rowY };
    this.cursorX += width + 1; // one empty tile between neighbours
    this.rowHeight = Math.max(this.rowHeight, height);
    return at;
  }

  /** The next free row below everything placed so far. */
  nextY(sectionGap = 2): number {
    return this.rowY - this.rowHeight - sectionGap;
  }
}

const buildingSize = (name: string) =>
  BUILDINGS_DIMENSIONS[name as BuildingName] ?? { width: 2, height: 2 };
const collectibleSize = (name: string) =>
  COLLECTIBLES_DIMENSIONS[name as CollectibleName] ?? { width: 1, height: 1 };
const resourceSize = (kind: keyof typeof RESOURCE_DIMENSIONS) =>
  RESOURCE_DIMENSIONS[kind] ?? { width: 1, height: 1 };

/** Resource maps are flat `{ id: { x, y, ... } }` records. */
type ResourceMap = Record<string, { x?: number; y?: number } | undefined>;

const repositionResources = (
  map: ResourceMap | undefined,
  size: { width: number; height: number },
  band: Band,
  limit?: number,
): ResourceMap => {
  const out: ResourceMap = {};
  const ids = getKeys(map ?? {});
  const kept = limit === undefined ? ids : ids.slice(0, limit);
  kept.forEach((id) => {
    const node = (map ?? {})[id];
    if (!node) return;
    const at = band.place(size.width, size.height);
    out[id] = { ...node, x: at.x, y: at.y };
  });
  return out;
};

/**
 * Spread every placeable out into labelled bands. The farm reads top to
 * bottom: big buildings, workshops, decorations, crops, trees/rocks, patches.
 */
export function applyLandLayout(
  farm: GameState,
  layout: LandLayout,
): GameState {
  // "stress" keeps the fixture as-is; the stress override carpets the crops.
  if (layout === "stress") return farm;

  const LEFT = -11;
  const RIGHT = 11;
  const basic = layout === "basic";

  // --- Buildings -----------------------------------------------------------
  // Basic keeps only the starter home; everything gets the full set.
  const buildingBand = new Band(LEFT, RIGHT, 12);
  const buildings: GameState["buildings"] = {};
  const buildingOrder = getKeys(farm.buildings).sort();
  for (const name of buildingOrder) {
    const items = farm.buildings[name] ?? [];
    if (!items.length) continue;
    if (basic && name !== "Town Center") continue;
    const size = buildingSize(name);
    buildings[name] = items.map((item) => {
      if (!item.coordinates) return item;
      const at = buildingBand.place(size.width, size.height);
      return { ...item, coordinates: at };
    });
  }

  // --- Collectibles --------------------------------------------------------
  const decorBand = new Band(LEFT, RIGHT, buildingBand.nextY());
  const collectibles: GameState["collectibles"] = {};
  if (!basic) {
    for (const name of getKeys(farm.collectibles).sort()) {
      const items = farm.collectibles[name] ?? [];
      if (!items.length) continue;
      const size = collectibleSize(name);
      collectibles[name] = items.map((item) => {
        if (!item.coordinates) return item;
        const at = decorBand.place(size.width, size.height);
        return { ...item, coordinates: at };
      });
    }
  }

  // --- Crops ---------------------------------------------------------------
  const cropBand = new Band(LEFT, RIGHT, decorBand.nextY());
  const crops = repositionResources(
    farm.crops as ResourceMap,
    resourceSize("Crop Plot"),
    cropBand,
    basic ? BASIC_CROPS : undefined,
  ) as GameState["crops"];

  // --- Trees and rocks -----------------------------------------------------
  const nodeBand = new Band(LEFT, RIGHT, cropBand.nextY());
  const trees = repositionResources(
    farm.trees as ResourceMap,
    resourceSize("Tree"),
    nodeBand,
    basic ? BASIC_TREES : undefined,
  ) as GameState["trees"];

  const empty = {} as ResourceMap;
  const stones = basic
    ? empty
    : repositionResources(
        farm.stones as ResourceMap,
        resourceSize("Stone Rock"),
        nodeBand,
      );
  const iron = basic
    ? empty
    : repositionResources(
        farm.iron as ResourceMap,
        resourceSize("Iron Rock"),
        nodeBand,
      );
  const gold = basic
    ? empty
    : repositionResources(
        farm.gold as ResourceMap,
        resourceSize("Gold Rock"),
        nodeBand,
      );

  // --- Patches, hives, flowers --------------------------------------------
  const patchBand = new Band(LEFT, RIGHT, nodeBand.nextY());
  const fruitPatches = basic
    ? empty
    : repositionResources(
        farm.fruitPatches as ResourceMap,
        resourceSize("Fruit Patch"),
        patchBand,
      );
  const beehives = basic
    ? empty
    : repositionResources(
        farm.beehives as ResourceMap,
        resourceSize("Beehive"),
        patchBand,
      );
  const flowerBeds = basic
    ? empty
    : repositionResources(
        farm.flowers?.flowerBeds as ResourceMap,
        resourceSize("Flower Bed"),
        patchBand,
      );

  return {
    ...farm,
    buildings,
    collectibles,
    crops,
    trees,
    stones: stones as GameState["stones"],
    iron: iron as GameState["iron"],
    gold: gold as GameState["gold"],
    fruitPatches: fruitPatches as GameState["fruitPatches"],
    beehives: beehives as GameState["beehives"],
    flowers: {
      ...farm.flowers,
      flowerBeds: flowerBeds as GameState["flowers"]["flowerBeds"],
    },
  };
}
