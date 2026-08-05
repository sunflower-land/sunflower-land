import Decimal from "decimal.js-light";

import type { GameState, InventoryItemName } from "features/game/types/game";
import {
  WORKBENCH_TOOLS,
  type WorkbenchToolName,
} from "features/game/types/tools";
import { getToolPrice } from "features/game/events/landExpansion/craftTool";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { getObjectEntries } from "lib/object";

export type ToolPurchase = {
  toolName: WorkbenchToolName;
  amount: number;
  price: number;
  ingredients: Partial<Record<InventoryItemName, Decimal>>;
};

export type ToolPurchasePlan = {
  purchases: ToolPurchase[];
  totalCost: number;
  totalIngredients: Partial<Record<InventoryItemName, Decimal>>;
};

/**
 * Given a stock/inventory-derived starting amount, works out how many of
 * that amount are actually affordable against a coin pool and a set of
 * ingredient costs. Shared by the single-tool "craft all" calculation and
 * the "buy all" planner below so the two stay in sync.
 */
export function computeAffordableAmount(
  initialAmount: number,
  price: number,
  coins: number,
  ingredients: Partial<Record<InventoryItemName, Decimal>>,
  getAvailableIngredient: (name: InventoryItemName) => Decimal,
): number {
  let amount = initialAmount;

  if (amount <= 0) return 0;

  if (price > 0) {
    amount = Math.min(amount, Math.floor(coins / price));
  }

  getObjectEntries(ingredients).forEach(
    ([ingredientName, ingredientAmount]) => {
      if (!ingredientAmount) return;

      const affordableByIngredient = getAvailableIngredient(ingredientName)
        .div(ingredientAmount)
        .toDecimalPlaces(0, Decimal.ROUND_DOWN)
        .toNumber();

      amount = Math.min(amount, affordableByIngredient);
    },
  );

  return Math.max(amount, 0);
}

function isToolLocked(toolName: WorkbenchToolName, state: GameState) {
  const tool = WORKBENCH_TOOLS[toolName];

  if (!hasRequiredIslandExpansion(state.island.type, tool.requiredIsland)) {
    return true;
  }

  if (!tool.requiredLevel) return false;

  const ascension = getAscensionLevel({
    experience: state.bumpkin?.experience ?? 0,
    ascensionLevel: state.island.ascensionLevel ?? 0,
  });

  return !meetsLevelRequirement(ascension, tool.requiredLevel);
}

/**
 * Greedily plans the maximum affordable amount of each tool, spending from
 * a single shared coin pool and shared ingredient inventory in the given
 * order. Skips tools that are disabled, locked (missing island expansion
 * or required level), out of stock, blocked by the player's Buy All
 * settings, or already unaffordable by the time their turn comes up.
 */
export function planToolPurchases(
  state: GameState,
  toolNames: WorkbenchToolName[],
): ToolPurchasePlan {
  let remainingCoins = state.coins;
  const remainingIngredients: Partial<Record<InventoryItemName, Decimal>> = {};
  const purchases: ToolPurchase[] = [];
  const seen = new Set<WorkbenchToolName>();

  const getRemainingIngredient = (name: InventoryItemName) =>
    remainingIngredients[name] ?? state.inventory[name] ?? new Decimal(0);

  toolNames.forEach((toolName) => {
    if (seen.has(toolName)) return;
    seen.add(toolName);

    const tool = WORKBENCH_TOOLS[toolName];

    if (tool.disabled) return;
    if (isToolLocked(toolName, state)) return;

    const buyAllSetting = state.settings.toolShop?.buyAll?.[toolName];
    if (buyAllSetting?.blocked) return;

    const stock = state.stock[toolName] ?? new Decimal(0);
    let amount = stock.toDecimalPlaces(0, Decimal.ROUND_DOWN).toNumber();

    if (amount <= 0) return;

    const price = getToolPrice(tool, 1, state);
    const ingredients = tool.ingredients(state.bumpkin.skills);

    amount = computeAffordableAmount(
      amount,
      price,
      remainingCoins,
      ingredients,
      getRemainingIngredient,
    );

    if (amount <= 0) return;

    const purchaseIngredients: Partial<Record<InventoryItemName, Decimal>> = {};

    getObjectEntries(ingredients).forEach(
      ([ingredientName, ingredientAmount]) => {
        if (!ingredientAmount) return;

        const totalIngredientAmount = ingredientAmount.mul(amount);

        purchaseIngredients[ingredientName] = totalIngredientAmount;
        remainingIngredients[ingredientName] = getRemainingIngredient(
          ingredientName,
        ).sub(totalIngredientAmount);
      },
    );

    purchases.push({
      toolName,
      amount,
      price,
      ingredients: purchaseIngredients,
    });
    remainingCoins -= price * amount;
  });

  const totalCost = purchases.reduce(
    (sum, purchase) => sum + purchase.amount * purchase.price,
    0,
  );

  const totalIngredients: Partial<Record<InventoryItemName, Decimal>> = {};

  purchases.forEach((purchase) => {
    getObjectEntries(purchase.ingredients).forEach(
      ([ingredientName, ingredientAmount]) => {
        if (!ingredientAmount) return;

        totalIngredients[ingredientName] = (
          totalIngredients[ingredientName] ?? new Decimal(0)
        ).add(ingredientAmount);
      },
    );
  });

  return { purchases, totalCost, totalIngredients };
}
