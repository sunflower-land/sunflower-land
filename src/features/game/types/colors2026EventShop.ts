import type { FlowerBox } from "../events/landExpansion/buyChapterItem";
import type { BumpkinItem } from "./bumpkin";
import type { InventoryItemName } from "./game";
import { COLORS_2026_STORE } from "./minigameShop";

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
  | "Colors Ticket 2026"
  | "Blue Paint Bucket"
  | "Green Paint Bucket"
  | "Purple Paint Bucket"
  | "Yellow Paint Bucket"
  | "Color Wheel"
  | "Dhol Drum"
  | "Mimic Slime Ball"
  | "Mimic Winged Slime Ball"
  | "Pork Jelly"
  | "Rainbow Pork Jelly"
  | "Slime Totem"
  | "Giant Donut";

export type EventWearableName = Extract<
  BumpkinItem,
  | "Rainbow Wings"
  | "Butterfly Aura"
  | "Slime Wall Background"
  | "Green Slime Hair"
  | "Blue Slime Shirt"
  | "Slime Splattered Shirt"
  | "Yellow Slime Puppet"
  | "Blue Jelly Shoes"
  | "Sad Slime Slippers"
  | "Sad Slime Hat"
  | "Sad Slime Pants"
  | "Red Jelly Pants"
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

export const COLORS_2026_EVENT_ITEMS: EventStore = {
  basic: {
    items: [
      {
        collectible: "Treasure Key",
        cost: COLORS_2026_STORE["Treasure Key"].cost,
      },
      {
        collectible: "Colors Ticket 2026",
        cost: COLORS_2026_STORE["Colors Ticket 2026"].cost,
      },
      {
        collectible: "Blue Paint Bucket",
        cost: COLORS_2026_STORE["Blue Paint Bucket"].cost,
      },
      {
        collectible: "Green Paint Bucket",
        cost: COLORS_2026_STORE["Green Paint Bucket"].cost,
      },
      {
        collectible: "Purple Paint Bucket",
        cost: COLORS_2026_STORE["Purple Paint Bucket"].cost,
      },
      {
        collectible: "Yellow Paint Bucket",
        cost: COLORS_2026_STORE["Yellow Paint Bucket"].cost,
      },
      {
        collectible: "Mimic Slime Ball",
        cost: COLORS_2026_STORE["Mimic Slime Ball"].cost,
      },
      {
        wearable: "Slime Splattered Shirt",
        cost: COLORS_2026_STORE["Slime Splattered Shirt"].cost,
      },
      {
        wearable: "Blue Jelly Shoes",
        cost: COLORS_2026_STORE["Blue Jelly Shoes"].cost,
      },
    ],
  },
  rare: {
    items: [
      {
        collectible: "Rare Key",
        cost: COLORS_2026_STORE["Rare Key"].cost,
      },
      {
        collectible: "Pork Jelly",
        cost: COLORS_2026_STORE["Pork Jelly"].cost,
      },
      {
        wearable: "Sad Slime Pants",
        cost: COLORS_2026_STORE["Sad Slime Pants"].cost,
      },
      {
        collectible: "Dhol Drum",
        cost: COLORS_2026_STORE["Dhol Drum"].cost,
      },
      {
        wearable: "Green Slime Hair",
        cost: COLORS_2026_STORE["Green Slime Hair"].cost,
      },
      {
        collectible: "Mimic Winged Slime Ball",
        cost: COLORS_2026_STORE["Mimic Winged Slime Ball"].cost,
      },
      {
        wearable: "Sad Slime Slippers",
        cost: COLORS_2026_STORE["Sad Slime Slippers"].cost,
      },
    ],
    requirement: 6,
  },
  epic: {
    items: [
      {
        collectible: "Luxury Key",
        cost: COLORS_2026_STORE["Luxury Key"].cost,
      },
      {
        collectible: "Giant Donut",
        cost: COLORS_2026_STORE["Giant Donut"].cost,
      },
      {
        wearable: "Red Jelly Pants",
        cost: COLORS_2026_STORE["Red Jelly Pants"].cost,
      },
      {
        wearable: "Yellow Slime Puppet",
        cost: COLORS_2026_STORE["Yellow Slime Puppet"].cost,
      },
      {
        wearable: "Sad Slime Hat",
        cost: COLORS_2026_STORE["Sad Slime Hat"].cost,
      },
      {
        wearable: "Blue Slime Shirt",
        cost: COLORS_2026_STORE["Blue Slime Shirt"].cost,
      },
    ],
    requirement: 12,
  },
  mega: {
    items: [
      {
        collectible: "Super Totem",
        cost: COLORS_2026_STORE["Super Totem"].cost,
      },
      {
        wearable: "Rainbow Wings",
        cost: COLORS_2026_STORE["Rainbow Wings"].cost,
      },
      {
        wearable: "Butterfly Aura",
        cost: COLORS_2026_STORE["Butterfly Aura"].cost,
      },
      {
        collectible: "Rainbow Pork Jelly",
        cost: COLORS_2026_STORE["Rainbow Pork Jelly"].cost,
      },
      {
        wearable: "Slime Wall Background",
        cost: COLORS_2026_STORE["Slime Wall Background"].cost,
      },
      {
        collectible: "Color Wheel",
        cost: COLORS_2026_STORE["Color Wheel"].cost,
      },
    ],
    requirement: 16,
  },
  extra: {
    items: [
      {
        collectible: "Slime Totem",
        cost: COLORS_2026_STORE["Slime Totem"].cost,
      },
    ],
    requirement: 28,
  },
};
