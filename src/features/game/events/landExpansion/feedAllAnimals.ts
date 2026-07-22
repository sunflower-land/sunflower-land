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
import { claimProduce } from "./claimProduce";
import { feedAnimal } from "./feedAnimal";

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

export type FeedAllAnimalsAction = {
  type: "animals.fedAll";
  building: AnimalBuildingType;
};

type Options = {
  state: Readonly<GameState>;
  action: FeedAllAnimalsAction;
  createdAt?: number;
};

export function feedAllAnimals({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const buildings = state.buildings[action.building];
  if (!buildings?.some((building) => !!building.coordinates)) {
    throw new Error("Building does not exist");
  }

  if (
    getCoveredAnimalTypes({ state, building: action.building }).length === 0
  ) {
    throw new Error("No active golden asset for this building");
  }

  const { toClaim, toCure, toFeed } = getFeedAllTargets({
    state,
    building: action.building,
    createdAt,
  });

  if (toClaim.length + toCure.length + toFeed.length === 0) {
    throw new Error("No animals to feed");
  }

  const buildingKey = makeAnimalBuildingKey(action.building);

  // Compose the existing single-animal handlers so XP, boosts, rewards and
  // activity tracking keep a single source of truth.
  let game: GameState = state;

  toClaim.forEach((id) => {
    game = claimProduce({
      state: game,
      action: {
        type: "produce.claimed",
        animal: game[buildingKey].animals[id].type,
        id,
      },
      createdAt,
    });
  });

  toCure.forEach((id) => {
    const { type } = game[buildingKey].animals[id];
    // Free with the Oracle Syringe (getFeedAllTargets only cures when active)
    game = feedAnimal({
      state: game,
      action: { type: "animal.fed", animal: type, id, item: "Barn Delight" },
      createdAt,
    });
    if (isAnimalFeedable(buildingKey, game, id)) {
      game = feedAnimal({
        state: game,
        action: { type: "animal.fed", animal: type, id },
        createdAt,
      });
    }
  });

  toFeed.forEach((id) => {
    game = feedAnimal({
      state: game,
      action: {
        type: "animal.fed",
        animal: game[buildingKey].animals[id].type,
        id,
      },
      createdAt,
    });
  });

  // Feeding can level an animal up into "ready" — harvest those in the same
  // action so a single click never leaves produce waiting behind it.
  [...toCure, ...toFeed].forEach((id) => {
    const animal = game[buildingKey].animals[id];
    if (animal.state !== "ready") return;

    game = claimProduce({
      state: game,
      action: { type: "produce.claimed", animal: animal.type, id },
      createdAt,
    });
  });

  return game;
}
