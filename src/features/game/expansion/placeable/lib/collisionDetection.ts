import type {
  AnimalBuildingKey,
  Collectibles,
  Beehive,
  FiniteResource,
  CropPlot,
  FlowerBed,
  Tree,
  OilReserve,
  LavaPit,
  GameState,
  InventoryItemName,
  IslandType,
  PlacedItem,
  FruitPatch,
  Rock,
} from "features/game/types/game";
import { EXPANSION_ORIGINS, LAND_SIZE } from "../../lib/constants";
import type { Coordinates } from "../../components/MapPlacement";
import {
  COLLECTIBLES_DIMENSIONS,
  type CollectibleName,
} from "features/game/types/craftables";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import {
  MUSHROOM_DIMENSIONS,
  RESOURCE_DIMENSIONS,
  type ResourceName,
} from "features/game/types/resources";
import type { PlaceableLocation } from "features/game/types/collectibles";
import type { LandscapingPlaceable } from "../landscapingMachine";
import { PET_NFT_DIMENSIONS } from "features/game/types/pets";
import {
  type AOEExtent,
  SKILL_RANKS,
  getSkillLevel,
} from "features/game/types/bumpkinSkills";
import { getKeys, getObjectEntries } from "lib/object";
import {
  INTERIOR_CANVAS,
  isValidInteriorBase,
  isValidHomeExpansionBase,
} from "./interiorLayouts";

export type Position = {
  width: number;
  height: number;
} & Coordinates;
type BoundingBox = Position;
export type ResourceItem =
  | Tree
  | Rock
  | FiniteResource
  | OilReserve
  | LavaPit
  | CropPlot
  | FruitPatch
  | FlowerBed
  | Beehive;
/**
 * Axis aligned bounding box collision detection
 * https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
 */
export function isOverlapping(
  boundingBox1: BoundingBox,
  boundingBox2: BoundingBox,
) {
  const xmin1 = boundingBox1.x;
  const xmin2 = boundingBox2.x;

  const xmax1 = boundingBox1.x + boundingBox1.width;
  const xmax2 = boundingBox2.x + boundingBox2.width;

  const ymin1 = boundingBox1.y - boundingBox1.height;
  const ymin2 = boundingBox2.y - boundingBox2.height;

  const ymax1 = boundingBox1.y;
  const ymax2 = boundingBox2.y;

  return xmin1 < xmax2 && xmax1 > xmin2 && ymin1 < ymax2 && ymax1 > ymin2;
}

const splitBoundingBox = (boundingBox: BoundingBox, height = 1, width = 1) => {
  const boxCount = boundingBox.width * boundingBox.height;

  return Array.from({ length: boxCount }).map((_, i) => ({
    x: boundingBox.x + (i % boundingBox.width),
    y: boundingBox.y - Math.floor(i / boundingBox.width),
    width,
    height,
  }));
};

export function detectWaterCollision(
  expansions: number,
  boundingBox: BoundingBox,
) {
  const expansionBoundingBoxes: BoundingBox[] = new Array(expansions)
    .fill(null)
    .map((_, expansionIndex) => ({
      x: EXPANSION_ORIGINS[expansionIndex].x - LAND_SIZE / 2,
      y: EXPANSION_ORIGINS[expansionIndex].y + LAND_SIZE / 2,
      width: LAND_SIZE,
      height: LAND_SIZE,
    }));

  /**
   * A bounding box may overlap multiple land expansions.
   *
   * To check if a bounding box completely overlaps land, the
   * bounding box is split into smaller, 1 by 1 bounding boxes,
   * and each box is checked independently.
   */
  const isOverlappingExpansion = (boundingBox: BoundingBox) => {
    return expansionBoundingBoxes.some((expansionBoundingBox) =>
      isOverlapping(boundingBox, expansionBoundingBox),
    );
  };
  const smallerBoxes = splitBoundingBox(boundingBox);
  const isOverLand = smallerBoxes.every(isOverlappingExpansion);

  return !isOverLand;
}

