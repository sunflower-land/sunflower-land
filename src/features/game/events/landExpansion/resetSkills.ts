import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type ResetSkillsAction = {
  type: "skills.reset";
};

type Options = {
  state: GameState;
  action: ResetSkillsAction;
  createdAt?: number;
};

export function resetSkills({ state, createdAt = Date.now() }: Options) {
  return produce(state, (game) => {
    const { bumpkin } = game;

    // Check if bumpkin exists
    if (bumpkin == undefined) {
      throw new Error("You do not have a Bumpkin!");
    }

    // Check if bumpkin has any skills
    if (Object.keys(bumpkin.skills).length === 0) {
      throw new Error("You do not have any skills to reset");
    }

    // Check if allowed to reset skills (once per 3 months)
    if (bumpkin.previousSkillsResetAt) {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      if (bumpkin.previousSkillsResetAt > threeMonthsAgo.getTime()) {
        throw new Error("You can only reset your skills once every 3 months");
      }
    }

    // Check of player has enough SFL to reset skills
    if (game.balance.toNumber() < 10) {
      throw new Error("You do not have enough SFL to reset your skills");
    }

    // All checks passed, reset skills
    bumpkin.skills = {};
    bumpkin.previousSkillsResetAt = createdAt;
    game.balance = game.balance.minus(10);

    return game;
  });
}
