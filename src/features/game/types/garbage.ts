import { BB_TO_GEM_RATIO, Inventory, InventoryItemName } from "./game";
import { CHAPTER_TICKET_NAME, ChapterTicket, CHAPTERS } from "./chapters";
import Decimal from "decimal.js-light";
import { BumpkinItem } from "./bumpkin";
import { getObjectEntries } from "../expansion/lib/utils";
import { ClutterName } from "./clutter";

export type GarbageName =
  | Extract<
      InventoryItemName,
      | "Easter Token 2025"
      | "Block Buck"
      | "War Bond"
      | "Love Letter"
      | "Red Envelope"
      | "Jack-o-lantern"
      | "Blue Egg"
      | "Green Egg"
      | "Orange Egg"
      | "Pink Egg"
      | "Purple Egg"
      | "Red Egg"
      | "Yellow Egg"
      | "Rapid Growth"
      | "Tent"
      | ChapterTicket
      | "Chicken"
      | "Hen House"
      | "Basic Bear"
      | "Water Well"
      | "Community Coin"
      | "Colors Event Token 2025"
      | "Colors Event Ticket 2025"
      | "Easter Ticket 2025"
      | "Halloween Token 2025"
      | "Halloween Ticket 2025"
      | "Holiday Token 2025"
      | "Holiday Ticket 2025"
      | ClutterName
    >
  | Extract<BumpkinItem, "Basic Hair">;

export type Garbage = {
  sellPrice: number;
  gems: number;
  items?: Inventory;
  // The limit is the number that are useful in game, you can't sell more than this
  limit?: number;
};

export const GARBAGE: Record<GarbageName, Garbage> = {
  "Block Buck": {
    sellPrice: 0,
    gems: BB_TO_GEM_RATIO,
  },
  "Jack-o-lantern": {
    sellPrice: 1,
    gems: 0,
  },
  "Love Letter": {
    sellPrice: 1,
    gems: 0,
  },
  "Red Envelope": {
    sellPrice: 1,
    gems: 0,
  },
  "War Bond": {
    sellPrice: 0.1,
    gems: 0,
  },

  "Blue Egg": {
    sellPrice: 1,
    gems: 0,
  },
  "Green Egg": {
    sellPrice: 1,
    gems: 0,
  },
  "Orange Egg": {
    sellPrice: 1,
    gems: 0,
  },
  "Pink Egg": {
    sellPrice: 1,
    gems: 0,
  },
  "Purple Egg": {
    sellPrice: 1,
    gems: 0,
  },
  "Red Egg": {
    sellPrice: 1,
    gems: 0,
  },
  "Yellow Egg": {
    sellPrice: 1,
    gems: 0,
  },
  "Rapid Growth": {
    sellPrice: 160,
    gems: 0,
  },
  Tent: {
    sellPrice: 20,
    gems: 0,
  },
  ...getObjectEntries(CHAPTER_TICKET_NAME).reduce(
    (acc, [season, ticket]) => {
      return {
        ...acc,
        ...(CHAPTERS[season].endDate.getTime() < Date.now()
          ? {
              [ticket]: {
                sellPrice: 0.1,
                gems: 0,
              },
            }
          : {}),
      };
    },
    {} as Record<ChapterTicket, Garbage>,
  ),

  Chicken: {
    sellPrice: 200,
    gems: 0,
  },
  "Hen House": {
    sellPrice: 800,
    gems: 0,
    limit: 1,
    items: {
      Wood: new Decimal(200),
      Iron: new Decimal(15),
      Gold: new Decimal(15),
      Egg: new Decimal(300),
    },
  },
  "Water Well": {
    sellPrice: 320,
    gems: 0,
    limit: 3,
    items: {
      Wood: new Decimal(5),
      Stone: new Decimal(5),
    },
  },
  "Basic Bear": {
    sellPrice: 1,
    gems: 0,
  },
  "Basic Hair": {
    sellPrice: 1,
    gems: 0,
  },
  "Community Coin": {
    sellPrice: 0,
    gems: 0,
    items: { "Love Charm": new Decimal(25) },
  },
  "Easter Token 2025": {
    sellPrice: 1,
    gems: 0,
  },
  "Easter Ticket 2025": {
    sellPrice: 1,
    gems: 0,
  },
  Trash: {
    sellPrice: 3,
    gems: 0,
  },
  Dung: {
    sellPrice: 1,
    gems: 0,
  },
  Weed: {
    sellPrice: 5,
    gems: 0,
  },
  Anthill: {
    sellPrice: 50,
    gems: 0,
  },
  Rat: {
    sellPrice: 50,
    gems: 0,
  },
  Snail: {
    sellPrice: 50,
    gems: 0,
  },
  "Halloween Token 2025": {
    sellPrice: 1,
    gems: 0,
  },
  "Halloween Ticket 2025": {
    sellPrice: 1,
    gems: 0,
  },
  "Holiday Token 2025": {
    sellPrice: 1,
    gems: 0,
  },
  "Holiday Ticket 2025": {
    sellPrice: 1,
    gems: 0,
  },
};
