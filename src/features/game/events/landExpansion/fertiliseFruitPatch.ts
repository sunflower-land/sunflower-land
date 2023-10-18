import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import {
  FRUIT_COMPOST,
  FruitCompostName,
} from "features/game/types/composters";
import { GameState, PlantedFruit } from "features/game/types/game";

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

const getYield = (fruitDetails: PlantedFruit, fertiliser: FruitCompostName) => {
  if (fertiliser === "Fruitful Blend") {
    return fruitDetails.amount + 0.25;
  }

  return fruitDetails.amount;
};

export function fertiliseFruitPatch({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
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

  // Apply fertiliser
  fruitPatches[action.patchID] = {
    ...fruitPatch,
    fertiliser: {
      name: action.fertiliser,
      fertilisedAt: createdAt,
    },
  };

  // Apply boost to already planted
  if (fruitPatch.fruit) {
    fruitPatch.fruit.amount += 0.1;
  }

  inventory[action.fertiliser] = fertiliserAmount.minus(1);

  return stateCopy;
}
