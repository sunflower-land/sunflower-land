import Decimal from "decimal.js-light";
import { INITIAL_STOCK } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import cloneDeep from "lodash.clonedeep";

export type RestockAction = {
  type: "shops.restocked";
};

type Options = {
  state: Readonly<GameState>;
  action: RestockAction;
};

const clone = (state: GameState): GameState => {
  return cloneDeep(state);
};

export function restock({ state }: Options): GameState {
  const game = clone(state);

  const blockBucks = game.inventory["Block Buck"] ?? new Decimal(0);
  if (blockBucks.lt(1)) {
    throw new Error("You do not have enough Block Bucks");
  }

  game.stock = INITIAL_STOCK(state);
  game.inventory["Block Buck"] = blockBucks.sub(1);

  // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#spend_virtual_currency
  onboardingAnalytics.logEvent("spend_virtual_currency", {
    value: 1,
    virtual_currency_name: "Block Buck",
    item_name: "Restock",
  });

  return game;
}
