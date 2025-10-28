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
      },
      x: 1,
      y: 1,
      minesLeft: 5,
    },
    1: {
      stone: {
        minedAt: 0,
      },
      x: 4,
      y: 1,
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

  it("throws an error if crimstone is not placed", () => {
    expect(() =>
      mineCrimstone({
        state: {
          ...GAME_STATE,
          bumpkin: GAME_STATE.bumpkin,
          crimstones: {
            0: { ...GAME_STATE.crimstones[0], x: undefined, y: undefined },
          },
        },
        action: { type: "crimstoneRock.mined", index: 0 },
      }),
    ).toThrow("Crimstone rock is not placed");
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
    expect(game.inventory.Crimstone).toEqual(new Decimal(1));
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
    expect(game.inventory.Crimstone).toEqual(new Decimal(2));
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
    expect(game.inventory.Crimstone?.toNumber()).toEqual(2);
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

      const { time } = getMinedAt({
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
    it("crimstone replenishes faster with Fireside Alchemist", () => {
      const now = Date.now();

      const { time } = getMinedAt({
        game: {
          ...GAME_STATE,
          bumpkin: {
            ...GAME_STATE.bumpkin,
            skills: {
              "Fireside Alchemist": 1,
            },
          },
        },
        createdAt: now,
      });

      expect(time).toEqual(now - CRIMSTONE_RECOVERY_TIME * 0.15 * 1000);
    });

    it("crimstone replenishes faster with Fireside Alchemist, Crimstone Amulet and Mole Shrine", () => {
      const now = Date.now();

      const { time } = getMinedAt({
        game: {
          ...GAME_STATE,
          bumpkin: {
            ...GAME_STATE.bumpkin,
            skills: {
              "Fireside Alchemist": 1,
            },
            equipped: {
              ...GAME_STATE.bumpkin.equipped,
              necklace: "Crimstone Amulet",
            },
          },
          collectibles: {
            "Mole Shrine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: now,
                id: "12",
                readyAt: now,
              },
            ],
          },
        },
        createdAt: now,
      });

      const expectedCooldownTime =
        CRIMSTONE_RECOVERY_TIME - CRIMSTONE_RECOVERY_TIME * 0.8 * 0.85 * 0.75;

      expect(time).toEqual(now - expectedCooldownTime * 1000);
    });
  });
});
