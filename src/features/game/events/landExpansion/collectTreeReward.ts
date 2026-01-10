import Decimal from "decimal.js-light";

import { BoostName, GameState, Reward, Skills } from "../../types/game";
import { canChop } from "features/game/events/landExpansion/chop";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { KNOWN_IDS } from "features/game/types";
import { prngChance } from "lib/prng";
import { produce } from "immer";

export type CollectTreeRewardAction = {
  type: "treeReward.collected";
  treeIndex: number;
};

type Options = {
  state: GameState;
  action: CollectTreeRewardAction;
  createdAt?: number;
  farmId: number;
};

export function getReward({
  skills,
  farmId,
  itemId,
  counter,
}: {
  skills: Skills;
  farmId: number;
  itemId: number;
  counter: number;
}): { reward: Reward | undefined; boostsUsed: BoostName[] } {
  if (
    skills["Money Tree"] &&
    prngChance({
      farmId,
      itemId,
      counter,
      chance: 1,
      criticalHitName: "Money Tree",
    })
  ) {
    return { reward: { coins: 200 }, boostsUsed: ["Money Tree"] };
  }

  return { reward: undefined, boostsUsed: [] };
}

export function collectTreeReward({
  state,
  action,
  createdAt = Date.now(),
  farmId,
}: Options) {
  return produce(state, (stateCopy) => {
    const tree = stateCopy.trees?.[action.treeIndex];

    if (!tree) {
      throw new Error("Tree does not exist");
    }

    const { wood } = tree;

    if (!canChop(tree, createdAt)) {
      throw new Error("Tree is still growing");
    }

    if (!wood) {
      throw new Error("Tree has not been chopped");
    }

    // Use previous reward if it exists, otherwise calculate new reward
    const { reward, boostsUsed } = wood.reward
      ? { reward: wood.reward, boostsUsed: [] }
      : getReward({
          skills: stateCopy.bumpkin?.skills ?? {},
          farmId,
          itemId: KNOWN_IDS[tree.name ?? "Tree"],
          counter:
            stateCopy.farmActivity[`${tree.name ?? "Tree"} Chopped`] ?? 0,
        });

    // If no reward it should'nt be calling this function, but just in case
    if (!reward) {
      throw new Error("Tree does not have a reward");
    }
    const { items, coins } = reward;

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

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });

    return stateCopy;
  });
}
