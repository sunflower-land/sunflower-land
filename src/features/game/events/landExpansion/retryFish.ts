import { produce } from "immer";
import { GameState } from "../../types/game";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type RetryFishAction = {
  type: "fish.retried";
};

type Options = {
  state: Readonly<GameState>;
  action: RetryFishAction;
  createdAt?: number;
};

export const FISH_RETRY_COST = 1000;

export function retryFish({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!game.fishing.wharf.castedAt) {
      throw new Error("Nothing has been casted");
    }

    const hasFreeAttempt =
      isCollectibleBuilt({ name: "Anemone Flower", game }) &&
      !game.fishing.wharf.freePuzzleAttemptUsed;

    if (!hasFreeAttempt) {
      if (game.coins < FISH_RETRY_COST) {
        throw new Error("Insufficient coins");
      }
      game.coins = game.coins - FISH_RETRY_COST;
    } else {
      game.fishing.wharf.freePuzzleAttemptUsed = true;
      game.boostsUsedAt = updateBoostUsed({
        game,
        boostNames: ["Anemone Flower"],
        createdAt,
      });
    }

    game.farmActivity = trackFarmActivity("Fish Retried", game.farmActivity);
  });
}
