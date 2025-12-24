import { BumpkinItem } from "./bumpkin";
import { InventoryItemName } from "./game";
import { MinigameName } from "./minigames";

export type EventShopItemName =
  | EasterShopCollectibleName
  | EasterShopWearableName
  | FestivalOfColorsShopItemName
  | FestivalOfColorsShopWearableName
  | HalloweenShopItemName
  | HalloweenShopWearableName
  | HolidayShopCollectibleName
  | HolidayShopWearableName;

export type EasterShopCollectibleName = Extract<
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
>;

export type FestivalOfColorsShopCollectibleName = Extract<
  InventoryItemName,
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

export type HalloweenShopCollectibleName = Extract<
  InventoryItemName,
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
  | "Vampire Coffin"
>;

export type HolidayShopCollectibleName = Extract<
  InventoryItemName,
  | "Super Totem"
  | "Festive Tree"
  | "Treasure Key"
  | "Rare Key"
  | "Luxury Key"
  | "Holiday Ticket 2025"
  | "Holiday Decorative Totem"
  | "Red Holiday Ornament"
  | "Green Holiday Ornament"
  | "Gift Turtle"
  | "Red Nose Reindeer"
  | "Tuxedo Claus"
  | "Winter Alpaca"
  | "Penguin Surprise"
  | "Frozen Meat"
  | "Ho Ho oh oh…"
>;

export type EasterShopWearableName = Extract<
  BumpkinItem,
  | "Bunny Pants"
  | "Handheld Bunny"
  | "Carrot Pitchfork"
  | "Bunny Mask"
  | "Easter Apron"
>;

export type FestivalOfColorsShopWearableName = Extract<
  BumpkinItem,
  | "Paint Splattered Hair"
  | "Paint Splattered Shirt"
  | "Paint Splattered Overalls"
  | "Paint Spray Can"
  | "Slime Hat"
  | "Slime Wings"
  | "Slime Aura"
>;

export type HalloweenShopWearableName = Extract<
  BumpkinItem,
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

export type HolidayShopWearableName = Extract<
  BumpkinItem,
  | "Comfy Xmas Sweater"
  | "Comfy Xmas Pants"
  | "Candy Halbred"
  | "Xmas Top Hat"
  | "Reindeer Mask"
  | "Snowman Mask"
  | "Cool Glasses"
  | "Cookie Shield"
  | "Holiday Feast Background"
  | "Cozy Reindeer Onesie"
  | "Diamond Snow Aura"
>;

export type EasterShopItemName =
  | EasterShopCollectibleName
  | EasterShopWearableName;

export type FestivalOfColorsShopItemName =
  | FestivalOfColorsShopCollectibleName
  | FestivalOfColorsShopWearableName;

export type HalloweenShopItemName =
  | HalloweenShopCollectibleName
  | HalloweenShopWearableName;

export type HolidayShopItemName =
  | HolidayShopCollectibleName
  | HolidayShopWearableName;

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

type MinigameShop<T extends EventShopItemName> = Record<T, EventShopItem>;

type AnyMinigameShop = Partial<Record<EventShopItemName, EventShopItem>>;

