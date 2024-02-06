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

import { GameState } from "../../types/game";
import {
  PURCHASEABLE_BAIT,
  PurchaseableBait,
} from "features/game/types/fishing";
import { translate } from "lib/i18n/translate";

type CraftableToolName =
  | WorkbenchToolName
  | TreasureToolName
  | PurchaseableBait;

export type CraftToolAction = {
  type: "tool.crafted";
  tool: CraftableToolName;
  amount?: number;
};

export const CRAFTABLE_TOOLS: Record<CraftableToolName, Tool> = {
  ...WORKBENCH_TOOLS(),
  ...TREASURE_TOOLS,
  ...PURCHASEABLE_BAIT,
};

type Options = {
  state: Readonly<GameState>;
  action: CraftToolAction;
};

export function craftTool({ state, action }: Options) {
  const stateCopy = cloneDeep(state);
  const bumpkin = stateCopy.bumpkin;

  const tool = CRAFTABLE_TOOLS[action.tool];
  const amount = action.amount ?? 1;

  if (!tool) {
    throw new Error("Tool does not exist");
  }

  if (stateCopy.stock[action.tool]?.lt(1)) {
    throw new Error("Not enough stock");
  }

  if (bumpkin === undefined) {
    throw new Error(translate("no.have.bumpkin"));
  }
  const price = tool.sfl.mul(amount);

  if (stateCopy.balance.lessThan(price)) {
    throw new Error("Insufficient tokens");
  }

  const subtractedInventory = getKeys(tool.ingredients).reduce(
    (inventory, ingredientName) => {
      const count = inventory[ingredientName] || new Decimal(0);
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
  bumpkin.activity = trackActivity("SFL Spent", bumpkin.activity, price);

  return {
    ...stateCopy,
    balance: stateCopy.balance.sub(price),
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
