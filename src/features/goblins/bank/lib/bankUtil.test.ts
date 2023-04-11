import "lib/__mocks__/configMock.ts";
import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { canWithdraw } from "./bankUtils";
import { FRUIT } from "features/game/types/fruits";
import { getKeys } from "features/game/types/craftables";

describe("canWithdraw", () => {
  describe("prevents", () => {
    it("prevents users from withdrawing seeds", () => {
      const enabled = canWithdraw({
        itemName: "Sunflower Seed",
        gameState: {
          ...TEST_FARM,
          inventory: { "Sunflower Seed": new Decimal(1) },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents users from withdrawing tools", () => {
      const enabled = canWithdraw({
        itemName: "Axe",
        gameState: { ...TEST_FARM, inventory: { Axe: new Decimal(1) } },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents users from withdrawing skills", () => {
      const enabled = canWithdraw({
        itemName: "Green Thumb",
        gameState: {
          ...TEST_FARM,
          inventory: { "Green Thumb": new Decimal(1) },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents users from withdrawing food items", () => {
      const enabled = canWithdraw({
        itemName: "Pumpkin Soup",
        gameState: {
          ...TEST_FARM,
          inventory: { "Pumpkin Soup": new Decimal(1) },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a quest item being withdrawn", () => {
      const enabled = canWithdraw({
        itemName: "Ancient Goblin Sword",
        gameState: {
          ...TEST_FARM,
          inventory: { "Ancient Goblin Sword": new Decimal(1) },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents shovels from being withdrawn", () => {
      const enabled = canWithdraw({
        itemName: "Rusty Shovel",
        gameState: {
          ...TEST_FARM,
          inventory: { "Rusty Shovel": new Decimal(1) },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevent a user to withdraw a human war banner", () => {
      const enabled = canWithdraw({
        itemName: "Human War Banner",
        gameState: {
          ...TEST_FARM,
          inventory: { "Human War Banner": new Decimal(1) },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevent a user to withdraw a goblin war banner", () => {
      const enabled = canWithdraw({
        itemName: "Goblin War Banner",
        gameState: {
          ...TEST_FARM,
          inventory: { "Goblin War Banner": new Decimal(1) },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevent a user to withdraw a building", () => {
      const enabled = canWithdraw({
        itemName: "Fire Pit",
        gameState: {
          ...TEST_FARM,
          inventory: { "Fire Pit": new Decimal(1) },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing chickens", () => {
      const enabled = canWithdraw({
        itemName: "Chicken",
        gameState: {
          ...TEST_FARM,
          inventory: { Chicken: new Decimal(1) },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing mutant chickens if some chicken is fed", () => {
      const enabled = canWithdraw({
        itemName: "Rich Chicken",
        gameState: {
          ...TEST_FARM,
          inventory: { "Rich Chicken": new Decimal(1) },
          chickens: {
            1: {
              multiplier: 1,
              fedAt: Date.now(),
            },
          },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing chicken coop if some chicken is fed", () => {
      const enabled = canWithdraw({
        itemName: "Chicken Coop",
        gameState: {
          ...TEST_FARM,
          inventory: { "Chicken Coop": new Decimal(1) },
          chickens: {
            1: {
              multiplier: 1,
              fedAt: Date.now(),
            },
          },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing rooster if some chicken is fed", () => {
      const enabled = canWithdraw({
        itemName: "Rooster",
        gameState: {
          ...TEST_FARM,
          inventory: { Rooster: new Decimal(1) },
          chickens: {
            1: {
              multiplier: 1,
              fedAt: Date.now(),
            },
          },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing an easter bunny when in use", () => {
      const enabled = canWithdraw({
        itemName: "Easter Bunny",
        gameState: {
          ...TEST_FARM,
          inventory: { "Easter Bunny": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing victoria sisters when in use", () => {
      const enabled = canWithdraw({
        itemName: "Victoria Sisters",
        gameState: {
          ...TEST_FARM,
          inventory: { "Victoria Sisters": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a golden cauliflower when in use", () => {
      const enabled = canWithdraw({
        itemName: "Golden Cauliflower",
        gameState: {
          ...TEST_FARM,
          inventory: { "Golden Cauliflower": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("enables a user to withdraw the second golden cauliflower if the first golden cauliflower when in use", () => {
      const enabled = canWithdraw({
        itemName: "Golden Cauliflower",
        gameState: {
          ...TEST_FARM,
          inventory: { "Golden Cauliflower": new Decimal(2) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("prevents a user from withdrawing all golden cauliflowers if one golden cauliflower when in use", () => {
      const enabled = canWithdraw({
        itemName: "Golden Cauliflower",
        gameState: {
          ...TEST_FARM,
          inventory: { "Golden Cauliflower": new Decimal(2) },
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
        },
        selectedAmont: new Decimal(1),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a parsnip in use", () => {
      const enabled = canWithdraw({
        itemName: "Mysterious Parsnip",
        gameState: {
          ...TEST_FARM,
          inventory: { "Mysterious Parsnip": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T1 scarecrow while they have crops", () => {
      const enabled = canWithdraw({
        itemName: "Nancy",
        gameState: {
          ...TEST_FARM,
          inventory: { Nancy: new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T2 scarecrow while they have crops", () => {
      const enabled = canWithdraw({
        itemName: "Scarecrow",
        gameState: {
          ...TEST_FARM,
          inventory: { Scarecrow: new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T3 scarecrow while they have crops", () => {
      const enabled = canWithdraw({
        itemName: "Kuebiko",
        gameState: {
          ...TEST_FARM,
          inventory: { Kuebiko: new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T1 beaver while trees are replenishing", () => {
      const enabled = canWithdraw({
        itemName: "Woody the Beaver",
        gameState: {
          ...TEST_FARM,
          inventory: { "Woody the Beaver": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T2 beaver while trees are replenishing", () => {
      const enabled = canWithdraw({
        itemName: "Apprentice Beaver",
        gameState: {
          ...TEST_FARM,
          inventory: { "Apprentice Beaver": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T3 beaver while trees are replenishing", () => {
      const enabled = canWithdraw({
        itemName: "Foreman Beaver",
        gameState: {
          ...TEST_FARM,
          inventory: { "Foreman Beaver": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing kuebiko while they have seeds", () => {
      const enabled = canWithdraw({
        itemName: "Kuebiko",
        gameState: {
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
            "Sunflower Seed": new Decimal(1),
          },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing Rock Golem while they have replenishing stones", () => {
      const enabled = canWithdraw({
        itemName: "Rock Golem",
        gameState: {
          ...TEST_FARM,
          inventory: { "Rock Golem": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing Tunnel Mole while they have replenishing stones", () => {
      const enabled = canWithdraw({
        itemName: "Tunnel Mole",
        gameState: {
          ...TEST_FARM,
          inventory: { "Tunnel Mole": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing Rocky the Mole while they have replenishing iron", () => {
      const iron = canWithdraw({
        itemName: "Rocky the Mole",
        gameState: {
          ...TEST_FARM,
          inventory: { "Rocky the Mole": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(iron).toBeFalsy();
    });

    it("prevents a user from withdrawing Nugget while they have replenishing gold", () => {
      const gold = canWithdraw({
        itemName: "Nugget",
        gameState: {
          ...TEST_FARM,
          inventory: { Nugget: new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(gold).toBeFalsy();
    });

    it("prevents a user from withdrawing a placed collectible", () => {
      const enabled = canWithdraw({
        itemName: "Apprentice Beaver",
        gameState: {
          ...TEST_FARM,
          inventory: { "Apprentice Beaver": new Decimal(0) },
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
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a collectible when a player has two and both are placed", () => {
      const enabled = canWithdraw({
        itemName: "Apprentice Beaver",
        gameState: {
          ...TEST_FARM,
          inventory: { "Apprentice Beaver": new Decimal(0) },
          collectibles: {
            "Apprentice Beaver": [
              {
                id: "123",
                createdAt: 0,
                coordinates: { x: 1, y: 1 },
                readyAt: 0,
              },
              {
                id: "345",
                createdAt: 0,
                coordinates: { x: 1, y: 1 },
                readyAt: 0,
              },
            ],
          },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a peeled potato when potatoes are planted", () => {
      const enabled = canWithdraw({
        itemName: "Peeled Potato",
        gameState: {
          ...TEST_FARM,
          inventory: { "Peeled Potato": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });
  });

  describe("enables", () => {
    it("enables users to withdraw crops", () => {
      const enabled = canWithdraw({
        itemName: "Sunflower",
        gameState: {
          ...TEST_FARM,
          inventory: { Sunflower: new Decimal(1) },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables users to withdraw resources", () => {
      const enabled = canWithdraw({
        itemName: "Wood",
        gameState: {
          ...TEST_FARM,
          inventory: { Wood: new Decimal(1) },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables users to withdraw flags", () => {
      const enabled = canWithdraw({
        itemName: "Goblin Flag",
        gameState: {
          ...TEST_FARM,
          inventory: { "Goblin Flag": new Decimal(1) },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables users to withdraw observatory", () => {
      const enabled = canWithdraw({
        itemName: "Observatory",
        gameState: {
          ...TEST_FARM,
          inventory: { Observatory: new Decimal(1) },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw an easter bunny when not in use", () => {
      const enabled = canWithdraw({
        itemName: "Easter Bunny",
        gameState: {
          ...TEST_FARM,
          inventory: { "Easter Bunny": new Decimal(1) },
          crops: {
            0: {
              createdAt: Date.now(),
              x: -2,
              y: -1,
              height: 1,
              width: 1,
            },
          },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw victoria sisters when not in use", () => {
      const enabled = canWithdraw({
        itemName: "Victoria Sisters",
        gameState: {
          ...TEST_FARM,
          inventory: { "Victoria Sisters": new Decimal(1) },
          crops: {
            0: {
              createdAt: Date.now(),
              x: -2,
              y: -1,
              height: 1,
              width: 1,
            },
          },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a golden cauliflower when not in use", () => {
      const enabled = canWithdraw({
        itemName: "Golden Cauliflower",
        gameState: {
          ...TEST_FARM,
          inventory: { "Golden Cauliflower": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a mysterious parsnip when not in use", () => {
      const enabled = canWithdraw({
        itemName: "Mysterious Parsnip",
        gameState: {
          ...TEST_FARM,
          inventory: { "Mysterious Parsnip": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T1 scarecrow when not in use", () => {
      const enabled = canWithdraw({
        itemName: "Nancy",
        gameState: {
          ...TEST_FARM,
          inventory: { Nancy: new Decimal(1) },
          crops: {
            0: {
              createdAt: Date.now(),
              x: -2,
              y: -1,
              height: 1,
              width: 1,
            },
          },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T2 scarecrow when not in use", () => {
      const enabled = canWithdraw({
        itemName: "Scarecrow",
        gameState: {
          ...TEST_FARM,
          inventory: { Scarecrow: new Decimal(1) },
          crops: {
            0: {
              createdAt: Date.now(),
              x: -2,
              y: -1,
              height: 1,
              width: 1,
            },
          },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T3 scarecrow when not in use", () => {
      const enabled = canWithdraw({
        itemName: "Kuebiko",
        gameState: {
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T1 beaver when not in use", () => {
      const enabled = canWithdraw({
        itemName: "Woody the Beaver",
        gameState: {
          ...TEST_FARM,
          inventory: { "Woody the Beaver": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T2 beaver when not in use", () => {
      const enabled = canWithdraw({
        itemName: "Apprentice Beaver",
        gameState: {
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T3 beaver when not in use", () => {
      const enabled = canWithdraw({
        itemName: "Foreman Beaver",
        gameState: {
          ...TEST_FARM,
          inventory: { "Foreman Beaver": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enable a user to withdraw kuebiko while they don't have seeds or crops", () => {
      const enabled = canWithdraw({
        itemName: "Kuebiko",
        gameState: {
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enable a user to withdraw Rock Golem while they don't have stones replenishing", () => {
      const enabled = canWithdraw({
        itemName: "Rock Golem",
        gameState: {
          ...TEST_FARM,
          inventory: { "Rock Golem": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enable a user to withdraw Tunnel Mole while they don't have stones replenishing", () => {
      const enabled = canWithdraw({
        itemName: "Tunnel Mole",
        gameState: {
          ...TEST_FARM,
          inventory: { "Tunnel Mole": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enable a user to withdraw Rocky the Mole while they don't have irons replenishing", () => {
      const iron = canWithdraw({
        itemName: "Rocky the Mole",
        gameState: {
          ...TEST_FARM,
          inventory: { "Rocky the Mole": new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(iron).toBeTruthy();
    });

    it("enable a user to withdraw Nugget while they don't have stones replenishing", () => {
      const gold = canWithdraw({
        itemName: "Nugget",
        gameState: {
          ...TEST_FARM,
          inventory: { Nugget: new Decimal(1) },
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
        },
        selectedAmont: new Decimal(0),
      });

      expect(gold).toBeTruthy();
    });

    it("enables a user to withdraw mutant chickens as long as no chickens are fed", () => {
      const enabled = canWithdraw({
        itemName: "Rich Chicken",
        gameState: {
          ...TEST_FARM,
          inventory: { "Rich Chicken": new Decimal(1) },
          chickens: {},
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw chicken coop as long as no chickens are fed", () => {
      const enabled = canWithdraw({
        itemName: "Chicken Coop",
        gameState: {
          ...TEST_FARM,
          inventory: { "Chicken Coop": new Decimal(1) },
          chickens: {},
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw rooster as long as no chickens are fed", () => {
      const enabled = canWithdraw({
        itemName: "Rooster",
        gameState: {
          ...TEST_FARM,
          inventory: { Rooster: new Decimal(1) },
          chickens: {},
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw carrot sword as long as no crops are planted", () => {
      const enabled = canWithdraw({
        itemName: "Carrot Sword",
        gameState: {
          ...TEST_FARM,
          inventory: { "Carrot Sword": new Decimal(1) },
          crops: {
            0: {
              createdAt: Date.now(),
              x: -2,
              y: -1,
              height: 1,
              width: 1,
            },
          },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a collectible that is not placed", () => {
      const enabled = canWithdraw({
        itemName: "Apprentice Beaver",
        gameState: {
          ...TEST_FARM,
          inventory: { "Apprentice Beaver": new Decimal(1) },
          collectibles: {},
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    // Hang over from previous bug where we were leaving an empty array against a collectible key if all were removed.
    it("enables a user to withdraw a collectible that is not placed but has a key in the db with empty array", () => {
      const enabled = canWithdraw({
        itemName: "Apprentice Beaver",
        gameState: {
          ...TEST_FARM,
          inventory: { "Apprentice Beaver": new Decimal(1) },
          collectibles: {
            "Apprentice Beaver": [],
          },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a collectible when a player has two and one is placed", () => {
      const enabled = canWithdraw({
        itemName: "Apprentice Beaver",
        gameState: {
          ...TEST_FARM,
          inventory: { "Apprentice Beaver": new Decimal(2) },
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
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeTruthy();
    });
  });

  it("enables a user to withdraw a peeled potato when not in use", () => {
    const enabled = canWithdraw({
      itemName: "Peeled Potato",
      gameState: {
        ...TEST_FARM,
        inventory: { "Peeled Potato": new Decimal(2) },
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
      },
      selectedAmont: new Decimal(0),
    });

    expect(enabled).toBeTruthy();
  });

  it("prevents users from withdrawing fruits", () => {
    getKeys(FRUIT()).map((item) => {
      const enabled = canWithdraw({
        itemName: item,
        gameState: {
          ...TEST_FARM,
          inventory: { [item]: new Decimal(1) },
        },
        selectedAmont: new Decimal(0),
      });

      expect(enabled).toBeFalsy();
    });
  });

  it("prevents users from withdrawing easter eggs", () => {
    const enabled = canWithdraw({
      itemName: "Red Egg",
      gameState: {
        ...TEST_FARM,
        inventory: { "Red Egg": new Decimal(1) },
      },
      selectedAmont: new Decimal(0),
    });

    expect(enabled).toBeFalsy();
  });

  it("prevents users from withdrawing basic bear", () => {
    const enabled = canWithdraw({
      itemName: "Basic Bear",
      gameState: {
        ...TEST_FARM,
        inventory: { "Basic Bear": new Decimal(1) },
      },
      selectedAmont: new Decimal(0),
    });

    expect(enabled).toBeFalsy();
  });

  it("allows users from withdrawing bears other than basic bear", () => {
    const enabled = canWithdraw({
      itemName: "Chef Bear",
      gameState: {
        ...TEST_FARM,
        inventory: { "Chef Bear": new Decimal(1) },
      },
      selectedAmont: new Decimal(0),
    });

    expect(enabled).toBeTruthy();
  });
});
