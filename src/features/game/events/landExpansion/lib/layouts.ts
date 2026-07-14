import type {
  GameState,
  InventoryItemName,
  LayoutCoordinates,
  LayoutPlacement,
  PlacedItem,
  SavedLayout,
} from "features/game/types/game";
import { getChestItemCount } from "features/island/hud/components/inventory/utils/inventory";
import { isCollectibleWithTimestamps } from "features/game/events/landExpansion/placeCollectible";
import { getAvailableNodes } from "features/game/lib/resourceNodes";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import {
  RESOURCE_DIMENSIONS,
  RESOURCE_MULTIPLIER,
  type ResourceName,
  type UpgradeableResource,
} from "features/game/types/resources";
import { PET_NFT_DIMENSIONS } from "features/game/types/pets";
import {
  detectCollision,
  detectWaterCollision,
  type Position,
} from "features/game/expansion/placeable/lib/collisionDetection";
import type { LandscapingPlaceable } from "features/game/expansion/placeable/landscapingMachine";
import { getObjectEntries } from "lib/object";

/**
 * Collision dimensions for the placeables that aren't in
 * {@link PLACEABLE_DIMENSIONS} (Buds/Pet NFTs/FarmHands/Bumpkin). Mirrors the
 * hardcoded boxes used by `detectCollision` and the placement UI: 1x1 for
 * everything except the 2x2 Pet NFT.
 */
const BUD_DIMENSIONS = { width: 1, height: 1 };
const FARM_HAND_DIMENSIONS = { width: 1, height: 1 };
const BUMPKIN_DIMENSIONS = { width: 1, height: 1 };

/** True when a placeable's `location` marks it as on the farm (legacy = farm). */
const isOnFarm = (placed: { location?: string; coordinates?: unknown }) =>
  !!placed.coordinates && (!placed.location || placed.location === "farm");

const PLACEABLE_DIMENSIONS: Record<string, { width: number; height: number }> =
  {
    ...BUILDINGS_DIMENSIONS,
    ...COLLECTIBLES_DIMENSIONS,
    ...RESOURCE_DIMENSIONS,
  };

/** Minimal coordinate shape shared by every placed resource/plot. */
type PlacedResource = {
  x?: number;
  y?: number;
  oX?: number;
  oY?: number;
  removedAt?: number;
};

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

/** Resource buckets whose availability spans an upgradeable tier family. */
const TIERED_FAMILIES = ["trees", "stones", "gold", "iron"] as const;
type TieredFamily = (typeof TIERED_FAMILIES)[number];
const isTieredFamily = (key: ResourceBucketKey): key is TieredFamily =>
  (TIERED_FAMILIES as readonly string[]).includes(key);

/**
 * Build a fresh resource node for a bucket — mirrors the new-instance shape each
 * `placeX` event creates. Tiered families default to the base tier (advanced
 * tiers only ever exist as already-placed instances, so they're reused, not
 * created).
 */
const createResourceNode = (
  key: ResourceBucketKey,
  resourceName: ResourceName,
  c: LayoutCoordinates,
  createdAt: number,
): PlacedResource => {
  const base = { createdAt, x: c.x, y: c.y, oX: c.oX, oY: c.oY };
  switch (key) {
    case "trees":
      return {
        ...base,
        wood: { choppedAt: 0 },
        name: resourceName,
        multiplier: RESOURCE_MULTIPLIER[resourceName as UpgradeableResource],
        tier: 1,
      } as PlacedResource;
    case "stones":
    case "gold":
    case "iron":
      return {
        ...base,
        stone: { minedAt: 0 },
        name: resourceName,
        multiplier: RESOURCE_MULTIPLIER[resourceName as UpgradeableResource],
        tier: 1,
      } as PlacedResource;
    case "crimstones":
      return { ...base, stone: { minedAt: 0 }, minesLeft: 5 } as PlacedResource;
    case "sunstones":
      return {
        ...base,
        stone: { minedAt: 0 },
        minesLeft: 10,
      } as PlacedResource;
    case "ascensionCrystals":
      return { ...base, stone: { minedAt: 0 }, minesLeft: 1 } as PlacedResource;
    case "oilReserves":
      return { ...base, oil: { drilledAt: 0 }, drilled: 0 } as PlacedResource;
    case "beehives":
      return {
        x: c.x,
        y: c.y,
        oX: c.oX,
        oY: c.oY,
        swarm: false,
        honey: { updatedAt: createdAt, produced: 0 },
        flowers: [],
      } as PlacedResource;
    default:
      // crops, fruitPatches, flowerBeds, lavaPits — just coordinates + createdAt.
      return base as PlacedResource;
  }
};

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