const PLACEABLE_DIMENSIONS = {
  ...BUILDINGS_DIMENSIONS,
  ...COLLECTIBLES_DIMENSIONS,
  ...RESOURCE_DIMENSIONS,
};

function detectPlaceableCollision(
  state: GameState,
  boundingBox: BoundingBox,
  name: LandscapingPlaceable,
) {
  const {
    collectibles,
    buildings,
    crops,
    trees,
    stones,
    gold,
    iron,
    crimstones,
    lavaPits,
    sunstones,
    fruitPatches,
    buds,
    pets,
    beehives,
    flowers: { flowerBeds },
    oilReserves,
    farmHands,
    ascensionCrystals,
  } = state;

  const placed = {
    ...collectibles,
    ...buildings,
  };

  if (NON_COLLIDING_OBJECTS.includes(name as InventoryItemName)) {
    return false;
  }

  const collidingItems = getKeys(placed).filter(
    (name) => !NON_COLLIDING_OBJECTS.includes(name),
  );

  const placeableBounds = collidingItems.flatMap((name) => {
    const items = placed[name] as PlacedItem[];
    const dimensions = PLACEABLE_DIMENSIONS[name];

    return items
      .filter((item) => item.coordinates)
      .map((item) => ({
        x: item.coordinates!.x,
        y: item.coordinates!.y,
        height: dimensions.height,
        width: dimensions.width,
      }));
  });

  const RESOURCE_TYPES: Record<
    Exclude<ResourceName, "Boulder">,
    Record<string, ResourceItem>
  > = {
    Tree: trees,
    "Ancient Tree": trees,
    "Sacred Tree": trees,
    "Stone Rock": stones,
    "Fused Stone Rock": stones,
    "Reinforced Stone Rock": stones,
    "Iron Rock": iron,
    "Refined Iron Rock": iron,
    "Tempered Iron Rock": iron,
    "Gold Rock": gold,
    "Pure Gold Rock": gold,
    "Prime Gold Rock": gold,
    "Crimstone Rock": crimstones,
    "Sunstone Rock": sunstones,
    "Oil Reserve": oilReserves,
    "Lava Pit": lavaPits,
    "Crop Plot": crops,
    "Fruit Patch": fruitPatches,
    "Flower Bed": flowerBeds,
    Beehive: beehives,
    "Ascension Crystal": ascensionCrystals,
  };

  const resourceBoundingBoxes = getObjectEntries(RESOURCE_TYPES).flatMap(
    ([name, items]) =>
      Object.values(items)
        .filter((item) => item.x !== undefined && item.y !== undefined)
        .map((item) => ({
          // Casting to non-null is safe because we filtered out items without x and y
          x: item.x!,
          y: item.y!,
          ...RESOURCE_DIMENSIONS[name],
        })),
  );

  const budsBoundingBox = Object.values(buds ?? {})
    .filter(
      (bud) => !!bud.coordinates && (!bud.location || bud.location === "farm"),
    )
    .map((item) => ({
      x: item.coordinates!.x,
      y: item.coordinates!.y,
      height: 1,
      width: 1,
    }));

  const petNFTBoundingBox = Object.values(pets?.nfts ?? {})
    .filter(
      (petNFT) =>
        !!petNFT.coordinates &&
        (!petNFT.location || petNFT.location === "farm"),
    )
    .map((item) => ({
      x: item.coordinates!.x,
      y: item.coordinates!.y,
      height: PET_NFT_DIMENSIONS.height,
      width: PET_NFT_DIMENSIONS.width,
    }));

  const farmHandBoundingBox = Object.values(farmHands.bumpkins ?? {})
    .filter(
      (farmHand) =>
        !!farmHand.coordinates &&
        (!farmHand.location || farmHand.location === "farm"),
    )
    .map((farmHand) => ({
      x: farmHand.coordinates!.x,
      y: farmHand.coordinates!.y,
      height: 1,
      width: 1,
    }));

  // Main bumpkin on the farm, exclude when placing/moving the bumpkin itself
  const bumpkinBoundingBox =
    name !== "Bumpkin" &&
    state.bumpkin?.coordinates &&
    state.bumpkin?.location === "farm"
      ? [
          {
            x: state.bumpkin.coordinates.x,
            y: state.bumpkin.coordinates.y,
            height: 1,
            width: 1,
          },
        ]
      : [];

  const boundingBoxes = [
    ...placeableBounds,
    ...resourceBoundingBoxes,
    ...budsBoundingBox,
    ...petNFTBoundingBox,
    ...farmHandBoundingBox,
    ...bumpkinBoundingBox,
  ];

  return boundingBoxes.some((resourceBoundingBox) =>
    isOverlapping(boundingBox, resourceBoundingBox),
  );
}

