import Decimal from "decimal.js-light";
import {
  getBasketItems,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { GameState, Inventory, InventoryItemName } from "../types/game";

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
    previousInventory: Object.keys(farm.previousInventory).reduce(
      (items, item) => ({
        ...items,
        [item]: new Decimal(farm.previousInventory[item]),
      }),
      {} as Record<InventoryItemName, Decimal>
    ),
    wardrobe: farm.wardrobe,
    stock: Object.keys(farm.stock).reduce(
      (items, item) => ({
        ...items,
        [item]: new Decimal(farm.stock[item]),
      }),
      {} as Record<InventoryItemName, Decimal>
    ),
    createdAt: farm.createdAt,
    chickens: farm.chickens || {},
    stockExpiry: farm.stockExpiry || {},
    balance: new Decimal(farm.balance),
    previousBalance: new Decimal(farm.previousBalance),
    trades: farm.trades,
    tradeOffer: farm.tradeOffer
      ? {
          ...farm.tradeOffer,
          ingredients: farm.tradeOffer.ingredients.map((ingredient: any) => ({
            ...ingredient,
            amount: new Decimal(ingredient.amount),
          })),
        }
      : undefined,

    bertObsession: farm.bertObsession,
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

    islands: farm.islands,

    bumpkin: farm.bumpkin,
    buildings: farm.buildings,
    fishing: farm.fishing ?? { wharf: {} },
    farmActivity: farm.farmActivity ?? {},
    milestones: farm.milestones ?? {},
    airdrops: farm.airdrops,
    collectibles: farm.collectibles,
    warCollectionOffer: farm.warCollectionOffer,
    mysteryPrizes: farm.mysteryPrizes,
    treasureIsland: farm.treasureIsland,
    pumpkinPlaza: farm.pumpkinPlaza,
    dailyRewards: farm.dailyRewards,
    auctioneer: farm.auctioneer ?? {},
    hayseedHank: farm.hayseedHank,
    chores: farm.chores,
    tradedAt: farm.tradedAt,
    trees: farm.trees ?? {},
    stones: farm.stones ?? {},
    iron: farm.iron ?? {},
    gold: farm.gold ?? {},
    crops: farm.crops ?? {},
    fruitPatches: farm.fruitPatches ?? {},
    conversations: farm.conversations ?? [],
    mailbox: farm.mailbox ?? {
      read: [],
      unread: [],
    },
    mushrooms: farm.mushrooms,
    catchTheKraken: farm.catchTheKraken,
    delivery: farm.delivery,
    potionHouse: farm.potionHouse,
    npcs: farm.npcs,
    buds: farm.buds,
  };
}

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
  const availableItems = {
    ...chestItems,
    ...basketItems,
    // This is necessary because the season banner is a requirement for some items in Goblin Retreat so we need to see that you have one even if it's placed.
    ...(offChain.inventory["Dawn Breaker Banner"] && {
      "Dawn Breaker Banner": offChain.inventory["Dawn Breaker Banner"],
    }),
    ...(offChain.inventory["Witches' Eve Banner"] && {
      "Witches' Eve Banner": offChain.inventory["Witches' Eve Banner"],
    }),
    ...(offChain.inventory["Catch the Kraken Banner"] && {
      "Catch the Kraken Banner": offChain.inventory["Catch the Kraken Banner"],
    }),
    ...(offChain.inventory["Gold Pass"] && {
      "Gold Pass": offChain.inventory["Gold Pass"],
    }),
  };

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
