import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { CONSUMABLES, COOKABLE_CAKES } from "features/game/types/consumables";
import { getKeys } from "features/game/types/craftables";
import {
  BoostName,
  GameState,
  Inventory,
  InventoryItemName,
  NPCData,
  Order,
} from "features/game/types/game";
import { BUMPKIN_GIFTS } from "features/game/types/gifts";
import {
  getCurrentChapter,
  getChapterTicket,
} from "features/game/types/chapters";
import { NPCName } from "lib/npcs";
import { getBumpkinHoliday } from "lib/utils/getSeasonWeek";
import { isWearableActive } from "features/game/lib/wearables";
import { FACTION_OUTFITS } from "features/game/lib/factions";
import { PATCH_FRUIT, PatchFruitName } from "features/game/types/fruits";
import { produce } from "immer";
import { BumpkinItem } from "features/game/types/bumpkin";
import { FISH } from "features/game/types/fishing";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { getActiveCalendarEvent } from "features/game/types/calendar";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { hasReputation, Reputation } from "features/game/lib/reputation";

import { isCoinNPC, isTicketNPC } from "features/island/delivery/lib/delivery";
import { CHAPTER_TICKET_BOOST_ITEMS } from "./completeNPCChore";
import { isCollectible } from "./garbageSold";
import { getCountAndType } from "features/island/hud/components/inventory/utils/inventory";
import { getChapterTaskPoints } from "features/game/types/tracks";
import { handleChapterAnalytics } from "features/game/lib/trackAnalytics";
import { hasTimeBasedFeatureAccess } from "lib/flags";

export const TICKET_REWARDS: Record<QuestNPCName, number> = {
  "pumpkin' pete": 1,
  bert: 2,
  miranda: 2,
  finley: 2,
  raven: 3,
  finn: 3,
  timmy: 4,
  cornwell: 4,
  tywin: 5,
  jester: 4,
  pharaoh: 5,
};

const isFruit = (name: PatchFruitName) => name in PATCH_FRUIT;

export function generateDeliveryTickets({
  game,
  npc,
  now,
}: {
  game: GameState;
  npc: NPCName;
  now: number;
}) {
  let amount = 0;

  if (isTicketNPC(npc)) {
    amount = TICKET_REWARDS[npc];

    if (hasVipAccess({ game, now })) {
      amount += 2;
    }

    const chapter = getCurrentChapter(now);
    const chapterBoost = CHAPTER_TICKET_BOOST_ITEMS[chapter];

    Object.values(chapterBoost).forEach((item) => {
      if (isCollectible(item)) {
        if (isCollectibleBuilt({ game, name: item })) {
          amount += 1;
        }
      } else {
        if (isWearableActive({ game, name: item })) {
          amount += 1;
        }
      }
    });
  }

  if (!amount) {
    return 0;
  }

  const completedAt = game.npcs?.[npc]?.deliveryCompletedAt;

  const dateKey = new Date(now).toISOString().substring(0, 10);

  const hasClaimedBonus =
    !!completedAt &&
    new Date(completedAt).toISOString().substring(0, 10) === dateKey;

  // Leave this at the end as it will multiply the whole amount by 2
  if (
    getActiveCalendarEvent({ calendar: game.calendar }) === "doubleDelivery" &&
    !hasClaimedBonus
  ) {
    amount *= 2;
  }

  return amount;
}

export type DeliverOrderAction = {
  type: "order.delivered";
  id: string;
  friendship?: boolean; // TEMP
};

type Options = {
  state: Readonly<GameState>;
  action: DeliverOrderAction;
  createdAt?: number;
  farmId?: number;
};

export function getTotalSlots(game: GameState) {
  // If feature access then return the total number of slots from both delivery and quest
  // else just delivery

  return getDeliverySlots(game.inventory) + getQuestSlots(game.inventory);
}

export function getDeliverySlots(inventory: Inventory) {
  if (inventory["Basic Land"]?.gte(12)) {
    return 6;
  }

  if (inventory["Basic Land"]?.gte(8)) {
    return 5;
  }

  if (inventory["Basic Land"]?.gte(5)) {
    return 4;
  }

  return 3;
}

