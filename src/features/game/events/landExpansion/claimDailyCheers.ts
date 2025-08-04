import Decimal from "decimal.js-light";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { GameState } from "features/game/types/game";
import { getCurrentSeason } from "features/game/types/seasons";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";

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
    if (!hasFeatureAccess(draft, "CHEERS")) {
      throw new Error("Cheers feature is not enabled");
    }

    const {
      socialFarming: { cheers },
    } = draft;

    const today = new Date(createdAt).toISOString().split("T")[0];

    if (cheers.freeCheersClaimedAt >= new Date(today).getTime()) {
      throw new Error("Already claimed your daily free cheers");
    }

    let amount = 3;

    if (
      hasVipAccess({ game: draft }) &&
      getCurrentSeason(new Date(createdAt)) === "Better Together"
    ) {
      amount = 6;
    }

    draft.inventory.Cheer = (draft.inventory.Cheer ?? new Decimal(0)).add(
      amount,
    );

    if (cheers.freeCheersClaimedAt < new Date(today).getTime()) {
      cheers.freeCheersClaimedAt = createdAt;
      cheers.cheersUsed = 0;
    }

    return draft;
  });
}
