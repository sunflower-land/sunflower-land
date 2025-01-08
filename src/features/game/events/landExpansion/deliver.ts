import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { CONSUMABLES, COOKABLE_CAKES } from "features/game/types/consumables";
import { getKeys } from "features/game/types/craftables";
import {
  GameState,
  Inventory,
  InventoryItemName,
  NPCData,
  Order,
} from "features/game/types/game";
import { BUMPKIN_GIFTS } from "features/game/types/gifts";
import {
  getCurrentSeason,
  getSeasonalTicket,
} from "features/game/types/seasons";
import { NPCName } from "lib/npcs";
import { getBumpkinHoliday } from "lib/utils/getSeasonWeek";
import { isWearableActive } from "features/game/lib/wearables";
import { FACTION_OUTFITS } from "features/game/lib/factions";
import { PATCH_FRUIT, PatchFruitName } from "features/game/types/fruits";
import { produce } from "immer";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { KNOWN_IDS } from "features/game/types";
import { BumpkinItem } from "features/game/types/bumpkin";
import { availableWardrobe } from "./equip";
import { FISH } from "features/game/types/fishing";
import { hasVipAccess } from "features/game/lib/vipAccess";

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

const isFruit = (name: PatchFruitName) => name in PATCH_FRUIT();

export function generateDeliveryTickets({
  game,
  npc,
  now = new Date(),
}: {
  game: GameState;
  npc: NPCName;
  now?: Date;
}) {
  let amount = TICKET_REWARDS[npc as QuestNPCName];

  if (!amount) {
    return 0;
  }

  if (hasVipAccess({ game, now: now.getTime() })) {
    amount += 2;
  }

  if (
    getCurrentSeason() === "Bull Run" &&
    isWearableActive({ game, name: "Cowboy Hat" })
  ) {
    amount += 1;
  }

  if (
    getCurrentSeason() === "Bull Run" &&
    isWearableActive({ game, name: "Cowboy Shirt" })
  ) {
    amount += 1;
  }

  if (
    getCurrentSeason() === "Bull Run" &&
    isWearableActive({ game, name: "Cowboy Trouser" })
  ) {
    amount += 1;
  }

  const completedAt = game.npcs?.[npc]?.deliveryCompletedAt;

  const dateKey = new Date(now).toISOString().substring(0, 10);

  const hasClaimedBonus =
    !!completedAt &&
    new Date(completedAt).toISOString().substring(0, 10) === dateKey;

  // Leave this at the end as it will multiply the whole amount by 2
  if (game.delivery.doubleDelivery === dateKey && !hasClaimedBonus) {
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

export function getCountAndTypeForDelivery(
  state: GameState,
  name: InventoryItemName | BumpkinItem,
) {
  let count = new Decimal(0);
  let itemType: "wearable" | "inventory" = "inventory";
  if (name in KNOWN_IDS) {
    count =
      name in getChestItems(state)
        ? getChestItems(state)[name as InventoryItemName] ?? new Decimal(0)
        : state.inventory[name as InventoryItemName] ?? new Decimal(0);
  } else {
    count =
      name in availableWardrobe(state)
        ? new Decimal(availableWardrobe(state)[name as BumpkinItem] ?? 0)
        : new Decimal(0);
    itemType = "wearable";
  }

  return { count, itemType };
}

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
): T {
  let mul = 1;

  // Michelin Stars - 5% bonus
  if (game.bumpkin?.skills["Michelin Stars"]) {
    mul += 0.05;
  }

  if (
    order.from === "betty" &&
    game.bumpkin?.skills["Betty's Friend"] &&
    order.reward.coins
  ) {
    mul += 0.3;
  }

  if (
    order.from === "victoria" &&
    game.bumpkin?.skills["Victoria's Secretary"] &&
    order.reward.coins
  ) {
    mul += 0.5;
  }

  if (
    order.from === "blacksmith" &&
    game.bumpkin?.skills["Forge-Ward Profits"] &&
    order.reward.coins
  ) {
    mul += 0.2;
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
    }
  }

  // Fishy Fortune - 50% Coins bonus if Corale NPC
  if (
    game.bumpkin?.skills["Fishy Fortune"] &&
    order.reward.coins &&
    order.from === "corale"
  ) {
    mul += 0.5;
  }

  // Nom Nom - 10% bonus with food orders
  if (game.bumpkin?.skills["Nom Nom"]) {
    const items = getKeys(order.items);
    if (items.some((name) => name in CONSUMABLES && !(name in FISH))) {
      mul += 0.1;
    }
  }

  const items = getKeys(order.items);
  if (
    items.some((name) => name in COOKABLE_CAKES) &&
    isWearableActive({ name: "Chef Apron", game })
  ) {
    mul += 0.2;
  }

  // Apply the faction crown boost if in the right faction
  const factionName = game.faction?.name;
  if (
    factionName &&
    isWearableActive({ game, name: FACTION_OUTFITS[factionName].crown })
  ) {
    mul += 0.25;
  }

  const completedAt = game.npcs?.[order.from]?.deliveryCompletedAt;

  const dateKey = new Date(now).toISOString().substring(0, 10);
  const hasClaimedBonus =
    !!completedAt &&
    new Date(completedAt).toISOString().substring(0, 10) === dateKey;

  // Leave this at the end as it will multiply the whole amount by 2
  if (game.delivery.doubleDelivery === dateKey && !hasClaimedBonus) {
    mul *= 2;
  }

  if (order.reward.sfl) {
    return new Decimal(order.reward.sfl ?? 0).mul(mul) as T;
  }

  return ((order.reward.coins ?? 0) * mul) as T;
}

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

    if (order.completedAt) {
      throw new Error("Order is already completed");
    }

    const { holiday } = getBumpkinHoliday({ now: createdAt });

    const ticketTasksAreFrozen =
      holiday === new Date(createdAt).toISOString().split("T")[0];

    const tickets = generateDeliveryTickets({
      game,
      npc: order.from,
      now: new Date(createdAt),
    });
    const isTicketOrder = tickets > 0;

    if (isTicketOrder && ticketTasksAreFrozen) {
      throw new Error("Ticket tasks are frozen");
    }

    getKeys(order.items).forEach((name) => {
      if (name === "coins") {
        const coins = game.coins;
        const amount = order.items[name] ?? 0;

        if (coins < amount) {
          throw new Error(`Insufficient ingredient: ${name}`);
        }

        game.coins = coins - amount;
      } else if (name === "sfl") {
        const sfl = game.balance;
        const amount = order.items[name] || new Decimal(0);

        if (sfl.lessThan(amount)) {
          throw new Error(`Insufficient ingredient: ${name}`);
        }

        game.balance = sfl.sub(amount);
      } else {
        const { count, itemType } = getCountAndTypeForDelivery(game, name);

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
      const sfl = getOrderSellPrice<Decimal>(game, order, new Date(createdAt));
      game.balance = game.balance.add(sfl);

      bumpkin.activity = trackActivity("SFL Earned", bumpkin.activity, sfl);
    }

    if (order.reward.coins) {
      const coinsReward = getOrderSellPrice<number>(
        game,
        order,
        new Date(createdAt),
      );

      game.coins = game.coins + coinsReward;

      bumpkin.activity = trackActivity(
        "Coins Earned",
        bumpkin.activity,
        new Decimal(coinsReward),
      );
    }

    if (tickets > 0) {
      const seasonalTicket = getSeasonalTicket();

      const count = game.inventory[seasonalTicket] || new Decimal(0);
      const amount = tickets || new Decimal(0);

      game.inventory[seasonalTicket] = count.add(amount);
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
