import Decimal from "decimal.js-light";
import { EMPTY, INITIAL_FARM } from "../lib/constants";
import { GameState } from "../types/game";
import { mineGold, GoldMineAction } from "./goldMine";

const GAME_STATE: GameState = INITIAL_FARM;

describe("mineGold", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if no axes are left", () => {
    expect(() =>
      mineGold({
        state: EMPTY,
        action: {
          type: "gold.mined",
          index: 0,
        },
      })
    ).toThrow("No pickaxes left");
  });

  it("throws an error if Gold does not exist", () => {
    expect(() =>
      mineGold({
        state: {
          ...GAME_STATE,
          inventory: {
            "Iron Pickaxe": new Decimal(2),
          },
        },
        action: {
          type: "gold.mined",
          index: 3,
        },
      })
    ).toThrow("No rock");
  });

  expect(() =>
    mineGold({
      state: {
        ...GAME_STATE,
        inventory: {
          "Iron Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "gold.mined",
        index: -1,
      },
    })
  ).toThrow("No rock");

  it("throws an error if Gold is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Iron Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "gold.mined",
        index: 0,
      } as GoldMineAction,
    };
    const game = mineGold(payload);

    // Try same payload
    expect(() =>
      mineGold({
        state: game,
        action: payload.action,
      })
    ).toThrow("Rock is still recovering");
  });

  it("mines Gold", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
        },
      },
      action: {
        type: "gold.mined",
        index: 0,
      } as GoldMineAction,
    };
    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(2));
  });

  it("mines Gold after waiting", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Iron Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "gold.mined",
        index: 0,
      } as GoldMineAction,
    };
    let game = mineGold(payload);

    // 25 hours
    jest.advanceTimersByTime(25 * 60 * 60 * 1000);
    game = mineGold({
      ...payload,
      state: game,
    });

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold?.toNumber()).toBeGreaterThanOrEqual(2);
  });
});
