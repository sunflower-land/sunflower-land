import Decimal from "decimal.js-light";
import { STONE_RECOVERY_TIME, INITIAL_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import {
  getMinedAt,
  getStoneDropAmount,
  LandExpansionStoneMineAction,
  mineStone,
} from "./stoneMine";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  stones: {
    0: {
      createdAt: Date.now(),
      stone: {
        minedAt: 0,
      },
      x: 1,
      y: 1,
    },
    1: {
      createdAt: Date.now(),
      stone: {
        minedAt: 0,
      },
      x: 4,
      y: 1,
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
        state: { ...GAME_STATE, bumpkin: TEST_BUMPKIN },
        createdAt: Date.now(),
        action: {
          type: "stoneRock.mined",
          index: "0",
        },
      }),
    ).toThrow("Not enough pickaxes");
  });

  it("throws an error if stone does not exist", () => {
    expect(() =>
      mineStone({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            Pickaxe: new Decimal(2),
          },
        },
        createdAt: Date.now(),
        action: {
          type: "stoneRock.mined",
          index: "3",
        },
      }),
    ).toThrow("Stone does not exist");
  });

  it("throws an error if stone is not placed", () => {
    expect(() =>
      mineStone({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            Pickaxe: new Decimal(2),
          },
          stones: {
            0: {
              ...GAME_STATE.stones[0],
              x: undefined,
              y: undefined,
            },
          },
        },
        createdAt: Date.now(),
        action: {
          type: "stoneRock.mined",
          index: "0",
        },
      }),
    ).toThrow("Rock is not placed");
  });

  it("throws an error if stone is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(2),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
    };
    const game = mineStone(payload);

    // Try same payload
    expect(() =>
      mineStone({
        state: game,
        action: payload.action,
        createdAt: Date.now(),
      }),
    ).toThrow("Rock is still recovering");
  });

  it("mines stone", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(1),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
    };

    const game = mineStone(payload);

    expect(game.inventory.Pickaxe).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(1));
  });

  it("mines multiple stone", () => {
    let game = mineStone({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(3),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
    });

    game = mineStone({
      state: game,
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "1",
      } as LandExpansionStoneMineAction,
    });

    expect(game.inventory.Pickaxe).toEqual(new Decimal(1));
    expect(game.inventory.Stone).toEqual(new Decimal(2));
  });

  it("mines stone after waiting", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(2),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
    };
    let game = mineStone(payload);

    // 5 hours
    jest.advanceTimersByTime(5 * 60 * 60 * 1000);
    game = mineStone({
      ...payload,
      createdAt: Date.now(),
      state: game,
    });

    expect(game.inventory.Pickaxe).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(2));
  });

  it("adds 25% stone when Tunnel Mole (T1) is placed and ready", () => {
    const game = mineStone({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Tunnel Mole": new Decimal(1),
          Pickaxe: new Decimal(1),
        },
        collectibles: {
          "Tunnel Mole": [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 1, y: 1 },
              readyAt: Date.now() - 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
    });

    expect(game.inventory.Stone).toEqual(new Decimal(1.25));
  });

  it("adds +0.5 stone when stone rock is within Emerald Turtle AoE", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(1),
        },
        collectibles: {
          "Emerald Turtle": [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 2, y: 1 },
              readyAt: Date.now() - 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      bonusDropAmount: () => 0,
    };

    const game = mineStone(payload);

    expect(game.inventory["Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(1.5));
  });

  it("sets the AOE last used time to now", () => {
    const now = Date.now();

    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(1),
        },
        collectibles: {
          "Emerald Turtle": [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 2, y: 1 },
              readyAt: Date.now() - 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      bonusDropAmount: () => 0,
    };

    const game = mineStone(payload);

    expect(game.aoe["Emerald Turtle"]).toEqual({
      "-1": {
        "0": now,
      },
    });
  });

  it("does not apply the AOE if the AOE is not ready", () => {
    const now = Date.now();

    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(1),
        },
        collectibles: {
          "Emerald Turtle": [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 2, y: 1 },
              readyAt: Date.now() - 5 * 60 * 1000,
            },
          ],
        },
        aoe: {
          "Emerald Turtle": {
            "-1": {
              "0": now,
            },
          },
        },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      bonusDropAmount: () => 0,
    };

    const game = mineStone(payload);

    expect(game.inventory.Stone).toEqual(new Decimal(1));
  });

  it("does apply the AOE if the AOE is ready", () => {
    const now = Date.now();

    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(1),
        },
        collectibles: {
          "Emerald Turtle": [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 2, y: 1 },
              readyAt: Date.now() - 5 * 60 * 1000,
            },
          ],
        },
        aoe: {
          "Emerald Turtle": {
            "-1": {
              "0": now - STONE_RECOVERY_TIME * 1000,
            },
          },
        },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      bonusDropAmount: () => 0,
    };

    const game = mineStone(payload);

    expect(game.inventory.Stone).toEqual(new Decimal(1.5));
  });

  it("applies the AOE on a stone with boosted time", () => {
    const boostedTime = STONE_RECOVERY_TIME * 1000 * 0.5;

    const now = Date.now();

    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(1),
        },
        stones: {
          0: {
            createdAt: Date.now(),
            stone: {
              minedAt: now - STONE_RECOVERY_TIME * 1000,
              boostedTime,
            },
            x: 1,
            y: 1,
          },
        },
        collectibles: {
          "Emerald Turtle": [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 2, y: 1 },
              readyAt: Date.now() - 5 * 60 * 1000,
            },
          ],
        },
        aoe: {
          "Emerald Turtle": {
            "-1": {
              "0": now - (STONE_RECOVERY_TIME * 1000 - boostedTime),
            },
          },
        },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      bonusDropAmount: () => 0,
    };

    const game = mineStone(payload);

    expect(game.inventory.Stone).toEqual(new Decimal(1.5));
  });

  it("does not add boost when stone rock is outside Emerald Turtle AoE", () => {
    const game = mineStone({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(1),
        },
        collectibles: {
          "Emerald Turtle": [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 3, y: 1 },
              readyAt: Date.now() - 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
    });

    expect(game.inventory["Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(1));
  });

  it("adds +0.1 stone when stone rock is within Tin Turtle AoE", () => {
    const game = mineStone({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(1),
        },
        collectibles: {
          "Tin Turtle": [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 2, y: 1 },
              readyAt: Date.now() - 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
    });

    expect(game.inventory["Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(1.1));
  });

  it("adds +0.1 stone when Stone Beetle is placed and ready", () => {
    const game = mineStone({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(1),
        },
        collectibles: {
          "Stone Beetle": [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 1, y: 1 },
              readyAt: Date.now() - 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
    });

    expect(game.inventory.Stone).toEqual(new Decimal(1.1));
  });

  it("applies a bud boost", () => {
    const state: GameState = {
      ...GAME_STATE,
      bumpkin: TEST_BUMPKIN,
      inventory: {
        Pickaxe: new Decimal(1),
      },
      buds: {
        1: {
          aura: "No Aura",
          colour: "Green",
          type: "Cave",
          ears: "Ears",
          stem: "Egg Head",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      },
    };

    const game = mineStone({
      state,
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
    });

    expect(game.inventory.Stone).toEqual(new Decimal(1.2));
  });

  it("adds +0.25 stone when a Faction Shield is equipped(Right Faction)", () => {
    const state: GameState = {
      ...GAME_STATE,
      bumpkin: {
        ...TEST_BUMPKIN,
        equipped: {
          ...TEST_BUMPKIN.equipped,
          secondaryTool: "Goblin Shield",
        },
      },
      faction: {
        name: "goblins",
        pledgedAt: 0,
        history: {},
        points: 0,
      },
      inventory: {
        Pickaxe: new Decimal(1),
      },
    };

    const game = mineStone({
      state,
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
    });

    expect(game.inventory["Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(1.25));
  });

  it("Faction Shield boost is not applied if Different Faction", () => {
    const state: GameState = {
      ...GAME_STATE,
      bumpkin: {
        ...TEST_BUMPKIN,
        equipped: {
          ...TEST_BUMPKIN.equipped,
          secondaryTool: "Goblin Shield",
        },
      },
      faction: {
        name: "nightshades",
        pledgedAt: 0,
        history: {},
        points: 0,
      },
      inventory: {
        Pickaxe: new Decimal(1),
      },
    };

    const game = mineStone({
      state,
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
    });

    expect(game.inventory["Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(1));
  });

  it("Faction Shield boost is not applied if No Faction", () => {
    const state: GameState = {
      ...GAME_STATE,
      bumpkin: {
        ...TEST_BUMPKIN,
        equipped: {
          ...TEST_BUMPKIN.equipped,
          secondaryTool: "Goblin Shield",
        },
      },
      inventory: {
        Pickaxe: new Decimal(1),
      },
    };

    const game = mineStone({
      state,
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
    });

    expect(game.inventory["Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(1));
  });

  it("stores the boostedTime on the stone", () => {
    const now = Date.now();

    const state = mineStone({
      state: {
        ...GAME_STATE,
        inventory: {
          Pickaxe: new Decimal(1),
        },
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
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      createdAt: Date.now(),
    });

    expect(state.stones[0].stone.boostedTime).toEqual(
      STONE_RECOVERY_TIME * 0.5 * 1000,
    );
  });

  describe("getStoneDropAmount", () => {
    it("applies +0.1 Stone with Rock'N'Roll skill", () => {
      const { amount } = getStoneDropAmount({
        game: {
          ...INITIAL_FARM,
          bumpkin: { ...TEST_BUMPKIN, skills: { "Rock'N'Roll": 1 } },
        },
        rock: {
          createdAt: Date.now() - 5 * 60 * 1000,
          stone: {
            minedAt: Date.now() - 5 * 60 * 1000,
          },
          x: 0,
          y: 0,
        },
        createdAt: Date.now(),
        criticalDropGenerator: () => false,
      });

      expect(amount.toNumber()).toEqual(1.1);
    });

    it("applies -0.5 Stone with Ferrous Favor skill", () => {
      const { amount } = getStoneDropAmount({
        game: {
          ...INITIAL_FARM,
          bumpkin: { ...TEST_BUMPKIN, skills: { "Ferrous Favor": 1 } },
        },
        rock: {
          createdAt: Date.now() - 5 * 60 * 1000,
          stone: {
            minedAt: Date.now() - 5 * 60 * 1000,
          },
          x: 0,
          y: 0,
        },
        createdAt: Date.now(),
        criticalDropGenerator: () => false,
      });

      expect(amount.toNumber()).toEqual(0.5);
    });

    it("applies +1 bonus drop", () => {
      const { amount } = getStoneDropAmount({
        game: INITIAL_FARM,
        rock: {
          createdAt: Date.now() - 5 * 60 * 1000,
          stone: {
            minedAt: Date.now() - 5 * 60 * 1000,
            criticalHit: { Native: 1 },
          },
          x: 0,
          y: 0,
        },
        createdAt: Date.now(),
        criticalDropGenerator: (name) => name === "Native",
      });

      expect(amount.toNumber()).toEqual(2);
    });
  });

  describe("BumpkinActivity", () => {
    it("increments Trees Chopped activity by 1 when 1 tree is chopped", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...TEST_BUMPKIN,
      };
      const game = mineStone({
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            Pickaxe: new Decimal(3),
          },
        },
        createdAt,
        action: {
          type: "stoneRock.mined",
          index: "0",
        } as LandExpansionStoneMineAction,
      });

      expect(game.farmActivity["Stone Mined"]).toBe(1);
    });

    it("increments Trees Chopped activity by 2 when 2 trees are chopped", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...TEST_BUMPKIN,
      };
      const state1 = mineStone({
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            Pickaxe: new Decimal(3),
          },
        },
        createdAt,
        action: {
          type: "stoneRock.mined",
          index: "0",
        } as LandExpansionStoneMineAction,
      });

      const game = mineStone({
        state: state1,
        createdAt,
        action: {
          type: "stoneRock.mined",
          index: "1",
        } as LandExpansionStoneMineAction,
      });

      expect(game.farmActivity["Stone Mined"]).toBe(2);
    });
  });

  it("stone replenishes faster with time warp", () => {
    const now = Date.now();

    const time = getMinedAt({
      game: {
        ...INITIAL_FARM,

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

    expect(time).toEqual({
      time: now - (STONE_RECOVERY_TIME * 1000) / 2,
      boostsUsed: ["Time Warp Totem"],
    });
  });

  it("stone replenishes faster with Super Totem", () => {
    const now = Date.now();

    const time = getMinedAt({
      game: {
        ...INITIAL_FARM,

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

    expect(time).toEqual({
      time: now - (STONE_RECOVERY_TIME * 1000) / 2,
      boostsUsed: ["Super Totem"],
    });
  });

  it("doesn't stack Super Totem and Time Warp Totem", () => {
    const now = Date.now();

    const time = getMinedAt({
      game: {
        ...INITIAL_FARM,

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

    expect(time).toEqual({
      time: now - (STONE_RECOVERY_TIME * 1000) / 2,
      boostsUsed: ["Super Totem"],
    });
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
    expect(time).toEqual({
      time: now - STONE_RECOVERY_TIME * 0.2 * 1000,
      boostsUsed: ["Speed Miner"],
    });
  });

  it("applies a Ore Hourglass boost of -50% recovery time for 3 hours", () => {
    const now = Date.now();
    const time = getMinedAt({
      skills: {},
      createdAt: now,
      game: {
        ...INITIAL_FARM,
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

    expect(time).toEqual({
      time: now - (STONE_RECOVERY_TIME * 1000) / 2,
      boostsUsed: ["Ore Hourglass"],
    });
  });

  it("does not apply an Ore Hourglass boost if expired", () => {
    const now = Date.now();
    const fourHoursAgo = now - 4 * 60 * 60 * 1000;

    const time = getMinedAt({
      skills: {},
      createdAt: now,
      game: {
        ...INITIAL_FARM,
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

    expect(time).toEqual({ time: now, boostsUsed: [] });
  });

  it("applies a +0.1 boost if the player is on volcano island", () => {
    const state = mineStone({
      state: {
        ...GAME_STATE,
        island: {
          type: "volcano",
        },
        inventory: {
          Pickaxe: new Decimal(1),
        },
      },
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      createdAt: Date.now(),
    });

    expect(state.inventory.Stone).toEqual(new Decimal(1.1));
  });

  it("doesn't require pickaxes if Quarry is built", () => {
    const state = mineStone({
      state: {
        ...GAME_STATE,
        inventory: {
          Pickaxe: new Decimal(1),
        },
        collectibles: {
          Quarry: [
            {
              id: "123",
              createdAt: Date.now(),
              coordinates: { x: 1, y: 1 },
              readyAt: Date.now(),
            },
          ],
        },
      },
      action: {
        type: "stoneRock.mined",
        index: "0",
      },
      createdAt: Date.now(),
    });

    expect(state.inventory.Pickaxe).toEqual(new Decimal(1));
  });

  it("applies the Badger Shrine boost", () => {
    const now = Date.now();
    const { time } = getMinedAt({
      game: {
        ...INITIAL_FARM,
        collectibles: {
          "Badger Shrine": [
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
      skills: {},
    });

    expect(time).toEqual(now - STONE_RECOVERY_TIME * 0.25 * 1000);
  });

  it("does not apply the Badger Shrine boost if expired", () => {
    const now = Date.now();
    const { time } = getMinedAt({
      game: {
        ...INITIAL_FARM,
        collectibles: {
          "Badger Shrine": [
            {
              id: "123",
              createdAt: now - EXPIRY_COOLDOWNS["Badger Shrine"],
              coordinates: { x: 1, y: 1 },
              readyAt: now,
            },
          ],
        },
      },
      createdAt: now,
      skills: {},
    });

    expect(time).toEqual(now);
  });
});
