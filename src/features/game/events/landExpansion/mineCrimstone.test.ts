import Decimal from "decimal.js-light";
import {
  TEST_FARM,
  INITIAL_BUMPKIN,
  CRIMSTONE_RECOVERY_TIME,
} from "../../lib/constants";
import { GameState } from "../../types/game";
import {
  MineCrimstoneAction,
  getMinedAt,
  mineCrimstone,
} from "./mineCrimstone";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  crimstones: {
    0: {
      stone: {
        minedAt: 0,
        amount: 2,
      },
      x: 1,
      y: 1,
      height: 1,
      width: 1,
      minesLeft: 5,
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
      minesLeft: 5,
    },
  },
};

describe("mineCrimstone", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if no gold pickaxes are left", () => {
    expect(() =>
      mineCrimstone({
        state: {
          ...GAME_STATE,
          inventory: {
            "Gold Pickaxe": new Decimal(0),
          },
        },
        action: {
          type: "crimstoneRock.mined",
          index: 0,
        },
      }),
    ).toThrow("No gold pickaxes left");
  });

  it("throws an error if crimstone does not exist", () => {
    expect(() =>
      mineCrimstone({
        state: {
          ...GAME_STATE,
          inventory: {
            "Gold Pickaxe": new Decimal(2),
          },
        },
        action: {
          type: "crimstoneRock.mined",
          index: 3,
        },
      }),
    ).toThrow("Crimstone does not exist");
  });

  it("throws an error if crimstone is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineCrimstoneAction,
    };
    const game = mineCrimstone(payload);

    // Try same payload
    expect(() =>
      mineCrimstone({
        state: game,
        action: payload.action,
      }),
    ).toThrow("Rock is still recovering");
  });

  it("mines crimstone", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(1),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineCrimstoneAction,
    };

    const game = mineCrimstone(payload);

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Crimstone).toEqual(new Decimal(2));
  });

  it("mines multiple crimstones", () => {
    let game = mineCrimstone({
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(3),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineCrimstoneAction,
    });

    game = mineCrimstone({
      state: game,
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 1,
      } as MineCrimstoneAction,
    });

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(1));
    expect(game.inventory.Crimstone).toEqual(new Decimal(5));
  });

  it("mines crimstone after waiting", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineCrimstoneAction,
    };

    let game = mineCrimstone(payload);

    // 24 hours + 100 milliseconds
    game = mineCrimstone({
      createdAt: Date.now() + 1 * 24 * 60 * 60 * 1000 + 100,
      ...payload,
      state: game,
    });

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Crimstone?.toNumber()).toBeGreaterThan(2);
  });

  it("resets minesLeft after 24 hours", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 1,
      } as MineCrimstoneAction,
    };

    let game = mineCrimstone(payload);

    // 48 hours + 100 milliseconds
    game = mineCrimstone({
      createdAt: Date.now() + 2 * 24 * 60 * 60 * 1000 + 100,
      ...payload,
      state: game,
    });

    expect(game.crimstones[1].minesLeft).toEqual(4);
  });

  describe("getMinedAt", () => {
    it("crimstone replenishes faster with Crimstone Amulet", () => {
      const now = Date.now();

      const time = getMinedAt({
        game: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            equipped: {
              ...INITIAL_BUMPKIN.equipped,
              necklace: "Crimstone Amulet",
            },
          },
        },
        createdAt: now,
      });

      expect(time).toEqual(now - CRIMSTONE_RECOVERY_TIME * 0.2 * 1000);
    });
  });
});
