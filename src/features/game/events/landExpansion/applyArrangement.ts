import type {
  GameState,
  LayoutCoordinates,
  PlacedItem,
  SavedLayout,
} from "features/game/types/game";
import type { PlaceableLocation } from "features/game/types/collectibles";
import {
  COLLECTIBLES_DIMENSIONS,
  type CollectibleName,
} from "features/game/types/craftables";
import {
  BUILDINGS_DIMENSIONS,
  type BuildingName,
} from "features/game/types/buildings";
import type { ResourceName } from "features/game/types/resources";
import { PET_NFT_DIMENSIONS } from "features/game/types/pets";
import {
  NON_COLLIDING_OBJECTS,
  detectWaterCollision,
  isOverlapping,
  type Position,
} from "features/game/expansion/placeable/lib/collisionDetection";
import cloneDeep from "lodash.clonedeep";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { refreshBasicScarecrowTimeAOE } from "features/game/lib/aoe";
import { getObjectEntries } from "lib/object";
import { PLACEABLE_DIMENSIONS, RESOURCE_BUCKETS } from "./lib/layouts";

type Dimensions = { width: number; height: number };
import { placeCollectible } from "./placeCollectible";
import { removeCollectible } from "./removeCollectible";
import { placeBuilding } from "./placeBuilding";
import { removeBuilding } from "./removeBuilding";
import { placeNFT, type NFTName } from "./placeNFT";
import { removeNFT } from "./removeNFT";
import { placeFarmHand } from "./placeFarmHand";
import { removeFarmHand } from "./removeFarmHand";
import { placeBumpkin } from "./placeBumpkin";
import { removeBumpkinPlacement } from "./removeBumpkinPlacement";
import { placeTree } from "./placeTree";
import { removeTree } from "./removeTree";
import { placeStone } from "./placeStone";
import { removeStone } from "./removeStone";
import { placeGold } from "./placeGold";
import { removeGold } from "./removeGold";
import { placeIron } from "./placeIron";
import { removeIron } from "./removeIron";
import { placeCrimstone } from "./placeCrimstone";
import { removeCrimstone } from "./removeCrimstone";
import { placeSunstone } from "./placeSunstone";
import { removeSunstone } from "./removeSunstone";
import { placeAscensionCrystal } from "./placeAscensionCrystal";
import { removeAscensionCrystal } from "./removeAscensionCrystal";
import { placeOilReserve } from "./placeOilReserve";
import { removeOilReserve } from "./removeOilReserve";
import { placePlot } from "./placePlot";
import { removePlot } from "./removePlot";
import { placeFruitPatch } from "./placeFruitPatch";
import { removeFruitPatch } from "./removeFruitPatch";
import { placeBeehive } from "./placeBeehive";
import { removeBeehive } from "./removeBeehive";
import { placeFlowerBed } from "./placeFlowerBed";
import { removeFlowerBed } from "./removeFlowerBed";
import { placeLavaPit } from "./placeLavaPit";
import { removeLavaPit } from "./removeLavaPit";

/**
 * The full desired arrangement of one location, in the same shape a
 * {@link SavedLayout} stores (produced by `snapshotFarm`). Items are addressed
 * by instance id; ids the server does not know are new placements from the
 * chest, ids it knows but the arrangement omits are removals.
 */
export type Arrangement = Pick<
  SavedLayout,
  | "collectibles"
  | "buildings"
  | "resources"
  | "buds"
  | "petNFTs"
  | "farmHands"
  | "bumpkin"
  | "land"
>;

export type ApplyArrangementAction = {
  type: "arrangement.saved";
  location: PlaceableLocation;
  arrangement: Arrangement;
};

export type ArrangementConflictCode =
  /** Two placed items overlap in the final arrangement (`with` names the other). */
  | "COLLISION"
  /** A footprint falls outside the player's land. */
  | "OFF_LAND"
  /** The real remove reducer refused (`reason` carries its message). */
  | "REMOVAL_BLOCKED"
  /** Town Center / House / Mansion / Manor can be moved but never lifted. */
  | "NOT_REMOVABLE"
  /** The real place reducer refused, e.g. nothing left in the chest. */
  | "NOT_OWNED"
  /** The instance is placed on another surface (home/interior/pet house). */
  | "PLACED_ELSEWHERE"
  /** Not a placeable name at all. */
  | "UNKNOWN_ITEM";

export type ArrangementConflict = {
  code: ArrangementConflictCode;
  name: string;
  id: string;
  coordinates?: { x: number; y: number };
  with?: { name: string; id: string };
  reason?: string;
};

export class ArrangementConflictError extends Error {
  readonly code = "ARRANGEMENT_CONFLICT" as const;