export const HOME_BOUNDS: Record<IslandType, BoundingBox> = {
  basic: {
    height: 6,
    width: 6,
    x: -3,
    y: -3,
  },
  spring: {
    height: 12,
    width: 12,
    x: -6,
    y: -6,
  },
  desert: {
    height: 16,
    width: 16,
    x: -8,
    y: -8,
  },
  volcano: {
    height: 20,
    width: 20,
    x: -10,
    y: -10,
  },
  swamp: {
    height: 20,
    width: 20,
    x: -10,
    y: -10,
  },
  // Ascension islands (spooky onward) reuse the swamp value for now.
  spooky: {
    height: 20,
    width: 20,
    x: -10,
    y: -10,
  },
  crystal: {
    height: 20,
    width: 20,
    x: -10,
    y: -10,
  },
  galaxy: {
    height: 20,
    width: 20,
    x: -10,
    y: -10,
  },
  marble: {
    height: 20,
    width: 20,
    x: -10,
    y: -10,
  },
};

// Pet House bounds based on interior floor area (centered at origin)
// Level 1: 7x6 grid, Level 2: 9x8 grid, Level 3: 11x10 grid
export const PET_HOUSE_BOUNDS: Record<number, BoundingBox> = {
  1: {
    height: 6,
    width: 7,
    x: -3,
    y: -3,
  },
  2: {
    height: 8,
    width: 9,
    x: -4,
    y: -4,
  },
  3: {
    height: 10,
    width: 11,
    x: -5,
    y: -5,
  },
};

export const ANIMAL_HOUSE_BOUNDS: Record<
  AnimalBuildingKey,
  Record<number, BoundingBox>
> = {
  henHouse: {
    1: {
      height: 8,
      width: 8,
      x: -4,
      y: 5,
    },
    2: {
      height: 10,
      width: 10,
      x: -5,
      y: 6,
    },
    3: {
      height: 12,
      width: 12,
      x: -6,
      y: 7,
    },
  },
  barn: {
    1: {
      height: 8,
      width: 8,
      x: -4,
      y: 5,
    },
    2: {
      height: 10,
      width: 10,
      x: -5,
      y: 6,
    },
    3: {
      height: 12,
      width: 12,
      x: -6,
      y: 7,
    },
  },
};

