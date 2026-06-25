import Decimal from "decimal.js-light";
import type { GameState } from "../types/game";
import { INITIAL_FARM } from "./constants";
import { makeAnimalBuilding } from "./animals";

const NOW = Date.now();
const SLEEP = 24 * 60 * 60 * 1000; // 24h

export const STATIC_OFFLINE_FARM: GameState = {
  ...INITIAL_FARM,
  inventory: {
    ...INITIAL_FARM.inventory,
    "Petting Hand": new Decimal(10),
  },
  bumpkin: {
    ...INITIAL_FARM.bumpkin!,
    experience: 205_405, // level 30
  },
  buildings: {
    ...INITIAL_FARM.buildings,
    "Hen House": [
      {
        id: "hen-house-1",
        readyAt: 0,
        createdAt: 0,
        coordinates: { x: -5, y: 3 },
      },
    ],
    Barn: [
      {
        id: "barn-1",
        readyAt: 0,
        createdAt: 0,
        coordinates: { x: 3, y: 3 },
      },
    ],
  },
  henHouse: {
    ...makeAnimalBuilding("Hen House"),
    animals: {
      "0": {
        id: "0",
        type: "Chicken",
        state: "idle",
        asleepAt: NOW - SLEEP * 0.1,
        awakeAt: NOW + SLEEP * 0.9,
        lovedAt: 0,
        experience: 30, // Lvl 0 → 1 (needs 60 XP)
        createdAt: NOW - 100_000,
        item: "Petting Hand",
      },
      "1": {
        id: "1",
        type: "Chicken",
        state: "idle",
        asleepAt: NOW - SLEEP * 0.5,
        awakeAt: NOW + SLEEP * 0.5,
        lovedAt: 0,
        experience: 400, // Lvl 4 → 5 (needs 480 XP)
        createdAt: NOW - 100_000,
        item: "Petting Hand",
      },
      "2": {
        id: "2",
        type: "Chicken",
        state: "idle",
        asleepAt: NOW - SLEEP * 0.9,
        awakeAt: NOW + SLEEP * 0.1,
        lovedAt: 0,
        experience: 1300, // Lvl 9 → 10 (needs 1440 XP)
        createdAt: NOW - 100_000,
        item: "Petting Hand",
      },
    },
  },
  barn: {
    ...makeAnimalBuilding("Barn"),
    animals: {
      "0": {
        id: "0",
        type: "Cow",
        state: "idle",
        asleepAt: NOW - SLEEP * 0.2,
        awakeAt: NOW + SLEEP * 0.8,
        lovedAt: 0,
        experience: 100, // Lvl 0 → 1 (needs 180 XP)
        createdAt: NOW - 100_000,
        item: "Petting Hand",
      },
      "1": {
        id: "1",
        type: "Cow",
        state: "idle",
        asleepAt: NOW - SLEEP * 0.6,
        awakeAt: NOW + SLEEP * 0.4,
        lovedAt: 0,
        experience: 1200, // Lvl 4 → 5 (needs 1440 XP)
        createdAt: NOW - 100_000,
        item: "Petting Hand",
      },
      "2": {
        id: "2",
        type: "Cow",
        state: "idle",
        asleepAt: NOW - SLEEP * 0.85,
        awakeAt: NOW + SLEEP * 0.15,
        lovedAt: 0,
        experience: 3800, // Lvl 9 → 10 (needs 4320 XP)
        createdAt: NOW - 100_000,
        item: "Petting Hand",
      },
      "3": {
        id: "3",
        type: "Sheep",
        state: "idle",
        asleepAt: NOW - SLEEP * 0.3,
        awakeAt: NOW + SLEEP * 0.7,
        lovedAt: 0,
        experience: 60, // Lvl 0 → 1 (needs 120 XP)
        createdAt: NOW - 100_000,
        item: "Petting Hand",
      },
      "4": {
        id: "4",
        type: "Sheep",
        state: "idle",
        asleepAt: NOW - SLEEP * 0.65,
        awakeAt: NOW + SLEEP * 0.35,
        lovedAt: 0,
        experience: 800, // Lvl 4 → 5 (needs 960 XP)
        createdAt: NOW - 100_000,
        item: "Petting Hand",
      },
      "5": {
        id: "5",
        type: "Sheep",
        state: "idle",
        asleepAt: NOW - SLEEP * 0.92,
        awakeAt: NOW + SLEEP * 0.08,
        lovedAt: 0,
        experience: 2500, // Lvl 8 → 9 (needs 2400 XP, going 9→10)
        createdAt: NOW - 100_000,
        item: "Petting Hand",
      },
    },
  },
};