export function getQuestSlots(inventory: Inventory) {
  if (inventory["Basic Land"]?.gte(14)) {
    return 5;
  }

  if (inventory["Basic Land"]?.gte(12)) {
    return 4;
  }

  if (inventory["Basic Land"]?.gte(8)) {
    return 3;
  }

  if (inventory["Basic Land"]?.gte(5)) {
    return 2;
  }

  return 1;
}

export type QuestNPCName =
  | "pumpkin' pete"
  | "bert"
  | "raven"
  | "timmy"
  | "tywin"
  | "cornwell"
  | "finn"
  | "finley"
  | "miranda"
  | "jester"
  | "pharaoh";

// All available quest npcs
export const QUEST_NPC_NAMES: QuestNPCName[] = [
  "pumpkin' pete",
  "bert",
  "raven",
  "timmy",
  "tywin",
  "cornwell",
  "finn",
  "finley",
  "miranda",
];

const DELIVERY_FRIENDSHIP_POINTS = 3;

export function populateOrders(
  game: GameState,
  createdAt: number = Date.now(),
  isSkipped = false,
) {
  const orders = game.delivery.orders;
  const slots = getTotalSlots(game);

  while (orders.length < slots) {
    const upcomingOrderTimes = game.delivery.orders.map(
      (order) => order.readyAt,
    );
    const baseTime = Math.max(...upcomingOrderTimes, createdAt);

    // Orders are generated on backend - use this just to show the next readyAt
    const fakeOrder: Order = {
      createdAt: Date.now(),
      readyAt:
        baseTime + (24 / getDeliverySlots(game.inventory)) * 60 * 60 * 1000,
      from: "betty",
      id: isSkipped ? "skipping" : Date.now().toString(),
      items: {},
      reward: {},
    };

    orders.push(fakeOrder);
  }

  return orders;
}

export function getOrderSellPrice<T>(
  game: GameState,
  order: Order,
  now: Date = new Date(),
): { reward: T; boostsUsed: { name: BoostName; value: string }[] } {
  let mul = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (
    order.from === "betty" &&
    game.bumpkin?.skills["Betty's Friend"] &&
    order.reward.coins
  ) {
    mul += 0.3;
    boostsUsed.push({ name: "Betty's Friend", value: "+30%" });
  }

  if (
    order.from === "victoria" &&
    game.bumpkin?.skills["Victoria's Secretary"] &&
    order.reward.coins
  ) {
    mul += 0.5;
    boostsUsed.push({ name: "Victoria's Secretary", value: "+50%" });
  }

  if (
    order.from === "blacksmith" &&
    game.bumpkin?.skills["Forge-Ward Profits"] &&
    order.reward.coins
  ) {
    mul += 0.2;
    boostsUsed.push({ name: "Forge-Ward Profits", value: "+20%" });
  }

  // Fruity Profit - 50% Coins bonus if fruit
  if (
    game.bumpkin?.skills["Fruity Profit"] &&
    order.reward.coins &&
    order.from === "tango"
  ) {
    const items = getKeys(order.items);
    if (items.some((name) => isFruit(name as PatchFruitName))) {
      mul += 0.5;
      boostsUsed.push({ name: "Fruity Profit", value: "+50%" });
    }
  }

  // Fishy Fortune - 50% Coins bonus if Corale NPC
  if (
    game.bumpkin?.skills["Fishy Fortune"] &&
    order.reward.coins &&
    order.from === "corale"
  ) {
    mul += 1;
    boostsUsed.push({ name: "Fishy Fortune", value: "+100%" });
  }

  // Nom Nom - 10% bonus with food orders
  if (game.bumpkin?.skills["Nom Nom"]) {
    const items = getKeys(order.items);
    if (items.some((name) => name in CONSUMABLES && !(name in FISH))) {
      mul += 0.1;
      boostsUsed.push({ name: "Nom Nom", value: "+10%" });
    }
  }

  const items = getKeys(order.items);
  if (
    items.some((name) => name in COOKABLE_CAKES) &&
    isWearableActive({ name: "Chef Apron", game })
  ) {
    mul += 0.2;
    boostsUsed.push({ name: "Chef Apron", value: "+20%" });
  }

  // Apply the faction crown boost if in the right faction
  const factionName = game.faction?.name;
  if (
    factionName &&
    isWearableActive({ game, name: FACTION_OUTFITS[factionName].crown })
  ) {
    mul += 0.25;
    boostsUsed.push({
      name: FACTION_OUTFITS[factionName].crown,
      value: "+25%",
    });
  }

  const completedAt = game.npcs?.[order.from]?.deliveryCompletedAt;

  const dateKey = new Date(now).toISOString().substring(0, 10);
  const hasClaimedBonus =
    !!completedAt &&
    new Date(completedAt).toISOString().substring(0, 10) === dateKey;

  // Leave this at the end as it will multiply the whole amount by 2
  if (
    getActiveCalendarEvent({ calendar: game.calendar }) === "doubleDelivery" &&
    !hasClaimedBonus
  ) {
    mul *= 2;
  }

  if (order.reward.sfl) {
    return {
      reward: new Decimal(order.reward.sfl ?? 0).mul(mul) as T,
      boostsUsed,
    };
  }

  return {
    reward: ((order.reward.coins ?? 0) * mul) as T,
    boostsUsed,
  };
}

