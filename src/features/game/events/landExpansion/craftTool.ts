import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { WorkbenchToolName, WORKBENCH_TOOLS } from "features/game/types/tools";
import cloneDeep from "lodash.clonedeep";

import { GameState } from "../../types/game";

export type CraftToolAction = {
  type: "tool.crafted";
  tool: WorkbenchToolName;
};

type Options = {
  state: Readonly<GameState>;
  action: CraftToolAction;
};

export function craftTool({ state, action }: Options) {
  const stateCopy = cloneDeep(state);

  const tool = WORKBENCH_TOOLS()[action.tool];

  if (!tool) {
    throw new Error("Tool does not exist");
  }

  if (stateCopy.stock[action.tool]?.lt(1)) {
    throw new Error("Not enough stock");
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
