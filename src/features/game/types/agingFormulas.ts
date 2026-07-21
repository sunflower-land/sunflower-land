import type Decimal from "decimal.js-light";
import { prngChance } from "lib/prng";
import type { GameState, InventoryItemName } from "./game";
import type { FermentationBait } from "./fishing";
import { SKILL_RANKS, getSkillLevel } from "./bumpkinSkills";
import {
  PRIME_AGED_BASE_CHANCE,
  getAgingSaltCost,
  getAgingTimeMs,
} from "./agingBase";

// Re-exported so existing callers can keep importing the base maths from here.
// `consumables.ts` must import them from `./agingBase` directly instead — going
// through this module would re-form the import cycle the leaf exists to break.
export {
  PRIME_AGED_XP_MULTIPLIER,
  PRIME_AGED_BASE_CHANCE,
  getAgingMaxXP,
  getAgingSaltCost,
  getAgingTimeMs,
} from "./agingBase";

const BAIT_ITEMS = new Set<FermentationBait>([
  "Capsule Bait",
  "Umbrella Bait",
  "Crimson Baitfish",
]);

export function isBaitItem(item: InventoryItemName): item is FermentationBait {
  return BAIT_ITEMS.has(item as FermentationBait);
}

export function getAgingSlotCount(agingShedLevel: number): number {
  if (agingShedLevel < 1) {
    return 1;
  }

  return Math.min(agingShedLevel, 6);
}

export function getBoostedAgingTimeMs(
  baseXP: number,
  state: GameState,
): number {
  const skills = state.bumpkin.skills;
  let timeMs = getAgingTimeMs(baseXP);

  const speedyAgingLevel = getSkillLevel(skills, "Speedy Aging");
  if (speedyAgingLevel) {
    timeMs *= SKILL_RANKS["Speedy Aging"].ranks[speedyAgingLevel - 1];
  }
  if ((state.sculptures?.["Salt Sculpture"]?.level ?? 0) >= 5) {
    timeMs *= 0.95;
  }
  return timeMs;
}

export function getPrimeAgedChance(state: GameState): number {
  const skills = state.bumpkin?.skills;
  let chance = PRIME_AGED_BASE_CHANCE * 100;
  const fishSmokingLevel = getSkillLevel(skills ?? {}, "Fish Smoking");
  if (fishSmokingLevel) {
    chance *= SKILL_RANKS["Fish Smoking"].ranks[fishSmokingLevel - 1];
  }
  if ((state.sculptures?.["Salt Sculpture"]?.level ?? 0) >= 2) {
    chance += 4;
  }
  return chance;
}

/**
 * The Ager input cost multiplier.
 *
 * Defaults to the player's live rank, which is right when the inputs are about
 * to be charged (starting a job) or previewed (an empty rack). Callers showing
 * an already-started job pass its stamped rank instead, so the cost they
 * display is the one that was actually paid.
 *
 * `agerLevel` is coalesced with `??`, not `||`: a job started without Ager
 * stamps 0, and that 0 must survive even once the player has the skill.
 */
export function getAgingInputMultiplier(
  state: GameState,
  agerLevel?: number,
): number {
  const level = agerLevel ?? getSkillLevel(state.bumpkin?.skills ?? {}, "Ager");
  return level ? SKILL_RANKS["Ager"].ranks[level - 1] : 1;
}

export function getAgingOutput(
  state: GameState,
  baseAmount: Decimal,
  item: InventoryItemName,
  // The Ager rank stamped on the job at start (0 = Ager was not applied), not
  // the player's live rank — the inputs were already charged at this rank.
  agerLevel: number,
  prngArgs?: { farmId: number; itemId: number; counter: number },
): Decimal {
  const skills = state.bumpkin.skills;
  let output = baseAmount;
  if (agerLevel) {
    output = output.mul(SKILL_RANKS["Ager"].ranks[agerLevel - 1]);
  }

  if (prngArgs) {
    const { farmId, itemId, counter } = prngArgs;
    const refinerLevel = getSkillLevel(skills, "Refiner");
    if (item === "Refined Salt" && refinerLevel) {
      const isBonus = prngChance({
        farmId,
        itemId,
        counter,
        chance: SKILL_RANKS["Refiner"].ranks[refinerLevel - 1],
        criticalHitName: "Refiner",
      });
      if (isBonus) {
        output = output.add(1);
      }
    }
  }

  const bacalhauLevel = getSkillLevel(skills, "Bacalhau");
  if (bacalhauLevel && isBaitItem(item)) {
    output = output.add(SKILL_RANKS["Bacalhau"].ranks[bacalhauLevel - 1]);
  }

  return output;
}

// `agerLevel` is optional and threads through to getAgingInputMultiplier — omit
// it to charge/preview at the live rank, pass a job's stamped rank to show what
// that job actually cost.
export function getBoostedAgingSaltCost(
  baseXP: number,
  state: GameState,
  agerLevel?: number,
): number {
  return getAgingSaltCost(baseXP) * getAgingInputMultiplier(state, agerLevel);
}

export function getBoostedAgingFishCost(
  state: GameState,
  agerLevel?: number,
): number {
  return 1 * getAgingInputMultiplier(state, agerLevel);
}

export function getRefinedSaltChance(state: GameState): number {
  const refinerLevel = getSkillLevel(state.bumpkin?.skills ?? {}, "Refiner");
  return refinerLevel ? SKILL_RANKS["Refiner"].ranks[refinerLevel - 1] : 0;
}
