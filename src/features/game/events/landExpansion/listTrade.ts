import { v4 as uuidv4 } from "uuid";
import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";

export type ListTradeAction = {
  type: "trade.listed";
  items: Partial<Record<InventoryItemName, number>>;
  sfl: number;
};

type Options = {
  state: Readonly<GameState>;
  action: ListTradeAction;
  createdAt?: number;
};

export const TRADE_LIMITS: Partial<Record<InventoryItemName, number>> = {
  Sunflower: 1000,
  Potato: 1000,
  Pumpkin: 1000,
  Cabbage: 1000,
  Carrot: 500,
  Beetroot: 500,
  Cauliflower: 500,
  Parsnip: 200,
  Eggplant: 200,
  Radish: 200,
  Wheat: 200,
  Kale: 200,
  Corn: 200,
  Apple: 100,
  Orange: 100,
  Blueberry: 100,
  Wood: 100,
  Stone: 100,
  Iron: 100,
  Gold: 50,
  Egg: 100,
};

/**
 * TODO = Check in flight transaction
 */

export function listTrade({ state, action, createdAt = Date.now() }: Options) {
  const game = cloneDeep(state) as GameState;

  console.log({ action });
  // Ensure Gold Pass

  // Check Item Limits
  getKeys(action.items).forEach((name) => {
    const max = TRADE_LIMITS[name] ?? 0;
    const amount = action.items[name] ?? 0;

    if (amount > max) {
      throw new Error(`Max trade limit for ${name} reached`);
    }
  });

  // Check if trade exists
  if (getKeys(state.trades?.listings ?? {}).length > 0) {
    throw new Error("Trade already exists");
  }

  // Remove items from inventory
  getKeys(action.items).forEach((ingredient) => {
    const inventoryCount = game.inventory[ingredient] || new Decimal(0);
    const count = action.items[ingredient] ?? 0;
    if (inventoryCount.lt(count)) {
      throw new Error(`Insufficient ingredient: ${ingredient}`);
    }

    game.inventory[ingredient] = inventoryCount.sub(count);
  });

  // Will be replaced anyway
  const tradeId = uuidv4().slice(0, 8);
  game.trades.listings = {
    [tradeId]: {
      createdAt: createdAt,
      items: action.items,
      sfl: action.sfl,
    },
  };

  return game;
}
