import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { CONSUMABLES } from "features/game/types/consumables";
import { GameState } from "features/game/types/game";
import { cook, getReadyAt } from "./cook";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  balance: new Decimal(0),
  inventory: {},
};

describe("cook", () => {
  it("does not cook if building does not exist", () => {
    expect(() =>
      cook({
        state: GAME_STATE,
        action: {
          type: "recipe.cooked",
          item: "Boiled Egg",
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
                  name: "Boiled Egg",
                  readyAt: Date.now() + 60 * 1000,
                },
              },
            ],
          },
        },
        action: {
          type: "recipe.cooked",
          item: "Boiled Egg",
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
          item: "Boiled Egg",
          buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
        },
      })
    ).toThrow("Insufficient ingredient: Egg");
  });

  it("subtracts required ingredients from inventory", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: { Egg: new Decimal(2) },
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
        item: "Boiled Egg",
        buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
      },
    });

    expect(state.inventory["Egg"]).toEqual(new Decimal(1));
  });

  it("does not affect existing inventory", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: {
          Egg: new Decimal(2),
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
        item: "Boiled Egg",
        buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
      },
    });

    expect(state.inventory["Radish"]).toEqual(new Decimal(2));
    expect(state.inventory["Gold"]).toEqual(new Decimal(4));
  });

  it("does not cook an item that is not in stock", () => {
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
          item: "Boiled Egg",
          buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
        },
      })
    ).toThrow("Not enough stock");
  });

  it("removes the item from the stock amount", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: {
          Egg: new Decimal(2),
        },
        stock: {
          "Boiled Egg": new Decimal(2),
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
        item: "Boiled Egg",
        buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
      },
    });

    expect(state.stock["Boiled Egg"]).toEqual(new Decimal(1));
  });

  it("adds the crafting state to the building data structure", () => {
    const state = cook({
      state: {
        ...GAME_STATE,
        inventory: {
          Egg: new Decimal(2),
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
        item: "Boiled Egg",
        buildingId: "64eca77c-10fb-4088-a71f-3743b2ef6b16",
      },
    });

    expect(state.buildings["Fire Pit"]?.[0].crafting).toEqual(
      expect.objectContaining({
        name: "Boiled Egg",
        readyAt: expect.any(Number),
      })
    );
  });
});

describe("getReadyAt", () => {
  it("applies 20% speed boost with Rush Hour skill", () => {
    const now = Date.now();

    const time = getReadyAt({
      item: "Boiled Egg",
      skills: { "Rush Hour": 1 },
      createdAt: now,
    });

    const boost = CONSUMABLES["Boiled Egg"].cookingSeconds * 0.2;

    const readyAt =
      now + (CONSUMABLES["Boiled Egg"].cookingSeconds - boost) * 1000;

    expect(time).toEqual(readyAt);
  });
});