export const GOBLINS_REQUIRING_REPUTATION: NPCName[] = [
  "grimtooth",
  "grubnuk",
  "gordo",
  "guria",
  "gambit",
];

export const areBumpkinsOnHoliday = (timestamp: number) => {
  const { holiday } = getBumpkinHoliday({ now: timestamp });
  return holiday === new Date(timestamp).toISOString().split("T")[0];
};

export function deliverOrder({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const bumpkin = game.bumpkin;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const order = game.delivery.orders.find((order) => order.id === action.id);

    if (!order) {
      throw new Error("Order does not exist");
    }

    if (order.readyAt > createdAt) {
      throw new Error("Order has not started");
    }

    const hasCropkeeperReputation = hasReputation({
      game,
      reputation: Reputation.Cropkeeper,
    });

    const requiresReputation = GOBLINS_REQUIRING_REPUTATION.includes(
      order.from,
    );

    if (requiresReputation && !hasCropkeeperReputation) {
      throw new Error("You do not have the required reputation");
    }

    if (order.completedAt) {
      throw new Error("Order is already completed");
    }

    const ticketTasksAreFrozen = areBumpkinsOnHoliday(createdAt);

    const isQuestTicketOrder = !!TICKET_REWARDS[order.from as QuestNPCName];

    const tickets = generateDeliveryTickets({
      game,
      npc: order.from,
      now: createdAt,
    });
    const isTicketOrder = tickets > 0;

    // Quest ticket deliveries are blocked during freeze.
    // Coin deliveries can still be completed but award 0 tickets during freeze.
    if (isQuestTicketOrder && isTicketOrder && ticketTasksAreFrozen) {
      throw new Error("Ticket tasks are frozen");
    }

    const ticketsToAward =
      !isQuestTicketOrder && ticketTasksAreFrozen ? 0 : tickets;

    getKeys(order.items).forEach((name) => {
      if (name === "coins") {
        const coins = game.coins;
        const amount = order.items[name] ?? 0;

        if (coins < amount) {
          throw new Error(`Insufficient ingredient: ${name}`);
        }

        game.coins = coins - amount;

        game.farmActivity = trackFarmActivity(
          "Coins Spent",
          game.farmActivity,
          new Decimal(amount),
        );
      } else if (name === "sfl") {
        const sfl = game.balance;
        const amount = order.items[name] || new Decimal(0);

        if (sfl.lessThan(amount)) {
          throw new Error(`Insufficient ingredient: ${name}`);
        }

        game.balance = sfl.sub(amount);
      } else {
        const { count, itemType } = getCountAndType(game, name);

        const amount = order.items[name] || 0;

        if (count.lessThan(amount)) {
          throw new Error(`Insufficient ingredient: ${name}`);
        }

        if (itemType === "inventory") {
          game.inventory[name as InventoryItemName] = (
            game.inventory[name as InventoryItemName] ?? new Decimal(0)
          ).sub(amount);
        } else {
          game.wardrobe[name as BumpkinItem] =
            (game.wardrobe[name as BumpkinItem] ?? 0) - amount;
        }
      }
    });

    if (order.reward.sfl) {
      const { reward: sfl } = getOrderSellPrice<Decimal>(
        game,
        order,
        new Date(createdAt),
      );
      game.balance = game.balance.add(sfl);

      game.farmActivity = trackFarmActivity(
        "SFL Earned",
        game.farmActivity,
        sfl,
      );
      game.farmActivity = trackFarmActivity(
        "FLOWER Order Delivered",
        game.farmActivity,
      );
    }
    const chapter = getCurrentChapter(createdAt);

    if (order.reward.coins) {
      const { reward: coinsReward } = getOrderSellPrice<number>(
        game,
        order,
        new Date(createdAt),
      );

      game.coins = game.coins + coinsReward;

      game.farmActivity = trackFarmActivity(
        "Coins Earned",
        game.farmActivity,
        new Decimal(coinsReward),
      );
      game.farmActivity = trackFarmActivity(
        "Coins Order Delivered",
        game.farmActivity,
      );

      // Take the timestamp of the order
      const coinCreatedAt = order.createdAt;
      const isCoinTasksFrozen = areBumpkinsOnHoliday(coinCreatedAt);

      if (
        isCoinNPC(order.from) &&
        hasTimeBasedFeatureAccess("TICKETS_FROM_COIN_NPC", coinCreatedAt) &&
        !isCoinTasksFrozen
      ) {
        const coinChapter = getCurrentChapter(coinCreatedAt);

        handleChapterAnalytics({
          task: "coinDelivery",
          points: 10,
          farmActivity: game.farmActivity,
          createdAt: coinCreatedAt,
        });

        game.farmActivity = trackFarmActivity(
          `${coinChapter} Points Earned`,
          game.farmActivity,
          new Decimal(
            getChapterTaskPoints({ task: "coinDelivery", points: 10 }),
          ),
        );
      }
    }

    if (ticketsToAward > 0) {
      const chapterTicket = getChapterTicket(createdAt);
      const deliveryTask = "delivery";
      const pointsAwarded = getChapterTaskPoints({
        task: deliveryTask,
        points: ticketsToAward,
      });
      handleChapterAnalytics({
        task: deliveryTask,
        points: ticketsToAward,
        farmActivity: game.farmActivity,
        createdAt,
      });

      const count = game.inventory[chapterTicket] || new Decimal(0);
      const amount = ticketsToAward || new Decimal(0);

      game.inventory[chapterTicket] = count.add(amount);
      game.farmActivity = trackFarmActivity(
        "Ticket Order Delivered",
        game.farmActivity,
      );
      game.farmActivity = trackFarmActivity(
        `${chapterTicket} Collected`,
        game.farmActivity,
        new Decimal(amount),
      );
      game.farmActivity = trackFarmActivity(
        `${chapter} Points Earned`,
        game.farmActivity,
        new Decimal(pointsAwarded),
      );
    }

    const rewardItems = order.reward.items ?? {};

    if (Object.keys(rewardItems).length > 0) {
      getKeys(rewardItems).forEach((name) => {
        const previousAmount = game.inventory[name] || new Decimal(0);

        game.inventory[name] = previousAmount.add(rewardItems[name] || 0);
      });
    }

    game.delivery.fulfilledCount += 1;

    const npcs = game.npcs ?? ({} as Partial<Record<NPCName, NPCData>>);
    const npc = npcs[order.from] ?? ({} as NPCData);
    const completedDeliveries = npcs[order.from]?.deliveryCount ?? 0;

    npc.deliveryCount = completedDeliveries + 1;

    if (action.friendship && BUMPKIN_GIFTS[order.from]) {
      npc.friendship = {
        updatedAt: createdAt,
        points: (npc.friendship?.points ?? 0) + DELIVERY_FRIENDSHIP_POINTS,
        giftClaimedAtPoints: npc.friendship?.giftClaimedAtPoints ?? 0,
        giftedAt: npc.friendship?.giftedAt,
      };
    }

    game.npcs = {
      ...npcs,
      [order.from]: npc,
    };

    // bumpkin.activity = trackActivity(`${order.from} Delivered`, 1);

    // Mark as complete
    order.completedAt = Date.now();

    return game;
  });
}
