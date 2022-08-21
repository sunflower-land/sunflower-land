import { Inventory } from "components/InventoryItems";
import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { GameState } from "../types/game";

export type PruneCropAction = {
  type: "item.pruned";
  fieldIndex: number;
};

type Options = {
  state: Readonly<GameState>;
  action: PruneCropAction;
  createdAt?: number;
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const PRUNES_TO_REWARD = 3;

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

  let tendedAt = field.plantedAt;

  if (field.prunedAt) {
    tendedAt = field.prunedAt[field.prunedAt.length - 1];
  }

  const pruneAt = tendedAt + ONE_DAY_MS;

  if (createdAt < pruneAt) {
    throw new Error("Crop is not ready to prune");
  }

  console.log({ createdAt, pruneAt });
  console.log({
    amount: (createdAt - pruneAt) / ONE_DAY_MS,
    oneDay: ONE_DAY_MS,
  });
  if (createdAt - pruneAt > ONE_DAY_MS) {
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
