import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { GameState } from "../types/game";

export type CollectWarBonds = {
  type: "warBonds.bought";
};

type Options = {
  state: Readonly<GameState>;
  action: CollectWarBonds;
  createdAt?: number;
};

export function buyWarBonds({ state }: Options): GameState {
  const game = cloneDeep(state);
  const offer = game.warCollectionOffer;
  if (!offer) {
    throw new Error("No war bonds available");
  }

  const subtractedInventory = offer.ingredients.reduce(
    (inventory, ingredient) => {
      const count = game.inventory[ingredient.name] || new Decimal(0);

      if (count.lessThan(ingredient.amount)) {
        throw new Error(`Insufficient ingredient: ${ingredient.name}`);
      }

      return {
        ...inventory,
        [ingredient.name]: count.sub(ingredient.amount),
      };
    },
    game.inventory
  );

  const warBonds = game.inventory["War Bond"] || new Decimal(0);

  const inventory = {
    ...subtractedInventory,
    "War Bond": warBonds.add(offer.warBonds),
  };

  // TODO - base on their allegiance
  const side: "goblin" | "human" = "goblin";

  if (side === "goblin") {
    inventory["Goblin War Point"] = (
      inventory["Goblin War Point"] || new Decimal(0)
    ).add(offer.warBonds);
  } else {
    inventory["Human War Point"] = (
      inventory["Human War Point"] || new Decimal(0)
    ).add(offer.warBonds);
  }

  return {
    ...game,
    inventory,
  };
}
