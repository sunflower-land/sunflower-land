import Decimal from "decimal.js-light";
import type { GameState } from "../types/game";
import { CROPS, type CropName } from "../types/crops";

import { INITIAL_FARM } from "./constants";

// Back-dates plantedAt so the crop reads as `progress` (0..1+) of its grow
// time at module load. >= 1 is ready to harvest.
const planted = (name: CropName, progress: number) => ({
  name,
  plantedAt: Date.now() - CROPS[name].harvestSeconds * 1000 * progress,
});

export const STATIC_OFFLINE_FARM: GameState = {
  ...INITIAL_FARM,
  bumpkin: {
    ...INITIAL_FARM.bumpkin,
    experience: 10000,
  },
  // A 4x4 grid of plots: a row of ready crops, two rows mid-growth at each
  // lifecycle stage, and a row of empty plots to plant into.
  crops: {
    // y = 0: ready to harvest
    "1": { createdAt: Date.now(), x: -2, y: 0, crop: planted("Sunflower", 2) },
    "2": { createdAt: Date.now(), x: -1, y: 0, crop: planted("Potato", 2) },
    "3": { createdAt: Date.now(), x: 0, y: 0, crop: planted("Pumpkin", 2) },
    "4": { createdAt: Date.now(), x: 1, y: 0, crop: planted("Wheat", 2) },
    // y = 1: growing (seedling → almost)
    "5": { createdAt: Date.now(), x: -2, y: 1, crop: planted("Carrot", 0.1) },
    "6": { createdAt: Date.now(), x: -1, y: 1, crop: planted("Cabbage", 0.3) },
    "7": { createdAt: Date.now(), x: 0, y: 1, crop: planted("Soybean", 0.6) },
    "8": { createdAt: Date.now(), x: 1, y: 1, crop: planted("Rhubarb", 0.9) },
    // y = 2: growing (longer crops)
    "9": { createdAt: Date.now(), x: -2, y: 2, crop: planted("Kale", 0.1) },
    "10": { createdAt: Date.now(), x: -1, y: 2, crop: planted("Corn", 0.3) },
    "11": { createdAt: Date.now(), x: 0, y: 2, crop: planted("Barley", 0.6) },
    // Sunflower grows in 60s — watch it march through the stages live
    "12": { createdAt: Date.now(), x: 1, y: 2, crop: planted("Sunflower", 0) },
    // y = -1: empty, ready to plant
    "13": { createdAt: Date.now(), x: -2, y: -1 },
    "14": { createdAt: Date.now(), x: -1, y: -1 },
    "15": { createdAt: Date.now(), x: 0, y: -1 },
    "16": { createdAt: Date.now(), x: 1, y: -1 },
  },
  inventory: {
    ...INITIAL_FARM.inventory,
    // Spring-season crop seeds (out-of-season seeds can't be planted)
    "Sunflower Seed": new Decimal(100),
    "Carrot Seed": new Decimal(50),
    "Cabbage Seed": new Decimal(40),
    "Soybean Seed": new Decimal(30),
    "Corn Seed": new Decimal(25),
    "Wheat Seed": new Decimal(40),
    "Kale Seed": new Decimal(20),
    "Rhubarb Seed": new Decimal(30),
    "Barley Seed": new Decimal(15),
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
  },
};