export const EASTER_SHOP_ITEMS: MinigameShop<EasterShopItemName> = {
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

export const FESTIVAL_OF_COLORS_STORE: MinigameShop<FestivalOfColorsShopItemName> =
  {
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

export const HALLOWEEN_STORE: MinigameShop<HalloweenShopItemName> = {
  "Treasure Key": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 300 } },
    max: 1,
    name: "Treasure Key",
    type: "collectible",
  },
  "Halloween Ticket 2025": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 100 } },
    max: 100000,
    type: "collectible",
    name: "Halloween Ticket 2025",
  },
  "Rare Key": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 500 } },
    max: 1,
    type: "collectible",
    name: "Rare Key",
  },
  "Luxury Key": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 800 } },
    max: 1,
    type: "collectible",
    name: "Luxury Key",
  },
  "Super Totem": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 2000 } },
    max: 1,
    type: "collectible",
    name: "Super Totem",
  },
  Cerberus: {
    cost: { sfl: 30, items: {} },
    max: 1,
    type: "collectible",
    name: "Cerberus",
  },
  "Witch's Cauldron": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 300 } },
    max: 1,
    type: "collectible",
    name: "Witch's Cauldron",
  },
  Raveyard: {
    cost: { sfl: 40, items: {} },
    max: 1,
    type: "collectible",
    name: "Raveyard",
  },
  "Haunted House": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 750 } },
    max: 1,
    type: "collectible",
    name: "Haunted House",
  },
  "Mimic Egg": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 250 } },
    max: 1,
    type: "collectible",
    name: "Mimic Egg",
  },
  "Haunted Tomb": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 200 } },
    max: 1,
    type: "collectible",
    name: "Haunted Tomb",
  },
  Guillotine: {
    cost: { sfl: 0, items: { "Halloween Token 2025": 250 } },
    max: 1,
    type: "collectible",
    name: "Guillotine",
  },
  "Vampire Coffin": {
    cost: { sfl: 50, items: {} },
    max: 1,
    type: "collectible",
    name: "Vampire Coffin",
  },
  "Moonseeker Potion": {
    cost: { sfl: 70, items: {} },
    max: 1,
    type: "wearable",
    name: "Moonseeker Potion",
  },
  "Frizzy Bob Cut": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 100 } },
    max: 1,
    type: "wearable",
    name: "Frizzy Bob Cut",
  },
  "Two-toned Layered": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 200 } },
    max: 1,
    type: "wearable",
    name: "Two-toned Layered",
  },
  "Halloween Deathscythe": {
    cost: { sfl: 80, items: {} },
    max: 1,
    type: "wearable",
    name: "Halloween Deathscythe",
  },
  "Moonseeker Hand Puppet": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 150 } },
    max: 1,
    type: "wearable",
    name: "Moonseeker Hand Puppet",
  },
  "Sweet Devil Horns": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 250 } },
    max: 1,
    type: "wearable",
    name: "Sweet Devil Horns",
  },
  "Trick and Treat": {
    cost: { sfl: 50, items: {} },
    max: 1,
    type: "wearable",
    name: "Trick and Treat",
  },
  "Jack O'Sweets": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 200 } },
    max: 1,
    type: "wearable",
    name: "Jack O'Sweets",
  },
  "Frank Onesie": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 500 } },
    max: 1,
    type: "wearable",
    name: "Frank Onesie",
  },
  "Research Uniform": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 500 } },
    max: 1,
    type: "wearable",
    name: "Research Uniform",
  },
  "Sweet Devil Dress": {
    cost: { sfl: 150, items: {} },
    max: 1,
    type: "wearable",
    name: "Sweet Devil Dress",
  },
  "Underworld Stimpack": {
    cost: { sfl: 0, items: { "Halloween Token 2025": 750 } },
    max: 1,
    type: "wearable",
    name: "Underworld Stimpack",
  },
  "Sweet Devil Wings": {
    cost: { sfl: 200, items: {} },
    max: 1,
    type: "wearable",
    name: "Sweet Devil Wings",
  },
  "Wisp Aura": {
    cost: { sfl: 600, items: {} },
    max: 1,
    type: "wearable",
    name: "Wisp Aura",
  },
};

