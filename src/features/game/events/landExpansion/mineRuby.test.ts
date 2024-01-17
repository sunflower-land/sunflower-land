import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { MineRubyAction, mineRuby } from "./mineRuby";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  rubies: {
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
};

describe("mineRuby", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if no gold pickaxes are left", () => {
    expect(() =>
      mineRuby({
        state: {
          ...GAME_STATE,
          inventory: {
            "Gold Pickaxe": new Decimal(0),
          },
        },
        action: {
          type: "rubyRock.mined",
          index: 0,
        },
      })
    ).toThrow("No gold pickaxes left");
  });

  it("throws an error if ruby does not exist", () => {
    expect(() =>
      mineRuby({
        state: {
          ...GAME_STATE,
          inventory: {
            "Gold Pickaxe": new Decimal(2),
          },
        },
        action: {
          type: "rubyRock.mined",
          index: 3,
        },
      })
    ).toThrow("Ruby does not exist");
  });

  it("throws an error if ruby is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "rubyRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineRubyAction,
    };
    const game = mineRuby(payload);

    // Try same payload
    expect(() =>
      mineRuby({
        state: game,
        action: payload.action,
      })
    ).toThrow("Rock is still recovering");
  });

  it("mines ruby", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(1),
        },
      },
      action: {
        type: "rubyRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineRubyAction,
    };

    const game = mineRuby(payload);

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Ruby).toEqual(new Decimal(2));
  });

  it("mines multiple rubies", () => {
    let game = mineRuby({
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(3),
        },
      },
      action: {
        type: "rubyRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineRubyAction,
    });

    game = mineRuby({
      state: game,
      action: {
        type: "rubyRock.mined",
        expansionIndex: 0,
        index: 1,
      } as MineRubyAction,
    });

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(1));
    expect(game.inventory.Ruby).toEqual(new Decimal(5));
  });

  it("mines ruby after waiting", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "rubyRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineRubyAction,
    };

    let game = mineRuby(payload);

    // 48 hours + 100 milliseconds
    jest.advanceTimersByTime(2 * 24 * 60 * 60 * 1000 + 100);
    game = mineRuby({
      ...payload,
      state: game,
    });

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Ruby?.toNumber()).toBeGreaterThan(2);
  });

  it("throws an error if the player doesn't have a bumpkin", async () => {
    expect(() =>
      mineRuby({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
          inventory: {
            "Gold Pickaxe": new Decimal(2),
          },
        },
        action: {
          type: "rubyRock.mined",
          expansionIndex: 0,
          index: 0,
        } as MineRubyAction,
      })
    ).toThrow("You do not have a Bumpkin");
  });
});
