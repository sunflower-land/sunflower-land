import Decimal from "decimal.js-light";
import {
  FRUIT_COMPOST,
  type FruitCompostName,
} from "features/game/types/composters";
import type {
  BoostName,
  GameState,
  PlantedFruit,
} from "features/game/types/game";
import { produce } from "immer";
import { isFruitReadyToHarvest } from "./fruitPatchReadiness";
import { SKILL_RANKS, getSkillLevel } from "features/game/types/bumpkinSkills";
import { FRUITFUL_BLEND_YIELD } from "features/game/types/fertilisers";

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
  const base = new Decimal(FRUITFUL_BLEND_YIELD);
  let fruitfulBlendBuff = base;
  const boostsUsed: { name: BoostName; value: string }[] = [];
  boostsUsed.push({
    name: "Fruitful Blend",
    value: `+${FRUITFUL_BLEND_YIELD}`,
  });
  const fruitfulBountyLevel = getSkillLevel(
    state.bumpkin?.skills ?? {},
    "Fruitful Bounty",
  );
  if (fruitfulBountyLevel) {
    const v = SKILL_RANKS["Fruitful Bounty"].ranks[fruitfulBountyLevel - 1];
    // The skill multiplies Fruitful Blend's base effect, so the marginal gain
    // is (multiplier - 1) x base. Done in Decimal because the base is 0.1:
    // a plain 0.1 * 3 yields 0.30000000000000004.
    const added = base.mul(v - 1);
    fruitfulBlendBuff = base.mul(v);
    boostsUsed.push({
      name: "Fruitful Bounty",
      value: `+${added.toNumber()}`,
    });
  }

  return { amount: fruitfulBlendBuff.toNumber(), boostsUsed };
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
    const nextFruit: PlantedFruit | undefined = fruit;

    if (nextFruit) {
      // The patch has no fertiliser yet (guarded above), so readiness uses the
      // existing (non-Turbofruit) windows — correct, we haven't applied it yet.
      if (
        isFruitReadyToHarvest(
          createdAt,
          nextFruit,
          stateCopy,
          fruitPatch.fertiliser,
        )
      ) {
        throw new Error(FERTILISE_FRUIT_ERRORS.READY_TO_HARVEST);
      }

      // Turbofruit Mix is a live 1.25× window from fertilisedAt (set below), so it
      // needs no fruit mutation.
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
