import type {
  Collectibles,
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
  isOutOfBounds,
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
  "collectibles" | "buds" | "petNFTs" | "farmHands" | "bumpkin" | "land"
> &
  // Only the farm has buildings and resource nodes; indoor surfaces omit them.
  Partial<Pick<SavedLayout, "buildings" | "resources">>;

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

/** Where a Bumpkin or FarmHand may stand — everywhere but the pet house. */
type PersonLocation = Exclude<PlaceableLocation, "petHouse">;

const BUD_DIMENSIONS: Dimensions = { width: 1, height: 1 };
const PERSON_DIMENSIONS: Dimensions = { width: 1, height: 1 };

/**
 * What each placeable surface holds. Every landscaping location commits through
 * the same diff; they differ only in which buckets exist and where the
 * collectibles live. Buildings and resource nodes are farm-only, and the pet
 * house takes pets (as collectibles) and Pet NFTs but no Buds, FarmHands or
 * Bumpkin.
 */
type Surface = {
  /** This surface's collectible bucket, or undefined when it isn't built yet. */
  getCollectibles: (state: GameState) => Collectibles | undefined;
  hasBuildings: boolean;
  hasResources: boolean;
  buds: boolean;
  petNFTs: boolean;
  farmHands: boolean;
  bumpkin: boolean;
};

const SURFACES: Record<PlaceableLocation, Surface> = {
  farm: {
    getCollectibles: (s) => s.collectibles,
    hasBuildings: true,
    hasResources: true,
    buds: true,
    petNFTs: true,
    farmHands: true,
    bumpkin: true,
  },
  home: {
    getCollectibles: (s) => s.home.collectibles,
    hasBuildings: false,
    hasResources: false,
    buds: true,
    petNFTs: true,
    farmHands: true,
    bumpkin: true,
  },
  interior: {
    getCollectibles: (s) => s.interior.ground.collectibles,
    hasBuildings: false,
    hasResources: false,
    buds: true,
    petNFTs: true,
    farmHands: true,
    bumpkin: true,
  },
  level_one: {
    getCollectibles: (s) => s.interior.level_one?.collectibles,
    hasBuildings: false,
    hasResources: false,
    buds: true,
    petNFTs: true,
    farmHands: true,
    bumpkin: true,
  },
  petHouse: {
    getCollectibles: (s) => s.petHouse?.pets as Collectibles | undefined,
    hasBuildings: false,
    hasResources: false,
    buds: false,
    petNFTs: true,
    farmHands: false,
    bumpkin: false,
  },
};

/**
 * Capture what is currently placed on `location`, in the shape the commit
 * accepts. The client edits this locally and posts the result; a round trip
 * through {@link applyArrangement} with an untouched snapshot is a no-op.
 *
 * The farm equivalent used by saved layouts is `snapshotFarm` in ./layouts —
 * that one also records land extent for previews and is bound to the
 * `SavedLayout` storage shape, so the two stay separate on purpose.
 */
export function snapshotSurface(
  state: GameState,
  location: PlaceableLocation,
): Arrangement {
  const surface = SURFACES[location];
  const arrangement: Arrangement = { collectibles: {} };

  getObjectEntries<Collectibles>(surface.getCollectibles(state) ?? {}).forEach(
    ([name, group]) => {
      const placed = (group ?? [])
        .filter((item) => !!item.coordinates)
        .map((item) => ({
          id: item.id,
          coordinates: { ...item.coordinates } as LayoutCoordinates,
          ...(item.flipped !== undefined ? { flipped: item.flipped } : {}),
        }));
      if (placed.length > 0) arrangement.collectibles[name] = placed;
    },
  );

  if (surface.hasBuildings) {
    const buildings: NonNullable<Arrangement["buildings"]> = {};
    getObjectEntries(state.buildings).forEach(([name, group]) => {
      const placed = (group ?? [])
        .filter((item) => !!item.coordinates)
        .map((item) => ({
          id: item.id,
          coordinates: { ...item.coordinates } as LayoutCoordinates,
          ...(item.flipped !== undefined ? { flipped: item.flipped } : {}),
        }));
      if (placed.length > 0) buildings[name] = placed;
    });
    arrangement.buildings = buildings;
  }

  if (surface.hasResources) {
    const resources = {} as NonNullable<Arrangement["resources"]>;
    RESOURCE_BUCKETS.forEach(({ key, get }) => {
      resources[key] = {};
      Object.entries(get(state)).forEach(([id, node]) => {
        if (node.x === undefined || node.y === undefined) return;
        const coordinates: LayoutCoordinates = { x: node.x, y: node.y };
        if (node.oX !== undefined) coordinates.oX = node.oX;
        if (node.oY !== undefined) coordinates.oY = node.oY;
        resources[key][id] = coordinates;
      });
    });
    arrangement.resources = resources;
  }

  if (surface.buds) {
    const buds: NonNullable<Arrangement["buds"]> = {};
    Object.entries(state.buds ?? {}).forEach(([id, bud]) => {
      if (isOnSurface(bud, location)) {
        buds[id] = { ...(bud.coordinates as LayoutCoordinates) };
      }
    });
    arrangement.buds = buds;
  }

  if (surface.petNFTs) {
    const petNFTs: NonNullable<Arrangement["petNFTs"]> = {};
    Object.entries(state.pets?.nfts ?? {}).forEach(([id, pet]) => {
      if (isOnSurface(pet, location)) {
        petNFTs[id] = { ...(pet.coordinates as LayoutCoordinates) };
      }
    });
    arrangement.petNFTs = petNFTs;
  }

  if (surface.farmHands) {
    const farmHands: NonNullable<Arrangement["farmHands"]> = {};
    Object.entries(state.farmHands?.bumpkins ?? {}).forEach(([id, hand]) => {
      if (!isOnSurface(hand, location)) return;
      farmHands[id] = {
        ...(hand.coordinates as LayoutCoordinates),
        ...(hand.flipped !== undefined ? { flipped: hand.flipped } : {}),
      };
    });
    arrangement.farmHands = farmHands;
  }

  if (surface.bumpkin && isOnSurface(state.bumpkin, location)) {
    arrangement.bumpkin = {
      ...(state.bumpkin.coordinates as LayoutCoordinates),
      ...(state.bumpkin.flipped !== undefined
        ? { flipped: state.bumpkin.flipped }
        : {}),
    };
  }

  return arrangement;
}

/**
 * True when a placeable sits on `location`. Legacy items carry no `location`
 * and are farm-placed by convention.
 */
const isOnSurface = (
  placed: { location?: string; coordinates?: unknown },
  location: PlaceableLocation,
) => !!placed.coordinates && (placed.location ?? "farm") === location;

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

/**
 * Resource nodes keep their render offsets as flat `oX`/`oY` fields (unlike a
 * PlacedItem's nested `coordinates`). Nothing in the UI nudges a resource, but
 * a saved layout can write offsets onto one and the farm renders them, so the
 * commit carries them exactly like a collectible's: set when the arrangement
 * has them, cleared when it doesn't.
 */
const writeResourceOffsets = (
  node: { oX?: number; oY?: number } | undefined,
  c: LayoutCoordinates,
): void => {
  if (!node) return;
  if (c.oX !== undefined) node.oX = c.oX;
  else delete node.oX;
  if (c.oY !== undefined) node.oY = c.oY;
  else delete node.oY;
};

const withCoordinates = (c: LayoutCoordinates): PlacedItem["coordinates"] => ({
  x: c.x,
  y: c.y,
  ...(c.oX !== undefined ? { oX: c.oX } : {}),
  ...(c.oY !== undefined ? { oY: c.oY } : {}),
});

/** Every item placed on `location`, keyed for diffing. */
function indexLive(
  state: GameState,
  location: PlaceableLocation,
): Map<string, Entry> {
  const surface = SURFACES[location];
  const entries = new Map<string, Entry>();
  const add = (entry: Entry) => entries.set(entry.key, entry);

  const liveCollectibles: Collectibles = surface.getCollectibles(state) ?? {};
  getObjectEntries(liveCollectibles).forEach(([name, group]) => {
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

  if (surface.hasBuildings)
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

  if (surface.hasResources)
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
          // Offsets are part of the coordinates: an offset node in an
          // unchanged arrangement must not read as a move.
          coordinates: {
            x: node.x,
            y: node.y,
            ...(node.oX !== undefined ? { oX: node.oX } : {}),
            ...(node.oY !== undefined ? { oY: node.oY } : {}),
          },
          dimensions: PLACEABLE_DIMENSIONS[resourceName],
        });
      });
    });

  if (surface.buds)
    Object.entries(state.buds ?? {}).forEach(([id, bud]) => {
      if (!isOnSurface(bud, location)) return;
      add({
        key: `bud:${id}`,
        category: "bud",
        name: "Bud",
        id,
        coordinates: bud.coordinates as LayoutCoordinates,
        dimensions: BUD_DIMENSIONS,
      });
    });

  if (surface.petNFTs)
    Object.entries(state.pets?.nfts ?? {}).forEach(([id, pet]) => {
      if (!isOnSurface(pet, location)) return;
      add({
        key: `pet:${id}`,
        category: "pet",
        name: "Pet",
        id,
        coordinates: pet.coordinates as LayoutCoordinates,
        dimensions: PET_NFT_DIMENSIONS,
      });
    });

  if (surface.farmHands)
    Object.entries(state.farmHands?.bumpkins ?? {}).forEach(
      ([id, farmHand]) => {
        if (!isOnSurface(farmHand, location)) return;
        add({
          key: `farmHand:${id}`,
          category: "farmHand",
          name: "FarmHand",
          id,
          coordinates: farmHand.coordinates as LayoutCoordinates,
          flipped: farmHand.flipped,
          dimensions: PERSON_DIMENSIONS,
        });
      },
    );

  if (surface.bumpkin && isOnSurface(state.bumpkin, location)) {
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
  location: PlaceableLocation,
  arrangement: Arrangement,
  conflicts: ArrangementConflict[],
): Map<string, Entry> {
  const surface = SURFACES[location];
  const entries = new Map<string, Entry>();
  const add = (entry: Entry) => {
    // Instances are addressed by key; a repeat would silently collapse here
    // and the commit would apply only one of the two the client sent.
    if (entries.has(entry.key)) {
      throw new Error(`Duplicate id in arrangement: ${entry.key}`);
    }
    entries.set(entry.key, entry);
  };

  // The payload is the FULL desired state of this surface. Two malformed
  // shapes are rejected outright rather than turned into conflicts - the
  // player cannot fix either by moving an item:
  //   - a bucket the surface cannot hold (e.g. buildings indoors);
  //   - a bucket the surface holds but the payload omits. Reading that as
  //     "empty" would lift everything in it, so a client that dropped a field
  //     must fail loudly. The API's Joi enforces the same on the wire; this
  //     covers ART_MODE and keeps the reducer self-sufficient.
  const cannotContain = (bucket: string) => {
    throw new Error(`Arrangement for ${location} cannot contain ${bucket}`);
  };
  const mustInclude = (bucket: string) => {
    throw new Error(`Arrangement for ${location} must include ${bucket}`);
  };
  const nonEmpty = (record: object | undefined) =>
    Object.keys(record ?? {}).length > 0;

  if (surface.hasBuildings) {
    if (!arrangement.buildings) mustInclude("buildings");
  } else if (nonEmpty(arrangement.buildings)) cannotContain("buildings");

  if (surface.hasResources) {
    if (!arrangement.resources) mustInclude("resources");
  } else if (Object.values(arrangement.resources ?? {}).some(nonEmpty))
    cannotContain("resources");

  if (surface.buds) {
    if (!arrangement.buds) mustInclude("buds");
  } else if (nonEmpty(arrangement.buds)) cannotContain("buds");

  if (!arrangement.petNFTs) mustInclude("petNFTs");

  if (surface.farmHands) {
    if (!arrangement.farmHands) mustInclude("farm hands");
  } else if (nonEmpty(arrangement.farmHands)) cannotContain("farm hands");

  if (!surface.bumpkin && arrangement.bumpkin) cannotContain("a bumpkin");

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

  if (surface.hasResources)
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
  const { location } = action;
  const surface = SURFACES[location];
  if (!surface) {
    throw new Error(`Unsupported arrangement location: ${location}`);
  }
  // A surface that hasn't been built has nothing to rearrange, and its bounds
  // check would reject every position anyway.
  if (!surface.getCollectibles(state)) {
    throw new Error(`Arrangement location is not unlocked: ${location}`);
  }

  const conflicts: ArrangementConflict[] = [];
  const live = indexLive(state, location);
  const desired = indexDesired(state, location, action.arrangement, conflicts);

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
      working = thaw(removeEntry(working, entry, location, createdAt));
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
    moveEntry(working, entry, location);
    touchesBees(entry);
  });

  // --- Placements: ids the farm doesn't have placed. ----------------------
  const placements = [...desired.values()].filter((e) => !live.has(e.key));

  // The server additionally lifts and respawns mushrooms/airdrops/clutter under
  // a footprint; the sandbox already blocks those spots client-side, so the FE
  // copy (ART_MODE + parity) skips that pass.

  const placed = [...indexLive(working, location).values()];
  placements.forEach((entry) => {
    const elsewhere = placedElsewhere(working, entry, location);
    if (elsewhere) {
      conflicts.push(conflictOf(entry, "PLACED_ELSEWHERE"));
      return;
    }

    const box = boxOf(entry);
    if (isOutOfBounds({ state: working, position: box, location })) {
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
      working = placeEntry(working, entry, location, farmId, createdAt);
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
  const final = [...indexLive(working, location).values()];
  final.forEach((entry) => {
    if (isOutOfBounds({ state: working, position: boxOf(entry), location })) {
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
  // All of these are farm concerns: beehive pollination and scarecrow AOE read
  // farm geometry, and mushrooms/airdrops/clutter only ever spawn outdoors.
  if (location === "farm") {
    if (beesChanged) {
      working = {
        ...working,
        beehives: updateBeehives({ game: working, createdAt }),
      };
    }
    refreshBasicScarecrowTimeAOE(working);
  }

  return working;
}

/**
 * Several reducers build their result with immer, which auto-freezes it. The
 * commit keeps mutating its working copy between reducer calls, so every
 * reducer result is cloned back into a plain object first.
 */
const thaw = (state: GameState): GameState => cloneDeep(state);

function removeEntry(
  state: GameState,
  entry: Entry,
  location: PlaceableLocation,
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
          location,
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
          location,
        },
        createdAt,
      });
    case "farmHand":
      return removeFarmHand({
        state,
        action: { type: "farmHand.removed", id: entry.id, location },
      });
    case "bumpkin":
      return removeBumpkinPlacement({
        state,
        action: { type: "bumpkin.removedPlacement", location },
        createdAt,
      });
  }
}

/** Plain coordinate/flip write on an instance that stays placed. */
function moveEntry(
  state: GameState,
  entry: Entry,
  location: PlaceableLocation,
): void {
  const setFlip = (item: { flipped?: boolean }) => {
    if (entry.flipped === undefined) delete item.flipped;
    else item.flipped = entry.flipped;
  };

  switch (entry.category) {
    case "collectible": {
      const item = (
        SURFACES[location].getCollectibles(state)?.[
          entry.name as CollectibleName
        ] ?? []
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
      writeResourceOffsets(node, entry.coordinates);
      return;
    }
    case "bud": {
      const bud = state.buds![Number(entry.id)];
      bud.coordinates = point(entry.coordinates);
      bud.location = location;
      return;
    }
    case "pet": {
      const pet = state.pets!.nfts![Number(entry.id)];
      pet.coordinates = point(entry.coordinates);
      pet.location = location;
      return;
    }
    case "farmHand": {
      const farmHand = state.farmHands.bumpkins[entry.id];
      farmHand.coordinates = point(entry.coordinates);
      // SURFACES marks the pet house as holding no farm hands, so this branch
      // is only reachable for the locations their type allows.
      farmHand.location = location as PersonLocation;
      setFlip(farmHand);
      return;
    }
    case "bumpkin": {
      state.bumpkin.coordinates = point(entry.coordinates);
      state.bumpkin.location = location as PersonLocation;
      setFlip(state.bumpkin);
      return;
    }
  }
}

/** True when the desired instance is currently placed on another surface. */
/**
 * True when the desired instance is currently placed on a *different* surface.
 * The commit only ever rearranges the surface being saved, so an item standing
 * in the player's home is never silently teleported onto the farm — the player
 * has to lift it there first.
 */
function placedElsewhere(
  state: GameState,
  entry: Entry,
  location: PlaceableLocation,
): boolean {
  const otherSurfaces = getObjectEntries(SURFACES).filter(
    ([name]) => name !== location,
  );

  switch (entry.category) {
    case "collectible":
      return otherSurfaces.some(([, surface]) =>
        surface
          .getCollectibles(state)
          ?.[
            entry.name as CollectibleName
          ]?.some((item) => item.id === entry.id && !!item.coordinates),
      );
    case "bud": {
      const bud = state.buds?.[Number(entry.id)];
      return !!bud?.coordinates && (bud.location ?? "farm") !== location;
    }
    case "pet": {
      const pet = state.pets?.nfts?.[Number(entry.id)];
      return !!pet?.coordinates && (pet.location ?? "farm") !== location;
    }
    case "farmHand": {
      const hand = state.farmHands?.bumpkins?.[entry.id];
      return !!hand?.coordinates && (hand.location ?? "farm") !== location;
    }
    case "bumpkin":
      return (
        !!state.bumpkin.coordinates &&
        (state.bumpkin.location ?? "farm") !== location
      );
    default:
      return false;
  }
}

function placeEntry(
  state: GameState,
  entry: Entry,
  location: PlaceableLocation,
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
            location,
          },
          createdAt,
        });
      const knownUnplaced = SURFACES[location]
        .getCollectibles(state)
        ?.[name]?.some((item) => item.id === entry.id && !item.coordinates);
      const next = knownUnplaced
        ? withIsolatedCollectible(state, name, entry.id, run)
        : thaw(run(state));
      const item = SURFACES[location]
        .getCollectibles(next)!
        [
          name
        ]!.find((c) => !!c.coordinates && c.coordinates.x === coordinates.x && c.coordinates.y === coordinates.y)!;
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
      const nodes = get(next) as Record<
        string,
        { x?: number; y?: number; oX?: number; oY?: number }
      >;
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
      // The place reducers write x/y only; the arrangement is the contract.
      writeResourceOffsets(nodes[entry.id], entry.coordinates);
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
            location,
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
            location,
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
          action: { type: "bumpkin.placed", coordinates, location },
          createdAt,
        }),
      );
      if (entry.flipped !== undefined) next.bumpkin.flipped = entry.flipped;
      return next;
    }
  }
}
