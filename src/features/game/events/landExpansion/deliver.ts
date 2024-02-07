import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { COOKABLE_CAKES } from "features/game/types/consumables";
import { getKeys } from "features/game/types/craftables";
import { GameState, Inventory, NPCData, Order } from "features/game/types/game";
import { getSeasonalTicket } from "features/game/types/seasons";
import { hasFeatureAccess } from "lib/flags";
import { NPCName } from "lib/npcs";
import { getSeasonChangeover } from "lib/utils/getSeasonWeek";
import cloneDeep from "lodash.clonedeep";
import { isWearableActive } from "features/game/lib/wearables";
import { translate } from "lib/i18n/translate";

export type DeliverOrderAction = {
  type: "order.delivered";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: DeliverOrderAction;
  createdAt?: number;
  farmId?: number;
};

export const BETA_DELIVERY_END_DATE = new Date("2023-08-15");
export const DELIVERY_END_DATE = new Date("2023-08-16");
export function canGenerateDeliveries({
  game,
  now,
}: {
  game: GameState;
  now: number;
}) {
  // Monday 14th August (Beta Testers)
  if (
    !!game.inventory["Beta Pass"] &&
    now >= BETA_DELIVERY_END_DATE.getTime()
  ) {
    return false;
  }

  // Wednesday 16th August
  if (now >= DELIVERY_END_DATE.getTime()) {
    return false;
  }

  return true;
}

export function getTotalSlots(game: GameState) {
  // If feature access then return the total number of slots from both delivery and quest
  // else just delivery

  if (hasFeatureAccess(game, "NEW_DELIVERIES")) {
    return getDeliverySlots(game.inventory) + getQuestSlots(game.inventory);
  }

  return getDeliverySlots(game.inventory);
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
  | "cornwell";

const QUEST_NPC_NAMES = ["pumpkin' pete", "raven", "bert", "timmy", "tywin"];

const DELIVERY_FRIENDSHIP_POINTS = 3;

export function isOfQuestNPCType(value: string): value is QuestNPCName {
  return (QUEST_NPC_NAMES as string[]).includes(value);
}

export function populateOrders(
  game: GameState,
  createdAt: number = Date.now(),
  isSkipped = false
) {
  const orders = game.delivery.orders;
  const slots = getTotalSlots(game);

  while (orders.length < slots) {
    const upcomingOrderTimes = game.delivery.orders.map(
      (order) => order.readyAt
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

const clone = (state: GameState): GameState => {
  return cloneDeep(state);
};

export function getOrderSellPrice(game: GameState, order: Order) {
  let mul = 1;

  if (game.bumpkin?.skills["Michelin Stars"]) {
    mul += 0.05;
  }

  const items = getKeys(order.items);
  if (
    items.some((name) => name in COOKABLE_CAKES) &&
    isWearableActive({ name: "Chef Apron", game })
  ) {
    mul += 0.2;
  }

  return new Decimal(order.reward.sfl ?? 0).mul(mul);
}

export function deliverOrder({
  state,
  action,
  createdAt = Date.now(),
  farmId = 0,
}: Options): GameState {
  const game = clone(state);
  const bumpkin = game.bumpkin;

  if (!bumpkin) {
    throw new Error(translate("no.have.bumpkin"));
  }

  const order = game.delivery.orders.find((order) => order.id === action.id);

  if (!order) {
    throw new Error("Order does not exist");
  }

  if (order.readyAt > Date.now()) {
    throw new Error("Order has not started");
  }

  // If order is complete throw error - TODO: Enable
  // if (order.completedAt) {
  //   throw new Error("Order is already completed");
  // }

  const { tasksAreFrozen } = getSeasonChangeover({
    id: farmId,
    now: createdAt,
  });
  if (tasksAreFrozen) {
    throw new Error("Tasks are frozen");
  }

  getKeys(order.items).forEach((name) => {
    if (name === "sfl") {
      const balance = game.balance;
      const amount = order.items[name] || new Decimal(0);

      if (balance.lessThan(amount)) {
        throw new Error(`Insufficient ingredient: ${name}`);
      }

      game.balance = balance.sub(amount);
    } else {
      const count = game.inventory[name] || new Decimal(0);
      const amount = order.items[name] || new Decimal(0);

      if (count.lessThan(amount)) {
        throw new Error(`Insufficient ingredient: ${name}`);
      }

      game.inventory[name] = count.sub(amount);
    }
  });

  if (order.reward.sfl) {
    const sfl = getOrderSellPrice(game, order);
    game.balance = game.balance.add(sfl);

    bumpkin.activity = trackActivity("SFL Earned", bumpkin.activity, sfl);
  }

  if (order.reward.tickets) {
    const seasonalTicket = getSeasonalTicket();

    const count = game.inventory[seasonalTicket] || new Decimal(0);
    const amount = order.reward.tickets || new Decimal(0);

    game.inventory[seasonalTicket] = count.add(amount);
  }

  game.delivery.fulfilledCount += 1;

  const npcs = game.npcs ?? ({} as Partial<Record<NPCName, NPCData>>);
  const npc = npcs[order.from] ?? ({} as NPCData);
  console.log({ npc });
  const completedDeliveries = npcs[order.from]?.deliveryCount ?? 0;

  npc.deliveryCount = completedDeliveries + 1;
  npc.friendship = {
    updatedAt: createdAt,
    points: (npc.friendship?.points ?? 0) + DELIVERY_FRIENDSHIP_POINTS,
    giftClaimedAtPoints: npc.friendship?.giftClaimedAtPoints ?? 0,
  };

  game.npcs = {
    ...npcs,
    [order.from]: npc,
  };

  // bumpkin.activity = trackActivity(`${order.from} Delivered`, 1);

  const generateMore = canGenerateDeliveries({ game, now: Date.now() });

  if (generateMore) {
    game.delivery.orders = game.delivery.orders.filter(
      (order) => order.id !== action.id
    );

    game.delivery.orders = populateOrders(game, Date.now());
  } else {
    // Mark as complete
    order.completedAt = Date.now();
  }

  console.log({ completed: order.completedAt });

  return game;
}
