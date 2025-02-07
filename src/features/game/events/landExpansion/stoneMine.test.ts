import Decimal from "decimal.js-light";
import { TEST_FARM, STONE_RECOVERY_TIME } from "../../lib/constants";
import { GameState } from "../../types/game";
import {
  getMinedAt,
  LandExpansionStoneMineAction,
  mineStone,
} from "./stoneMine";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";

const GAME_STATE: GameState = {
  ...TEST_FARM,
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
};

describe("mineStone", () => {
  beforeAll(() => {
    jest.useFakeTimers();
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
          index: 0,
        },
      }),
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
          index: 3,
        },
      }),
    ).toThrow("Stone does not exist");
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
      }),
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
});

describe("getMinedAt", () => {
  it("stone replenishes faster with time warp", () => {
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
      skills: {},
      createdAt: now,
    });

    expect(time).toEqual(now - (STONE_RECOVERY_TIME * 1000) / 2);
  });

  it("stone replenishes faster with Super Totem", () => {
    const now = Date.now();

    const time = getMinedAt({
      game: {
        ...TEST_FARM,
        collectibles: {
          "Super Totem": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
      },
      skills: {},
      createdAt: now,
    });

    expect(time).toEqual(now - (STONE_RECOVERY_TIME * 1000) / 2);
  });

  it("doesn't stack Super Totem and Time Warp Totem", () => {
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
          "Super Totem": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
      },
      skills: {},
      createdAt: now,
    });

    expect(time).toEqual(now - (STONE_RECOVERY_TIME * 1000) / 2);
  });

  it("reduces the cooldown time with Speed Miner Skill", () => {
    const now = Date.now();

    const time = getMinedAt({
      skills: {
        "Speed Miner": 1,
      },
      createdAt: now,
      game: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          skills: {
            "Speed Miner": 1,
          },
        },
      },
    });
    expect(time).toEqual(now - STONE_RECOVERY_TIME * 0.2 * 1000);
  });

  it("applies a Ore Hourglass boost of -50% recovery time for 3 hours", () => {
    const now = Date.now();
    const time = getMinedAt({
      skills: {},
      createdAt: now,
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
    });

    expect(time).toEqual(now - (STONE_RECOVERY_TIME * 1000) / 2);
  });

  it("does not apply an Ore Hourglass boost if expired", () => {
    const now = Date.now();
    const fourHoursAgo = now - 4 * 60 * 60 * 1000;

    const time = getMinedAt({
      skills: {},
      createdAt: now,
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
    });

    expect(time).toEqual(now);
  });
});
