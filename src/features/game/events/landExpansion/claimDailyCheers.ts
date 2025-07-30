import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type ClaimCheersAction = {
  type: "cheers.claimed";
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimCheersAction;
  createdAt?: number;
};

export function claimDailyCheers({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (draft) => {
    const {
      socialFarming: { cheers },
    } = draft;

    const today = new Date(createdAt).toISOString().split("T")[0];
    const yesterday = new Date(createdAt - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    if (cheers.freeCheersClaimedAt >= new Date(today).getTime()) {
      throw new Error("Already claimed your daily free cheers");
    }

    const dayFreeCheersClaimed = new Date(cheers.freeCheersClaimedAt)
      .toISOString()
      .split("T")[0];

    const cheersUsedYesterday =
      dayFreeCheersClaimed === yesterday ? cheers.cheersUsed : 0;

    const newCheerCount = 3 - cheersUsedYesterday;

    if (newCheerCount <= 0) {
      throw new Error("Not enough cheers to claim");
    }

    draft.inventory.Cheer = new Decimal(newCheerCount);

    if (cheers.freeCheersClaimedAt < new Date(today).getTime()) {
      cheers.freeCheersClaimedAt = createdAt;
      cheers.cheersUsed = 0;
    }

    return draft;
  });
}
