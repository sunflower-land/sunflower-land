import Decimal from "decimal.js-light";
import type { GameState } from "features/game/types/game";
import { isMuddy } from "features/game/lib/animals";
import { isAnimalFeedable } from "./buyAnimal";
import { applyMud, APPLY_MUD_ERRORS, assertCanApplyMud } from "./applyMud";

export type BulkApplyMudAction = {
  type: "pigs.bulkMudApplied";
};

type Options = {
  state: Readonly<GameState>;
  action: BulkApplyMudAction;
  createdAt?: number;
};

/**
 * Pigs the building-level Apply Mud action would treat, lowest id first. Skips
 * Pigs that are already muddy, sick, or locked over the pen's capacity - Mud on
 * a Pig that cannot be fed would be wasted.
 */
export function getPigsNeedingMud(state: GameState): string[] {
  return Object.values(state.pigpen.animals)
    .filter(
      (pig) =>
        !isMuddy(pig) &&
        pig.state !== "sick" &&
        isAnimalFeedable("pigpen", state, pig.id),
    )
    .map((pig) => pig.id)
    .sort();
}

/**
 * Applies 1 Mud to each Pig that needs it. With too little Mud for all of
 * them, muds as many as it covers rather than failing.
 */
export function bulkApplyMud({ state, createdAt }: Options): GameState {
  assertCanApplyMud(state);

  const eligible = getPigsNeedingMud(state);
  if (eligible.length === 0) {
    throw new Error(APPLY_MUD_ERRORS.NO_PIGS);
  }

  const mud = (state.inventory.Mud ?? new Decimal(0)).toNumber();

  // One source of truth: every Pig goes through the single-Pig event.
  return eligible.slice(0, Math.floor(mud)).reduce<GameState>(
    (game, id) =>
      applyMud({
        state: game,
        action: { type: "animal.mudApplied", id },
        createdAt,
      }),
    state,
  );
}
