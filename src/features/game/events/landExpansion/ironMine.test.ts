import Decimal from "decimal.js-light";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { INITIAL_FARM } from "features/game/lib/constants";
import { KNOWN_IDS } from "features/game/types";
import { GameState } from "features/game/types/game";
import { prngChance } from "lib/prng";
import {
  getMinedAt,
  IRON_RECOVERY_TIME,
  LandExpansionIronMineAction,
  mineIron,
} from "./ironMine";

const now = Date.now();
const farmId = 1;

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  iron: {
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

describe("mineIron", () => {
  const itemId = KNOWN_IDS["Iron Rock"];

  // Helper to find a counter that doesn't trigger Native
  function findNonCriticalCounter() {
    for (let counter = 0; counter < 100; counter++) {
      const nativeTriggers = prngChance({
        farmId,
        itemId,
        counter,
        chance: 20,
        criticalHitName: "Native",
      });
      if (!nativeTriggers) {
        return counter;
      }
    }
    return 0;
  }

  it("throws an error if no pickaxes are left", () => {
    expect(() =>
      mineIron({
        state: { ...GAME_STATE, bumpkin: TEST_BUMPKIN },
        createdAt: now,
        action: {
          type: "ironRock.mined",
          index: "0",
        },
        farmId,
      }),
    ).toThrow("No pickaxes left");
  });

  it("throws an error if iron does not exist", () => {
    expect(() =>
      mineIron({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Stone Pickaxe": new Decimal(2),
          },
        },
        createdAt: now,
        action: {
          type: "ironRock.mined",
          index: "3",
        },
        farmId,
      }),
    ).toThrow("No iron");
  });

  it("throws an error if iron is not placed", () => {
    expect(() =>
      mineIron({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          iron: {
            0: {
              ...GAME_STATE.iron[0],
              createdAt: 0,
              x: undefined,
              y: undefined,
            },
          },
        },
        createdAt: now,
        action: {
          type: "ironRock.mined",
          index: "0",
        },
        farmId,
      }),
    ).toThrow("Iron rock is not placed");
  });

  it("throws an error if iron is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };
    const game = mineIron(payload);

    // Try same payload
    expect(() =>
      mineIron({
        state: game,
        action: payload.action,
        createdAt: now,
        farmId,
      }),
    ).toThrow("Iron is still recovering");
  });

  it("mines iron", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(1),
        },
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory["Stone Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Iron).toEqual(new Decimal(1));
  });

  it("mines multiple iron", () => {
    // Find two consecutive counters that don't trigger critical hits
    function findTwoNonCriticalCounters() {
      for (let counter = 0; counter < 100; counter++) {
        const first = !prngChance({
          farmId,
          itemId,
          counter,
          chance: 20,
          criticalHitName: "Native",
        });
        const second = !prngChance({
          farmId,
          itemId,
          counter: counter + 1,
          chance: 20,
          criticalHitName: "Native",
        });
        if (first && second) {
          return counter;
        }
      }
      return 0;
    }

    const startCounter = findTwoNonCriticalCounters();

    let game = mineIron({
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(3),
        },
        farmActivity: { "Iron Rock Mined": startCounter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    });

    game = mineIron({
      state: game,
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "1",
      } as LandExpansionIronMineAction,
      farmId,
    });

    expect(game.inventory["Stone Pickaxe"]).toEqual(new Decimal(1));
    expect(game.inventory.Iron).toEqual(new Decimal(2));
  });

  it("mines iron after waiting", () => {
    jest.useFakeTimers();

    // Find two consecutive counters that don't trigger critical hits
    function findTwoNonCriticalCounters() {
      for (let counter = 0; counter < 100; counter++) {
        const first = !prngChance({
          farmId,
          itemId,
          counter,
          chance: 20,
          criticalHitName: "Native",
        });
        const second = !prngChance({
          farmId,
          itemId,
          counter: counter + 1,
          chance: 20,
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
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
        farmActivity: { "Iron Rock Mined": startCounter },
      },
      createdAt: Date.now(),
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
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
    expect(game.inventory.Iron?.toNumber()).toBe(2);

    jest.useRealTimers();
  });

  it("adds 25% iron when Rocky the Mole (T2) is placed and ready", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
        collectibles: {
          "Rocky the Mole": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory.Iron).toEqual(new Decimal(1.25));
  });

  it("does not apply boost when Rocky the Mole (T2) is placed but not ready", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
        collectibles: {
          "Rocky the Mole": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now + 10 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory.Iron).toEqual(new Decimal(1));
  });

  it("does not stack and only adds 25% iron when T2 and T3 are placed and ready", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
        collectibles: {
          "Rocky the Mole": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
          Nugget: [
            {
              id: "456",
              createdAt: now,
              coordinates: { x: 2, y: 2 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory.Iron).toEqual(new Decimal(1.25));
  });

  it("does not apply boost when Iron Idol is placed but not ready", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
        collectibles: {
          "Iron Idol": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now + 10 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory.Iron).toEqual(new Decimal(1));
  });

  it("adds +1 iron when Iron Idol is placed and ready", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      state: {
        ...GAME_STATE,
        iron: {
          0: {
            createdAt: now,
            stone: {
              minedAt: 0,
            },
            x: 1,
            y: 1,
          },
        },
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
        collectibles: {
          "Iron Idol": [
            {
              id: "123",
              createdAt: 0,
              coordinates: { x: 1, y: 1 },
              readyAt: 0,
            },
          ],
        },
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory.Iron).toEqual(new Decimal(2));
  });

  it("adds +0.1 iron when Iron Beetle is placed and ready", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      state: {
        ...GAME_STATE,
        iron: {
          0: {
            createdAt: now,
            stone: {
              minedAt: 0,
            },
            x: 1,
            y: 1,
          },
        },
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
        collectibles: {
          "Iron Beetle": [
            {
              id: "123",
              createdAt: 0,
              coordinates: { x: 1, y: 1 },
              readyAt: 0,
            },
          ],
        },
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory.Iron).toEqual(new Decimal(1.1));
  });

  it("adds +0.1 iron with Iron Bumpkin Skill", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      state: {
        ...GAME_STATE,
        iron: {
          0: {
            createdAt: now,
            stone: {
              minedAt: 0,
            },
            x: 1,
            y: 1,
          },
        },
        bumpkin: {
          ...TEST_BUMPKIN,
          skills: {
            "Iron Bumpkin": 1,
          },
        },
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory.Iron).toEqual(new Decimal(1.1));
  });

  it("adds +1 iron with Ferrous Favor Skill", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      state: {
        ...GAME_STATE,
        iron: {
          0: {
            createdAt: now,
            stone: {
              minedAt: 0,
            },
            x: 1,
            y: 1,
          },
        },
        bumpkin: {
          ...TEST_BUMPKIN,
          skills: {
            "Ferrous Favor": 1,
          },
        },
        inventory: {
          "Stone Pickaxe": new Decimal(2),
        },
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory.Iron).toEqual(new Decimal(2));
  });

  it("adds +0.5 iron when gold is within Emerald Turtle AoE", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(1),
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
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory["Stone Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Iron).toEqual(new Decimal(1.5));
  });

  it("sets the AOE last used time to now", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(1),
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
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

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
          "Stone Pickaxe": new Decimal(1),
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
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory.Iron).toEqual(new Decimal(1));
  });

  it("does apply the AOE if the AOE is ready", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(1),
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
              "0": now - IRON_RECOVERY_TIME * 1000,
            },
          },
        },
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory.Iron).toEqual(new Decimal(1.5));
  });

  it("applies the AOE on a iron with boosted time", () => {
    const boostedTime = IRON_RECOVERY_TIME * 1000 * 0.5;
    const counter = findNonCriticalCounter();

    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(1),
        },
        iron: {
          0: {
            createdAt: now,
            stone: {
              minedAt: now - IRON_RECOVERY_TIME * 1000,
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
              "0": now - (IRON_RECOVERY_TIME * 1000 - boostedTime),
            },
          },
        },
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory.Iron).toEqual(new Decimal(1.5));
  });

  it("adds +0.1 iron when Radiant Ray is placed", () => {
    const counter = findNonCriticalCounter();
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          "Stone Pickaxe": new Decimal(1),
        },
        collectibles: {
          "Radiant Ray": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 2, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
        farmActivity: { "Iron Rock Mined": counter },
      },
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory["Stone Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Iron).toEqual(new Decimal(1.1));
  });

  it("adds +0.25 iron when a Faction Shield is equipped(Right Faction)", () => {
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
        "Stone Pickaxe": new Decimal(1),
      },
      farmActivity: { "Iron Rock Mined": counter },
    };
    const payload = {
      state,
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory["Stone Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Iron).toEqual(new Decimal(1.25));
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
        "Stone Pickaxe": new Decimal(1),
      },
      farmActivity: { "Iron Rock Mined": counter },
    };
    const payload = {
      state,
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory["Stone Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Iron).toEqual(new Decimal(1));
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
        "Stone Pickaxe": new Decimal(1),
      },
      farmActivity: { "Iron Rock Mined": counter },
    };
    const payload = {
      state,
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory["Stone Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Iron).toEqual(new Decimal(1));
  });

  it("applies a bud boost", () => {
    const counter = findNonCriticalCounter();
    const state: GameState = {
      ...GAME_STATE,
      bumpkin: TEST_BUMPKIN,
      inventory: {
        "Stone Pickaxe": new Decimal(1),
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
      farmActivity: { "Iron Rock Mined": counter },
    };

    const payload = {
      state,
      createdAt: now,
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      farmId,
    };

    const game = mineIron(payload);

    expect(game.inventory.Iron).toEqual(new Decimal(1.2));
  });

  describe("BumpkinActivity", () => {
    it("increments Iron mined activity by 1", () => {
      const counter = findNonCriticalCounter();
      const bumpkin = {
        ...TEST_BUMPKIN,
      };
      const game = mineIron({
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            "Stone Pickaxe": new Decimal(3),
          },
          farmActivity: { "Iron Rock Mined": counter },
        },
        createdAt: now,
        action: {
          type: "ironRock.mined",
          index: "0",
        } as LandExpansionIronMineAction,
        farmId,
      });

      expect(game.farmActivity["Iron Mined"]).toBe(1);
    });

    it("increments Iron Mined activity by 2", () => {
      // Find two consecutive counters that don't trigger critical hits
      function findTwoNonCriticalCounters() {
        for (let counter = 0; counter < 100; counter++) {
          const first = !prngChance({
            farmId,
            itemId,
            counter,
            chance: 20,
            criticalHitName: "Native",
          });
          const second = !prngChance({
            farmId,
            itemId,
            counter: counter + 1,
            chance: 20,
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
      const state1 = mineIron({
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            "Stone Pickaxe": new Decimal(3),
          },
          farmActivity: { "Iron Rock Mined": startCounter },
        },
        createdAt: now,
        action: {
          type: "ironRock.mined",
          index: "0",
        } as LandExpansionIronMineAction,
        farmId,
      });

      const game = mineIron({
        state: state1,
        createdAt: now,
        action: {
          type: "ironRock.mined",
          index: "1",
        } as LandExpansionIronMineAction,
        farmId,
      });

      expect(game.farmActivity["Iron Mined"]).toBe(2);
    });

    it("adds bonus drop via PRNG", () => {
      // Find a counter that triggers Native
      function findNativeCounter() {
        for (let counter = 0; counter < 200; counter++) {
          const nativeTriggers = prngChance({
            farmId,
            itemId,
            counter,
            chance: 20,
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
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Stone Pickaxe": new Decimal(2),
          },
          collectibles: {},
          iron: {
            0: {
              createdAt: now,
              stone: {
                minedAt: 0,
              },
              x: 1,
              y: 1,
            },
          },
          farmActivity: { "Iron Rock Mined": nativeCounter },
        },
        createdAt: now,
        action: {
          type: "ironRock.mined",
          index: "0",
        } as LandExpansionIronMineAction,
        farmId,
      };

      const game = mineIron(payload);

      expect(game.inventory.Iron).toEqual(new Decimal(2));
    });
  });

  it("iron replenishes faster with time warp", () => {
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
      createdAt: now,
    });

    expect(time).toEqual(now - (IRON_RECOVERY_TIME * 1000) / 2);
  });

  it("iron replenishes faster with Super Totem", () => {
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
      createdAt: now,
    });

    expect(time).toEqual(now - (IRON_RECOVERY_TIME * 1000) / 2);
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
      createdAt: now,
    });

    expect(time).toEqual(now - (IRON_RECOVERY_TIME * 1000) / 2);
  });

  it("applies a Ore Hourglass boost of -50% recovery time for 3 hours", () => {
    const now = Date.now();
    const { time } = getMinedAt({
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

    expect(time).toEqual(now - (IRON_RECOVERY_TIME * 1000) / 2);
  });

  it("does not apply an Ore Hourglass boost if expired", () => {
    const now = Date.now();
    const fourHoursAgo = now - 4 * 60 * 60 * 1000;

    const { time } = getMinedAt({
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

  it("applies a +0.1 boost if the player is on volcano island", () => {
    const counter = findNonCriticalCounter();
    const state = mineIron({
      state: {
        ...GAME_STATE,
        island: {
          type: "volcano",
        },
        inventory: {
          "Stone Pickaxe": new Decimal(1),
        },
        farmActivity: { "Iron Rock Mined": counter },
      },
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      createdAt: now,
      farmId,
    });

    expect(state.inventory.Iron).toEqual(new Decimal(1.1));
  });

  it("stores the boostedTime on the iron", () => {
    const counter = findNonCriticalCounter();
    const state = mineIron({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          skills: {
            "Iron Hustle": 1,
          },
        },
        inventory: {
          "Stone Pickaxe": new Decimal(1),
        },
        farmActivity: { "Iron Rock Mined": counter },
      },
      action: {
        type: "ironRock.mined",
        index: "0",
      } as LandExpansionIronMineAction,
      createdAt: now,
      farmId,
    });

    expect(state.iron[0].stone.boostedTime).toEqual(
      IRON_RECOVERY_TIME * 0.3 * 1000,
    );
  });
});

describe("getMinedAt", () => {
  it("reduces the cooldown time with Iron Hustle Skill", () => {
    const now = Date.now();

    const { time } = getMinedAt({
      createdAt: now,
      game: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          skills: {
            "Iron Hustle": 1,
          },
        },
      },
    });
    expect(time).toEqual(now - IRON_RECOVERY_TIME * 0.3 * 1000);
  });
});
