import Decimal from "decimal.js-light";
import {
  getBarnDelightCost,
  REQUIRED_FOOD_QTY,
} from "features/game/events/landExpansion/feedAnimal";
import { isAnimalFeedable } from "features/game/events/landExpansion/buyAnimal";
import {
  getAnimalFavoriteFood,
  getBoostedFoodQuantity,
  makeAnimalBuildingKey,
} from "features/game/lib/animals";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import type {
  Animal,
  AnimalBuildingKey,
  AnimalFoodName,
  AnimalMedicineName,
  GameState,
} from "features/game/types/game";
import { ANIMAL_FOODS, type AnimalType } from "features/game/types/animals";
import { getKeys } from "lib/object";
import { getIngredients } from "./feedMixed";

type FeedRequestName = AnimalFoodName | AnimalMedicineName;
type RequestTotals = Partial<Record<FeedRequestName, Decimal>>;

const isAnimalAwakeAndRequestingFood = (animal: Animal) => {
  return animal.state === "idle" && animal.awakeAt <= Date.now();
};

const hasFreeFeedBoost = (animalType: AnimalType, game: GameState) => {
  if (animalType === "Chicken") {
    return isCollectibleBuilt({ name: "Gold Egg", game });
  }

  if (animalType === "Cow") {
    return isCollectibleBuilt({ name: "Golden Cow", game });
  }

  if (animalType === "Sheep") {
    return isCollectibleBuilt({ name: "Golden Sheep", game });
  }

  return false;
};

const addToTotals = (
  totals: RequestTotals,
  item: FeedRequestName,
  amount: Decimal,
) => {
  totals[item] = (totals[item] ?? new Decimal(0)).add(amount);
};

const getAnimalFeedRequest = ({
  animal,
  game,
  buildingKey,
}: {
  animal: Animal;
  game: GameState;
  buildingKey: AnimalBuildingKey;
}): { item: FeedRequestName; quantity: Decimal } | null => {
  if (animal.state === "sick") {
    const { amount } = getBarnDelightCost({ state: game });
    return { item: "Barn Delight", quantity: new Decimal(amount) };
  }

  if (!isAnimalAwakeAndRequestingFood(animal)) {
    return null;
  }

  if (hasFreeFeedBoost(animal.type, game)) {
    return null;
  }

  if (!isAnimalFeedable(buildingKey, game, animal.id)) {
    return null;
  }

  const favouriteFood = getAnimalFavoriteFood(animal.type, animal.experience);
  const { foodQuantity } = getBoostedFoodQuantity({
    animalType: animal.type,
    foodQuantity: REQUIRED_FOOD_QTY[animal.type],
    game,
    animal,
  });

  return {
    item: favouriteFood,
    quantity: foodQuantity,
  };
};

const getBuildingRequests = ({
  buildingKey,
  animals,
  game,
}: {
  buildingKey: AnimalBuildingKey;
  animals: Animal[];
  game: GameState;
}): RequestTotals => {
  const requests: RequestTotals = {};

  animals.forEach((animal) => {
    const request = getAnimalFeedRequest({ animal, game, buildingKey });

    if (!request) {
      return;
    }

    addToTotals(requests, request.item, request.quantity);
  });

  return requests;
};

export function getBulkMixRequirements(
  game: GameState,
  building: "Hen House" | "Barn",
) {
  const buildingKey = makeAnimalBuildingKey(building);
  const requests = getBuildingRequests({
    buildingKey,
    animals: Object.values(game[buildingKey].animals),
    game,
  });

  const missingRequests: RequestTotals = {};
  const ingredients: GameState["inventory"] = {};
  let coins = 0;

  getKeys(requests).forEach((item) => {
    const requested = requests[item] ?? new Decimal(0);
    const inInventory = game.inventory[item] ?? new Decimal(0);
    const difference = requested.sub(inInventory);
    const missing = difference.lessThan(0) ? new Decimal(0) : difference;

    if (missing.lte(0)) {
      return;
    }

    missingRequests[item] = missing;

    const { ingredients: mixIngredients } = getIngredients({
      state: game,
      name: item,
    });

    const feed = ANIMAL_FOODS[item];
    coins += (feed.coins ?? 0) * missing.toNumber();

    getKeys(mixIngredients).forEach((ingredient) => {
      const current = ingredients[ingredient] ?? new Decimal(0);
      const amount = mixIngredients[ingredient]?.mul(missing) ?? new Decimal(0);
      ingredients[ingredient] = current.add(amount);
    });
  });

  return {
    requests,
    missingRequests,
    requirements: {
      ingredients,
      coins,
    },
  };
}
