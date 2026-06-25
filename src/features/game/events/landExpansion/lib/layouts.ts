import type {
  GameState,
  LayoutCoordinates,
  SavedLayout,
} from "features/game/types/game";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import {
  BUILDINGS_DIMENSIONS,
  type BuildingName,
} from "features/game/types/buildings";
import {
  RESOURCE_DIMENSIONS,
  type ResourceName,
} from "features/game/types/resources";
import {
  detectCollision,
  type Position,
} from "features/game/expansion/placeable/lib/collisionDetection";
import type { LandscapingPlaceable } from "features/game/expansion/placeable/landscapingMachine";
import { getObjectEntries } from "lib/object";

/** Buildings that cannot be moved and must never enter a layout snapshot. */
export const IMMOVABLE_BUILDINGS: BuildingName[] = [
  "Town Center",
  "House",
  "Mansion",
  "Manor",
];

const PLACEABLE_DIMENSIONS: Record<string, { width: number; height: number }> =
  {
    ...BUILDINGS_DIMENSIONS,
    ...COLLECTIBLES_DIMENSIONS,
    ...RESOURCE_DIMENSIONS,
  };

/** Minimal coordinate shape shared by every placed resource/plot. */
type PlacedResource = { x?: number; y?: number; oX?: number; oY?: number };

type ResourceBucketKey = keyof SavedLayout["resources"];

/**
 * Every farm resource bucket: where it lives on the GameState and a single
 * representative {@link ResourceName} used for collision sizing. All tier
 * variants in a bucket share dimensions (e.g. Tree/Ancient Tree/Sacred Tree are
 * all 2x2), so one representative is safe. `flowerBeds` lives nested under
 * `flowers`; everything else is a top-level record.
 */
export const RESOURCE_BUCKETS: {
  key: ResourceBucketKey;
  resourceName: ResourceName;
  get: (state: GameState) => Record<string, PlacedResource>;
}[] = [
  { key: "trees", resourceName: "Tree", get: (s) => s.trees },
  { key: "stones", resourceName: "Stone Rock", get: (s) => s.stones },
  { key: "gold", resourceName: "Gold Rock", get: (s) => s.gold },
  { key: "iron", resourceName: "Iron Rock", get: (s) => s.iron },
  {
    key: "crimstones",
    resourceName: "Crimstone Rock",
    get: (s) => s.crimstones,
  },
  { key: "sunstones", resourceName: "Sunstone Rock", get: (s) => s.sunstones },
  {
    key: "ascensionCrystals",
    resourceName: "Ascension Crystal",
    get: (s) => s.ascensionCrystals,
  },
  {
    key: "oilReserves",
    resourceName: "Oil Reserve",
    get: (s) => s.oilReserves,
  },
  { key: "crops", resourceName: "Crop Plot", get: (s) => s.crops },
  {
    key: "fruitPatches",
    resourceName: "Fruit Patch",
    get: (s) => s.fruitPatches,
  },
  { key: "beehives", resourceName: "Beehive", get: (s) => s.beehives },
  {
    key: "flowerBeds",
    resourceName: "Flower Bed",
    get: (s) => s.flowers.flowerBeds,
  },
  { key: "lavaPits", resourceName: "Lava Pit", get: (s) => s.lavaPits },
];

const emptyResources = (): SavedLayout["resources"] => ({
  trees: {},
  stones: {},
  gold: {},
  iron: {},
  crimstones: {},
  sunstones: {},
  ascensionCrystals: {},
  oilReserves: {},
  crops: {},
  fruitPatches: {},
  beehives: {},
  flowerBeds: {},
  lavaPits: {},
});

const copyCoordinates = (item: PlacedResource): LayoutCoordinates => {
  const coordinates: LayoutCoordinates = {
    x: item.x as number,
    y: item.y as number,
  };
  if (item.oX !== undefined) coordinates.oX = item.oX;
  if (item.oY !== undefined) coordinates.oY = item.oY;
  return coordinates;
};

/**
 * Snapshot the current farm arrangement into the position maps stored on a
 * {@link SavedLayout}. Captures only placed items (those with coordinates);
 * skips the immovable buildings so they never enter a layout.
 */
