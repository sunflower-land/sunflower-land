import "lib/__mocks__/configMock.ts";
import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { canWithdraw } from "./bankUtils";

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

    it("[TEMP] prevents a user from withdrawing chickens", () => {
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

    it("prevents a user from withdrawing an easter bunny when in use", () => {
      const enabled = canWithdraw({
        item: "Easter Bunny",
        game: {
          ...TEST_FARM,
          fields: {
            0: {
              name: "Carrot",
              plantedAt: Date.now(),
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
          fields: {
            0: {
              name: "Pumpkin",
              plantedAt: Date.now(),
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
          fields: {
            0: {
              name: "Cauliflower",
              plantedAt: Date.now(),
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
          fields: {
            0: {
              name: "Parsnip",
              plantedAt: Date.now(),
            },
          },
        },
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T1 scarecrow while they have crops", () => {
      const enabled = canWithdraw({
        item: "Nancy",
        game: TEST_FARM,
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T2 scarecrow while they have crops", () => {
      const enabled = canWithdraw({
        item: "Scarecrow",
        game: TEST_FARM,
      });

      expect(enabled).toBeFalsy();
    });

    it("prevents a user from withdrawing a T3 scarecrow while they have crops", () => {
      const enabled = canWithdraw({
        item: "Kuebiko",
        game: TEST_FARM,
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
              // Just been chopped
              choppedAt: Date.now(),
              wood: new Decimal(3),
              x: 0,
              y: 0,
              width: 2,
              height: 2,
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
              // Just been chopped
              choppedAt: Date.now(),
              wood: new Decimal(3),
              x: 0,
              y: 0,
              width: 2,
              height: 2,
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
              // Just been chopped
              choppedAt: Date.now(),
              wood: new Decimal(3),
              x: 0,
              y: 0,
              width: 2,
              height: 2,
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
          fields: {},
          inventory: {
            "Sunflower Seed": new Decimal(1),
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
              // Just been mined
              minedAt: Date.now(),
              amount: new Decimal(3),
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
              // Just been mined
              minedAt: Date.now(),
              amount: new Decimal(2),
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
              // Just been mined
              minedAt: Date.now(),
              amount: new Decimal(1),
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

    it("enables a user to withdraw an easter bunny when not in use", () => {
      const enabled = canWithdraw({
        item: "Easter Bunny",
        game: {
          ...TEST_FARM,
          fields: {},
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw victoria sisters when not in use", () => {
      const enabled = canWithdraw({
        item: "Victoria Sisters",
        game: {
          ...TEST_FARM,
          fields: {},
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a golden cauliflower when not in use", () => {
      const enabled = canWithdraw({
        item: "Golden Cauliflower",
        game: {
          ...TEST_FARM,
          fields: {},
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a mysterious parsnip when not in use", () => {
      const enabled = canWithdraw({
        item: "Mysterious Parsnip",
        game: {
          ...TEST_FARM,
          fields: {},
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T1 scarecrow when not in use", () => {
      const enabled = canWithdraw({
        item: "Nancy",
        game: {
          ...TEST_FARM,
          fields: {},
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T2 scarecrow when not in use", () => {
      const enabled = canWithdraw({
        item: "Scarecrow",
        game: {
          ...TEST_FARM,
          fields: {},
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T3 scarecrow when not in use", () => {
      const enabled = canWithdraw({
        item: "Kuebiko",
        game: {
          ...TEST_FARM,
          fields: {},
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enables a user to withdraw a T1 beaver when not in use", () => {
      const enabled = canWithdraw({
        item: "Woody the Beaver",
        game: {
          ...TEST_FARM,
          trees: {
            0: {
              // ready to be chopped
              choppedAt: 0,
              wood: new Decimal(3),
              x: 0,
              y: 0,
              width: 2,
              height: 2,
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
          trees: {
            0: {
              // ready to be chopped
              choppedAt: 0,
              wood: new Decimal(3),
              x: 0,
              y: 0,
              width: 2,
              height: 2,
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
          trees: {
            0: {
              // ready to be chopped
              choppedAt: 0,
              wood: new Decimal(3),
              x: 0,
              y: 0,
              width: 2,
              height: 2,
            },
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enable a user to withdraw kuebiko while they dont have seeds or crops", () => {
      const enabled = canWithdraw({
        item: "Kuebiko",
        game: {
          ...TEST_FARM,
          fields: {},
          inventory: {},
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enable a user to withdraw Tunnel Mole while they dont have stones replenishing", () => {
      const enabled = canWithdraw({
        item: "Tunnel Mole",
        game: {
          ...TEST_FARM,
          stones: {
            0: {
              // Available to mine
              minedAt: 0,
              amount: new Decimal(3),
            },
          },
        },
      });

      expect(enabled).toBeTruthy();
    });

    it("enable a user to withdraw Rocky the Mole while they dont have irons replenishing", () => {
      const iron = canWithdraw({
        item: "Rocky the Mole",
        game: {
          ...TEST_FARM,
          iron: {
            0: {
              // Available to mine
              minedAt: 0,
              amount: new Decimal(2),
            },
          },
        },
      });

      expect(iron).toBeTruthy();
    });

    it("enable a user to withdraw Nugget while they dont have stones replenishing", () => {
      const gold = canWithdraw({
        item: "Nugget",
        game: {
          ...TEST_FARM,
          gold: {
            0: {
              // Available to mine
              minedAt: 0,
              amount: new Decimal(2),
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
  });
});
