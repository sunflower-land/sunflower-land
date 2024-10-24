import { getBumpkinLevel } from "features/game/lib/level";
import {
  BumpkinRevampSkillName,
  BUMPKIN_REVAMP_SKILL_TREE,
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

  const bumpkinLevel = getBumpkinLevel(bumpkin.experience); // 1 level = 1 skill point
  const allocatedSkillPoints = Object.values(bumpkin.skills).reduce(
    (acc, level) => acc + level,
    0,
  );

  return bumpkinLevel - allocatedSkillPoints;
};

export function choseSkill({ state, action, createdAt = Date.now() }: Options) {
  const stateCopy = cloneDeep(state);
  const { bumpkin } = stateCopy;

  if (bumpkin == undefined) {
    throw new Error("You do not have a Bumpkin!");
  }

  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);
  const claimedSkillsInTree = Object.keys(bumpkin.skills).filter((skill) =>
    Object.keys(BUMPKIN_REVAMP_SKILL_TREE).includes(skill),
  ).length;
  const requirements = BUMPKIN_REVAMP_SKILL_TREE[action.skill].requirements;
  const bumpkinHasSkill = bumpkin.skills[action.skill];

  if (availableSkillPoints < requirements.points) {
    throw new Error("You do not have enough skill points");
  }

  if (requirements.skill && claimedSkillsInTree < requirements.skill) {
    throw new Error("Missing previous skill requirement");
  }

  if (bumpkinHasSkill) {
    throw new Error("You already have this skill");
  }

  // Add the selected skill to the bumpkin's skills
  bumpkin.skills = { ...bumpkin.skills, [action.skill]: 1 };

  return stateCopy;
}
