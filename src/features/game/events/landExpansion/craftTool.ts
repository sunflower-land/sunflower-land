import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import {
  TreasureToolName,
  TREASURE_TOOLS,
  Tool,
  WorkbenchToolName,
  WORKBENCH_TOOLS,
} from "features/game/types/tools";
import { trackActivity } from "features/game/types/bumpkinActivity";
import cloneDeep from "lodash.clonedeep";

import { GameState, Inventory } from "../../types/game";

type CraftableToolName = WorkbenchToolName | TreasureToolName;

export type CraftToolAction = {
  type: "tool.crafted";
  tool: CraftableToolName;
  amount: number;
};

export const CRAFTABLE_TOOLS: Record<CraftableToolName, Tool> = {
  ...WORKBENCH_TOOLS,
  ...TREASURE_TOOLS,
};

export function getToolBuyPrice(tool: Tool, inventory: Inventory) {
  let price = tool.sfl;

  //LEGACY SKILL Contributor Artist Skill
  if (price && inventory.Artist?.gte(1)) {
    price = price.mul(0.9);
  }

  return price;
}

type Options = {
  state: Readonly<GameState>;
  action: CraftToolAction;
};

export function craftTool({ state, action }: Options) {
  const stateCopy = cloneDeep(state);
  const bumpkin = stateCopy.bumpkin;

  const tool = CRAFTABLE_TOOLS[action.tool];
  const amount = action.amount;

  if (!tool) {
    throw new Error("Tool does not exist");
  }

  if (stateCopy.stock[action.tool]?.lt(amount)) {
    throw new Error("Not enough stock");
  }

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  const price = getToolBuyPrice(tool, stateCopy.inventory);
  const totalExpenses = price?.mul(amount);

  if (totalExpenses && stateCopy.balance.lessThan(totalExpenses)) {
    throw new Error("Insufficient tokens");
  }

  const subtractedInventory = getKeys(tool.ingredients).reduce(
    (inventory, ingredientName) => {
      const count = inventory[ingredientName]?.mul(1) || new Decimal(0);
      const totalAmount =
        tool.ingredients[ingredientName]?.mul(amount) || new Decimal(0);

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

  bumpkin.activity = trackActivity(
    `${action.tool} Crafted`,
    bumpkin.activity,
    new Decimal(amount)
  );
  bumpkin.activity = trackActivity(
    "SFL Spent",
    bumpkin.activity,
    totalExpenses
  );

  return {
    ...stateCopy,
    balance: stateCopy.balance.sub(totalExpenses),
    inventory: {
      ...subtractedInventory,
      [action.tool]: oldAmount.add(amount) as Decimal,
    },
    stock: {
      ...stateCopy.stock,
      [action.tool]: stateCopy.stock[action.tool]?.minus(amount) as Decimal,
    },
  };
}
