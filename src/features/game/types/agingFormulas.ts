import type { Skills } from "./game";

export const PRIME_AGED_XP_MULTIPLIER = 1.3;
export const PRIME_AGED_BASE_CHANCE = 0.1;

export function getAgingMaxXP(baseXP: number): number {
  if (baseXP < 100) return baseXP * 5;
  if (baseXP <= 160) return baseXP * 6;
  return baseXP * 10;
}

export function getAgingSaltCost(baseXP: number): number {
  return Math.ceil(getAgingMaxXP(baseXP) / 25);
}

export function getAgingTimeMs(baseXP: number): number {
  const maxXP = getAgingMaxXP(baseXP);
  let j: number;
  if (baseXP < 100) j = 200;
  else if (baseXP <= 160) j = 300;
  else if (baseXP < 1000) j = 500;
  else j = 1000;

  const timeHours = (maxXP - baseXP) / j;
  return timeHours * 60 * 60 * 1000;
}

export function getAgingSlotCount(agingShedLevel: number): number {
  if (agingShedLevel < 1) {
    return 0;
  }

  return Math.min(agingShedLevel, 6);
}

export function getBoostedAgingTimeMs(baseXP: number, skills: Skills): number {
  let timeMs = getAgingTimeMs(baseXP);
  if (skills["Speedy Aging"]) {
    timeMs *= 0.9;
  }
  return timeMs;
}

export function getPrimeAgedChance(skills: Skills): number {
  let chance = PRIME_AGED_BASE_CHANCE * 100;
  if (skills["Fish Smoking"]) {
    chance *= 2;
  }
  return chance;
}

export function getAgingInputMultiplier(skills: Skills): number {
  return skills["Ager"] ? 2 : 1;
}

export function getAgingOutputBonus(skills: Skills): number {
  return skills["Ager"] ? 1 : 0;
}

export function getBoostedAgingSaltCost(
  baseXP: number,
  skills: Skills,
): number {
  return getAgingSaltCost(baseXP) * getAgingInputMultiplier(skills);
}

export function getBoostedAgingFishCost(skills: Skills): number {
  return 1 * getAgingInputMultiplier(skills);
}

export function getRefinedSaltChance(skills: Skills): number {
  return skills["Refiner"] ? 15 : 0;
}
