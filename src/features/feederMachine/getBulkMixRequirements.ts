import Decimal from "decimal.js-light";
import {
  getBarnDelightCost,
  handleFoodXP,
  isMaxLevel,
  REQUIRED_FOOD_QTY,
} from "features/game/events/landExpansion/feedAnimal";
import { isAnimalFeedable } from "features/game/events/landExpansion/buyAnimal";
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
  getBoostedFoodQuantity,
  makeAnimalBuildingKey,
} from "features/game/lib/animals";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import type { BumpkinItem } from "features/game/types/bumpkin";
import type {
  Animal,
  AnimalBuildingKey,
  AnimalFoodName,
  AnimalMedicineName,
  GameState,
} from "features/game/types/game";
import type { CollectibleName } from "features/game/types/craftables";
import {
  ANIMAL_FOODS,
  ANIMAL_LEVELS,
  type AnimalLevel,
  type AnimalType,
  type FeedType,
} from "features/game/types/animals";
import { getKeys } from "lib/object";
import { getIngredients } from "./feedMixed";

type FeedRequestName = AnimalFoodName | AnimalMedicineName;
type RequestTotals = Partial<Record<FeedRequestName, Decimal>>;
type FeedRequest = { item: FeedRequestName; quantity: Decimal };

/**
 * Per-feed breakdown used by the Auto Mixer's "pick & mix" UI so each feed can
 * be toggled on/off and the summary recomputed for just the selected feeds.
 */
export type BulkMixFeed = {
  item: FeedRequestName;
  type: FeedType;
  requested: Decimal;
  inInventory: Decimal;
  missing: Decimal;
  ingredients: GameState["inventory"];
  coins: number;
};

const MAX_FEED_STEPS_TO_READY = 100;

const isAnimalAwakeAndRequestingFood = (animal: Animal) => {
  return (
    animal.awakeAt <= Date.now() &&
    (animal.state === "idle" ||
      animal.state === "happy" ||
      animal.state === "sad")
  );
};

// Collectible that feeds each animal type for free (no mixing needed).
const FREE_FEED_COLLECTIBLE: Record<AnimalType, CollectibleName> = {
  Chicken: "Gold Egg",
  Cow: "Golden Cow",
  Sheep: "Golden Sheep",
};

/**
 * A free boost the Auto Mixer surfaces to explain why a building has no
 * requests: a collectible that feeds an animal type for free, or a wearable
 * (Oracle Syringe) that cures sick animals for free.
 */
export type FreeFeedBoost =
  | { source: "collectible"; item: CollectibleName; animalType: AnimalType }
  | { source: "wearable"; item: BumpkinItem };

const hasFreeFeedBoost = (animalType: AnimalType, game: GameState) =>
  isCollectibleBuilt({ name: FREE_FEED_COLLECTIBLE[animalType], game });

const addToTotals = (
  totals: RequestTotals,
  item: FeedRequestName,
  amount: Decimal,
) => {
  // A zero-quantity request means an item removed the need to mix this feed
  // (e.g. Oracle Syringe makes Barn Delight free), so it isn't a real request.
  if (amount.lte(0)) {
    return;
  }

  totals[item] = (totals[item] ?? new Decimal(0)).add(amount);
};

const isReadyAfterFoodXP = ({
  animal,
  experience,
  foodXp,
}: {
  animal: AnimalType;
  experience: number;
  foodXp: number;
}) => {
  const nextExperience = experience + foodXp;

  if (!isMaxLevel(animal, experience)) {
    return (
      getAnimalLevel(experience, animal) !==
      getAnimalLevel(nextExperience, animal)
    );
  }

  const maxLevel = (getKeys(ANIMAL_LEVELS[animal]).length - 1) as AnimalLevel;
  const levelBeforeMax = (maxLevel - 1) as AnimalLevel;
  const maxLevelXp = ANIMAL_LEVELS[animal][maxLevel];
  const levelBeforeMaxXp = ANIMAL_LEVELS[animal][levelBeforeMax];
  const cycleXP = maxLevelXp - levelBeforeMaxXp;
  const excessXpBeforeFeed = Math.max(experience - maxLevelXp, 0);
  const currentCycleProgress = excessXpBeforeFeed % cycleXP;

  return currentCycleProgress + foodXp >= cycleXP;
};