/** Collision box for a placeable by name; unknown names fall back to 1x1. */
const dimensionsFor = (name: string): { width: number; height: number } =>
  PLACEABLE_DIMENSIONS[name] ?? { width: 1, height: 1 };

/**
 * True when a placeable's full footprint sits within the first `maxExpansions`
 * land bounding boxes. Mirrors the on-land test `detectCollision` uses, so
 * trimming a snapshot to N expansions keeps exactly the items that would still
 * fit once the layout is re-applied on an N-expansion island.
 */
const isWithinExpansions = (
  coordinates: { x: number; y: number },
  dimensions: { width: number; height: number },
  maxExpansions: number,
): boolean =>
  !detectWaterCollision(maxExpansions, {
    x: coordinates.x,
    y: coordinates.y,
    width: dimensions.width,
    height: dimensions.height,
  });

/**
 * Retain a placeable only when its footprint fits within the first
 * `maxExpansions` expansions. With no `maxExpansions`, everything placed is
 * kept. Shared by {@link snapshotFarm} (live state) and {@link trimSavedLayout}
 * (stored layout).
 */
const isKept = (
  coordinates: { x: number; y: number } | undefined,
  name: string,
  maxExpansions?: number,
): boolean =>
  !!coordinates &&
  (maxExpansions === undefined ||
    isWithinExpansions(coordinates, dimensionsFor(name), maxExpansions));

/**
 * Snapshot the current farm arrangement into the position maps stored on a
 * {@link SavedLayout}. Captures every placed item (those with coordinates),
 * including the non-removable buildings (Town Center/House/Mansion/Manor) —
 * those can still be moved, so their position is part of the layout.
 */
export function snapshotFarm(
  state: GameState,
  options: { maxExpansions?: number } = {},
): Pick<
  SavedLayout,
  | "collectibles"
  | "buildings"
  | "resources"
  | "buds"
  | "petNFTs"
  | "farmHands"
  | "bumpkin"
  | "land"
> {
  const { maxExpansions } = options;

  const collectibles: SavedLayout["collectibles"] = {};
  getObjectEntries(state.collectibles).forEach(([name, group]) => {
    if (!group) return;
    const placed = group
      .filter((item) => isKept(item.coordinates, name, maxExpansions))
      .map((item) => ({
        id: item.id,
        coordinates: { ...item.coordinates } as LayoutCoordinates,
        ...(item.flipped !== undefined ? { flipped: item.flipped } : {}),
      }));
    if (placed.length > 0) collectibles[name] = placed;
  });

  const buildings: SavedLayout["buildings"] = {};
  getObjectEntries(state.buildings).forEach(([name, group]) => {
    if (!group) return;
    const placed = group
      .filter((item) => isKept(item.coordinates, name, maxExpansions))
      .map((item) => ({
        id: item.id,
        coordinates: { ...item.coordinates } as LayoutCoordinates,
        ...(item.flipped !== undefined ? { flipped: item.flipped } : {}),
      }));
    if (placed.length > 0) buildings[name] = placed;
  });

  const resources = emptyResources();
  RESOURCE_BUCKETS.forEach(({ key, get, resourceName }) => {
    const bucket = get(state);
    Object.entries(bucket).forEach(([id, item]) => {
      if (item.x === undefined || item.y === undefined) return;
      if (!isKept({ x: item.x, y: item.y }, resourceName, maxExpansions))
        return;
      resources[key][id] = copyCoordinates(item);
    });
  });

  // Buds and Pet NFTs: single bucket each, distinguished from home/interior
  // copies by `location`. Neither is flippable, so store bare coordinates.
  const buds: NonNullable<SavedLayout["buds"]> = {};
  Object.entries(state.buds ?? {}).forEach(([id, bud]) => {
    if (!isOnFarm(bud)) return;
    const coordinates = bud.coordinates as LayoutCoordinates;
    if (!isKept(coordinates, "Bud", maxExpansions)) return;
    buds[id] = { ...coordinates };
  });

  const petNFTs: NonNullable<SavedLayout["petNFTs"]> = {};
  Object.entries(state.pets?.nfts ?? {}).forEach(([id, pet]) => {
    if (!isOnFarm(pet)) return;
    const coordinates = pet.coordinates as LayoutCoordinates;
    if (
      maxExpansions !== undefined &&
      !isWithinExpansions(coordinates, PET_NFT_DIMENSIONS, maxExpansions)
    ) {
      return;
    }
    petNFTs[id] = { ...coordinates };
  });

  // FarmHands (extra bumpkins) carry a `flipped` flag like the main Bumpkin.
  const farmHands: NonNullable<SavedLayout["farmHands"]> = {};
  Object.entries(state.farmHands?.bumpkins ?? {}).forEach(([id, farmHand]) => {
    if (!isOnFarm(farmHand)) return;
    const coordinates = farmHand.coordinates as LayoutCoordinates;
    if (!isKept(coordinates, "Bumpkin", maxExpansions)) return;
    farmHands[id] = {
      ...coordinates,
      ...(farmHand.flipped !== undefined ? { flipped: farmHand.flipped } : {}),
    };
  });

  const bumpkin =
    isOnFarm(state.bumpkin) &&
    isKept(
      state.bumpkin.coordinates as LayoutCoordinates,
      "Bumpkin",
      maxExpansions,
    )
      ? {
          ...(state.bumpkin.coordinates as LayoutCoordinates),
          ...(state.bumpkin.flipped !== undefined
            ? { flipped: state.bumpkin.flipped }
            : {}),
        }
      : undefined;

  const land = {
    expansions: maxExpansions ?? state.inventory["Basic Land"]?.toNumber() ?? 3,
    island: { ...state.island },
  };

  // Every bucket is always present (empty when nothing is placed) so that
  // overwriting a layout — `{ ...existing, ...snapshot }` — fully replaces the
  // old arrangement instead of leaving stale buds/pets/farmhands/bumpkin behind.
  return {
    collectibles,
    buildings,
    resources,
    land,
    buds,
    petNFTs,
    farmHands,
    bumpkin,
  };
}

