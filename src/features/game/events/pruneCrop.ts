import { Inventory } from "components/InventoryItems";
import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { FieldItem, GameState } from "../types/game";

export type PruneCropAction = {
  type: "item.pruned";
  fieldIndex: number;
};

type Options = {
  state: Readonly<GameState>;
  action: PruneCropAction;
  createdAt?: number;
};

export const TIME_TO_PRUNE_MS = 24 * 60 * 60 * 1000;

export const PRUNES_TO_REWARD = 3;

export function getPruneAt(field: FieldItem) {
  let tendedAt = field.plantedAt;

  if (field.prunedAt) {
    tendedAt = field.prunedAt[field.prunedAt.length - 1];
  }

  return tendedAt + TIME_TO_PRUNE_MS;
}

export function isDead({
  field,
  createdAt,
}: {
  field: FieldItem;
  createdAt: number;
}) {
  const pruneAt = getPruneAt(field);

  return createdAt - pruneAt > TIME_TO_PRUNE_MS;
}

export function readyToPrune({
  field,
  createdAt,
}: {
  field: FieldItem;
  createdAt: number;
}) {
  const pruneAt = getPruneAt(field);

  return createdAt > pruneAt;
}

export function pruneCrop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state);
  const field = game.fields[action.fieldIndex];

  if (!field) {
    throw new Error("Cannot prune an empty field");
  }

  if (field.name !== "Magic Seed") {
    throw new Error("Cannot prune a normal crop");
  }

  if (!readyToPrune({ field, createdAt })) {
    throw new Error("Crop is not ready to prune");
  }

  if (isDead({ field, createdAt })) {
    throw new Error("Crop is dead");
  }

  const prunedAt = field.prunedAt || [];

  // Time to harvest!
  if (prunedAt.length === PRUNES_TO_REWARD - 1) {
    // Collect the rewards
    const items = field.reward?.items || [];
    const inventory = items.reduce((acc, item) => {
      const previous = game.inventory[item.name] || new Decimal(0);

      return {
        ...acc,
        [item.name]: previous.add(item.amount),
      };
    }, game.inventory);

    delete game.fields[action.fieldIndex];

    return {
      ...game,
      balance: game.balance.add(field.reward?.sfl || 0),
      inventory,
    };
  }

  // Prune it
  return {
    ...game,
    fields: {
      ...game.fields,
      [action.fieldIndex]: {
        ...field,
        prunedAt: [...prunedAt, createdAt],
      },
    },
  };
}
