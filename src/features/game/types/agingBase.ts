/**
 * The unboosted aging maths — no skills, no game state, no imports.
 *
 * This is a leaf so that `consumables.ts` can read the base XP figures without
 * dragging in `agingFormulas.ts`, which reads SKILL_RANKS and would otherwise
 * close the cycle agingFormulas -> bumpkinSkills -> images -> achievements ->
 * consumables -> agingFormulas. Anything here must stay import-free; boosted
 * variants belong in `agingFormulas.ts`.
 */

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