/**
 * Trim an already-stored layout to the first `maxExpansions` expansions,
 * dropping every placement whose footprint falls outside that land, and stamp
 * its land extent to `maxExpansions`. Mirrors {@link snapshotFarm}'s trimming
 * but reads from a {@link SavedLayout}'s position maps instead of live state —
 * used to promote an existing saved layout into the Ascension Layout, which
 * must always fit a 30-land island.
 */
export function trimSavedLayout(
  layout: SavedLayout,
  maxExpansions: number,
  fallbackIsland: GameState["island"],
): Pick<
  SavedLayout,
  | "collectibles"
  | "buildings"
  | "resources"
  | "buds"
  | "petNFTs"
  | "farmHands"
  | "bumpkin"
  | "land"
> {
  const collectibles: SavedLayout["collectibles"] = {};
  getObjectEntries(layout.collectibles).forEach(([name, placements]) => {
    if (!placements) return;
    const kept = placements
      .filter((p) => isKept(p.coordinates, name, maxExpansions))
      .map((p) => ({ ...p, coordinates: { ...p.coordinates } }));
    if (kept.length > 0) collectibles[name] = kept;
  });

  const buildings: SavedLayout["buildings"] = {};
  getObjectEntries(layout.buildings).forEach(([name, placements]) => {
    if (!placements) return;
    const kept = placements
      .filter((p) => isKept(p.coordinates, name, maxExpansions))
      .map((p) => ({ ...p, coordinates: { ...p.coordinates } }));
    if (kept.length > 0) buildings[name] = kept;
  });

  const resources = emptyResources();
  RESOURCE_BUCKETS.forEach(({ key, resourceName }) => {
    const bucket = layout.resources[key] ?? {};
    Object.entries(bucket).forEach(([id, coordinates]) => {
      if (isKept(coordinates, resourceName, maxExpansions))
        resources[key][id] = { ...coordinates };
    });
  });

  const buds: NonNullable<SavedLayout["buds"]> = {};
  Object.entries(layout.buds ?? {}).forEach(([id, coordinates]) => {
    if (isKept(coordinates, "Bud", maxExpansions))
      buds[id] = { ...coordinates };
  });

  const petNFTs: NonNullable<SavedLayout["petNFTs"]> = {};
  Object.entries(layout.petNFTs ?? {}).forEach(([id, coordinates]) => {
    if (isWithinExpansions(coordinates, PET_NFT_DIMENSIONS, maxExpansions)) {
      petNFTs[id] = { ...coordinates };
    }
  });

  const farmHands: NonNullable<SavedLayout["farmHands"]> = {};
  Object.entries(layout.farmHands ?? {}).forEach(([id, placement]) => {
    if (isKept(placement, "Bumpkin", maxExpansions))
      farmHands[id] = { ...placement };
  });

  const bumpkin =
    layout.bumpkin && isKept(layout.bumpkin, "Bumpkin", maxExpansions)
      ? { ...layout.bumpkin }
      : undefined;

  const land = {
    expansions: maxExpansions,
    island: layout.land?.island ?? fallbackIsland,
  };

  return {
    collectibles,
    buildings,
    resources,
    land,
    buds,
    petNFTs,
    farmHands,
    bumpkin,
  };
}

