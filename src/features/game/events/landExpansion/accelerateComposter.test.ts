import { GameState } from "features/game/types/game";
import { accelerateComposter } from "./accelerateComposter";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";

const GAME_STATE: GameState = { ...TEST_FARM, bumpkin: INITIAL_BUMPKIN };

describe("accelerateComposter", () => {
  it("requires building exists", () => {
    expect(() =>
      accelerateComposter({
        state: {
          ...GAME_STATE,
          buildings: {},
        },
        action: {
          type: "compost.accelerated",
          building: "Compost Bin",
        },
        createdAt: Date.now(),
      })
    ).toThrow("Composter does not exist");
  });

  it("requires compost is producing", () => {
    expect(() =>
      accelerateComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Compost Bin": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 10000000,
                id: "123",
                readyAt: 10000000,
              },
            ],
          },
        },
        action: {
          type: "compost.accelerated",
          building: "Compost Bin",
        },
        createdAt: Date.now(),
      })
    ).toThrow("Composter is not producing");
  });

  it("requires compost is not complete", () => {
    expect(() =>
      accelerateComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Compost Bin": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 10000000,
                id: "123",
                readyAt: 10000000,
                producing: {
                  items: {},
                  readyAt: Date.now() - 500,
                  startedAt: Date.now() - 500000,
                },
              },
            ],
          },
        },
        action: {
          type: "compost.accelerated",
          building: "Compost Bin",
        },
        createdAt: Date.now(),
      })
    ).toThrow("Composter already done");
  });
  it("accelerates Compost Bin", () => {});
  it("accelerates Turbo Composter", () => {});
  it("accelerates Premium Composter", () => {});
});
