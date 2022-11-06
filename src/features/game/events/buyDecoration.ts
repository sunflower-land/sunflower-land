import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { trackActivity } from "../types/bumpkinActivity";
import { getKeys } from "../types/craftables";
import { DecorationName, DECORATIONS } from "../types/decorations";
import { GameState } from "../types/game";

export type buyDecorationAction = {
  type: "decoration.bought";
  item: DecorationName;
};

type Options = {
  state: Readonly<GameState>;
  action: buyDecorationAction;
};

const VALID_DECORATIONS: DecorationName[] = [
  "White Tulips",
  "Potted Sunflower",
];

export function buyDecoration({ state, action }: Options) {
  const stateCopy = cloneDeep(state);
  const { item } = action;
  const desiredItem = DECORATIONS()[item];

  if (!desiredItem) {
    throw new Error("This item is not a decoration");
  }

  const { bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("Bumpkin not found");
  }

  const totalExpenses = desiredItem.sfl;

  if (totalExpenses && stateCopy.balance.lessThan(totalExpenses)) {
    throw new Error("Insufficient tokens");
  }

  const subtractedInventory = getKeys(desiredItem.ingredients)?.reduce(
    (inventory, ingredient) => {
      const count = inventory[ingredient] || new Decimal(0);
      const desiredCount =
        desiredItem.ingredients[ingredient] || new Decimal(0);

      if (count.lessThan(desiredCount)) {
        throw new Error(`Insufficient ingredient: ${ingredient}`);
      }

      return {
        ...inventory,
        [ingredient]: count.sub(desiredCount),
      };
    },
    stateCopy.inventory
  );

  const oldAmount = stateCopy.inventory[item] ?? new Decimal(0);

  bumpkin.activity = trackActivity(
    "SFL Spent",
    bumpkin?.activity,
    totalExpenses ?? new Decimal(0)
  );
  bumpkin.activity = trackActivity(
    `${item} Bought`,
    bumpkin?.activity,
    new Decimal(1)
  );

  return {
    ...stateCopy,
    balance: totalExpenses
      ? stateCopy.balance.sub(totalExpenses)
      : stateCopy.balance,
    inventory: {
      ...stateCopy.inventory,
      ...subtractedInventory,
      [item]: oldAmount.add(1) as Decimal,
    },
  };
}
