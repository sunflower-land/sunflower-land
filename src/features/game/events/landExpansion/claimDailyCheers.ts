import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
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

const getDailyCheersAmount = (state: GameState) => {
  let amount = 3;

  if (isCollectibleBuilt({ name: "Giant Gold Bone", game: state })) {
    amount += 2;
  }

  return amount;
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

    if (cheers.freeCheersClaimedAt >= new Date(today).getTime()) {
      throw new Error("Already claimed your daily free cheers");
    }

    const amount = getDailyCheersAmount(draft);

    draft.inventory.Cheer = (draft.inventory.Cheer ?? new Decimal(0)).add(
      amount,
    );

    if (cheers.freeCheersClaimedAt < new Date(today).getTime()) {
      cheers.freeCheersClaimedAt = createdAt;
    }

    return draft;
  });
}
