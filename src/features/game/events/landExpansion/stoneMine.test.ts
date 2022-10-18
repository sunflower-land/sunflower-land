import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import {
  INITIAL_BUMPKIN,
  INITIAL_FARM,
  MAX_STAMINA,
  STONE_MINE_STAMINA_COST,
} from "../../lib/constants";
import { GameState } from "../../types/game";
import {
  getMinedAt,
  LandExpansionStoneMineAction,
  mineStone,
  STONE_RECOVERY_TIME,
} from "./stoneMine";

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
          type: "stoneRock.mined",
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
          type: "stoneRock.mined",
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
          type: "stoneRock.mined",
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
          type: "stoneRock.mined",
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
        type: "stoneRock.mined",
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
        type: "stoneRock.mined",
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
        type: "stoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as LandExpansionStoneMineAction,
    });

    game = mineStone({
      state: game,
      action: {
        type: "stoneRock.mined",
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
        type: "stoneRock.mined",
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

  it("throws an error if the player doesnt have a bumpkin", async () => {
    expect(() =>
      mineStone({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
          inventory: {
            Pickaxe: new Decimal(2),
          },
        },
        action: {
          type: "stoneRock.mined",
          expansionIndex: 0,
          index: 0,
        } as LandExpansionStoneMineAction,
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("requires player has enough stamina", () => {
    expect(() =>
      mineStone({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            stamina: {
              value: 0,
              replenishedAt: Date.now(),
            },
          },
          inventory: {
            Pickaxe: new Decimal(2),
          },
        },
        action: {
          type: "stoneRock.mined",
          expansionIndex: 0,
          index: 0,
        } as LandExpansionStoneMineAction,
      })
    ).toThrow("You do not have enough stamina");
  });

  it("replenishes stamina before mining", () => {
    const createdAt = Date.now();

    const state = mineStone({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          stamina: {
            value: 0,
            replenishedAt: 0,
          },
        },
        inventory: {
          Pickaxe: new Decimal(2),
        },
      },
      action: {
        type: "stoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as LandExpansionStoneMineAction,
      createdAt,
    });

    expect(state.bumpkin?.stamina.replenishedAt).toBe(createdAt);
  });

  it("deducts stamina from bumpkin", () => {
    const createdAt = Date.now();

    const state = mineStone({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          stamina: {
            value: MAX_STAMINA[getBumpkinLevel(INITIAL_BUMPKIN.experience)],
            replenishedAt: createdAt,
          },
        },
        inventory: {
          Pickaxe: new Decimal(2),
        },
      },
      action: {
        type: "stoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as LandExpansionStoneMineAction,
      createdAt,
    });

    expect(state.bumpkin?.stamina.value).toBe(
      MAX_STAMINA[getBumpkinLevel(INITIAL_BUMPKIN.experience)] -
        STONE_MINE_STAMINA_COST
    );
  });
});

describe("getMinedAt", () => {
  it("applies a speed boost of 20% with Coal Face skill", () => {
    const now = Date.now();

    const time = getMinedAt({
      skills: { "Coal Face": 1 },
      createdAt: now,
    });

    expect(time).toEqual(now - STONE_RECOVERY_TIME * 0.2 * 1000);
  });
});
