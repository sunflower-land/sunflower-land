import Decimal from "decimal.js-light";
import { CROPS } from "../types/crops";
import { Fertiliser, GameState } from "../types/game";

export type FertiliseCropAction = {
  type: "item.fertilised";
  fieldIndex: number;
  fertiliser: Fertiliser;
};

type Options = {
  state: Readonly<GameState>;
  action: FertiliseCropAction;
  createdAt?: number;
};

export function fertiliseCrop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const field = state.fields[action.fieldIndex];

  if (!field) {
    throw new Error("Cannot fertilise an empty field");
  }

  const cropDetails = CROPS()[field.name];
  if (Date.now() - field.plantedAt > cropDetails.harvestSeconds * 1000) {
    throw new Error("Crop is already grown");
  }

  const fertilisers = field.fertilisers || [];

  const alreadyApplied = fertilisers.find(
    (fertiliser) => fertiliser.name === action.fertiliser
  );

  if (alreadyApplied) {
    throw new Error("Crop is already fertilised");
  }

  const fertiliserAmount = state.inventory[action.fertiliser] || new Decimal(0);

  if (fertiliserAmount.lt(1)) {
    throw new Error("Not enough fertiliser");
  }

  return {
    ...state,
    inventory: {
      ...state.inventory,
      [action.fertiliser]: fertiliserAmount.minus(1),
    },
    fields: {
      ...state.fields,
      [action.fieldIndex]: {
        ...field,
        // Rapid Growth is the only available fertiliser right now
        plantedAt: field.plantedAt - (cropDetails.harvestSeconds * 1000) / 2,
        fertilisers: [
          ...fertilisers,
          {
            name: action.fertiliser,
            fertilisedAt: createdAt,
          },
        ],
      },
    },
  };
}
