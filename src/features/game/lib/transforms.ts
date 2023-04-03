import Decimal from "decimal.js-light";
import {
  getBasketItems,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { GameState, Inventory, InventoryItemName, Rock } from "../types/game";

/**
 * Converts API response into a game state
 */
export function makeGame(farm: any): GameState {
  return {
    inventory: Object.keys(farm.inventory).reduce(
      (items, item) => ({
        ...items,
        [item]: new Decimal(farm.inventory[item]),
      }),
      {} as Record<InventoryItemName, Decimal>
    ),
    stock: Object.keys(farm.stock).reduce(
      (items, item) => ({
        ...items,
        [item]: new Decimal(farm.stock[item]),
      }),
      {} as Record<InventoryItemName, Decimal>
    ),
    chickens: farm.chickens || {},
    stockExpiry: farm.stockExpiry || {},
    balance: new Decimal(farm.balance),
    id: farm.id,
    tradeOffer: farm.tradeOffer
      ? {
          ...farm.tradeOffer,
          ingredients: farm.tradeOffer.ingredients.map((ingredient: any) => ({
            ...ingredient,
            amount: new Decimal(ingredient.amount),
          })),
        }
      : undefined,
    grubOrdersFulfilled: farm.grubOrdersFulfilled,
    grubShop: farm.grubShop
      ? {
          ...farm.grubShop,
          orders: farm.grubShop.orders.map((order: any) => ({
            ...order,
            sfl: new Decimal(order.sfl),
          })),
        }
      : undefined,

    expansionConstruction: farm.expansionConstruction,
    expansionRequirements: farm.expansionRequirements,

    bumpkin: farm.bumpkin,
    buildings: farm.buildings,
    airdrops: farm.airdrops,
    collectibles: farm.collectibles,
    warCollectionOffer: farm.warCollectionOffer,
    mysteryPrizes: farm.mysteryPrizes,
    treasureIsland: farm.treasureIsland,
    pumpkinPlaza: farm.pumpkinPlaza,
    dailyRewards: farm.dailyRewards,
    auctioneer: farm.auctioneer ?? {},
    hayseedHank: farm.hayseedHank,
    tradedAt: farm.tradedAt,

    trees: farm.trees ?? {},
    stones: farm.stones ?? {},
    iron: farm.iron ?? {},
    gold: farm.gold ?? {},
    crops: farm.crops ?? {},
    fruitPatches: farm.fruitPatches ?? {},
  };
}

type Rocks = Record<number, Rock>;

/**
 * Returns the lowest values out of 2 game states
 */
export function getAvailableGameState({
  onChain,
  offChain,
}: {
  onChain: GameState;
  offChain: GameState;
}) {
  // Grab items that are available in inventory(not placed)
  const chestItems = getChestItems(offChain);
  const basketItems = getBasketItems(offChain.inventory);
  const availableItems = { ...chestItems, ...basketItems };

  const balance = onChain.balance.lt(offChain.balance)
    ? onChain.balance
    : offChain.balance;

  const items = [
    ...new Set([
      ...(Object.keys(onChain.inventory) as InventoryItemName[]),
      ...(Object.keys(availableItems) as InventoryItemName[]),
    ]),
  ];

  const inventory: Inventory = items.reduce((inv, name) => {
    const firstAmount = onChain.inventory[name] || new Decimal(0);
    const secondAmount = availableItems[name] || new Decimal(0);

    const amount = firstAmount.lt(secondAmount) ? firstAmount : secondAmount;

    if (amount.eq(0)) {
      return inv;
    }

    return {
      ...inv,
      [name]: amount,
    };
  }, {});

  return {
    balance,
    inventory,
  };
}
