import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type ResetSkillsAction = {
  type: "skills.reset";
};

type Options = {
  state: GameState;
  action: ResetSkillsAction;
  createdAt?: number;
};

export function resetSkills({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy = cloneDeep(state);
  const { bumpkin } = stateCopy;

  // Check if bumpkin exists
  if (bumpkin == undefined) {
    throw new Error("You do not have a Bumpkin!");
  }

  // Check if bumpkin has any skills
  if (Object.keys(bumpkin.skills).length === 0) {
    throw new Error("You do not have any skills to reset");
  }

  // Check if allowed to reset skills (once per 3 months)
  /* if (bumpkin.previousSkillsResetAt) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    if (bumpkin.previousSkillsResetAt > threeMonthsAgo.getTime()) {
      throw new Error("You can only reset your skills once every 3 months");
    }
  } */

  // Temp remove of fn above, for testing purposes we move to a 5min limit
  if (bumpkin.previousSkillsResetAt) {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    if (bumpkin.previousSkillsResetAt > fiveMinutesAgo.getTime()) {
      throw new Error("You can only reset your skills once every 5 minutes");
    }
  }

  // Check of player has enough SFL to reset skills
  if (stateCopy.balance.toNumber() < 10) {
    throw new Error("You do not have enough SFL to reset your skills");
  }

  // All checks passed, reset skills
  bumpkin.skills = {};
  bumpkin.previousSkillsResetAt = createdAt;
  stateCopy.balance = stateCopy.balance.minus(10);

  return stateCopy;
}
