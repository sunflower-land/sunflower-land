import Decimal from "decimal.js-light";
import { EMPTY, INITIAL_FARM } from "../lib/constants";
import { GameState } from "../types/game";
import { mineStone, StoneMineAction } from "./stoneMine";

const GAME_STATE: GameState = INITIAL_FARM;

describe("mineStone", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if no axes are left", () => {
    expect(() =>
      mineStone({
        state: EMPTY,
        action: {
          type: "stone.mined",
          index: 0,
        },
      })
    ).toThrow("No pickaxes left");
  });

  it("throws an error if stone does not exist", () => {
    expect(() =>
      mineStone({
        state: {
          ...GAME_STATE,
          inventory: {
            Pickaxe: new Decimal(2),
          },
        },
        action: {
          type: "stone.mined",
          index: 3,
        },
      })
    ).toThrow("No rock");
  });

  expect(() =>
    mineStone({
      state: {
        ...GAME_STATE,
        inventory: {
          Pickaxe: new Decimal(2),
        },
      },
      action: {
        type: "stone.mined",
        index: -1,
      },
    })
  ).toThrow("No rock");

  it("throws an error if stone is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          Pickaxe: new Decimal(2),
        },
      },
      action: {
        type: "stone.mined",
        index: 0,
      } as StoneMineAction,
    };
    const game = mineStone(payload);

    // Try same payload
    expect(() =>
      mineStone({
        state: game,
        action: payload.action,
      })
    ).toThrow("Rock is still recovering");
  });

  it("mines stone", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          Pickaxe: new Decimal(1),
        },
      },
      action: {
        type: "stone.mined",
        index: 0,
      } as StoneMineAction,
    };
    const game = mineStone(payload);

    expect(game.inventory.Pickaxe).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(2));
  });

  it("mines multiple stone", () => {
    let game = mineStone({
      state: {
        ...GAME_STATE,
        inventory: {
          Pickaxe: new Decimal(3),
        },
      },
      action: {
        type: "stone.mined",
        item: "Pickaxe",
        index: 0,
      } as StoneMineAction,
    });

    game = mineStone({
      state: game,
      action: {
        type: "stone.mined",
        index: 1,
      } as StoneMineAction,
    });

    expect(game.inventory.Pickaxe).toEqual(new Decimal(1));
    expect(game.inventory.Stone).toEqual(new Decimal(5));
  });

  it("mines stone after waiting", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          Pickaxe: new Decimal(2),
        },
      },
      action: {
        type: "stone.mined",
        index: 0,
      } as StoneMineAction,
    };
    let game = mineStone(payload);

    // 5 hours
    jest.advanceTimersByTime(5 * 60 * 60 * 1000);
    game = mineStone({
      ...payload,
      state: game,
    });

    expect(game.inventory.Pickaxe).toEqual(new Decimal(0));
    expect(game.inventory.Stone?.toNumber()).toBeGreaterThanOrEqual(4);
  });
});
