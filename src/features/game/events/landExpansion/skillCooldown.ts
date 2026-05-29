import type { BumpkinRevampSkillName } from "features/game/types/bumpkinSkills";
import type { SkillLastChangedAt } from "features/game/types/game";

// Once a skill is added or removed, the player can't reverse the transition
// for SKILL_COOLDOWN_MS. Per-skill (each skill has its own clock), and
// enforced in both directions: can't pick a just-removed skill, can't remove
// a just-picked skill. Only applies to the EDIT_SKILLSET cohort (skills.updated
// + skill.chosen); the legacy skills.reset path is unaffected.
export const SKILL_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

// Milliseconds until `skill` can be transitioned again, or 0 if it's free now.
export function getRemainingSkillCooldownMs(
  map: SkillLastChangedAt | undefined,
  skill: BumpkinRevampSkillName,
  now: number,
): number {
  const stamp = map?.[skill];
  if (stamp == null) return 0;
  const remaining = stamp + SKILL_COOLDOWN_MS - now;
  return Math.max(0, remaining);
}

// Drop entries whose cooldown has elapsed — keeps the map bounded by
// "skills touched in the last week" instead of growing forever.
export function pruneExpiredSkillCooldowns(
  map: SkillLastChangedAt,
  now: number,
): void {
  for (const key of Object.keys(map)) {
    const skill = key as BumpkinRevampSkillName;
    const stamp = map[skill];
    if (stamp != null && now - stamp >= SKILL_COOLDOWN_MS) {
      delete map[skill];
    }
  }
}
