import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { Animal, GameState } from "features/game/types/game";
import {
  getAnimalReadyAt,
  isMuddy,
  MUD_PER_APPLICATION,
} from "features/game/lib/animals";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { hasFeatureAccess } from "lib/flags";
import { getAnimalHarvests } from "./applyAnimalFeedBuff";
import { isAnimalNeedingLove } from "./loveAnimal";

export enum APPLY_MUD_ERRORS {
  NO_FEATURE_ACCESS = "You do not have access to Mud",
  SICK = "Cannot apply Mud while the Pig is sick",
  ALREADY_MUDDY = "Pig already has Mud",
  NEEDS_LOVE = "Pet your Pig before using this",
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
 * An asleep Pig whose love window has opened must be petted first - the same
 * rule as a spice-rack treat (`applyAnimalFeedBuff`).
 */
export function isPigNeedingLoveForMud(
  pig: Animal,
  game: GameState,
  now: number,
): boolean {
  const readyAt = getAnimalReadyAt(pig, game);
  return now < readyAt && isAnimalNeedingLove(pig, now, readyAt);
}

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

  if ((state.inventory.Mud ?? new Decimal(0)).lessThan(MUD_PER_APPLICATION)) {
    throw new Error(APPLY_MUD_ERRORS.NOT_ENOUGH);
  }
}

export function applyMud({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    assertCanApplyMud(copy);

    const pig = copy.pigpen.animals[action.id];

    if (!pig) {
      throw new Error(`Animal ${action.id} not found in building pigpen`);
    }

    if (pig.state === "sick") {
      throw new Error(APPLY_MUD_ERRORS.SICK);
    }

    if (isPigNeedingLoveForMud(pig, copy, createdAt)) {
      throw new Error(APPLY_MUD_ERRORS.NEEDS_LOVE);
    }

    // Rejected rather than topped up, so a stray click never wastes Mud.
    if (isMuddy(pig)) {
      throw new Error(APPLY_MUD_ERRORS.ALREADY_MUDDY);
    }

    copy.inventory.Mud = (copy.inventory.Mud as Decimal).minus(
      MUD_PER_APPLICATION,
    );
    // As many charges as a treat: 3, or 6 with a placed Vibraphone.
    const { harvests, boostsUsed } = getAnimalHarvests(copy);
    pig.mud = { harvestsRemaining: harvests };

    copy.boostsUsedAt = updateBoostUsed({
      game: copy,
      boostNames: boostsUsed,
      createdAt,
    });
  });
}