const getFeedRequestsUntilReady = ({
  animal,
  game,
}: {
  animal: Animal;
  game: GameState;
}): FeedRequest[] => {
  const requests: FeedRequest[] = [];
  let experience = animal.experience;

  for (let step = 0; step < MAX_FEED_STEPS_TO_READY; step += 1) {
    const level = getAnimalLevel(experience, animal.type);
    const favouriteFood = getAnimalFavoriteFood(animal.type, experience);
    const { foodXp } = handleFoodXP({
      state: game,
      animal: animal.type,
      level,
      food: favouriteFood,
    });

    if (foodXp <= 0) {
      break;
    }

    const { foodQuantity } = getBoostedFoodQuantity({
      animalType: animal.type,
      foodQuantity: REQUIRED_FOOD_QTY[animal.type],
      game,
      animal: { ...animal, experience },
    });

    requests.push({
      item: favouriteFood,
      quantity: foodQuantity,
    });

    if (
      isReadyAfterFoodXP({
        animal: animal.type,
        experience,
        foodXp,
      })
    ) {
      break;
    }

    experience += foodXp;
  }

  return requests;
};

const getAnimalFeedRequests = ({
  animal,
  game,
  buildingKey,
}: {
  animal: Animal;
  game: GameState;
  buildingKey: AnimalBuildingKey;
}): FeedRequest[] => {
  if (animal.state === "sick") {
    const { amount } = getBarnDelightCost({ state: game });
    return [{ item: "Barn Delight", quantity: new Decimal(amount) }];
  }

  if (!isAnimalAwakeAndRequestingFood(animal)) {
    return [];
  }

  if (hasFreeFeedBoost(animal.type, game)) {
    return [];
  }

  if (!isAnimalFeedable(buildingKey, game, animal.id)) {
    return [];
  }

  return getFeedRequestsUntilReady({ animal, game });
};

const getBuildingRequests = ({
  buildingKey,
  animals,
  game,
}: {
  buildingKey: AnimalBuildingKey;
  animals: Animal[];
  game: GameState;
}): { requests: RequestTotals; animalsWaiting: number } => {
  const requests: RequestTotals = {};
  let animalsWaiting = 0;

  animals.forEach((animal) => {
    const animalRequests = getAnimalFeedRequests({ animal, game, buildingKey });

    if (animalRequests.length > 0) {
      animalsWaiting += 1;
    }

    animalRequests.forEach((request) =>
      addToTotals(requests, request.item, request.quantity),
    );
  });

  return { requests, animalsWaiting };
};

export function getBulkMixRequirements(
  game: GameState,
  building: "Hen House" | "Barn",
) {
  const buildingKey = makeAnimalBuildingKey(building);
  const animals = Object.values(game[buildingKey].animals);
  const { requests, animalsWaiting } = getBuildingRequests({
    buildingKey,
    animals,
    game,
  });

  // Free boosts feeding/curing this building's animals, surfaced to explain
  // why there are no requests.
  const animalTypesPresent = [...new Set(animals.map((animal) => animal.type))];
  const freeFeedBoosts: FreeFeedBoost[] = animalTypesPresent
    .filter((animalType) => hasFreeFeedBoost(animalType, game))
    .map((animalType) => ({
      source: "collectible",
      item: FREE_FEED_COLLECTIBLE[animalType],
      animalType,
    }));

  // Oracle Syringe cures sick animals for free (Barn Delight cost 0), so when
  // a sick animal would otherwise request it, surface the syringe instead.
  const hasSickAnimal = animals.some((animal) => animal.state === "sick");
  if (hasSickAnimal && isWearableActive({ game, name: "Oracle Syringe" })) {
    freeFeedBoosts.push({ source: "wearable", item: "Oracle Syringe" });
  }

  const missingRequests: RequestTotals = {};
  const ingredients: GameState["inventory"] = {};
  const feeds: BulkMixFeed[] = [];
  let coins = 0;

  getKeys(requests).forEach((item) => {
    const requested = requests[item] ?? new Decimal(0);
    const inInventory = game.inventory[item] ?? new Decimal(0);
    const difference = requested.sub(inInventory);
    const missing = difference.lessThan(0) ? new Decimal(0) : difference;

    const feedIngredients: GameState["inventory"] = {};
    let feedCoins = 0;

    if (missing.gt(0)) {
      missingRequests[item] = missing;

      const { ingredients: mixIngredients } = getIngredients({
        state: game,
        name: item,
      });

      const feed = ANIMAL_FOODS[item];
      feedCoins = (feed.coins ?? 0) * missing.toNumber();
      coins += feedCoins;

      getKeys(mixIngredients).forEach((ingredient) => {
        const amount =
          mixIngredients[ingredient]?.mul(missing) ?? new Decimal(0);
        feedIngredients[ingredient] = amount;
        ingredients[ingredient] = (
          ingredients[ingredient] ?? new Decimal(0)
        ).add(amount);
      });
    }

    feeds.push({
      item,
      type: ANIMAL_FOODS[item].type,
      requested,
      inInventory,
      missing,
      ingredients: feedIngredients,
      coins: feedCoins,
    });
  });

  return {
    requests,
    missingRequests,
    feeds,
    animalsWaiting,
    freeFeedBoosts,
    requirements: {
      ingredients,
      coins,
    },
  };
}
