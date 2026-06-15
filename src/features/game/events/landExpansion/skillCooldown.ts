import type { BumpkinRevampSkillName } from "features/game/types/bumpkinSkills";
import type { SkillLastChangedAt } from "features/game/types/game";

// A small set of high-impact skills can't be removed for SKILL_COOLDOWN_MS
// after they're picked, to stop players cycling them on and off around timed
// activities. Every other skill is freely changeable in either direction, and
// picking a skill is never blocked. Only applies to the EDIT_SKILLSET cohort
// (skills.updated + skill.chosen); the legacy skills.reset path is unaffected.
export const SKILL_COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

// The only skills subject to the removal cooldown.
export const COOLDOWN_SKILLS: BumpkinRevampSkillName[] = ["Double Nom", "Ager"];

export function isCooldownSkill(skill: BumpkinRevampSkillName): boolean {
  return COOLDOWN_SKILLS.includes(skill);
}

// Milliseconds until `skill` can be removed again, or 0 if it's free now.
// Non-cooldown skills are never on cooldown, so a stale stamp left in the map
// (e.g. from the old symmetric behaviour) is ignored rather than honored until
// pruneExpiredSkillCooldowns runs.
export function getRemainingSkillCooldownMs(
  map: SkillLastChangedAt | undefined,
  skill: BumpkinRevampSkillName,
  now: number,
): number {
  if (!isCooldownSkill(skill)) return 0;
  const stamp = map?.[skill];
  if (stamp == null) return 0;
  const remaining = stamp + SKILL_COOLDOWN_MS - now;
  return Math.max(0, remaining);
}

// Drop entries that are no longer cooldown-tracked or whose window has elapsed.
// Keeps the map bounded to the at-most-two active cooldown skills and clears
// out stamps left over from the previous symmetric-cooldown behaviour.
export function pruneExpiredSkillCooldowns(
  map: SkillLastChangedAt,
  now: number,
): void {
  for (const key of Object.keys(map)) {
    const skill = key as BumpkinRevampSkillName;
    const stamp = map[skill];
    if (
      !isCooldownSkill(skill) ||
      stamp == null ||
      now - stamp >= SKILL_COOLDOWN_MS
    ) {
      delete map[skill];
    }
  }
}
