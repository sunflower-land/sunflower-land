import { getBumpkinLevel, OLD_SKILL_POINTS } from "features/game/lib/level";
import {
  BumpkinSkillName,
  BUMPKIN_SKILL_TREE,
} from "features/game/types/bumpkinSkills";
import { getKeys } from "features/game/types/craftables";
import { Bumpkin, GameState } from "features/game/types/game";
import { produce } from "immer";

export type PickSkillAction = {
  type: "skill.picked";
  skill: BumpkinSkillName;
};

type Options = {
  state: GameState;
  action: PickSkillAction;
  createdAt?: number;
};

export const getAvailableBumpkinSkillPoints = (bumpkin?: Bumpkin) => {
  if (!bumpkin) return 0;

  const bumpkinLevel = getBumpkinLevel(bumpkin.experience);
  const totalSkillPoints = OLD_SKILL_POINTS[bumpkinLevel];

  const allocatedSkillPoints = getKeys({ ...bumpkin.skills } as Partial<
    Record<BumpkinSkillName, number>
  >).reduce((acc, skill) => {
    if (BUMPKIN_SKILL_TREE[skill]) {
      return acc + BUMPKIN_SKILL_TREE[skill].requirements.points;
    }
    return acc;
  }, 0);

  return totalSkillPoints - allocatedSkillPoints;
};

export function pickSkill({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (stateCopy) => {
    const { bumpkin } = stateCopy;
    if (bumpkin == undefined) {
      throw new Error("You do not have a Bumpkin!");
    }

    const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);

    const requirements = BUMPKIN_SKILL_TREE[action.skill].requirements;

    if (availableSkillPoints < requirements.points) {
      throw new Error("You do not have enough skill points");
    }

    if (requirements.skill && !bumpkin.skills[requirements.skill]) {
      throw new Error("Missing previous skill requirement");
    }
    const bumpkinHasSkill = bumpkin.skills[action.skill];

    if (bumpkinHasSkill) {
      throw new Error("You already have this skill");
    }

    bumpkin.skills = { ...bumpkin.skills, [action.skill]: 1 };

    return stateCopy;
  });
}
