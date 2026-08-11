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
  },
};
