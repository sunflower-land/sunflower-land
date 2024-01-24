import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { FlowerName } from "features/game/types/flowers";
import { GameState } from "features/game/types/game";
import { SEASONS } from "features/game/types/seasons";
import { getSeasonWeekByCreatedAt } from "lib/utils/getSeasonWeek";

export type FlowerShopTradedAction = {
  type: "flowerShop.traded";
  flower: FlowerName;
};

type Options = {
  state: Readonly<GameState>;
  action: FlowerShopTradedAction;
  createdAt?: number;
};

export const TICKETS_REWARDED = 7;

export function tradeFlowerShop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game: GameState = cloneDeep(state);

  if (createdAt < SEASONS["Spring Blossom"].startDate.getTime()) {
    throw new Error("Spring Blossom season has not started");
  }

  if (createdAt > SEASONS["Spring Blossom"].endDate.getTime()) {
    throw new Error("Spring Blossom season has ended");
  }

  const week = getSeasonWeekByCreatedAt(createdAt);
  const flower = game.springBlossom[week].weeklyFlower;

  if (action.flower !== flower) {
    throw new Error("Flower is not the current weeks flower");
  }

  if (!game.springBlossom[week]) {
    throw new Error("Week does not exist");
  }

  if (game.springBlossom[week].tradedFlowerShop) {
    throw new Error("Already claimed reward");
  }

  game.springBlossom[week].tradedFlowerShop = true;

  const flowerCount = game.inventory[flower] ?? new Decimal(0);
  if (flowerCount.lessThan(1)) {
    throw new Error("Not enough flowers");
  }
  game.inventory[flower] = flowerCount.minus(1);

  const tulipCount = game.inventory["Tulip Bulb"] ?? new Decimal(0);
  game.inventory["Tulip Bulb"] = tulipCount.plus(TICKETS_REWARDED);

  return game;
}
