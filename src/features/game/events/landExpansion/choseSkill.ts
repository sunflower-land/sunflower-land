import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { getTotalBumpkinLevel } from "features/game/lib/level";
import {
  type BumpkinRevampSkillName,
  BUMPKIN_REVAMP_SKILL_TREE,
  type BumpkinRevampSkillTree,
  type BumpkinSkillTier,
  type BumpkinSkillRevamp,
  getSkillUpgradeCost,
} from "features/game/types/bumpkinSkills";
import type { Bumpkin, GameState } from "features/game/types/game";
import { populateSaltFarm } from "features/game/types/salt";
import { produce } from "immer";
import { hasSkillAccess } from "features/game/lib/skillAccess";

export type ChoseSkillAction = {
  type: "skill.chosen";
  skill: BumpkinRevampSkillName;
};

type Options = {
  state: GameState;
  action: ChoseSkillAction;
  createdAt?: number;
};

export const getAvailableBumpkinSkillPoints = (game: GameState | undefined) => {
  const bumpkin = game?.bumpkin;
  if (!bumpkin) return 0;

  // 1 skill point per level earned, including ascension band levels.
  const earnedSkillPoints = getTotalBumpkinLevel({
    experience: bumpkin.experience,
    ascensionLevel: game.island.ascensionLevel ?? 0,
  });
  const skillsClaimed = Object.keys(bumpkin.skills) as BumpkinRevampSkillName[];

  const totalUsedSkillPoints = skillsClaimed.reduce((acc, skill) => {
    const skillData: BumpkinSkillRevamp = BUMPKIN_REVAMP_SKILL_TREE[skill];
    if (!skillData) return acc;

    // Base cost paid once when the skill was chosen.
    let used = skillData.requirements.points;

    // Additional points spent on rank upgrades (rank stored as the skill value).
    const level = bumpkin.skills[skill] ?? 1;
    if (skillData.upgrade && level > 1) {
      used +=
        getSkillUpgradeCost(skillData.requirements.tier).points * (level - 1);
    }

    return acc + used;
  }, 0);

  return earnedSkillPoints - totalUsedSkillPoints;
};

// Points that must be spent on a tree's tier 1 and tier 2 skills to unlock each
// tier, derived from the tree's tier 1 skills so it follows the skill list:
// - Tier 2 needs half the tier 1 skills (rounded up).
// - Tier 3 needs one point more than every tier 1 skill combined, so at least
//   one tier 2 skill is required.
const getTierThresholds = (
  tree: BumpkinRevampSkillTree,
): Record<BumpkinSkillTier, number> => {
  const tierOneCosts = (
    Object.values(BUMPKIN_REVAMP_SKILL_TREE) as BumpkinSkillRevamp[]
  )
    .filter((skill) => skill.tree === tree && skill.requirements.tier === 1)
    .map((skill) => skill.requirements.points)
    .sort((a, b) => a - b);

  const sum = (costs: number[]) => costs.reduce((acc, cost) => acc + cost, 0);

  return {
    1: 0,
    2: sum(tierOneCosts.slice(0, Math.ceil(tierOneCosts.length / 2))),
    3: sum(tierOneCosts) + 1,
  };
};

export const SKILL_POINTS_PER_TIER = Object.fromEntries(
  [
    ...new Set(
      (Object.values(BUMPKIN_REVAMP_SKILL_TREE) as BumpkinSkillRevamp[]).map(
        (skill) => skill.tree,
      ),
    ),
  ].map((tree) => [tree, getTierThresholds(tree)]),
) as Record<BumpkinRevampSkillTree, Record<BumpkinSkillTier, number>>;

export const getUnlockedTierForTree = (
  tree: BumpkinRevampSkillTree,
  bumpkin: Bumpkin,
): { availableTier: BumpkinSkillTier; totalUsedSkillPoints: number } => {
  // Calculate the total points used in the tree
  const totalUsedSkillPoints = Object.keys(bumpkin.skills).reduce(
    (acc, skill) => {
      const skillData =
        BUMPKIN_REVAMP_SKILL_TREE[skill as BumpkinRevampSkillName];

      if (
        skillData &&
        skillData.tree === tree &&
        skillData.requirements.tier !== 3
      ) {
        return acc + skillData.requirements.points;
      }

      return acc;
    },
    0,
  );
  let availableTier: BumpkinSkillTier;
  // Determine the tier and points needed for next tier
  if (totalUsedSkillPoints >= SKILL_POINTS_PER_TIER[tree][3]) {
    availableTier = 3;
  } else if (totalUsedSkillPoints >= SKILL_POINTS_PER_TIER[tree][2]) {
    availableTier = 2;
  } else {
    availableTier = 1;
  }

  return { availableTier, totalUsedSkillPoints };
};

export function choseSkill({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { bumpkin, island } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const { requirements, tree, disabled } =
      BUMPKIN_REVAMP_SKILL_TREE[action.skill];
    const bumpkinHasSkill = bumpkin.skills[action.skill];

    const availableSkillPoints = getAvailableBumpkinSkillPoints(stateCopy);
    const { availableTier } = getUnlockedTierForTree(tree, bumpkin);

    if (!hasRequiredIslandExpansion(island.type, requirements.island)) {
      throw new Error("You are not at the correct island!");
    }

    if (availableSkillPoints < requirements.points) {
      throw new Error("You do not have enough skill points");
    }

    if (requirements.tier > availableTier) {
      throw new Error(`You need to unlock tier ${requirements.tier} first`);
    }

    if (disabled) {
      throw new Error("This skill is disabled");
    }

    if (!hasSkillAccess(stateCopy, action.skill)) {
      throw new Error("This skill is not available");
    }

    if (bumpkinHasSkill) {
      throw new Error("You already have this skill");
    }

    bumpkin.skills = {
      ...bumpkin.skills,
      [action.skill]: 1,
    };

    populateSaltFarm({
      gameBefore: state,
      gameAfter: stateCopy,
      now: createdAt,
    });

    return stateCopy;
  });
}
