import { FlowerBox } from "../events/landExpansion/buySeasonalItem";
import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";
import { SeasonName } from "./seasons";

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
  | "Red Slime Baloon"
  | "Blue Slime Baloon"
  | "Colors Ticket 2025"
  | "Super Totem";

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

const EMPTY_EVENT_STORE: EventStore = {
  basic: {
    items: [],
  },
  rare: {
    items: [],
    requirement: 0,
  },
  epic: {
    items: [],
    requirement: 0,
  },
  mega: {
    items: [],
    requirement: 0,
  },
};

const COLORS_EVENT_ITEMS: EventStore = {
  basic: {
    items: [
      {
        collectible: "Floating Toy",
        cost: { sfl: 20, items: {} },
      },
      {
        wearable: "Paint Splattered Hair",
        cost: { sfl: 0, items: { "Colors Token 2025": 100 } },
      },
      {
        wearable: "Paint Splattered Shirt",
        cost: { sfl: 0, items: { "Colors Token 2025": 150 } },
      },
      {
        collectible: "Treasure Key",
        cost: { sfl: 0, items: { "Colors Token 2025": 250 } },
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
        cost: { sfl: 0, items: { "Colors Token 2025": 200 } },
      },
      {
        wearable: "Paint Spray Can",
        cost: { sfl: 0, items: { "Colors Token 2025": 250 } },
      },
      {
        collectible: "Paint Buckets",
        cost: { sfl: 0, items: { "Colors Token 2025": 200 } },
      },
      {
        collectible: "Rare Key",
        cost: { sfl: 0, items: { "Colors Token 2025": 350 } },
      },
    ],
    requirement: 4,
  },
  epic: {
    items: [
      {
        collectible: "Red Slime Baloon",
        cost: { sfl: 60, items: {} },
      },
      {
        wearable: "Slime Wings",
        cost: { sfl: 100, items: {} },
      },
      {
        collectible: "Rainbow Well",
        cost: { sfl: 0, items: { "Colors Token 2025": 350 } },
      },
      {
        collectible: "Blue Slime Baloon",
        cost: { sfl: 0, items: { "Colors Token 2025": 500 } },
      },
      {
        collectible: "Rainbow Flower",
        cost: { sfl: 0, items: { "Colors Token 2025": 750 } },
      },
      {
        collectible: "Luxury Key",
        cost: { sfl: 0, items: { "Colors Token 2025": 750 } },
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
        cost: { sfl: 200, items: {} },
      },
    ],
    requirement: 4,
  },
};

export const EVENTMEGASTORE: Record<SeasonName, EventStore> = {
  "Catch the Kraken": EMPTY_EVENT_STORE,
  "Clash of Factions": EMPTY_EVENT_STORE,
  "Dawn Breaker": EMPTY_EVENT_STORE,
  "Solar Flare": EMPTY_EVENT_STORE,
  "Spring Blossom": EMPTY_EVENT_STORE,
  "Witches' Eve": EMPTY_EVENT_STORE,
  "Pharaoh's Treasure": EMPTY_EVENT_STORE,
  "Bull Run": EMPTY_EVENT_STORE,
  "Winds of Change": EMPTY_EVENT_STORE,
  "Great Bloom": COLORS_EVENT_ITEMS,
};
