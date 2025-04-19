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
};
export type EventShopCollectible = EventShopBase & {
  name: InventoryItemName;
};
export type EventShopLimited = EventShopBase & {
  name: InventoryItemName;
};

export type EventShopItem =
  | EventShopWearable
  | EventShopCollectible
  | EventShopLimited;

export const isEventShopCollectible = (
  name: EventShopItemName,
): name is EventShopCollectibleName =>
  EVENT_SHOP_ITEMS[name].type === "collectible";

export const EVENT_SHOP_ITEMS: Record<EventShopItemName, EventShopItem> = {
  "Easter Ticket 2025": {
    name: "Easter Ticket 2025",
    cost: {
      price: 250,
    },
    type: "limited",
  },
  "Treasure Key": {
    name: "Treasure Key",
    cost: {
      price: 250,
    },
    type: "limited",
  },
  "Rare Key": {
    name: "Rare Key",
    cost: {
      price: 750,
    },
    type: "limited",
  },
  "Luxury Key": {
    name: "Luxury Key",
    cost: {
      price: 1000,
    },
    type: "limited",
  },
  "Super Totem": {
    name: "Super Totem",
    cost: {
      price: 5000,
    },
    type: "limited",
  },
  "Bunny Pants": {
    name: "Bunny Pants",
    cost: {
      price: 150,
    },
    type: "wearable",
  },
  "Handheld Bunny": {
    name: "Handheld Bunny",
    cost: {
      price: 250,
    },
    type: "wearable",
  },
  "Carrot Pitchfork": {
    name: "Carrot Pitchfork",
    cost: {
      price: 500,
    },
    type: "wearable",
  },
  "Bunny Mask": {
    name: "Bunny Mask",
    cost: {
      price: 250,
    },
    type: "wearable",
  },
  "Easter Apron": {
    name: "Easter Apron",
    cost: {
      price: 250,
    },
    type: "wearable",
  },
  "Carrot House": {
    name: "Carrot House",
    cost: {
      price: 500,
    },
    type: "collectible",
  },
  "Orange Bunny Lantern": {
    name: "Orange Bunny Lantern",
    cost: {
      price: 100,
    },
    type: "collectible",
  },
  "White Bunny Lantern": {
    name: "White Bunny Lantern",
    cost: {
      price: 150,
    },
    type: "collectible",
  },
  "Orange Tunnel Bunny": {
    name: "Orange Tunnel Bunny",
    cost: {
      price: 200,
    },
    type: "collectible",
  },
  "White Tunnel Bunny": {
    name: "White Tunnel Bunny",
    cost: {
      price: 250,
    },
    type: "collectible",
  },
};