  constructor(readonly conflicts: ArrangementConflict[]) {
    super("ARRANGEMENT_CONFLICT");
    this.name = "ArrangementConflictError";
  }
}

const NON_REMOVABLE_BUILDINGS: readonly BuildingName[] = [
  "Town Center",
  "House",
  "Mansion",
  "Manor",
];

type ResourceBucketKey = keyof SavedLayout["resources"];

type Category =
  | "collectible"
  | "building"
  | "resource"
  | "bud"
  | "pet"
  | "farmHand"
  | "bumpkin";

/** One placed (or desired) item, flattened so live and desired can be diffed. */
type Entry = {
  key: string;
  category: Category;
  /** Item name; for resources the node's own name (tier) or the bucket's base. */
  name: string;
  id: string;
  bucket?: ResourceBucketKey;
  coordinates: LayoutCoordinates;
  flipped?: boolean;
  dimensions: Dimensions;
};

const BUD_DIMENSIONS: Dimensions = { width: 1, height: 1 };
const PERSON_DIMENSIONS: Dimensions = { width: 1, height: 1 };

const isOnFarm = (placed: { location?: string; coordinates?: unknown }) =>
  !!placed.coordinates && (!placed.location || placed.location === "farm");

const boxOf = (entry: Entry): Position => ({
  x: entry.coordinates.x,
  y: entry.coordinates.y,
  ...entry.dimensions,
});

const point = (c: LayoutCoordinates) => ({ x: c.x, y: c.y });

const sameCoordinates = (a: LayoutCoordinates, b: LayoutCoordinates) =>
  a.x === b.x && a.y === b.y && a.oX === b.oX && a.oY === b.oY;

const canCollide = (name: string) =>
  !NON_COLLIDING_OBJECTS.includes(name as CollectibleName);

const conflictOf = (
  entry: Entry,
  code: ArrangementConflictCode,
  extra: Partial<ArrangementConflict> = {},
): ArrangementConflict => ({
  code,
  name: entry.name,
  id: entry.id,
  coordinates: point(entry.coordinates),
  ...extra,
});

const withCoordinates = (c: LayoutCoordinates): PlacedItem["coordinates"] => ({
  x: c.x,
  y: c.y,
  ...(c.oX !== undefined ? { oX: c.oX } : {}),
  ...(c.oY !== undefined ? { oY: c.oY } : {}),
});

/** Every placed item on the farm, keyed for diffing. */
function indexLive(state: GameState): Map<string, Entry> {
  const entries = new Map<string, Entry>();
  const add = (entry: Entry) => entries.set(entry.key, entry);

  getObjectEntries(state.collectibles).forEach(([name, group]) => {
    group?.forEach((item) => {
      if (!item.coordinates) return;
      add({
        key: `collectible:${name}:${item.id}`,
        category: "collectible",
        name,
        id: item.id,
        coordinates: item.coordinates,
        flipped: item.flipped,
        dimensions: COLLECTIBLES_DIMENSIONS[name],
      });
    });
  });

  getObjectEntries(state.buildings).forEach(([name, group]) => {
    group?.forEach((item) => {
      if (!item.coordinates) return;
      add({
        key: `building:${name}:${item.id}`,
        category: "building",
        name,
        id: item.id,
        coordinates: item.coordinates,
        flipped: item.flipped,
        dimensions: BUILDINGS_DIMENSIONS[name],
      });
    });
  });

  RESOURCE_BUCKETS.forEach(({ key, get, resourceName }) => {
    Object.entries(get(state)).forEach(([id, node]) => {
      if (node.x === undefined || node.y === undefined) return;
      const name = (node as { name?: string }).name ?? resourceName;
      add({
        key: `resource:${key}:${id}`,
        category: "resource",
        name,
        id,
        bucket: key,
        coordinates: { x: node.x, y: node.y },
        dimensions: PLACEABLE_DIMENSIONS[resourceName],
      });
    });
  });

  Object.entries(state.buds ?? {}).forEach(([id, bud]) => {
    if (!isOnFarm(bud)) return;
    add({
      key: `bud:${id}`,
      category: "bud",
      name: "Bud",
      id,
      coordinates: bud.coordinates as LayoutCoordinates,
      dimensions: BUD_DIMENSIONS,
    });
  });

  Object.entries(state.pets?.nfts ?? {}).forEach(([id, pet]) => {
    if (!isOnFarm(pet)) return;
    add({
      key: `pet:${id}`,
      category: "pet",
      name: "Pet",
      id,
      coordinates: pet.coordinates as LayoutCoordinates,
      dimensions: PET_NFT_DIMENSIONS,
    });
  });

  Object.entries(state.farmHands?.bumpkins ?? {}).forEach(([id, farmHand]) => {
    if (!isOnFarm(farmHand)) return;
    add({
      key: `farmHand:${id}`,
      category: "farmHand",
      name: "FarmHand",
      id,
      coordinates: farmHand.coordinates as LayoutCoordinates,
      flipped: farmHand.flipped,
      dimensions: PERSON_DIMENSIONS,
    });
  });

  if (isOnFarm(state.bumpkin)) {
    add({
      key: "bumpkin",
      category: "bumpkin",
      name: "Bumpkin",
      // Matches the id the client renders the bumpkin under (PlacedBumpkin).
      id: "main",
      coordinates: state.bumpkin.coordinates as LayoutCoordinates,
      flipped: state.bumpkin.flipped,
      dimensions: PERSON_DIMENSIONS,
    });
  }

  return entries;
}

