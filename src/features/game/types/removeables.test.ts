import Decimal from "decimal.js-light";
import { hasRemoveRestriction } from "./removeables";
import { INITIAL_FARM, TEST_FARM } from "../lib/constants";

describe("canremove", () => {
  describe("prevents", () => {
    it("prevents a user from removing Grinx Hammer if recently expanded", () => {
      const [restricted] = hasRemoveRestriction("Grinx's Hammer", "1", {
        ...TEST_FARM,
        inventory: {
          "Grinx's Hammer": new Decimal(1),
        },
        expandedAt: Date.now(),
      });
      expect(restricted).toBe(true);
    });

    it("prevents a user from removing mutant chickens if some chicken is fed", () => {
      const [restricted] = hasRemoveRestriction("Rich Chicken", "1", {
        ...TEST_FARM,
        inventory: {
          "Rich Chicken": new Decimal(1),
        },
        chickens: {
          1: {
            multiplier: 1,
            fedAt: Date.now(),
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing chicken coop if some chicken is fed", () => {
      const [restricted] = hasRemoveRestriction("Chicken Coop", "1", {
        ...TEST_FARM,
        inventory: {
          "Chicken Coop": new Decimal(1),
        },
        chickens: {
          1: {
            multiplier: 1,
            fedAt: Date.now(),
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Bale if some chicken is fed and within AoE", () => {
      const [restricted] = hasRemoveRestriction("Bale", "1", {
        ...TEST_FARM,
        inventory: {
          Bale: new Decimal(1),
        },
        collectibles: {
          Bale: [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        chickens: {
          1: {
            multiplier: 1,
            fedAt: Date.now(),
            coordinates: { x: -1, y: 0 },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing rooster if some chicken is fed", () => {
      const [restricted] = hasRemoveRestriction("Rooster", "1", {
        ...TEST_FARM,
        inventory: {
          Rooster: new Decimal(1),
        },
        chickens: {
          1: {
            multiplier: 1,
            fedAt: Date.now(),
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing an easter bunny when in use", () => {
      const [restricted] = hasRemoveRestriction("Easter Bunny", "1", {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
            crop: { name: "Carrot", plantedAt: Date.now(), amount: 1 },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing victoria sisters when in use", () => {
      const [restricted] = hasRemoveRestriction("Victoria Sisters", "1", {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
            crop: { name: "Pumpkin", plantedAt: Date.now(), amount: 1 },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a golden cauliflower when in use", () => {
      const [restricted] = hasRemoveRestriction("Golden Cauliflower", "1", {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
            crop: {
              name: "Cauliflower",
              plantedAt: Date.now(),
              amount: 1,
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a parsnip in use", () => {
      const [restricted] = hasRemoveRestriction("Mysterious Parsnip", "1", {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
            crop: { name: "Parsnip", plantedAt: Date.now(), amount: 1 },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a T1 scarecrow while they have crops", () => {
      const [restricted] = hasRemoveRestriction("Nancy", "1", {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
            crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a T2 scarecrow while they have crops", () => {
      const [restricted] = hasRemoveRestriction("Scarecrow", "1", {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
            crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a T3 scarecrow while they have crops", () => {
      const [restricted] = hasRemoveRestriction("Kuebiko", "1", {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
            crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a T1 beaver while trees are replenishing", () => {
      const [restricted] = hasRemoveRestriction("Woody the Beaver", "1", {
        ...TEST_FARM,
        trees: {
          0: {
            wood: {
              amount: 1,
              choppedAt: Date.now(),
            },
            x: -3,
            y: 3,
            height: 2,
            width: 2,
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a T2 beaver while trees are replenishing", () => {
      const [restricted] = hasRemoveRestriction("Apprentice Beaver", "1", {
        ...TEST_FARM,
        trees: {
          0: {
            wood: {
              amount: 1,
              choppedAt: Date.now(),
            },
            x: -3,
            y: 3,
            height: 2,
            width: 2,
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing a T3 beaver while trees are replenishing", () => {
      const [restricted] = hasRemoveRestriction("Foreman Beaver", "1", {
        ...TEST_FARM,
        trees: {
          0: {
            wood: {
              amount: 1,
              choppedAt: Date.now(),
            },
            x: -3,
            y: 3,
            height: 2,
            width: 2,
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Rock Golem while they have replenishing stones", () => {
      const [restricted] = hasRemoveRestriction("Rock Golem", "1", {
        ...TEST_FARM,
        stones: {
          0: {
            x: 0,
            y: 3,
            width: 1,
            height: 1,
            stone: {
              amount: 1,
              minedAt: Date.now(),
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Tunnel Mole while they have replenishing stones", () => {
      const [restricted] = hasRemoveRestriction("Tunnel Mole", "1", {
        ...TEST_FARM,
        stones: {
          0: {
            x: 0,
            y: 3,
            width: 1,
            height: 1,
            stone: {
              amount: 1,
              minedAt: Date.now(),
            },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Rocky the Mole while they have replenishing iron", () => {
      const restricted = hasRemoveRestriction("Rocky the Mole", "1", {
        ...TEST_FARM,
        iron: {
          0: {
            x: 0,
            y: 3,
            width: 1,
            height: 1,
            stone: {
              amount: 1,
              minedAt: Date.now(),
            },
          },
        },
      });

      expect(restricted).toBeTruthy();
    });

    it("prevents a user from removing Nugget while they have replenishing gold", () => {
      const [restricted] = hasRemoveRestriction("Nugget", "1", {
        ...TEST_FARM,
        gold: {
          0: {
            x: 0,
            y: 3,
            width: 1,
            height: 1,
            stone: {
              amount: 1,
              minedAt: Date.now(),
            },
          },
        },
      });

      expect(restricted).toBeTruthy();
    });

    it("prevents a user from removing a peeled potato when potato's are planted", () => {
      const [restricted] = hasRemoveRestriction("Peeled Potato", "1", {
        ...TEST_FARM,
        inventory: {
          "Peeled Potato": new Decimal(2),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
            crop: { name: "Potato", plantedAt: Date.now(), amount: 1 },
          },
        },
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Alien Chicken when chickens are sleeping", () => {
      const [restricted] = hasRemoveRestriction("Alien Chicken", "123", {
        ...INITIAL_FARM,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "1": {
              ...INITIAL_FARM.henHouse.animals["1"],
              asleepAt: Date.now() - 1000,
              awakeAt: Date.now() + 10000,
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
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Mootant when cows are sleeping", () => {
      const [restricted] = hasRemoveRestriction("Mootant", "123", {
        ...INITIAL_FARM,
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "1": {
              ...INITIAL_FARM.barn.animals["1"],
              asleepAt: Date.now() - 1000,
              awakeAt: Date.now() + 10000,
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
      });

      expect(restricted).toBe(true);
    });

    it("prevents a user from removing Toxic Tuft when sheep are sleeping", () => {
      const [restricted] = hasRemoveRestriction("Toxic Tuft", "123", {
        ...INITIAL_FARM,
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "1": {
              ...INITIAL_FARM.barn.animals["1"],
              type: "Sheep",
              asleepAt: Date.now() - 1000,
              awakeAt: Date.now() + 10000,
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
      });

      expect(restricted).toBe(true);
    });
  });

  describe("enables", () => {
    it("enables a user to remove Alien Chicken when no chickens are sleeping", () => {
      const [restricted] = hasRemoveRestriction("Alien Chicken", "123", {
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
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove Mootant when no cows are sleeping", () => {
      const [restricted] = hasRemoveRestriction("Mootant", "123", {
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
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove Toxic Tuft when no sheep are sleeping", () => {
      const [restricted] = hasRemoveRestriction("Toxic Tuft", "123", {
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
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove Grinx Hammer 7 days after expanding", () => {
      const [restricted] = hasRemoveRestriction("Grinx's Hammer", "1", {
        ...TEST_FARM,
        inventory: {
          "Grinx's Hammer": new Decimal(1),
        },
        expandedAt: Date.now() - 7 * 24 * 60 * 60 * 1001,
      });
      expect(restricted).toBe(false);
    });

    it("enables users to remove crops", () => {
      const [restricted] = hasRemoveRestriction("Sunflower", "1", {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(1),
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables users to remove resources", () => {
      const [restricted] = hasRemoveRestriction("Wood", "1", {
        ...TEST_FARM,
        inventory: {
          Wood: new Decimal(1),
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables users to remove flags", () => {
      const [restricted] = hasRemoveRestriction("Goblin Flag", "1", {
        ...TEST_FARM,
        inventory: {
          "Goblin Flag": new Decimal(1),
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables users to remove observatory", () => {
      const [restricted] = hasRemoveRestriction("Observatory", "1", {
        ...TEST_FARM,
        inventory: {
          Observatory: new Decimal(1),
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove an easter bunny when not in use", () => {
      const [restricted] = hasRemoveRestriction("Easter Bunny", "1", {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove victoria sisters when not in use", () => {
      const [restricted] = hasRemoveRestriction("Victoria Sisters", "1", {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a golden cauliflower when not in use", () => {
      const [restricted] = hasRemoveRestriction("Golden Cauliflower", "1", {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
            crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a mysterious parsnip when not in use", () => {
      const [restricted] = hasRemoveRestriction("Mysterious Parsnip", "1", {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
            crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a T1 scarecrow when not in use", () => {
      const [restricted] = hasRemoveRestriction("Nancy", "1", {
        ...TEST_FARM,
        inventory: {
          Nancy: new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a T2 scarecrow when not in use", () => {
      const [restricted] = hasRemoveRestriction("Scarecrow", "1", {
        ...TEST_FARM,
        inventory: {
          Scarecrow: new Decimal(1),
        },
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a T3 scarecrow when not in use", () => {
      const [restricted] = hasRemoveRestriction("Kuebiko", "1", {
        ...TEST_FARM,
        inventory: { Kuebiko: new Decimal(1) },
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a T1 beaver when not in use", () => {
      const [restricted] = hasRemoveRestriction("Woody the Beaver", "1", {
        ...TEST_FARM,
        inventory: {
          "Woody the Beaver": new Decimal(1),
        },
        trees: {
          0: {
            x: 0,
            y: 3,
            width: 1,
            height: 1,
            wood: {
              amount: 1,
              choppedAt: 0,
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a T2 beaver when not in use", () => {
      const [restricted] = hasRemoveRestriction("Apprentice Beaver", "1", {
        ...TEST_FARM,
        inventory: { "Apprentice Beaver": new Decimal(1) },
        trees: {
          0: {
            wood: {
              amount: 1,
              choppedAt: 0,
            },
            x: -3,
            y: 3,
            height: 2,
            width: 2,
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a T3 beaver when not in use", () => {
      const [restricted] = hasRemoveRestriction("Foreman Beaver", "1", {
        ...TEST_FARM,
        inventory: {
          "Foreman Beaver": new Decimal(1),
        },
        trees: {
          0: {
            x: 0,
            y: 3,
            width: 1,
            height: 1,
            wood: {
              amount: 1,
              choppedAt: 0,
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enable a user to remove kuebiko while they don't have seeds or crops", () => {
      const [restricted] = hasRemoveRestriction("Kuebiko", "1", {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
          },
        },
        inventory: {
          Kuebiko: new Decimal(1),
        },
      });

      expect(restricted).toBe(false);
    });

    it("enable a user to remove Rock Golem while they don't have stones replenishing", () => {
      const [restricted] = hasRemoveRestriction("Rock Golem", "1", {
        ...TEST_FARM,
        iron: {
          0: {
            x: 0,
            y: 3,
            width: 1,
            height: 1,
            stone: {
              amount: 1,
              minedAt: 0,
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enable a user to remove Tunnel Mole while they don't have stones replenishing", () => {
      const [restricted] = hasRemoveRestriction("Tunnel Mole", "1", {
        ...TEST_FARM,
        stones: {
          0: {
            x: 0,
            y: 3,
            width: 1,
            height: 1,
            stone: {
              amount: 1,
              minedAt: 0,
            },
          },
        },
      });

      expect(restricted).toBe(false);
    });

    it("enable a user to remove Rocky the Mole while they don't have irons replenishing", () => {
      const iron = hasRemoveRestriction("Rocky the Mole", "1", {
        ...TEST_FARM,
        iron: {
          0: {
            x: 0,
            y: 3,
            width: 1,
            height: 1,
            stone: {
              amount: 1,
              minedAt: 0,
            },
          },
        },
      });

      expect(iron).toBeTruthy();
    });

    it("enable a user to remove Nugget while they don't have stones replenishing", () => {
      const gold = hasRemoveRestriction("Nugget", "1", {
        ...TEST_FARM,
        gold: {
          0: {
            x: 0,
            y: 3,
            width: 1,
            height: 1,
            stone: {
              amount: 1,
              minedAt: 0,
            },
          },
        },
      });

      expect(gold).toBeTruthy();
    });

    it("enables a user to remove mutant chickens as long as no chickens are fed", () => {
      const [restricted] = hasRemoveRestriction("Rich Chicken", "1", {
        ...TEST_FARM,
        inventory: {
          "Rich Chicken": new Decimal(1),
        },
        chickens: {},
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove chicken coop as long as no chickens are fed", () => {
      const [restricted] = hasRemoveRestriction("Chicken Coop", "1", {
        ...TEST_FARM,
        inventory: {
          "Chicken Coop": new Decimal(1),
        },
        chickens: {},
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove rooster as long as no chickens are fed", () => {
      const [restricted] = hasRemoveRestriction("Rooster", "1", {
        ...TEST_FARM,
        inventory: {
          Rooster: new Decimal(1),
        },
        chickens: {},
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove carrot sword as long as no crops are planted", () => {
      const [restricted] = hasRemoveRestriction("Carrot Sword", "1", {
        ...TEST_FARM,
        crops: {
          0: {
            createdAt: Date.now(),
            x: -2,
            y: -1,
            height: 1,
            width: 1,
          },
        },
        inventory: {
          "Carrot Sword": new Decimal(1),
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a collectible that is not placed", () => {
      const [restricted] = hasRemoveRestriction("Apprentice Beaver", "1", {
        ...TEST_FARM,
        collectibles: {},
      });

      expect(restricted).toBe(false);
    });

    // Hang over from previous bug where we were leaving an empty array against a collectible key if all were removed.
    it("enables a user to remove a collectible that is not placed but has a key in the db with empty array", () => {
      const [restricted] = hasRemoveRestriction("Apprentice Beaver", "1", {
        ...TEST_FARM,
        collectibles: {
          "Apprentice Beaver": [],
        },
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a collectible when a player has two and one is placed", () => {
      const [restricted] = hasRemoveRestriction("Apprentice Beaver", "1", {
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
      });

      expect(restricted).toBe(false);
    });

    it("enables a user to remove a crop machine when there are no seeds or crops in the machine", () => {
      const [restricted] = hasRemoveRestriction("Crop Machine", "1", {
        ...TEST_FARM,
        inventory: {
          "Crop Machine": new Decimal(1),
        },
        buildings: {
          "Crop Machine": [
            {
              id: "123",
              createdAt: 0,
              readyAt: 0,
              queue: [],
              coordinates: { x: 1, y: 1 },
            },
          ],
        },
      });

      expect(restricted).toBe(false);
    });
  });

  it("enables a user to remove a peeled potato when not in use", () => {
    const [restricted] = hasRemoveRestriction("Peeled Potato", "1", {
      ...TEST_FARM,
      inventory: {
        "Peeled Potato": new Decimal(2),
      },
      crops: {
        0: {
          createdAt: Date.now(),
          x: -2,
          y: -1,
          height: 1,
          width: 1,
          crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
        },
      },
    });

    expect(restricted).toBe(false);
  });

  it("enables a user to remove Cabbage Boy as long as no Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction("Cabbage Boy", "1", {
      ...TEST_FARM,
      crops: {
        0: {
          createdAt: Date.now(),
          x: -2,
          y: -1,
          height: 1,
          width: 1,
          crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
        },
      },
      inventory: {
        "Cabbage Boy": new Decimal(1),
      },
    });

    expect(restricted).toBe(false);
  });

  it("prevents a user from removing Cabbage Boy when Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction("Cabbage Boy", "1", {
      ...TEST_FARM,
      crops: {
        0: {
          createdAt: Date.now(),
          x: -2,
          y: -1,
          height: 1,
          width: 1,
          crop: { name: "Cabbage", plantedAt: Date.now(), amount: 1 },
        },
      },
      inventory: {
        "Cabbage Boy": new Decimal(1),
      },
    });

    expect(restricted).toBe(true);
  });

  it("enables a user to remove Cabbage Girl as long as no Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction("Cabbage Girl", "1", {
      ...TEST_FARM,
      crops: {
        0: {
          createdAt: Date.now(),
          x: -2,
          y: -1,
          height: 1,
          width: 1,
          crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
        },
      },
      inventory: {
        "Cabbage Girl": new Decimal(1),
      },
    });

    expect(restricted).toBe(false);
  });

  it("prevents a user from removing Cabbage Girl when Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction("Cabbage Girl", "1", {
      ...TEST_FARM,
      crops: {
        0: {
          createdAt: Date.now(),
          x: -2,
          y: -1,
          height: 1,
          width: 1,
          crop: { name: "Cabbage", plantedAt: Date.now(), amount: 1 },
        },
      },
      inventory: {
        "Cabbage Girl": new Decimal(1),
      },
    });

    expect(restricted).toBe(true);
  });

  it("enables a user to remove Karkinos as long as no Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction("Karkinos", "1", {
      ...TEST_FARM,
      crops: {
        0: {
          createdAt: Date.now(),
          x: -2,
          y: -1,
          height: 1,
          width: 1,
          crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
        },
      },
      inventory: {
        Karkinos: new Decimal(1),
      },
    });

    expect(restricted).toBe(false);
  });

  it("prevents a user from removing Karkinos when Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction("Karkinos", "1", {
      ...TEST_FARM,
      crops: {
        0: {
          createdAt: Date.now(),
          x: -2,
          y: -1,
          height: 1,
          width: 1,
          crop: { name: "Cabbage", plantedAt: Date.now(), amount: 1 },
        },
      },
      inventory: {
        Karkinos: new Decimal(1),
      },
    });

    expect(restricted).toBe(true);
  });

  it("enables a user to remove Pablo The Bunny as long as no Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction("Pablo The Bunny", "1", {
      ...TEST_FARM,
      crops: {
        0: {
          createdAt: Date.now(),
          x: -2,
          y: -1,
          height: 1,
          width: 1,
          crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
        },
      },
      inventory: {
        "Pablo The Bunny": new Decimal(1),
      },
    });

    expect(restricted).toBe(false);
  });

  it("prevents a user from removing Pablo The Bunny when Cabbages are planted", () => {
    const [restricted] = hasRemoveRestriction("Pablo The Bunny", "1", {
      ...TEST_FARM,
      crops: {
        0: {
          createdAt: Date.now(),
          x: -2,
          y: -1,
          height: 1,
          width: 1,
          crop: { name: "Carrot", plantedAt: Date.now(), amount: 1 },
        },
      },
      inventory: {
        "Pablo The Bunny": new Decimal(1),
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Tin Turtle when Stones are mined", () => {
    const [restricted] = hasRemoveRestriction("Tin Turtle", "1", {
      ...TEST_FARM,
      stones: {
        0: {
          x: 0,
          y: 3,
          width: 1,
          height: 1,
          stone: {
            amount: 1,
            minedAt: Date.now() - 100,
          },
        },
      },
      inventory: {
        "Tin Turtle": new Decimal(1),
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Emerald Turtle when Stone is mined", () => {
    const [restricted] = hasRemoveRestriction("Emerald Turtle", "1", {
      ...TEST_FARM,
      stones: {
        0: {
          x: 0,
          y: 3,
          width: 1,
          height: 1,
          stone: {
            amount: 1,
            minedAt: Date.now() - 100,
          },
        },
      },
      inventory: {
        "Emerald Turtle": new Decimal(1),
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Emerald Turtle when iron is mined", () => {
    const [restricted] = hasRemoveRestriction("Emerald Turtle", "1", {
      ...TEST_FARM,
      iron: {
        0: {
          x: 0,
          y: 3,
          width: 1,
          height: 1,
          stone: {
            amount: 1,
            minedAt: Date.now() - 100,
          },
        },
      },
      inventory: {
        "Emerald Turtle": new Decimal(1),
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Emerald Turtle when Gold is mined", () => {
    const [restricted] = hasRemoveRestriction("Emerald Turtle", "1", {
      ...TEST_FARM,
      gold: {
        0: {
          x: 0,
          y: 3,
          width: 1,
          height: 1,
          stone: {
            amount: 1,
            minedAt: Date.now() - 100,
          },
        },
      },
      inventory: {
        "Emerald Turtle": new Decimal(1),
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Maximus when Eggplant is planted", () => {
    const [restricted] = hasRemoveRestriction("Maximus", "1", {
      ...TEST_FARM,
      crops: {
        0: {
          createdAt: Date.now(),
          x: -2,
          y: -1,
          height: 1,
          width: 1,
          crop: { name: "Eggplant", plantedAt: Date.now(), amount: 1 },
        },
      },
      inventory: {
        Maximus: new Decimal(1),
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Purple Trail when Eggplant is planted", () => {
    const [restricted] = hasRemoveRestriction("Purple Trail", "1", {
      ...TEST_FARM,
      crops: {
        0: {
          createdAt: Date.now(),
          x: -2,
          y: -1,
          height: 1,
          width: 1,
          crop: { name: "Eggplant", plantedAt: Date.now(), amount: 1 },
        },
      },
      inventory: {
        Maximus: new Decimal(1),
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Carrot Sword when Magic Bean is planted", () => {
    const [restricted] = hasRemoveRestriction("Carrot Sword", "1", {
      ...TEST_FARM,
      collectibles: {
        "Magic Bean": [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
      inventory: {
        Maximus: new Decimal(1),
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Banana Chicken when Bananas are growing", () => {
    const [restricted] = hasRemoveRestriction("Banana Chicken", "1", {
      ...TEST_FARM,
      fruitPatches: {
        "1": {
          height: 1,
          width: 1,
          x: 1,
          y: 1,
          fruit: {
            amount: 1,
            name: "Banana",
            harvestedAt: 0,
            plantedAt: Date.now() - 10,
            harvestsLeft: 1,
          },
        },
      },
      collectibles: {
        "Banana Chicken": [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
      inventory: {},
    });

    expect(restricted).toBe(true);
  });

  it("does not prevent a user from removing Banana Chicken when apples are growing", () => {
    const [restricted] = hasRemoveRestriction("Banana Chicken", "1", {
      ...TEST_FARM,
      fruitPatches: {
        "1": {
          height: 1,
          width: 1,
          x: 1,
          y: 1,
          fruit: {
            amount: 1,
            name: "Apple",
            harvestedAt: 0,
            plantedAt: Date.now() - 10,
            harvestsLeft: 1,
          },
        },
      },
      collectibles: {
        "Banana Chicken": [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
      inventory: {},
    });

    expect(restricted).toBe(false);
  });

  it("prevents a user from removing Immortal Pear when fruits are growing", () => {
    const [restricted] = hasRemoveRestriction("Immortal Pear", "1", {
      ...TEST_FARM,
      fruitPatches: {
        "1": {
          height: 1,
          width: 1,
          x: 1,
          y: 1,
          fruit: {
            amount: 1,
            name: "Orange",
            harvestedAt: 0,
            plantedAt: Date.now() - 10,
            harvestsLeft: 1,
          },
        },
      },
      collectibles: {
        "Immortal Pear": [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
      inventory: {},
    });

    expect(restricted).toBe(true);
  });

  it("does not prevent a user from removing Immortal Pear when no fruits are growing", () => {
    const [restricted] = hasRemoveRestriction("Immortal Pear", "1", {
      ...TEST_FARM,
      fruitPatches: {},
      collectibles: {
        "Immortal Pear": [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
      inventory: {},
    });

    expect(restricted).toBe(false);
  });

  it("prevents a user from removing Crim Peckster when Crimstone is mined", () => {
    const [restricted] = hasRemoveRestriction("Crim Peckster", "1", {
      ...TEST_FARM,
      crimstones: {
        0: {
          x: 0,
          y: 3,
          width: 1,
          height: 1,
          stone: {
            amount: 1,
            minedAt: Date.now() - 100,
          },
          minesLeft: 1,
        },
      },
      collectibles: {
        "Crim Peckster": [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Battle Fish when oil is drilled", () => {
    const [restricted] = hasRemoveRestriction("Battle Fish", "123", {
      ...TEST_FARM,
      oilReserves: {
        0: {
          x: 0,
          y: 3,
          width: 1,
          height: 1,
          oil: {
            amount: 1,
            drilledAt: Date.now() - 100,
          },
          createdAt: 0,
          drilled: 1,
        },
      },
      collectibles: {
        "Battle Fish": [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Longhorn Cowfish when a cow is sleeping", () => {
    const [restricted] = hasRemoveRestriction("Longhorn Cowfish", "123", {
      ...TEST_FARM,
      barn: {
        ...TEST_FARM.barn,
        animals: {
          ...TEST_FARM.barn.animals,
          "0": {
            ...TEST_FARM.barn.animals["0"],
            asleepAt: Date.now() - 10000,
            awakeAt: Date.now() + 10000,
          },
        },
      },
      collectibles: {
        "Longhorn Cowfish": [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Crim Peckster when Crimstone is mined", () => {
    const [restricted] = hasRemoveRestriction("Crim Peckster", "1", {
      ...TEST_FARM,
      crimstones: {
        0: {
          x: 0,
          y: 3,
          width: 1,
          height: 1,

          stone: {
            amount: 1,
            minedAt: Date.now() - 100,
          },
          minesLeft: 1,
        },
      },
      collectibles: {
        "Crim Peckster": [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Knight Chicken when oil is drilled", () => {
    const [restricted] = hasRemoveRestriction("Knight Chicken", "123", {
      ...TEST_FARM,
      oilReserves: {
        0: {
          x: 0,
          y: 3,
          width: 1,
          height: 1,
          oil: {
            amount: 1,
            drilledAt: Date.now() - 100,
          },
          createdAt: 0,
          drilled: 1,
        },
      },
      collectibles: {
        "Knight Chicken": [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Pharaoh Chicken there are holes dug", () => {
    const [restricted] = hasRemoveRestriction("Pharaoh Chicken", "123", {
      ...TEST_FARM,
      desert: {
        digging: {
          patterns: [],
          grid: new Array(26).fill([
            {
              x: 5,
              y: 5,
              dugAt: Date.now(),
              items: {
                Sunflower: 1,
              },
            },
          ]),
        },
      },
      collectibles: {
        "Pharaoh Chicken": [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Turbo Sprout when rice is planted in Greenhouse", () => {
    const [restricted] = hasRemoveRestriction("Turbo Sprout", "123", {
      ...TEST_FARM,
      greenhouse: {
        oil: 50,
        pots: {
          0: {
            plant: {
              amount: 1,
              name: "Rice",
              plantedAt: Date.now() - 100,
            },
          },
        },
      },
      collectibles: {
        "Turbo Sprout": [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Vinny when grape is planted in Greenhouse", () => {
    const [restricted] = hasRemoveRestriction("Vinny", "123", {
      ...TEST_FARM,
      greenhouse: {
        oil: 50,
        pots: {
          0: {
            plant: {
              amount: 1,
              name: "Grape",
              plantedAt: Date.now() - 100,
            },
          },
        },
      },
      collectibles: {
        Vinny: [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Grape Granny when grape is planted in Greenhouse", () => {
    const [restricted] = hasRemoveRestriction("Vinny", "123", {
      ...TEST_FARM,
      greenhouse: {
        oil: 50,
        pots: {
          0: {
            plant: {
              amount: 1,
              name: "Grape",
              plantedAt: Date.now() - 100,
            },
          },
        },
      },
      collectibles: {
        "Grape Granny": [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing Rice Pand when rice is planted in Greenhouse", () => {
    const [restricted] = hasRemoveRestriction("Rice Panda", "123", {
      ...TEST_FARM,
      greenhouse: {
        oil: 50,
        pots: {
          0: {
            plant: {
              amount: 1,
              name: "Rice",
              plantedAt: Date.now() - 100,
            },
          },
        },
      },
      collectibles: {
        "Rice Panda": [
          { coordinates: { x: 1, y: 1 }, createdAt: 0, id: "123", readyAt: 0 },
        ],
      },
    });

    expect(restricted).toBe(true);
  });

  it("prevents a user from removing a crop machine when crops are inside the machine", () => {
    const [restricted] = hasRemoveRestriction("Crop Machine", "123", {
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
                startTime: Date.now(),
                readyAt: Date.now() + 1000,
              },
            ],
          },
        ],
      },
    });

    expect(restricted).toBe(true);
  });
});
