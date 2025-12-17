import { FlowerBox } from "../events/landExpansion/buyChapterItem";
import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";
import {
  HALLOWEEN_STORE,
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
  // Halloween
  | "Super Totem"
  | "Treasure Key"
  | "Rare Key"
  | "Luxury Key"
  | "Halloween Ticket 2025"
  | "Cerberus"
  | "Witch's Cauldron"
  | "Raveyard"
  | "Haunted House"
  | "Mimic Egg"
  | "Haunted Tomb"
  | "Guillotine"
  | "Vampire Coffin";

export type EventWearableName = Extract<
  BumpkinItem,
  // Halloween
  | "Moonseeker Potion"
  | "Frizzy Bob Cut"
  | "Two-toned Layered"
  | "Halloween Deathscythe"
  | "Moonseeker Hand Puppet"
  | "Sweet Devil Horns"
  | "Trick and Treat"
  | "Jack O'Sweets"
  | "Frank Onesie"
  | "Research Uniform"
  | "Sweet Devil Dress"
  | "Underworld Stimpack"
  | "Sweet Devil Wings"
  | "Wisp Aura"
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

export const HALLOWEEN_EVENT_ITEMS: EventStore = {
  basic: {
    items: [
      {
        collectible: "Cerberus",
        cost: HALLOWEEN_STORE["Cerberus"].cost,
      },
      {
        wearable: "Frizzy Bob Cut",
        cost: HALLOWEEN_STORE["Frizzy Bob Cut"].cost,
      },
      {
        collectible: "Haunted Tomb",
        cost: HALLOWEEN_STORE["Haunted Tomb"].cost,
      },
      {
        wearable: "Moonseeker Hand Puppet",
        cost: HALLOWEEN_STORE["Moonseeker Hand Puppet"].cost,
      },
      {
        collectible: "Treasure Key",
        cost: HALLOWEEN_STORE["Treasure Key"].cost,
      },
      {
        collectible: "Halloween Ticket 2025",
        cost: HALLOWEEN_STORE["Halloween Ticket 2025"].cost,
      },
      {
        wearable: "Trick and Treat",
        cost: HALLOWEEN_STORE["Trick and Treat"].cost,
      },
    ],
  },
  rare: {
    items: [
      {
        collectible: "Raveyard",
        cost: HALLOWEEN_STORE["Raveyard"].cost,
      },
      {
        wearable: "Two-toned Layered",
        cost: HALLOWEEN_STORE["Two-toned Layered"].cost,
      },
      {
        wearable: "Jack O'Sweets",
        cost: HALLOWEEN_STORE["Jack O'Sweets"].cost,
      },
      {
        wearable: "Sweet Devil Horns",
        cost: HALLOWEEN_STORE["Sweet Devil Horns"].cost,
      },
      {
        wearable: "Moonseeker Potion",
        cost: HALLOWEEN_STORE["Moonseeker Potion"].cost,
      },
      {
        collectible: "Rare Key",
        cost: HALLOWEEN_STORE["Rare Key"].cost,
      },
      {
        collectible: "Guillotine",
        cost: HALLOWEEN_STORE["Guillotine"].cost,
      },
    ],
    requirement: 4,
  },
  epic: {
    items: [
      {
        collectible: "Mimic Egg",
        cost: HALLOWEEN_STORE["Mimic Egg"].cost,
      },
      {
        wearable: "Research Uniform",
        cost: HALLOWEEN_STORE["Research Uniform"].cost,
      },
      {
        collectible: "Witch's Cauldron",
        cost: HALLOWEEN_STORE["Witch's Cauldron"].cost,
      },
      {
        wearable: "Sweet Devil Dress",
        cost: HALLOWEEN_STORE["Sweet Devil Dress"].cost,
      },
      {
        collectible: "Luxury Key",
        cost: HALLOWEEN_STORE["Luxury Key"].cost,
      },
      {
        collectible: "Vampire Coffin",
        cost: HALLOWEEN_STORE["Vampire Coffin"].cost,
      },
      {
        wearable: "Halloween Deathscythe",
        cost: HALLOWEEN_STORE["Halloween Deathscythe"].cost,
      },
      {
        wearable: "Underworld Stimpack",
        cost: HALLOWEEN_STORE["Underworld Stimpack"].cost,
      },
    ],
    requirement: 8,
  },
  mega: {
    items: [
      {
        collectible: "Super Totem",
        cost: HALLOWEEN_STORE["Super Totem"].cost,
      },
      {
        wearable: "Wisp Aura",
        cost: HALLOWEEN_STORE["Wisp Aura"].cost,
      },
      {
        wearable: "Frank Onesie",
        cost: HALLOWEEN_STORE["Frank Onesie"].cost,
      },
      {
        wearable: "Sweet Devil Wings",
        cost: HALLOWEEN_STORE["Sweet Devil Wings"].cost,
      },
      {
        collectible: "Haunted House",
        cost: HALLOWEEN_STORE["Haunted House"].cost,
      },
    ],
    requirement: 12,
  },
};
