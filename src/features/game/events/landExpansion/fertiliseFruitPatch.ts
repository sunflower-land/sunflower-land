import Decimal from "decimal.js-light";
import {
  FRUIT_COMPOST,
  FruitCompostName,
} from "features/game/types/composters";
import { BoostName, GameState, PlantedFruit } from "features/game/types/game";
import { PATCH_FRUIT, PATCH_FRUIT_SEEDS } from "features/game/types/fruits";
import { produce } from "immer";

function isFruitPatchReadyToHarvest(
  now: number,
  fruit: PlantedFruit,
  plantSeconds: number,
): boolean {
  const cycleMs = plantSeconds * 1000;
  return now - fruit.plantedAt >= cycleMs && now - fruit.harvestedAt >= cycleMs;
}

/** Shifts plantedAt/harvestedAt so remaining time is multiplied by 0.8 (−20%), matching getFruitPatchTime. */
function applyTurbofruitMixToRemainingGrowTime(
  fruit: PlantedFruit,
  now: number,
  plantSeconds: number,
): PlantedFruit {
  const cycleMs = plantSeconds * 1000;

  if (now - fruit.plantedAt < cycleMs) {
    const cycleEnd = fruit.plantedAt + cycleMs;
    const timeReduction = (cycleEnd - now) * 0.2;
    return {
      ...fruit,
      plantedAt: fruit.plantedAt - timeReduction,
    };
  }

  if (now - fruit.harvestedAt < cycleMs) {
    const cycleEnd = fruit.harvestedAt + cycleMs;
    const timeReduction = (cycleEnd - now) * 0.2;
    return {
      ...fruit,
      harvestedAt: fruit.harvestedAt - timeReduction,
    };
  }

  return fruit;
}

export enum FERTILISE_FRUIT_ERRORS {
  EMPTY_PATCH = "Fruit Patch does not exist!",
  READY_TO_HARVEST = "Fruit is ready to harvest!",
  FRUIT_ALREADY_FERTILISED = "Fruit is already fertilised!",
  NO_FERTILISER_SELECTED = "No fertiliser selected!",
  NOT_A_FERTILISER = "Not a fertiliser!",
  NOT_ENOUGH_FERTILISER = "Not enough fertiliser!",
}

export type FertiliseFruitAction = {
  type: "fruitPatch.fertilised";
  patchID: string;
  fertiliser: FruitCompostName;
};

type Options = {
  state: Readonly<GameState>;
  action: FertiliseFruitAction;
  createdAt?: number;
};

export const getFruitfulBlendBuff = (
  state: GameState,
): { amount: number; boostsUsed: { name: BoostName; value: string }[] } => {
  let fruitfulBlendBuff = 0.1;
  const boostsUsed: { name: BoostName; value: string }[] = [];
  boostsUsed.push({ name: "Fruitful Blend", value: "+0.1" });
  if (state.bumpkin?.skills["Fruitful Bounty"]) {
    fruitfulBlendBuff *= 2;
    boostsUsed.push({ name: "Fruitful Bounty", value: "+0.1" });
  }

  return { amount: fruitfulBlendBuff, boostsUsed };
};

export function fertiliseFruitPatch({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { fruitPatches, inventory } = stateCopy;

    const fruitPatch = fruitPatches[action.patchID];

    if (!fruitPatch) {
      throw new Error(FERTILISE_FRUIT_ERRORS.EMPTY_PATCH);
    }

    if (fruitPatch.fertiliser) {
      throw new Error(FERTILISE_FRUIT_ERRORS.FRUIT_ALREADY_FERTILISED);
    }

    if (!action.fertiliser) {
      throw new Error(FERTILISE_FRUIT_ERRORS.NO_FERTILISER_SELECTED);
    }

    if (!(action.fertiliser in FRUIT_COMPOST)) {
      throw new Error(FERTILISE_FRUIT_ERRORS.NOT_A_FERTILISER);
    }

    const fertiliserAmount = inventory[action.fertiliser] || new Decimal(0);

    if (fertiliserAmount.lessThan(1)) {
      throw new Error(FERTILISE_FRUIT_ERRORS.NOT_ENOUGH_FERTILISER);
    }

    const fruit = fruitPatch.fruit;
    let nextFruit: PlantedFruit | undefined = fruit;

    if (nextFruit) {
      const { seed } = PATCH_FRUIT[nextFruit.name];
      const { plantSeconds } = PATCH_FRUIT_SEEDS[seed];

      if (isFruitPatchReadyToHarvest(createdAt, nextFruit, plantSeconds)) {
        throw new Error(FERTILISE_FRUIT_ERRORS.READY_TO_HARVEST);
      }

      if (action.fertiliser === "Turbofruit Mix") {
        nextFruit = applyTurbofruitMixToRemainingGrowTime(
          nextFruit,
          createdAt,
          plantSeconds,
        );
      }
    }

    fruitPatches[action.patchID] = {
      ...fruitPatch,
      ...(nextFruit ? { fruit: nextFruit } : {}),
      fertiliser: {
        name: action.fertiliser,
        fertilisedAt: createdAt,
      },
    };

    inventory[action.fertiliser] = fertiliserAmount.minus(1);

    return stateCopy;
  });
}
