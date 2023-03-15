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
        item: "Sunflower Seed",
        game: TEST_FARM,
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents users from withdrawing tools", () => {
      const enabled = canWithdraw({
        item: "Axe",
        game: TEST_FARM,
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents users from withdrawing skills", () => {
      const enabled = canWithdraw({
        item: "Green Thumb",
        game: TEST_FARM,
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents users from withdrawing food items", () => {
      const enabled = canWithdraw({
        item: "Pumpkin Soup",
        game: TEST_FARM,
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a quest item being withdrawn", () => {
      const enabled = canWithdraw({
        item: "Ancient Goblin Sword",
        game: {
          ...TEST_FARM,
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents shovels from being withdrawn", () => {
      const enabled = canWithdraw({
        item: "Rusty Shovel",
        game: {
          ...TEST_FARM,
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevent a user to withdraw a human war banner", () => {
      const enabled = canWithdraw({
        item: "Human War Banner",
        game: {
          ...TEST_FARM,
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevent a user to withdraw a goblin war banner", () => {
      const enabled = canWithdraw({
        item: "Goblin War Banner",
        game: {
          ...TEST_FARM,
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevent a user to withdraw a building", () => {
      const enabled = canWithdraw({
        item: "Fire Pit",
        game: {
          ...TEST_FARM,
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing chickens", () => {
      const enabled = canWithdraw({
        item: "Chicken",
        game: {
          ...TEST_FARM,
          inventory: {
            Chicken: new Decimal(1),
          },
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing mutant chickens if some chicken is fed", () => {
      const enabled = canWithdraw({
        item: "Rich Chicken",
        game: {
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
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing chicken coop if some chicken is fed", () => {
      const enabled = canWithdraw({
        item: "Chicken Coop",
        game: {
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
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing rooster if some chicken is fed", () => {
      const enabled = canWithdraw({
        item: "Rooster",
        game: {
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
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing an easter bunny when in use", () => {
      const enabled = canWithdraw({
        item: "Easter Bunny",
        game: {
          ...TEST_FARM,
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
              crop: { name: "Carrot", plantedAt: Date.now(), amount: 1 },
            },
          },
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing victoria sisters when in use", () => {
      const enabled = canWithdraw({
        item: "Victoria Sisters",
        game: {
          ...TEST_FARM,
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
              crop: { name: "Pumpkin", plantedAt: Date.now(), amount: 1 },
            },
          },
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a golden cauliflower when in use", () => {
      const enabled = canWithdraw({
        item: "Golden Cauliflower",
        game: {
          ...TEST_FARM,
          plots: {
            0: {
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
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a parsnip in use", () => {
      const enabled = canWithdraw({
        item: "Mysterious Parsnip",
        game: {
          ...TEST_FARM,
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
              crop: { name: "Parsnip", plantedAt: Date.now(), amount: 1 },
            },
          },
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T1 scarecrow while they have crops", () => {
      const enabled = canWithdraw({
        item: "Nancy",
        game: {
          ...TEST_FARM,
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
              crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
            },
          },
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T2 scarecrow while they have crops", () => {
      const enabled = canWithdraw({
        item: "Scarecrow",
        game: {
          ...TEST_FARM,
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
              crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
            },
          },
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T3 scarecrow while they have crops", () => {
      const enabled = canWithdraw({
        item: "Kuebiko",
        game: {
          ...TEST_FARM,
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
              crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
            },
          },
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T1 beaver while trees are replenishing", () => {
      const enabled = canWithdraw({
        item: "Woody the Beaver",
        game: {
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
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T2 beaver while trees are replenishing", () => {
      const enabled = canWithdraw({
        item: "Apprentice Beaver",
        game: {
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
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T3 beaver while trees are replenishing", () => {
      const enabled = canWithdraw({
        item: "Foreman Beaver",
        game: {
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
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing kuebiko while they have seeds", () => {
      const enabled = canWithdraw({
        item: "Kuebiko",
        game: {
          ...TEST_FARM,
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
            },
          },
          inventory: {
            "Sunflower Seed": new Decimal(1),
          },
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing Rock Golem while they have replenishing stones", () => {
      const enabled = canWithdraw({
        item: "Rock Golem",
        game: {
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
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing Tunnel Mole while they have replenishing stones", () => {
      const enabled = canWithdraw({
        item: "Tunnel Mole",
        game: {
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
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing Rocky the Mole while they have replenishing iron", () => {
      const iron = canWithdraw({
        item: "Rocky the Mole",
        game: {
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
        },
      });

      expect(iron).toBeFalsy();
    });

    it("prevents a user from withdrawing Nugget while they have replenishing gold", () => {
      const gold = canWithdraw({
        item: "Nugget",
        game: {
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
        },
      });

      expect(gold).toBeFalsy();
    });

    it("prevents a user from withdrawing a placed collectible", () => {
      const enabled = canWithdraw({
        item: "Apprentice Beaver",
        game: {
          ...TEST_FARM,
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

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a collectible when a player has two and both are placed", () => {
      const enabled = canWithdraw({
        item: "Apprentice Beaver",
        game: {
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
              {
                id: "345",
                createdAt: 0,
                coordinates: { x: 1, y: 1 },
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a peeled potato when potato's are planted", () => {
      const enabled = canWithdraw({
        item: "Peeled Potato",
        game: {
          ...TEST_FARM,
          inventory: {
            "Peeled Potato": new Decimal(2),
          },
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
              crop: { name: "Potato", plantedAt: Date.now(), amount: 1 },
            },
          },
        },
      });

      expect(enabled).toBeFalsy();
    });
  });

  describe("enables", () => {
    it("enables users to withdraw crops", () => {
      const enabled = canWithdraw({
        item: "Sunflower",
        game: {
          ...TEST_FARM,
          inventory: {
            Sunflower: new Decimal(1),
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables users to withdraw resources", () => {
      const enabled = canWithdraw({
        item: "Wood",
        game: {
          ...TEST_FARM,
          inventory: {
            Wood: new Decimal(1),
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables users to withdraw flags", () => {
      const enabled = canWithdraw({
        item: "Goblin Flag",
        game: {
          ...TEST_FARM,
          inventory: {
            "Goblin Flag": new Decimal(1),
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables users to withdraw easter eggs", () => {
      const enabled = canWithdraw({
        item: "Red Egg",
        game: {
          ...TEST_FARM,
          inventory: {
            "Red Egg": new Decimal(1),
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables users to withdraw observatory", () => {
      const enabled = canWithdraw({
        item: "Observatory",
        game: {
          ...TEST_FARM,
          inventory: {
            Observatory: new Decimal(1),
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw an easter bunny when not in use", () => {
      const enabled = canWithdraw({
        item: "Easter Bunny",
        game: {
          ...TEST_FARM,
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
            },
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw victoria sisters when not in use", () => {
      const enabled = canWithdraw({
        item: "Victoria Sisters",
        game: {
          ...TEST_FARM,
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
            },
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a golden cauliflower when not in use", () => {
      const enabled = canWithdraw({
        item: "Golden Cauliflower",
        game: {
          ...TEST_FARM,
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
              crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
            },
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a mysterious parsnip when not in use", () => {
      const enabled = canWithdraw({
        item: "Mysterious Parsnip",
        game: {
          ...TEST_FARM,
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
              crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
            },
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T1 scarecrow when not in use", () => {
      const enabled = canWithdraw({
        item: "Nancy",
        game: {
          ...TEST_FARM,
          inventory: {
            Nancy: new Decimal(1),
          },
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
            },
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T2 scarecrow when not in use", () => {
      const enabled = canWithdraw({
        item: "Scarecrow",
        game: {
          ...TEST_FARM,
          inventory: {
            Scarecrow: new Decimal(1),
          },
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
            },
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T3 scarecrow when not in use", () => {
      const enabled = canWithdraw({
        item: "Kuebiko",
        game: {
          ...TEST_FARM,
          inventory: { Kuebiko: new Decimal(1) },
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
            },
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T1 beaver when not in use", () => {
      const enabled = canWithdraw({
        item: "Woody the Beaver",
        game: {
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
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T2 beaver when not in use", () => {
      const enabled = canWithdraw({
        item: "Apprentice Beaver",
        game: {
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
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T3 beaver when not in use", () => {
      const enabled = canWithdraw({
        item: "Foreman Beaver",
        game: {
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
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enable a user to withdraw kuebiko while they don't have seeds or crops", () => {
      const enabled = canWithdraw({
        item: "Kuebiko",
        game: {
          ...TEST_FARM,
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
            },
          },
          inventory: {
            Kuebiko: new Decimal(1),
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enable a user to withdraw Rock Golem while they don't have stones replenishing", () => {
      const enabled = canWithdraw({
        item: "Rock Golem",
        game: {
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
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enable a user to withdraw Tunnel Mole while they don't have stones replenishing", () => {
      const enabled = canWithdraw({
        item: "Tunnel Mole",
        game: {
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
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enable a user to withdraw Rocky the Mole while they don't have irons replenishing", () => {
      const iron = canWithdraw({
        item: "Rocky the Mole",
        game: {
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
        },
      });

      expect(iron).toBeTruthy();
    });

    it("enable a user to withdraw Nugget while they don't have stones replenishing", () => {
      const gold = canWithdraw({
        item: "Nugget",
        game: {
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
        },
      });

      expect(gold).toBeTruthy();
    });

    it("enables a user to withdraw mutant chickens as long as no chickens are fed", () => {
      const enabled = canWithdraw({
        item: "Rich Chicken",
        game: {
          ...TEST_FARM,
          inventory: {
            "Rich Chicken": new Decimal(1),
          },
          chickens: {},
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw chicken coop as long as no chickens are fed", () => {
      const enabled = canWithdraw({
        item: "Chicken Coop",
        game: {
          ...TEST_FARM,
          inventory: {
            "Chicken Coop": new Decimal(1),
          },
          chickens: {},
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw rooster as long as no chickens are fed", () => {
      const enabled = canWithdraw({
        item: "Rooster",
        game: {
          ...TEST_FARM,
          inventory: {
            Rooster: new Decimal(1),
          },
          chickens: {},
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw carrot sword as long as no crops are planted", () => {
      const enabled = canWithdraw({
        item: "Carrot Sword",
        game: {
          ...TEST_FARM,
          plots: {
            0: {
              x: -2,
              y: -1,
              height: 1,
              width: 1,
            },
          },
          inventory: {
            "Carrot Sword": new Decimal(1),
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a collectible that is not placed", () => {
      const enabled = canWithdraw({
        item: "Apprentice Beaver",
        game: {
          ...TEST_FARM,
          collectibles: {},
        },
      });

      expect(enabled).toBeTruthy();
    });

    // Hang over from previous bug where we were leaving an empty array against a collectible key if all were removed.
    it("enables a user to withdraw a collectible that is not placed but has a key in the db with empty array", () => {
      const enabled = canWithdraw({
        item: "Apprentice Beaver",
        game: {
          ...TEST_FARM,
          collectibles: {
            "Apprentice Beaver": [],
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a collectible when a player has two and one is placed", () => {
      const enabled = canWithdraw({
        item: "Apprentice Beaver",
        game: {
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

      expect(enabled).toBeTruthy();
    });
  });

  it("enables a user to withdraw a peeled potato when not in use", () => {
    const enabled = canWithdraw({
      item: "Peeled Potato",
      game: {
        ...TEST_FARM,
        inventory: {
          "Peeled Potato": new Decimal(2),
        },
        plots: {
          0: {
            x: -2,
            y: -1,
            height: 1,
            width: 1,
            crop: { name: "Sunflower", plantedAt: Date.now(), amount: 1 },
          },
        },
      },
    });

    expect(enabled).toBeTruthy();
  });

  it("prevents users from withdrawing fruits", () => {
    getKeys(FRUIT()).map((item) => {
      const enabled = canWithdraw({
        item: item,
        game: {
          ...TEST_FARM,
          inventory: {
            [item]: new Decimal(1),
          },
        },
      });

      expect(enabled).toBeFalsy();
    });
  });

  it("prevents users from withdrawing basic bear", () => {
    const enabled = canWithdraw({
      item: "Basic Bear",
      game: {
        ...TEST_FARM,
        inventory: {
          "Basic Bear": new Decimal(1),
        },
      },
    });

    expect(enabled).toBeFalsy();
  });

  it("allows users from withdrawing bears other than basic bear", () => {
    const enabled = canWithdraw({
      item: "Chef Bear",
      game: {
        ...TEST_FARM,
        inventory: {
          "Chef Bear": new Decimal(1),
        },
      },
    });

    expect(enabled).toBeTruthy();
  });
});