/**
 * Every desired placement, keyed like {@link indexLive}. Unknown names are
 * reported as conflicts rather than indexed.
 */
function indexDesired(
  state: GameState,
  arrangement: Arrangement,
  conflicts: ArrangementConflict[],
): Map<string, Entry> {
  const entries = new Map<string, Entry>();
  const add = (entry: Entry) => entries.set(entry.key, entry);

  Object.entries(arrangement.collectibles ?? {}).forEach(([name, items]) => {
    items?.forEach((item) => {
      if (!(name in COLLECTIBLES_DIMENSIONS)) {
        conflicts.push({
          code: "UNKNOWN_ITEM",
          name,
          id: item.id,
          coordinates: point(item.coordinates),
        });
        return;
      }
      add({
        key: `collectible:${name}:${item.id}`,
        category: "collectible",
        name,
        id: item.id,
        coordinates: item.coordinates,
        flipped: item.flipped,
        dimensions: COLLECTIBLES_DIMENSIONS[name as CollectibleName],
      });
    });
  });

  Object.entries(arrangement.buildings ?? {}).forEach(([name, items]) => {
    items?.forEach((item) => {
      if (!(name in BUILDINGS_DIMENSIONS)) {
        conflicts.push({
          code: "UNKNOWN_ITEM",
          name,
          id: item.id,
          coordinates: point(item.coordinates),
        });
        return;
      }
      add({
        key: `building:${name}:${item.id}`,
        category: "building",
        name,
        id: item.id,
        coordinates: item.coordinates,
        flipped: item.flipped,
        dimensions: BUILDINGS_DIMENSIONS[name as BuildingName],
      });
    });
  });

  RESOURCE_BUCKETS.forEach(({ key, get, resourceName }) => {
    Object.entries(arrangement.resources?.[key] ?? {}).forEach(
      ([id, coordinates]) => {
        const existing = get(state)[id] as { name?: string } | undefined;
        add({
          key: `resource:${key}:${id}`,
          category: "resource",
          name: existing?.name ?? resourceName,
          id,
          bucket: key,
          coordinates,
          dimensions: PLACEABLE_DIMENSIONS[resourceName],
        });
      },
    );
  });

  Object.entries(arrangement.buds ?? {}).forEach(([id, coordinates]) => {
    add({
      key: `bud:${id}`,
      category: "bud",
      name: "Bud",
      id,
      coordinates,
      dimensions: BUD_DIMENSIONS,
    });
  });

  Object.entries(arrangement.petNFTs ?? {}).forEach(([id, coordinates]) => {
    add({
      key: `pet:${id}`,
      category: "pet",
      name: "Pet",
      id,
      coordinates,
      dimensions: PET_NFT_DIMENSIONS,
    });
  });

  Object.entries(arrangement.farmHands ?? {}).forEach(([id, placement]) => {
    add({
      key: `farmHand:${id}`,
      category: "farmHand",
      name: "FarmHand",
      id,
      coordinates: placement,
      flipped: placement.flipped,
      dimensions: PERSON_DIMENSIONS,
    });
  });

  if (arrangement.bumpkin) {
    add({
      key: "bumpkin",
      category: "bumpkin",
      name: "Bumpkin",
      // Matches the id the client renders the bumpkin under (PlacedBumpkin).
      id: "main",
      coordinates: arrangement.bumpkin,
      flipped: arrangement.bumpkin.flipped,
      dimensions: PERSON_DIMENSIONS,
    });
  }

  return entries;
}

type ResourceReducers = {
  place: (args: {
    state: GameState;
    id: string;
    name: string;
    coordinates: { x: number; y: number };
    createdAt: number;
  }) => GameState;
  remove: (args: {
    state: GameState;
    id: string;
    createdAt: number;
  }) => GameState;
};

