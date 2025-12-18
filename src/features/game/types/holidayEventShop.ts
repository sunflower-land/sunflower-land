import { FlowerBox } from "../events/landExpansion/buyChapterItem";
import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";
import { HOLIDAY_STORE } from "./minigameShop";

export type EventTierItemName =
  | EventCollectibleName
  | EventWearableName
  | MegastoreKeys;

export type EventCollectibleName =
  // Holiday Event
  | "Super Totem"
  | "Treasure Key"
  | "Rare Key"
  | "Luxury Key"
  | "Holiday Ticket 2025"
  | "Holiday Decorative Totem"
  | "Red Holiday Ornament"
  | "Green Holiday Ornament"
  | "Gift Turtle"
  | "Red Nose Reindeer"
  | "Tuxedo Claus"
  | "Winter Alpaca"
  | "Penguin Surprise"
  | "Frozen Meat"
  | "Ho Ho oh oh..."
  | "Festive Tree";

export type EventWearableName = Extract<
  BumpkinItem,
  // Holiday Event
  | "Comfy Xmas Sweater"
  | "Comfy Xmas Pants"
  | "Candy Halbred"
  | "Xmas Top Hat"
  | "Reindeer Mask"
  | "Snowman Mask"
  | "Cool Glasses"
  | "Cookie Shield"
  | "Holiday Feast Background"
  | "Cozy Reindeer Onesie"
  | "Diamond Snow Aura"
>;

export type MegastoreKeys = "Treasure Key" | "Rare Key" | "Luxury Key";

type EventStoreBase = {
  cost: {
    items: Partial<Record<InventoryItemName, number>>;
    sfl: number;
  };
  cooldownMs?: number;
};

export type EventStoreWearable = EventStoreBase & {
  wearable: EventWearableName;
};
export type EventStoreCollectible = EventStoreBase & {
  collectible: EventCollectibleName | MegastoreKeys | FlowerBox;
};

export type EventStoreItem = EventStoreWearable | EventStoreCollectible;

export type EventStore = {
  basic: {
    items: EventStoreItem[];
  };
  rare: {
    items: EventStoreItem[];
    requirement: number;
  };
  epic: {
    items: EventStoreItem[];
    requirement: number;
  };
  mega: {
    items: EventStoreItem[];
    requirement: number;
  };
};

export type EventStoreTier = keyof EventStore;

export const HOLIDAY_EVENT_ITEMS: EventStore = {
  basic: {
    items: [
      {
        collectible: "Festive Tree",
        cost: HOLIDAY_STORE["Festive Tree"].cost,
      },
      {
        wearable: "Xmas Top Hat",
        cost: HOLIDAY_STORE["Xmas Top Hat"].cost,
      },
      {
        wearable: "Cool Glasses",
        cost: HOLIDAY_STORE["Cool Glasses"].cost,
      },
      { collectible: "Treasure Key", cost: HOLIDAY_STORE["Treasure Key"].cost },
      {
        collectible: "Holiday Ticket 2025",
        cost: HOLIDAY_STORE["Holiday Ticket 2025"].cost,
      },
      {
        collectible: "Green Holiday Ornament",
        cost: HOLIDAY_STORE["Green Holiday Ornament"].cost,
      },
      {
        collectible: "Winter Alpaca",
        cost: HOLIDAY_STORE["Winter Alpaca"].cost,
      },
      { collectible: "Frozen Meat", cost: HOLIDAY_STORE["Frozen Meat"].cost },
    ],
  },
  rare: {
    items: [
      {
        collectible: "Holiday Decorative Totem",
        cost: HOLIDAY_STORE["Holiday Decorative Totem"].cost,
      },
      {
        wearable: "Holiday Feast Background",
        cost: HOLIDAY_STORE["Holiday Feast Background"].cost,
      },
      { collectible: "Rare Key", cost: HOLIDAY_STORE["Rare Key"].cost },
      {
        collectible: "Red Holiday Ornament",
        cost: HOLIDAY_STORE["Red Holiday Ornament"].cost,
      },
      {
        wearable: "Comfy Xmas Pants",
        cost: HOLIDAY_STORE["Comfy Xmas Pants"].cost,
      },
      { collectible: "Gift Turtle", cost: HOLIDAY_STORE["Gift Turtle"].cost },
      {
        collectible: "Red Nose Reindeer",
        cost: HOLIDAY_STORE["Red Nose Reindeer"].cost,
      },
    ],
    requirement: 4,
  },
  epic: {
    items: [
      { collectible: "Tuxedo Claus", cost: HOLIDAY_STORE["Tuxedo Claus"].cost },
      { collectible: "Luxury Key", cost: HOLIDAY_STORE["Luxury Key"].cost },
      {
        collectible: "Penguin Surprise",
        cost: HOLIDAY_STORE["Penguin Surprise"].cost,
      },
      {
        wearable: "Cozy Reindeer Onesie",
        cost: HOLIDAY_STORE["Cozy Reindeer Onesie"].cost,
      },
      {
        collectible: "Ho Ho oh oh...",
        cost: HOLIDAY_STORE["Ho Ho oh oh..."].cost,
      },
      {
        wearable: "Cookie Shield",
        cost: HOLIDAY_STORE["Cookie Shield"].cost,
      },
      {
        wearable: "Candy Halbred",
        cost: HOLIDAY_STORE["Candy Halbred"].cost,
      },
      {
        wearable: "Comfy Xmas Sweater",
        cost: HOLIDAY_STORE["Comfy Xmas Sweater"].cost,
      },
    ],
    requirement: 8,
  },
  mega: {
    items: [
      {
        wearable: "Reindeer Mask",
        cost: HOLIDAY_STORE["Reindeer Mask"].cost,
      },
      {
        wearable: "Snowman Mask",
        cost: HOLIDAY_STORE["Snowman Mask"].cost,
      },
      {
        collectible: "Super Totem",
        cost: HOLIDAY_STORE["Super Totem"].cost,
      },
      {
        wearable: "Diamond Snow Aura",
        cost: HOLIDAY_STORE["Diamond Snow Aura"].cost,
      },
    ],
    requirement: 12,
  },
};
