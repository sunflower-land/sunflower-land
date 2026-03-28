import { FlowerBox } from "../events/landExpansion/buyChapterItem";
import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";
import { APRIL_FOOLS_STORE } from "./minigameShop";

export type EventTierItemName =
  | EventCollectibleName
  | EventWearableName
  | MegastoreKeys;

export type EventCollectibleName =
  // April Fools Event
  | "Super Totem"
  | "Treasure Key"
  | "Rare Key"
  | "Luxury Key"
  | "April Fools Ticket 2026"
  | "Teeth Toy"
  | "Fake Treasure"
  | "Fake Mouse"
  | "Pet Tree"
  | "Definitely not a Flower";

export type EventWearableName = Extract<
  BumpkinItem,
  // April Fools Event
  | "Neon Noiz Jacket"
  | "404 Chic Top"
  | "Neon Noiz Pants"
  | "404 Chic Skirt"
  | "Admin Fools Tools"
  | "Neon Noiz Shoes"
  | "404 Chic Boots"
  | "Aether Specs"
  | "Faulty Barrier"
  | "Cardboard Wings"
  | "Glitch Aura"
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

export const APRIL_FOOLS_EVENT_ITEMS: EventStore = {
  basic: {
    items: [
      {
        collectible: "Treasure Key",
        cost: APRIL_FOOLS_STORE["Treasure Key"].cost,
      },
      {
        collectible: "April Fools Ticket 2026",
        cost: APRIL_FOOLS_STORE["April Fools Ticket 2026"].cost,
      },
      {
        collectible: "Teeth Toy",
        cost: APRIL_FOOLS_STORE["Teeth Toy"].cost,
      },
      {
        collectible: "Definitely not a Flower",
        cost: APRIL_FOOLS_STORE["Definitely not a Flower"].cost,
      },
      {
        wearable: "404 Chic Boots",
        cost: APRIL_FOOLS_STORE["404 Chic Boots"].cost,
      },
      {
        wearable: "Neon Noiz Shoes",
        cost: APRIL_FOOLS_STORE["Neon Noiz Shoes"].cost,
      },
    ],
  },
  rare: {
    items: [
      { collectible: "Rare Key", cost: APRIL_FOOLS_STORE["Rare Key"].cost },
      {
        collectible: "Fake Mouse",
        cost: APRIL_FOOLS_STORE["Fake Mouse"].cost,
      },
      {
        wearable: "Neon Noiz Jacket",
        cost: APRIL_FOOLS_STORE["Neon Noiz Jacket"].cost,
      },
      {
        wearable: "Neon Noiz Pants",
        cost: APRIL_FOOLS_STORE["Neon Noiz Pants"].cost,
      },
      {
        wearable: "404 Chic Skirt",
        cost: APRIL_FOOLS_STORE["404 Chic Skirt"].cost,
      },
      {
        wearable: "404 Chic Top",
        cost: APRIL_FOOLS_STORE["404 Chic Top"].cost,
      },
    ],
    requirement: 4,
  },
  epic: {
    items: [
      { collectible: "Luxury Key", cost: APRIL_FOOLS_STORE["Luxury Key"].cost },
      { collectible: "Pet Tree", cost: APRIL_FOOLS_STORE["Pet Tree"].cost },
      {
        collectible: "Fake Treasure",
        cost: APRIL_FOOLS_STORE["Fake Treasure"].cost,
      },
      {
        wearable: "Admin Fools Tools",
        cost: APRIL_FOOLS_STORE["Admin Fools Tools"].cost,
      },
      {
        wearable: "Aether Specs",
        cost: APRIL_FOOLS_STORE["Aether Specs"].cost,
      },
    ],
    requirement: 8,
  },
  mega: {
    items: [
      {
        wearable: "Faulty Barrier",
        cost: APRIL_FOOLS_STORE["Faulty Barrier"].cost,
      },
      {
        collectible: "Super Totem",
        cost: APRIL_FOOLS_STORE["Super Totem"].cost,
      },
      {
        wearable: "Glitch Aura",
        cost: APRIL_FOOLS_STORE["Glitch Aura"].cost,
      },
      {
        wearable: "Cardboard Wings",
        cost: APRIL_FOOLS_STORE["Cardboard Wings"].cost,
      },
    ],
    requirement: 12,
  },
};