/**
 * Default name for an unnamed layout: the lowest unused "Layout N". Computed
 * identically on FE and BE so the generated name matches on both sides.
 */
export function defaultLayoutName(layouts: SavedLayout[]): string {
  const taken = new Set(layouts.map((layout) => layout.name));
  let n = 1;
  while (taken.has(`Layout ${n}`)) n += 1;
  return `Layout ${n}`;
}

export type LayoutRectCategory =
  | "collectible"
  | "building"
  | "resource"
  // Buds & Pet NFTs — sprite resolved from `id` (getBudImage/getPetImage…).
  | "nft"
  // The player's Bumpkin & FarmHands — sprite composed from equipped parts.
  | "avatar";

export type LayoutRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  category: LayoutRectCategory;
  /** Item name (for sprite lookup); resources use their representative name. */
  name: string;
  /**
   * Entity id for `nft`/`avatar` rects, used by the preview to resolve the
   * live sprite (bud/pet by id; farmhand by id → equipped). Bumpkin omits it.
   */
  id?: string;
  /** Mirror the item horizontally, matching its on-farm orientation. */
  flipped?: boolean;
};

/**
 * Flatten a layout snapshot (or a live-farm snapshot from {@link snapshotFarm})
 * into positioned rectangles for rendering a preview. Coordinates are world
 * tiles: the box spans x..x+width (rightwards) and y-height..y (downwards from
 * the top edge y). `name` is the item name so a renderer can resolve a sprite.
 */
