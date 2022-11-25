import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";

import { CROPS } from "../../types/crops";
import { GameState } from "../../types/game";
import { canChop, CHOP_ERRORS } from "features/game/events/landExpansion/chop";

export type CollectRewardAction = {
  type: "reward.collected";
  expansionIndex: number;
  index: number;
};

type Options = {
  state: GameState;
  action: CollectRewardAction;
  rewardType: string;
  createdAt?: number;
};

export function collectReward({
  state,
  action,
  rewardType,
  createdAt = Date.now(),
}: Options) {
  if (rewardType === "Crop") {
    openCropReward({ state, action, rewardType, createdAt });
  }
  if (rewardType === "Tree") {
    openTreeReward({ state, action, rewardType, createdAt });
  }
}

export function openCropReward({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy = cloneDeep(state);
  const plot =
    stateCopy.expansions[action.expansionIndex]?.plots?.[action.index];

  if (!plot) {
    throw new Error("Plot does not exist");
  }

  const { crop: plantedCrop } = plot;

  if (!plantedCrop) {
    throw new Error("Plot does not have a crop");
  }

  if (!plantedCrop.reward) {
    throw new Error("Crop does not have a reward");
  }

  const crop = CROPS()[plantedCrop.name];

  if (createdAt - plantedCrop.plantedAt < crop.harvestSeconds * 1000) {
    throw new Error("Not ready");
  }

  const {
    reward: { items, sfl },
  } = plantedCrop;

  if (items?.length) {
    items.forEach(({ name, amount }) => {
      const itemBalance = stateCopy.inventory[name] || new Decimal(0);

      stateCopy.inventory[name] = itemBalance.add(new Decimal(amount));
    });
  }

  if (sfl) {
    stateCopy.balance = stateCopy.balance.add(sfl);
  }

  delete plantedCrop.reward;

  return stateCopy;
}

export function openTreeReward({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy = cloneDeep(state);
  const tree =
    stateCopy.expansions[action.expansionIndex]?.trees?.[action.index];

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
    reward: { items, sfl },
  } = wood;

  if (items?.length) {
    items.forEach(({ name, amount }) => {
      const itemBalance = stateCopy.inventory[name] || new Decimal(0);

      stateCopy.inventory[name] = itemBalance.add(new Decimal(amount));
    });
  }

  if (sfl) {
    stateCopy.balance = stateCopy.balance.add(sfl);
  }

  delete wood.reward;

  return stateCopy;
}
