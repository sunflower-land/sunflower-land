import Decimal from "decimal.js-light";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { getBumpkinLevel } from "features/game/lib/level";
import {
  AnimalBuildingType,
  ANIMALS,
  AnimalType,
} from "features/game/types/animals";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getKeys } from "features/game/types/decorations";
import { AnimalBuilding, GameState } from "features/game/types/game";
import { produce } from "immer";

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

export const getBaseAnimalCapacity = (level: number): number => {
  const DEFAULT_CAPACITY = 10;
  const EXTRA_CAPACITY_PER_LEVEL = 5;

  const baseCapacity =
    DEFAULT_CAPACITY + (level - 1) * EXTRA_CAPACITY_PER_LEVEL;

  return baseCapacity;
};

export const getTotalAnimalCapacity = (
  buildingKey: keyof GameState,
  game: GameState,
): number => {
  const COOP_BONUS_CAPACITY = 5;

  const building = game[buildingKey] as AnimalBuilding;
  const level = building.level;
  const baseCapacity = getBaseAnimalCapacity(level);

  if (buildingKey === "henHouse") {
    const coopActive = isCollectibleBuilt({
      name: "Chicken Coop",
      game,
    });

    const coopBonus = coopActive ? COOP_BONUS_CAPACITY * level : 0;

    return baseCapacity + coopBonus;
  }

  return baseCapacity;
};

export function buyAnimal({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
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

    const buildingKey = makeAnimalBuildingKey(
      buildingRequired as AnimalBuildingType,
    );

    const capacity = getTotalAnimalCapacity(buildingKey, copy);
    const totalAnimalsInBuilding = getKeys(copy[buildingKey].animals).length;

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

    copy[buildingKey].animals[action.id] = {
      id: action.id,
      state: "idle",
      type: action.animal,
      coordinates: action.coordinates,
      createdAt,
      experience: 0,
      asleepAt: 0,
      awakeAt: 0,
      lovedAt: 0,
      item: "Petting Hand",
    };

    bumpkin.activity = trackActivity(
      `${action.animal} Bought`,
      bumpkin.activity,
    );
    bumpkin.activity = trackActivity(
      "Coins Spent",
      bumpkin.activity,
      new Decimal(price),
    );

    return copy;
  });
}
