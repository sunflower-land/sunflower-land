import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type TradeAction = {
  type: "item.traded";
};

type Options = {
  state: GameState;
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

export function trade({ state, action, createdAt }: Options): GameState {
  const game = cloneDeep(state);

  const tradeOffer = game.tradeOffer;
  if (!tradeOffer) {
    throw new Error("Nothing to trade");
  }

  // Check if they have traded the current offer
  if (game.tradedAt) {
    // Check if the last time they traded, was for the current offer
    const hasTradedCurrentOffer =
      new Date(game.tradedAt).getTime() >
        new Date(tradeOffer.startAt).getTime() &&
      new Date(game.tradedAt).getTime() < new Date(tradeOffer.endAt).getTime();

    if (hasTradedCurrentOffer) {
      throw new Error("Already traded");
    }
  }

  // Subtract ingredients
  getKeys(tradeOffer.ingredients).forEach((name) => {
    const count = game.inventory[name] || new Decimal(0);

    if (count.lessThan(tradeOffer.ingredients[name] ?? 0)) {
      throw new Error(`Insufficient ingredient: ${name}`);
    }

    game.inventory[name] = count.sub(tradeOffer.ingredients[name] ?? 0);
  });

  // Add SFL rewards
  game.balance = game.balance.add(tradeOffer.reward.sfl);
  // Add inventory rewards
  getKeys(tradeOffer.reward.items).forEach((name) => {
    const count = game.inventory[name] || new Decimal(0);

    game.inventory[name] = count.add(tradeOffer.reward.items[name] ?? 0);
  });

  return {
    ...game,
    tradedAt: new Date().toISOString(),
  };
}