export const HOLIDAY_STORE: MinigameShop<HolidayShopItemName> = {
  "Treasure Key": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 300 } },
    max: 1,
    name: "Treasure Key",
    type: "collectible",
  },
  "Holiday Ticket 2025": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 100 } },
    max: 100000,
    type: "collectible",
    name: "Holiday Ticket 2025",
  },
  "Rare Key": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 500 } },
    max: 1,
    type: "collectible",
    name: "Rare Key",
  },
  "Luxury Key": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 700 } },
    max: 1,
    type: "collectible",
    name: "Luxury Key",
  },
  "Super Totem": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 2000 } },
    max: 1,
    type: "collectible",
    name: "Super Totem",
  },
  "Festive Tree": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 250 } },
    max: 1,
    type: "collectible",
    name: "Festive Tree",
  },
  "Diamond Snow Aura": {
    cost: { sfl: 700, items: {} },
    max: 1,
    type: "wearable",
    name: "Diamond Snow Aura",
  },
  "Holiday Decorative Totem": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 350 } },
    max: 1,
    type: "collectible",
    name: "Holiday Decorative Totem",
  },
  "Red Holiday Ornament": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 300 } },
    max: 1,
    type: "collectible",
    name: "Red Holiday Ornament",
  },
  "Green Holiday Ornament": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 150 } },
    max: 1,
    type: "collectible",
    name: "Green Holiday Ornament",
  },
  "Gift Turtle": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 300 } },
    max: 1,
    type: "collectible",
    name: "Gift Turtle",
  },
  "Red Nose Reindeer": {
    cost: { sfl: 70, items: {} },
    max: 1,
    type: "collectible",
    name: "Red Nose Reindeer",
  },
  "Tuxedo Claus": {
    cost: { sfl: 100, items: {} },
    max: 1,
    type: "collectible",
    name: "Tuxedo Claus",
  },
  "Winter Alpaca": {
    cost: { sfl: 50, items: {} },
    max: 1,
    type: "collectible",
    name: "Winter Alpaca",
  },
  "Penguin Surprise": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 500 } },
    max: 1,
    type: "collectible",
    name: "Penguin Surprise",
  },
  "Frozen Meat": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 100 } },
    max: 1,
    type: "collectible",
    name: "Frozen Meat",
  },
  "Ho Ho oh oh…": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 500 } },
    max: 1,
    type: "collectible",
    name: "Ho Ho oh oh…",
  },
  "Comfy Xmas Sweater": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 400 } },
    max: 1,
    type: "wearable",
    name: "Comfy Xmas Sweater",
  },
  "Comfy Xmas Pants": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 350 } },
    max: 1,
    type: "wearable",
    name: "Comfy Xmas Pants",
  },
  "Candy Halbred": {
    cost: { sfl: 100, items: {} },
    max: 1,
    type: "wearable",
    name: "Candy Halbred",
  },
  "Xmas Top Hat": {
    cost: { sfl: 30, items: {} },
    max: 1,
    type: "wearable",
    name: "Xmas Top Hat",
  },
  "Reindeer Mask": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 750 } },
    max: 1,
    type: "wearable",
    name: "Reindeer Mask",
  },
  "Snowman Mask": {
    cost: { sfl: 200, items: {} },
    max: 1,
    type: "wearable",
    name: "Snowman Mask",
  },
  "Cool Glasses": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 150 } },
    max: 1,
    type: "wearable",
    name: "Cool Glasses",
  },
  "Cookie Shield": {
    cost: { sfl: 0, items: { "Holiday Token 2025": 500 } },
    max: 1,
    type: "wearable",
    name: "Cookie Shield",
  },
  "Holiday Feast Background": {
    cost: { sfl: 100, items: {} },
    max: 1,
    type: "wearable",
    name: "Holiday Feast Background",
  },
  "Cozy Reindeer Onesie": {
    cost: { sfl: 120, items: {} },
    max: 1,
    type: "wearable",
    name: "Cozy Reindeer Onesie",
  },
};

export const MINIGAME_SHOP_ITEMS: Partial<
  Record<MinigameName, AnyMinigameShop>
> = {
  "easter-eggstravaganza": EASTER_SHOP_ITEMS,
  "festival-of-colors-2025": FESTIVAL_OF_COLORS_STORE,
  halloween: HALLOWEEN_STORE,
  "holiday-puzzle-2025": HOLIDAY_STORE,
};
