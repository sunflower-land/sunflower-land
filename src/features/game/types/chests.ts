/**
 * READONLY file
 * Treasure Chest Rewards are calculated on the backend server
 * We have included the weights here for transparency and players who are trying to calculate odds
 * Note: Odds may become out of sync with backend if we change the weights on the server
 */

import { InventoryItemName, Wardrobe } from "./game";

type Reward = {
  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Partial<Wardrobe>;
  sfl?: number;
  weighting: number;
};

const BASIC_REWARDS: Reward[] = [
  {
    sfl: 5,
    weighting: 100,
  },
  {
    sfl: 10,
    weighting: 50,
  },
  {
    sfl: 25,
    weighting: 20,
  },

  {
    items: { "Block Buck": 1 },
    weighting: 100,
  },
  {
    items: { "Block Buck": 2 },
    weighting: 50,
  },
  {
    items: { "Block Buck": 5 },
    weighting: 20,
  },
  {
    items: { "Block Buck": 10 },
    weighting: 5,
  },
  {
    items: {
      Axe: 5,
      Pickaxe: 5,
      "Stone Pickaxe": 5,
    },
    weighting: 100,
  },
  {
    items: {
      "Iron Pickaxe": 10,
    },
    weighting: 10,
  },
  {
    items: {
      Rod: 10,
    },
    weighting: 20,
  },
  {
    items: {
      "Rapid Root": 10,
      "Sprout Mix": 10,
    },
    weighting: 50,
  },
  {
    items: {
      "Fishing Lure": 10,
    },
    weighting: 10,
  },
  {
    items: { "Pirate Cake": 5 },
    weighting: 5,
  },
  {
    items: { "Wheat Cake": 3 },
    weighting: 20,
  },
  {
    items: { "Goblin Brunch": 3 },
    weighting: 30,
  },
  {
    items: { "Bumpkin Roast": 3 },
    weighting: 40,
  },
  {
    items: { "Fermented Carrots": 5 },
    weighting: 50,
  },
  {
    items: { "Blueberry Jam": 3 },
    weighting: 100,
  },
  {
    wearables: {
      "Fox Hat": 1,
    },
    weighting: 50,
  },
  {
    items: {
      "Time Warp Totem": 1,
    },
    weighting: 25,
  },
  {
    items: {
      Rug: 1,
    },
    weighting: 25,
  },
  {
    items: {
      "Prize Ticket": 1,
    },
    weighting: 5,
  },
];

const RARE_REWARDS: Reward[] = [
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
  { items: { Axe: 5, Pickaxe: 5, "Stone Pickaxe": 5 }, weighting: 50 },
  { items: { "Iron Pickaxe": 10 }, weighting: 50 },
  { items: { Rod: 10 }, weighting: 50 },
  { items: { "Fishing Lure": 25 }, weighting: 25 },
  { items: { "Pirate Cake": 5 }, weighting: 30 },
  { items: { "Wheat Cake": 3 }, weighting: 20 },
  { items: { "Goblin Brunch": 3 }, weighting: 50 },
  { items: { "Bumpkin Roast": 3 }, weighting: 40 },
  { wearables: { "Fox Hat": 1 }, weighting: 25 },
  { wearables: { "Pale Potion": 1 }, weighting: 50 },
  { items: { "Time Warp Totem": 1 }, weighting: 25 },
  { items: { "Prize Ticket": 1 }, weighting: 20 },
];

const LUXURY_REWARDS: Reward[] = [
  { sfl: 10, weighting: 50 },
  { sfl: 25, weighting: 100 },
  { sfl: 50, weighting: 50 },
  { items: { "Block Buck": 5 }, weighting: 50 },
  { items: { "Block Buck": 10 }, weighting: 100 },
  { items: { "Block Buck": 25 }, weighting: 25 },
  { items: { "Block Buck": 50 }, weighting: 10 },
  { items: { "Iron Pickaxe": 10 }, weighting: 75 },
  { items: { Rod: 10 }, weighting: 50 },
  { items: { "Fishing Lure": 25 }, weighting: 25 },
  { items: { "Pirate Cake": 5 }, weighting: 50 },
  { items: { "Goblin Brunch": 3 }, weighting: 25 },
  { items: { "Bumpkin Roast": 3 }, weighting: 25 },
  { wearables: { "Pale Potion": 1 }, weighting: 25 },
  { wearables: { "Chicken Hat": 1 }, weighting: 25 },
  { items: { "Time Warp Totem": 1 }, weighting: 25 },
  { items: { "Prize Ticket": 1 }, weighting: 50 },
];
