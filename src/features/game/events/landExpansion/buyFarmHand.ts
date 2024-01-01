import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { randomID } from "lib/utils/random";

import cloneDeep from "lodash.clonedeep";

export type BuyFarmHandAction = {
  type: "farmHand.bought";
};

type Options = {
  state: Readonly<GameState>;
  action: BuyFarmHandAction;
  createdAt?: number;
};

export function buyFarmhand({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  let game = cloneDeep(state) as GameState;

  // TODO - Check if they can support another Bumpkin

  // TODO - check if they have a free Bumpkin

  // TODO - Subtract BBs

  // TODO - predictable ID?
  state.farmHands[randomID()] = {
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

  return {
    ...game,
  };
}
