import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import {
  TreasureToolName,
  TREASURE_TOOLS,
  Tool,
  WorkbenchToolName,
  WORKBENCH_TOOLS,
  LOVE_ANIMAL_TOOLS,
} from "features/game/types/tools";
import { trackActivity } from "features/game/types/bumpkinActivity";
import cloneDeep from "lodash.clonedeep";

import { GameState } from "../../types/game";
import {
  PURCHASEABLE_BAIT,
  PurchaseableBait,
} from "features/game/types/fishing";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { WEATHER_SHOP } from "features/game/types/calendar";

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
  ...WORKBENCH_TOOLS,
  ...TREASURE_TOOLS,
  ...PURCHASEABLE_BAIT,
  ...LOVE_ANIMAL_TOOLS,
  ...WEATHER_SHOP,
};

type Options = {
  state: Readonly<GameState>;
  action: CraftToolAction;
};

const isPickaxe = (name: WorkbenchToolName): boolean => {
  const pickaxes: WorkbenchToolName[] = [
    "Pickaxe",
    "Stone Pickaxe",
    "Iron Pickaxe",
    "Gold Pickaxe",
  ];

  return pickaxes.includes(name);
};

export function getToolPrice(
  tool: Tool,
  amount: number,
  game: Readonly<GameState>,
) {
  const { name } = tool;
  const { bumpkin, inventory } = game;

  // Default price
  let price = tool.price;

  // Feller's Discount Skill: 20% off on Axes
  if (bumpkin.skills["Feller's Discount"] && name === "Axe") {
    price = price * 0.8;
  }

  // Reel Deal: 50% off fishing rods
  if (bumpkin.skills["Reel Deal"] && name === "Rod") {
    price *= 0.5;
  }

  // Artist's Discount Skill: 10% off
  if (inventory["Artist"]?.gte(1)) {
    price = price * 0.9;
  }

  if (bumpkin.skills["Frugal Miner"] && isPickaxe(name as WorkbenchToolName)) {
    price = price * 0.8;
  }

  // Return the price for the amount of tools
  return price * amount;
}

export function craftTool({ state, action }: Options) {
  const stateCopy: GameState = cloneDeep(state);
  const bumpkin = stateCopy.bumpkin;

  const tool = CRAFTABLE_TOOLS[action.tool];
  const amount = action.amount ?? 1;

  if (!tool) {
    throw new Error("Tool does not exist");
  }

  if (!hasRequiredIslandExpansion(stateCopy.island.type, tool.requiredIsland)) {
    throw new Error("You do not have the required island expansion");
  }

  if (stateCopy.stock[action.tool]?.lt(1)) {
    throw new Error("Not enough stock");
  }

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin!");
  }
  const price = getToolPrice(tool, amount, stateCopy);

  if (stateCopy.coins < price) {
    throw new Error("Insufficient Coins");
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
    stateCopy.inventory,
  );

  const oldAmount = stateCopy.inventory[action.tool] || new Decimal(0);

  bumpkin.activity = trackActivity(
    `${action.tool} Crafted`,
    bumpkin.activity,
    new Decimal(amount),
  );
  bumpkin.activity = trackActivity(
    "Coins Spent",
    bumpkin.activity,
    new Decimal(price),
  );

  stateCopy.coins = stateCopy.coins - price;
  stateCopy.inventory = {
    ...subtractedInventory,
    [action.tool]: oldAmount.add(amount) as Decimal,
  };
  stateCopy.stock[action.tool] = stateCopy.stock[action.tool]?.minus(amount);

  return stateCopy;
}
