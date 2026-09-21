import Decimal from "decimal.js-light";

import type { Buildings, GameState, InventoryItemName } from "../types/game";

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
      {} as Record<InventoryItemName, Decimal>,
    ),
    previousInventory: Object.keys(farm.previousInventory).reduce(
      (items, item) => ({
        ...items,
        [item]: new Decimal(farm.previousInventory[item]),
      }),
      {} as Record<InventoryItemName, Decimal>,
    ),
    wardrobe: farm.wardrobe,
    calendar: farm.calendar,
    vip: farm.vip,
    previousWardrobe: farm.previousWardrobe,
    competitions: farm.competitions,
    verified: farm.verified,
    captcha: farm.captcha,
    stock: Object.keys(farm.stock).reduce(
      (items, item) => ({
        ...items,
        [item]: new Decimal(farm.stock[item]),
      }),
      {} as Record<InventoryItemName, Decimal>,
    ),
    bounties: farm.bounties,
    island: farm.island,
    bank: farm.bank,
    home: farm.home,
    // Interior is a new, entirely separate placement surface. Seed it with an
    // empty ground level for any player coming back from the API who does not
    // yet have this field — the feature is front-end-only for v1 and they opt
    // in by placing items at /interior. We tolerate two legacy shapes:
    //   - `farm.interior` missing entirely → default to a fresh ground level
    //   - `farm.interior.collectibles` from an earlier prototype where data
    //     wasn't yet nested under .ground → migrate it under .ground.
    interior: farm.interior?.ground
      ? farm.interior
      : farm.interior?.collectibles
        ? { ground: { collectibles: farm.interior.collectibles } }
        : { ground: { collectibles: {} } },
    createdAt: farm.createdAt,
    stockExpiry: farm.stockExpiry || {},
    coins: farm.coins,
    balance: new Decimal(farm.balance),
    previousBalance: new Decimal(farm.previousBalance),
    username: farm.username,
    roninRewards: farm.roninRewards,
    settings: farm.settings,
    trades: farm.trades,
    farmHands: farm.farmHands,

    expansionConstruction: farm.expansionConstruction,
    expandedAt: farm.expandedAt,
    greenhouse: farm.greenhouse,
    choreBoard: farm.choreBoard,

    shipments: farm.shipments,
    gems: farm.gems,
    flower: farm.flower,
    bumpkin: farm.bumpkin,
    buildings: makeBuildings(farm.buildings),
    fishing: farm.fishing ?? { wharf: {}, beach: {} },
    crabTraps: farm.crabTraps ?? { trapSpots: {} },
    farmActivity: farm.farmActivity ?? {},
    milestones: farm.milestones ?? {},
    airdrops: farm.airdrops,
    raffle: farm.raffle,
    collectibles: farm.collectibles,
    warCollectionOffer: farm.warCollectionOffer,
    mysteryPrizes: farm.mysteryPrizes,
    pumpkinPlaza: farm.pumpkinPlaza,
    dailyRewards: farm.dailyRewards,
    auctioneer: farm.auctioneer ?? {},
    minigames: farm.minigames,
    kingdomChores: farm.kingdomChores,
    buffs: farm.buffs,
    chores: farm.chores,
    tradedAt: farm.tradedAt,
    trees: farm.trees ?? {},
    stones: farm.stones ?? {},
    iron: farm.iron ?? {},
    gold: farm.gold ?? {},
    crimstones: farm.crimstones ?? {},
    oilReserves: farm.oilReserves ?? {},
    sunstones: farm.sunstones ?? {},
    ascensionCrystals: farm.ascensionCrystals ?? {},
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
    delivery: farm.delivery,
    potionHouse: farm.potionHouse,
    npcs: farm.npcs,
    buds: farm.buds,
    flowerShop: farm.flowerShop,
    specialEvents: farm.specialEvents,
    floatingIsland: farm.floatingIsland,
    megastore: farm.megastore,
    goblinMarket: farm.goblinMarket,
    faction: farm.faction,
    previousFaction: farm.previousFaction,
    dailyFactionDonationRequest: farm.dailyFactionDonationRequest
      ? {
          resource: farm.dailyFactionDonationRequest.resource,
          amount: new Decimal(farm.dailyFactionDonationRequest.amount),
        }
      : undefined,
    desert: farm.desert,
    transaction: farm.transaction,
    henHouse: farm.henHouse,
    barn: farm.barn,
    pigpen: farm.pigpen,
    waterWell: farm.waterWell,
    agingShed: farm.agingShed,
    petHouse: farm.petHouse,
    craftingBox: farm.craftingBox,
    season: farm.season,
    lavaPits: farm.lavaPits,
    nfts: farm.nfts,
    faceRecognition: farm.faceRecognition,
    telegram: farm.telegram,
    discord: farm.discord,
    socialTasks: farm.socialTasks,
    referrals: farm.referrals,
    twitter: farm.twitter,
    ban: farm.ban,
    rewardBoxes: farm.rewardBoxes,
    withdrawals: farm.withdrawals,
    aoe: farm.aoe,
    boostsUsedAt: farm.boostsUsedAt,
    boostHistory: farm.boostHistory,
    socialFarming: farm.socialFarming,
    pets: farm.pets,
    saltFarm: farm.saltFarm ?? { level: 0, nodes: {} },
    sculptures: farm.sculptures,
    tcsAcknowledged: farm.tcsAcknowledged,
  };
}

/**
 * Accepts every shape an API Decimal can take: a string (a serialised
 * Decimal) or the raw `{ s, e, d }` internals that decimal.js-light instances
 * were persisted as when nested in a queue.
 */
function makeDecimal(value: unknown): Decimal {
  if (value instanceof Decimal) return value;

  if (typeof value === "string" || typeof value === "number") {
    return new Decimal(value);
  }

  const raw = value as { s?: unknown; e?: unknown; d?: unknown } | null;
  if (
    raw &&
    typeof raw.s === "number" &&
    typeof raw.e === "number" &&
    Array.isArray(raw.d)
  ) {
    // Restore the internals verbatim - reproduces the original value exactly.
    return Object.assign(new Decimal(0), { s: raw.s, e: raw.e, d: [...raw.d] });
  }

  throw new Error(`Invalid Decimal: ${JSON.stringify(value)}`);
}

/**
 * Fish Market queue requirements are refunded on cancel, so they must be real
 * Decimals rather than whatever shape the API returned them in.
 */
export function makeBuildings(buildings: Buildings = {}): Buildings {
  return Object.fromEntries(
    Object.entries(buildings).map(([name, placed]) => [
      name,
      placed?.map((building) =>
        building.processing
          ? {
              ...building,
              processing: building.processing.map((product) =>
                product.requirements
                  ? {
                      ...product,
                      requirements: Object.fromEntries(
                        Object.entries(product.requirements).map(
                          ([item, amount]) => [item, makeDecimal(amount)],
                        ),
                      ),
                    }
                  : product,
              ),
            }
          : building,
      ),
    ]),
  );
}
