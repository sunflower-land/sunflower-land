import { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import cloneDeep from "lodash.clonedeep";

import {
  BUMPKIN_SKILL_TREE,
  BUMPKIN_REVAMP_SKILL_TREE,
  BumpkinRevampSkillName,
  BumpkinSkillName,
} from "features/game/types/bumpkinSkills";

export type WipeSkillsAction = {
  type: "skills.wipe";
};

type Options = {
  state: GameState;
  action: WipeSkillsAction;
  createdAt?: number;
};

export function wipeSkills({ state, action, createdAt = Date.now() }: Options) {
  const stateCopy = cloneDeep(state);
  const { bumpkin } = stateCopy;

  if (!hasFeatureAccess(stateCopy, "SKILLS_REVAMP")) {
    throw new Error("You do not have access");
  }

  if (bumpkin == undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  if (Object.keys(bumpkin.skills).length === 0) {
    throw new Error("You do not have any skills to wipe");
  }

  const oldSkills = Object.keys(bumpkin.skills).filter(
    (skill) => BUMPKIN_SKILL_TREE[skill as BumpkinSkillName],
  );

  const newSkills = Object.keys(bumpkin.skills).filter(
    (skill) => BUMPKIN_REVAMP_SKILL_TREE[skill as BumpkinRevampSkillName],
  );

  // Throw error if Bumpkin does not have any old skills
  if (oldSkills.length === 0) {
    throw new Error("You can only wipe your old skills");
  }

  // Throw error if Bumpkin has new skills
  if (newSkills.length > 0) {
    throw new Error("You can only wipe your old skills");
  }

  // Throw error if Bumpkin has previousSkillsResetAt
  if (bumpkin.previousSkillsResetAt) {
    throw new Error("You can only wipe your old skills");
  }

  // Wipe skills from Bumpkin
  bumpkin.skills = {};
  return stateCopy;
}
