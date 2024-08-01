import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import cloneDeep from "lodash.clonedeep";

export type BuyMoreDigsAction = {
  type: "desert.digsBought";
};

type Options = {
  state: Readonly<GameState>;
  action: BuyMoreDigsAction;
  createdAt?: number;
};

const EXTRA_DIGS_AMOUNT = 5;
export const GRID_DIG_SPOTS = 100;

export function buyMoreDigs({ state }: Options) {
  const game = cloneDeep(state);

  const blockBucks = game.inventory["Block Buck"] ?? new Decimal(0);

  if (blockBucks.lt(1)) {
    throw new Error("Player does not have enough block bucks to buy more digs");
  }

  const extraDigs = game.desert.digging.extraDigs ?? 0;

  game.inventory["Block Buck"] = blockBucks.sub(1);

  game.desert.digging.extraDigs = extraDigs + EXTRA_DIGS_AMOUNT;

  // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#spend_virtual_currency
  onboardingAnalytics.logEvent("spend_virtual_currency", {
    value: 1,
    virtual_currency_name: "Block Buck",
    item_name: "DesertDigsBought",
  });

  return game;
}
