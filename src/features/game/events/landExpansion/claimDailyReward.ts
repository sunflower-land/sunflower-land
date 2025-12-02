import { BonusName } from "features/game/types/bonuses";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type ClaimDailyRewardAction = {
  type: "dailyReward.claimed";
  name: BonusName;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimDailyRewardAction;
  createdAt?: number;
};

export function claimDailyReward({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    // Check if already claimed - throw error

    // Is daily reward ready? - throw error

    // Figure out their streak (if still on one)

    // Give them the reward

    return {
      ...game,
    };
  });
}