const RESOURCE_REDUCERS: Record<ResourceBucketKey, ResourceReducers> = {
  trees: {
    place: ({ state, id, name, coordinates, createdAt }) =>
      placeTree({
        state,
        action: { type: "tree.placed", id, name: name as never, coordinates },
        createdAt,
      }),
    remove: ({ state, id, createdAt }) =>
      removeTree({ state, action: { type: "tree.removed", id }, createdAt }),
  },
  stones: {
    place: ({ state, id, name, coordinates, createdAt }) =>
      placeStone({
        state,
        action: { type: "stone.placed", id, name: name as never, coordinates },
        createdAt,
      }),
    remove: ({ state, id, createdAt }) =>
      removeStone({ state, action: { type: "stone.removed", id }, createdAt }),
  },
  gold: {
    place: ({ state, id, name, coordinates, createdAt }) =>
      placeGold({
        state,
        action: { type: "gold.placed", id, name: name as never, coordinates },
        createdAt,
      }),
    remove: ({ state, id, createdAt }) =>
      removeGold({ state, action: { type: "gold.removed", id }, createdAt }),
  },
  iron: {
    place: ({ state, id, name, coordinates, createdAt }) =>
      placeIron({
        state,
        action: { type: "iron.placed", id, name: name as never, coordinates },
        createdAt,
      }),
    remove: ({ state, id, createdAt }) =>
      removeIron({ state, action: { type: "iron.removed", id }, createdAt }),
  },
  crimstones: {
    place: ({ state, id, name, coordinates, createdAt }) =>
      placeCrimstone({
        state,
        action: {
          type: "crimstone.placed",
          id,
          name: name as ResourceName,
          coordinates,
        },
        createdAt,
      }),
    remove: ({ state, id, createdAt }) =>
      removeCrimstone({
        state,
        action: { type: "crimstone.removed", id },
        createdAt,
      }),
  },
  sunstones: {
    place: ({ state, id, name, coordinates, createdAt }) =>
      placeSunstone({
        state,
        action: {
          type: "sunstone.placed",
          id,
          name: name as ResourceName,
          coordinates,
        },
        createdAt,
      }),
    remove: ({ state, id, createdAt }) =>
      removeSunstone({
        state,
        action: { type: "sunstone.removed", id },
        createdAt,
      }),
  },
  ascensionCrystals: {
    place: ({ state, id, name, coordinates, createdAt }) =>
      placeAscensionCrystal({
        state,
        action: {
          type: "ascensionCrystal.placed",
          id,
          name: name as ResourceName,
          coordinates,
        },
        createdAt,
      }),
    remove: ({ state, id, createdAt }) =>
      removeAscensionCrystal({
        state,
        action: { type: "ascensionCrystal.removed", id },
        createdAt,
      }),
  },
  oilReserves: {
    place: ({ state, id, coordinates, createdAt }) =>
      placeOilReserve({
        state,
        action: { type: "oilReserve.placed", id, coordinates },
        createdAt,
      }),
    remove: ({ state, id, createdAt }) =>
      removeOilReserve({
        state,
        action: { type: "oilReserve.removed", id },
        createdAt,
      }),
  },
  crops: {
    place: ({ state, id, coordinates, createdAt }) =>
      placePlot({
        state,
        action: { type: "plot.placed", id, name: "Crop Plot", coordinates },
        createdAt,
      }),
    remove: ({ state, id, createdAt }) =>
      removePlot({ state, action: { type: "plot.removed", id }, createdAt }),
  },
  fruitPatches: {
    place: ({ state, id, coordinates, createdAt }) =>
      placeFruitPatch({
        state,
        action: {
          type: "fruitPatch.placed",
          id,
          name: "Fruit Patch",
          coordinates,
        },
        createdAt,
      }),
    remove: ({ state, id, createdAt }) =>
      removeFruitPatch({
        state,
        action: { type: "fruitPatch.removed", id },
        createdAt,
      }),
  },
  beehives: {
    place: ({ state, id, coordinates, createdAt }) =>
      placeBeehive({
        state,
        action: { type: "beehive.placed", id, coordinates },
        createdAt,
      }),
    remove: ({ state, id, createdAt }) =>
      removeBeehive({
        state,
        action: { type: "beehive.removed", id },
        createdAt,
      }),
  },
  flowerBeds: {
    place: ({ state, id, coordinates, createdAt }) =>
      placeFlowerBed({
        state,
        action: { type: "flowerBed.placed", id, coordinates },
        createdAt,
      }),
    remove: ({ state, id, createdAt }) =>
      removeFlowerBed({
        state,
        action: { type: "flowerBed.removed", id },
        createdAt,
      }),
  },
  lavaPits: {
    place: ({ state, id, coordinates, createdAt }) =>
      placeLavaPit({
        state,
        action: { type: "lavaPit.placed", id, name: "Lava Pit", coordinates },
        createdAt,
      }),
    remove: ({ state, id, createdAt }) =>
      removeLavaPit({
        state,
        action: { type: "lavaPit.removed", id },
        createdAt,
      }),
  },
};

