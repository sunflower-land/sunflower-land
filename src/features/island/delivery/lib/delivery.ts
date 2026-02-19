import {
  QuestNPCName,
  TICKET_REWARDS,
} from "features/game/events/landExpansion/deliver";
import { Delivery } from "features/game/types/game";
import { translate } from "lib/i18n/translate";

export type DeliveryMessage = { from: DeliveryNpcName; id: string };

const GOBLIN_MESSAGES = [
  translate("goblinMessages.msg1"),
  translate("goblinMessages.msg2"),
  translate("goblinMessages.msg3"),
  translate("goblinMessages.msg4"),
  translate("goblinMessages.msg5"),
  translate("goblinMessages.msg6"),
  translate("goblinMessages.msg7"),
  translate("goblinMessages.msg8"),
  translate("goblinMessages.msg9"),
  translate("goblinMessages.msg10"),
];

export type TicketNPCName =
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

export type GoblinNPCName =
  | "grimbly"
  | "grimtooth"
  | "grubnuk"
  | "gordo"
  | "guria"
  | "gambit";

export type CoinNPCName =
  | "betty"
  | "peggy"
  | "tango"
  | "corale"
  | "blacksmith"
  | "victoria"
  | "old salty";

export type DeliveryNpcName = TicketNPCName | GoblinNPCName | CoinNPCName;

export const COIN_NPC_NAMES: CoinNPCName[] = [
  "betty",
  "corale",
  "blacksmith",
  "tango",
  "victoria",
  "peggy",
  "old salty",
];

export function isCoinNPC(value: string): value is CoinNPCName {
  return (COIN_NPC_NAMES as string[]).includes(value);
}

export const GOBLIN_NPC_NAMES: GoblinNPCName[] = [
  "grimbly",
  "grimtooth",
  "grubnuk",
  "gordo",
  "guria",
  "gambit",
];

export function isSFLNPC(value: string): value is GoblinNPCName {
  return (GOBLIN_NPC_NAMES as string[]).includes(value);
}

export function isTicketNPC(value: string): value is QuestNPCName {
  return !!TICKET_REWARDS[value as QuestNPCName];
}

export function getCoinDeliveryTickets(coins: number): number {
  if (coins > 0 && coins < 1000) return 1;
  if (coins >= 1000 && coins < 5000) return 2;
  if (coins >= 5000) return 3;
  return 0;
}

