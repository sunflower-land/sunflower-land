import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { SpiceRackJob } from "features/game/lib/agingShed";
import {
  getSpiceRackRecipe,
  getMaxSpiceRackSlots,
  isSpiceRackRecipeName,
  isStartableSpiceRackRecipeName,
  type StartableSpiceRackRecipeName,
} from "features/game/types/spiceRack";
import { getObjectEntries } from "lib/object";
import { GameState } from "features/game/types/game";
import { getAgingInputMultiplier } from "features/game/types/agingFormulas";
import { hasPlacedAgingShed } from "./hasPlacedAgingShed";
import { hasFeatureAccess } from "lib/flags";

export type StartSpiceRackAction = {
  type: "spiceRack.started";
  recipe: StartableSpiceRackRecipeName;
  /** Client-generated id (same idea as fermentation `jobId`). */
  jobId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: StartSpiceRackAction;
  createdAt: number;
};

export function startSpiceRack({
  state,
  action,
  createdAt,
}: Options): GameState {
  if (!hasFeatureAccess(state, "AGING_SHED")) {
    throw new Error("Aging Shed not enabled");
  }

  return produce(state, (game) => {
    if (!hasPlacedAgingShed(game)) {
      throw new Error("Required building does not exist");
    }

    if (!isSpiceRackRecipeName(action.recipe)) {
      throw new Error("Invalid spice rack recipe");
    }

    if (!isStartableSpiceRackRecipeName(action.recipe)) {
      throw new Error("This spice rack recipe is no longer available.");
    }

    const recipeDef = getSpiceRackRecipe(action.recipe);

    const maxSlots = getMaxSpiceRackSlots(game.agingShed.level);
    const queue = game.agingShed.racks.spice;

    if (queue.some((job) => job.id === action.jobId)) {
      throw new Error("Job already exists");
    }

    if (queue.length >= maxSlots) {
      throw new Error("No available slots");
    }

    const inputMultiplier = getAgingInputMultiplier(game);

    for (const [ingredient, amount] of getObjectEntries(
      recipeDef.ingredients,
    )) {
      const count = game.inventory[ingredient] ?? new Decimal(0);
      const need = (amount ?? new Decimal(0)).mul(inputMultiplier);

      if (count.lessThan(need)) {
        throw new Error(`Insufficient ingredient: ${String(ingredient)}`);
      }

      game.inventory[ingredient] = count.sub(need);
    }

    const readyAt = createdAt + Math.max(0, recipeDef.durationSeconds) * 1000;

    const job: SpiceRackJob = {
      id: action.jobId,
      recipe: action.recipe,
      startedAt: createdAt,
      readyAt,
      // Marks whether the Ager skill was applied at the time of starting
      skills: { Ager: !!game.bumpkin.skills["Ager"] },
    };

    game.agingShed.racks.spice = [...queue, job];
  });
}
