import Decimal from "decimal.js-light";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { GOLD_RECOVERY_TIME, INITIAL_FARM } from "features/game/lib/constants";
import { KNOWN_IDS } from "features/game/types";
import { GameState } from "features/game/types/game";
import { prngChance } from "lib/prng";
import { mineGold, LandExpansionGoldMineAction, getMinedAt } from "./mineGold";

const now = Date.now();
const farmId = 1;

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  gold: {
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

describe("mineGold", () => {
  const itemId = KNOWN_IDS["Gold Rock"];

  // Helper to find a counter that doesn't trigger Native
  function findNonCriticalCounter() {
    for (let counter = 0; counter < 100; counter++) {
      const nativeTriggers = prngChance({
        farmId,
        itemId,
        counter,
        chance: 10,
        criticalHitName: "Native",
      });
      if (!nativeTriggers) {
        return counter;
      }
    }
    return 0;
  }
  it("throws an error if no axes are left", () => {
    expect(() =>
      mineGold({
        farmId,
        state: { ...GAME_STATE, bumpkin: TEST_BUMPKIN },
        createdAt: now,
        action: {
          type: "goldRock.mined",
          index: "0",
        },
      }),
    ).toThrow("No pickaxes left");
  });

  it("throws an error if gold is not placed", () => {
    expect(() =>
      mineGold({
        farmId,
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          gold: {
            0: { ...GAME_STATE.gold[0], x: undefined, y: undefined },
          },
        },
        action: { type: "goldRock.mined", index: "0" },
        createdAt: now,
      }),
    ).toThrow("Gold rock is not placed");
  });

  it("throws an error if gold does not exist", () => {
    expect(() =>
      mineGold({
        farmId,
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Iron Pickaxe": new Decimal(2),
          },
        },
        createdAt: now,
        action: {
          type: "goldRock.mined",
          index: "3",
        },
      }),
    ).toThrow("No gold");
  });

  it("throws an error if gold is not ready", () => {
    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(2),
        },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };
    const game = mineGold(payload);

    // Try same payload
    expect(() =>
      mineGold({
        farmId,
        state: game,
        action: payload.action,
        createdAt: now,
      }),
    ).toThrow("Gold is still recovering");
  });

  it("mines gold", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
        },
        farmActivity: { "Gold Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(1));
  });

  it("mines multiple gold", () => {
    // Find two consecutive counters that don't trigger critical hits
    function findTwoNonCriticalCounters() {
      for (let counter = 0; counter < 100; counter++) {
        const first = !prngChance({
          farmId,
          itemId,
          counter,
          chance: 10,
          criticalHitName: "Native",
        });
        const second = !prngChance({
          farmId,
          itemId,
          counter: counter + 1,
          chance: 10,
          criticalHitName: "Native",
        });
        if (first && second) {
          return counter;
        }
      }
      return 0;
    }

    const startCounter = findTwoNonCriticalCounters();

    let game = mineGold({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(3),
        },
        farmActivity: { "Gold Rock Mined": startCounter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    });

    game = mineGold({
      farmId,
      state: game,
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "1",
      } as LandExpansionGoldMineAction,
    });

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(1));
    expect(game.inventory.Gold).toEqual(new Decimal(2));
  });

  it("mines gold after waiting", () => {
    jest.useFakeTimers();

    // Find two consecutive counters that don't trigger critical hits
    function findTwoNonCriticalCounters() {
      for (let counter = 0; counter < 100; counter++) {
        const first = !prngChance({
          farmId,
          itemId,
          counter,
          chance: 10,
          criticalHitName: "Native",
        });
        const second = !prngChance({
          farmId,
          itemId,
          counter: counter + 1,
          chance: 10,
          criticalHitName: "Native",
        });
        if (first && second) {
          return counter;
        }
      }
      return 0;
    }

    const startCounter = findTwoNonCriticalCounters();

    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(2),
        },
        farmActivity: { "Gold Rock Mined": startCounter },
      },
      createdAt: Date.now(),
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
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
    expect(game.inventory.Gold?.toNumber()).toBe(2);

    jest.useRealTimers();
  });

  it("adds 25% gold when Nugget (T3 Mole) is placed and ready", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
        },
        collectibles: {
          Nugget: [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Gold Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(1.25));
  });

  it("adds +0.5 gold when Golden Touch skill is active", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          skills: { "Golden Touch": 1 },
        },
        inventory: {
          "Iron Pickaxe": new Decimal(1),
        },
        farmActivity: { "Gold Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(1.5));
  });

  it("dos not apply boost when Nugget (T3 Mole) is placed but not ready", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
        },
        collectibles: {
          Nugget: [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now + 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Gold Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(1));
  });

  it("adds bonus drop via PRNG", () => {
    // Find a counter that triggers Native
    function findNativeCounter() {
      for (let counter = 0; counter < 200; counter++) {
        const nativeTriggers = prngChance({
          farmId,
          itemId,
          counter,
          chance: 10,
          criticalHitName: "Native",
        });
        if (nativeTriggers) {
          return counter;
        }
      }
      throw new Error("Could not find Native counter");
    }

    const nativeCounter = findNativeCounter();
    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
        },
        gold: {
          0: {
            ...GAME_STATE.gold[0],
            stone: {
              minedAt: now - 25 * 60 * 60 * 1000,
            },
          },
        },
        farmActivity: { "Gold Rock Mined": nativeCounter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(2));
  });

  it("adds +0.5 gold when gold is within Emerald Turtle AoE", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
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
        farmActivity: { "Gold Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(1.5));
  });

  it("sets the AOE last used time to now", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
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
        farmActivity: { "Gold Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.aoe["Emerald Turtle"]).toEqual({
      "-1": {
        "0": now,
      },
    });
  });

  it("does not apply the AOE if the AOE is not ready", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
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
        farmActivity: { "Gold Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory.Gold).toEqual(new Decimal(1));
  });

  it("does apply the AOE if the AOE is ready", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
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
              "0": now - GOLD_RECOVERY_TIME * 1000,
            },
          },
        },
        farmActivity: { "Gold Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory.Gold).toEqual(new Decimal(1.5));
  });

  it("applies the AOE on a gold with boosted time", () => {
    const boostedTime = GOLD_RECOVERY_TIME * 1000 * 0.5;
    const counter = findNonCriticalCounter();

    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
        },
        gold: {
          0: {
            createdAt: now,
            stone: {
              minedAt: now - GOLD_RECOVERY_TIME * 1000,
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
              "0": now - (GOLD_RECOVERY_TIME * 1000 - boostedTime),
            },
          },
        },
        farmActivity: { "Gold Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory.Gold).toEqual(new Decimal(1.5));
  });

  it("adds +0.1 gold when Gilded Swordfish is placed", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
        },
        collectibles: {
          "Gilded Swordfish": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 2, y: 1 },
              readyAt: now - 10000,
            },
          ],
        },
        farmActivity: { "Gold Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(1.1));
  });

  it("adds +0.1 gold when Gold Beetle is placed", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
        },
        collectibles: {
          "Gold Beetle": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 2, y: 1 },
              readyAt: now - 10000,
            },
          ],
        },
        farmActivity: { "Gold Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(1.1));
  });

  it("adds +0.5 gold when Golden Touch skill is active (duplicate)", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          skills: { "Golden Touch": 1 },
        },
        inventory: {
          "Iron Pickaxe": new Decimal(1),
        },
        farmActivity: { "Gold Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(1.5));
  });

  it("adds +0.25 gold when a Faction Shield is equipped(Right Faction)", () => {
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
        "Iron Pickaxe": new Decimal(1),
      },
      farmActivity: { "Gold Rock Mined": counter },
    };
    const payload = {
      farmId,
      state,
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(1.25));
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
        "Iron Pickaxe": new Decimal(1),
      },
      farmActivity: { "Gold Rock Mined": counter },
    };
    const payload = {
      farmId,
      state,
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(1));
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
        "Iron Pickaxe": new Decimal(1),
      },
      farmActivity: { "Gold Rock Mined": counter },
    };
    const payload = {
      farmId,
      state,
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory["Iron Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Gold).toEqual(new Decimal(1));
  });

  it("applies a bud boost", () => {
    const counter = findNonCriticalCounter();
    const state: GameState = {
      ...GAME_STATE,
      bumpkin: TEST_BUMPKIN,
      inventory: {
        "Iron Pickaxe": new Decimal(1),
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
      farmActivity: { "Gold Rock Mined": counter },
    };

    const payload = {
      farmId,
      state,
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    };

    const game = mineGold(payload);

    expect(game.inventory.Gold).toEqual(new Decimal(1.2));
  });

  it("stores the boostedTime on the gold", () => {
    const counter = findNonCriticalCounter();
    const testNow = Date.now();

    const state = mineGold({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Iron Pickaxe": new Decimal(1),
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
        farmActivity: { "Gold Rock Mined": counter },
      },
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
      createdAt: testNow,
    });

    expect(state.gold[0].stone.boostedTime).toEqual(
      GOLD_RECOVERY_TIME * 0.5 * 1000,
    );
  });

  describe("BumpkinActivity", () => {
    it("increments Gold mined activity by 1", () => {
      const counter = findNonCriticalCounter();
      const bumpkin = {
        ...TEST_BUMPKIN,
      };
      const game = mineGold({
        farmId,
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            "Iron Pickaxe": new Decimal(3),
          },
          farmActivity: { "Gold Rock Mined": counter },
        },
        createdAt: now,
        action: {
          type: "goldRock.mined",
          index: "0",
        } as LandExpansionGoldMineAction,
      });

      expect(game.farmActivity["Gold Mined"]).toBe(1);
    });

    it("increments Gold Mined activity by 2", () => {
      // Find two consecutive counters that don't trigger critical hits
      function findTwoNonCriticalCounters() {
        for (let counter = 0; counter < 100; counter++) {
          const first = !prngChance({
            farmId,
            itemId,
            counter,
            chance: 10,
            criticalHitName: "Native",
          });
          const second = !prngChance({
            farmId,
            itemId,
            counter: counter + 1,
            chance: 10,
            criticalHitName: "Native",
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
      const state1 = mineGold({
        farmId,
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            "Iron Pickaxe": new Decimal(3),
          },
          farmActivity: { "Gold Rock Mined": startCounter },
        },
        createdAt: now,
        action: {
          type: "goldRock.mined",
          index: "0",
        } as LandExpansionGoldMineAction,
      });

      const game = mineGold({
        farmId,
        state: state1,
        createdAt: now,
        action: {
          type: "goldRock.mined",
          index: "1",
        } as LandExpansionGoldMineAction,
      });

      expect(game.farmActivity["Gold Mined"]).toBe(2);
    });
  });

  it("gold replenishes faster with time warp", () => {
    const now = Date.now();

    const { time } = getMinedAt({
      prngArgs: {
        farmId: 1,
        itemId: KNOWN_IDS["Gold Rock"],
        counter: 0,
      },
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
      createdAt: now,
    });

    expect(time).toEqual(now - (GOLD_RECOVERY_TIME * 1000) / 2);
  });

  it("gold replenishes faster with Super Totem", () => {
    const now = Date.now();

    const { time } = getMinedAt({
      prngArgs: {
        farmId: 1,
        itemId: KNOWN_IDS["Gold Rock"],
        counter: 0,
      },
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
      createdAt: now,
    });

    expect(time).toEqual(now - (GOLD_RECOVERY_TIME * 1000) / 2);
  });

  it("doesn't stack Super Totem and Time Warp Totem", () => {
    const now = Date.now();

    const { time } = getMinedAt({
      prngArgs: {
        farmId: 1,
        itemId: KNOWN_IDS["Gold Rock"],
        counter: 0,
      },
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
      createdAt: now,
    });

    expect(time).toEqual(now - (GOLD_RECOVERY_TIME * 1000) / 2);
  });

  it("applies a Ore Hourglass boost of -50% recovery time for 3 hours", () => {
    const now = Date.now();
    const { time } = getMinedAt({
      prngArgs: {
        farmId: 1,
        itemId: KNOWN_IDS["Gold Rock"],
        counter: 0,
      },
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
      createdAt: now,
    });

    expect(time).toEqual(now - (GOLD_RECOVERY_TIME * 1000) / 2);
  });

  it("applies a boost of -10% recovery time when Midas Sprint skill is active", () => {
    const now = Date.now();
    const { time } = getMinedAt({
      prngArgs: {
        farmId: 1,
        itemId: KNOWN_IDS["Gold Rock"],
        counter: 0,
      },
      game: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: { "Midas Sprint": 1 },
        },
      },
      createdAt: now,
    });

    expect(time).toEqual(now - GOLD_RECOVERY_TIME * 1000 * 0.1);
  });

  it("applies a boost of -15% recovery time when Pickaxe Shark is equipped", () => {
    const now = Date.now();
    const { time } = getMinedAt({
      prngArgs: {
        farmId: 1,
        itemId: KNOWN_IDS["Gold Rock"],
        counter: 0,
      },
      game: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            tool: "Pickaxe Shark",
          },
        },
      },
      createdAt: now,
    });

    expect(time).toEqual(now - GOLD_RECOVERY_TIME * 1000 * 0.15);
  });

  it("has a 10% chance to instant regrow when Pickaxe Shark is equipped", () => {
    function getCounter() {
      let counter = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (
          prngChance({
            farmId: 1,
            itemId: KNOWN_IDS["Gold Rock"],
            counter,
            chance: 10,
            criticalHitName: "Pickaxe Shark",
          })
        ) {
          return counter;
        }
        counter++;
      }
    }
    const now = Date.now();
    const { time } = getMinedAt({
      prngArgs: {
        farmId: 1,
        itemId: KNOWN_IDS["Gold Rock"],
        counter: getCounter(),
      },
      game: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            tool: "Pickaxe Shark",
          },
        },
      },
      createdAt: now,
    });

    expect(time).toEqual(now - GOLD_RECOVERY_TIME * 1000);
  });

  it("does not apply an Ore Hourglass boost if expired", () => {
    const now = Date.now();
    const fourHoursAgo = now - 4 * 60 * 60 * 1000;

    const { time } = getMinedAt({
      prngArgs: {
        farmId: 1,
        itemId: KNOWN_IDS["Gold Rock"],
        counter: 0,
      },
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
      createdAt: now,
    });

    expect(time).toEqual(now);
  });

  describe("PRNG counter security", () => {
    it("always increments the counter after each mine", () => {
      const initialCounter = 100;

      let state: GameState = {
        ...INITIAL_FARM,
        bumpkin: TEST_BUMPKIN,
        inventory: { "Iron Pickaxe": new Decimal(10) },
        gold: {
          0: { createdAt: now, stone: { minedAt: 0 }, x: 1, y: 1 },
          1: { createdAt: now, stone: { minedAt: 0 }, x: 2, y: 1 },
          2: { createdAt: now, stone: { minedAt: 0 }, x: 3, y: 1 },
        },
        farmActivity: { "Gold Rock Mined": initialCounter },
      };

      // Mine gold 0
      state = mineGold({
        farmId,
        state,
        createdAt: now,
        action: { type: "goldRock.mined", index: "0" },
      });
      expect(state.farmActivity["Gold Rock Mined"]).toEqual(initialCounter + 1);

      // Mine gold 1
      state = mineGold({
        farmId,
        state,
        createdAt: now,
        action: { type: "goldRock.mined", index: "1" },
      });
      expect(state.farmActivity["Gold Rock Mined"]).toEqual(initialCounter + 2);

      // Mine gold 2
      state = mineGold({
        farmId,
        state,
        createdAt: now,
        action: { type: "goldRock.mined", index: "2" },
      });
      expect(state.farmActivity["Gold Rock Mined"]).toEqual(initialCounter + 3);
    });

    it("counter increments even when Native triggers", () => {
      // Find a counter that triggers Native
      function findNativeTriggerCounter() {
        let counter = 0;
        while (counter < 1000) {
          if (
            prngChance({
              farmId,
              itemId,
              counter,
              chance: 10,
              criticalHitName: "Native",
            })
          ) {
            return counter;
          }
          counter++;
        }
        throw new Error("Could not find trigger counter");
      }

      const triggerCounter = findNativeTriggerCounter();

      const state: GameState = {
        ...INITIAL_FARM,
        bumpkin: TEST_BUMPKIN,
        inventory: { "Iron Pickaxe": new Decimal(10) },
        gold: {
          0: { createdAt: now, stone: { minedAt: 0 }, x: 1, y: 1 },
        },
        farmActivity: { "Gold Rock Mined": triggerCounter },
      };

      const result = mineGold({
        farmId,
        state,
        createdAt: now,
        action: { type: "goldRock.mined", index: "0" },
      });

      // Native should have triggered (extra gold)
      expect(result.inventory.Gold?.toNumber()).toBeGreaterThan(1);

      // Counter should STILL increment
      expect(result.farmActivity["Gold Rock Mined"]).toEqual(
        triggerCounter + 1,
      );
    });

    it("counter increments even when Pickaxe Shark instant regrow triggers", () => {
      // Find a counter that triggers Pickaxe Shark
      function findPickaxeSharkTriggerCounter() {
        let counter = 0;
        while (counter < 1000) {
          if (
            prngChance({
              farmId,
              itemId,
              counter,
              chance: 10,
              criticalHitName: "Pickaxe Shark",
            })
          ) {
            return counter;
          }
          counter++;
        }
        throw new Error("Could not find trigger counter");
      }

      const triggerCounter = findPickaxeSharkTriggerCounter();

      const state: GameState = {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          equipped: {
            ...TEST_BUMPKIN.equipped,
            tool: "Pickaxe Shark",
          },
        },
        inventory: { "Iron Pickaxe": new Decimal(10) },
        gold: {
          0: { createdAt: now, stone: { minedAt: 0 }, x: 1, y: 1 },
        },
        farmActivity: { "Gold Rock Mined": triggerCounter },
      };

      const result = mineGold({
        farmId,
        state,
        createdAt: now,
        action: { type: "goldRock.mined", index: "0" },
      });

      // Pickaxe Shark should have triggered (instant regrowth)
      expect(result.gold[0].stone.minedAt).toEqual(
        now - GOLD_RECOVERY_TIME * 1000,
      );

      // Counter should STILL increment
      expect(result.farmActivity["Gold Rock Mined"]).toEqual(
        triggerCounter + 1,
      );
    });

    it("PRNG outcome is deterministic for the same counter", () => {
      const testCounter = 42;

      // Same inputs should always produce the same result
      const result1 = prngChance({
        farmId,
        itemId,
        counter: testCounter,
        chance: 10,
        criticalHitName: "Native",
      });

      const result2 = prngChance({
        farmId,
        itemId,
        counter: testCounter,
        chance: 10,
        criticalHitName: "Native",
      });

      expect(result1).toEqual(result2);
    });

    it("different counters produce different PRNG outcomes", () => {
      // Test that incrementing counter changes the outcome
      const results: boolean[] = [];

      for (let counter = 0; counter < 100; counter++) {
        results.push(
          prngChance({
            farmId,
            itemId,
            counter,
            chance: 10,
            criticalHitName: "Native",
          }),
        );
      }

      // With 10% chance over 100 tries, we should see both true and false
      const trueCount = results.filter((r) => r).length;
      const falseCount = results.filter((r) => !r).length;

      expect(trueCount).toBeGreaterThan(0);
      expect(falseCount).toBeGreaterThan(0);

      // Roughly 10% should be true (with some tolerance)
      expect(trueCount).toBeGreaterThan(2);
      expect(trueCount).toBeLessThan(25);
    });

    it("mining multiple gold uses sequential counters", () => {
      const initialCounter = 50;

      // Find which counters trigger Native
      const triggeringCounters: number[] = [];
      for (let c = initialCounter; c < initialCounter + 5; c++) {
        if (
          prngChance({
            farmId,
            itemId,
            counter: c,
            chance: 10,
            criticalHitName: "Native",
          })
        ) {
          triggeringCounters.push(c);
        }
      }

      let state: GameState = {
        ...INITIAL_FARM,
        bumpkin: TEST_BUMPKIN,
        inventory: { "Iron Pickaxe": new Decimal(10) },
        gold: {
          0: { createdAt: now, stone: { minedAt: 0 }, x: 1, y: 1 },
          1: { createdAt: now, stone: { minedAt: 0 }, x: 2, y: 1 },
          2: { createdAt: now, stone: { minedAt: 0 }, x: 3, y: 1 },
          3: { createdAt: now, stone: { minedAt: 0 }, x: 4, y: 1 },
          4: { createdAt: now, stone: { minedAt: 0 }, x: 5, y: 1 },
        },
        farmActivity: { "Gold Rock Mined": initialCounter },
      };

      // Mine all 5 gold
      for (let i = 0; i < 5; i++) {
        state = mineGold({
          farmId,
          state,
          createdAt: now,
          action: { type: "goldRock.mined", index: String(i) },
        });
      }

      // Verify counter incremented correctly
      expect(state.farmActivity["Gold Rock Mined"]).toEqual(initialCounter + 5);
    });

    it("cannot reuse the same counter by mining same gold twice", () => {
      const initialCounter = 0;

      const state: GameState = {
        ...INITIAL_FARM,
        bumpkin: TEST_BUMPKIN,
        inventory: { "Iron Pickaxe": new Decimal(10) },
        gold: {
          0: { createdAt: now, stone: { minedAt: 0 }, x: 1, y: 1 },
        },
        farmActivity: { "Gold Rock Mined": initialCounter },
      };

      // First mine
      const afterFirstMine = mineGold({
        farmId,
        state,
        createdAt: now,
        action: { type: "goldRock.mined", index: "0" },
      });

      expect(afterFirstMine.farmActivity["Gold Rock Mined"]).toEqual(1);

      // Trying to mine the same gold again should fail (gold still recovering)
      expect(() =>
        mineGold({
          farmId,
          state: afterFirstMine,
          createdAt: now,
          action: { type: "goldRock.mined", index: "0" },
        }),
      ).toThrow("Gold is still recovering");

      // Counter should still be 1 (not incremented by failed attempt)
      expect(afterFirstMine.farmActivity["Gold Rock Mined"]).toEqual(1);
    });

    it("counter persists across game state - no way to reset", () => {
      const highCounter = 9999;

      const state: GameState = {
        ...INITIAL_FARM,
        bumpkin: TEST_BUMPKIN,
        inventory: { "Iron Pickaxe": new Decimal(10) },
        gold: {
          0: { createdAt: now, stone: { minedAt: 0 }, x: 1, y: 1 },
        },
        farmActivity: { "Gold Rock Mined": highCounter },
      };

      const result = mineGold({
        farmId,
        state,
        createdAt: now,
        action: { type: "goldRock.mined", index: "0" },
      });

      // Counter should increment from the high value, not reset
      expect(result.farmActivity["Gold Rock Mined"]).toEqual(highCounter + 1);
    });
  });
});