/**
 * The place reducers reuse "the first unplaced instance" of a name rather than
 * a specific id. To re-place exactly the instance the arrangement names, every
 * other unplaced instance of that name is hidden from the state for the
 * duration of the reducer call and restored afterwards.
 */
function withIsolatedCollectible(
  state: GameState,
  name: CollectibleName,
  id: string,
  run: (state: GameState) => GameState,
): GameState {
  type Surface = {
    get: (s: GameState) => PlacedItem[] | undefined;
    set: (s: GameState, items: PlacedItem[]) => void;
  };
  const surfaces: Surface[] = [
    {
      get: (s) => s.collectibles[name],
      set: (s, i) => {
        s.collectibles[name] = i;
      },
    },
    {
      get: (s) => s.home.collectibles[name],
      set: (s, i) => {
        s.home.collectibles[name] = i;
      },
    },
    {
      get: (s) => s.interior?.ground.collectibles[name],
      set: (s, i) => {
        s.interior.ground.collectibles[name] = i;
      },
    },
    {
      get: (s) => s.interior?.level_one?.collectibles[name],
      set: (s, i) => {
        if (s.interior.level_one) s.interior.level_one.collectibles[name] = i;
      },
    },
    {
      get: (s) =>
        (s.petHouse?.pets as Record<string, PlacedItem[] | undefined>)?.[name],
      set: (s, i) => {
        (s.petHouse.pets as Record<string, PlacedItem[]>)[name] = i;
      },
    },
  ];

  const hidden = surfaces.map((surface) => {
    const items = surface.get(state);
    if (!items) return [];
    const away = items.filter((item) => !item.coordinates && item.id !== id);
    if (away.length > 0) {
      surface.set(
        state,
        items.filter((item) => !away.includes(item)),
      );
    }
    return away;
  });

  const next = thaw(run(state));

  surfaces.forEach((surface, i) => {
    if (hidden[i].length === 0) return;
    surface.set(next, [...(surface.get(next) ?? []), ...hidden[i]]);
  });

  return next;
}

function withIsolatedBuilding(
  state: GameState,
  name: BuildingName,
  id: string,
  run: (state: GameState) => GameState,
): GameState {
  const items = state.buildings[name] ?? [];
  const away = items.filter((item) => !item.coordinates && item.id !== id);
  if (away.length > 0) {
    state.buildings[name] = items.filter((item) => !away.includes(item));
  }

  const next = thaw(run(state));

  if (away.length > 0) {
    next.buildings[name] = [...(next.buildings[name] ?? []), ...away];
  }
  return next;
}

function withIsolatedResource(
  state: GameState,
  bucket: ResourceBucketKey,
  id: string,
  run: (state: GameState) => GameState,
): GameState {
  const get = RESOURCE_BUCKETS.find((b) => b.key === bucket)!.get;
  const nodes = get(state) as Record<string, { x?: number; y?: number }>;
  const target = nodes[id] as { name?: string } | undefined;
  const away: Record<string, unknown> = {};
  Object.entries(nodes).forEach(([nodeId, node]) => {
    if (nodeId === id || node.x !== undefined) return;
    const sameName = (node as { name?: string }).name === target?.name;
    if (!sameName) return;
    away[nodeId] = node;
    delete nodes[nodeId];
  });

  const next = thaw(run(state));

  Object.assign(get(next), away);
  return next;
}

type Options = {
  state: Readonly<GameState>;
  action: ApplyArrangementAction;
  farmId?: number;
  createdAt: number;
};

/**
 * Rearranges the farm onto a full desired arrangement in one commit — the
 * server side of the landscaping sandbox. Diff-based so every existing
 * placement side effect is kept:
 *
 * - items the arrangement omits go through the real `remove*` reducers
 *   (removal restrictions, honey credit, `removedAt`),
 * - items that only moved get a plain coordinate/flip write (a lift-and-replace
 *   inside one session is a move: no timer pause, no `removedAt`),
 * - ids the server doesn't know go through the real `place*` reducers with the
 *   client id (chest availability, paused-timer resume, `createdAt`).
 *
 * All-or-nothing: the final state is validated as a whole (land bounds, pairwise
 * overlap, so swaps never false-positive) and any problem throws an
 * {@link ArrangementConflictError} listing every offending item. Mirrors the
 * server reducer (sunflower-land-api `applyArrangement`); the server also
 * relocates mushrooms/airdrops/clutter under a footprint.
 */
