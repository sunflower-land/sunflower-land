import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { GameState, IslandType } from "features/game/types/game";

export type BuyFarmHandAction = {
  type: "farmHand.bought";
};

type Options = {
  state: Readonly<GameState>;
  action: BuyFarmHandAction;
  createdAt?: number;
};

export const ISLAND_BUMPKIN_CAPACITY: Record<IslandType, number> = {
  basic: 1,
  spring: 2,
};

export const FARM_HAND_COST = 15;

export function buyFarmhand({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const game = cloneDeep(state) as GameState;

  // TODO
  const island: IslandType = game.island?.type ?? "basic";
  const capacity = ISLAND_BUMPKIN_CAPACITY[island];
  const farmHands = Object.keys(game.farmHands.bumpkins).length;

  if (farmHands + 1 >= capacity) {
    throw new Error("No space for a farm hand");
  }

  // Use coupon, otherwise Block Bucks
  const coupons = game.inventory["Farmhand Coupon"];
  if (coupons?.gte(1)) {
    game.inventory["Farmhand Coupon"] = coupons.sub(1);
  } else {
    const blockBucks = game.inventory["Block Buck"] ?? new Decimal(0);
    if (blockBucks.lt(FARM_HAND_COST)) {
      throw new Error("Insufficient Block Bucks");
    }

    game.inventory["Block Buck"] = blockBucks.sub(FARM_HAND_COST);
  }

  const id = Object.keys(game.farmHands.bumpkins).length + 1;
  game.farmHands.bumpkins[id] = {
    equipped: {
      background: "Farm Background",
      body: "Beige Farmer Potion",
      hair: "Basic Hair",
      shoes: "Black Farmer Boots",
      tool: "Farmer Pitchfork",
      shirt: "Yellow Farmer Shirt",
      pants: "Farmer Overalls",
    },
  };

  const previous = game.inventory.Farmhand ?? new Decimal(0);
  game.inventory.Farmhand = previous.add(1);

  return {
    ...game,
  };
}
