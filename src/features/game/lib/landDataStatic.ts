import Decimal from "decimal.js-light";
import type { GameState } from "../types/game";

import { INITIAL_FARM } from "./constants";

export const STATIC_OFFLINE_FARM: GameState = {
  ...INITIAL_FARM,
  bumpkin: {
    ...INITIAL_FARM.bumpkin,
    experience: 10000,
  },
  inventory: {
    ...INITIAL_FARM.inventory,
    // A spread of foods across every Feed tab category, with a mix of
    // quantities: >10 (bulk modal + "Eat 10"), 2-10, and exactly 1.
    // Fire Pit
    "Mashed Potato": new Decimal(50),
    "Pumpkin Soup": new Decimal(25),
    "Bumpkin Broth": new Decimal(12),
    "Boiled Eggs": new Decimal(8),
    "Reindeer Carrot": new Decimal(3),
    Popcorn: new Decimal(1),
    // Kitchen
    "Fruit Salad": new Decimal(60),
    "Sunflower Crunch": new Decimal(30),
    "Roast Veggies": new Decimal(15),
    Pancakes: new Decimal(11),
    "Club Sandwich": new Decimal(5),
    // Bakery
    "Sunflower Cake": new Decimal(20),
    "Carrot Cake": new Decimal(12),
    "Apple Pie": new Decimal(7),
    "Honey Cake": new Decimal(2),
    // Deli
    "Fancy Fries": new Decimal(40),
    Cheese: new Decimal(25),
    Sauerkraut: new Decimal(11),
    "Blueberry Jam": new Decimal(4),
    // Smoothie Shack (juices — exercises the "Drink" verb)
    "Orange Juice": new Decimal(35),
    "Purple Smoothie": new Decimal(15),
    "Apple Juice": new Decimal(11),
    "Bumpkin Detox": new Decimal(6),
    // Special
    "Pirate Cake": new Decimal(15),
    Caponata: new Decimal(3),
    "Trade Cake": new Decimal(1),
    // Fish
    Anchovy: new Decimal(50),
    Clownfish: new Decimal(30),
    Tuna: new Decimal(12),
    "Red Snapper": new Decimal(8),
    // Aged fish
    "Aged Anchovy": new Decimal(20),
    "Prime Aged Anchovy": new Decimal(11),
    "Aged Tuna": new Decimal(5),
    "Crop Plot": new Decimal(4),
    "Sunflower Seed": new Decimal(200),
    "Kale Seed": new Decimal(50),
    Pickaxe: new Decimal(20),
    "Stone Pickaxe": new Decimal(20),
    "Iron Pickaxe": new Decimal(20),
    "Gold Pickaxe": new Decimal(20),
    "Oil Drill": new Decimal(5),
    "Iron Rock": new Decimal(1),
    "Gold Rock": new Decimal(1),
    "Crimstone Rock": new Decimal(1),
    "Sunstone Rock": new Decimal(1),
    "Oil Reserve": new Decimal(1),
  },
  // One of each mineable node for the farm renderers.
  iron: {
    "1": {
      createdAt: Date.now(),
      stone: { minedAt: 0 },
      x: 2,
      y: 2,
    },
  },
  gold: {
    "1": {
      createdAt: Date.now(),
      stone: { minedAt: 0 },
      x: 3,
      y: 2,
    },
  },
  crimstones: {
    "1": {
      createdAt: Date.now(),
      stone: { minedAt: 0 },
      minesLeft: 5,
      x: 3,
      y: -2,
    },
  },
  sunstones: {
    "1": {
      createdAt: Date.now(),
      stone: { minedAt: 0 },
      minesLeft: 10,
      x: -5,
      y: -2,
    },
  },
  oilReserves: {
    "1": {
      createdAt: Date.now(),
      oil: { drilledAt: 0 },
      drilled: 0,
      x: 5,
      y: 1,
    },
  },
  // A spread of plot states for the farm renderers: empty soil, a crop that's
  // ready the moment the farm loads, and one mid-growth.
  crops: {
    "1": { createdAt: Date.now(), x: -2, y: 0 },
    "2": { createdAt: Date.now(), x: -1, y: 0 },
    "3": {
      createdAt: Date.now(),
      x: 0,
      y: 0,
      crop: { name: "Sunflower", plantedAt: 0 },
    },
    "4": {
      createdAt: Date.now(),
      x: 1,
      y: 0,
      crop: { name: "Kale", plantedAt: Date.now() },
    },
  },
};
