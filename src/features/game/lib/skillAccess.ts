import {
  type BumpkinRevampSkillName,
  type BumpkinRevampSkillTree,
  getRevampSkills,
} from "features/game/types/bumpkinSkills";
import type { GameState } from "features/game/types/game";
import { type FeatureName, hasFeatureAccess } from "lib/flags";

/**
 * Skills that can only be chosen or upgraded while a feature flag is on. The
 * Pig skills (#7721) follow the Pigpen, which is testnet-only.
 */
const SKILL_FEATURE_FLAGS: Partial<
  Record<BumpkinRevampSkillName, FeatureName>
> = {
  "Swill Savvy": "PIGPEN",
  "Truffle Yield": "PIGPEN",
  "Bristle Payout": "PIGPEN",
};

export function hasSkillAccess(
  game: GameState,
  skill: BumpkinRevampSkillName,
): boolean {
  const feature = SKILL_FEATURE_FLAGS[skill];
  return !feature || hasFeatureAccess(game, feature);
}

/** A tree's skills, without the ones whose feature flag is off. */
export function getAvailableRevampSkills(
  tree: BumpkinRevampSkillTree,
  game: GameState,
) {
  return getRevampSkills(tree).filter((skill) =>
    hasSkillAccess(game, skill.name as BumpkinRevampSkillName),
  );
}