export function layoutItemRects(
  layout: Pick<
    SavedLayout,
    | "collectibles"
    | "buildings"
    | "resources"
    | "buds"
    | "petNFTs"
    | "farmHands"
    | "bumpkin"
  >,
): LayoutRect[] {
  const rects: LayoutRect[] = [];

  getObjectEntries(layout.collectibles).forEach(([name, entries]) => {
    const dimensions = PLACEABLE_DIMENSIONS[name];
    if (!dimensions || !entries) return;
    entries.forEach(({ coordinates, flipped }) =>
      rects.push({
        x: coordinates.x,
        y: coordinates.y,
        width: dimensions.width,
        height: dimensions.height,
        category: "collectible",
        name,
        flipped,
      }),
    );
  });

  getObjectEntries(layout.buildings).forEach(([name, entries]) => {
    const dimensions = PLACEABLE_DIMENSIONS[name];
    if (!dimensions || !entries) return;
    entries.forEach(({ coordinates, flipped }) =>
      rects.push({
        x: coordinates.x,
        y: coordinates.y,
        width: dimensions.width,
        height: dimensions.height,
        category: "building",
        name,
        flipped,
      }),
    );
  });

  RESOURCE_BUCKETS.forEach(({ key, resourceName }) => {
    const dimensions = PLACEABLE_DIMENSIONS[resourceName];
    if (!dimensions) return;
    Object.values(layout.resources[key] ?? {}).forEach((coordinates) =>
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

  // Buds & Pet NFTs — sprite resolved from the entity id in the preview.
  Object.entries(layout.buds ?? {}).forEach(([id, coordinates]) =>
    rects.push({
      x: coordinates.x,
      y: coordinates.y,
      width: BUD_DIMENSIONS.width,
      height: BUD_DIMENSIONS.height,
      category: "nft",
      name: "Bud",
      id,
    }),
  );
  Object.entries(layout.petNFTs ?? {}).forEach(([id, coordinates]) =>
    rects.push({
      x: coordinates.x,
      y: coordinates.y,
      width: PET_NFT_DIMENSIONS.width,
      height: PET_NFT_DIMENSIONS.height,
      category: "nft",
      name: "Pet",
      id,
    }),
  );

  // FarmHands & the player's Bumpkin — sprite composed from equipped parts.
  Object.entries(layout.farmHands ?? {}).forEach(([id, placement]) =>
    rects.push({
      x: placement.x,
      y: placement.y,
      width: FARM_HAND_DIMENSIONS.width,
      height: FARM_HAND_DIMENSIONS.height,
      category: "avatar",
      name: "FarmHand",
      id,
      flipped: placement.flipped,
    }),
  );
  if (layout.bumpkin) {
    rects.push({
      x: layout.bumpkin.x,
      y: layout.bumpkin.y,
      width: BUMPKIN_DIMENSIONS.width,
      height: BUMPKIN_DIMENSIONS.height,
      category: "avatar",
      name: "Bumpkin",
      flipped: layout.bumpkin.flipped,
    });
  }

  return rects;
}

/** A single position from the layout, with the resolved instance to place there. */
type LayoutSlot = {
  name: LandscapingPlaceable;
  position: Position;
  /** Materialise the resolved instance at this slot. */
  place: () => void;
  /**
   * For a reused instance that was already on the farm: where it sat before the
   * layout lifted it, so that if this slot is blocked we can leave the item
   * there (when that tile is still free) instead of unplacing it. Newly-created
   * instances have no `restore` — they simply aren't created.
   */
  restore?: { position: Position; apply: () => void };
};

/** Deterministic position order so FE and BE fill slots identically. */
const byPosition = (a: LayoutCoordinates, b: LayoutCoordinates) =>
  a.x - b.x || a.y - b.y;

/**
 * Arrange the player's OWNED items onto a saved layout's positions, driven by
 * inventory availability (not by saved id) so a layout can be shared between
 * players. Best-effort — mutates `state` in place (expects an Immer draft).
 *
 * Matching: collectibles/buildings/resources prefer the player's own instance
 * for each saved id (so applying your own layout restores each item to its exact
 * spot, keeping its timers/state), then fall back to inventory availability for
 * ids you don't own (e.g. a shared layout). Buds/pet NFTs match by id ownership;
 * farmhands prefer the saved id then fill by count; the bumpkin is always placed.
 * For each type the player's current farm placements are lifted, then the type's
 * saved positions are filled (in a deterministic order) — owning fewer than the
 * layout asks leaves the extra positions empty (`noInventory`), owning more
 * leaves the extras unplaced.
 *
 * Collectibles, buildings & resources are placed up to full inventory
 * availability: existing instances are reused first, then new instances are
 * created (with deterministic ids) from the remaining owned inventory. Buds/pets/
 * farmhands reuse existing instances only; positions with no available instance
 * count as `noInventory`. Positions blocked off-land or under a non-layout item
 * are `skipped`.
 */
export function applyFarmLayout(
  state: GameState,
  layout: SavedLayout,
  createdAt: number,
): { applied: number; skipped: number; noInventory: number } {
  const slots: LayoutSlot[] = [];
  let noInventory = 0;

  // Deterministic id for a newly-created instance — identical on FE and BE
  // (same `createdAt`), and never collides with the 8-hex uuid-slice ids.
  const newId = (tag: string, i: number) =>
    `L${createdAt.toString(36)}-${tag}-${i}`;

  // Collectibles & buildings: keyed by name, placed up to inventory availability.
  // Lift the farm instances, fill the (position-sorted) saved slots by reusing
  // the (id-sorted) unplaced instances first, then creating new ones.
  const addNamedSlots = <N extends string>(
    layoutGroup: Partial<Record<N, LayoutPlacement[]>>,
    getBucket: (name: N) => PlacedItem[] | undefined,
    ensureBucket: (name: N) => PlacedItem[],
    newItem: (name: N, id: string) => PlacedItem,
  ) => {
    getObjectEntries(layoutGroup).forEach(([name, entries]) => {
      const dimensions = PLACEABLE_DIMENSIONS[name];
      if (!dimensions || !entries) return;
      const group = getBucket(name) ?? [];
      const originalCoords = new Map(
        group.map((item) => [item.id, item.coordinates]),
      );
      group.forEach((item) => {
        if (item.coordinates) item.coordinates = undefined; // lift
      });
      const byId = new Map(group.map((item) => [item.id, item]));
      const owned = getChestItemCount(
        state,
        name as InventoryItemName,
      ).toNumber();
      const sortedEntries = [...entries].sort((a, b) =>
        byPosition(a.coordinates, b.coordinates),
      );
      const capacity = Math.min(sortedEntries.length, owned);
      // Prefer the player's own copy of each saved instance (exact restoration);
      // reserve those ids, then fall back to any other unplaced instance
      // (id-sorted) and finally to creating new ones from inventory.
      const ownedSavedIds = new Set(
        sortedEntries
          .slice(0, capacity)
          .map((entry) => entry.id)
          .filter((id) => byId.has(id)),
      );
      const freePool = group
        .map((item) => item.id)
        .filter((id) => !ownedSavedIds.has(id))
        .sort((a, b) => a.localeCompare(b));
      let freeIdx = 0;
      sortedEntries.forEach((entry, i) => {
        if (i >= capacity) {
          noInventory += 1;
          return;
        }
        const reuseId = byId.has(entry.id) ? entry.id : freePool[freeIdx++];
        const reuse = reuseId !== undefined ? byId.get(reuseId) : undefined;
        const original =
          reuse && reuseId !== undefined
            ? originalCoords.get(reuseId)
            : undefined;
        slots.push({
          name: name as LandscapingPlaceable,
          position: {
            x: entry.coordinates.x,
            y: entry.coordinates.y,
            width: dimensions.width,
            height: dimensions.height,
          },
          place: () => {
            const item = reuse ?? newItem(name, newId(name, i));
            if (!reuse) ensureBucket(name).push(item);
            item.coordinates = { ...entry.coordinates };
            item.flipped = entry.flipped;
            delete item.removedAt;
          },
          restore:
            reuse && original
              ? {
                  position: {
                    x: original.x,
                    y: original.y,
                    width: dimensions.width,
                    height: dimensions.height,
                  },
                  apply: () => {
                    reuse.coordinates = { ...original };
                    delete reuse.removedAt;
                  },
                }
              : undefined,
        });
      });
    });
  };
  addNamedSlots(
    layout.collectibles,
    (name) => state.collectibles[name],
    (name) => (state.collectibles[name] ??= []),
    (name, id) =>
      isCollectibleWithTimestamps(name) ? { id, createdAt } : { id },
  );
  addNamedSlots(
    layout.buildings,
    (name) => state.buildings[name],
    (name) => (state.buildings[name] ??= []),
    (_name, id) => ({ id, createdAt, readyAt: createdAt }),
  );

  // Resources: keyed by bucket (tiers aggregated), placed up to availability.
  // Lift the bucket, reuse the (id-sorted) unplaced instances first, then create
  // new nodes from the remaining owned inventory.
  let affectsBeehives = false;
  RESOURCE_BUCKETS.forEach(({ key, resourceName, get }) => {
    const dimensions = RESOURCE_DIMENSIONS[resourceName];
    const bucket = get(state);
    const originalCoords = new Map(
      Object.entries(bucket).map(([id, node]) => [
        id,
        node.x !== undefined && node.y !== undefined
          ? { x: node.x, y: node.y, oX: node.oX, oY: node.oY }
          : undefined,
      ]),
    );
    Object.values(bucket).forEach((node) => {
      if (node.x !== undefined) {
        node.x = undefined; // lift
        node.y = undefined;
      }
    });
    const owned = isTieredFamily(key)
      ? getAvailableNodes(state, key).toNumber()
      : getChestItemCount(state, resourceName as InventoryItemName).toNumber();
    const entries = Object.entries(layout.resources[key] ?? {}).sort(
      ([, a], [, b]) => byPosition(a, b),
    );
    const capacity = Math.min(entries.length, owned);
    // Prefer the player's own node for each saved id (keeps its tier + timers at
    // the saved spot); reserve those, then fall back to any other unplaced node
    // (id-sorted) and finally to creating new ones from inventory.
    const ownedSavedIds = new Set(
      entries
        .slice(0, capacity)
        .map(([id]) => id)
        .filter((id) => bucket[id] !== undefined),
    );
    const freePool = Object.keys(bucket)
      .filter((id) => bucket[id].x === undefined && !ownedSavedIds.has(id))
      .sort((a, b) => a.localeCompare(b));
    let freeIdx = 0;
    entries.forEach(([savedId, coordinates], i) => {
      if (i >= capacity) {
        noInventory += 1;
        return;
      }
      const reuseId =
        bucket[savedId] !== undefined ? savedId : freePool[freeIdx++];
      const original =
        reuseId !== undefined ? originalCoords.get(reuseId) : undefined;
      const markBeehives = () => {
        // Moving a beehive OR a flower bed changes beehive flower adjacency.
        if (key === "beehives" || key === "flowerBeds") {
          affectsBeehives = true;
        }
      };
      slots.push({
        name: resourceName,
        position: {
          x: coordinates.x,
          y: coordinates.y,
          width: dimensions.width,
          height: dimensions.height,
        },
        place: () => {
          if (reuseId !== undefined) {
            const node = bucket[reuseId];
            node.x = coordinates.x;
            node.y = coordinates.y;
            node.oX = coordinates.oX;
            node.oY = coordinates.oY;
            delete node.removedAt;
          } else {
            bucket[newId(key, i)] = createResourceNode(
              key,
              resourceName,
              coordinates,
              createdAt,
            );
          }
          markBeehives();
        },
        restore:
          reuseId !== undefined && original
            ? {
                position: {
                  x: original.x,
                  y: original.y,
                  width: dimensions.width,
                  height: dimensions.height,
                },
                apply: () => {
                  const node = bucket[reuseId];
                  node.x = original.x;
                  node.y = original.y;
                  node.oX = original.oX;
                  node.oY = original.oY;
                  delete node.removedAt;
                  markBeehives();
                },
              }
            : undefined,
      });
    });
  });

  // Buds & Pet NFTs: by id ownership (shared-layout ids you don't own are
  // skipped silently). Pets must be revealed to be placed.
  Object.entries(layout.buds ?? {}).forEach(([id, coordinates]) => {
    const bud = state.buds?.[Number(id)];
    if (!bud) return;
    const original = bud.coordinates;
    bud.coordinates = undefined; // lift
    slots.push({
      name: "Bud",
      position: { ...coordinates, ...BUD_DIMENSIONS },
      place: () => {
        bud.coordinates = { x: coordinates.x, y: coordinates.y };
        bud.location = "farm";
      },
      restore: original
        ? {
            position: { x: original.x, y: original.y, ...BUD_DIMENSIONS },
            apply: () => {
              bud.coordinates = { x: original.x, y: original.y };
              bud.location = "farm";
            },
          }
        : undefined,
    });
  });
  Object.entries(layout.petNFTs ?? {}).forEach(([id, coordinates]) => {
    // Owned by id (a pet in a layout was placed once, so it's already revealed).
    const pet = state.pets?.nfts?.[Number(id)];
    if (!pet) return;
    const original = pet.coordinates;
    pet.coordinates = undefined; // lift
    slots.push({
      name: "Pet",
      position: { ...coordinates, ...PET_NFT_DIMENSIONS },
      place: () => {
        pet.coordinates = { x: coordinates.x, y: coordinates.y };
        pet.location = "farm";
      },
      restore: original
        ? {
            position: { x: original.x, y: original.y, ...PET_NFT_DIMENSIONS },
            apply: () => {
              pet.coordinates = { x: original.x, y: original.y };
              pet.location = "farm";
            },
          }
        : undefined,
    });
  });

  // FarmHands: prefer the saved farmhand id if the player owns it (keeps each
  // bumpkin's equipment + flip at its saved spot), else bind any other unlocked
  // farmhand by count. No creation — you can't mint farmhands.
  const farmHandIds = Object.keys(state.farmHands?.bumpkins ?? {}).sort(
    (a, b) => a.localeCompare(b),
  );
  const farmHandOriginals = new Map(
    farmHandIds.map((id) => [id, state.farmHands.bumpkins[id].coordinates]),
  );
  farmHandIds.forEach((id) => {
    const fh = state.farmHands.bumpkins[id];
    if (fh.coordinates) fh.coordinates = undefined; // lift
  });
  const fhEntries = Object.entries(layout.farmHands ?? {}).sort(
    ([, a], [, b]) => byPosition(a, b),
  );
  const fhCapacity = Math.min(fhEntries.length, farmHandIds.length);
  const ownedFarmHandIds = new Set(
    fhEntries
      .slice(0, fhCapacity)
      .map(([id]) => id)
      .filter((id) => state.farmHands.bumpkins[id] !== undefined),
  );
  const farmHandPool = farmHandIds.filter((id) => !ownedFarmHandIds.has(id));
  let fhPoolIdx = 0;
  fhEntries.forEach(([savedId, placement], i) => {
    if (i >= fhCapacity) {
      noInventory += 1;
      return;
    }
    const id =
      state.farmHands.bumpkins[savedId] !== undefined
        ? savedId
        : farmHandPool[fhPoolIdx++];
    if (id === undefined) {
      noInventory += 1;
      return;
    }
    const fh = state.farmHands.bumpkins[id];
    const original = farmHandOriginals.get(id);
    slots.push({
      name: "FarmHand",
      position: { ...placement, ...FARM_HAND_DIMENSIONS },
      place: () => {
        fh.coordinates = { x: placement.x, y: placement.y };
        fh.flipped = placement.flipped;
        fh.location = "farm";
      },
      restore: original
        ? {
            position: { x: original.x, y: original.y, ...FARM_HAND_DIMENSIONS },
            apply: () => {
              fh.coordinates = { x: original.x, y: original.y };
              fh.location = "farm";
            },
          }
        : undefined,
    });
  });

  // The player's own Bumpkin — always placed at its saved position.
  if (layout.bumpkin && state.bumpkin) {
    const placement = layout.bumpkin;
    const bumpkin = state.bumpkin;
    const original = bumpkin.coordinates;
    bumpkin.coordinates = undefined; // lift
    slots.push({
      name: "Bumpkin",
      position: { ...placement, ...BUMPKIN_DIMENSIONS },
      place: () => {
        bumpkin.coordinates = { x: placement.x, y: placement.y };
        bumpkin.flipped = placement.flipped;
        bumpkin.location = "farm";
      },
      restore: original
        ? {
            position: { x: original.x, y: original.y, ...BUMPKIN_DIMENSIONS },
            apply: () => {
              bumpkin.coordinates = { x: original.x, y: original.y };
              bumpkin.location = "farm";
            },
          }
        : undefined,
    });
  }

  // Exact restore: applying a layout yields exactly the saved snapshot, so lift
  // every placed item the layout does NOT represent too — its instance (with any
  // timers) is kept; it simply returns to inventory. Resources are lifted in full
  // above; mirror that for the name/id-keyed categories. The player's own Bumpkin
  // is intentionally left alone — it is the avatar and is always captured on-farm.
  getObjectEntries(state.collectibles).forEach(([name, items]) => {
    if (layout.collectibles[name]) return;
    items?.forEach((item) => {
      item.coordinates = undefined;
    });
  });
  getObjectEntries(state.buildings).forEach(([name, items]) => {
    if (layout.buildings[name]) return;
    items?.forEach((item) => {
      item.coordinates = undefined;
    });
  });
  Object.entries(state.buds ?? {}).forEach(([id, bud]) => {
    if (!layout.buds?.[id]) bud.coordinates = undefined;
  });
  Object.entries(state.pets?.nfts ?? {}).forEach(([id, pet]) => {
    if (!layout.petNFTs?.[id]) pet.coordinates = undefined;
  });
  Object.entries(state.farmHands?.bumpkins ?? {}).forEach(([id, fh]) => {
    if (!layout.farmHands?.[id]) fh.coordinates = undefined;
  });

  // Everything is now lifted. Place each slot in turn against the live draft
  // (non-layout items + already-placed slots). A blocked slot stays unplaced
  // for now; reused instances get a best-effort restore pass below.
  let applied = 0;
  let skipped = 0;
  const blockedSlots: LayoutSlot[] = [];
  for (const slot of slots) {
    const blocked = detectCollision({
      state,
      position: slot.position,
      location: "farm",
      name: slot.name,
    });
    if (blocked) {
      skipped += 1;
      if (slot.restore) blockedSlots.push(slot);
    } else {
      slot.place();
      applied += 1;
    }
  }

  // Best-effort: an item whose saved spot was blocked stays where it was before
  // the layout lifted it, as long as that tile is still free (nothing in the new
  // arrangement claimed it). Otherwise it remains unplaced.
  for (const slot of blockedSlots) {
    const restore = slot.restore;
    if (!restore) continue;
    const stillBlocked = detectCollision({
      state,
      position: restore.position,
      location: "farm",
      name: slot.name,
    });
    if (!stillBlocked) restore.apply();
  }

  // Recompute honey now that beehives sit next to their flowers (mirrors the
  // place events, which call this whenever a beehive or flower bed is placed).
  if (affectsBeehives) {
    state.beehives = updateBeehives({ game: state, createdAt });
  }

  return { applied, skipped, noInventory };
}
