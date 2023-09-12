import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { startBasicComposter } from "./startBasicComposter";

const GAME_STATE: GameState = TEST_FARM;

describe("start BasicComposter", () => {
  const dateNow = Date.now();

  it("throws an error if Composter does not exist", () => {
    expect(() =>
      startBasicComposter({
        state: GAME_STATE,
        action: { type: "basicComposter.started" },
      })
    ).toThrow("Composter does not exist");
  });

  it("throws an error if Basic Composter is already started", () => {
    expect(() =>
      startBasicComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Basic Composter": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                producing: {
                  name: "Earthworm",
                  startedAt: dateNow - 10000,
                  readyAt: dateNow + 1000,
                },
              },
            ],
          },
        },
        action: { type: "basicComposter.started" },
      })
    ).toThrow("Composter is already composting");
  });

  it("throws an error if the user does not have the requirements", () => {
    expect(() =>
      startBasicComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Basic Composter": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                producing: {
                  name: "Earthworm",
                  startedAt: dateNow - 10000,
                  readyAt: dateNow - 1000,
                },
              },
            ],
          },
        },
        action: { type: "basicComposter.started" },
      })
    ).toThrow("Missing requirements");
  });

  it("removes ingredients from inventory", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Sunflower: new Decimal(5),
        Pumpkin: new Decimal(3),
        Carrot: new Decimal(2),
      },
      buildings: {
        "Basic Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            producing: {
              name: "Earthworm",
              startedAt: dateNow - 10000,
              readyAt: dateNow - 1000,
            },
          },
        ],
      },
    };

    const newState = startBasicComposter({
      state,
      action: { type: "basicComposter.started" },
    });

    expect(newState.inventory.Sunflower).toStrictEqual(new Decimal(0));
    expect(newState.inventory.Pumpkin).toStrictEqual(new Decimal(0));
    expect(newState.inventory.Carrot).toStrictEqual(new Decimal(0));
  });

  it("starts BasicComposters", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Sunflower: new Decimal(5),
        Pumpkin: new Decimal(3),
        Carrot: new Decimal(2),
      },
      buildings: {
        "Basic Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            producing: {
              name: "Earthworm",
              startedAt: dateNow - 10000,
              readyAt: dateNow - 1000,
            },
          },
        ],
      },
    };

    const newState = startBasicComposter({
      createdAt: dateNow,
      state,
      action: { type: "basicComposter.started" },
    });

    expect(
      newState.buildings["Basic Composter"]?.[0].producing?.startedAt
    ).toBe(dateNow);
    expect(newState.buildings["Basic Composter"]?.[0].producing?.readyAt).toBe(
      dateNow + 6 * 60 * 60 * 1000
    );
  });
});