export const NON_COLLIDING_OBJECTS: InventoryItemName[] = [
  "Chess Rug",
  "Twister Rug",
  "Rug",
  "Sunrise Bloom Rug",
  "Flower Rug",
  "Tea Rug",
  "Green Field Rug",
  "Fancy Rug",
  "Gaucho Rug",
  "Sunflorian Faction Rug",
  "Bumpkin Faction Rug",
  "Goblin Faction Rug",
  "Nightshade Faction Rug",
  "Sleepy Rug",
  "Crop Circle",
  "Christmas Rug",
  "Lake Rug",
  "Goldcrest Mosaic Rug",
  "Sandy Mosaic Rug",
  "Twilight Rug",
  "Orchard Rug",
  "Carrot Rug",
  "Beetroot Rug",
  "Harlequin Rug",
  "Large Rug",
  "Black Tile",
  "Blue Tile",
  "Green Tile",
  "Purple Tile",
  "Red Tile",
  "Yellow Tile",
  "Balloon Rug",
  "Long Rug",
  "Paw Prints Rug",
  "Crabs and Fish Rug",
  "World Map Rug",
  "Bumpkin Rug",
  "Goblin Rug",
  "Pet Rug",
  "Big Table",
  "Crate",
  "Empty Pot",
  "High Table",
  "Large Podium",
  "Long Table",
  "Royal Podium",
  "Square Table",
  "Stool",
];

// Subset of NON_COLLIDING_OBJECTS that represent furniture (tables, stools, podiums).
// These render above rugs (z=1) but below regular collectables (z=2).
export const FURNITURE_OBJECTS: InventoryItemName[] = [
  "Big Table",
  "Crate",
  "Empty Pot",
  "High Table",
  "Large Podium",
  "Long Table",
  "Royal Podium",
  "Square Table",
  "Stool",
];

function detectHomeCollision({
  state,
  position,
  name,
}: {
  state: GameState;
  position: BoundingBox;
  name: LandscapingPlaceable;
}) {
  const bounds = HOME_BOUNDS[state.island.type];

  const isOutside =
    position.x < bounds.x ||
    position.x + position.width > bounds.x + bounds.width ||
    position.y > bounds.y + bounds.height ||
    position.y - position.height < bounds.y;

  if (isOutside) {
    return true;
  }

  if (NON_COLLIDING_OBJECTS.includes(name as InventoryItemName)) {
    return false;
  }

  const { home } = state;

  const placed = home.collectibles;

  // Don't filter by name - all items should collide with each other
  const collidingItems = getKeys(placed).filter(
    (itemName) => !NON_COLLIDING_OBJECTS.includes(itemName),
  );

  const placeableBounds = collidingItems.flatMap((itemName) => {
    const items = placed[itemName] as PlacedItem[];
    const dimensions = PLACEABLE_DIMENSIONS[itemName];

    return items
      .filter((item) => item.coordinates)
      .map((item) => ({
        x: item.coordinates!.x,
        y: item.coordinates!.y,
        height: dimensions.height,
        width: dimensions.width,
      }));
  });

  const boundingBoxes = [
    ...placeableBounds,
    ...placedEntityBoundingBoxes(state, "home", name),
  ];

  return boundingBoxes.some((resourceBoundingBox) =>
    isOverlapping(position, resourceBoundingBox),
  );
}

function detectPetHouseCollision({
  state,
  position,
  name,
}: {
  state: GameState;
  position: BoundingBox;
  name: LandscapingPlaceable;
}) {
  const petHouseLevel = state.petHouse?.level ?? 1;
  const bounds = PET_HOUSE_BOUNDS[petHouseLevel];

  const isOutside =
    position.x < bounds.x ||
    position.x + position.width > bounds.x + bounds.width ||
    position.y > bounds.y + bounds.height ||
    position.y - position.height < bounds.y;

  if (isOutside) {
    return true;
  }

  if (NON_COLLIDING_OBJECTS.includes(name as InventoryItemName)) {
    return false;
  }

  const { petHouse } = state;
  const placed = petHouse?.pets ?? {};

  // Don't filter by name - all same-name pets should collide with each other
  const collidingItems = getKeys(placed).filter(
    (petName) => !NON_COLLIDING_OBJECTS.includes(petName),
  );

  const placeableBounds = collidingItems.flatMap((petName) => {
    const items = placed[petName] ?? [];
    const dimensions = PLACEABLE_DIMENSIONS[petName];

    return items
      .filter((item) => item.coordinates)
      .map((item) => ({
        x: item.coordinates!.x,
        y: item.coordinates!.y,
        height: dimensions?.height ?? 1,
        width: dimensions?.width ?? 1,
      }));
  });

  // Check for Pet NFTs placed in pet house
  const petNFTBoundingBox = Object.values(state.pets?.nfts ?? {})
    .filter((petNFT) => !!petNFT.coordinates && petNFT.location === "petHouse")
    .map((item) => ({
      x: item.coordinates!.x,
      y: item.coordinates!.y,
      height: PET_NFT_DIMENSIONS.height,
      width: PET_NFT_DIMENSIONS.width,
    }));

  const allBoundingBoxes = [...placeableBounds, ...petNFTBoundingBox];

  return allBoundingBoxes.some((resourceBoundingBox) =>
    isOverlapping(position, resourceBoundingBox),
  );
}

