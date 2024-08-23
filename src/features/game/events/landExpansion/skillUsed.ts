import { GameState } from "../../types/game";
import cloneDeep from "lodash.clonedeep";

import {
  BUMPKIN_REVAMP_SKILL_TREE,
  BumpkinRevampSkillName,
} from "features/game/types/bumpkinSkills";

export type SkillUseAction = {
  type: "skill.used";
  skill: BumpkinRevampSkillName;
};

type Options = {
  state: Readonly<GameState>;
  action: SkillUseAction;
  createdAt?: number;
};

export function skillUse({ state, action, createdAt }: Options) {
  const game = cloneDeep(state);
  const dateNow = createdAt ?? Date.now();
  const { bumpkin } = game;

  if (bumpkin == undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  if (bumpkin.skills[action.skill] == undefined) {
    throw new Error("You do not have this skill");
  }

  if (!BUMPKIN_REVAMP_SKILL_TREE[action.skill].power) {
    throw new Error("This skill does not have a power");
  }

  if (bumpkin.previousPowerUseAt[action.skill]) {
    const { cooldown } = BUMPKIN_REVAMP_SKILL_TREE[action.skill].requirements;
    if (cooldown == undefined) {
      throw new Error("This skill can only be used once");
    }

    const lastUse = bumpkin.previousPowerUseAt[action.skill] ?? 0;
    if (lastUse + cooldown > dateNow) {
      throw new Error("This skill is still under cooldown");
    }
  }

  // Skill is off cooldown, use it

  // TODO: Implement powers

  // Return the new state
  bumpkin.previousPowerUseAt[action.skill] = createdAt;
  return game;
}
