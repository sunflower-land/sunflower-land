import Decimal from "decimal.js-light";
import { hasRemoveRestriction } from "./removeables";
import { INITIAL_FARM, TEST_FARM } from "../lib/constants";
import { makeAnimals } from "../events/landExpansion/buyAnimal.test";

const now = Date.now();

describe("canremove", () => {
  describe("prevents", () => {
    it("prevents a user from removing a Frozen Cow when cows are sleeping in the winter", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Frozen Cow",
        id: "123",
        state: {
          ...INITIAL_FARM,
          barn: {
            ...INITIAL_FARM.barn,
            animals: {
              "1": {
                ...INITIAL_FARM.barn.animals["1"],
                asleepAt: now - 1000,
                awakeAt: now + 10000,
              },
            },
          },
          season: {
            startedAt: now - 1000,
            season: "winter",
          },
          collectibles: {
            "Frozen Cow": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a Frozen Sheep when sheep are sleeping in the winter", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Frozen Sheep",
        id: "123",
        state: {
          ...INITIAL_FARM,
          barn: {
            ...INITIAL_FARM.barn,
            animals: {
              "1": {
                ...INITIAL_FARM.barn.animals["1"],
                type: "Sheep",
                asleepAt: now - 1000,
                awakeAt: now + 10000,
              },
            },
          },
          season: {
            startedAt: now - 1000,
            season: "winter",
          },
          collectibles: {
            "Frozen Sheep": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a Summer Chicken when chickens are sleeping and the season is Winds of Change", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Summer Chicken",
        id: "123",
        state: {
          ...INITIAL_FARM,
          season: {
            startedAt: now - 1000,
            season: "summer",
          },
          henHouse: {
            ...INITIAL_FARM.henHouse,
            animals: {
              "1": {
                ...INITIAL_FARM.henHouse.animals["1"],
                asleepAt: now - 1000,
                awakeAt: now + 10000,
              },
            },
          },
          collectibles: {
            "Summer Chicken": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a Jellyfish in summer if a player has fished today", () => {
      const today = new Date().toISOString().split("T")[0];
      const [restricted] = hasRemoveRestriction({
        name: "Jellyfish",
        id: "123",
        state: {
          ...INITIAL_FARM,
          fishing: {
            dailyAttempts: {
              [today]: 4,
            },
            wharf: {},
          },
          season: {
            season: "summer",
            startedAt: 0,
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a Chicken Coop if they have a boosted number of chickens", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Chicken Coop",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            "Chicken Coop": new Decimal(1),
          },
          henHouse: {
            level: 1,
            animals: {
              ...makeAnimals(15, "Chicken"),
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Grinx Hammer if recently expanded", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Grinx's Hammer",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            "Grinx's Hammer": new Decimal(1),
          },
          expandedAt: now,
        },
      });
      expect(restricted).toBe(true);
    });

    it("prevents a user from removing mutant chickens if some chicken are sleeping", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Rich Chicken",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            "Rich Chicken": new Decimal(1),
          },
          henHouse: {
            ...TEST_FARM.henHouse,
            animals: {
              1: {
                ...TEST_FARM.henHouse.animals[1],
                asleepAt: now,
                awakeAt: now + 10000,
              },
            },
          },
          collectibles: {
            "Rich Chicken": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Bale if some chickens are sleeping and within AoE", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Bale",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            Bale: new Decimal(1),
          },
          collectibles: {
            Rooster: [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
          henHouse: {
            ...TEST_FARM.henHouse,
            animals: {
              1: {
                ...TEST_FARM.henHouse.animals[1],
                asleepAt: now,
                awakeAt: now + 10000,
              },
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing rooster if some chicken are sleeping", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Rooster",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            Rooster: new Decimal(1),
          },
          henHouse: {
            ...TEST_FARM.henHouse,
            animals: {
              1: {
                ...TEST_FARM.henHouse.animals[1],
                asleepAt: now,
                awakeAt: now + 10000,
              },
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing an easter bunny when in use", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Easter Bunny",
        id: "1",
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,

              crop: { name: "Carrot", plantedAt: now },
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing victoria sisters when in use", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Victoria Sisters",
        id: "1",
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,

              crop: { name: "Pumpkin", plantedAt: now },
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a golden cauliflower when in use", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Golden Cauliflower",
        id: "1",
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,

              crop: {
                name: "Cauliflower",
                plantedAt: now,
              },
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a parsnip in use", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Mysterious Parsnip",
        id: "1",
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,

              crop: { name: "Parsnip", plantedAt: now },
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a T1 scarecrow while they have crops", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Nancy",
        id: "1",
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,

              crop: { name: "Sunflower", plantedAt: now },
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a T2 scarecrow while they have crops", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Scarecrow",
        id: "1",
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,

              crop: { name: "Sunflower", plantedAt: now },
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a T3 scarecrow while they have crops", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Kuebiko",
        id: "1",
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,

              crop: { name: "Sunflower", plantedAt: now },
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a T1 beaver while trees are replenishing", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Woody the Beaver",
        id: "1",
        state: {
          ...TEST_FARM,
          trees: {
            0: {
              wood: {
                choppedAt: now,
              },
              x: -3,
              y: 3,
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a T2 beaver while trees are replenishing", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Apprentice Beaver",
        id: "1",
        state: {
          ...TEST_FARM,
          trees: {
            0: {
              wood: {
                choppedAt: now,
              },
              x: -3,
              y: 3,
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a T3 beaver while trees are replenishing", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Foreman Beaver",
        id: "1",
        state: {
          ...TEST_FARM,
          trees: {
            0: {
              wood: {
                choppedAt: now,
              },
              x: -3,
              y: 3,
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Rock Golem while they have replenishing stones", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Rock Golem",
        id: "1",
        state: {
          ...TEST_FARM,
          stones: {
            0: {
              x: 0,
              y: 3,

              stone: {
                minedAt: now,
              },
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Tunnel Mole while they have replenishing stones", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Tunnel Mole",
        id: "1",
        state: {
          ...TEST_FARM,
          stones: {
            0: {
              x: 0,
              y: 3,

              stone: {
                minedAt: now,
              },
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Rocky the Mole while they have replenishing iron", () => {
      const restricted = hasRemoveRestriction({
        name: "Rocky the Mole",
        id: "1",
        state: {
          ...TEST_FARM,
          iron: {
            0: {
              x: 0,
              y: 3,

              stone: {
                minedAt: now,
              },
            },
          },
        },
      });

      expect(restricted).toBeTruthy();
    });

    it("prevents a user from removing Nugget while they have replenishing gold", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Nugget",
        id: "1",
        state: {
          ...TEST_FARM,
          gold: {
            0: {
              x: 0,
              y: 3,

              stone: {
                minedAt: now,
              },
            },
          },
        },
      });

      expect(restricted).toBeTruthy();
    });

    it("prevents a user from removing a peeled potato when potato's are planted", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Peeled Potato",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            "Peeled Potato": new Decimal(2),
          },
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,

              crop: { name: "Potato", plantedAt: now },
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Alien Chicken when chickens are sleeping", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Alien Chicken",
        id: "123",
        state: {
          ...INITIAL_FARM,
          henHouse: {
            ...INITIAL_FARM.henHouse,
            animals: {
              "1": {
                ...INITIAL_FARM.henHouse.animals["1"],
                asleepAt: now - 1000,
                awakeAt: now + 10000,
              },
            },
          },
          collectibles: {
            "Alien Chicken": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Mootant when cows are sleeping", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Mootant",
        id: "123",
        state: {
          ...INITIAL_FARM,
          barn: {
            ...INITIAL_FARM.barn,
            animals: {
              "1": {
                ...INITIAL_FARM.barn.animals["1"],
                asleepAt: now - 1000,
                awakeAt: now + 10000,
              },
            },
          },
          collectibles: {
            Mootant: [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Toxic Tuft when sheep are sleeping", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Toxic Tuft",
        id: "123",
        state: {
          ...INITIAL_FARM,
          barn: {
            ...INITIAL_FARM.barn,
            animals: {
              "1": {
                ...INITIAL_FARM.barn.animals["1"],
                type: "Sheep",
                asleepAt: now - 1000,
                awakeAt: now + 10000,
              },
            },
          },
          collectibles: {
            "Toxic Tuft": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Farm Dog when sheep are sleeping", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Farm Dog",
        id: "123",
        state: {
          ...INITIAL_FARM,
          barn: {
            ...INITIAL_FARM.barn,
            animals: {
              "1": {
                ...INITIAL_FARM.barn.animals["1"],
                type: "Sheep",
                asleepAt: now - 1000,
                awakeAt: now + 10000,
              },
            },
          },
          collectibles: {
            "Farm Dog": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(restricted).toBe(true);
    });
    it("prevents a user from removing Genie Lamp if rubbedCount is more than 0", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Genie Lamp",
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Genie Lamp": new Decimal(1),
          },
          collectibles: {
            "Genie Lamp": [
              {
                rubbedCount: 1,
                id: "123",
                createdAt: 0,
                readyAt: 0,
                coordinates: { x: 1, y: 1 },
              },
            ],
          },
        },
        id: "123",
      });

      expect(restricted).toBe(true);
    });
  });

  describe("enables", () => {
    it("enables a user to remove a chicken coop when they have a base amount or less chickens", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Chicken Coop",
        id: "1",
        state: {
          ...TEST_FARM,
          henHouse: {
            level: 1,
            animals: makeAnimals(10, "Chicken"),
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove Alien Chicken when no chickens are sleeping", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Alien Chicken",
        id: "123",
        state: {
          ...TEST_FARM,
          henHouse: {
            ...TEST_FARM.henHouse,
            animals: {
              "1": {
                ...TEST_FARM.henHouse.animals["1"],
                asleepAt: 0,
                awakeAt: 0,
              },
            },
          },
          collectibles: {
            "Alien Chicken": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove Mootant when no cows are sleeping", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Mootant",
        id: "123",
        state: {
          ...TEST_FARM,
          barn: {
            ...TEST_FARM.barn,
            animals: {
              "1": {
                ...TEST_FARM.barn.animals["1"],
                asleepAt: 0,
                awakeAt: 0,
              },
            },
          },
          collectibles: {
            Mootant: [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove Toxic Tuft when no sheep are sleeping", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Toxic Tuft",
        id: "123",
        state: {
          ...TEST_FARM,
          barn: {
            ...TEST_FARM.barn,
            animals: {
              "1": {
                ...TEST_FARM.barn.animals["1"],
                type: "Sheep",
                asleepAt: 0,
                awakeAt: 0,
              },
            },
          },
          collectibles: {
            "Toxic Tuft": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove Farm Dog when no sheep are sleeping", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Farm Dog",
        id: "123",
        state: {
          ...TEST_FARM,
          barn: {
            ...TEST_FARM.barn,
            animals: {
              "1": {
                ...TEST_FARM.barn.animals["1"],
                type: "Sheep",
                asleepAt: 0,
                awakeAt: 0,
              },
            },
          },
          collectibles: {
            "Farm Dog": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove Grinx Hammer 7 days after expanding", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Grinx's Hammer",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            "Grinx's Hammer": new Decimal(1),
          },
          expandedAt: now - 7 * 24 * 60 * 60 * 1001,
        },
      });
      expect(restricted).toBe(false);
    });

    it("enables users to remove crops", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Sunflower",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            Sunflower: new Decimal(1),
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables users to remove resources", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Wood",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            Wood: new Decimal(1),
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables users to remove flags", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Goblin Flag",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            "Goblin Flag": new Decimal(1),
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables users to remove observatory", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Observatory",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            Observatory: new Decimal(1),
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove an easter bunny when not in use", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Easter Bunny",
        id: "1",
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove victoria sisters when not in use", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Victoria Sisters",
        id: "1",
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a golden cauliflower when not in use", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Golden Cauliflower",
        id: "1",
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,

              crop: { name: "Sunflower", plantedAt: now },
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a mysterious parsnip when not in use", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Mysterious Parsnip",
        id: "1",
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,

              crop: { name: "Sunflower", plantedAt: now },
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a T1 scarecrow when not in use", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Nancy",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            Nancy: new Decimal(1),
          },
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a T2 scarecrow when not in use", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Scarecrow",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            Scarecrow: new Decimal(1),
          },
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a T3 scarecrow when not in use", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Kuebiko",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: { Kuebiko: new Decimal(1) },
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a T1 beaver when not in use", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Woody the Beaver",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            "Woody the Beaver": new Decimal(1),
          },
          trees: {
            0: {
              x: 0,
              y: 3,

              wood: {
                choppedAt: 0,
              },
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a T2 beaver when not in use", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Apprentice Beaver",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: { "Apprentice Beaver": new Decimal(1) },
          trees: {
            0: {
              wood: {
                choppedAt: 0,
              },
              x: -3,
              y: 3,
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a T3 beaver when not in use", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Foreman Beaver",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            "Foreman Beaver": new Decimal(1),
          },
          trees: {
            0: {
              x: 0,
              y: 3,

              wood: {
                choppedAt: 0,
              },
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enable a user to remove kuebiko while they don't have seeds or crops", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Kuebiko",
        id: "1",
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,
            },
          },
          inventory: {
            Kuebiko: new Decimal(1),
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enable a user to remove Rock Golem while they don't have stones replenishing", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Rock Golem",
        id: "1",
        state: {
          ...TEST_FARM,
          iron: {
            0: {
              x: 0,
              y: 3,

              stone: {
                minedAt: 0,
              },
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enable a user to remove Tunnel Mole while they don't have stones replenishing", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Tunnel Mole",
        id: "1",
        state: {
          ...TEST_FARM,
          stones: {
            0: {
              x: 0,
              y: 3,

              stone: {
                minedAt: 0,
              },
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enable a user to remove Rocky the Mole while they don't have irons replenishing", () => {
      const iron = hasRemoveRestriction({
        name: "Rocky the Mole",
        id: "1",
        state: {
          ...TEST_FARM,
          iron: {
            0: {
              x: 0,
              y: 3,

              stone: {
                minedAt: 0,
              },
            },
          },
        },
      });

      expect(iron).toBeTruthy();
    });

    it("enable a user to remove Nugget while they don't have stones replenishing", () => {
      const gold = hasRemoveRestriction({
        name: "Nugget",
        id: "1",
        state: {
          ...TEST_FARM,
          gold: {
            0: {
              x: 0,
              y: 3,

              stone: {
                minedAt: 0,
              },
            },
          },
        },
      });

      expect(gold).toBeTruthy();
    });

    it("enables a user to remove mutant chickens as long as no chickens are fed", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Rich Chicken",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            "Rich Chicken": new Decimal(1),
          },
          chickens: {},
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove chicken coop as long as no chickens are fed", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Chicken Coop",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            "Chicken Coop": new Decimal(1),
          },
          chickens: {},
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove rooster as long as no chickens are fed", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Rooster",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            Rooster: new Decimal(1),
          },
          chickens: {},
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove carrot sword as long as no crops are planted", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Carrot Sword",
        id: "1",
        state: {
          ...TEST_FARM,
          crops: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,
            },
          },
          inventory: {
            "Carrot Sword": new Decimal(1),
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a collectible that is not placed", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Apprentice Beaver",
        id: "1",
        state: {
          ...TEST_FARM,
          collectibles: {},
        },
      });

      expect(restricted).toBe(false);
    });

    // Hang over from previous bug where we were leaving an empty array against a collectible key if all were removed.
    it("enables a user to remove a collectible that is not placed but has a key in the db with empty array", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Apprentice Beaver",
        id: "1",
        state: {
          ...TEST_FARM,
          collectibles: {
            "Apprentice Beaver": [],
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a collectible when a player has two and one is placed", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Apprentice Beaver",
        id: "1",
        state: {
          ...TEST_FARM,
          inventory: {
            "Apprentice Beaver": new Decimal(2),
          },
          collectibles: {
            "Apprentice Beaver": [
              {
                id: "123",
                createdAt: 0,
                coordinates: { x: 1, y: 1 },
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a crop machine when there are no seeds or crops in the machine", () => {
      const [restricted] = hasRemoveRestriction({
        name: "Crop Machine",
        id: "123",
        state: {
          ...TEST_FARM,
          buildings: {
            "Crop Machine": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
                queue: [],
              },
            ],
          },
        },
      });

      expect(restricted).toBe(false);
    });
  });

  it("enables a user to remove a peeled potato when not in use", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Peeled Potato",
      id: "1",
      state: {
        ...TEST_FARM,
        inventory: {
          "Peeled Potato": new Decimal(2),
        },
        crops: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,

            crop: { name: "Sunflower", plantedAt: now },
          },
        },
      },
    });

    expect(restricted).toBe(false);
  });

  it("enables a user to remove Cabbage Boy as long as no Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Cabbage Boy",
      id: "1",
      state: {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,

            crop: { name: "Sunflower", plantedAt: now },
          },
        },
        inventory: {
          "Cabbage Boy": new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(false);
  });

  it("prevents a user from removing Cabbage Boy when Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Cabbage Boy",
      id: "1",
      state: {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,

            crop: { name: "Cabbage", plantedAt: now },
          },
        },
        inventory: {
          "Cabbage Boy": new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("enables a user to remove Cabbage Girl as long as no Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Cabbage Girl",
      id: "1",
      state: {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,

            crop: { name: "Sunflower", plantedAt: now },
          },
        },
        inventory: {
          "Cabbage Girl": new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(false);
  });

  it("prevents a user from removing Cabbage Girl when Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Cabbage Girl",
      id: "1",
      state: {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,

            crop: { name: "Cabbage", plantedAt: now },
          },
        },
        inventory: {
          "Cabbage Girl": new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("enables a user to remove Karkinos as long as no Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Karkinos",
      id: "1",
      state: {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,

            crop: { name: "Sunflower", plantedAt: now },
          },
        },
        inventory: {
          Karkinos: new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(false);
  });

  it("enables a user to remove Frozen Cow when no cows are sleeping in winter", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Frozen Cow",
      id: "123",
      state: {
        ...INITIAL_FARM,
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "1": {
              ...INITIAL_FARM.barn.animals["1"],
              asleepAt: 0,
              awakeAt: 0,
            },
          },
        },
        season: {
          startedAt: now - 1000,
          season: "winter",
        },
        collectibles: {
          "Frozen Cow": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(restricted).toBe(false);
  });

  it("enables a user to remove Frozen Sheep when no sheep are sleeping in winter", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Frozen Sheep",
      id: "123",
      state: {
        ...INITIAL_FARM,
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "1": {
              ...INITIAL_FARM.barn.animals["1"],
              type: "Sheep",
              asleepAt: 0,
              awakeAt: 0,
            },
          },
        },
        season: {
          startedAt: now - 1000,
          season: "winter",
        },
        collectibles: {
          "Frozen Sheep": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(restricted).toBe(false);
  });

  it("enables a user to remove Summer Chicken when no chickens are sleeping in summer", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Summer Chicken",
      id: "123",
      state: {
        ...INITIAL_FARM,
        season: {
          startedAt: now - 1000,
          season: "summer",
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "1": {
              ...INITIAL_FARM.henHouse.animals["1"],
              asleepAt: 0,
              awakeAt: 0,
            },
          },
        },
        collectibles: {
          "Summer Chicken": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(restricted).toBe(false);
  });

  it("enables a user to remove Jellyfish in summer if a player has not fished today", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Jellyfish",
      id: "123",
      state: {
        ...INITIAL_FARM,
        fishing: {
          dailyAttempts: {},
          wharf: {},
        },
        season: {
          season: "summer",
          startedAt: 0,
        },
      },
    });

    expect(restricted).toBe(false);
  });

  it("prevents a user from removing Karkinos when Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Karkinos",
      id: "1",
      state: {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,

            crop: { name: "Cabbage", plantedAt: now },
          },
        },
        inventory: {
          Karkinos: new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("enables a user to remove Pablo The Bunny as long as no Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Pablo The Bunny",
      id: "1",
      state: {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,

            crop: { name: "Sunflower", plantedAt: now },
          },
        },
        inventory: {
          "Pablo The Bunny": new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(false);
  });

  it("prevents a user from removing Pablo The Bunny when Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Pablo The Bunny",
      id: "1",
      state: {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,

            crop: { name: "Carrot", plantedAt: now },
          },
        },
        inventory: {
          "Pablo The Bunny": new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Tin Turtle when Stones are mined", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Tin Turtle",
      id: "1",
      state: {
        ...TEST_FARM,
        stones: {
          0: {
            x: 0,
            y: 3,

            stone: {
              minedAt: now - 100,
            },
          },
        },
        inventory: {
          "Tin Turtle": new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Emerald Turtle when Stone is mined", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Emerald Turtle",
      id: "1",
      state: {
        ...TEST_FARM,
        stones: {
          0: {
            x: 0,
            y: 3,

            stone: {
              minedAt: now - 100,
            },
          },
        },
        inventory: {
          "Emerald Turtle": new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Emerald Turtle when iron is mined", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Emerald Turtle",
      id: "1",
      state: {
        ...TEST_FARM,
        iron: {
          0: {
            x: 0,
            y: 3,

            stone: {
              minedAt: now - 100,
            },
          },
        },
        inventory: {
          "Emerald Turtle": new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Emerald Turtle when Gold is mined", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Emerald Turtle",
      id: "1",
      state: {
        ...TEST_FARM,
        gold: {
          0: {
            x: 0,
            y: 3,

            stone: {
              minedAt: now - 100,
            },
          },
        },
        inventory: {
          "Emerald Turtle": new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Maximus when Eggplant is planted", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Maximus",
      id: "1",
      state: {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,

            crop: { name: "Eggplant", plantedAt: now },
          },
        },
        inventory: {
          Maximus: new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Purple Trail when Eggplant is planted", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Purple Trail",
      id: "1",
      state: {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,

            crop: { name: "Eggplant", plantedAt: now },
          },
        },
        inventory: {
          Maximus: new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Carrot Sword when Magic Bean is planted", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Carrot Sword",
      id: "1",
      state: {
        ...TEST_FARM,
        collectibles: {
          "Magic Bean": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
        inventory: {
          Maximus: new Decimal(1),
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Banana Chicken when Bananas are growing", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Banana Chicken",
      id: "1",
      state: {
        ...TEST_FARM,
        fruitPatches: {
          "1": {
            createdAt: now,
            x: 1,
            y: 1,
            fruit: {
              amount: 1,
              name: "Banana",
              harvestedAt: 0,
              plantedAt: now - 10,
              harvestsLeft: 1,
            },
          },
        },
        collectibles: {
          "Banana Chicken": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
        inventory: {},
      },
    });

    expect(restricted).toBe(true);
  });

  it("does not prevent a user from removing Banana Chicken when apples are growing", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Banana Chicken",
      id: "1",
      state: {
        ...TEST_FARM,
        fruitPatches: {
          "1": {
            createdAt: now,
            x: 1,
            y: 1,
            fruit: {
              amount: 1,
              name: "Apple",
              harvestedAt: 0,
              plantedAt: now - 10,
              harvestsLeft: 1,
            },
          },
        },
        collectibles: {
          "Banana Chicken": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
        inventory: {},
      },
    });

    expect(restricted).toBe(false);
  });

  it("prevents a user from removing Immortal Pear when fruits are growing", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Immortal Pear",
      id: "1",
      state: {
        ...TEST_FARM,
        fruitPatches: {
          "1": {
            createdAt: now,
            x: 1,
            y: 1,
            fruit: {
              amount: 1,
              name: "Orange",
              harvestedAt: 0,
              plantedAt: now - 10,
              harvestsLeft: 1,
            },
          },
        },
        collectibles: {
          "Immortal Pear": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
        inventory: {},
      },
    });

    expect(restricted).toBe(true);
  });

  it("does not prevent a user from removing Immortal Pear when no fruits are growing", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Immortal Pear",
      id: "1",
      state: {
        ...TEST_FARM,
        fruitPatches: {},
        collectibles: {
          "Immortal Pear": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
        inventory: {},
      },
    });

    expect(restricted).toBe(false);
  });

  it("prevents a user from removing Crim Peckster when Crimstone is mined", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Crim Peckster",
      id: "1",
      state: {
        ...TEST_FARM,
        crimstones: {
          0: {
            x: 0,
            y: 3,

            stone: {
              minedAt: now - 100,
            },
            minesLeft: 1,
          },
        },
        collectibles: {
          "Crim Peckster": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Battle Fish when oil is drilled", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Battle Fish",
      id: "123",
      state: {
        ...TEST_FARM,
        oilReserves: {
          0: {
            x: 0,
            y: 3,

            oil: {
              amount: 1,
              drilledAt: now - 100,
            },
            createdAt: 0,
            drilled: 1,
          },
        },
        collectibles: {
          "Battle Fish": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Longhorn Cowfish when a cow is sleeping", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Longhorn Cowfish",
      id: "123",
      state: {
        ...TEST_FARM,
        barn: {
          ...TEST_FARM.barn,
          animals: {
            ...TEST_FARM.barn.animals,
            "0": {
              ...TEST_FARM.barn.animals["0"],
              asleepAt: now - 10000,
              awakeAt: now + 10000,
            },
          },
        },
        collectibles: {
          "Longhorn Cowfish": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Crim Peckster when Crimstone is mined", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Crim Peckster",
      id: "1",
      state: {
        ...TEST_FARM,
        crimstones: {
          0: {
            x: 0,
            y: 3,

            stone: {
              minedAt: now - 100,
            },
            minesLeft: 1,
          },
        },
        collectibles: {
          "Crim Peckster": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Knight Chicken when oil is drilled", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Knight Chicken",
      id: "123",
      state: {
        ...TEST_FARM,
        oilReserves: {
          0: {
            x: 0,
            y: 3,

            oil: {
              amount: 1,
              drilledAt: now - 100,
            },
            createdAt: 0,
            drilled: 1,
          },
        },
        collectibles: {
          "Knight Chicken": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Pharaoh Chicken there are holes dug", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Pharaoh Chicken",
      id: "123",
      state: {
        ...TEST_FARM,
        desert: {
          digging: {
            patterns: [],
            grid: new Array(26).fill([
              {
                x: 5,
                y: 5,
                dugAt: now,
                items: {
                  Sunflower: 1,
                },
              },
            ]),
          },
        },
        collectibles: {
          "Pharaoh Chicken": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Turbo Sprout when rice is planted in Greenhouse", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Turbo Sprout",
      id: "123",
      state: {
        ...TEST_FARM,
        greenhouse: {
          oil: 50,
          pots: {
            0: {
              plant: {
                amount: 1,
                name: "Rice",
                plantedAt: now - 100,
              },
            },
          },
        },
        collectibles: {
          "Turbo Sprout": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Vinny when grape is planted in Greenhouse", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Vinny",
      id: "123",
      state: {
        ...TEST_FARM,
        greenhouse: {
          oil: 50,
          pots: {
            0: {
              plant: {
                amount: 1,
                name: "Grape",
                plantedAt: now - 100,
              },
            },
          },
        },
        collectibles: {
          Vinny: [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Grape Granny when grape is planted in Greenhouse", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Grape Granny",
      id: "123",
      state: {
        ...TEST_FARM,
        greenhouse: {
          oil: 50,
          pots: {
            0: {
              plant: {
                amount: 1,
                name: "Grape",
                plantedAt: now - 100,
              },
            },
          },
        },
        collectibles: {
          "Grape Granny": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Rice Pand when rice is planted in Greenhouse", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Rice Panda",
      id: "123",
      state: {
        ...TEST_FARM,
        greenhouse: {
          oil: 50,
          pots: {
            0: {
              plant: {
                amount: 1,
                name: "Rice",
                plantedAt: now - 100,
              },
            },
          },
        },
        collectibles: {
          "Rice Panda": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing a crop machine when crops are inside the machine", () => {
    const [restricted] = hasRemoveRestriction({
      name: "Crop Machine",
      id: "123",
      state: {
        ...TEST_FARM,
        buildings: {
          "Crop Machine": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
              queue: [
                {
                  crop: "Sunflower",
                  amount: 20,
                  seeds: 20,
                  growTimeRemaining: 0,
                  totalGrowTime: 1000,
                  startTime: now,
                  readyAt: now + 1000,
                },
              ],
            },
          ],
        },
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing a Jellyfish in summer if a player has fished today", () => {
    const today = new Date().toISOString().split("T")[0];
    const [restricted] = hasRemoveRestriction({
      name: "Jellyfish",
      id: "123",
      state: {
        ...INITIAL_FARM,
        fishing: {
          dailyAttempts: {
            [today]: 4,
          },
          wharf: {},
        },
        season: {
          season: "summer",
          startedAt: 0,
        },
      },
    });

    expect(restricted).toBe(true);
  });
});