function detectMushroomCollision(
  state: GameState,
  boundingBox: BoundingBox,
  name: LandscapingPlaceable,
) {
  if (name.includes("Tile")) return false;

  const { mushrooms } = state;
  if (!mushrooms) return false;

  const boundingBoxes = getKeys(mushrooms.mushrooms).flatMap((id) => {
    const mushroom = mushrooms.mushrooms[id];
    const dimensions = MUSHROOM_DIMENSIONS;

    return {
      x: mushroom.x,
      y: mushroom.y,
      height: dimensions.height,
      width: dimensions.width,
    };
  });

  return boundingBoxes.some((resourceBoundingBox) =>
    isOverlapping(boundingBox, resourceBoundingBox),
  );
}

function detectAirdropCollision(state: GameState, boundingBox: BoundingBox) {
  const { airdrops } = state;
  if (!airdrops) return false;

  return airdrops.some(
    (airdrop) =>
      !!airdrop.coordinates &&
      isOverlapping(boundingBox, {
        ...airdrop.coordinates,
        width: 1,
        height: 1,
      }),
  );
}

/**
 * Interior collision check — intentionally simpler than `detectHomeCollision`.
 *
 * Two rules:
 *   1. Every cell of the placing box must be a valid (green) interior tile for
 *      the current island per INTERIOR_LAYOUTS. Tiles not in the set are walls
 *      / outside-the-room and block placement.
 *   2. The placing box must not overlap any other collectible already placed
 *      in the interior.
 *
 * No farm-style bounds check, no buds / pet NFTs / farmhands / bumpkin
 * collision — just collectibles vs. red-tile mask.
 *
 * Coordinate convention note: the `position` passed in here is in the
 * *canvas-center* convention used by the placement UI (Placeable.tsx), where
 * (0, 0) is the middle of the 24×24 canvas. INTERIOR_LAYOUTS uses a
 * *bottom-left* convention where (0, 1) is the bottom-left tile. We translate
 * once before the layout lookup and treat everything else (overlap check) in
 * the canvas-center convention since collectibles store their coords there.
 */
/**
 * Bounding boxes for the non-collectible entities (buds, pet NFTs, farm hands
 * and the main bumpkin) placed on a given indoor surface. Shared by the home,
 * interior and level_one collision checks so each surface collides with these
 * the same way.
 */
