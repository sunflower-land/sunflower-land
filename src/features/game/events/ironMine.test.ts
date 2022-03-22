import Decimal from "decimal.js-light";
import { EMPTY, INITIAL_FARM } from "../lib/constants";
import { GameState } from "../types/game";
import { mineIron, IronMineAction } from "./ironMine";

const GAME_STATE: GameState = INITIAL_FARM;

describe("mineIron", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if no axes are left", () => {
    expect(() =>
      mineIron({
        state: EMPTY,
        action: {
          type: "iron.mined",
          index: 0,
        },
      })
    ).toThrow("No pickaxes left");
  });

  it("throws an error if iron does not exist", () => {
    expect(() =>
      mineIron({
        state: {
          ...GAME_STATE,
          inventory: {
            "Stone Pickaxe": new Decimal(2),
          },
        },
        action: {
          type: "iron.mined",
          index: 3,
        },
      })
    ).toThrow("No rock");
  });

  expect(() =>
    mineIron({
      state: {
        ...GAME_STATE,
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "iron.mined",
        index: -1,
      },
    })
  ).toThrow("No rock");

  it("throws an error if iron is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "iron.mined",
        index: 0,
      } as IronMineAction,
    };
    const game = mineIron(payload);

    // Try same payload
    expect(() =>
      mineIron({
        state: game,
        action: payload.action,
      })
    ).toThrow("Rock is still recovering");
  });

  it("mines iron", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Stone Pickaxe": new Decimal(1),
        },
      },
      action: {
        type: "iron.mined",
        index: 0,
      } as IronMineAction,
    };
    const game = mineIron(payload);

    expect(game.inventory["Stone Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Iron).toEqual(new Decimal(2));
  });

  it("mines iron after waiting", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "iron.mined",
        index: 0,
      } as IronMineAction,
    };
    let game = mineIron(payload);

    // 25 hours
    jest.advanceTimersByTime(25 * 60 * 60 * 1000);
    game = mineIron({
      ...payload,
      state: game,
    });

    expect(game.inventory["Stone Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Iron?.toNumber()).toBeGreaterThanOrEqual(2);
  });
});
