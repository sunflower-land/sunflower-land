import { FlowerBox } from "../events/landExpansion/buySeasonalItem";
import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";
import { MINIGAME_SHOP_ITEMS } from "./minigameShop";

export type EventTierItemName =
  | EventCollectibleName
  | EventWearableName
  | MegastoreKeys;

export type EventCollectibleName =
  // Festival of Colors
  | "Floating Toy"
  | "Paint Buckets"
  | "Rainbow Well"
  | "Rainbow Flower"
  | "Pony Toy"
  | "Red Slime Balloon"
  | "Blue Slime Balloon"
  | "Colors Ticket 2025"
  | "Super Totem"
  | "Treasure Key"
  | "Rare Key"
  | "Luxury Key";

export type EventWearableName = Extract<
  BumpkinItem,
  // Festival of Colors
  | "Paint Splattered Hair"
  | "Paint Splattered Shirt"
  | "Paint Splattered Overalls"
  | "Paint Spray Can"
  | "Slime Hat"
  | "Slime Wings"
  | "Slime Aura"
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

const SHOP = MINIGAME_SHOP_ITEMS["festival-of-colors-2025"]!;

export const COLORS_EVENT_ITEMS: EventStore = {
  basic: {
    items: [
      {
        collectible: "Floating Toy",
        cost: SHOP["Floating Toy"]!.cost,
      },
      {
        wearable: "Paint Splattered Hair",
        cost: SHOP["Paint Splattered Hair"]!.cost,
      },
      {
        wearable: "Paint Splattered Shirt",
        // TODO the rest here
        cost: { sfl: 0, items: { "Colors Token 2025": 250 } },
      },
      {
        collectible: "Treasure Key",
        cost: { sfl: 0, items: { "Colors Token 2025": 300 } },
      },
      {
        collectible: "Colors Ticket 2025",
        cooldownMs: 1000,
        cost: { sfl: 0, items: { "Colors Token 2025": 150 } },
      },
    ],
  },
  rare: {
    items: [
      {
        collectible: "Pony Toy",
        cost: { sfl: 40, items: {} },
      },
      {
        wearable: "Slime Hat",
        cost: { sfl: 50, items: {} },
      },
      {
        wearable: "Paint Splattered Overalls",
        cost: { sfl: 0, items: { "Colors Token 2025": 350 } },
      },
      {
        wearable: "Paint Spray Can",
        cost: { sfl: 0, items: { "Colors Token 2025": 450 } },
      },
      {
        collectible: "Paint Buckets",
        cost: { sfl: 0, items: { "Colors Token 2025": 250 } },
      },
      {
        collectible: "Rare Key",
        cost: { sfl: 0, items: { "Colors Token 2025": 500 } },
      },
    ],
    requirement: 4,
  },
  epic: {
    items: [
      {
        collectible: "Red Slime Balloon",
        cost: { sfl: 60, items: {} },
      },
      {
        wearable: "Slime Wings",
        cost: { sfl: 200, items: {} },
      },
      {
        collectible: "Rainbow Well",
        cost: { sfl: 0, items: { "Colors Token 2025": 500 } },
      },
      {
        collectible: "Blue Slime Balloon",
        cost: { sfl: 0, items: { "Colors Token 2025": 750 } },
      },
      {
        collectible: "Rainbow Flower",
        cost: { sfl: 0, items: { "Colors Token 2025": 1000 } },
      },
      {
        collectible: "Luxury Key",
        cost: { sfl: 0, items: { "Colors Token 2025": 1000 } },
      },
    ],
    requirement: 4,
  },
  mega: {
    items: [
      {
        collectible: "Super Totem",
        cost: { sfl: 0, items: { "Colors Token 2025": 2500 } },
      },
      {
        wearable: "Slime Aura",
        cost: { sfl: 500, items: {} },
      },
    ],
    requirement: 4,
  },
};