function placedEntityBoundingBoxes(
  state: GameState,
  location: PlaceableLocation,
  name: LandscapingPlaceable,
): BoundingBox[] {
  const budsBoundingBox = Object.values(state.buds ?? {})
    .filter((bud) => !!bud.coordinates && bud.location === location)
    .map((item) => ({
      x: item.coordinates!.x,
      y: item.coordinates!.y,
      height: 1,
      width: 1,
    }));

  const petNFTBoundingBox = Object.values(state.pets?.nfts ?? {})
    .filter((petNFT) => !!petNFT.coordinates && petNFT.location === location)
    .map((item) => ({
      x: item.coordinates!.x,
      y: item.coordinates!.y,
      height: PET_NFT_DIMENSIONS.height,
      width: PET_NFT_DIMENSIONS.width,
    }));

  const farmHandBoundingBox = Object.values(state.farmHands.bumpkins ?? {})
    .filter(
      (farmHand) => !!farmHand.coordinates && farmHand.location === location,
    )
    .map((farmHand) => ({
      x: farmHand.coordinates!.x,
      y: farmHand.coordinates!.y,
      height: 1,
      width: 1,
    }));

  // Main bumpkin inside, exclude when placing/moving the bumpkin itself
  const bumpkinBoundingBox =
    name !== "Bumpkin" &&
    state.bumpkin?.coordinates &&
    state.bumpkin?.location === location
      ? [
          {
            x: state.bumpkin.coordinates.x,
            y: state.bumpkin.coordinates.y,
            height: 1,
            width: 1,
          },
        ]
      : [];

  return [
    ...budsBoundingBox,
    ...petNFTBoundingBox,
    ...farmHandBoundingBox,
    ...bumpkinBoundingBox,
  ];
}

function detectInteriorCollision({
  state,
  position,
  name,
}: {
  state: GameState;
  position: BoundingBox;
  name: LandscapingPlaceable;
}) {
  // 1. Layout mask — translate Placeable coords → bottom-left layout coords.
  // GenesisBlock lives at canvas-centre (12, 12) and Placeable anchors
  // coord (0, 0) there, so the conversion is +canvas/2 on both axes.
  // Collision and render must use matching fudges — both are 0 right now,
  // so adjust them in lockstep if alignment drifts.
  const layoutPosition = {
    ...position,
    x: position.x + INTERIOR_CANVAS.width / 2,
    y: position.y + INTERIOR_CANVAS.height / 2,
  };
  if (!isValidInteriorBase(state.island.type, layoutPosition)) {
    return true;
  }

  // 2. Overlap check — interior placements must not overlap any other
  // collectible already placed in the room. Existing overlaps in saved
  // state are left alone; this only blocks new placements/moves that
  // would land on top of something. Rugs / tiles (NON_COLLIDING_OBJECTS)
  // are still free to overlap anything.
  if (NON_COLLIDING_OBJECTS.includes(name as InventoryItemName)) {
    return false;
  }

  const placed = state.interior.ground.collectibles;
  const collidingItems = getKeys(placed).filter(
    (itemName) => !NON_COLLIDING_OBJECTS.includes(itemName),
  );
  const placeableBounds = collidingItems.flatMap((itemName) => {
    const items = (placed[itemName] ?? []) as PlacedItem[];
    const dimensions = PLACEABLE_DIMENSIONS[itemName];
    return items
      .filter((item) => item.coordinates)
      .map((item) => ({
        x: item.coordinates!.x,
        y: item.coordinates!.y,
        height: dimensions.height,
        width: dimensions.width,
      }));
  });

  const boundingBoxes = [
    ...placeableBounds,
    ...placedEntityBoundingBoxes(state, "interior", name),
  ];

  return boundingBoxes.some((box) => isOverlapping(position, box));
}

/**
 * Collision check for the new post-volcano `level_one` floor.
 *
 * Same simple shape as detectInteriorCollision: (1) every cell of the placing
 * box must be a valid (green) tile per HOME_EXPANSION_LAYOUTS for the player's
 * current expansion tier, and (2) the placing box must not overlap any other
 * collectible already placed in level_one.
 *
 * Returns true (collision detected) if the level_one floor or the expansion
 * tier hasn't been bought yet.
 */
