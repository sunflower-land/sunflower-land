import Decimal from "decimal.js-light";
import { prngChance } from "lib/prng";
import type { GameState, InventoryItemName } from "./game";
import { FermentationBait } from "./fishing";

const BAIT_ITEMS = new Set<FermentationBait>([
  "Capsule Bait",
  "Umbrella Bait",
  "Crimson Baitfish",
]);

export function isBaitItem(item: InventoryItemName): item is FermentationBait {
  return BAIT_ITEMS.has(item as FermentationBait);
}

export const PRIME_AGED_XP_MULTIPLIER = 1.3;
export const PRIME_AGED_BASE_CHANCE = 0.1;

export function getAgingMaxXP(baseXP: number): number {
  if (baseXP <= 200) return baseXP * 3;
  if (baseXP <= 330) return baseXP * 4;
  return baseXP * 5;
}

export function getAgingSaltCost(baseXP: number): number {
  return Math.round(getAgingMaxXP(baseXP) / 50);
}

export function getAgingTimeMs(baseXP: number): number {
  const maxXP = getAgingMaxXP(baseXP);
  let j: number;
  if (baseXP <= 200) j = 300;
  else if (baseXP <= 330) j = 500;
  else j = 1000;

  const timeHours = (maxXP - baseXP) / j;
  return timeHours * 60 * 60 * 1000;
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

  if (skills["Speedy Aging"]) {
    timeMs *= 0.9;
  }
  if ((state.sculptures?.["Salt Sculpture"]?.level ?? 0) >= 5) {
    timeMs *= 0.95;
  }
  return timeMs;
}

export function getPrimeAgedChance(state: GameState): number {
  const skills = state.bumpkin?.skills;
  let chance = PRIME_AGED_BASE_CHANCE * 100;
  if (skills?.["Fish Smoking"]) {
    chance *= 2;
  }
  if ((state.sculptures?.["Salt Sculpture"]?.level ?? 0) >= 2) {
    chance += 4;
  }
  return chance;
}

export function getAgingInputMultiplier(state: GameState): number {
  const skills = state.bumpkin?.skills;
  return skills?.["Ager"] ? 2 : 1;
}

export function getAgingOutput(
  state: GameState,
  baseAmount: Decimal,
  item: InventoryItemName,
  agerApplied: boolean,
  prngArgs?: { farmId: number; itemId: number; counter: number },
): Decimal {
  const skills = state.bumpkin.skills;
  let output = baseAmount;
  if (agerApplied) {
    output = output.mul(2);
  }

  if (prngArgs) {
    const { farmId, itemId, counter } = prngArgs;
    if (item === "Refined Salt" && skills.Refiner) {
      const isBonus = prngChance({
        farmId,
        itemId,
        counter,
        chance: 15,
        criticalHitName: "Refiner",
      });
      if (isBonus) {
        output = output.add(1);
      }
    }
  }

  if (skills["Bacalhau"] && isBaitItem(item)) {
    output = output.add(1);
  }

  return output;
}

export function getBoostedAgingSaltCost(
  baseXP: number,
  state: GameState,
): number {
  return getAgingSaltCost(baseXP) * getAgingInputMultiplier(state);
}

export function getBoostedAgingFishCost(state: GameState): number {
  return 1 * getAgingInputMultiplier(state);
}

export function getRefinedSaltChance(state: GameState): number {
  const skills = state.bumpkin?.skills;
  return skills?.["Refiner"] ? 15 : 0;
}
