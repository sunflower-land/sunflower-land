import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { LandExpansionStoneMineAction, mineStone } from "./stoneMine";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  expansions: [
    {
      ...INITIAL_FARM.expansions[0],
      stones: {
        0: {
          stone: {
            minedAt: 0,
            amount: 2,
          },
          x: 1,
          y: 1,
          height: 1,
          width: 1,
        },
        1: {
          stone: {
            minedAt: 0,
            amount: 3,
          },
          x: 4,
          y: 1,
          height: 1,
          width: 1,
        },
      },
    },
  ],
};

describe("mineStone", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if expansion does not exist", () => {
    expect(() =>
      mineStone({
        state: GAME_STATE,
        action: {
          type: "rock.mined",
          expansionIndex: -1,
          index: 0,
        },
      })
    ).toThrow("Expansion does not exist");
  });

  it("throws an error if expansion has no stones", () => {
    expect(() =>
      mineStone({
        state: { ...GAME_STATE, expansions: [{ createdAt: 0, readyAt: 0 }] },
        action: {
          type: "rock.mined",
          expansionIndex: 0,
          index: 0,
        },
      })
    ).toThrow("Expansion has no stones");
  });

  it("throws an error if no axes are left", () => {
    expect(() =>
      mineStone({
        state: {
          ...GAME_STATE,
          inventory: {
            Pickaxe: new Decimal(0),
          },
        },
        action: {
          type: "rock.mined",
          expansionIndex: 0,
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
          type: "rock.mined",
          expansionIndex: 0,
          index: 3,
        },
      })
    ).toThrow("No rock");
  });

  it("throws an error if stone is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          Pickaxe: new Decimal(2),
        },
      },
      action: {
        type: "rock.mined",
        expansionIndex: 0,
        index: 0,
      } as LandExpansionStoneMineAction,
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
        type: "rock.mined",
        expansionIndex: 0,
        index: 0,
      } as LandExpansionStoneMineAction,
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
        type: "rock.mined",
        expansionIndex: 0,
        index: 0,
      } as LandExpansionStoneMineAction,
    });

    game = mineStone({
      state: game,
      action: {
        type: "rock.mined",
        expansionIndex: 0,
        index: 1,
      } as LandExpansionStoneMineAction,
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
        type: "rock.mined",
        expansionIndex: 0,
        index: 0,
      } as LandExpansionStoneMineAction,
    };

    let game = mineStone(payload);

    // 5 hours
    jest.advanceTimersByTime(5 * 60 * 60 * 1000);
    game = mineStone({
      ...payload,
      state: game,
    });

    expect(game.inventory.Pickaxe).toEqual(new Decimal(0));
    expect(game.inventory.Stone?.toNumber()).toBeGreaterThan(2);
  });
});