export function applyArrangement({
  state,
  action,
  farmId = 0,
  createdAt,
}: Options): GameState {
  if (action.location !== "farm") {
    throw new Error(`Unsupported arrangement location: ${action.location}`);
  }

  const conflicts: ArrangementConflict[] = [];
  const live = indexLive(state);
  const desired = indexDesired(state, action.arrangement, conflicts);

  let working = cloneDeep(state);
  let beesChanged = false;
  const touchesBees = (entry: Entry) => {
    if (entry.bucket === "beehives" || entry.bucket === "flowerBeds") {
      beesChanged = true;
    }
  };

  // --- Removals: live items the arrangement no longer places. -------------
  live.forEach((entry) => {
    if (desired.has(entry.key)) return;

    if (
      entry.category === "building" &&
      NON_REMOVABLE_BUILDINGS.includes(entry.name as BuildingName)
    ) {
      conflicts.push(conflictOf(entry, "NOT_REMOVABLE"));
      return;
    }

    try {
      working = thaw(removeEntry(working, entry, createdAt));
      touchesBees(entry);
    } catch (e) {
      conflicts.push(
        conflictOf(entry, "REMOVAL_BLOCKED", {
          reason: e instanceof Error ? e.message : String(e),
        }),
      );
    }
  });

  // --- Moves & flips: same instance, different spot. ----------------------
  desired.forEach((entry) => {
    const current = live.get(entry.key);
    if (!current) return;
    if (
      sameCoordinates(current.coordinates, entry.coordinates) &&
      current.flipped === entry.flipped
    ) {
      return;
    }
    moveEntry(working, entry);
    touchesBees(entry);
  });

  // --- Placements: ids the farm doesn't have placed. ----------------------
  const placements = [...desired.values()].filter((e) => !live.has(e.key));

  // The server additionally lifts and respawns mushrooms/airdrops/clutter under
  // a footprint; the sandbox already blocks those spots client-side, so the FE
  // copy (ART_MODE + parity) skips that pass.

  const placed = [...indexLive(working).values()];
  placements.forEach((entry) => {
    const elsewhere = placedElsewhere(working, entry);
    if (elsewhere) {
      conflicts.push(conflictOf(entry, "PLACED_ELSEWHERE"));
      return;
    }

    const box = boxOf(entry);
    if (detectWaterCollision(expansionsOf(working), box)) {
      conflicts.push(conflictOf(entry, "OFF_LAND"));
      return;
    }
    const blocker = canCollide(entry.name)
      ? placed.find(
          (other) => canCollide(other.name) && isOverlapping(box, boxOf(other)),
        )
      : undefined;
    if (blocker) {
      conflicts.push(
        conflictOf(entry, "COLLISION", {
          with: { name: blocker.name, id: blocker.id },
        }),
      );
      return;
    }

    try {
      working = placeEntry(working, entry, farmId, createdAt);
      placed.push(entry);
      touchesBees(entry);
    } catch (e) {
      conflicts.push(
        conflictOf(
          entry,
          e instanceof Error && /collides/.test(e.message)
            ? "COLLISION"
            : "NOT_OWNED",
          {
            reason: e instanceof Error ? e.message : String(e),
          },
        ),
      );
    }
  });

  // --- Validate the final state as a whole. --------------------------------
  const final = [...indexLive(working).values()];
  const expansions = expansionsOf(working);
  final.forEach((entry) => {
    if (detectWaterCollision(expansions, boxOf(entry))) {
      // Already reported for placements above.
      if (!placements.some((p) => p.key === entry.key)) {
        conflicts.push(conflictOf(entry, "OFF_LAND"));
      }
    }
  });
  for (let i = 0; i < final.length; i++) {
    const a = final[i];
    if (!canCollide(a.name)) continue;
    for (let j = 0; j < i; j++) {
      const b = final[j];
      if (!canCollide(b.name)) continue;
      if (!isOverlapping(boxOf(a), boxOf(b))) continue;
      // Blame the item that moved/was placed; fall back to the later one.
      const [culprit, other] =
        live.get(a.key) &&
        sameCoordinates(live.get(a.key)!.coordinates, a.coordinates)
          ? [b, a]
          : [a, b];
      if (
        conflicts.some(
          (c) =>
            c.code === "COLLISION" &&
            c.id === culprit.id &&
            c.name === culprit.name &&
            c.with?.id === other.id &&
            c.with?.name === other.name,
        )
      ) {
        continue;
      }
      conflicts.push(
        conflictOf(culprit, "COLLISION", {
          with: { name: other.name, id: other.id },
        }),
      );
    }
  }

  if (conflicts.length > 0) {
    throw new ArrangementConflictError(conflicts);
  }

  // --- Post passes, once. ---------------------------------------------------
  if (beesChanged) {
    working = {
      ...working,
      beehives: updateBeehives({ game: working, createdAt }),
    };
  }
  refreshBasicScarecrowTimeAOE(working);

  return working;
}

