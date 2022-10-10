import Decimal from "decimal.js-light";
import {
  INITIAL_FARM,
  INITIAL_BUMPKIN,
  GOLD_MINE_STAMINA_COST,
} from "../../lib/constants";
import { GameState } from "../../types/game";
import {
  LandExpansionMineGoldAction,
  mineGold,
  EVENT_ERRORS,
} from "./mineGold";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  expansions: [
    {
      ...INITIAL_FARM.expansions[0],
      gold: {
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

describe("mineGold", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if expansion does not exist", () => {
    expect(() =>
      mineGold({
        state: { ...GAME_STATE, bumpkin: INITIAL_BUMPKIN },
        createdAt: Date.now(),
        action: {
          type: "goldRock.mined",
          expansionIndex: -1,
          index: 0,
        },
      })
    ).toThrow("Expansion does not exist");
  });

  it("throws an error if expansion has no gold rock", () => {
    expect(() =>
      mineGold({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          expansions: [{ createdAt: 0, readyAt: 0 }],
        },
        createdAt: Date.now(),
        action: {
          type: "goldRock.mined",
          expansionIndex: 0,
          index: 0,
        },
      })
    ).toThrow("Expansion has no gold");
  });

  it("throws an error if no iron pickaxes are left", () => {
    expect(() =>
      mineGold({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: { "Iron Pickaxe": new Decimal(0) },
        },
        createdAt: Date.now(),
        action: {
          type: "goldRock.mined",
          expansionIndex: 0,
          index: 0,
        },
      })
    ).toThrow(EVENT_ERRORS.NO_PICKAXES);
  });

  it("throws an error if gold does not exist", () => {
    expect(() =>
      mineGold({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: {
            "Iron Pickaxe": new Decimal(2),
          },
        },
        createdAt: Date.now(),
        action: {
          type: "goldRock.mined",
          expansionIndex: 0,
          index: 3,
        },
      })
    ).toThrow("No gold");
  });

  it("throws an error if gold is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(2),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "goldRock.mined",

        expansionIndex: 0,
        index: 0,
      } as LandExpansionMineGoldAction,
    };
    const game = mineGold(payload);

    expect(() =>
      mineGold({
        state: game,
        action: payload.action,
        createdAt: Date.now(),
      })
    ).toThrow("Gold is still recovering");
  });

  it("mines gold", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "goldRock.mined",

        expansionIndex: 0,
        index: 0,
      } as LandExpansionMineGoldAction,
    };

    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(2));
  });

  it("mines multiple gold", () => {
    let game = mineGold({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(3),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "goldRock.mined",

        expansionIndex: 0,
        index: 0,
      } as LandExpansionMineGoldAction,
    });

    game = mineGold({
      state: game,
      createdAt: Date.now(),
      action: {
        type: "goldRock.mined",
        expansionIndex: 0,
        index: 1,
      } as LandExpansionMineGoldAction,
    });

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(1));
    expect(game.inventory.Gold).toEqual(new Decimal(5));
  });

  it("mines gold after waiting", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(2),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "goldRock.mined",

        expansionIndex: 0,
        index: 0,
      } as LandExpansionMineGoldAction,
    };
    let game = mineGold(payload);

    // 25 hours
    jest.advanceTimersByTime(25 * 60 * 60 * 1000);
    game = mineGold({
      ...payload,
      createdAt: Date.now(),
      state: game,
    });

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(4));
  });

  it("throws an error if the player doesn't have a bumpkin", () => {
    expect(() =>
      mineGold({
        state: {
          ...GAME_STATE,
          inventory: {
            "Iron Pickaxe": new Decimal(3),
          },
          bumpkin: undefined,
        },
        createdAt: Date.now(),
        action: {
          type: "goldRock.mined",
          expansionIndex: 0,
          index: 0,
        } as LandExpansionMineGoldAction,
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("throws an error if the player doesn't have enough stamina", () => {
    expect(() =>
      mineGold({
        state: {
          ...GAME_STATE,
          inventory: {
            "Iron Pickaxe": new Decimal(3),
          },
          bumpkin: {
            ...INITIAL_BUMPKIN,
            stamina: {
              value: 0,
              replenishedAt: Date.now(),
            },
          },
        },
        createdAt: Date.now(),
        action: {
          type: "goldRock.mined",
          expansionIndex: 0,
          index: 0,
        } as LandExpansionMineGoldAction,
      })
    ).toThrow("You do not have enough stamina");
  });

  it("deducts stamina", () => {
    const game = mineGold({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(3),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "goldRock.mined",

        expansionIndex: 0,
        index: 0,
      } as LandExpansionMineGoldAction,
    });

    expect(game.bumpkin?.stamina.value).toBe(
      INITIAL_BUMPKIN.stamina.value - GOLD_MINE_STAMINA_COST
    );
  });

  it("replenishes stamina before goldMine", () => {
    const createdAt = Date.now();
    const bumpkin = {
      ...INITIAL_BUMPKIN,
      stamina: { value: 0, replenishedAt: 0 },
    };
    const game = mineGold({
      state: {
        ...GAME_STATE,
        bumpkin: bumpkin,
        inventory: {
          "Iron Pickaxe": new Decimal(3),
        },
      },
      createdAt,
      action: {
        type: "goldRock.mined",
        expansionIndex: 0,
        index: 0,
      } as LandExpansionMineGoldAction,
    });

    expect(game.bumpkin?.stamina.replenishedAt).toBe(createdAt);
  });
  describe("BumpkinActivity", () => {
    it("increments Gold mined activity by 1", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
        stamina: { value: 0, replenishedAt: 0 },
      };
      const game = mineGold({
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            "Iron Pickaxe": new Decimal(3),
          },
        },
        createdAt,
        action: {
          type: "goldRock.mined",
          expansionIndex: 0,
          index: 0,
        } as LandExpansionMineGoldAction,
      });

      expect(game.bumpkin?.activity?.["Gold Mined"]).toBe(1);
    });

    it("increments Gold Mined activity by 2", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
        stamina: { value: 0, replenishedAt: 0 },
      };
      const state1 = mineGold({
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            "Iron Pickaxe": new Decimal(3),
          },
        },
        createdAt,
        action: {
          type: "goldRock.mined",
          expansionIndex: 0,
          index: 0,
        } as LandExpansionMineGoldAction,
      });

      const game = mineGold({
        state: state1,
        createdAt,
        action: {
          type: "goldRock.mined",
          expansionIndex: 0,
          index: 1,
        } as LandExpansionMineGoldAction,
      });

      expect(game.bumpkin?.activity?.["Gold Mined"]).toBe(2);
    });
  });
});
