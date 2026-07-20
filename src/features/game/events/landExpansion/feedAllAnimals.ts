import {
  ANIMALS,
  type AnimalBuildingType,
  type AnimalType,
} from "features/game/types/animals";
import type { CollectibleName } from "features/game/types/craftables";
import type { GameState } from "features/game/types/game";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import { getKeys } from "lib/object";
import { isAnimalFeedable } from "./buyAnimal";

export const GOLDEN_ANIMAL_ASSETS: Record<AnimalType, CollectibleName> = {
  Chicken: "Gold Egg",
  Cow: "Golden Cow",
  Sheep: "Golden Sheep",
};

export function getCoveredAnimalTypes({
  state,
  building,
}: {
  state: GameState;
  building: AnimalBuildingType;
}): AnimalType[] {
  return getKeys(ANIMALS).filter(
    (type) =>
      ANIMALS[type].buildingRequired === building &&
      isCollectibleBuilt({ name: GOLDEN_ANIMAL_ASSETS[type], game: state }),
  );
}

export type FeedAllTargets = {
  toClaim: string[];
  toCure: string[];
  toFeed: string[];
};

export function getFeedAllTargets({
  state,
  building,
  createdAt = Date.now(),
}: {
  state: GameState;
  building: AnimalBuildingType;
  createdAt?: number;
}): FeedAllTargets {
  const covered = getCoveredAnimalTypes({ state, building });
  const buildingKey = makeAnimalBuildingKey(building);
  const hasOracleSyringe = isWearableActive({
    name: "Oracle Syringe",
    game: state,
  });
  const { animals } = state[buildingKey];

  const targets: FeedAllTargets = { toClaim: [], toCure: [], toFeed: [] };

  getKeys(animals).forEach((id) => {
    const animal = animals[id];

    if (!covered.includes(animal.type)) return;

    // Sleeping animals (including needsLove, which only occurs while
    // asleep) are never touched by the bulk action.
    if (createdAt < animal.awakeAt) return;

    if (animal.state === "ready") {
      // Capacity lock does not block claiming, matching the manual UI.
      targets.toClaim.push(id);
      return;
    }

    if (animal.state === "sick") {
      if (hasOracleSyringe) targets.toCure.push(id);
      return;
    }

    if (isAnimalFeedable(buildingKey, state, id)) {
      targets.toFeed.push(id);
    }
  });

  return targets;
}
