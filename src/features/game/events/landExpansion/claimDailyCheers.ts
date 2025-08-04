import Decimal from "decimal.js-light";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { GameState } from "features/game/types/game";
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
    const yesterday = new Date(createdAt - 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    if (cheers.freeCheersClaimedAt >= new Date(today).getTime()) {
      throw new Error("Already claimed your daily free cheers");
    }

    const dayFreeCheersClaimed = new Date(cheers.freeCheersClaimedAt)
      .toISOString()
      .split("T")[0];

    const isBetterTogetherStartDate =
      new Date(today).getTime() === new Date("2025-08-04").getTime();

    let amount = 3;

    if (hasVipAccess({ game: draft })) {
      amount = 6;
    }

    // If today is the start date, give 3 regardless of previous day's value
    const cheersUsedYesterday = isBetterTogetherStartDate
      ? amount
      : // Otherwise, give the amount of cheers used yesterday, or 3 if cheers wasn't claimed yesterday
        Math.min(
          dayFreeCheersClaimed === yesterday ? cheers.cheersUsed : amount,
          amount,
        );

    if (cheersUsedYesterday < 0) {
      throw new Error("Not enough cheers to claim");
    }

    draft.inventory.Cheer = new Decimal(cheersUsedYesterday);

    if (cheers.freeCheersClaimedAt < new Date(today).getTime()) {
      cheers.freeCheersClaimedAt = createdAt;
      cheers.cheersUsed = 0;
    }

    return draft;
  });
}
