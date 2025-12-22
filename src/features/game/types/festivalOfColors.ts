import { FlowerBox } from "../events/landExpansion/buyChapterItem";
import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";
import {
  FESTIVAL_OF_COLORS_STORE,
  FestivalOfColorsShopWearableName,
  FestivalOfColorsShopItemName,
} from "./minigameShop";

export type EventTierItemName =
  | EventCollectibleName
  | EventWearableName
  | FestivalOfColorsShopItemName
  | FestivalOfColorsShopWearableName
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

export const COLORS_EVENT_ITEMS: EventStore = {
  basic: {
    items: [
      {
        collectible: "Floating Toy",
        cost: FESTIVAL_OF_COLORS_STORE["Floating Toy"].cost,
      },
      {
        wearable: "Paint Splattered Hair",
        cost: FESTIVAL_OF_COLORS_STORE["Paint Splattered Hair"].cost,
      },
      {
        wearable: "Paint Splattered Shirt",
        cost: FESTIVAL_OF_COLORS_STORE["Paint Splattered Shirt"].cost,
      },
      {
        collectible: "Treasure Key",
        cost: FESTIVAL_OF_COLORS_STORE["Treasure Key"].cost,
      },
      {
        collectible: "Colors Ticket 2025",
        cooldownMs: 1000,
        cost: FESTIVAL_OF_COLORS_STORE["Colors Ticket 2025"].cost,
      },
    ],
  },
  rare: {
    items: [
      {
        collectible: "Pony Toy",
        cost: FESTIVAL_OF_COLORS_STORE["Pony Toy"].cost,
      },
      {
        wearable: "Slime Hat",
        cost: FESTIVAL_OF_COLORS_STORE["Slime Hat"].cost,
      },
      {
        wearable: "Paint Splattered Overalls",
        cost: FESTIVAL_OF_COLORS_STORE["Paint Splattered Overalls"].cost,
      },
      {
        wearable: "Paint Spray Can",
        cost: FESTIVAL_OF_COLORS_STORE["Paint Spray Can"].cost,
      },
      {
        collectible: "Paint Buckets",
        cost: FESTIVAL_OF_COLORS_STORE["Paint Buckets"].cost,
      },
      {
        collectible: "Rare Key",
        cost: FESTIVAL_OF_COLORS_STORE["Rare Key"].cost,
      },
    ],
    requirement: 4,
  },
  epic: {
    items: [
      {
        collectible: "Red Slime Balloon",
        cost: FESTIVAL_OF_COLORS_STORE["Red Slime Balloon"].cost,
      },
      {
        wearable: "Slime Wings",
        cost: FESTIVAL_OF_COLORS_STORE["Slime Wings"].cost,
      },
      {
        collectible: "Rainbow Well",
        cost: FESTIVAL_OF_COLORS_STORE["Rainbow Well"].cost,
      },
      {
        collectible: "Blue Slime Balloon",
        cost: FESTIVAL_OF_COLORS_STORE["Blue Slime Balloon"].cost,
      },
      {
        collectible: "Rainbow Flower",
        cost: FESTIVAL_OF_COLORS_STORE["Rainbow Flower"].cost,
      },
      {
        collectible: "Luxury Key",
        cost: FESTIVAL_OF_COLORS_STORE["Luxury Key"].cost,
      },
    ],
    requirement: 8,
  },
  mega: {
    items: [
      {
        collectible: "Super Totem",
        cost: FESTIVAL_OF_COLORS_STORE["Super Totem"].cost,
      },
      {
        wearable: "Slime Aura",
        cost: FESTIVAL_OF_COLORS_STORE["Slime Aura"].cost,
      },
    ],
    requirement: 12,
  },
};
