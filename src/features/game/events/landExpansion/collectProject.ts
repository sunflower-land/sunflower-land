import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import {
  getProjectReward,
  hasProjectRaffle,
  REQUIRED_CHEERS,
  REWARD_ITEMS,
  type SoloProjectName,
} from "features/game/types/monuments";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type CollectProjectAction = {
  type: "project.collected";
  project: SoloProjectName;
};

type Options = {
  state: Readonly<GameState>;
  action: CollectProjectAction;
  createdAt?: number;
};

/**
 * Completes a village project and banks its reward.
 *
 * This is the local half of project completion: it only ever touches the
 * owner's own game state, so the player gets their reward straight away and it
 * syncs on the next autosave. Projects that also pay out a raffle winner write
 * to someone else's farm and are handled by the `project.completed` effect.
 */
export function collectProject({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    // The type says this cannot happen, but the action arrives as JSON from
    // the client, so the reducer is the one that has to enforce it.
    if (hasProjectRaffle(action.project)) {
      throw new Error("Project must be completed on the server");
    }

    const project = game.socialFarming.villageProjects?.[action.project];

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.cheers < REQUIRED_CHEERS[action.project]) {
      throw new Error("Project is not complete");
    }

    const rewardItem = REWARD_ITEMS[action.project];

    const { amount, boostsUsed } = getProjectReward({
      game,
      project: action.project,
      amount: rewardItem.amount,
    });

    game.inventory[rewardItem.item] = (
      game.inventory[rewardItem.item] ?? new Decimal(0)
    ).add(amount);

    game.farmActivity = trackFarmActivity(
      `${action.project} Completed`,
      game.farmActivity,
    );

    // Delete the village project (marks inactive - item stays on land)
    game.socialFarming.villageProjects[action.project] = undefined;

    // Add to completedProjects so re-placing does not auto-restart
    const completedProjects = game.socialFarming.completedProjects ?? [];
    if (!completedProjects.includes(action.project)) {
      game.socialFarming.completedProjects = [
        ...completedProjects,
        action.project,
      ];
    }

    game.boostsUsedAt = updateBoostUsed({
      game,
      boostNames: boostsUsed,
      createdAt,
    });
  });
}
