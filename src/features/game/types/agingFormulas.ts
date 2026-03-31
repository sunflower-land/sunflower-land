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