function detectLevelOneCollision({
  state,
  position,
  name,
}: {
  state: GameState;
  position: BoundingBox;
  name: LandscapingPlaceable;
}) {
  const levelOne = state.interior.level_one;
  const expansion = state.interior.expansion;
  if (!levelOne || !expansion) {
    return true;
  }

  // Match detectInteriorCollision's translation (no fudge currently).
  const layoutPosition = {
    ...position,
    x: position.x + INTERIOR_CANVAS.width / 2,
    y: position.y + INTERIOR_CANVAS.height / 2,
  };
  if (!isValidHomeExpansionBase(expansion, layoutPosition)) {
    return true;
  }

  // Same overlap policy as the ground floor — see detectInteriorCollision
  // for rationale. Rugs / tiles can still stack freely.
  if (NON_COLLIDING_OBJECTS.includes(name as InventoryItemName)) {
    return false;
  }

  const placed = levelOne.collectibles;
  const collidingItems = getKeys(placed).filter(
    (itemName) => !NON_COLLIDING_OBJECTS.includes(itemName),
  );
  const placeableBounds = collidingItems.flatMap((itemName) => {
    const items = (placed[itemName] ?? []) as PlacedItem[];
    const dimensions = PLACEABLE_DIMENSIONS[itemName];
    return items
      .filter((item) => item.coordinates)
      .map((item) => ({
        x: item.coordinates!.x,
        y: item.coordinates!.y,
        height: dimensions.height,
        width: dimensions.width,
      }));
  });

  const boundingBoxes = [
    ...placeableBounds,
    ...placedEntityBoundingBoxes(state, "level_one", name),
  ];

  return boundingBoxes.some((box) => isOverlapping(position, box));
}

export function detectCollision({
  state,
  position,
  location,
  name,
}: {
  location: PlaceableLocation;
  state: GameState;
  position: Position;
  name: LandscapingPlaceable;
}) {
  if (location === "home") {
    return detectHomeCollision({ state, position, name });
  }

  if (location === "petHouse") {
    return detectPetHouseCollision({ state, position, name });
  }

  if (location === "interior") {
    return detectInteriorCollision({ state, position, name });
  }

  if (location === "level_one") {
    return detectLevelOneCollision({ state, position, name });
  }

  const expansions = state.inventory["Basic Land"]?.toNumber() ?? 3;

  return (
    detectWaterCollision(expansions, position) ||
    detectPlaceableCollision(state, position, name) ||
    detectMushroomCollision(state, position, name) ||
    detectAirdropCollision(state, position)
  );
}

export type AOEItemName =
  | "Basic Scarecrow"
  // Dedicated cooldown-tracking slot for the Chonky Scarecrow yield boost.
  // Kept separate from "Basic Scarecrow" (whose slot stores the growth-time
  // AOE's next-available timestamp) so the two mechanics don't clobber each
  // other. Never passed to isWithinAOE — only used as a game.aoe key.
  | "Chonky Scarecrow"
  | "Emerald Turtle"
  | "Tin Turtle"
  | "Sir Goldensnout"
  | "Scary Mike"
  | "Laurie the Chuckle Crow"
  | "Queen Cornelia"
  | "Gnome";

// Base (no skill) footprint = the original 3x3 rectangle, shared by the three
// scarecrow-type placeables before any rank skill widens it.
export const BASE_AOE_EXTENT: AOEExtent = { xLeft: 1, xRight: 1, depth: 3 };

/**
 * Rank-aware AOE footprint for a placeable. The Chonky Scarecrow / Horror Mike /
 * Laurie's Gains skills widen their placeable's area per rank (7x7 / 8x8 / 9x9);
 * every other item keeps the base 3x3. Shared by the gameplay gate (isWithinAOE)
 * and the landscaping overlay so the drawn area can't drift from the boosted one.
 */
export function getAOEExtent(
  AOEItemName: AOEItemName,
  skills: GameState["bumpkin"]["skills"],
): AOEExtent {
  let rankSkill: "Chonky Scarecrow" | "Horror Mike" | "Laurie's Gains";
  switch (AOEItemName) {
    case "Basic Scarecrow":
      rankSkill = "Chonky Scarecrow";
      break;
    case "Scary Mike":
      rankSkill = "Horror Mike";
      break;
    case "Laurie the Chuckle Crow":
      rankSkill = "Laurie's Gains";
      break;
    default:
      return BASE_AOE_EXTENT;
  }
  const level = getSkillLevel(skills, rankSkill);
  return level ? SKILL_RANKS[rankSkill].ranks[level - 1] : BASE_AOE_EXTENT;
}

