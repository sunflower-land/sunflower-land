import Decimal from "decimal.js-light";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import {
  type AnimalBuildingType,
  ANIMALS,
  type AnimalType,
} from "features/game/types/animals";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { getKeys } from "lib/object";
import type {
  AnimalBuilding,
  AnimalBuildingKey,
  BoostName,
  GameState,
} from "features/game/types/game";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { produce } from "immer";

export type BuyAnimalAction = {
  type: "animal.bought";
  id: string;
  animal: AnimalType;
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

export const getBoostedAnimalCapacity = (
  buildingKey: keyof GameState,
  game: GameState,
): { capacity: number; boostsUsed: { name: BoostName; value: string }[] } => {
  const COOP_BONUS_CAPACITY = 5;

  const BARN_BLUEPRINT_BONUS_CAPACITY = 5;

  const building = game[buildingKey] as AnimalBuilding;
  const level = building.level;
  const baseCapacity = getBaseAnimalCapacity(level);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (buildingKey === "henHouse") {
    const coopActive = isCollectibleBuilt({
      name: "Chicken Coop",
      game,
    });

    const coopBonus = coopActive ? COOP_BONUS_CAPACITY * level : 0;

    if (coopActive) {
      boostsUsed.push({ name: "Chicken Coop", value: "+5" });
    }
    return { capacity: baseCapacity + coopBonus, boostsUsed };
  }

  if (buildingKey === "barn") {
    const bprintActive = isCollectibleBuilt({
      name: "Barn Blueprint",
      game,
    });
    const capacityBonus = bprintActive
      ? BARN_BLUEPRINT_BONUS_CAPACITY * level
      : 0;

    if (bprintActive) {
      boostsUsed.push({ name: "Barn Blueprint", value: "+5" });
    }
    return { capacity: baseCapacity + capacityBonus, boostsUsed };
  }

  return { capacity: baseCapacity, boostsUsed };
};

// Memoizes the most recent over-capacity result. The UI calls
// getOverCapacityAnimalIds once per animal per render, so without this each
// animal would re-sort the whole building. Keyed on the animals object and
// capacity — the only inputs that change the result.
let overCapacityCache: {
  animals: AnimalBuilding["animals"];
  capacity: number;
  ids: Set<string>;
} | null = null;

/**
 * IDs of animals that exceed the building's current capacity and therefore
 * cannot be fed. This happens when a player buys animals while a capacity
 * boosting collectible (Chicken Coop / Barn Blueprint) is placed, then removes
 * or sells that collectible. The OLDEST animals beyond the current capacity are
 * locked; the newest `capacity` animals remain feedable. Locked animals can
 * still be cured and sold to bounties.
 */
export const getOverCapacityAnimalIds = (
  buildingKey: AnimalBuildingKey,
  game: GameState,
): Set<string> => {
  const building = game[buildingKey];
  const { capacity } = getBoostedAnimalCapacity(buildingKey, game);

  if (
    overCapacityCache &&
    overCapacityCache.animals === building.animals &&
    overCapacityCache.capacity === capacity
  ) {
    return overCapacityCache.ids;
  }

  const animals = Object.values(building.animals);

  let ids: Set<string>;
  if (animals.length <= capacity) {
    ids = new Set();
  } else {
    const lockedCount = animals.length - capacity;

    // Oldest first so the newest `capacity` animals remain feedable. Ties on
    // createdAt fall back to purchase (insertion) order rather than id.
    const oldestFirst = animals
      .map((animal, index) => ({ animal, index }))
      .sort((a, b) =>
        a.animal.createdAt !== b.animal.createdAt
          ? a.animal.createdAt - b.animal.createdAt
          : a.index - b.index,
      )
      .map((entry) => entry.animal);

    ids = new Set(oldestFirst.slice(0, lockedCount).map((animal) => animal.id));
  }

  overCapacityCache = { animals: building.animals, capacity, ids };
  return ids;
};

export const isAnimalFeedable = (
  buildingKey: AnimalBuildingKey,
  game: GameState,
  animalId: string,
): boolean => !getOverCapacityAnimalIds(buildingKey, game).has(animalId);

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
    } = ANIMALS[action.animal];

    if (coins < price) {
      throw new Error(`Insufficient coins to buy a ${action.animal}`);
    }

    if (!buildings[buildingRequired]) {
      throw new Error(`You do not have a ${buildingRequired}`);
    }

    const ascension = getAscensionLevel({
      experience: bumpkin.experience,
      ascensionLevel: copy.island.ascensionLevel ?? 0,
    });

    if (!meetsLevelRequirement(ascension, levelRequired)) {
      throw new Error(
        levelRequired.ascension > 0
          ? `Your bumpkin must be Ascension ${levelRequired.ascension}, Level ${levelRequired.level}`
          : `Your bumpkin is not at the required level of ${levelRequired.level}`,
      );
    }

    const buildingKey = makeAnimalBuildingKey(
      buildingRequired as AnimalBuildingType,
    );

    const { capacity, boostsUsed } = getBoostedAnimalCapacity(
      buildingKey,
      copy,
    );
    const totalAnimalsInBuilding = getKeys(copy[buildingKey].animals).length;

    if (totalAnimalsInBuilding >= capacity) {
      throw new Error("You do not have the capacity for this animal");
    }

    copy.coins -= price;

    copy[buildingKey].animals[action.id] = {
      id: action.id,
      state: "idle",
      type: action.animal,
      createdAt,
      experience: 0,
      asleepAt: 0,
      awakeAt: 0,
      lovedAt: 0,
      item: "Petting Hand",
    };

    copy.farmActivity = trackFarmActivity(
      `${action.animal} Bought`,
      copy.farmActivity,
    );
    copy.farmActivity = trackFarmActivity(
      "Coins Spent",
      copy.farmActivity,
      new Decimal(price),
    );

    copy.boostsUsedAt = updateBoostUsed({
      game: copy,
      boostNames: boostsUsed,
      createdAt,
    });

    return copy;
  });
}
