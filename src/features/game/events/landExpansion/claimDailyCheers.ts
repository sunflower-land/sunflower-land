import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { BoostName, GameState } from "features/game/types/game";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { produce } from "immer";

export type ClaimCheersAction = {
  type: "cheers.claimed";
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimCheersAction;
  createdAt?: number;
};

export function getDailyCheersAmount(state: GameState) {
  let amount = 3;
  const boostsUsed: BoostName[] = [];

  if (isCollectibleBuilt({ name: "Giant Gold Bone", game: state })) {
    amount += 2;
    boostsUsed.push("Giant Gold Bone");
  }

  return { amount, boostsUsed };
}

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

    if (cheers.freeCheersClaimedAt >= new Date(today).getTime()) {
      throw new Error("Already claimed your daily free cheers");
    }

    const { amount, boostsUsed } = getDailyCheersAmount(draft);

    draft.inventory.Cheer = (draft.inventory.Cheer ?? new Decimal(0)).add(
      amount,
    );

    if (cheers.freeCheersClaimedAt < new Date(today).getTime()) {
      cheers.freeCheersClaimedAt = createdAt;
    }

    draft.boostsUsedAt = updateBoostUsed({
      game: draft,
      boostNames: boostsUsed,
      createdAt,
    });

    return draft;
  });
}
