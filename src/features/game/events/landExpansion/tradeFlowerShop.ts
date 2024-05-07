import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { FlowerName } from "features/game/types/flowers";
import { getSeasonalTicket } from "features/game/types/seasons";

export type FlowerShopTradedAction = {
  type: "flowerShop.traded";
  flower: FlowerName;
};

type Options = {
  state: Readonly<GameState>;
  action: FlowerShopTradedAction;
  createdAt?: number;
};

export const TICKETS_REWARDED = 50;

export function tradeFlowerShop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game: GameState = cloneDeep(state);

  const flowerShop = game.flowerShop;
  if (!flowerShop) {
    throw new Error("Flower shop is not open");
  }

  if (
    createdAt < flowerShop.week ||
    createdAt > flowerShop.week + 7 * 24 * 60 * 60 * 1000
  ) {
    throw new Error("Flower shop has not been updated");
  }

  const weeklyFlower = flowerShop.weeklyFlower;
  if (action.flower !== weeklyFlower) {
    throw new Error("Flower is not the current weeks flower");
  }

  if (flowerShop.tradedFlowerShop) {
    throw new Error("Already claimed reward");
  }

  flowerShop.tradedFlowerShop = true;
  game.flowerShop = flowerShop;

  const flowerCount = game.inventory[weeklyFlower] ?? new Decimal(0);
  if (flowerCount.lessThan(1)) {
    throw new Error("Not enough flowers");
  }
  game.inventory[weeklyFlower] = flowerCount.minus(1);

  const seasonTicket = getSeasonalTicket(new Date(createdAt));
  const ticketCount = game.inventory[seasonTicket] ?? new Decimal(0);
  game.inventory[seasonTicket] = ticketCount.plus(TICKETS_REWARDED);

  return game;
}
