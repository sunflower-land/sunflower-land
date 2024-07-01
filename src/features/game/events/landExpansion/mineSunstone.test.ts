import Decimal from "decimal.js-light";
import { TEST_FARM, INITIAL_BUMPKIN } from "../../lib/constants";
import { GameState } from "../../types/game";
import { EVENT_ERRORS, MineSunstoneAction, mineSunstone } from "./mineSunstone";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  sunstones: {
    0: {
      stone: {
        minedAt: 0,
        amount: 2,
      },
      minesLeft: 10,
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
      minesLeft: 1,
      x: 4,
      y: 1,
      height: 1,
      width: 1,
    },
  },
};

describe("mineSunstone", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if the player doesn't have a bumpkin", () => {
    expect(() =>
      mineSunstone({
        state: {
          ...GAME_STATE,
          inventory: {
            "Gold Pickaxe": new Decimal(3),
          },
          bumpkin: undefined,
        },
        createdAt: Date.now(),
        action: {
          type: "sunstoneRock.mined",
          index: "0",
        } as MineSunstoneAction,
      }),
    ).toThrow("You do not have a Bumpkin");
  });

  it("throws an error if sunstone does not exist", () => {
    expect(() =>
      mineSunstone({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: {
            "Gold Pickaxe": new Decimal(2),
          },
        },
        createdAt: Date.now(),
        action: {
          type: "sunstoneRock.mined",
          index: "3",
        },
      }),
    ).toThrow(EVENT_ERRORS.NO_SUNSTONE);
  });

  it("throws an error if no gold pickaxes are left", () => {
    expect(() =>
      mineSunstone({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: { "Gold Pickaxe": new Decimal(0) },
        },
        createdAt: Date.now(),
        action: {
          type: "sunstoneRock.mined",
          index: "0",
        },
      }),
    ).toThrow(EVENT_ERRORS.NO_PICKAXES);
  });

  it("mines sunstone", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Gold Pickaxe": new Decimal(1),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "sunstoneRock.mined",

        index: "0",
      } as MineSunstoneAction,
    };

    const game = mineSunstone(payload);

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Sunstone).toEqual(new Decimal(2));
    expect(game.sunstones["0"].minesLeft).toEqual(9);
  });

  it("mines sunstone for the last time", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Gold Pickaxe": new Decimal(1),
          "Sunstone Rock": new Decimal(2),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "sunstoneRock.mined",

        index: "1",
      } as MineSunstoneAction,
    };

    const game = mineSunstone(payload);

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Sunstone).toEqual(new Decimal(3));
    expect(game.sunstones["1"]).toBeUndefined();
    expect(game.inventory["Sunstone Rock"]).toEqual(new Decimal(1));
  });

  describe("BumpkinActivity", () => {
    it("increments Sunstone mined activity by 1", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
      };
      const game = mineSunstone({
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            "Gold Pickaxe": new Decimal(3),
          },
        },
        createdAt,
        action: {
          type: "sunstoneRock.mined",
          index: "0",
        } as MineSunstoneAction,
      });

      expect(game.bumpkin?.activity?.["Sunstone Mined"]).toBe(1);
    });

    it("increments Sunstone Mined activity by 2", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
      };
      const state1 = mineSunstone({
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            "Gold Pickaxe": new Decimal(3),
          },
        },
        createdAt,
        action: {
          type: "sunstoneRock.mined",
          index: "0",
        } as MineSunstoneAction,
      });

      const game = mineSunstone({
        state: state1,
        createdAt,
        action: {
          type: "sunstoneRock.mined",
          index: "1",
        } as MineSunstoneAction,
      });

      expect(game.bumpkin?.activity?.["Sunstone Mined"]).toBe(2);
    });
  });
});
