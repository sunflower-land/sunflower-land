import type { BumpkinItem } from "./bumpkin";
import type { InventoryItemName } from "./game";
import type { MinigameName } from "./minigames";
import { isEventShopCollectible, MINIGAME_SHOP_ITEMS } from "./minigameShop";
import { getValues } from "lib/object";

export type EventCollectionName =
  | "Halloween 2026"
  | "Colors 2026"
  | "April Fools 2026"
  | "Holiday 2025"
  | "Halloween 2025"
  | "Festival of Colors 2025"
  | "Easter 2025";

type EventCollection = {
  /** The event's shop in MINIGAME_SHOP_ITEMS */
  minigame: MinigameName;
  /** Shown as the collection icon */
  token: InventoryItemName;
  /** The event's raffle ticket - sold in the shop but not a collectible */
  ticket: InventoryItemName;
  /** Event rewards that were never sold in the event shop */
  extras?: {
    collectibles?: InventoryItemName[];
    wearables?: BumpkinItem[];
  };
};

/** Sold in every event shop, so they don't belong to any one event */
const SHARED_SHOP_ITEMS: InventoryItemName[] = [
  "Treasure Key",
  "Rare Key",
  "Luxury Key",
  "Super Totem",
];

/**
 * Event collections, newest first. When adding an event:
 * 1. Add its shop to MINIGAME_SHOP_ITEMS.
 * 2. Add an entry here with its token, ticket and any rewards given outside the shop.
 */
export const EVENT_COLLECTIONS: Record<EventCollectionName, EventCollection> = {
  "Halloween 2026": {
    minigame: "halloween-2026-game-2",
    token: "Halloween Token 2026",
    ticket: "Halloween Ticket 2026",
    extras: {
      collectibles: [
        "Corrupted Pumpkin",
        "King Crow",
        "Devil Crow",
        "Pharaoh Crow",
        "Cultist Crow",
      ],
    },
  },
  "Colors 2026": {
    minigame: "colors-2026",
    token: "Colors Token 2026",
    ticket: "Colors Ticket 2026",
    extras: {
      collectibles: [
        "Golden Slime Trophy",
        "Silver Slime Trophy",
        "Bronze Slime Trophy",
        "Fool's Gold",
      ],
    },
  },
  "April Fools 2026": {
    minigame: "april-fools",
    token: "April Fools Token 2026",
    ticket: "April Fools Ticket 2026",
    extras: {
      collectibles: [
        "Bumpkin Rug",
        "Goblin Rug",
        "Pet Rug",
        "Jester in a box",
        "The Sunflower Man Statue",
      ],
    },
  },
  "Holiday 2025": {
    minigame: "holiday-puzzle-2025",
    token: "Holiday Token 2025",
    ticket: "Holiday Ticket 2025",
  },
  "Halloween 2025": {
    minigame: "halloween",
    token: "Halloween Token 2025",
    ticket: "Halloween Ticket 2025",
  },
  "Festival of Colors 2025": {
    minigame: "festival-of-colors-2025",
    token: "Colors Token 2025",
    ticket: "Colors Ticket 2025",
  },
  "Easter 2025": {
    minigame: "easter-eggstravaganza",
    token: "Easter Token 2025",
    ticket: "Easter Ticket 2025",
    extras: { collectibles: ["Easter Basket"] },
  },
};

export function getEventCollectionForDisplay(event: EventCollectionName): {
  collectibles: InventoryItemName[];
  wearables: BumpkinItem[];
} {
  const { minigame, ticket, extras } = EVENT_COLLECTIONS[event];
  const excluded: InventoryItemName[] = [...SHARED_SHOP_ITEMS, ticket];

  const collectibles: InventoryItemName[] = [];
  const wearables: BumpkinItem[] = [];

  getValues(MINIGAME_SHOP_ITEMS[minigame] ?? {}).forEach((item) => {
    if (!item) return;

    if (!isEventShopCollectible(item)) {
      wearables.push(item.name);
    } else if (!excluded.includes(item.name)) {
      collectibles.push(item.name);
    }
  });

  collectibles.push(...(extras?.collectibles ?? []));
  wearables.push(...(extras?.wearables ?? []));

  return { collectibles, wearables };
}
