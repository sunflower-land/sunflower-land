import Decimal from "decimal.js-light";
import { placeGold } from "./placeGold";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { GOLD_RECOVERY_TIME, INITIAL_FARM } from "features/game/lib/constants";
import { KNOWN_IDS } from "features/game/types";
import type { GameState, Rock } from "features/game/types/game";
import { prngChance } from "lib/prng";
import { getMineReadyAt } from "features/game/lib/resourceNodes";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import {
  mineGold,
  type LandExpansionGoldMineAction,
  getMinedAt,
} from "./mineGold";

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

  it("applies a +0.1 boost if the player is on volcano island", () => {
    const counter = findNonCriticalCounter();
    const game = mineGold({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        island: { type: "volcano" },
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
    });

    expect(game.inventory.Gold).toEqual(new Decimal(1.1));
  });

  it("applies the +0.1 volcano boost on ascension islands (e.g. spooky)", () => {
    const counter = findNonCriticalCounter();
    const game = mineGold({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        island: { type: "spooky" },
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
    });

    expect(game.inventory.Gold).toEqual(new Decimal(1.1));
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

  const goldAmountWithSkills = (skills: Record<string, number>) => {
    const counter = findNonCriticalCounter();
    const game = mineGold({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: { ...TEST_BUMPKIN, skills },
        inventory: { "Iron Pickaxe": new Decimal(1) },
        farmActivity: { "Gold Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    });
    return game.inventory.Gold;
  };

  it("adds +0.75 gold with Golden Touch at rank 2", () => {
    expect(goldAmountWithSkills({ "Golden Touch": 2 })).toEqual(
      new Decimal(1.75),
    );
  });

  it("adds +1 gold with Golden Touch at rank 3", () => {
    expect(goldAmountWithSkills({ "Golden Touch": 3 })).toEqual(new Decimal(2));
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

  it("does not apply the AOE if the tile paid out after the rock was mined", () => {
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
          ...GAME_STATE.gold,
          0: {
            ...GAME_STATE.gold[0],
            stone: { minedAt: now - GOLD_RECOVERY_TIME * 1000 - 1 },
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

  it("applies after a speed-boosted recovery when the tile paid out as the rock was mined", () => {
    // A Super Totem (2×) covering the whole recovery halves it. The tile paid out
    // when the rock was last mined, so the AOE applies again however fast the
    // rock recovered: no recovery duration is involved.
    const baseDurationMs = GOLD_RECOVERY_TIME * 1000;
    const windowedDuration = baseDurationMs / 2;
    const counter = findNonCriticalCounter();

    const game = mineGold({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: { "Iron Pickaxe": new Decimal(1) },
        gold: {
          0: {
            createdAt: now,
            stone: { minedAt: now - windowedDuration - 1, baseDurationMs },
            x: 1,
            y: 1,
          },
        },
        collectibles: {
          "Super Totem": [
            {
              id: "totem",
              createdAt: now - windowedDuration - 1,
              coordinates: { x: 9, y: 9 },
              readyAt: now - windowedDuration - 1,
            },
          ],
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
          "Emerald Turtle": { "-1": { "0": now - windowedDuration - 1 } },
        },
        farmActivity: { "Gold Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "goldRock.mined",
        index: "0",
      } as LandExpansionGoldMineAction,
    });

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
    const game: GameState = {
      ...INITIAL_FARM,
      collectibles: {
        "Time Warp Totem": [
          {
            id: "123",
            createdAt: now,
            coordinates: { x: 1, y: 1 },
            readyAt: now,
          },
        ],
      },
    };
    const { time, baseDurationMs } = getMinedAt({ game, createdAt: now });

    // The totem is a 2× window, not folded into baseDurationMs; any recovery
    // left after the window accrues at 1×.
    const BASE_MS = GOLD_RECOVERY_TIME * 1000;
    const windowMs = EXPIRY_COOLDOWNS["Time Warp Totem"];
    const workInWindow = Math.min(BASE_MS, windowMs * 2);
    expect(time).toEqual(now);
    expect(baseDurationMs).toEqual(BASE_MS);
    expect(
      getMineReadyAt(
        {
          stone: { minedAt: time, baseDurationMs },
          x: 1,
          y: 1,
        },
        "Gold Rock",
        game,
      ),
    ).toBeCloseTo(now + workInWindow / 2 + (BASE_MS - workInWindow), 0);
  });

  it("gold replenishes faster with Super Totem", () => {
    const now = Date.now();
    const game: GameState = {
      ...INITIAL_FARM,
      collectibles: {
        "Super Totem": [
          {
            id: "123",
            createdAt: now,
            coordinates: { x: 1, y: 1 },
            readyAt: now,
          },
        ],
      },
    };
    const { time, baseDurationMs } = getMinedAt({ game, createdAt: now });

    // The totem is a 2× window, not folded into baseDurationMs.
    const BASE_MS = GOLD_RECOVERY_TIME * 1000;
    const windowMs = EXPIRY_COOLDOWNS["Super Totem"];
    const workInWindow = Math.min(BASE_MS, windowMs * 2);
    expect(time).toEqual(now);
    expect(baseDurationMs).toEqual(BASE_MS);
    expect(
      getMineReadyAt(
        {
          stone: { minedAt: time, baseDurationMs },
          x: 1,
          y: 1,
        },
        "Gold Rock",
        game,
      ),
    ).toBeCloseTo(now + workInWindow / 2 + (BASE_MS - workInWindow), 0);
  });

  it("applies a Ore Hourglass boost of -50% recovery time for 3 hours", () => {
    const now = Date.now();
    const game: GameState = {
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
    };
    const { time, baseDurationMs } = getMinedAt({ game, createdAt: now });

    // A 2× window, not folded into baseDurationMs; any recovery left after the
    // window accrues at 1×.
    const BASE_MS = GOLD_RECOVERY_TIME * 1000;
    const windowMs = EXPIRY_COOLDOWNS["Ore Hourglass"];
    const workInWindow = Math.min(BASE_MS, windowMs * 2);
    expect(time).toEqual(now);
    expect(baseDurationMs).toEqual(BASE_MS);
    expect(
      getMineReadyAt(
        {
          stone: { minedAt: time, baseDurationMs },
          x: 1,
          y: 1,
        },
        "Gold Rock",
        game,
      ),
    ).toBeCloseTo(now + workInWindow / 2 + (BASE_MS - workInWindow), 0);
  });

  it("applies a boost of -10% recovery time when Midas Sprint skill is active", () => {
    const now = Date.now();
    const { time, baseDurationMs } = getMinedAt({
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

    expect(time).toEqual(now);
    expect(baseDurationMs).toEqual(GOLD_RECOVERY_TIME * 1000 * 0.9);
  });

  const goldRecoveryReductionWithSkills = (skills: Record<string, number>) => {
    const now = Date.now();
    const { time, baseDurationMs } = getMinedAt({
      prngArgs: { farmId: 1, itemId: KNOWN_IDS["Gold Rock"], counter: 0 },
      game: {
        ...INITIAL_FARM,
        bumpkin: { ...INITIAL_FARM.bumpkin, skills },
      },
      createdAt: now,
    });
    expect(time).toEqual(now);
    // Return the baked reduction as a fraction of the base recovery time.
    return 1 - (baseDurationMs ?? 0) / (GOLD_RECOVERY_TIME * 1000);
  };

  it("applies -12.5% recovery time with Midas Sprint at rank 2", () => {
    expect(goldRecoveryReductionWithSkills({ "Midas Sprint": 2 })).toBeCloseTo(
      0.125,
    );
  });

  it("applies -15% recovery time with Midas Sprint at rank 3", () => {
    expect(goldRecoveryReductionWithSkills({ "Midas Sprint": 3 })).toBeCloseTo(
      0.15,
    );
  });

  it("applies -20% recovery time with Midas Rush at rank 1", () => {
    expect(goldRecoveryReductionWithSkills({ "Midas Rush": 1 })).toBeCloseTo(
      0.2,
    );
  });

  it("applies -25% recovery time with Midas Rush at rank 2", () => {
    expect(goldRecoveryReductionWithSkills({ "Midas Rush": 2 })).toBeCloseTo(
      0.25,
    );
  });

  it("applies -30% recovery time with Midas Rush at rank 3", () => {
    expect(goldRecoveryReductionWithSkills({ "Midas Rush": 3 })).toBeCloseTo(
      0.3,
    );
  });

  it("stacks Midas Sprint and Midas Rush multiplicatively at rank 3", () => {
    // 0.85 (Sprint III) * 0.7 (Rush III) = 0.595 remaining => 40.5% reduction
    expect(
      goldRecoveryReductionWithSkills({ "Midas Sprint": 3, "Midas Rush": 3 }),
    ).toBeCloseTo(0.405);
  });

  it("applies a boost of -15% recovery time when Pickaxe Shark is equipped", () => {
    const now = Date.now();
    const { time, baseDurationMs } = getMinedAt({
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

    expect(time).toEqual(now);
    expect(baseDurationMs).toEqual(GOLD_RECOVERY_TIME * 1000 * 0.85);
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
    const { time, baseDurationMs } = getMinedAt({
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

    expect(time).toEqual(now);
    expect(baseDurationMs).toEqual(0);
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
      expect(result.gold[0].stone.minedAt).toEqual(now);
      expect(result.gold[0].stone.baseDurationMs).toEqual(0);

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

describe("mineGold — speed windows", () => {
  const ONE_HOUR = 60 * 60 * 1000;
  const BASE_MS = GOLD_RECOVERY_TIME * 1000;
  const mineFirstGold = (state: GameState) =>
    mineGold({
      state: {
        ...state,
        inventory: { ...state.inventory, "Iron Pickaxe": new Decimal(1) },
      },
      createdAt: now,
      action: { type: "goldRock.mined", index: "0" },
      farmId,
    });

  it("stores the real mine time + base recovery (no back-dating) with no boosts", () => {
    const game = mineFirstGold({ ...GAME_STATE, bumpkin: TEST_BUMPKIN });

    expect(game.gold[0].stone.minedAt).toEqual(now);
    expect(game.gold[0].stone.baseDurationMs).toEqual(BASE_MS);
    expect(game.gold[0].stone.boostedTime).toEqual(0);
  });

  it("folds a permanent Midas Rush boost into baseDurationMs, not back-dating", () => {
    const game = mineFirstGold({
      ...GAME_STATE,
      bumpkin: { ...TEST_BUMPKIN, skills: { "Midas Rush": 1 } },
    });

    expect(game.gold[0].stone.minedAt).toEqual(now);
    expect(game.gold[0].stone.baseDurationMs).toEqual(BASE_MS * 0.8);
    expect(game.gold[0].stone.boostedTime).toEqual(0);
  });

  it("excludes a temporary Ore Hourglass from baseDurationMs (applied as a window)", () => {
    const game = mineFirstGold({
      ...GAME_STATE,
      bumpkin: TEST_BUMPKIN,
      collectibles: {
        "Ore Hourglass": [
          {
            id: "1",
            createdAt: now - 100,
            coordinates: { x: 1, y: 1 },
            readyAt: now - 100,
          },
        ],
      },
    });

    // Not reduced — derived live over the recovery instead.
    expect(game.gold[0].stone.minedAt).toEqual(now);
    expect(game.gold[0].stone.baseDurationMs).toEqual(BASE_MS);
  });

  it("recovers 2× faster with an active Super Totem (window covers full recovery)", () => {
    const rock: Rock = {
      stone: { minedAt: now, baseDurationMs: BASE_MS },
      x: 1,
      y: 1,
    };
    const game: GameState = {
      ...INITIAL_FARM,
      collectibles: {
        "Super Totem": [
          {
            id: "1",
            createdAt: now,
            coordinates: { x: 1, y: 1 },
            readyAt: now,
          },
        ],
      },
    };

    expect(getMineReadyAt(rock, "Gold Rock", game)).toBeCloseTo(
      now + BASE_MS / 2,
      0,
    );
  });

  it("recovers 1.35× faster with an active Mole Shrine (getMineReadyAt)", () => {
    const rock: Rock = {
      stone: { minedAt: now, baseDurationMs: BASE_MS },
      x: 1,
      y: 1,
    };
    const game: GameState = {
      ...INITIAL_FARM,
      collectibles: {
        "Mole Shrine": [
          {
            id: "1",
            createdAt: now,
            coordinates: { x: 1, y: 1 },
            readyAt: now,
          },
        ],
      },
    };

    expect(getMineReadyAt(rock, "Gold Rock", game)).toBeCloseTo(
      now + BASE_MS / 1.35,
      0,
    );
  });

  it("does NOT speed up gold with a Badger Shrine (stone-only boost)", () => {
    const rock: Rock = {
      stone: { minedAt: now, baseDurationMs: BASE_MS },
      x: 1,
      y: 1,
    };
    const game: GameState = {
      ...INITIAL_FARM,
      collectibles: {
        "Badger Shrine": [
          {
            id: "1",
            createdAt: now,
            coordinates: { x: 1, y: 1 },
            readyAt: now,
          },
        ],
      },
    };

    expect(getMineReadyAt(rock, "Gold Rock", game)).toEqual(now + BASE_MS);
  });

  it("credits only the overlap for a Super Totem placed mid-recovery (retroactive)", () => {
    // Mined 1h ago with no boost: 1h of work already accrued at 1×.
    const rock: Rock = {
      stone: { minedAt: now - ONE_HOUR, baseDurationMs: BASE_MS },
      x: 1,
      y: 1,
    };
    const game: GameState = {
      ...INITIAL_FARM,
      collectibles: {
        "Super Totem": [
          {
            id: "1",
            createdAt: now,
            coordinates: { x: 1, y: 1 },
            readyAt: now,
          },
        ],
      },
    };

    // Remaining work (BASE_MS - 1h) now accrues at 2× (window covers it fully).
    expect(getMineReadyAt(rock, "Gold Rock", game)).toBeCloseTo(
      now + (BASE_MS - ONE_HOUR) / 2,
      0,
    );
  });

  it("merges Super Totem & Time Warp Totem so they don't stack (2×, not 4×)", () => {
    const rock: Rock = {
      stone: { minedAt: now, baseDurationMs: BASE_MS },
      x: 1,
      y: 1,
    };
    const game: GameState = {
      ...INITIAL_FARM,
      collectibles: {
        "Super Totem": [
          {
            id: "1",
            createdAt: now,
            coordinates: { x: 1, y: 1 },
            readyAt: now,
          },
        ],
        "Time Warp Totem": [
          {
            id: "2",
            createdAt: now,
            coordinates: { x: 2, y: 2 },
            readyAt: now,
          },
        ],
      },
    };

    expect(getMineReadyAt(rock, "Gold Rock", game)).toBeCloseTo(
      now + BASE_MS / 2,
      0,
    );
  });

  it("falls back to base recovery for a legacy rock (no baseDurationMs)", () => {
    const rock: Rock = { stone: { minedAt: now }, x: 1, y: 1 };
    expect(getMineReadyAt(rock, "Gold Rock", INITIAL_FARM)).toEqual(
      now + BASE_MS,
    );
  });

  describe("Emerald Turtle: once per rock cycle", () => {
    const base = GOLD_RECOVERY_TIME * 1000;
    const t0 = now - 20 * base;

    const turtleState = (aoeLastUsedAt: number) => ({
      ...GAME_STATE,
      bumpkin: TEST_BUMPKIN,
      inventory: {
        "Gold Rock": new Decimal(2),
        "Iron Pickaxe": new Decimal(1),
      },
      collectibles: {
        "Emerald Turtle": [
          {
            id: "123",
            createdAt: t0,
            coordinates: { x: 2, y: 1 },
            readyAt: t0,
          },
        ],
      },
      aoe: { "Emerald Turtle": { "-1": { "0": aoeLastUsedAt } } },
    });

    // Rock "0" sits at (1, 1), inside the Emerald Turtle's AOE at (2, 1).
    const mineRock = ({
      rock,
      aoeLastUsedAt,
      mineAt,
    }: {
      rock: Rock;
      aoeLastUsedAt: number;
      mineAt: number;
    }) =>
      mineGold({
        state: {
          ...turtleState(aoeLastUsedAt),
          gold: { ...GAME_STATE.gold, 0: { ...rock, x: 1, y: 1 } },
        },
        action: { type: "goldRock.mined", index: "0" },
        createdAt: mineAt,
        farmId,
      });

    const turtleCell = (game: GameState) =>
      game.aoe["Emerald Turtle"]?.["-1"]?.["0"];

    it("records when the rock's next cycle started", () => {
      const mineAt = t0 + base + 1;
      const game = mineRock({
        rock: { createdAt: t0, stone: { minedAt: t0, baseDurationMs: base } },
        aoeLastUsedAt: t0 - 1,
        mineAt,
      });

      expect(game.gold[0].stone.cycleStartedAt).toBe(mineAt);
    });

    it("applies when the rock's cycle started at the tile's last bonus", () => {
      const mineAt = t0 + base + 1;
      const game = mineRock({
        rock: {
          createdAt: t0,
          stone: { minedAt: t0, cycleStartedAt: t0, baseDurationMs: base },
        },
        aoeLastUsedAt: t0,
        mineAt,
      });

      expect(turtleCell(game)).toBe(mineAt);
    });

    it("does not apply when the tile's last bonus came after the rock's cycle started, however long ago", () => {
      const game = mineRock({
        rock: {
          createdAt: t0,
          stone: { minedAt: t0, cycleStartedAt: t0, baseDurationMs: base },
        },
        aoeLastUsedAt: t0 + 1,
        mineAt: t0 + 10 * base,
      });

      expect(turtleCell(game)).toBe(t0 + 1);
    });

    it("applies to a never-mined rock created after the tile's last bonus", () => {
      const mineAt = t0 + base;
      const game = mineRock({
        rock: { createdAt: t0 + 1, stone: { minedAt: 0 } },
        aoeLastUsedAt: t0,
        mineAt,
      });

      expect(turtleCell(game)).toBe(mineAt);
    });

    it("does not apply to a never-mined rock created before the tile's last bonus", () => {
      const game = mineRock({
        rock: { createdAt: t0, stone: { minedAt: 0 } },
        aoeLastUsedAt: t0 + 1,
        mineAt: t0 + 10 * base,
      });

      expect(turtleCell(game)).toBe(t0 + 1);
    });

    // Lift rock "0" at `removedAt`, re-place it at `placedAt`, then mine it at
    // `mineAt` with the Emerald Turtle cell last used at `aoeLastUsedAt`.
    const liftPlaceAndMine = ({
      removedAt,
      placedAt,
      mineAt,
      aoeLastUsedAt,
      withCycleStart = true,
    }: {
      removedAt: number;
      placedAt: number;
      mineAt: number;
      aoeLastUsedAt: number;
      // false: a rock mined before `cycleStartedAt` existed.
      withCycleStart?: boolean;
    }) => {
      const placed = placeGold({
        state: {
          ...turtleState(aoeLastUsedAt),
          buildings: {},
          gold: {
            0: {
              createdAt: t0,
              stone: {
                minedAt: t0,
                ...(withCycleStart ? { cycleStartedAt: t0 } : {}),
                baseDurationMs: base,
              },
              removedAt,
            },
            1: GAME_STATE.gold[1],
          },
        },
        action: {
          type: "gold.placed",
          name: "Gold Rock",
          id: "0",
          coordinates: { x: 1, y: 1 },
        },
        createdAt: placedAt,
      });

      return mineGold({
        state: placed,
        action: { type: "goldRock.mined", index: "0" },
        createdAt: mineAt,
        farmId,
      });
    };

    it("does not apply to a rock lifted mid-recovery onto a tile that paid out after it was mined", () => {
      const placedAt = t0 + 5 * base;
      const game = liftPlaceAndMine({
        removedAt: t0 + base / 2,
        placedAt,
        mineAt: placedAt + base / 2 + 1,
        aoeLastUsedAt: t0 + base,
      });

      expect(turtleCell(game)).toBe(t0 + base);
    });

    it("does not apply to a rock lifted after recovering onto a tile that paid out after it was mined", () => {
      const placedAt = t0 + 5 * base;
      const game = liftPlaceAndMine({
        removedAt: t0 + 2 * base,
        placedAt,
        mineAt: placedAt + 1,
        aoeLastUsedAt: t0 + 3 * base,
      });

      expect(turtleCell(game)).toBe(t0 + 3 * base);
    });

    it("does not apply to an older rock (no cycleStartedAt) lifted onto a tile that paid out after it was mined", () => {
      const placedAt = t0 + 5 * base;
      const game = liftPlaceAndMine({
        removedAt: t0 + base / 2,
        placedAt,
        mineAt: placedAt + base / 2 + 1,
        aoeLastUsedAt: t0 + base,
        withCycleStart: false,
      });

      expect(turtleCell(game)).toBe(t0 + base);
    });

    it("applies to a lifted rock that was mined after the tile's last bonus", () => {
      const placedAt = t0 + 5 * base;
      const mineAt = placedAt + base / 2 + 1;
      const game = liftPlaceAndMine({
        removedAt: t0 + base / 2,
        placedAt,
        mineAt,
        aoeLastUsedAt: t0 - 1,
      });

      expect(turtleCell(game)).toBe(mineAt);
    });
  });
});