export function snapshotFarm(
  state: GameState,
): Pick<SavedLayout, "collectibles" | "buildings" | "resources"> {
  const collectibles: SavedLayout["collectibles"] = {};
  getObjectEntries(state.collectibles).forEach(([name, group]) => {
    if (!group) return;
    const placed = group
      .filter((item) => !!item.coordinates)
      .map((item) => ({
        id: item.id,
        coordinates: { ...item.coordinates } as LayoutCoordinates,
        ...(item.flipped !== undefined ? { flipped: item.flipped } : {}),
      }));
    if (placed.length > 0) collectibles[name] = placed;
  });

  const buildings: SavedLayout["buildings"] = {};
  getObjectEntries(state.buildings).forEach(([name, group]) => {
    if (!group || IMMOVABLE_BUILDINGS.includes(name)) return;
    const placed = group
      .filter((item) => !!item.coordinates)
      .map((item) => ({
        id: item.id,
        coordinates: { ...item.coordinates } as LayoutCoordinates,
        ...(item.flipped !== undefined ? { flipped: item.flipped } : {}),
      }));
    if (placed.length > 0) buildings[name] = placed;
  });

  const resources = emptyResources();
  RESOURCE_BUCKETS.forEach(({ key, get }) => {
    const bucket = get(state);
    Object.entries(bucket).forEach(([id, item]) => {
      if (item.x === undefined || item.y === undefined) return;
      resources[key][id] = copyCoordinates(item);
    });
  });

  return { collectibles, buildings, resources };
}

export type LayoutRectCategory = "collectible" | "building" | "resource";

export type LayoutRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  category: LayoutRectCategory;
  /** Item name (for sprite lookup); resources use their representative name. */
  name: string;
};

/**
 * Flatten a layout snapshot (or a live-farm snapshot from {@link snapshotFarm})
 * into positioned rectangles for rendering a preview. Coordinates are world
 * tiles: the box spans x..x+width (rightwards) and y-height..y (downwards from
 * the top edge y). `name` is the item name so a renderer can resolve a sprite.
 */
export function layoutItemRects(
  layout: Pick<SavedLayout, "collectibles" | "buildings" | "resources">,
): LayoutRect[] {
  const rects: LayoutRect[] = [];

  getObjectEntries(layout.collectibles).forEach(([name, entries]) => {
    const dimensions = PLACEABLE_DIMENSIONS[name];
    if (!dimensions || !entries) return;
    entries.forEach(({ coordinates }) =>
      rects.push({
        x: coordinates.x,
        y: coordinates.y,
        width: dimensions.width,
        height: dimensions.height,
        category: "collectible",
        name,
      }),
    );
  });

  getObjectEntries(layout.buildings).forEach(([name, entries]) => {
    const dimensions = PLACEABLE_DIMENSIONS[name];
    if (!dimensions || !entries) return;
    entries.forEach(({ coordinates }) =>
      rects.push({
        x: coordinates.x,
        y: coordinates.y,
        width: dimensions.width,
        height: dimensions.height,
        category: "building",
        name,
      }),
    );
  });

  RESOURCE_BUCKETS.forEach(({ key, resourceName }) => {
    const dimensions = PLACEABLE_DIMENSIONS[resourceName];
    if (!dimensions) return;
    Object.values(layout.resources[key]).forEach((coordinates) =>
      rects.push({
        x: coordinates.x,
        y: coordinates.y,
        width: dimensions.width,
        height: dimensions.height,
        category: "resource",
        name: resourceName,
      }),
    );
  });

  return rects;
}

type PendingPlacement = {
  name: LandscapingPlaceable;
  position: Position;
  /** Move the item to its saved layout position. */
  toTarget: () => void;
  /** Leave the item exactly where it currently is (restore pre-lift coords). */
  toOriginal: () => void;
};

