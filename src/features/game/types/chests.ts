import { InventoryItemName, Wardrobe } from "./game";

export type ChestReward = {
  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Partial<Wardrobe>;
  sfl?: number;
  weighting: number;
  coins?: number;
};

export const BASIC_REWARDS: ChestReward[] = [
  { sfl: 5, weighting: 100 },
  { sfl: 10, weighting: 50 },
  { sfl: 25, weighting: 20 },
  { items: { "Block Buck": 1 }, weighting: 100 },
  { items: { "Block Buck": 2 }, weighting: 50 },
  { items: { "Block Buck": 5 }, weighting: 20 },
  { items: { "Block Buck": 10 }, weighting: 5 },
  { items: { Axe: 5, Pickaxe: 5, "Stone Pickaxe": 5 }, weighting: 100 },
  { items: { "Iron Pickaxe": 10 }, weighting: 10 },
  { items: { Rod: 10 }, weighting: 20 },
  { items: { "Rapid Root": 10, "Sprout Mix": 10 }, weighting: 50 },
  { items: { "Fishing Lure": 10 }, weighting: 10 },
  { items: { "Pirate Cake": 5 }, weighting: 5 },
  { items: { "Wheat Cake": 3 }, weighting: 20 },
  { items: { "Goblin Brunch": 3 }, weighting: 30 },
  { items: { "Bumpkin Roast": 3 }, weighting: 40 },
  { items: { "Fermented Carrots": 5 }, weighting: 50 },
  { items: { "Blueberry Jam": 3 }, weighting: 100 },
  { wearables: { "Fox Hat": 1 }, weighting: 50 },
  { items: { "Time Warp Totem": 1 }, weighting: 25 },
  { items: { Rug: 1 }, weighting: 25 },
  { items: { "Prize Ticket": 1 }, weighting: 5 },
];

export const RARE_REWARDS: ChestReward[] = [
  { sfl: 5, weighting: 50 },
  { sfl: 10, weighting: 100 },
  { sfl: 25, weighting: 50 },
  { sfl: 50, weighting: 20 },
  { items: { "Block Buck": 1 }, weighting: 50 },
  { items: { "Block Buck": 2 }, weighting: 100 },
  { items: { "Block Buck": 5 }, weighting: 50 },
  { items: { "Block Buck": 10 }, weighting: 20 },
  { items: { "Block Buck": 25 }, weighting: 10 },
  { items: { "Block Buck": 50 }, weighting: 5 },
  { items: { Axe: 15, Pickaxe: 15, "Stone Pickaxe": 15 }, weighting: 50 },
  { items: { "Gold Pickaxe": 3 }, weighting: 50 },
  { items: { "Oil Drill": 3 }, weighting: 25 },
  { items: { Rod: 5, Earthworm: 5, "Red Wiggler": 5, Grub: 5 }, weighting: 50 },
  { items: { "Fishing Lure": 25 }, weighting: 25 },
  { items: { "Pirate Cake": 5 }, weighting: 30 },
  { items: { "Wheat Cake": 3 }, weighting: 20 },
  { items: { "Goblin Brunch": 3 }, weighting: 50 },
  { items: { "Bumpkin Roast": 3 }, weighting: 40 },
  { wearables: { "Fox Hat": 1 }, weighting: 25 },
  { wearables: { "Pale Potion": 1 }, weighting: 50 },
  { items: { "Time Warp Totem": 1 }, weighting: 25 },
  { items: { "Prize Ticket": 1 }, weighting: 20 },
  { wearables: { Crown: 1 }, weighting: 5 },
  { items: { "Twister Rug": 1 }, weighting: 25 },
  { items: { "Chess Rug": 1 }, weighting: 25 },
];

export const LUXURY_REWARDS: ChestReward[] = [
  { sfl: 10, weighting: 50 },
  { sfl: 25, weighting: 100 },
  { sfl: 50, weighting: 50 },
  { items: { "Block Buck": 5 }, weighting: 50 },
  { items: { "Block Buck": 10 }, weighting: 100 },
  { items: { "Block Buck": 25 }, weighting: 25 },
  { items: { "Block Buck": 50 }, weighting: 10 },
  { items: { "Gold Pickaxe": 10 }, weighting: 75 },
  { items: { "Oil Drill": 5 }, weighting: 50 },
  {
    items: { Rod: 10, Earthworm: 10, "Red Wiggler": 10, Grub: 10 },
    weighting: 50,
  },
  { items: { "Fishing Lure": 25 }, weighting: 25 },
  { items: { "Pirate Cake": 10 }, weighting: 50 },
  { items: { "Goblin Brunch": 10 }, weighting: 25 },
  { items: { "Bumpkin Roast": 10 }, weighting: 25 },
  { wearables: { "Pale Potion": 1 }, weighting: 25 },
  { wearables: { "Chicken Hat": 1 }, weighting: 25 },
  { items: { "Time Warp Totem": 1 }, weighting: 25 },
  { items: { "Prize Ticket": 1 }, weighting: 50 },
  { wearables: { "Butterfly Wings": 1 }, weighting: 10 },
  { wearables: { Crown: 1 }, weighting: 10 },
  { items: { "Chess Rug": 1 }, weighting: 50 },
  { items: { Vinny: 1 }, weighting: 25 },
];

export const BUD_BOX_REWARDS: ChestReward[] = [
  { items: { "Gold Pickaxe": 3 }, weighting: 5 },
  { items: { "Rapid Root": 10, "Sprout Mix": 10 }, weighting: 10 },
  { items: { Grub: 3, Earthworm: 3, "Red Wiggler": 3 }, weighting: 10 },
  { items: { "Pirate Cake": 3 }, weighting: 5 },
  { items: { "Red Pansy": 2 }, weighting: 10 },
  { items: { "Purple Cosmos": 2 }, weighting: 10 },
  { items: { "Time Warp Totem": 1 }, weighting: 10 },
  { wearables: { "Seedling Hat": 1 }, weighting: 1 },
  { items: { "Prize Ticket": 1 }, weighting: 10 },
  { items: { "Oil Drill": 2 }, weighting: 5 },
];

export const GIFT_GIVER_REWARDS: ChestReward[] = [
  { items: { "Radish Cake": 1 }, weighting: 15 },
  { items: {}, coins: 2500, weighting: 12 },
  { items: { "Pirate Cake": 1 }, weighting: 10 },
  { items: { "Fishing Lure": 3 }, weighting: 10 },
  { items: { "Prize Ticket": 1 }, weighting: 5 },
  { items: { Grub: 3, Earthworm: 3, "Red Wiggler": 3 }, weighting: 5 },
  { items: {}, coins: 5000, weighting: 5 },
  { items: { "Block Buck": 1 }, sfl: 0, weighting: 5 },
  { items: {}, sfl: 5, weighting: 3 },
];
