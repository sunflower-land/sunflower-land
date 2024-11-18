import Decimal from "decimal.js-light";
import { INITIAL_STOCK } from "features/game/lib/constants";
import { BB_TO_GEM_RATIO, GameState } from "features/game/types/game";
import { produce } from "immer";
import { onboardingAnalytics } from "lib/onboardingAnalytics";

export type RestockAction = {
  type: "shops.restocked";
};

type Options = {
  state: Readonly<GameState>;
  action: RestockAction;
};

export function restock({ state }: Options): GameState {
  return produce(state, (game) => {
    const gems = game.inventory["Gem"] ?? new Decimal(0);
    if (gems.lt(1 * BB_TO_GEM_RATIO)) {
      throw new Error("You do not have enough Gems");
    }

    game.stock = INITIAL_STOCK(state);
    game.inventory["Gem"] = gems.sub(1 * BB_TO_GEM_RATIO);

    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#spend_virtual_currency
    onboardingAnalytics.logEvent("spend_virtual_currency", {
      value: 1 * BB_TO_GEM_RATIO,
      virtual_currency_name: "Gem",
      item_name: "Restock",
    });

    return game;
  });
}