/**
 * Reposition the player's existing farm items to match a saved layout, on a
 * best-effort basis. Returns how many items were placed vs skipped.
 *
 * Strategy ("lift then place", skip-and-restore):
 *   1. Resolve which snapshot entries still exist live (withdrawn/missing items
 *      are not applicable and are ignored).
 *   2. Lift every applicable item (clear its coordinates), remembering where it
 *      was, so a layout item's target never falsely collides with another
 *      layout item's *current* spot (handles swaps).
 *   3. Pass 1 — place each item at its target if free. A target that is now off
 *      the land (e.g. the farm shrank on ascension) or blocked by a non-layout
 *      item fails `detectCollision`; defer it. Deferred items stay lifted so
 *      they never block the items that *can* be placed.
 *   4. Pass 2 — deferred items keep their current position (restore pre-lift
 *      coords) and count as skipped. The farm is never left with unplaced items.
 *
 * Mutates `state` in place (expects an Immer draft).
 */
export function applyFarmLayout(
  state: GameState,
  layout: SavedLayout,
): { applied: number; skipped: number } {
  const pending: PendingPlacement[] = [];

  getObjectEntries(layout.collectibles).forEach(([name, entries]) => {
    if (!entries) return;
    const dimensions = PLACEABLE_DIMENSIONS[name];
    if (!dimensions) return;
    const group = state.collectibles[name];
    entries.forEach((entry) => {
      const item = group?.find((collectible) => collectible.id === entry.id);
      if (!item) return; // withdrawn / no longer placed → not applicable
      const original = item.coordinates ? { ...item.coordinates } : undefined;
      pending.push({
        name,
        position: {
          x: entry.coordinates.x,
          y: entry.coordinates.y,
          width: dimensions.width,
          height: dimensions.height,
        },
        toTarget: () => {
          item.coordinates = { ...entry.coordinates };
          item.flipped = entry.flipped;
        },
        toOriginal: () => {
          item.coordinates = original;
        },
      });
      item.coordinates = undefined; // lift
    });
  });

  getObjectEntries(layout.buildings).forEach(([name, entries]) => {
    if (!entries) return;
    const dimensions = PLACEABLE_DIMENSIONS[name];
    if (!dimensions) return;
    const group = state.buildings[name];
    entries.forEach((entry) => {
      const item = group?.find((building) => building.id === entry.id);
      if (!item) return;
      const original = item.coordinates ? { ...item.coordinates } : undefined;
      pending.push({
        name,
        position: {
          x: entry.coordinates.x,
          y: entry.coordinates.y,
          width: dimensions.width,
          height: dimensions.height,
        },
        toTarget: () => {
          item.coordinates = { ...entry.coordinates };
          item.flipped = entry.flipped;
        },
        toOriginal: () => {
          item.coordinates = original;
        },
      });
      item.coordinates = undefined; // lift
    });
  });

  RESOURCE_BUCKETS.forEach(({ key, resourceName, get }) => {
    const dimensions = RESOURCE_DIMENSIONS[resourceName];
    const bucket = get(state);
    Object.entries(layout.resources[key]).forEach(([id, coordinates]) => {
      const item = bucket[id];
      if (!item) return;
      const original = { x: item.x, y: item.y, oX: item.oX, oY: item.oY };
      pending.push({
        name: resourceName,
        position: {
          x: coordinates.x,
          y: coordinates.y,
          width: dimensions.width,
          height: dimensions.height,
        },
        toTarget: () => {
          item.x = coordinates.x;
          item.y = coordinates.y;
          item.oX = coordinates.oX;
          item.oY = coordinates.oY;
        },
        toOriginal: () => {
          item.x = original.x;
          item.y = original.y;
          item.oX = original.oX;
          item.oY = original.oY;
        },
      });
      item.x = undefined; // lift
      item.y = undefined;
    });
  });

  // Pass 1: place everything that fits. Deferred items stay lifted so they
  // never obstruct the items that can be placed.
  const deferred: PendingPlacement[] = [];
  let applied = 0;
  for (const placement of pending) {
    const blocked = detectCollision({
      state,
      position: placement.position,
      location: "farm",
      name: placement.name,
    });
    if (blocked) {
      deferred.push(placement);
    } else {
      placement.toTarget();
      applied += 1;
    }
  }

  // Pass 2: items that couldn't reach their target keep their current position.
  deferred.forEach((placement) => placement.toOriginal());

  return { applied, skipped: deferred.length };
}