const expansionsOf = (state: GameState) =>
  state.inventory["Basic Land"]?.toNumber() ?? 3;

/**
 * Several reducers build their result with immer, which auto-freezes it. The
 * commit keeps mutating its working copy between reducer calls, so every
 * reducer result is cloned back into a plain object first.
 */
const thaw = (state: GameState): GameState => cloneDeep(state);

function removeEntry(
  state: GameState,
  entry: Entry,
  createdAt: number,
): GameState {
  switch (entry.category) {
    case "collectible":
      return removeCollectible({
        state,
        action: {
          type: "collectible.removed",
          name: entry.name as CollectibleName,
          id: entry.id,
          location: "farm",
        },
        createdAt,
      });
    case "building":
      return removeBuilding({
        state,
        action: {
          type: "building.removed",
          name: entry.name as BuildingName,
          id: entry.id,
        },
        createdAt,
      });
    case "resource":
      return RESOURCE_REDUCERS[entry.bucket!].remove({
        state,
        id: entry.id,
        createdAt,
      });
    case "bud":
    case "pet":
      return removeNFT({
        state,
        action: {
          type: "nft.removed",
          id: entry.id,
          nft: (entry.category === "bud" ? "Bud" : "Pet") as NFTName,
          location: "farm",
        },
        createdAt,
      });
    case "farmHand":
      return removeFarmHand({
        state,
        action: { type: "farmHand.removed", id: entry.id, location: "farm" },
      });
    case "bumpkin":
      return removeBumpkinPlacement({
        state,
        action: { type: "bumpkin.removedPlacement", location: "farm" },
        createdAt,
      });
  }
}

/** Plain coordinate/flip write on an instance that stays placed. */
function moveEntry(state: GameState, entry: Entry): void {
  const setFlip = (item: { flipped?: boolean }) => {
    if (entry.flipped === undefined) delete item.flipped;
    else item.flipped = entry.flipped;
  };

  switch (entry.category) {
    case "collectible": {
      const item = (
        state.collectibles[entry.name as CollectibleName] ?? []
      ).find((c) => c.id === entry.id) as PlacedItem;
      item.coordinates = withCoordinates(entry.coordinates);
      setFlip(item);
      return;
    }
    case "building": {
      const item = (state.buildings[entry.name as BuildingName] ?? []).find(
        (b) => b.id === entry.id,
      ) as PlacedItem;
      item.coordinates = withCoordinates(entry.coordinates);
      setFlip(item);
      return;
    }
    case "resource": {
      const node = RESOURCE_BUCKETS.find((b) => b.key === entry.bucket)!.get(
        state,
      )[entry.id];
      node.x = entry.coordinates.x;
      node.y = entry.coordinates.y;
      return;
    }
    case "bud": {
      const bud = state.buds![Number(entry.id)];
      bud.coordinates = point(entry.coordinates);
      bud.location = "farm";
      return;
    }
    case "pet": {
      const pet = state.pets!.nfts![Number(entry.id)];
      pet.coordinates = point(entry.coordinates);
      pet.location = "farm";
      return;
    }
    case "farmHand": {
      const farmHand = state.farmHands.bumpkins[entry.id];
      farmHand.coordinates = point(entry.coordinates);
      farmHand.location = "farm";
      setFlip(farmHand);
      return;
    }
    case "bumpkin": {
      state.bumpkin.coordinates = point(entry.coordinates);
      state.bumpkin.location = "farm";
      setFlip(state.bumpkin);
      return;
    }
  }
}

/** True when the desired instance is currently placed on another surface. */
function placedElsewhere(state: GameState, entry: Entry): boolean {
  switch (entry.category) {
    case "collectible": {
      const name = entry.name as CollectibleName;
      const surfaces: (PlacedItem[] | undefined)[] = [
        state.home.collectibles[name],
        state.interior?.ground.collectibles[name],
        state.interior?.level_one?.collectibles[name],
        (state.petHouse?.pets as Record<string, PlacedItem[] | undefined>)?.[
          name
        ],
      ];
      return surfaces.some((items) =>
        items?.some((item) => item.id === entry.id && !!item.coordinates),
      );
    }
    case "bud": {
      const bud = state.buds?.[Number(entry.id)];
      return !!bud?.coordinates && !!bud.location && bud.location !== "farm";
    }
    case "pet": {
      const pet = state.pets?.nfts?.[Number(entry.id)];
      return !!pet?.coordinates && !!pet.location && pet.location !== "farm";
    }
    case "farmHand": {
      const fh = state.farmHands?.bumpkins?.[entry.id];
      return !!fh?.coordinates && !!fh.location && fh.location !== "farm";
    }
    case "bumpkin":
      return (
        !!state.bumpkin.coordinates &&
        !!state.bumpkin.location &&
        state.bumpkin.location !== "farm"
      );
    default:
      return false;
  }
}

