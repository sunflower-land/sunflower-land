import { InventoryItemName } from "./game";

export const KNOWN_IDS: Record<InventoryItemName, number> = {
  "Sunflower Seed": 101,
  "Potato Seed": 102,
  "Pumpkin Seed": 103,
  "Carrot Seed": 104,
  "Cabbage Seed": 105,
  "Beetroot Seed": 106,
  "Cauliflower Seed": 107,
  "Parsnip Seed": 108,
  "Radish Seed": 109,
  "Wheat Seed": 110,

  Sunflower: 201,
  Potato: 202,
  Pumpkin: 203,
  Carrot: 204,
  Cabbage: 205,
  Beetroot: 206,
  Cauliflower: 207,
  Parsnip: 208,
  Radish: 209,
  Wheat: 210,

  Axe: 301,
  Pickaxe: 302,
  "Stone Pickaxe": 303,
  "Iron Pickaxe": 304,
  Hammer: 305,
  Rod: 306,

  "Sunflower Statue": 401,
  "Potato Statue": 402,
  "Christmas Tree": 403,
  Scarecrow: 404,
  "Farm Cat": 405,
  "Farm Dog": 406,
  Gnome: 407,
  "Chicken Coop": 408,
  "Gold Egg": 409,
  "Golden Cauliflower": 410,
  "Sunflower Tombstone": 411,
  "Sunflower Rock": 412,

  "Pumpkin Soup": 501,
  "Roasted Cauliflower": 502,
  Sauerkraut: 503,
  Flour: 504,

  Wood: 601,
  Stone: 602,
  Iron: 603,
  Gold: 604,
  Egg: 605,
  Chicken: 606,
};

// The reverse of above
export const KNOWN_ITEMS: Record<string, InventoryItemName> = Object.assign(
  {},
  ...Object.entries(KNOWN_IDS).map(([a, b]) => ({ [b]: a }))
);

export const IDS = Object.values(KNOWN_IDS);
