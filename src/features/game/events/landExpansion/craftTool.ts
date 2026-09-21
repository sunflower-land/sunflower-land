import Decimal from "decimal.js-light";
import {
  type TreasureToolName,
  TREASURE_TOOLS,
  type Tool,
  type WorkbenchToolName,
  WORKBENCH_TOOLS,
  LOVE_ANIMAL_TOOLS,
} from "features/game/types/tools";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { SKILL_RANKS, getSkillLevel } from "features/game/types/bumpkinSkills";
import cloneDeep from "lodash.clonedeep";

import type { GameState, IslandType } from "../../types/game";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import {
  getWeatherShop,
  type WeatherShopItem,
} from "features/game/types/calendar";
import { getObjectEntries } from "lib/object";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";

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

/** A new player's first Axes are on the house, so they learn to buy tools. */
export const TUTORIAL_FREE_AXES = 10;

/**
 * How many free Axes a tutorial island player has left. Counted from lifetime
 * crafts, not inventory, so chopping does not top the allowance back up.
 */
export function getFreeAxesLeft(game: Readonly<GameState>): number {
  if (game.island.type !== "basic") return 0;

  const crafted = game.farmActivity?.["Axe Crafted"] ?? 0;

  return Math.max(0, TUTORIAL_FREE_AXES - crafted);
}

/**
 * Coin price of a single tool after every discount, ignoring the free tutorial
 * Axes. The Workbench needs this to work out how many it can afford, since a
 * batch that includes free Axes is not simply one price times the amount.
 */
export function getToolUnitPrice(tool: Tool, game: Readonly<GameState>) {
  const { name } = tool;
  const { bumpkin, inventory } = game;

  // Default price
  let price = tool.price;

  // Feller's Discount Skill: axe coin cost multiplier (scales with rank)
  const fellersDiscountLevel = getSkillLevel(
    bumpkin.skills,
    "Feller's Discount",
  );
  if (fellersDiscountLevel && name === "Axe") {
    price =
      price * SKILL_RANKS["Feller's Discount"].ranks[fellersDiscountLevel - 1];
  }

  // Reel Deal: rod coin cost multiplier x0.5/x0.4/x0.3 (scales with rank)
  const reelDealLevel = getSkillLevel(bumpkin.skills, "Reel Deal");
  if (reelDealLevel && name === "Rod") {
    price = price * SKILL_RANKS["Reel Deal"].ranks[reelDealLevel - 1];
  }

  // Artist's Discount Skill: 10% off
  if (inventory["Artist"]?.gte(1)) {
    price = price * 0.9;
  }

  // Frugal Miner: pickaxe coin cost multiplier (scales with rank)
  const frugalMinerLevel = getSkillLevel(bumpkin.skills, "Frugal Miner");
  if (frugalMinerLevel && isPickaxe(name as WorkbenchToolName)) {
    price = price * SKILL_RANKS["Frugal Miner"].ranks[frugalMinerLevel - 1];
  }

  // Cheap Rakes: Salt Rake coin cost multiplier (scales with rank)
  const cheapRakesLevel = getSkillLevel(bumpkin.skills, "Cheap Rakes");
  if (cheapRakesLevel && name === "Salt Rake") {
    price = price * SKILL_RANKS["Cheap Rakes"].ranks[cheapRakesLevel - 1];
  }

  if (
    (game.sculptures?.["Salt Sculpture"]?.level ?? 0) >= 4 &&
    name === "Salt Rake"
  ) {
    price = price * 0.9;
  }

  return price;
}

/** How many of this tool the player can still craft for free. */
export function getFreeToolAmount(tool: Tool, game: Readonly<GameState>) {
  return tool.name === "Axe" ? getFreeAxesLeft(game) : 0;
}

export function getToolPrice(
  tool: Tool,
  amount: number,
  game: Readonly<GameState>,
) {
  // The free tutorial Axes come off the front of the batch, so a batch that
  // straddles the allowance only pays for the Axes beyond it.
  const paidAmount = Math.max(0, amount - getFreeToolAmount(tool, game));

  // Return the price for the amount of tools
  return getToolUnitPrice(tool, game) * paidAmount;
}

export function craftTool({ state, action }: Options) {
  const stateCopy: GameState = cloneDeep(state);
  const bumpkin = stateCopy.bumpkin;

  const tool = CRAFTABLE_TOOLS(stateCopy.island.type)[action.tool];
  const amount = action.amount ?? 1;

  if (!tool) {
    throw new Error("Tool does not exist");
  }

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Invalid amount");
  }

  const { disabled, requiredIsland, requiredLevel, ingredients } = tool;

  if (disabled) {
    throw new Error("Tool is disabled");
  }

  const isWeatherItem = action.tool in getWeatherShop(stateCopy.island.type);
  if (
    isWeatherItem &&
    (stateCopy.inventory[action.tool] ?? new Decimal(0)).add(amount).gt(1)
  ) {
    throw new Error("You can only have one of this weather item");
  }

  if (!hasRequiredIslandExpansion(stateCopy.island.type, requiredIsland)) {
    throw new Error("You do not have the required island expansion");
  }

  if (stateCopy.stock[action.tool]?.lt(amount)) {
    throw new Error("Not enough stock");
  }

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin!");
  }
  const price = getToolPrice(tool, amount, stateCopy);

  if (stateCopy.coins < price) {
    throw new Error("Insufficient Coins");
  }

  if (
    requiredLevel &&
    !meetsLevelRequirement(
      getAscensionLevel({
        experience: bumpkin.experience,
        ascensionLevel: stateCopy.island.ascensionLevel ?? 0,
      }),
      requiredLevel,
    )
  ) {
    throw new Error("You do not have the required level");
  }

  const toolIngredients = ingredients(bumpkin.skills);

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

  const stock = stateCopy.stock[action.tool];
  if (stock !== undefined) {
    stateCopy.stock[action.tool] = stock.minus(amount);
  }

  return stateCopy;
}
