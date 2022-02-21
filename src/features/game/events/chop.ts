import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "../types/game";

export type ChopAction = {
  type: "tree.chopped";
  index: number;
  item: InventoryItemName;
};

type Options = {
  state: GameState;
  action: ChopAction;
};

export function chop({ state, action }: Options) {
  if (action.item !== "Axe") {
    throw new Error("You need an axe!");
  }

  const axeAmount = state.inventory.Axe || new Decimal(0);
  if (axeAmount.lessThan(1)) {
    throw new Error("No axes left!");
  }

  const woodAmount = state.inventory.Wood || new Decimal(0);
  return {
    ...state,
    inventory: {
      ...state.inventory,
      Axe: axeAmount.sub(1),
      Wood: woodAmount.add(1),
    },
  };
}
