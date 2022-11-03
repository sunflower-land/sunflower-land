import Decimal from "decimal.js-light";
import { TEST_FARM, INITIAL_BUMPKIN } from "../../lib/constants";
import { GameState } from "../../types/game";
import { LandExpansionIronMineAction, mineIron } from "./ironMine";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  expansions: [
    {
      ...TEST_FARM.expansions[0],
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
    },
  ],
};

describe("mineIron", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if expansion does not exist", () => {
    expect(() =>
      mineIron({
        state: { ...GAME_STATE, bumpkin: INITIAL_BUMPKIN },
        createdAt: Date.now(),
        action: {
          type: "ironRock.mined",
          expansionIndex: -1,
          index: 0,
        },
      })
    ).toThrow("Expansion does not exist");
  });

  it("throws an error if expansion has no iron rock", () => {
    expect(() =>
      mineIron({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          expansions: [{ createdAt: 0, readyAt: 0 }],
        },
        createdAt: Date.now(),
        action: {
          type: "ironRock.mined",
          expansionIndex: 0,
          index: 0,
        },
      })
    ).toThrow("Expansion has no iron");
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
          expansionIndex: 0,
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
          bumpkin: INITIAL_BUMPKIN,
          inventory: {
            "Stone Pickaxe": new Decimal(2),
          },
        },
        createdAt: Date.now(),
        action: {
          type: "ironRock.mined",
          expansionIndex: 0,
          index: 3,
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

        expansionIndex: 0,
        index: 0,
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

        expansionIndex: 0,
        index: 0,
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

        expansionIndex: 0,
        index: 0,
      } as LandExpansionIronMineAction,
    });

    game = mineIron({
      state: game,
      createdAt: Date.now(),
      action: {
        type: "ironRock.mined",
        expansionIndex: 0,
        index: 1,
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

        expansionIndex: 0,
        index: 0,
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
          expansionIndex: 0,
          index: 0,
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
          expansionIndex: 0,
          index: 0,
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
          expansionIndex: 0,
          index: 0,
        } as LandExpansionIronMineAction,
      });

      const game = mineIron({
        state: state1,
        createdAt,
        action: {
          type: "ironRock.mined",
          expansionIndex: 0,
          index: 1,
        } as LandExpansionIronMineAction,
      });

      expect(game.bumpkin?.activity?.["Iron Mined"]).toBe(2);
    });
  });
});
