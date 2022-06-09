import Decimal from "decimal.js-light";
import { GameState } from "../types/game";

export type TradeAction = {
  type: "item.traded";
};

type Options = {
  state: GameState;
  action: TradeAction;
  createdAt?: number;
};

export function trade({
  state,
}: //   action,
//   createdAt = Date.now(),
Options): GameState {
  const tradeOffer = state.tradeOffer;
  if (!tradeOffer) {
    throw new Error("Nothing to trade");
  }

  // Check if they have traded the current offer
  if (state.tradedAt) {
    // Check if the last time they traded, was for the current offer
    const hasTradedCurrentOffer =
      new Date(state.tradedAt).getTime() >
        new Date(tradeOffer.startAt).getTime() &&
      new Date(state.tradedAt).getTime() < new Date(tradeOffer.endAt).getTime();

    if (hasTradedCurrentOffer) {
      throw new Error("Already traded");
    }
  }

  const subtractedInventory = tradeOffer.ingredients.reduce(
    (inventory, ingredient) => {
      const count = state.inventory[ingredient.name] || new Decimal(0);

      if (count.lessThan(ingredient.amount)) {
        throw new Error(`Insufficient ingredient: ${ingredient.name}`);
      }

      return {
        ...inventory,
        [ingredient.name]: count.sub(ingredient.amount),
      };
    },
    state.inventory
  );

  const oldAmount = state.inventory[tradeOffer.name] || new Decimal(0);

  return {
    ...state,
    inventory: {
      ...subtractedInventory,
      [tradeOffer.name]: oldAmount.add(1),
    },
    tradedAt: new Date().toISOString(),
  };
}
