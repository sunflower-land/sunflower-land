import type { FlowerBox } from "../events/landExpansion/buyChapterItem";
import type { BumpkinItem } from "./bumpkin";
import type { InventoryItemName } from "./game";
import { HALLOWEEN_2026_STORE } from "./minigameShop";

export type EventTierItemName =
  | EventCollectibleName
  | EventWearableName
  | MegastoreKeys;

export type EventCollectibleName =
  | "Super Totem"
  | "Treasure Key"
  | "Rare Key"
  | "Luxury Key"
  | "Huge Jack-o'-lantern"
  | "Haunted TV"
  | "Zombie Hand Toy"
  | "Cool Zombie Tombstone"
  | "Destroyed Sign"
  | "Skull Candles"
  | "Plague Crow"
  | "Skeleton Crow"
  | "Witch Crow"
  | "Fisherbird Crow"
  | "Chained Crow"
  | "Count Vlad Crow"
  | "Lual Crow"
  | "Halloween Ticket 2026";

export type EventWearableName = Extract<
  BumpkinItem,
  | "Vampire Headwear"
  | "Butcher Knife"
  | "Skeleton Mask"
  | "Vampire Breeches"
  | "Scary Nights Background"
  | "Vampire Garments"
  | "Hook and Chain"
  | "Vampire Footwear"
  | "Skeleton Costume"
  | "Sky Tearer Wings"
  | "Bat Aura"
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
  extra: {
    items: EventStoreItem[];
    requirement: number;
  };
};

export type EventStoreTier = keyof EventStore;

export const HALLOWEEN_2026_EVENT_ITEMS: EventStore = {
  basic: {
    items: [
      {
        collectible: "Treasure Key",
        cost: HALLOWEEN_2026_STORE["Treasure Key"].cost,
      },
      {
        collectible: "Halloween Ticket 2026",
        cost: HALLOWEEN_2026_STORE["Halloween Ticket 2026"].cost,
      },
      {
        collectible: "Destroyed Sign",
        cost: HALLOWEEN_2026_STORE["Destroyed Sign"].cost,
      },
      {
        collectible: "Zombie Hand Toy",
        cost: HALLOWEEN_2026_STORE["Zombie Hand Toy"].cost,
      },
      {
        collectible: "Skull Candles",
        cost: HALLOWEEN_2026_STORE["Skull Candles"].cost,
      },
      {
        collectible: "Count Vlad Crow",
        cost: HALLOWEEN_2026_STORE["Count Vlad Crow"].cost,
      },
      {
        collectible: "Lual Crow",
        cost: HALLOWEEN_2026_STORE["Lual Crow"].cost,
      },
      {
        wearable: "Butcher Knife",
        cost: HALLOWEEN_2026_STORE["Butcher Knife"].cost,
      },
      {
        wearable: "Vampire Footwear",
        cost: HALLOWEEN_2026_STORE["Vampire Footwear"].cost,
      },
    ],
  },
  rare: {
    items: [
      {
        collectible: "Rare Key",
        cost: HALLOWEEN_2026_STORE["Rare Key"].cost,
      },
      {
        collectible: "Skeleton Crow",
        cost: HALLOWEEN_2026_STORE["Skeleton Crow"].cost,
      },
      {
        collectible: "Fisherbird Crow",
        cost: HALLOWEEN_2026_STORE["Fisherbird Crow"].cost,
      },
      {
        collectible: "Chained Crow",
        cost: HALLOWEEN_2026_STORE["Chained Crow"].cost,
      },
      {
        collectible: "Cool Zombie Tombstone",
        cost: HALLOWEEN_2026_STORE["Cool Zombie Tombstone"].cost,
      },
      {
        wearable: "Hook and Chain",
        cost: HALLOWEEN_2026_STORE["Hook and Chain"].cost,
      },
      {
        wearable: "Skeleton Mask",
        cost: HALLOWEEN_2026_STORE["Skeleton Mask"].cost,
      },
      {
        wearable: "Vampire Headwear",
        cost: HALLOWEEN_2026_STORE["Vampire Headwear"].cost,
      },
      {
        wearable: "Vampire Breeches",
        cost: HALLOWEEN_2026_STORE["Vampire Breeches"].cost,
      },
    ],
    requirement: 6,
  },
  epic: {
    items: [
      {
        collectible: "Luxury Key",
        cost: HALLOWEEN_2026_STORE["Luxury Key"].cost,
      },
      {
        collectible: "Haunted TV",
        cost: HALLOWEEN_2026_STORE["Haunted TV"].cost,
      },
      {
        collectible: "Witch Crow",
        cost: HALLOWEEN_2026_STORE["Witch Crow"].cost,
      },
      {
        collectible: "Plague Crow",
        cost: HALLOWEEN_2026_STORE["Plague Crow"].cost,
      },
      {
        wearable: "Vampire Garments",
        cost: HALLOWEEN_2026_STORE["Vampire Garments"].cost,
      },
      {
        wearable: "Skeleton Costume",
        cost: HALLOWEEN_2026_STORE["Skeleton Costume"].cost,
      },
    ],
    requirement: 12,
  },
  mega: {
    items: [
      {
        collectible: "Super Totem",
        cost: HALLOWEEN_2026_STORE["Super Totem"].cost,
      },
      {
        wearable: "Sky Tearer Wings",
        cost: HALLOWEEN_2026_STORE["Sky Tearer Wings"].cost,
      },
      {
        wearable: "Bat Aura",
        cost: HALLOWEEN_2026_STORE["Bat Aura"].cost,
      },
      {
        wearable: "Scary Nights Background",
        cost: HALLOWEEN_2026_STORE["Scary Nights Background"].cost,
      },
    ],
    requirement: 16,
  },
  extra: {
    items: [
      {
        collectible: "Huge Jack-o'-lantern",
        cost: HALLOWEEN_2026_STORE["Huge Jack-o'-lantern"].cost,
      },
    ],
    requirement: 28,
  },
};
