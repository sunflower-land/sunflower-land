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

/**
 * Snapshot the current farm arrangement into the position maps stored on a
 * {@link SavedLayout}. Captures every placed item (those with coordinates),
 * including the non-removable buildings (Town Center/House/Mansion/Manor) —
 * those can still be moved, so their position is part of the layout.
 */
export function snapshotFarm(
  state: GameState,
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
    if (!group) return;
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

  // Buds and Pet NFTs: single bucket each, distinguished from home/interior
  // copies by `location`. Neither is flippable, so store bare coordinates.
  const buds: NonNullable<SavedLayout["buds"]> = {};
  Object.entries(state.buds ?? {}).forEach(([id, bud]) => {
    if (!isOnFarm(bud)) return;
    buds[id] = { ...(bud.coordinates as LayoutCoordinates) };
  });

  const petNFTs: NonNullable<SavedLayout["petNFTs"]> = {};
  Object.entries(state.pets?.nfts ?? {}).forEach(([id, pet]) => {
    if (!isOnFarm(pet)) return;
    petNFTs[id] = { ...(pet.coordinates as LayoutCoordinates) };
  });

  // FarmHands (extra bumpkins) carry a `flipped` flag like the main Bumpkin.
  const farmHands: NonNullable<SavedLayout["farmHands"]> = {};
  Object.entries(state.farmHands?.bumpkins ?? {}).forEach(([id, farmHand]) => {
    if (!isOnFarm(farmHand)) return;
    farmHands[id] = {
      ...(farmHand.coordinates as LayoutCoordinates),
      ...(farmHand.flipped !== undefined ? { flipped: farmHand.flipped } : {}),
    };
  });

  const bumpkin = isOnFarm(state.bumpkin)
    ? {
        ...(state.bumpkin.coordinates as LayoutCoordinates),
        ...(state.bumpkin.flipped !== undefined
          ? { flipped: state.bumpkin.flipped }
          : {}),
      }
    : undefined;

  const land = {
    expansions: state.inventory["Basic Land"]?.toNumber() ?? 3,
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
};

/** Deterministic position order so FE and BE fill slots identically. */
const byPosition = (a: LayoutCoordinates, b: LayoutCoordinates) =>
  a.x - b.x || a.y - b.y;

/**
 * Arrange the player's OWNED items onto a saved layout's positions, driven by
 * inventory availability (not by saved id) so a layout can be shared between
 * players. Best-effort — mutates `state` in place (expects an Immer draft).
 *
 * Matching: collectibles/buildings/resources by name+availability; buds/pet
 * NFTs by id ownership; farmhands by however many are unlocked; the bumpkin
 * always. For each type the player's current farm placements are lifted, then
 * the type's saved positions are filled (in a deterministic order) from the
 * available instances — so owning fewer than the layout asks leaves the extra
 * positions empty (`noInventory`), and owning more leaves the extras unplaced.
 *
 * Collectibles & buildings are placed up to full inventory availability:
 * unplaced instances are reused first, then new instances are created (with
 * deterministic ids) from the remaining owned inventory. Resources/buds/pets/
 * farmhands reuse existing instances (resource nodes are pre-created by land
 * expansion, so reuse already covers what a player owns); positions with no
 * available instance count as `noInventory`. Positions blocked off-land or under
 * a non-layout item are `skipped`.
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
      group.forEach((item) => {
        if (item.coordinates) item.coordinates = undefined; // lift
      });
      const available = group
        .filter((item) => !item.coordinates)
        .sort((a, b) => a.id.localeCompare(b.id));
      const owned = getChestItemCount(
        state,
        name as InventoryItemName,
      ).toNumber();
      const capacity = Math.min(entries.length, owned);
      [...entries]
        .sort((a, b) => byPosition(a.coordinates, b.coordinates))
        .forEach((entry, i) => {
          if (i >= capacity) {
            noInventory += 1;
            return;
          }
          const reuse = available[i];
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
  let beehivePlaced = false;
  RESOURCE_BUCKETS.forEach(({ key, resourceName, get }) => {
    const dimensions = RESOURCE_DIMENSIONS[resourceName];
    const bucket = get(state);
    Object.values(bucket).forEach((node) => {
      if (node.x !== undefined) {
        node.x = undefined; // lift
        node.y = undefined;
      }
    });
    const available = Object.keys(bucket)
      .filter((id) => bucket[id].x === undefined)
      .sort((a, b) => a.localeCompare(b));
    const owned = isTieredFamily(key)
      ? getAvailableNodes(state, key).toNumber()
      : getChestItemCount(state, resourceName as InventoryItemName).toNumber();
    const positions = Object.values(layout.resources[key] ?? {}).sort(
      byPosition,
    );
    const capacity = Math.min(positions.length, owned);
    positions.forEach((coordinates, i) => {
      if (i >= capacity) {
        noInventory += 1;
        return;
      }
      const reuseId = available[i];
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
          if (key === "beehives") beehivePlaced = true;
        },
      });
    });
  });

  // Buds & Pet NFTs: by id ownership (shared-layout ids you don't own are
  // skipped silently). Pets must be revealed to be placed.
  Object.entries(layout.buds ?? {}).forEach(([id, coordinates]) => {
    const bud = state.buds?.[Number(id)];
    if (!bud) return;
    bud.coordinates = undefined; // lift
    slots.push({
      name: "Bud",
      position: { ...coordinates, ...BUD_DIMENSIONS },
      place: () => {
        bud.coordinates = { x: coordinates.x, y: coordinates.y };
        bud.location = "farm";
      },
    });
  });
  Object.entries(layout.petNFTs ?? {}).forEach(([id, coordinates]) => {
    // Owned by id (a pet in a layout was placed once, so it's already revealed).
    const pet = state.pets?.nfts?.[Number(id)];
    if (!pet) return;
    pet.coordinates = undefined; // lift
    slots.push({
      name: "Pet",
      position: { ...coordinates, ...PET_NFT_DIMENSIONS },
      place: () => {
        pet.coordinates = { x: coordinates.x, y: coordinates.y };
        pet.location = "farm";
      },
    });
  });

  // FarmHands: by count — bind the (id-sorted) unlocked farmhands to the
  // (position-sorted) saved slots, ignoring the saved ids.
  const farmHandIds = Object.keys(state.farmHands?.bumpkins ?? {}).sort(
    (a, b) => a.localeCompare(b),
  );
  farmHandIds.forEach((id) => {
    const fh = state.farmHands.bumpkins[id];
    if (fh.coordinates) fh.coordinates = undefined; // lift
  });
  Object.values(layout.farmHands ?? {})
    .sort(byPosition)
    .forEach((placement, i) => {
      const id = farmHandIds[i];
      if (id === undefined) {
        noInventory += 1;
        return;
      }
      const fh = state.farmHands.bumpkins[id];
      slots.push({
        name: "FarmHand",
        position: { ...placement, ...FARM_HAND_DIMENSIONS },
        place: () => {
          fh.coordinates = { x: placement.x, y: placement.y };
          fh.flipped = placement.flipped;
          fh.location = "farm";
        },
      });
    });

  // The player's own Bumpkin — always placed at its saved position.
  if (layout.bumpkin && state.bumpkin) {
    const placement = layout.bumpkin;
    const bumpkin = state.bumpkin;
    bumpkin.coordinates = undefined; // lift
    slots.push({
      name: "Bumpkin",
      position: { ...placement, ...BUMPKIN_DIMENSIONS },
      place: () => {
        bumpkin.coordinates = { x: placement.x, y: placement.y };
        bumpkin.flipped = placement.flipped;
        bumpkin.location = "farm";
      },
    });
  }

  // Everything is now lifted. Place each slot in turn against the live draft
  // (non-layout items + already-placed slots). A blocked slot stays unplaced.
  let applied = 0;
  let skipped = 0;
  for (const slot of slots) {
    const blocked = detectCollision({
      state,
      position: slot.position,
      location: "farm",
      name: slot.name,
    });
    if (blocked) {
      skipped += 1;
    } else {
      slot.place();
      applied += 1;
    }
  }

  // Recompute honey now that beehives sit next to their flowers (mirrors the
  // place events, which call this whenever a beehive or flower bed is placed).
  if (beehivePlaced) {
    state.beehives = updateBeehives({ game: state, createdAt });
  }

  return { applied, skipped, noInventory };
}
