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

  if (state.inventory.Axe?.lessThan(1)) {
    throw new Error("No axes left!");
  }

  return state;
}
