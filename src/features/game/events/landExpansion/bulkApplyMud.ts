import Decimal from "decimal.js-light";
import type { GameState } from "features/game/types/game";
import { isMuddy, MUD_PER_APPLICATION } from "features/game/lib/animals";
import {
  applyMud,
  APPLY_MUD_ERRORS,
  assertCanApplyMud,
  isPigNeedingLoveForMud,
} from "./applyMud";

export type BulkApplyMudAction = {
  type: "pigs.bulkMudApplied";
};

type Options = {
  state: Readonly<GameState>;
  action: BulkApplyMudAction;
  createdAt?: number;
};

/**
 * Pigs the building-level Apply Mud action would treat, oldest first. Skips
 * the Pigs `applyMud` would reject: already muddy, sick, or asleep and waiting
 * to be petted.
 */
export function getPigsNeedingMud(state: GameState, now: number): string[] {
  return (
    Object.values(state.pigpen.animals)
      .filter(
        (pig) =>
          !isMuddy(pig) &&
          pig.state !== "sick" &&
          !isPigNeedingLoveForMud(pig, state, now),
      )
      // Oldest Pig first, the order the over-capacity lock uses too. Ids are a
      // mix of starter indexes and uuid prefixes, so they are only a tie-break.
      .sort(
        (a, b) =>
          a.createdAt - b.createdAt ||
          a.id.localeCompare(b.id, undefined, { numeric: true }),
      )
      .map((pig) => pig.id)
  );
}

/**
 * Applies one Mud application to each Pig that needs it. With too little Mud for all of
 * them, muds as many as it covers rather than failing.
 */
export function bulkApplyMud({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  assertCanApplyMud(state);

  const eligible = getPigsNeedingMud(state, createdAt);
  if (eligible.length === 0) {
    throw new Error(APPLY_MUD_ERRORS.NO_PIGS);
  }

  const mud = (state.inventory.Mud ?? new Decimal(0)).toNumber();

  // One source of truth: every Pig goes through the single-Pig event.
  const applications = Math.floor(mud / MUD_PER_APPLICATION);
  return eligible.slice(0, applications).reduce<GameState>(
    (game, id) =>
      applyMud({
        state: game,
        action: { type: "animal.mudApplied", id },
        createdAt,
      }),
    state,
  );
}