const NPC_MESSAGES: Record<DeliveryNpcName, string[]> = {
  betty: [
    translate("npcMessages.betty.msg1"),
    translate("npcMessages.betty.msg2"),
    translate("npcMessages.betty.msg3"),
    translate("npcMessages.betty.msg4"),
    translate("npcMessages.betty.msg5"),
    translate("npcMessages.betty.msg6"),
    translate("npcMessages.betty.msg7"),
  ],
  blacksmith: [
    translate("npcMessages.blacksmith.msg1"),
    translate("npcMessages.blacksmith.msg2"),
    translate("npcMessages.blacksmith.msg3"),
    translate("npcMessages.blacksmith.msg4"),
    translate("npcMessages.blacksmith.msg5"),
    translate("npcMessages.blacksmith.msg6"),
    translate("npcMessages.blacksmith.msg7"),
  ],
  grubnuk: GOBLIN_MESSAGES,
  grimbly: GOBLIN_MESSAGES,
  grimtooth: GOBLIN_MESSAGES,
  gambit: GOBLIN_MESSAGES,
  gordo: GOBLIN_MESSAGES,
  guria: GOBLIN_MESSAGES,
  "pumpkin' pete": [
    translate("npcMessages.pumpkinpete.msg1"),
    translate("npcMessages.pumpkinpete.msg2"),
    translate("npcMessages.pumpkinpete.msg3"),
    translate("npcMessages.pumpkinpete.msg4"),
    translate("npcMessages.pumpkinpete.msg5"),
    translate("npcMessages.pumpkinpete.msg6"),
    translate("npcMessages.pumpkinpete.msg7"),
  ],
  cornwell: [
    translate("npcMessages.cornwell.msg1"),
    translate("npcMessages.cornwell.msg2"),
    translate("npcMessages.cornwell.msg3"),
    translate("npcMessages.cornwell.msg4"),
    translate("npcMessages.cornwell.msg5"),
    translate("npcMessages.cornwell.msg6"),
    translate("npcMessages.cornwell.msg7"),
  ],
  raven: [
    translate("npcMessages.raven.msg1"),
    translate("npcMessages.raven.msg2"),
    translate("npcMessages.raven.msg3"),
    translate("npcMessages.raven.msg4"),
    translate("npcMessages.raven.msg5"),
    translate("npcMessages.raven.msg6"),
    translate("npcMessages.raven.msg7"),
  ],
  bert: [
    translate("npcMessages.bert.msg1"),
    translate("npcMessages.bert.msg2"),
    translate("npcMessages.bert.msg3"),
    translate("npcMessages.bert.msg4"),
    translate("npcMessages.bert.msg5"),
    translate("npcMessages.bert.msg6"),
    translate("npcMessages.bert.msg7"),
  ],
  timmy: [
    translate("npcMessages.timmy.msg1"),
    translate("npcMessages.timmy.msg2"),
    translate("npcMessages.timmy.msg3"),
    translate("npcMessages.timmy.msg4"),
    translate("npcMessages.timmy.msg5"),
    translate("npcMessages.timmy.msg6"),
    translate("npcMessages.timmy.msg7"),
  ],
  tywin: [
    translate("npcMessages.tywin.msg1"),
    translate("npcMessages.tywin.msg2"),
    translate("npcMessages.tywin.msg3"),
    translate("npcMessages.tywin.msg4"),
    translate("npcMessages.tywin.msg5"),
    translate("npcMessages.tywin.msg6"),
    translate("npcMessages.tywin.msg7"),
  ],
  tango: [
    translate("npcMessages.tango.msg1"),
    translate("npcMessages.tango.msg2"),
    translate("npcMessages.tango.msg3"),
    translate("npcMessages.tango.msg4"),
    translate("npcMessages.tango.msg5"),
    translate("npcMessages.tango.msg6"),
    translate("npcMessages.tango.msg7"),
    "Keep my bananas away from the sea! Those fish are not as innocent as they sound.",
  ],
  miranda: [
    translate("npcMessages.miranda.msg1"),
    translate("npcMessages.miranda.msg2"),
    translate("npcMessages.miranda.msg3"),
    translate("npcMessages.miranda.msg4"),
    translate("npcMessages.miranda.msg5"),
    translate("npcMessages.miranda.msg6"),
    translate("npcMessages.miranda.msg7"),
  ],
  finn: [
    translate("npcMessages.finn.msg1"),
    translate("npcMessages.finn.msg2"),
    translate("npcMessages.finn.msg3"),
    translate("npcMessages.finn.msg4"),
    translate("npcMessages.finn.msg5"),
    translate("npcMessages.finn.msg6"),
    translate("npcMessages.finn.msg7"),
    translate("npcMessages.finn.msg8"),
    "Caught the biggest fish ever. It's not just a story; it's reality!",
  ],
  finley: [
    translate("npcMessages.findley.msg1"),
    translate("npcMessages.findley.msg2"),
    translate("npcMessages.findley.msg3"),
    translate("npcMessages.findley.msg4"),
    translate("npcMessages.findley.msg5"),
    translate("npcMessages.findley.msg6"),
    translate("npcMessages.findley.msg7"),
    translate("npcMessages.findley.msg8"),
    translate("npcMessages.findley.msg9"),
  ],
  corale: [
    translate("npcMessages.corale.msg1"),
    translate("npcMessages.corale.msg2"),
    translate("npcMessages.corale.msg3"),
    translate("npcMessages.corale.msg4"),
    translate("npcMessages.corale.msg5"),
    translate("npcMessages.corale.msg6"),
    translate("npcMessages.corale.msg7"),
    "Seaweed is like a gourmet treat for Parrotfish",
  ],
  jester: [translate("npcMessages.betty.msg1")],
  peggy: [translate("npcMessages.betty.msg1")],
  victoria: [translate("npcMessages.betty.msg1")],
  "old salty": [
    translate("npcMessages.oldSalty.msg1"),
    translate("npcMessages.oldSalty.msg2"),
    translate("npcMessages.oldSalty.msg3"),
    translate("npcMessages.oldSalty.msg4"),
    translate("npcMessages.oldSalty.msg5"),
    translate("npcMessages.oldSalty.msg6"),
    translate("npcMessages.oldSalty.msg7"),
  ],
  pharaoh: [
    translate("npcMessages.pharaoh.msg1"),
    translate("npcMessages.pharaoh.msg2"),
    translate("npcMessages.pharaoh.msg3"),
    translate("npcMessages.pharaoh.msg4"),
    translate("npcMessages.pharaoh.msg5"),
    translate("npcMessages.pharaoh.msg6"),
    translate("npcMessages.pharaoh.msg7"),
  ],
};

export function generateDeliveryMessage({ from, id }: DeliveryMessage) {
  // Default to the Goblin food messages if no matches
  const messages = NPC_MESSAGES[from] ?? GOBLIN_MESSAGES;

  // Calculate a consistent number between 1 & 10 based on the ID
  const index = parseInt(id.slice(-2), 16) % messages.length;

  return messages[index];
}

export function hasNewOrders(delivery: Delivery) {
  const acknowledged = localStorage.getItem(`orders.read`);

  const orders: string[] = acknowledged ? JSON.parse(acknowledged) : [];

  const currentIds = delivery.orders
    .filter((o) => o.readyAt <= Date.now())
    .map((o) => o.id);

  return currentIds.some((id) => !orders.includes(id));
}

export function acknowledgeOrders(delivery: Delivery) {
  const ids = delivery.orders
    .filter((o) => o.readyAt <= Date.now())
    .map((o) => o.id);

  localStorage.setItem(`orders.read`, JSON.stringify(ids));
}

export const NPC_DELIVERY_LEVELS: Record<DeliveryNpcName, number> = {
  // Coins
  betty: 1,
  blacksmith: 1,
  peggy: 3,
  corale: 7,
  tango: 13,
  "old salty": 15,
  victoria: 30,

  // FLOWER
  grimbly: 10,
  grimtooth: 12,
  grubnuk: 16,
  gambit: 25,
  gordo: 30,
  guria: 40,

  // Tickets
  "pumpkin' pete": 5,
  bert: 8,
  finley: 12,
  raven: 14,
  miranda: 15,
  finn: 16,
  pharaoh: 17,
  cornwell: 18,
  timmy: 20,
  tywin: 22,
  jester: 26,
};
