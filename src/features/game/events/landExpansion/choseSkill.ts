import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { getBumpkinLevel } from "features/game/lib/level";
import {
  BumpkinRevampSkillName,
  BUMPKIN_REVAMP_SKILL_TREE,
  BumpkinRevampSkillTree,
} from "features/game/types/bumpkinSkills";
import { Bumpkin, GameState } from "features/game/types/game";
import { produce } from "immer";

export type ChoseSkillAction = {
  type: "skill.chosen";
  skill: BumpkinRevampSkillName;
};

type Options = {
  state: GameState;
  action: ChoseSkillAction;
  createdAt?: number;
};

export const getAvailableBumpkinSkillPoints = (bumpkin?: Bumpkin) => {
  if (!bumpkin) return 0;

  const bumpkinLevel = getBumpkinLevel(bumpkin.experience);
  const skillsClaimed = Object.keys(bumpkin.skills) as BumpkinRevampSkillName[];

  const totalUsedSkillPoints = skillsClaimed.reduce((acc, skill) => {
    const skillData = BUMPKIN_REVAMP_SKILL_TREE[skill];
    if (skillData) {
      return acc + skillData.requirements.points;
    }

    return acc;
  }, 0);

  return bumpkinLevel - totalUsedSkillPoints;
};

export const getUnlockedTierForTree = (
  tree: BumpkinRevampSkillTree,
  bumpkin: Bumpkin,
): { availableTier: number; pointsToNextTier: number } => {
  let availableTier = 1;

  // Calculate the total points used in the tree
  const totalUsedSkillPoints = Object.keys(bumpkin.skills).reduce(
    (acc, skill) => {
      const skillData =
        BUMPKIN_REVAMP_SKILL_TREE[skill as BumpkinRevampSkillName];

      if (skillData && skillData.tree === tree) {
        return acc + skillData.requirements.points;
      }

      return acc;
    },
    0,
  );

  // Determine the tier and points needed for next tier
  let pointsToNextTier = 2; // Points needed for tier 2
  if (totalUsedSkillPoints >= 5) {
    availableTier = 3;
    pointsToNextTier = 0; // Already at max tier
  } else if (totalUsedSkillPoints >= 2) {
    availableTier = 2;
    pointsToNextTier = 5 - totalUsedSkillPoints; // Points needed for tier 3
  } else {
    pointsToNextTier = 2 - totalUsedSkillPoints; // Points needed for tier 2
  }

  return { availableTier, pointsToNextTier };
};

export function choseSkill({ state, action }: Options) {
  return produce(state, (stateCopy) => {
    const { bumpkin, island } = stateCopy;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const { requirements, tree, disabled } =
      BUMPKIN_REVAMP_SKILL_TREE[action.skill];
    const bumpkinHasSkill = bumpkin.skills[action.skill];

    const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);
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

    if (bumpkinHasSkill) {
      throw new Error("You already have this skill");
    }

    // Add the selected skill to the bumpkin's skills
    bumpkin.skills = {
      ...bumpkin.skills,
      [action.skill]: 1,
    };

    return stateCopy;
  });
}
