import Decimal from "decimal.js-light";

import { GameState } from "../../types/game";
import { canChop, CHOP_ERRORS } from "features/game/events/landExpansion/chop";
import { produce } from "immer";

export type CollectTreeRewardAction = {
  type: "treeReward.collected";
  treeIndex: string;
};

type Options = {
  state: GameState;
  action: CollectTreeRewardAction;
  createdAt?: number;
};

export function collectTreeReward({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const tree = stateCopy.trees[action.treeIndex];

    if (!tree) {
      throw new Error("Tree does not exist");
    }

    const { wood } = tree;

    if (!wood) {
      throw new Error("Tree has not been chopped");
    }

    if (!wood.reward) {
      throw new Error("Tree does not have a reward");
    }

    if (!canChop(tree, createdAt)) {
      throw new Error(CHOP_ERRORS.STILL_GROWING);
    }

    const {
      reward: { items, coins },
    } = wood;

    if (items?.length) {
      items.forEach(({ name, amount }) => {
        const itemBalance = stateCopy.inventory[name] || new Decimal(0);

        stateCopy.inventory[name] = itemBalance.add(new Decimal(amount));
      });
    }

    if (coins) {
      stateCopy.coins = stateCopy.coins + coins * (tree.multiplier ?? 1);
    }

    delete wood.reward;

    return stateCopy;
  });
}