/**
 * Detects whether an item is within the area of effect of a placeable with AOE.
 * @param AOEItem Item which has an area of effect
 * @param item Item to check if it is within the area of effect
 * @returns boolean
 *
 **/
export function isWithinAOE(
  AOEItemName: AOEItemName,
  AOEItem: Position,
  effectItem: Position,
  skills: GameState["bumpkin"]["skills"],
): boolean {
  const { x, y, height, width } = AOEItem;

  const isWithinRectangle = (
    topLeft: Position,
    bottomRight: Position,
  ): boolean => {
    return (
      effectItem.x >= topLeft.x &&
      effectItem.x <= bottomRight.x &&
      effectItem.y <= topLeft.y &&
      effectItem.y >= bottomRight.y
    );
  };

  const isWithinDistance = (
    dx: number,
    dy: number,
    distance: number,
  ): boolean => {
    return Math.abs(dx) <= distance && Math.abs(dy) <= distance;
  };

  switch (AOEItemName) {
    case "Basic Scarecrow":
    case "Scary Mike":
    case "Laurie the Chuckle Crow": {
      const e = getAOEExtent(AOEItemName, skills);
      return isWithinRectangle(
        { x: x - e.xLeft, y: y - height, height, width },
        {
          x: x + e.xRight,
          y: y - height - (e.depth - 1),
          height,
          width,
        },
      );
    }

    case "Emerald Turtle":
    case "Tin Turtle": {
      const dxTurtle = x - effectItem.x;
      const dyTurtle = y - effectItem.y;
      return (
        isWithinDistance(dxTurtle, dyTurtle, 1) &&
        (dxTurtle !== 0 || dyTurtle !== 0)
      );
    }
    case "Sir Goldensnout": {
      const dxRect = effectItem.x - x;
      const dyRect = effectItem.y - y;
      return (
        dxRect >= -1 && dxRect <= width && dyRect <= 1 && dyRect >= -height
      );
    }

    case "Queen Cornelia": {
      return isWithinRectangle(
        { x: x - 1, y: y + 1, height, width },
        { x: x + width, y: y - height, height, width },
      );
    }

    case "Gnome": {
      return effectItem.x === x && effectItem.y === y - 1;
    }

    default:
      return false;
  }
}

export function isAOEImpacted(
  collectibles: Collectibles,
  resourcePosition: Position,
  AoEAffectedNames: AOEItemName[],
  bumpkin: GameState["bumpkin"],
) {
  return AoEAffectedNames.some((name) => {
    if (collectibles[name as CollectibleName]?.[0]) {
      const coordinates =
        collectibles[name as CollectibleName]?.[0].coordinates;

      if (!coordinates) return false;

      const dimensions = COLLECTIBLES_DIMENSIONS[name as CollectibleName];

      const itemPosition: Position = {
        x: coordinates.x,
        y: coordinates.y,
        height: dimensions.height,
        width: dimensions.width,
      };

      if (isWithinAOE(name, itemPosition, resourcePosition, bumpkin.skills)) {
        return true;
      }
    }
  });
}

export function pickEmptyPosition({
  bounding,
  gameState,
}: {
  bounding: BoundingBox;
  gameState: GameState;
}): Position | undefined {
  const positionsInBounding = splitBoundingBox(bounding);

  const availablePositions = positionsInBounding.filter(
    (position) =>
      detectCollision({
        state: gameState,
        position,
        location: "farm",
        name: "Basic Bear", // Just assume the item is 1x1
      }) === false,
  );

  return availablePositions[0];
}
