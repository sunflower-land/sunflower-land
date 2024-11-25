import { getBumpkinLevel } from "features/game/lib/level";
import {
  BumpkinRevampSkillName,
  BUMPKIN_REVAMP_SKILL_TREE,
  BumpkinRevampSkillTree,
} from "features/game/types/bumpkinSkills";
import { Bumpkin, GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

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

  return bumpkinLevel - totalUsedSkillPoints - 1; // Skill points starts at Bumpkin level 1
};

export const getUnlockedTierForTree = (
  tree: BumpkinRevampSkillTree,
  bumpkin?: Bumpkin,
): number => {
  if (!bumpkin) return 1;

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

  // Determine the tier based on the total points used
  if (totalUsedSkillPoints >= 5) return 3;
  if (totalUsedSkillPoints >= 2) return 2;
  return 1;
};

export function choseSkill({ state, action, createdAt = Date.now() }: Options) {
  const stateCopy = cloneDeep(state);
  const { bumpkin } = stateCopy;

  if (bumpkin == undefined) {
    throw new Error("You do not have a Bumpkin!");
  }

  const requirements = BUMPKIN_REVAMP_SKILL_TREE[action.skill].requirements;
  const tree = BUMPKIN_REVAMP_SKILL_TREE[action.skill].tree;
  const bumpkinHasSkill = bumpkin.skills[action.skill];

  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);
  const availableTier = getUnlockedTierForTree(tree, bumpkin);

  if (availableSkillPoints < requirements.points) {
    throw new Error("You do not have enough skill points");
  }

  if (requirements.tier > availableTier) {
    throw new Error(`You need to unlock tier ${requirements.tier} first`);
  }

  if (bumpkinHasSkill) {
    throw new Error("You already have this skill");
  }

  // Add the selected skill to the bumpkin's skills
  bumpkin.skills = { ...bumpkin.skills, [action.skill]: 1 };

  return stateCopy;
}
