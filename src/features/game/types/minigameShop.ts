import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";

export type EventShopItemName =
  | EventShopCollectibleName
  | EventShopWearableName;

export type EventShopCollectibleName =
  | "Super Totem"
  | "Treasure Key"
  | "Rare Key"
  | "Luxury Key"
  | "Easter Ticket 2025"
  | "White Tunnel Bunny"
  | "White Bunny Lantern"
  | "Orange Tunnel Bunny"
  | "Orange Bunny Lantern"
  | "Carrot House";

export type EventShopWearableName =
  | "Bunny Pants"
  | "Handheld Bunny"
  | "Carrot Pitchfork"
  | "Bunny Mask"
  | "Easter Apron";

type EventShopBase = {
  cost: {
    price: number;
  };
  type: "wearable" | "collectible" | "limited";
};

export type EventShopWearable = EventShopBase & {
  name: BumpkinItem;
  max: number;
};
export type EventShopCollectible = EventShopBase & {
  name: InventoryItemName;
  max: number;
};
export type EventShopLimited = EventShopBase & {
  name: InventoryItemName;
  max: number;
};

export type EventShopItem =
  | EventShopWearable
  | EventShopCollectible
  | EventShopLimited;

export const isEventShopCollectible = (
  name: EventShopItemName,
): name is EventShopCollectibleName =>
  MINIGAME_SHOP_ITEMS[name].type === "collectible" ||
  MINIGAME_SHOP_ITEMS[name].type === "limited";

export const MINIGAME_SHOP_ITEMS: Record<EventShopItemName, EventShopItem> = {
  "Easter Ticket 2025": {
    name: "Easter Ticket 2025",
    cost: {
      price: 250,
    },
    type: "limited",
    max: 10000000,
  },
  "Treasure Key": {
    name: "Treasure Key",
    cost: {
      price: 250,
    },
    type: "limited",
    max: 1,
  },
  "Rare Key": {
    name: "Rare Key",
    cost: {
      price: 1000,
    },
    type: "limited",
    max: 1,
  },
  "Luxury Key": {
    name: "Luxury Key",
    cost: {
      price: 2000,
    },
    type: "limited",
    max: 1,
  },
  "Super Totem": {
    name: "Super Totem",
    cost: {
      price: 5000,
    },
    type: "limited",
    max: 1,
  },
  "Bunny Pants": {
    name: "Bunny Pants",
    cost: {
      price: 150,
    },
    type: "wearable",
    max: 1,
  },
  "Handheld Bunny": {
    name: "Handheld Bunny",
    cost: {
      price: 250,
    },
    type: "wearable",
    max: 1,
  },
  "Carrot Pitchfork": {
    name: "Carrot Pitchfork",
    cost: {
      price: 500,
    },
    type: "wearable",
    max: 1,
  },
  "Bunny Mask": {
    name: "Bunny Mask",
    cost: {
      price: 250,
    },
    type: "wearable",
    max: 1,
  },
  "Easter Apron": {
    name: "Easter Apron",
    cost: {
      price: 2000,
    },
    type: "wearable",
    max: 1,
  },
  "Carrot House": {
    name: "Carrot House",
    cost: {
      price: 500,
    },
    type: "collectible",
    max: 1,
  },
  "Orange Bunny Lantern": {
    name: "Orange Bunny Lantern",
    cost: {
      price: 100,
    },
    type: "collectible",
    max: 1,
  },
  "White Bunny Lantern": {
    name: "White Bunny Lantern",
    cost: {
      price: 1000,
    },
    type: "collectible",
    max: 1,
  },
  "Orange Tunnel Bunny": {
    name: "Orange Tunnel Bunny",
    cost: {
      price: 200,
    },
    type: "collectible",
    max: 1,
  },
  "White Tunnel Bunny": {
    name: "White Tunnel Bunny",
    cost: {
      price: 1000,
    },
    type: "collectible",
    max: 1,
  },
};
