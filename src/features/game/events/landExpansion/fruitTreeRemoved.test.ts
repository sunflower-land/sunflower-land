import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { removeFruitTree } from "./fruitTreeRemoved";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  inventory: {
    Wood: new Decimal(1),
    Axe: new Decimal(1),
  },
  expansions: [
    ...TEST_FARM.expansions,
    {
      fruitPatches: {
        0: {
          fruit: {
            name: "Apple",
            amount: 1,
            plantedAt: 123,
            harvestedAt: 0,
            harvestsLeft: 0,
          },
          x: -2,
          y: 0,
          height: 1,
          width: 1,
        },
        1: {
          x: -2,
          y: 0,
          height: 1,
          width: 1,
        },
        2: {
          fruit: {
            name: "Blueberry",
            amount: 1,
            plantedAt: 123,
            harvestedAt: 0,
            harvestsLeft: 0,
          },
          x: -2,
          y: 0,
          height: 1,
          width: 1,
        },
      },
      createdAt: 234,
      readyAt: 0,
    },
  ],
};

describe("fruitTreeRemoved", () => {
  it("throws an error if the player doesn't have a bumpkin", () => {
    expect(() =>
      removeFruitTree({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
        },
        action: {
          type: "fruitTree.removed",
          expansionIndex: 3,
          index: 0,
          selectedItem: "Axe",
        },
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("does not remove fruit tree on a non existent expansion", () => {
    expect(() =>
      removeFruitTree({
        state: { ...GAME_STATE, expansions: [] },
        action: {
          type: "fruitTree.removed",
          expansionIndex: 3,
          index: 0,
          selectedItem: "Axe",
        },
      })
    ).toThrow("Expansion does not exist");
  });

  it("does not remove on a an expansion with no fruit patches", () => {
    expect(() =>
      removeFruitTree({
        state: GAME_STATE,
        action: {
          type: "fruitTree.removed",
          index: 0,
          expansionIndex: 0,
          selectedItem: "Axe",
        },
      })
    ).toThrow("Expansion does not have any fruit patches");
  });

  it("does not remove on non-existent fruit patch", () => {
    expect(() =>
      removeFruitTree({
        state: GAME_STATE,
        action: {
          type: "fruitTree.removed",
          index: -1,
          expansionIndex: 3,
          selectedItem: "Axe",
        },
      })
    ).toThrow("Fruit patch does not exist");
  });

  it("does not remove empty air", () => {
    expect(() =>
      removeFruitTree({
        state: GAME_STATE,
        action: {
          type: "fruitTree.removed",
          index: 1,
          expansionIndex: 3,
          selectedItem: "Axe",
        },
      })
    ).toThrow("Nothing was planted");
  });

  it("does not remove if harvest is available", () => {
    expect(() =>
      removeFruitTree({
        state: {
          ...GAME_STATE,
          expansions: [
            {
              fruitPatches: {
                0: {
                  fruit: {
                    name: "Apple",
                    amount: 1,
                    plantedAt: 123,
                    harvestedAt: 0,
                    harvestsLeft: 3,
                  },
                  x: -2,
                  y: 0,
                  height: 1,
                  width: 1,
                },
              },
              createdAt: 234,
              readyAt: 0,
            },
          ],
        },
        action: {
          type: "fruitTree.removed",
          index: 0,
          expansionIndex: 0,
          selectedItem: "Axe",
        },
      })
    ).toThrow("Fruit is still available");
  });

  it("removes the dead tree", () => {
    const state = removeFruitTree({
      state: GAME_STATE,
      action: {
        type: "fruitTree.removed",
        index: 0,
        expansionIndex: 3,
        selectedItem: "Axe",
      },
    });

    const fruitAfterChop = state.expansions[3].fruitPatches?.[1].fruit;
    expect(fruitAfterChop).toBeUndefined();

    expect(state.inventory.Wood).toStrictEqual(new Decimal(2));
  });

  it("throws an error if axe is not selected", () => {
    expect(() =>
      removeFruitTree({
        state: {
          ...GAME_STATE,
        },
        createdAt: Date.now(),
        action: {
          type: "fruitTree.removed",
          selectedItem: "Sunflower Statue",
          expansionIndex: 3,
          index: 0,
        },
      })
    ).toThrow("No axe");
  });

  it("throws an error if no axes are left", () => {
    expect(() =>
      removeFruitTree({
        state: { ...GAME_STATE, inventory: { Axe: new Decimal(0) } },
        createdAt: Date.now(),
        action: {
          type: "fruitTree.removed",
          selectedItem: "Axe",
          expansionIndex: 3,
          index: 0,
        },
      })
    ).toThrow("No axes left");
  });

  it("deducts ONE axe from inventory", () => {
    const state = removeFruitTree({
      state: GAME_STATE,
      action: {
        type: "fruitTree.removed",
        index: 0,
        expansionIndex: 3,
        selectedItem: "Axe",
      },
    });

    expect(state.inventory.Axe).toStrictEqual(new Decimal(0));
  });

  it("does not require an axe for Apples when Foreman Beaver is placed and ready", () => {
    const state = removeFruitTree({
      state: {
        ...GAME_STATE,
        collectibles: {
          "Foreman Beaver": [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 1, y: 1 },
              // Ready at < now
              readyAt: Date.now() - 5 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "fruitTree.removed",
        index: 0,
        expansionIndex: 3,
        selectedItem: "Sunflower",
      },
    });

    expect(state.inventory.Axe).toStrictEqual(new Decimal(1));
  });

  it("requires an axe for Blueberries when Foreman Beaver is placed and ready", () => {
    const state = removeFruitTree({
      state: {
        ...GAME_STATE,
        collectibles: {
          "Foreman Beaver": [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 1, y: 1 },
              // Ready at < now
              readyAt: Date.now() - 5 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "fruitTree.removed",
        index: 2,
        expansionIndex: 3,
        selectedItem: "Axe",
      },
    });

    expect(state.inventory.Axe).toStrictEqual(new Decimal(0));
  });

  it("throws an error for Blueberries if no Axe and when Foreman Beaver is placed and ready", async () => {
    expect(() =>
      removeFruitTree({
        state: {
          ...GAME_STATE,
          inventory: { Axe: new Decimal(0) },
          collectibles: {
            "Foreman Beaver": [
              {
                id: "123",
                createdAt: Date.now(),
                coordinates: { x: 1, y: 1 },
                // Ready at < now
                readyAt: Date.now() - 5 * 60 * 1000,
              },
            ],
          },
        },
        createdAt: Date.now(),
        action: {
          type: "fruitTree.removed",
          selectedItem: "Axe",
          expansionIndex: 3,
          index: 2,
        },
      })
    ).toThrow("No axes left");
  });
});
