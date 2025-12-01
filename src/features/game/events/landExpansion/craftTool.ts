import Decimal from "decimal.js-light";
import {
  TreasureToolName,
  TREASURE_TOOLS,
  Tool,
  WorkbenchToolName,
  WORKBENCH_TOOLS,
  LOVE_ANIMAL_TOOLS,
} from "features/game/types/tools";
import { trackFarmActivity } from "features/game/types/farmActivity";
import cloneDeep from "lodash.clonedeep";

import { GameState, IslandType } from "../../types/game";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { getWeatherShop, WeatherShopItem } from "features/game/types/calendar";
import { getObjectEntries } from "features/game/expansion/lib/utils";

type CraftableToolName = WorkbenchToolName | TreasureToolName | WeatherShopItem;

export type CraftToolAction = {
  type: "tool.crafted";
  tool: CraftableToolName;
  amount?: number;
};

export const CRAFTABLE_TOOLS = (
  islandType: IslandType,
): Record<CraftableToolName, Tool> => ({
  ...WORKBENCH_TOOLS,
  ...TREASURE_TOOLS,
  ...LOVE_ANIMAL_TOOLS,
  ...getWeatherShop(islandType),
});

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

  const tool = CRAFTABLE_TOOLS(stateCopy.island.type)[action.tool];
  const amount = action.amount ?? 1;

  if (!tool) {
    throw new Error("Tool does not exist");
  }

  if (tool.disabled) {
    throw new Error("Tool is disabled");
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

  const toolIngredients = tool.ingredients(bumpkin.skills);

  const subtractedInventory = getObjectEntries(toolIngredients).reduce(
    (inventory, [ingredientName, ingredientAmount]) => {
      const count = inventory[ingredientName] || new Decimal(0);
      const totalAmount = ingredientAmount?.mul(amount) || new Decimal(0);
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

  stateCopy.farmActivity = trackFarmActivity(
    `${action.tool} Crafted`,
    stateCopy.farmActivity,
    new Decimal(amount),
  );

  stateCopy.coins = stateCopy.coins - price;
  stateCopy.farmActivity = trackFarmActivity(
    "Coins Spent",
    stateCopy.farmActivity,
    new Decimal(price),
  );

  stateCopy.inventory = {
    ...subtractedInventory,
    [action.tool]: oldAmount.add(amount) as Decimal,
  };
  stateCopy.stock[action.tool] = stateCopy.stock[action.tool]?.minus(amount);

  return stateCopy;
}
