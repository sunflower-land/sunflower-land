import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { GameState, IslandType, Wardrobe } from "features/game/types/game";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

export type BuyFarmHandAction = {
  type: "farmHand.bought";
};

type Options = {
  state: Readonly<GameState>;
  action: BuyFarmHandAction;
  createdAt?: number;
};

const FARM_HAND_PARTS: BumpkinParts = {
  background: "Farm Background",
  body: "Beige Farmer Potion",
  hair: "Basic Hair",
  shoes: "Black Farmer Boots",
  tool: "Farmer Pitchfork",
  shirt: "Yellow Farmer Shirt",
  pants: "Farmer Overalls",
};

export const ISLAND_BUMPKIN_CAPACITY: Record<IslandType, number> = {
  basic: 2,
  spring: 3,
  desert: 4,
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

  // Add wearables to wardrobe
  game.wardrobe = Object.values(FARM_HAND_PARTS).reduce(
    (wardrobe, part) => {
      const total = (wardrobe[part] ?? 0) + 1;
      return {
        ...wardrobe,
        [part]: total,
      };
    },
    game.wardrobe ?? ({} as Wardrobe),
  );

  const previous = game.inventory.Farmhand ?? new Decimal(0);
  game.inventory.Farmhand = previous.add(1);

  return {
    ...game,
  };
}
