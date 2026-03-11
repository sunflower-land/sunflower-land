import { BONUSES, BonusName } from "features/game/types/bonuses";
import { getKeys } from "lib/object";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { GameState, VIP } from "features/game/types/game";
import { produce } from "immer";

export type StartTrialAction = {
  type: "trial.started";
};

type Options = {
  state: Readonly<GameState>;
  action: StartTrialAction;
  createdAt?: number;
};

export function canClaimTrial({ vip }: { vip?: VIP }): boolean {
  return !vip?.trialStartedAt && !vip?.expiresAt;
}

export function startTrial({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (game.vip?.trialStartedAt || game.vip?.expiresAt) {
      throw new Error("VIP already started");
    }

    game.vip = {
      trialStartedAt: createdAt,
      // Default VIP fields
      expiresAt: 0,
      bundles: [],
    };

    return game;
  });
}
