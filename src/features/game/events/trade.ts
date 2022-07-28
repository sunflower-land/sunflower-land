import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { GameState } from "../types/game";

export type TradeAction = {
  type: "item.traded";
};

type Options = {
  state: Readonly<GameState>;
  action: TradeAction;
  createdAt?: number;
};

export function hasAlreadyTraded(state: GameState) {
  // No offer available
  if (!state.tradeOffer) {
    return false;
  }
  // Never traded before
  if (!state.tradedAt) {
    return false;
  }

  // They have already traded during the current trade offer period
  return (
    new Date(state.tradedAt).getTime() >
      new Date(state.tradeOffer.startAt).getTime() &&
    new Date(state.tradedAt).getTime() <
      new Date(state.tradeOffer.endAt).getTime()
  );
}

export function trade({ state }: Options): GameState {
  const stateCopy = cloneDeep(state);
  const tradeOffer = stateCopy.tradeOffer;

  if (!tradeOffer) {
    throw new Error("Nothing to trade");
  }

  // Check if they have traded the current offer
  if (hasAlreadyTraded(stateCopy)) {
    throw new Error("Already traded");
  }

  const subtractedInventory = tradeOffer.ingredients.reduce(
    (inventory, ingredient) => {
      const count = stateCopy.inventory[ingredient.name] || new Decimal(0);

      if (count.lessThan(ingredient.amount)) {
        throw new Error(`Insufficient ingredient: ${ingredient.name}`);
      }

      return {
        ...inventory,
        [ingredient.name]: count.sub(ingredient.amount),
      };
    },
    stateCopy.inventory
  );

  const oldAmount = stateCopy.inventory[tradeOffer.name] || new Decimal(0);

  return {
    ...stateCopy,
    inventory: {
      ...subtractedInventory,
      [tradeOffer.name]: oldAmount.add(tradeOffer.amount),
    },
    tradedAt: new Date().toISOString(),
  };
}
