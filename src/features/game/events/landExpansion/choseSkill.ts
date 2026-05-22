import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { getBumpkinLevel } from "features/game/lib/level";
import {
  type BumpkinRevampSkillName,
  BUMPKIN_REVAMP_SKILL_TREE,
  type BumpkinRevampSkillTree,
  type BumpkinSkillTier,
} from "features/game/types/bumpkinSkills";
import type { Bumpkin, GameState, Skills } from "features/game/types/game";
import { populateSaltFarm } from "features/game/types/salt";
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

export const getAvailableBumpkinSkillPointsForSkills = (
  bumpkin: Bumpkin,
  skills: Skills,
) =>
  getAvailableBumpkinSkillPoints({
    ...bumpkin,
    skills,
  });

export const getSkillPointsForSkills = (skills: Skills): number =>
  Object.keys(skills).reduce((total, skillName) => {
    if (!skills[skillName as keyof Skills]) return total;
    const data = BUMPKIN_REVAMP_SKILL_TREE[skillName as BumpkinRevampSkillName];
    return data ? total + data.requirements.points : total;
  }, 0);

export const getPointsRemoved = (
  currentSkills: Skills,
  newSkills: Skills,
): number =>
  Object.keys(currentSkills).reduce((total, skillName) => {
    if (!currentSkills[skillName as keyof Skills]) return total;
    if (newSkills[skillName as keyof Skills]) return total;
    const data = BUMPKIN_REVAMP_SKILL_TREE[skillName as BumpkinRevampSkillName];
    return data ? total + data.requirements.points : total;
  }, 0);

export const SKILL_POINTS_PER_TIER: Record<
  BumpkinRevampSkillTree,
  Record<BumpkinSkillTier, number>
> = {
  Crops: {
    1: 0,
    2: 3,
    3: 7,
  },
  Trees: {
    1: 0,
    2: 2,
    3: 5,
  },
  Fishing: {
    1: 0,
    2: 2,
    3: 5,
  },
  Mining: {
    1: 0,
    2: 3,
    3: 7,
  },
  Cooking: {
    1: 0,
    2: 2,
    3: 5,
  },
  Compost: {
    1: 0,
    2: 3,
    3: 7,
  },
  "Fruit Patch": {
    1: 0,
    2: 2,
    3: 5,
  },
  Animals: {
    1: 0,
    2: 4,
    3: 8,
  },
  "Bees & Flowers": {
    1: 0,
    2: 2,
    3: 5,
  },
  Greenhouse: {
    1: 0,
    2: 2,
    3: 5,
  },
  Machinery: {
    1: 0,
    2: 2,
    3: 5,
  },
  Aging: {
    1: 0,
    2: 3,
    3: 7,
  },
};

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

export const validateSkillSelection = ({
  state,
  skills,
}: {
  state: GameState;
  skills: Skills;
}) => {
  const { bumpkin, island } = state;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin!");
  }

  if (getAvailableBumpkinSkillPointsForSkills(bumpkin, skills) < 0) {
    throw new Error("You do not have enough skill points");
  }

  const selectedSkills = Object.keys(skills).filter(
    (skillName): skillName is BumpkinRevampSkillName =>
      !!skills[skillName as keyof Skills] &&
      !!BUMPKIN_REVAMP_SKILL_TREE[skillName as BumpkinRevampSkillName],
  );

  selectedSkills.forEach((skillName) => {
    const { requirements, disabled } = BUMPKIN_REVAMP_SKILL_TREE[skillName];

    if (!hasRequiredIslandExpansion(island.type, requirements.island)) {
      throw new Error("You are not at the correct island!");
    }

    if (disabled) {
      throw new Error("This skill is disabled");
    }
  });

  Object.keys(SKILL_POINTS_PER_TIER).forEach((tree) => {
    const skillTree = tree as BumpkinRevampSkillTree;
    const acceptedSkills: Skills = {};

    ([1, 2, 3] as BumpkinSkillTier[]).forEach((tier) => {
      const tierSkills = selectedSkills.filter((skillName) => {
        const skill = BUMPKIN_REVAMP_SKILL_TREE[skillName];

        return skill.tree === skillTree && skill.requirements.tier === tier;
      });

      if (tierSkills.length === 0) return;

      const { availableTier } = getUnlockedTierForTree(skillTree, {
        ...bumpkin,
        skills: acceptedSkills,
      });

      if (tier > availableTier) {
        throw new Error(`You need to unlock tier ${tier} first`);
      }

      tierSkills.forEach((skillName) => {
        acceptedSkills[skillName as keyof Skills] = 1;
      });
    });
  });
};

export const sanitizeSkillSelection = (skills: Skills): Skills =>
  Object.entries(skills).reduce<Skills>(
    (selectedSkills, [skillName, value]) => {
      if (
        !!value &&
        BUMPKIN_REVAMP_SKILL_TREE[skillName as BumpkinRevampSkillName]
      ) {
        selectedSkills[skillName as keyof Skills] = 1;
      }

      return selectedSkills;
    },
    {},
  );

export function choseSkill({ state, action, createdAt = Date.now() }: Options) {
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
