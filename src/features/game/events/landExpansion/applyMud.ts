import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import { isMuddy, MUD_FEEDS } from "features/game/lib/animals";
import { hasFeatureAccess } from "lib/flags";

export enum APPLY_MUD_ERRORS {
  NO_FEATURE_ACCESS = "You do not have access to Mud",
  SICK = "Cannot apply Mud while the Pig is sick",
  ALREADY_MUDDY = "Pig already has Mud",
  NOT_ENOUGH = "Not enough Mud",
  NO_PIGS = "No pigs need Mud",
}

export type ApplyMudAction = {
  type: "animal.mudApplied";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ApplyMudAction;
  createdAt?: number;
};

/**
 * Checks shared by the single and bulk Mud events. Kept separate from the
 * per-Pig checks so the bulk event can report a missing Pigpen or empty Mud
 * before it looks for eligible Pigs.
 */
export function assertCanApplyMud(state: GameState) {
  if (!hasFeatureAccess(state, "PIGPEN")) {
    throw new Error(APPLY_MUD_ERRORS.NO_FEATURE_ACCESS);
  }

  if (!state.buildings.Pigpen?.some((building) => !!building.coordinates)) {
    throw new Error("Building does not exist");
  }

  if ((state.inventory.Mud ?? new Decimal(0)).lessThan(1)) {
    throw new Error(APPLY_MUD_ERRORS.NOT_ENOUGH);
  }
}

export function applyMud({ state, action }: Options): GameState {
  return produce(state, (copy) => {
    assertCanApplyMud(copy);

    const pig = copy.pigpen.animals[action.id];

    if (!pig) {
      throw new Error(`Animal ${action.id} not found in building pigpen`);
    }

    if (pig.state === "sick") {
      throw new Error(APPLY_MUD_ERRORS.SICK);
    }

    // Rejected rather than topped up, so a stray click never wastes Mud.
    if (isMuddy(pig)) {
      throw new Error(APPLY_MUD_ERRORS.ALREADY_MUDDY);
    }

    copy.inventory.Mud = (copy.inventory.Mud as Decimal).minus(1);
    pig.mud = { feedsRemaining: MUD_FEEDS };
  });
}
