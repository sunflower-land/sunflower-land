import Decimal from "decimal.js-light";
import {
  TEST_FARM,
  INITIAL_BUMPKIN,
  IRON_RECOVERY_TIME,
} from "../../lib/constants";
import { GameState } from "../../types/game";
import { LandExpansionIronMineAction, getMinedAt, mineIron } from "./ironMine";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  iron: {
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

describe("mineIron", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if no pickaxes are left", () => {
    expect(() =>
      mineIron({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: { "Stone Pickaxe": new Decimal(0) },
        },
        createdAt: Date.now(),
        action: {
          type: "ironRock.mined",
          index: "0",
        },
      })
    ).toThrow("No pickaxes left");
  });

  it("throws an error if iron does not exist", () => {
    expect(() =>
      mineIron({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: {
            "Stone Pickaxe": new Decimal(2),
          },
        },
        createdAt: Date.now(),
        action: {
          type: "ironRock.mined",
          index: "3",
        },
      })
    ).toThrow("No iron");
  });

  it("throws an error if iron is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
    };
    const game = mineIron(payload);

    // Try same payload
    expect(() =>
      mineIron({
        state: game,
        action: payload.action,
        createdAt: Date.now(),
      })
    ).toThrow("Iron is still recovering");
  });

  it("mines iron", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(1),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
    };

    const game = mineIron(payload);

    expect(game.inventory["Stone Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Iron).toEqual(new Decimal(2));
  });

  it("mines multiple iron", () => {
    let game = mineIron({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(3),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
    });

    game = mineIron({
      state: game,
      createdAt: Date.now(),
      action: {
        type: "ironRock.mined",
        index: "1",
      } as LandExpansionIronMineAction,
    });

    expect(game.inventory["Stone Pickaxe"]).toEqual(new Decimal(1));
    expect(game.inventory.Iron).toEqual(new Decimal(5));
  });

  it("mines iron after waiting", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
    };
    let game = mineIron(payload);

    // 13 hours
    jest.advanceTimersByTime(13 * 60 * 60 * 1000);
    game = mineIron({
      ...payload,
      createdAt: Date.now(),
      state: game,
    });

    expect(game.inventory["Stone Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Iron?.toNumber()).toBe(4);
  });

  it("throws an error if the player doesn't have a bumpkin", () => {
    expect(() =>
      mineIron({
        state: {
          ...GAME_STATE,
          inventory: {
            "Stone Pickaxe": new Decimal(3),
          },
          bumpkin: undefined,
        },
        createdAt: Date.now(),
        action: {
          type: "ironRock.mined",
          index: "0",
        } as LandExpansionIronMineAction,
      })
    ).toThrow("You do not have a Bumpkin");
  });

  describe("BumpkinActivity", () => {
    it("increments Iron mined activity by 1", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
      };
      const game = mineIron({
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            "Stone Pickaxe": new Decimal(3),
          },
        },
        createdAt,
        action: {
          type: "ironRock.mined",
          index: "0",
        } as LandExpansionIronMineAction,
      });

      expect(game.bumpkin?.activity?.["Iron Mined"]).toBe(1);
    });

    it("increments Iron Mined activity by 2", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
      };
      const state1 = mineIron({
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            "Stone Pickaxe": new Decimal(3),
          },
        },
        createdAt,
        action: {
          type: "ironRock.mined",
          index: "0",
        } as LandExpansionIronMineAction,
      });

      const game = mineIron({
        state: state1,
        createdAt,
        action: {
          type: "ironRock.mined",
          index: "1",
        } as LandExpansionIronMineAction,
      });

      expect(game.bumpkin?.activity?.["Iron Mined"]).toBe(2);
    });
  });

  describe("getMinedAt", () => {
    it("returns normal mined at", () => {
      const now = Date.now();

      const time = getMinedAt({
        game: TEST_FARM,
        createdAt: now,
      });

      expect(time).toEqual(now);
    });

    it("iron replenishes faster with time warp", () => {
      const now = Date.now();

      const time = getMinedAt({
        game: {
          ...TEST_FARM,
          collectibles: {
            "Time Warp Totem": [
              {
                id: "123",
                createdAt: now,
                coordinates: { x: 1, y: 1 },
                readyAt: now - 5 * 60 * 1000,
              },
            ],
          },
        },
        createdAt: now,
      });

      expect(time).toEqual(now - (IRON_RECOVERY_TIME * 1000) / 2);
    });

    it("applies a Ore Hourglass boost of -50% recovery time for 3 hours", () => {
      const now = Date.now();
      const time = getMinedAt({
        game: {
          ...TEST_FARM,
          collectibles: {
            "Ore Hourglass": [
              {
                id: "123",
                createdAt: now,
                coordinates: { x: 1, y: 1 },
                readyAt: now,
              },
            ],
          },
        },
        createdAt: now,
      });

      expect(time).toEqual(now - (IRON_RECOVERY_TIME * 1000) / 2);
    });

    it("does not apply an Ore Hourglass boost if expired", () => {
      const now = Date.now();
      const fourHoursAgo = now - 4 * 60 * 60 * 1000;

      const time = getMinedAt({
        game: {
          ...TEST_FARM,
          collectibles: {
            "Ore Hourglass": [
              {
                id: "123",
                createdAt: fourHoursAgo,
                coordinates: { x: 1, y: 1 },
                readyAt: fourHoursAgo,
              },
            ],
          },
        },
        createdAt: now,
      });

      expect(time).toEqual(now);
    });
  });
});
