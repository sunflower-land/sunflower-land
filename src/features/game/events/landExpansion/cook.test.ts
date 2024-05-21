import "lib/__mocks__/configMock";
import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { COOKABLES } from "features/game/types/consumables";
import { GameState } from "features/game/types/game";
import { cook, getReadyAt } from "./cook";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {},
};

describe("cook", () => {
  it("does not cook if building does not exist", () => {
    expect(() =>
      cook({
        state: {
          ...GAME_STATE,
          buildings: {},
        },
        action: {
          type: "recipe.cooked",
          item: "Boiled Eggs",
          buildingId: "123",
        },
      })
    ).toThrow(`Required building does not exist`);
  });

  it("does not cook if something is already cooking", () => {
    expect(() =>
      cook({
        state: {
          ...GAME_STATE,
          buildings: {
            "Fire Pit": [
              {
                coordinates: {
                  x: 2,
                  y: 3,
                },
                readyAt: 1660563190206,
                createdAt: 1660563160206,
                id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
                crafting: {
                  name: "Boiled Eggs",
                  readyAt: Date.now() + 60 * 1000,
                },
              },
            ],
          },
        },
        action: {
          type: "recipe.cooked",
          item: "Boiled Eggs",
          buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
        },
      })
    ).toThrow("Cooking already in progress");
  });

  it("does not cook if player does not have all the ingredients", () => {
    expect(() =>
      cook({
        state: {
          ...GAME_STATE,
          inventory: {},
          buildings: {
            "Fire Pit": [
              {
                coordinates: {
                  x: 2,
                  y: 3,
                },
                readyAt: 1660563190206,
                createdAt: 1660563160206,
                id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
              },
            ],
          },
        },
        action: {
          type: "recipe.cooked",
          item: "Boiled Eggs",
          buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
        },
      })
    ).toThrow("Insufficient ingredient: Egg");
  });

  it("subtracts required ingredients from inventory", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: { Egg: new Decimal(22) },
        buildings: {
          "Fire Pit": [
            {
              coordinates: {
                x: 2,
                y: 3,
              },
              readyAt: 1660563190206,
              createdAt: 1660563160206,
              id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Boiled Eggs",
        buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
      },
    });

    expect(state.inventory["Egg"]).toEqual(new Decimal(17));
  });

  it("does not affect existing inventory", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: {
          Egg: new Decimal(22),
          Radish: new Decimal(2),
          Gold: new Decimal(4),
        },
        buildings: {
          "Fire Pit": [
            {
              coordinates: {
                x: 2,
                y: 3,
              },
              readyAt: 1660563190206,
              createdAt: 1660563160206,
              id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Boiled Eggs",
        buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
      },
    });

    expect(state.inventory["Radish"]).toEqual(new Decimal(2));
    expect(state.inventory["Gold"]).toEqual(new Decimal(4));
  });

  it.skip("does not cook an item that is not in stock", () => {
    expect(() =>
      cook({
        state: {
          ...GAME_STATE,
          inventory: {
            Egg: new Decimal(2),
          },
          stock: {},
          buildings: {
            "Fire Pit": [
              {
                coordinates: {
                  x: 2,
                  y: 3,
                },
                readyAt: 1660563190206,
                createdAt: 1660563160206,
                id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
              },
            ],
          },
        },
        action: {
          type: "recipe.cooked",
          item: "Boiled Eggs",
          buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
        },
      })
    ).toThrow("Not enough stock");
  });

  it.skip("removes the item from the stock amount", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: {
          Egg: new Decimal(2),
        },
        stock: {
          "Boiled Eggs": new Decimal(2),
        },
        buildings: {
          "Fire Pit": [
            {
              coordinates: {
                x: 2,
                y: 3,
              },
              readyAt: 1660563190206,
              createdAt: 1660563160206,
              id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Boiled Eggs",
        buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
      },
    });

    expect(state.stock["Boiled Eggs"]).toEqual(new Decimal(1));
  });

  it("adds the crafting state to the building data structure", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: {
          Egg: new Decimal(20),
        },
        buildings: {
          "Fire Pit": [
            {
              coordinates: {
                x: 2,
                y: 3,
              },
              readyAt: 1660563190206,
              createdAt: 1660563160206,
              id: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
            },
          ],
        },
      },
      action: {
        type: "recipe.cooked",
        item: "Boiled Eggs",
        buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
      },
    });

    expect(state.buildings["Fire Pit"]?.[0].crafting).toEqual(
      expect.objectContaining({
        name: "Boiled Eggs",
        readyAt: expect.any(Number),
      })
    );
  });
});

describe("getReadyAt", () => {
  it("applies 10% speed boost with Rush Hour skill", () => {
    const now = Date.now();

    const time = getReadyAt({
      item: "Boiled Eggs",
      bumpkin: { ...INITIAL_BUMPKIN, skills: { "Rush Hour": 1 } },
      createdAt: now,
      game: {
        ...TEST_FARM,
        bumpkin: { ...INITIAL_BUMPKIN, skills: { "Rush Hour": 1 } },
      },
    });

    const boost = COOKABLES["Boiled Eggs"].cookingSeconds * 0.1;

    const readyAt =
      now + (COOKABLES["Boiled Eggs"].cookingSeconds - boost) * 1000;

    expect(time).toEqual(readyAt);
  });

  it("applies 10% speed boost with Rush Hour skill", () => {
    const now = Date.now();

    const time = getReadyAt({
      item: "Boiled Eggs",
      bumpkin: {
        ...INITIAL_BUMPKIN,
        equipped: { ...INITIAL_BUMPKIN.equipped, hat: "Luna's Hat" },
      },
      game: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: { ...INITIAL_BUMPKIN.equipped, hat: "Luna's Hat" },
        },
      },

      createdAt: now,
    });

    const boost = COOKABLES["Boiled Eggs"].cookingSeconds * 0.5;

    const readyAt =
      now + (COOKABLES["Boiled Eggs"].cookingSeconds - boost) * 1000;

    expect(time).toEqual(readyAt);
  });

  it("applies Time Warp Totem", () => {
    const now = Date.now();

    const time = getReadyAt({
      item: "Boiled Eggs",
      bumpkin: INITIAL_BUMPKIN,
      game: {
        ...TEST_FARM,
        collectibles: {
          "Time Warp Totem": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: now,
    });

    const boost = COOKABLES["Boiled Eggs"].cookingSeconds * 0.5;

    const readyAt =
      now + (COOKABLES["Boiled Eggs"].cookingSeconds - boost) * 1000;

    expect(time).toEqual(readyAt);
  });

  it("applies desert gnome boost", () => {
    const now = Date.now();

    const time = getReadyAt({
      item: "Boiled Eggs",
      bumpkin: INITIAL_BUMPKIN,
      createdAt: now,
      game: {
        ...TEST_FARM,
        collectibles: {
          "Desert Gnome": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: Date.now(),
              id: "1",
              readyAt: Date.now(),
            },
          ],
        },
      },
    });

    const boost = COOKABLES["Boiled Eggs"].cookingSeconds * 0.1;

    const readyAt =
      now + (COOKABLES["Boiled Eggs"].cookingSeconds - boost) * 1000;

    expect(time).toEqual(readyAt);
  });
});
