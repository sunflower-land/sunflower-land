import Decimal from "decimal.js-light";
import { TEST_FARM, INITIAL_BUMPKIN } from "../../lib/constants";
import type { GameState } from "../../types/game";
import {
  ASCENSION_SHARDS_PER_MINE,
  EVENT_ERRORS,
  type MineAscensionCrystalAction,
  mineAscensionCrystal,
} from "./mineAscensionCrystal";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  ascensionCrystals: {
    0: {
      stone: {
        minedAt: 0,
      },
      minesLeft: 1,
      x: 1,
      y: 1,
    },
    1: {
      stone: {
        minedAt: 0,
      },
      minesLeft: 1,
      x: 4,
      y: 1,
    },
  },
};

describe("mineAscensionCrystal", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if the bumpkin is missing", () => {
    expect(() =>
      mineAscensionCrystal({
        state: {
          ...GAME_STATE,
          bumpkin: undefined as never,
          inventory: { "Gold Pickaxe": new Decimal(1) },
        },
        createdAt: Date.now(),
        action: { type: "ascensionCrystal.mined", index: "0" },
      }),
    ).toThrow(EVENT_ERRORS.NO_BUMPKIN);
  });

  it("throws an error if ascension crystal does not exist", () => {
    expect(() =>
      mineAscensionCrystal({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: {
            "Gold Pickaxe": new Decimal(2),
          },
        },
        createdAt: Date.now(),
        action: {
          type: "ascensionCrystal.mined",
          index: "3",
        },
      }),
    ).toThrow(EVENT_ERRORS.NO_ASCENSION_CRYSTAL);
  });

  it("throws an error if ascension crystal is not placed", () => {
    expect(() =>
      mineAscensionCrystal({
        state: {
          ...GAME_STATE,
          bumpkin: GAME_STATE.bumpkin,
          ascensionCrystals: {
            0: {
              ...GAME_STATE.ascensionCrystals[0],
              x: undefined,
              y: undefined,
            },
          },
        },
        action: { type: "ascensionCrystal.mined", index: "0" },
        createdAt: Date.now(),
      }),
    ).toThrow(EVENT_ERRORS.NOT_PLACED);
  });

  it("throws if the crystal is only partially placed (one coord missing)", () => {
    expect(() =>
      mineAscensionCrystal({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: { "Gold Pickaxe": new Decimal(1) },
          ascensionCrystals: {
            0: { ...GAME_STATE.ascensionCrystals[0], y: undefined },
          },
        },
        action: { type: "ascensionCrystal.mined", index: "0" },
        createdAt: Date.now(),
      }),
    ).toThrow(EVENT_ERRORS.NOT_PLACED);
  });

  it("throws an error if no gold pickaxes are left", () => {
    expect(() =>
      mineAscensionCrystal({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: { "Gold Pickaxe": new Decimal(0) },
        },
        createdAt: Date.now(),
        action: {
          type: "ascensionCrystal.mined",
          index: "0",
        },
      }),
    ).toThrow(EVENT_ERRORS.NO_PICKAXES);
  });

  it("mines an ascension crystal, yielding shards and destroying the node", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Gold Pickaxe": new Decimal(1),
          "Ascension Crystal": new Decimal(2),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "ascensionCrystal.mined",
        index: "0",
      } as MineAscensionCrystalAction,
    };

    const game = mineAscensionCrystal(payload);

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory["Ascension Shard"]).toEqual(
      new Decimal(ASCENSION_SHARDS_PER_MINE),
    );
    // Single-use: the node is removed and the rock count decremented.
    expect(game.ascensionCrystals["0"]).toBeUndefined();
    expect(game.inventory["Ascension Crystal"]).toEqual(new Decimal(1));
  });

  it("adds to an existing Ascension Shard balance", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Gold Pickaxe": new Decimal(1),
          "Ascension Crystal": new Decimal(2),
          "Ascension Shard": new Decimal(5),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "ascensionCrystal.mined",
        index: "0",
      } as MineAscensionCrystalAction,
    };

    const game = mineAscensionCrystal(payload);

    expect(game.inventory["Ascension Shard"]).toEqual(
      new Decimal(5 + ASCENSION_SHARDS_PER_MINE),
    );
  });

  describe("BumpkinActivity", () => {
    it("increments Ascension Crystal Mined activity by 1", () => {
      const createdAt = Date.now();
      const game = mineAscensionCrystal({
        state: {
          ...GAME_STATE,
          bumpkin: { ...INITIAL_BUMPKIN },
          inventory: {
            "Gold Pickaxe": new Decimal(3),
            "Ascension Crystal": new Decimal(2),
          },
        },
        createdAt,
        action: {
          type: "ascensionCrystal.mined",
          index: "0",
        } as MineAscensionCrystalAction,
      });

      expect(game.farmActivity["Ascension Crystal Mined"]).toBe(1);
    });

    it("increments Ascension Crystal Mined activity by 2", () => {
      const createdAt = Date.now();
      const state1 = mineAscensionCrystal({
        state: {
          ...GAME_STATE,
          bumpkin: { ...INITIAL_BUMPKIN },
          inventory: {
            "Gold Pickaxe": new Decimal(3),
            "Ascension Crystal": new Decimal(2),
          },
        },
        createdAt,
        action: {
          type: "ascensionCrystal.mined",
          index: "0",
        } as MineAscensionCrystalAction,
      });

      const game = mineAscensionCrystal({
        state: state1,
        createdAt,
        action: {
          type: "ascensionCrystal.mined",
          index: "1",
        } as MineAscensionCrystalAction,
      });

      expect(game.farmActivity["Ascension Crystal Mined"]).toBe(2);
    });
  });
});
