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
  Wood: 100,
  Gold: 100,
  Stone: 100,
  Iron: 100,
  Egg: 100,
  Sunflower: 100,
  Potato: 100,
  Pumpkin: 100,
  Cabbage: 100,
  Carrot: 100,
  Beetroot: 100,
  Cauliflower: 100,
  Radish: 100,
  Parsnip: 100,
  Wheat: 100,
  Kale: 100,
  Blueberry: 100,
  Orange: 100,
  Eggplant: 100,
  Apple: 100,
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
