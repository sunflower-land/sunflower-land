import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState, PlacedItem } from "features/game/types/game";
import { collectComposterProduce } from "./collectComposterProduce";

const GAME_STATE: GameState = TEST_FARM;

describe("collectComposterProduce", () => {
  const dateNow = Date.now();

  it("throws an error if building does not exist", () => {
    expect(() =>
      collectComposterProduce({
        state: {
          ...GAME_STATE,
          buildings: {},
        },
        action: {
          type: "composterProduce.collected",
          building: "Basic Composter",
          buildingId: "123",
        },
        createdAt: Date.now(),
      })
    ).toThrow("Composter does not exist");
  });

  it("throws an error if building is not producing anything", () => {
    expect(() =>
      collectComposterProduce({
        state: {
          ...GAME_STATE,
          buildings: {
            "Basic Composter": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "composterProduce.collected",
          building: "Basic Composter",
          buildingId: "123",
        },
        createdAt: Date.now(),
      })
    ).toThrow("Composter is not producing anything");
  });

  it("throws an error if Produce is not ready", () => {
    expect(() =>
      collectComposterProduce({
        state: {
          ...GAME_STATE,
          buildings: {
            "Basic Composter": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: 0,
                readyAt: 0,
                producing: {
                  name: "Earthworm",
                  startedAt: dateNow - 10000,
                  readyAt: dateNow + 1000,
                },
              },
            ],
          },
        },
        action: {
          type: "composterProduce.collected",
          building: "Basic Composter",
          buildingId: "123",
        },
        createdAt: Date.now(),
      })
    ).toThrow("Produce is not ready");
  });

  it("removes the Produce from the building", () => {
    const basicComposter: PlacedItem = {
      id: "123",
      coordinates: { x: 1, y: 1 },
      createdAt: 0,
      readyAt: 0,
      producing: {
        name: "Earthworm",
        startedAt: dateNow - 10000,
        readyAt: dateNow - 1000,
      },
    };
    const state = collectComposterProduce({
      state: {
        ...GAME_STATE,
        buildings: {
          "Basic Composter": [
            basicComposter,
            {
              id: "2039",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "composterProduce.collected",
        building: "Basic Composter",
        buildingId: "123",
      },
      createdAt: Date.now(),
    });

    expect(state.buildings).toEqual({
      "Basic Composter": [
        {
          ...basicComposter,
          producing: undefined,
        },

        {
          id: "2039",
          coordinates: { x: 1, y: 1 },
          createdAt: 0,
          readyAt: 0,
        },
      ],
    });
  });

  it("adds the consumable to the inventory", () => {
    const state = collectComposterProduce({
      state: {
        ...GAME_STATE,
        balance: new Decimal(10),
        inventory: {
          Sunflower: new Decimal(22),
          Earthworm: new Decimal(0),
        },
        buildings: {
          "Basic Composter": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
              producing: {
                name: "Earthworm",
                startedAt: dateNow - 10000,
                readyAt: dateNow - 1000,
              },
            },
          ],
        },
      },
      action: {
        type: "composterProduce.collected",
        building: "Basic Composter",
        buildingId: "123",
      },
      createdAt: Date.now(),
    });

    expect(state.balance).toEqual(new Decimal(10));
    expect(state.inventory).toEqual({
      Earthworm: new Decimal(1),
      Sunflower: new Decimal(22),
    });
  });
});
