import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";
import { MinigameName } from "./minigames";

export type EventShopItemName =
  | EventShopCollectibleName
  | EventShopWearableName;

export type EventShopCollectibleName = Extract<
  InventoryItemName,
  | "Super Totem"
  | "Treasure Key"
  | "Rare Key"
  | "Luxury Key"
  | "Easter Ticket 2025"
  | "White Tunnel Bunny"
  | "White Bunny Lantern"
  | "Orange Tunnel Bunny"
  | "Orange Bunny Lantern"
  | "Carrot House"

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
  | "Luxury Key"
>;

export type EventShopWearableName = Extract<
  BumpkinItem,
  | "Bunny Pants"
  | "Handheld Bunny"
  | "Carrot Pitchfork"
  | "Bunny Mask"
  | "Easter Apron"

  // Festival of Colors
  | "Paint Splattered Hair"
  | "Paint Splattered Shirt"
  | "Paint Splattered Overalls"
  | "Paint Spray Can"
  | "Slime Hat"
  | "Slime Wings"
  | "Slime Aura"
>;

type EventShopBase = {
  cost: { sfl: number; items: Partial<Record<InventoryItemName, number>> };
  max: number;
};

export type EventShopWearable = EventShopBase & {
  name: BumpkinItem;
  type: "wearable";
};
export type EventShopCollectible = EventShopBase & {
  name: InventoryItemName;
  type: "collectible";
};

export type EventShopItem = EventShopWearable | EventShopCollectible;

export const isEventShopCollectible = (
  item: EventShopItem,
): item is EventShopCollectible => item.type === "collectible";

type MinigameShop = Partial<Record<EventShopItemName, EventShopItem>>;

export const EASTER_SHOP_ITEMS: MinigameShop = {
  "Easter Ticket 2025": {
    name: "Easter Ticket 2025",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 250 },
    },
    type: "collectible",
    max: 10000000,
  },
  "Treasure Key": {
    name: "Treasure Key",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 250 },
    },
    type: "collectible",
    max: 1,
  },
  "Rare Key": {
    name: "Rare Key",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 1000 },
    },
    type: "collectible",
    max: 1,
  },
  "Luxury Key": {
    name: "Luxury Key",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 2000 },
    },
    type: "collectible",
    max: 1,
  },
  "Super Totem": {
    name: "Super Totem",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 5000 },
    },
    type: "collectible",
    max: 1,
  },
  "Bunny Pants": {
    name: "Bunny Pants",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 150 },
    },
    type: "wearable",
    max: 1,
  },
  "Handheld Bunny": {
    name: "Handheld Bunny",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 250 },
    },
    type: "wearable",
    max: 1,
  },
  "Carrot Pitchfork": {
    name: "Carrot Pitchfork",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 500 },
    },
    type: "wearable",
    max: 1,
  },
  "Bunny Mask": {
    name: "Bunny Mask",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 250 },
    },
    type: "wearable",
    max: 1,
  },
  "Easter Apron": {
    name: "Easter Apron",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 2000 },
    },
    type: "wearable",
    max: 1,
  },
  "Carrot House": {
    name: "Carrot House",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 500 },
    },
    type: "collectible",
    max: 1,
  },
  "Orange Bunny Lantern": {
    name: "Orange Bunny Lantern",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 100 },
    },
    type: "collectible",
    max: 1,
  },
  "White Bunny Lantern": {
    name: "White Bunny Lantern",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 1000 },
    },
    type: "collectible",
    max: 1,
  },
  "Orange Tunnel Bunny": {
    name: "Orange Tunnel Bunny",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 200 },
    },
    type: "collectible",
    max: 1,
  },
  "White Tunnel Bunny": {
    name: "White Tunnel Bunny",
    cost: {
      sfl: 0,
      items: { "Easter Token 2025": 1000 },
    },
    type: "collectible",
    max: 1,
  },
};

const FESTIVAL_OF_COLORS_STORE: MinigameShop = {
  "Floating Toy": {
    cost: { sfl: 20, items: {} },
    type: "collectible",
    max: 1,
    name: "Floating Toy",
  },
  "Paint Buckets": {
    cost: { sfl: 0, items: { "Colors Token 2025": 250 } },
    type: "collectible",
    max: 1,
    name: "Paint Buckets",
  },
  "Rainbow Well": {
    cost: { sfl: 0, items: { "Colors Token 2025": 500 } },
    type: "collectible",
    max: 1,
    name: "Rainbow Well",
  },
  "Rainbow Flower": {
    cost: { sfl: 0, items: { "Colors Token 2025": 1000 } },
    type: "collectible",
    max: 1,
    name: "Rainbow Flower",
  },
  "Pony Toy": {
    cost: { sfl: 40, items: {} },
    type: "collectible",
    max: 1,
    name: "Pony Toy",
  },
  "Slime Hat": {
    cost: { sfl: 50, items: {} },
    type: "wearable",
    max: 1,
    name: "Slime Hat",
  },
  "Slime Wings": {
    cost: { sfl: 300, items: {} },
    type: "wearable",
    max: 1,
    name: "Slime Wings",
  },
  "Slime Aura": {
    cost: { sfl: 500, items: {} },
    type: "wearable",
    max: 1,
    name: "Slime Aura",
  },
  "Treasure Key": {
    cost: { sfl: 0, items: { "Colors Token 2025": 300 } },
    max: 1,
    name: "Treasure Key",
    type: "collectible",
  },
  "Colors Ticket 2025": {
    cost: { sfl: 0, items: { "Colors Token 2025": 150 } },
    max: 100000,
    type: "collectible",
    name: "Colors Ticket 2025",
  },
  "Rare Key": {
    cost: { sfl: 0, items: { "Colors Token 2025": 500 } },
    max: 1,
    type: "collectible",
    name: "Rare Key",
  },
  "Luxury Key": {
    cost: { sfl: 0, items: { "Colors Token 2025": 1000 } },
    max: 1,
    type: "collectible",
    name: "Luxury Key",
  },
  "Super Totem": {
    cost: { sfl: 0, items: { "Colors Token 2025": 2500 } },
    max: 1,
    type: "collectible",
    name: "Super Totem",
  },
  "Paint Splattered Hair": {
    cost: { sfl: 0, items: { "Colors Token 2025": 150 } },
    max: 1,
    type: "wearable",
    name: "Paint Splattered Hair",
  },
  "Paint Splattered Shirt": {
    cost: { sfl: 0, items: { "Colors Token 2025": 250 } },
    max: 1,
    type: "wearable",
    name: "Paint Splattered Shirt",
  },
  "Paint Splattered Overalls": {
    cost: { sfl: 0, items: { "Colors Token 2025": 350 } },
    type: "wearable",
    max: 1,
    name: "Paint Splattered Overalls",
  },
  "Paint Spray Can": {
    cost: { sfl: 0, items: { "Colors Token 2025": 450 } },
    type: "wearable",
    max: 1,
    name: "Paint Spray Can",
  },
  "Red Slime Balloon": {
    cost: { sfl: 60, items: {} },
    type: "collectible",
    max: 1,
    name: "Red Slime Balloon",
  },
  "Blue Slime Balloon": {
    cost: { sfl: 0, items: { "Colors Token 2025": 750 } },
    type: "collectible",
    max: 1,
    name: "Blue Slime Balloon",
  },
};

export const MINIGAME_SHOP_ITEMS: Partial<Record<MinigameName, MinigameShop>> =
  {
    "easter-eggstravaganza": EASTER_SHOP_ITEMS,
    "festival-of-colors-2025": FESTIVAL_OF_COLORS_STORE,
  };
