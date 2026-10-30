import {
  BUMPKIN_REVAMP_SKILL_TREE,
  type BumpkinRevampSkillName,
  type BumpkinRevampSkillTree,
  getRevampSkills,
} from "features/game/types/bumpkinSkills";
import type { GameState } from "features/game/types/game";
import {
  type TimeBasedFeatureName,
  hasTimeBasedFeatureAccess,
} from "lib/flags";

/**
 * Skills that can only be chosen or upgraded while a feature flag is on. The
 * Pig skills (#7721) follow the Pigpen.
 */
const SKILL_FEATURE_FLAGS: Partial<
  Record<BumpkinRevampSkillName, TimeBasedFeatureName>
> = {
  "Swill Savvy": "PIGPEN",
  "Truffle Yield": "PIGPEN",
  "Bristle Payout": "PIGPEN",
};

/** Whole trees that follow a feature flag. */
const SKILL_TREE_FEATURE_FLAGS: Partial<
  Record<BumpkinRevampSkillTree, TimeBasedFeatureName>
> = {
  Cave: "CAVE",
};

export function hasSkillAccess(
  game: GameState,
  skill: BumpkinRevampSkillName,
  now: number,
): boolean {
  const features = [
    SKILL_FEATURE_FLAGS[skill],
    SKILL_TREE_FEATURE_FLAGS[BUMPKIN_REVAMP_SKILL_TREE[skill].tree],
  ];
  return features.every(
    (feature) =>
      !feature ||
      hasTimeBasedFeatureAccess({ featureName: feature, game, now }),
  );
}

/** A tree's skills, without the ones whose feature flag is off. */
export function getAvailableRevampSkills(
  tree: BumpkinRevampSkillTree,
  game: GameState,
  now: number,
) {
  return getRevampSkills(tree).filter((skill) =>
    hasSkillAccess(game, skill.name as BumpkinRevampSkillName, now),
  );
}
