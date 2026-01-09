import Decimal from "decimal.js-light";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import { INITIAL_FARM } from "features/game/lib/constants";
import { KNOWN_IDS } from "features/game/types";
import { GameState } from "features/game/types/game";
import { prngChance } from "lib/prng";
import {
  mineStone,
  LandExpansionStoneMineAction,
  STONE_RECOVERY_TIME,
  getStoneDropAmount,
  getMinedAt,
} from "./stoneMine";

const now = Date.now();
const farmId = 1;

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  stones: {
    0: {
      createdAt: now,
      stone: {
        minedAt: 0,
      },
      x: 1,
      y: 1,
    },
    1: {
      createdAt: now,
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

  const itemId = KNOWN_IDS["Stone Rock"];

  // Helper to find a counter that doesn't trigger Native or Rock Golem
  function findNonCriticalCounter() {
    for (let counter = 0; counter < 100; counter++) {
      const nativeTriggers = prngChance({
        farmId,
        itemId,
        counter,
        chance: 20,
        criticalHitName: "Native",
      });
      const rockGolemTriggers = prngChance({
        farmId,
        itemId,
        counter,
        chance: 10,
        criticalHitName: "Rock Golem",
      });
      if (!nativeTriggers && !rockGolemTriggers) {
        return counter;
      }
    }
    return 0;
  }

  it("throws an error if no axes are left", () => {
    expect(() =>
      mineStone({
        state: { ...GAME_STATE, bumpkin: TEST_BUMPKIN },
        createdAt: now,
        action: {
          type: "stoneRock.mined",
          index: "0",
        },
        farmId,
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
        createdAt: now,
        action: {
          type: "stoneRock.mined",
          index: "3",
        },
        farmId,
      }),
    ).toThrow("No rock");
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
        createdAt: now,
        action: {
          type: "stoneRock.mined",
          index: "0",
        },
        farmId,
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
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    };
    const game = mineStone(payload);

    // Try same payload
    expect(() =>
      mineStone({
        state: game,
        action: payload.action,
        createdAt: now,
        farmId,
      }),
    ).toThrow("Rock is still recovering");
  });

  it("mines stone", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(1),
        },
        farmActivity: { "Stone Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    };

    const game = mineStone(payload);

    expect(game.inventory.Pickaxe).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(1));
  });

  it("mines multiple stone", () => {
    // Find two consecutive counters that don't trigger critical hits
    function findTwoNonCriticalCounters() {
      for (let counter = 0; counter < 100; counter++) {
        const first =
          !prngChance({
            farmId,
            itemId,
            counter,
            chance: 20,
            criticalHitName: "Native",
          }) &&
          !prngChance({
            farmId,
            itemId,
            counter,
            chance: 10,
            criticalHitName: "Rock Golem",
          });
        const second =
          !prngChance({
            farmId,
            itemId,
            counter: counter + 1,
            chance: 20,
            criticalHitName: "Native",
          }) &&
          !prngChance({
            farmId,
            itemId,
            counter: counter + 1,
            chance: 10,
            criticalHitName: "Rock Golem",
          });
        if (first && second) {
          return counter;
        }
      }
      return 0;
    }

    const startCounter = findTwoNonCriticalCounters();

    let game = mineStone({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(3),
        },
        farmActivity: { "Stone Rock Mined": startCounter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    });

    game = mineStone({
      state: game,
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "1",
      } as LandExpansionStoneMineAction,
      farmId,
    });

    expect(game.inventory.Pickaxe).toEqual(new Decimal(1));
    expect(game.inventory.Stone).toEqual(new Decimal(2));
  });

  it("mines stone after waiting", () => {
    // Find two consecutive counters that don't trigger critical hits
    function findTwoConsecutiveNonCriticalCounters() {
      for (let counter = 0; counter < 100; counter++) {
        const first =
          !prngChance({
            farmId,
            itemId,
            counter,
            chance: 20,
            criticalHitName: "Native",
          }) &&
          !prngChance({
            farmId,
            itemId,
            counter,
            chance: 10,
            criticalHitName: "Rock Golem",
          });
        const second =
          !prngChance({
            farmId,
            itemId,
            counter: counter + 1,
            chance: 20,
            criticalHitName: "Native",
          }) &&
          !prngChance({
            farmId,
            itemId,
            counter: counter + 1,
            chance: 10,
            criticalHitName: "Rock Golem",
          });
        if (first && second) {
          return counter;
        }
      }
      return 0;
    }

    const startCounter = findTwoConsecutiveNonCriticalCounters();
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(2),
        },
        farmActivity: { "Stone Rock Mined": startCounter },
      },
      createdAt: Date.now(),
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
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

  it("applies rock golem critical hit when rock golem is placed and PRNG triggers", () => {
    // Find a counter that triggers Rock Golem but not Native
    function findRockGolemOnlyCounter() {
      for (let counter = 0; counter < 200; counter++) {
        const rockGolemTriggers = prngChance({
          farmId,
          itemId,
          counter,
          chance: 10,
          criticalHitName: "Rock Golem",
        });
        const nativeTriggers = prngChance({
          farmId,
          itemId,
          counter,
          chance: 20,
          criticalHitName: "Native",
        });
        if (rockGolemTriggers && !nativeTriggers) {
          return counter;
        }
      }
      throw new Error("Could not find Rock Golem only counter");
    }

    const rockGolemCounter = findRockGolemOnlyCounter();

    const game = mineStone({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Rock Golem": new Decimal(1),
          Pickaxe: new Decimal(1),
        },
        collectibles: {
          "Rock Golem": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Stone Rock Mined": rockGolemCounter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    });

    expect(game.inventory.Stone).toEqual(new Decimal(3));
  });

  it("does not apply rock golem critical hit when rock golem not placed", () => {
    const counter = findNonCriticalCounter();
    const game = mineStone({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(1),
        },
        farmActivity: { "Stone Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    });

    expect(game.inventory.Stone).toEqual(new Decimal(1));
  });

  it("does not apply rock golem critical hit when PRNG doesn't trigger", () => {
    const counter = findNonCriticalCounter();
    const game = mineStone({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Rock Golem": new Decimal(1),
          Pickaxe: new Decimal(1),
        },
        collectibles: {
          "Rock Golem": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Stone Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    });

    expect(game.inventory.Stone).toEqual(new Decimal(1));
  });

  it("adds 25% stone when Tunnel Mole (T1) is placed and ready", () => {
    const counter = findNonCriticalCounter();
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
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Stone Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    });

    expect(game.inventory.Stone).toEqual(new Decimal(1.25));
  });

  it("provides 325% stone with Tunnel Mole (T1) and Rock Golem critical hit when both are placed and PRNG triggers", () => {
    // Find a counter that triggers Rock Golem but not Native
    function findRockGolemOnlyCounter() {
      for (let counter = 0; counter < 200; counter++) {
        const rockGolemTriggers = prngChance({
          farmId,
          itemId,
          counter,
          chance: 10,
          criticalHitName: "Rock Golem",
        });
        const nativeTriggers = prngChance({
          farmId,
          itemId,
          counter,
          chance: 20,
          criticalHitName: "Native",
        });
        if (rockGolemTriggers && !nativeTriggers) {
          return counter;
        }
      }
      throw new Error("Could not find Rock Golem only counter");
    }

    const rockGolemCounter = findRockGolemOnlyCounter();

    const game = mineStone({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Tunnel Mole": new Decimal(1),
          "Rock Golem": new Decimal(1),
          Pickaxe: new Decimal(1),
        },
        collectibles: {
          "Tunnel Mole": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
          "Rock Golem": [
            {
              id: "456",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Stone Rock Mined": rockGolemCounter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    });

    expect(game.inventory.Stone).toEqual(new Decimal(3.25));
  });

  it("adds +0.5 stone when stone rock is within Emerald Turtle AoE", () => {
    const counter = findNonCriticalCounter();
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
              createdAt: now,
              coordinates: { x: 2, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Stone Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    };

    const game = mineStone(payload);

    expect(game.inventory["Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(1.5));
  });

  it("sets the AOE last used time to now", () => {
    const counter = findNonCriticalCounter();
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
              createdAt: now,
              coordinates: { x: 2, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Stone Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    };

    const game = mineStone(payload);

    expect(game.aoe["Emerald Turtle"]).toEqual({
      "-1": {
        "0": now,
      },
    });
  });

  it("does not apply the AOE if the AOE is not ready", () => {
    const counter = findNonCriticalCounter();
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
              createdAt: now,
              coordinates: { x: 2, y: 1 },
              readyAt: now - 5 * 60 * 1000,
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
        farmActivity: { "Stone Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    };

    const game = mineStone(payload);

    expect(game.inventory.Stone).toEqual(new Decimal(1));
  });

  it("does apply the AOE if the AOE is ready", () => {
    const counter = findNonCriticalCounter();
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
              createdAt: now,
              coordinates: { x: 2, y: 1 },
              readyAt: now - 5 * 60 * 1000,
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
        farmActivity: { "Stone Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    };

    const game = mineStone(payload);

    expect(game.inventory.Stone).toEqual(new Decimal(1.5));
  });

  it("applies the AOE on a stone with boosted time", () => {
    const boostedTime = STONE_RECOVERY_TIME * 1000 * 0.5;
    const counter = findNonCriticalCounter();

    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(1),
        },
        stones: {
          0: {
            createdAt: now,
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
              createdAt: now,
              coordinates: { x: 2, y: 1 },
              readyAt: now - 5 * 60 * 1000,
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
        farmActivity: { "Stone Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    };

    const game = mineStone(payload);

    expect(game.inventory.Stone).toEqual(new Decimal(1.5));
  });

  it("does not add boost when stone rock is outside Emerald Turtle AoE", () => {
    const counter = findNonCriticalCounter();
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
              createdAt: now,
              coordinates: { x: 3, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Stone Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    });

    expect(game.inventory["Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(1));
  });

  it("adds +0.1 stone when stone rock is within Tin Turtle AoE", () => {
    const counter = findNonCriticalCounter();
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
              createdAt: now,
              coordinates: { x: 2, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Stone Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    });

    expect(game.inventory["Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(1.1));
  });

  it("adds +0.1 stone when Stone Beetle is placed and ready", () => {
    const counter = findNonCriticalCounter();
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
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Stone Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    });

    expect(game.inventory.Stone).toEqual(new Decimal(1.1));
  });

  it("applies a bud boost", () => {
    const counter = findNonCriticalCounter();
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
      farmActivity: { "Stone Rock Mined": counter },
    };

    const game = mineStone({
      state,
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    });

    expect(game.inventory.Stone).toEqual(new Decimal(1.2));
  });

  it("adds +0.25 stone when a Faction Shield is equipped(Right Faction)", () => {
    const counter = findNonCriticalCounter();
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
      farmActivity: { "Stone Rock Mined": counter },
    };

    const game = mineStone({
      state,
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    });

    expect(game.inventory["Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(1.25));
  });

  it("Faction Shield boost is not applied if Different Faction", () => {
    const counter = findNonCriticalCounter();
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
      farmActivity: { "Stone Rock Mined": counter },
    };

    const game = mineStone({
      state,
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    });

    expect(game.inventory["Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(1));
  });

  it("Faction Shield boost is not applied if No Faction", () => {
    const counter = findNonCriticalCounter();
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
      farmActivity: { "Stone Rock Mined": counter },
    };

    const game = mineStone({
      state,
      createdAt: now,
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      farmId,
    });

    expect(game.inventory["Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Stone).toEqual(new Decimal(1));
  });

  it("stores the boostedTime on the stone", () => {
    const counter = findNonCriticalCounter();
    const testNow = Date.now();
    const state = mineStone({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Pickaxe: new Decimal(1),
        },
        collectibles: {
          "Time Warp Totem": [
            {
              id: "123",
              createdAt: testNow,
              coordinates: { x: 1, y: 1 },
              readyAt: testNow - 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Stone Rock Mined": counter },
      },
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      createdAt: testNow,
      farmId,
    });

    expect(state.stones[0].stone.boostedTime).toEqual(
      STONE_RECOVERY_TIME * 0.5 * 1000,
    );
  });

  describe("getStoneDropAmount", () => {
    it("applies +0.1 Stone with Rock'N'Roll skill", () => {
      const counter = findNonCriticalCounter();
      const { amount } = getStoneDropAmount({
        game: {
          ...INITIAL_FARM,
          bumpkin: { ...TEST_BUMPKIN, skills: { "Rock'N'Roll": 1 } },
        },
        rock: {
          createdAt: now - 5 * 60 * 1000,
          stone: {
            minedAt: now - 5 * 60 * 1000,
          },
          x: 0,
          y: 0,
        },
        createdAt: now,
        id: "0",
        farmId,
        counter,
        itemId,
      });

      expect(amount.toNumber()).toEqual(1.1);
    });

    it("applies -0.5 Stone with Ferrous Favor skill", () => {
      const counter = findNonCriticalCounter();
      const { amount } = getStoneDropAmount({
        game: {
          ...INITIAL_FARM,
          bumpkin: { ...TEST_BUMPKIN, skills: { "Ferrous Favor": 1 } },
        },
        rock: {
          createdAt: now - 5 * 60 * 1000,
          stone: {
            minedAt: now - 5 * 60 * 1000,
          },
          x: 0,
          y: 0,
        },
        createdAt: now,
        id: "0",
        farmId,
        counter,
        itemId,
      });

      expect(amount.toNumber()).toEqual(0.5);
    });

    it("applies +1 Native bonus drop via PRNG", () => {
      // Find a counter that triggers Native but not Rock Golem
      function findNativeOnlyCounter() {
        for (let counter = 0; counter < 200; counter++) {
          const nativeTriggers = prngChance({
            farmId,
            itemId,
            counter,
            chance: 20,
            criticalHitName: "Native",
          });
          const rockGolemTriggers = prngChance({
            farmId,
            itemId,
            counter,
            chance: 10,
            criticalHitName: "Rock Golem",
          });
          if (nativeTriggers && !rockGolemTriggers) {
            return counter;
          }
        }
        throw new Error("Could not find Native only counter");
      }

      const nativeCounter = findNativeOnlyCounter();
      const { amount } = getStoneDropAmount({
        game: INITIAL_FARM,
        rock: {
          createdAt: now - 5 * 60 * 1000,
          stone: {
            minedAt: now - 5 * 60 * 1000,
          },
          x: 0,
          y: 0,
        },
        createdAt: now,
        id: "0",
        farmId,
        counter: nativeCounter,
        itemId,
      });

      expect(amount.toNumber()).toEqual(2);
    });
  });

  describe("BumpkinActivity", () => {
    it("increments Stone Mined activity by 1 when 1 stone is mined", () => {
      const counter = findNonCriticalCounter();
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
          farmActivity: { "Stone Rock Mined": counter },
        },
        createdAt: now,
        action: {
          type: "stoneRock.mined",
          index: "0",
        } as LandExpansionStoneMineAction,
        farmId,
      });

      expect(game.farmActivity["Stone Mined"]).toBe(1);
    });

    it("increments Stone Mined activity by 2 when 2 stones are mined", () => {
      // Find two consecutive counters that don't trigger critical hits
      function findTwoNonCriticalCounters() {
        for (let counter = 0; counter < 100; counter++) {
          const first =
            !prngChance({
              farmId,
              itemId,
              counter,
              chance: 20,
              criticalHitName: "Native",
            }) &&
            !prngChance({
              farmId,
              itemId,
              counter,
              chance: 10,
              criticalHitName: "Rock Golem",
            });
          const second =
            !prngChance({
              farmId,
              itemId,
              counter: counter + 1,
              chance: 20,
              criticalHitName: "Native",
            }) &&
            !prngChance({
              farmId,
              itemId,
              counter: counter + 1,
              chance: 10,
              criticalHitName: "Rock Golem",
            });
          if (first && second) {
            return counter;
          }
        }
        return 0;
      }

      const startCounter = findTwoNonCriticalCounters();
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
          farmActivity: { "Stone Rock Mined": startCounter },
        },
        createdAt: now,
        action: {
          type: "stoneRock.mined",
          index: "0",
        } as LandExpansionStoneMineAction,
        farmId,
      });

      const game = mineStone({
        state: state1,
        createdAt: now,
        action: {
          type: "stoneRock.mined",
          index: "1",
        } as LandExpansionStoneMineAction,
        farmId,
      });

      expect(game.farmActivity["Stone Mined"]).toBe(2);
    });
  });

  it("stone replenishes faster with time warp", () => {
    const now = Date.now();

    const { time } = getMinedAt({
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

    expect(time).toEqual(now - (STONE_RECOVERY_TIME * 1000) / 2);
  });

  it("stone replenishes faster with Super Totem", () => {
    const now = Date.now();

    const { time } = getMinedAt({
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

    expect(time).toEqual(now - (STONE_RECOVERY_TIME * 1000) / 2);
  });

  it("doesn't stack Super Totem and Time Warp Totem", () => {
    const now = Date.now();

    const { time } = getMinedAt({
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

    expect(time).toEqual(now - (STONE_RECOVERY_TIME * 1000) / 2);
  });

  it("reduces the cooldown time with Speed Miner Skill", () => {
    const now = Date.now();

    const { time } = getMinedAt({
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
    const { time } = getMinedAt({
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

    expect(time).toEqual(now - (STONE_RECOVERY_TIME * 1000) / 2);
  });

  it("does not apply an Ore Hourglass boost if expired", () => {
    const now = Date.now();
    const fourHoursAgo = now - 4 * 60 * 60 * 1000;

    const { time } = getMinedAt({
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

    expect(time).toEqual(now);
  });

  it("applies a +0.1 boost if the player is on volcano island", () => {
    const counter = findNonCriticalCounter();
    const state = mineStone({
      state: {
        ...GAME_STATE,
        island: {
          type: "volcano",
        },
        inventory: {
          Pickaxe: new Decimal(1),
        },
        farmActivity: { "Stone Rock Mined": counter },
      },
      action: {
        type: "stoneRock.mined",
        index: "0",
      } as LandExpansionStoneMineAction,
      createdAt: now,
      farmId,
    });

    expect(state.inventory.Stone).toEqual(new Decimal(1.1));
  });

  it("doesn't require pickaxes if Quarry is built", () => {
    const counter = findNonCriticalCounter();
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
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now,
            },
          ],
        },
        farmActivity: { "Stone Rock Mined": counter },
      },
      action: {
        type: "stoneRock.mined",
        index: "0",
      },
      createdAt: now,
      farmId,
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
