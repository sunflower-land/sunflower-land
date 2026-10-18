import Decimal from "decimal.js-light";
import type { Animal, AnimalBuilding, GameState } from "../types/game";
import {
  ANIMAL_LEVELS,
  type AnimalLevel,
  type AnimalType,
} from "../types/animals";

import { INITIAL_FARM } from "./constants";

// Builds one animal per requested level (experience set to that level's
// threshold) so bounty min-level checks can be tested across the whole range.
const makeAnimals = (
  type: AnimalType,
  levels: AnimalLevel[],
): AnimalBuilding["animals"] =>
  levels.reduce<Record<string, Animal>>((animals, level, index) => {
    const id = `${type}-${index}`;
    return {
      ...animals,
      [id]: {
        id,
        type,
        state: "idle",
        createdAt: 0,
        experience: ANIMAL_LEVELS[type][level],
        asleepAt: 0,
        awakeAt: 0,
        lovedAt: 0,
        item: "Petting Hand",
      },
    };
  }, {});

export const STATIC_OFFLINE_FARM: GameState = {
  ...INITIAL_FARM,
  bumpkin: {
    ...INITIAL_FARM.bumpkin,
    // Past level 30 so the Barn / Hen House and all animals are unlocked.
    experience: 300000,
  },
  coins: 10000,
  buildings: {
    ...INITIAL_FARM.buildings,
    // Placed on the land so you can walk in from the farm.
    Barn: [
      {
        id: "barn",
        readyAt: 0,
        createdAt: 0,
        coordinates: { x: -7, y: 8 },
      },
    ],
    "Hen House": [
      {
        id: "henHouse",
        readyAt: 0,
        createdAt: 0,
        coordinates: { x: -7, y: 2 },
      },
    ],
  },
  // Level 3 buildings = capacity 20 each, with animals spread across the
  // level range so every bounty tier below has at least one eligible animal.
  barn: {
    level: 3,
    animals: {
      ...makeAnimals("Cow", [0, 1, 2, 3, 5, 5, 8, 10, 12, 15]),
      ...makeAnimals("Sheep", [0, 1, 3, 5, 8, 10, 15]),
    },
  },
  henHouse: {
    level: 3,
    animals: makeAnimals("Chicken", [0, 1, 2, 3, 3, 5, 5, 8, 10, 12, 15]),
  },
  // A spread of animal bounties per type: coin deals, chapter-ticket deals
  // (Shiny Feather = Ascension Age) and gem deals, at varied min levels.
  bounties: {
    completed: [],
    requests: [
      { id: "animal-1", name: "Chicken", level: 1, coins: 250 },
      { id: "animal-2", name: "Chicken", level: 3, coins: 480 },
      {
        id: "animal-3",
        name: "Chicken",
        level: 5,
        items: { "Shiny Feather": 2 },
      },
      { id: "animal-4", name: "Chicken", level: 10, items: { Gem: 20 } },
      { id: "animal-5", name: "Cow", level: 1, coins: 400 },
      { id: "animal-6", name: "Cow", level: 5, coins: 900 },
      { id: "animal-7", name: "Cow", level: 8, items: { "Shiny Feather": 3 } },
      { id: "animal-8", name: "Cow", level: 12, items: { Gem: 30 } },
      { id: "animal-9", name: "Sheep", level: 1, coins: 450 },
      {
        id: "animal-10",
        name: "Sheep",
        level: 3,
        items: { "Shiny Feather": 2 },
      },
      { id: "animal-11", name: "Sheep", level: 8, coins: 1200 },
      { id: "animal-12", name: "Sheep", level: 15, items: { Gem: 50 } },
    ],
  },
  inventory: {
    ...INITIAL_FARM.inventory,
    // Animal buildings + feed (matches the placed buildings above)
    Barn: new Decimal(1),
    "Hen House": new Decimal(1),
    "Kernel Blend": new Decimal(100),
    Hay: new Decimal(100),
    NutriBarley: new Decimal(100),
    "Mixed Grain": new Decimal(100),
    Omnifeed: new Decimal(50),
    "Barn Delight": new Decimal(20),
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
