import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { getBumpkinLevel } from "features/game/lib/level";
import { ANIMALS, AnimalType } from "features/game/types/animals";
import { getKeys } from "features/game/types/decorations";
import {
  AnimalBuilding,
  AnimalBuildingKey,
  GameState,
} from "features/game/types/game";
import { toCamelCase } from "lib/utils/toCamelCase";
import cloneDeep from "lodash.clonedeep";

export type BuyAnimalAction = {
  type: "animal.bought";
  id: string;
  animal: AnimalType;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: BuyAnimalAction;
  createdAt?: number;
};

export const getAnimalCapacity = (
  buildingKey: keyof GameState,
  game: GameState,
): number => {
  // Level 0 = 10
  const DEFAULT_CAPACITY = 10;
  // Each level increases capacity by 5
  const EXTRA_CAPACITY = 5;
  // Coop bonus capacity for each level
  const COOP_BONUS_CAPACITY = 5;

  const building = game[buildingKey] as AnimalBuilding;
  const level = building.level;

  const coopActive = isCollectibleBuilt({
    name: "Chicken Coop",
    game,
  });

  const coopBonus = coopActive ? COOP_BONUS_CAPACITY : 0;

  return DEFAULT_CAPACITY + level * (EXTRA_CAPACITY + coopBonus);
};

export function buyAnimal({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const copy: GameState = cloneDeep(state);

  const { bumpkin, coins, buildings } = copy;

  // Animal details
  const {
    coins: price,
    buildingRequired,
    levelRequired,
    height,
    width,
  } = ANIMALS[action.animal];

  if (coins < price) {
    throw new Error(`Insufficient coins to buy a ${action.animal}`);
  }

  if (!buildings[buildingRequired]) {
    throw new Error(`You do not have a ${buildingRequired}`);
  }

  const bumpkinLevel = getBumpkinLevel(bumpkin.experience);

  if (bumpkinLevel < levelRequired) {
    throw new Error(
      `Your bumpkin is not at the required level of ${levelRequired}`,
    );
  }

  const buildingKey = toCamelCase(buildingRequired) as AnimalBuildingKey;

  // This should not happen as this field will be added when a building is placed but just in case
  if (!copy[buildingKey]) {
    throw new Error(`You do not have a ${buildingRequired} on your gameState`);
  }

  const building = copy[buildingKey];
  const capacity = getAnimalCapacity(buildingKey, copy);
  const totalAnimalsInBuilding = getKeys(building?.animals).length;

  if (totalAnimalsInBuilding >= capacity) {
    throw new Error("You do not have the capacity for this animal");
  }

  const collides = detectCollision({
    state: copy,
    position: {
      x: action.coordinates.x,
      y: action.coordinates.y,
      height,
      width,
    },
    location: buildingKey,
    name: action.animal,
  });

  if (collides) {
    throw new Error(`Animal collides`);
  }

  copy.coins -= price;

  building.animals[action.id] = {
    id: action.id,
    state: "idle",
    type: action.animal,
    coordinates: action.coordinates,
    createdAt,
  };

  return copy;
}