function placeEntry(
  state: GameState,
  entry: Entry,
  farmId: number,
  createdAt: number,
): GameState {
  const coordinates = point(entry.coordinates);

  switch (entry.category) {
    case "collectible": {
      const name = entry.name as CollectibleName;
      const run = (s: GameState) =>
        placeCollectible({
          state: s,
          action: {
            type: "collectible.placed",
            name,
            id: entry.id,
            coordinates,
            location: "farm",
          },
          createdAt,
        });
      const knownUnplaced = state.collectibles[name]?.some(
        (item) => item.id === entry.id && !item.coordinates,
      );
      const next = knownUnplaced
        ? withIsolatedCollectible(state, name, entry.id, run)
        : thaw(run(state));
      const item = next.collectibles[name]!.find(
        (c) =>
          !!c.coordinates &&
          c.coordinates.x === coordinates.x &&
          c.coordinates.y === coordinates.y,
      )!;
      // The reducer may have reused another unplaced instance; the arrangement
      // is the contract, so the placed instance takes the requested id.
      item.id = entry.id;
      item.coordinates = withCoordinates(entry.coordinates);
      if (entry.flipped !== undefined) item.flipped = entry.flipped;
      return next;
    }
    case "building": {
      const name = entry.name as BuildingName;
      const run = (s: GameState) =>
        placeBuilding({
          state: s,
          action: { type: "building.placed", name, id: entry.id, coordinates },
          farmId,
          createdAt,
        });
      const knownUnplaced = state.buildings[name]?.some(
        (item) => item.id === entry.id && !item.coordinates,
      );
      const next = knownUnplaced
        ? withIsolatedBuilding(state, name, entry.id, run)
        : thaw(run(state));
      const item = next.buildings[name]!.find(
        (b) =>
          !!b.coordinates &&
          b.coordinates.x === coordinates.x &&
          b.coordinates.y === coordinates.y,
      )!;
      item.id = entry.id;
      item.coordinates = withCoordinates(entry.coordinates);
      if (entry.flipped !== undefined) item.flipped = entry.flipped;
      return next;
    }
    case "resource": {
      const bucket = entry.bucket!;
      const get = RESOURCE_BUCKETS.find((b) => b.key === bucket)!.get;
      const run = (s: GameState) =>
        RESOURCE_REDUCERS[bucket].place({
          state: s,
          id: entry.id,
          name: entry.name,
          coordinates,
          createdAt,
        });
      const known = get(state)[entry.id];
      const next =
        known && known.x === undefined
          ? withIsolatedResource(state, bucket, entry.id, run)
          : thaw(run(state));
      const nodes = get(next) as Record<string, { x?: number; y?: number }>;
      if (!nodes[entry.id] || nodes[entry.id].x !== coordinates.x) {
        // Reused a different unplaced node: re-key it to the requested id.
        const reusedId = Object.keys(nodes).find(
          (id) =>
            nodes[id].x === coordinates.x &&
            nodes[id].y === coordinates.y &&
            !get(state)[id]?.x,
        );
        if (reusedId && reusedId !== entry.id) {
          nodes[entry.id] = nodes[reusedId];
          delete nodes[reusedId];
        }
      }
      return next;
    }
    case "bud":
    case "pet": {
      const nft = entry.category === "bud" ? "Bud" : "Pet";
      return thaw(
        placeNFT({
          state,
          action: {
            type: "nft.placed",
            id: entry.id,
            nft,
            coordinates,
            location: "farm",
          },
          createdAt,
        }),
      );
    }
    case "farmHand": {
      const next = thaw(
        placeFarmHand({
          state,
          action: {
            type: "farmHand.placed",
            id: entry.id,
            coordinates,
            location: "farm",
          },
          createdAt,
        }),
      );
      if (entry.flipped !== undefined) {
        next.farmHands.bumpkins[entry.id].flipped = entry.flipped;
      }
      return next;
    }
    case "bumpkin": {
      const next = thaw(
        placeBumpkin({
          state,
          action: { type: "bumpkin.placed", coordinates, location: "farm" },
          createdAt,
        }),
      );
      if (entry.flipped !== undefined) next.bumpkin.flipped = entry.flipped;
      return next;
    }
  }
}
