import { Decimal } from "decimal.js-light";
import { CLUTTER, ClutterName } from "features/game/types/clutter";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type BurnClutterAction = {
  type: "clutter.burned";
  item: ClutterName;
  amount: number;
};

type Options = {
  state: Readonly<GameState>;
  action: BurnClutterAction;
};

export function burnClutter({ state, action }: Options) {
  return produce(state, (game) => {
    const { item, amount } = action;

    if (!(item in CLUTTER)) {
      throw new Error("Can't be thrown into the incinerator");
    }

    if (!game.inventory[item]) {
      throw new Error("Item not in inventory");
    }

    if (
      !new Decimal(amount).isInteger() ||
      amount % CLUTTER[item].sellUnit !== 0
    ) {
      throw new Error("Invalid amount");
    }

    if (game.inventory[item]?.lessThan(amount)) {
      throw new Error("Insufficient quantity to burn");
    }

    const cheer = amount / CLUTTER[item].sellUnit;

    game.inventory.Cheer = (game.inventory.Cheer ?? new Decimal(0)).add(cheer);
    game.inventory[item] = game.inventory[item].sub(amount);
  });
}
