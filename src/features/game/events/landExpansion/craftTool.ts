import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import {
  TreasureToolName,
  TREASURE_TOOLS,
  WorkbenchToolName,
  WORKBENCH_TOOLS,
} from "features/game/types/tools";
import { trackActivity } from "features/game/types/bumpkinActivity";
import cloneDeep from "lodash.clonedeep";

import { GameState } from "../../types/game";

export type CraftToolAction = {
  type: "tool.crafted";
  tool: WorkbenchToolName | TreasureToolName;
};

export const CRAFTABLE_TOOLS = () => ({
  ...WORKBENCH_TOOLS(),
  ...TREASURE_TOOLS(),
});
type Options = {
  state: Readonly<GameState>;
  action: CraftToolAction;
};

export function craftTool({ state, action }: Options) {
  const stateCopy = cloneDeep(state);
  const bumpkin = stateCopy.bumpkin;

  const tool = CRAFTABLE_TOOLS()[action.tool];

  if (!tool) {
    throw new Error("Tool does not exist");
  }

  if (stateCopy.stock[action.tool]?.lt(1)) {
    throw new Error("Not enough stock");
  }

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }
  const price = tool.sfl;

  if (stateCopy.balance.lessThan(price)) {
    throw new Error("Insufficient tokens");
  }

  const subtractedInventory = getKeys(tool.ingredients).reduce(
    (inventory, ingredientName) => {
      const count = inventory[ingredientName] || new Decimal(0);
      const totalAmount = tool.ingredients[ingredientName] || new Decimal(0);

      if (count.lessThan(totalAmount)) {
        throw new Error(`Insufficient ingredient: ${ingredientName}`);
      }

      return {
        ...inventory,
        [ingredientName]: count.sub(totalAmount),
      };
    },
    stateCopy.inventory
  );

  const oldAmount = stateCopy.inventory[action.tool] || new Decimal(0);

  bumpkin.activity = trackActivity(`${action.tool} Crafted`, bumpkin.activity);
  bumpkin.activity = trackActivity("SFL Spent", bumpkin.activity, price);

  return {
    ...stateCopy,
    balance: stateCopy.balance.sub(price),
    inventory: {
      ...subtractedInventory,
      [action.tool]: oldAmount.add(1) as Decimal,
    },
    stock: {
      ...stateCopy.stock,
      [action.tool]: stateCopy.stock[action.tool]?.minus(1) as Decimal,
    },
  };
}
