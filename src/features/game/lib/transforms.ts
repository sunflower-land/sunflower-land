import Decimal from "decimal.js-light";

import { GameState, InventoryItemName } from "../types/game";

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
    previousWardrobe: farm.previousWardrobe,
    stock: Object.keys(farm.stock).reduce(
      (items, item) => ({
        ...items,
        [item]: new Decimal(farm.stock[item]),
      }),
      {} as Record<InventoryItemName, Decimal>
    ),
    island: farm.island,
    home: farm.home,
    createdAt: farm.createdAt,
    chickens: farm.chickens || {},
    stockExpiry: farm.stockExpiry || {},
    coins: farm.coins,
    balance: new Decimal(farm.balance),
    previousBalance: new Decimal(farm.previousBalance),
    username: farm.username,
    trades: farm.trades,
    farmHands: farm.farmHands,
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

    expansionConstruction: farm.expansionConstruction,
    expandedAt: farm.expandedAt,
    greenhouse: farm.greenhouse,

    islands: farm.islands,
    portals: farm.portals,

    bumpkin: farm.bumpkin,
    buildings: farm.buildings,
    fishing: farm.fishing ?? { wharf: {}, beach: {} },
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
    chores: farm.chores,
    tradedAt: farm.tradedAt,
    trees: farm.trees ?? {},
    stones: farm.stones ?? {},
    iron: farm.iron ?? {},
    gold: farm.gold ?? {},
    crimstones: farm.crimstones ?? {},
    oilReserves: farm.oilReserves ?? {},
    sunstones: farm.sunstones ?? {},
    crops: farm.crops ?? {},
    fruitPatches: farm.fruitPatches ?? {},
    flowers: farm.flowers ?? {},
    beehives: farm.beehives ?? {},
    conversations: farm.conversations ?? [],
    mailbox: farm.mailbox ?? {
      read: [],
      unread: [],
    },
    mushrooms: farm.mushrooms,
    catchTheKraken: farm.catchTheKraken ?? {
      weeklyCatches: {},
      hunger: undefined,
    },
    delivery: farm.delivery,
    potionHouse: farm.potionHouse,
    npcs: farm.npcs,
    buds: farm.buds,
    christmas: farm.christmas,
    flowerShop: farm.flowerShop,
    specialEvents: farm.specialEvents,
    megastore: {
      ...farm.megastore,
      wearables: farm.megastore.wearables.map((wearable: any) => ({
        ...wearable,
        price: new Decimal(wearable.price),
      })),
      collectibles: farm.megastore.collectibles.map((collectible: any) => ({
        ...collectible,
        price: new Decimal(collectible.price),
      })),
    },
    goblinMarket: farm.goblinMarket,
    faction: farm.faction,
    dailyFactionDonationRequest: farm.dailyFactionDonationRequest
      ? {
          resource: farm.dailyFactionDonationRequest.resource,
          amount: new Decimal(farm.dailyFactionDonationRequest.amount),
        }
      : undefined,
  };
}
