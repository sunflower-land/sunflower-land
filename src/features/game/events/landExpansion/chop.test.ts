import Decimal from "decimal.js-light";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import { INITIAL_FARM, TREE_RECOVERY_TIME } from "features/game/lib/constants";
import { KNOWN_IDS } from "features/game/types";
import { GameState, Tree } from "features/game/types/game";
import { prngChance } from "lib/prng";
import {
  chop,
  LandExpansionChopAction,
  getWoodDropAmount,
  getChoppedAt,
} from "./chop";

const now = Date.now();

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  inventory: {},
  trees: {
    0: {
      createdAt: now,
      wood: {
        choppedAt: 0,
      },
      x: 1,
      y: 1,
    },
    1: {
      createdAt: now,
      wood: {
        choppedAt: 0,
      },
      x: 4,
      y: 1,
    },
  },
};

describe("chop", () => {
  const dateNow = now;
  const farmId = 1;

  it("throws an error if no axes are left", () => {
    expect(() =>
      chop({
        farmId,
        state: { ...GAME_STATE, bumpkin: TEST_BUMPKIN },
        createdAt: now,
        action: {
          type: "timber.chopped",
          item: "Axe",

          index: "0",
        },
      }),
    ).toThrow("No axes left");
  });

  it("throws an error if tree is not placed", () => {
    expect(() =>
      chop({
        farmId,
        state: {
          ...GAME_STATE,
          inventory: {
            Axe: new Decimal(1),
          },
          trees: {
            0: {
              createdAt: now,
              x: undefined,
              y: undefined,
              wood: { choppedAt: 0 },
            },
          },
        },
        action: {
          type: "timber.chopped",
          item: "Axe",
          index: "0",
        },
        createdAt: now,
      }),
    ).toThrow("Tree is not placed");
  });

  it("throws an error if tree is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Axe: new Decimal(2),
        },
      },
      createdAt: now,
      action: {
        type: "timber.chopped",
        item: "Axe",

        index: "0",
      } as LandExpansionChopAction,
    };

    const game = chop({ ...payload, farmId });

    // Try same payload
    expect(() =>
      chop({
        farmId,
        state: game,
        action: payload.action,
        createdAt: now,
      }),
    ).toThrow("Tree is still growing");
  });

  it("chops a tree", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Axe: new Decimal(1),
        },
      },
      createdAt: now,
      action: {
        type: "timber.chopped",
        item: "Axe",

        index: "0",
      } as LandExpansionChopAction,
    };

    const game = chop({ ...payload, farmId });

    expect(game.inventory.Axe).toEqual(new Decimal(0));
    expect(game.inventory.Wood).toEqual(new Decimal(1));
  });

  it("chops a tree with a multiplier", () => {
    const game = chop({
      farmId,
      state: {
        ...GAME_STATE,
        trees: {
          "123": {
            multiplier: 4,
            tier: 2,
            wood: { choppedAt: 0 },
            createdAt: now,
            x: 1,
            y: 1,
          },
        },
        inventory: {
          Axe: new Decimal(5),
        },
      },
      createdAt: now,
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "123",
      } as LandExpansionChopAction,
    });

    expect(game.inventory.Axe).toEqual(new Decimal(1));
    expect(game.inventory.Wood).toEqual(new Decimal(4.5));
  });

  it("chops multiple tree", () => {
    const itemId = KNOWN_IDS["Tree"];

    // Find a starting counter where neither tree triggers Native
    function findNonNativeStartCounter() {
      for (let counter = 0; counter < 100; counter++) {
        const firstNative = prngChance({
          farmId,
          itemId,
          counter,
          chance: 20,
          criticalHitName: "Native",
        });
        const secondNative = prngChance({
          farmId,
          itemId,
          counter: counter + 1,
          chance: 20,
          criticalHitName: "Native",
        });
        if (!firstNative && !secondNative) {
          return counter;
        }
      }
      return 0; // fallback
    }

    const startCounter = findNonNativeStartCounter();

    let game = chop({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Axe: new Decimal(3),
        },
        farmActivity: { "Basic Tree Chopped": startCounter },
      },
      createdAt: now,
      action: {
        type: "timber.chopped",
        item: "Axe",

        index: "0",
      } as LandExpansionChopAction,
    });

    game = chop({
      farmId,
      state: game,
      createdAt: now,
      action: {
        type: "timber.chopped",
        item: "Axe",

        index: "1",
      } as LandExpansionChopAction,
    });

    expect(game.inventory.Axe).toEqual(new Decimal(1));
    expect(game.inventory.Wood).toEqual(new Decimal(2));
  });

  it("tree replenishes normally", () => {
    const dateNow = now;
    const game = chop({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Axe: new Decimal(3),
        },
      },
      createdAt: dateNow,
      action: {
        type: "timber.chopped",
        item: "Axe",

        index: "0",
      } as LandExpansionChopAction,
    });

    const { trees } = game;
    const tree = (trees as Record<number, Tree>)[0];

    // Should be set to now - add 5 ms to account for any CPU clock speed
    expect(tree.wood.choppedAt).toBeGreaterThan(dateNow - 5);
  });

  it("applies Native bonus drop via PRNG", () => {
    const itemId = KNOWN_IDS["Tree"];

    // Find a counter that triggers Native (20% chance)
    function findNativeCounter() {
      for (let counter = 0; counter < 100; counter++) {
        if (
          prngChance({
            farmId,
            itemId,
            counter,
            chance: 20,
            criticalHitName: "Native",
          })
        ) {
          return counter;
        }
      }
      throw new Error("Could not find Native trigger counter");
    }

    const nativeCounter = findNativeCounter();

    const game = chop({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Axe: new Decimal(3),
        },
        farmActivity: { "Basic Tree Chopped": nativeCounter },
      },
      createdAt: dateNow,
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "0",
      } as LandExpansionChopAction,
    });

    // Native adds +1 wood, so should be 2 total
    expect(game.inventory.Wood).toEqual(new Decimal(2));
  });

  it("applies Tough Tree bonus via PRNG when skill is active", () => {
    const itemId = KNOWN_IDS["Tree"];

    // Find a counter that triggers Tough Tree (10% chance) but not Native
    function findToughTreeOnlyCounter() {
      for (let counter = 0; counter < 200; counter++) {
        const toughTreeTriggers = prngChance({
          farmId,
          itemId,
          counter,
          chance: 10,
          criticalHitName: "Tough Tree",
        });
        const nativeTriggers = prngChance({
          farmId,
          itemId,
          counter,
          chance: 20,
          criticalHitName: "Native",
        });
        if (toughTreeTriggers && !nativeTriggers) {
          return counter;
        }
      }
      throw new Error("Could not find Tough Tree only counter");
    }

    const toughTreeCounter = findToughTreeOnlyCounter();

    const game = chop({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: { ...TEST_BUMPKIN, skills: { "Tough Tree": 1 } },
        inventory: {
          Axe: new Decimal(3),
        },
        farmActivity: { "Basic Tree Chopped": toughTreeCounter },
      },
      createdAt: dateNow,
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "0",
      } as LandExpansionChopAction,
    });

    // Tough Tree multiplies by 3, so should be 3 total
    expect(game.inventory.Wood).toEqual(new Decimal(3));
  });

  it("applies both Tough Tree and Native bonus via PRNG", () => {
    const itemId = KNOWN_IDS["Tree"];

    // Find a counter that triggers both Tough Tree and Native
    function findBothTriggersCounter() {
      for (let counter = 0; counter < 500; counter++) {
        const toughTreeTriggers = prngChance({
          farmId,
          itemId,
          counter,
          chance: 10,
          criticalHitName: "Tough Tree",
        });
        const nativeTriggers = prngChance({
          farmId,
          itemId,
          counter,
          chance: 20,
          criticalHitName: "Native",
        });
        if (toughTreeTriggers && nativeTriggers) {
          return counter;
        }
      }
      throw new Error("Could not find both triggers counter");
    }

    const bothCounter = findBothTriggersCounter();

    const game = chop({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: { ...TEST_BUMPKIN, skills: { "Tough Tree": 1 } },
        inventory: {
          Axe: new Decimal(3),
        },
        farmActivity: { "Basic Tree Chopped": bothCounter },
      },
      createdAt: dateNow,
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "0",
      } as LandExpansionChopAction,
    });

    // Tough Tree = 3x (so 3), then Native adds +1 = 4 total
    expect(game.inventory.Wood).toEqual(new Decimal(4));
  });

  it("tree replenishes on normal rate when Apprentice Beaver is placed but not ready", () => {
    const game = chop({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Axe: new Decimal(3),
        },
        collectibles: {
          "Apprentice Beaver": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 1, y: 1 },
              readyAt: dateNow + 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: dateNow,
      action: {
        type: "timber.chopped",
        item: "Axe",

        index: "0",
      } as LandExpansionChopAction,
    });

    const { trees } = game;
    const tree = (trees as Record<number, Tree>)[0];

    expect(tree.wood.choppedAt).toBe(dateNow);
  });

  it("tree replenishes faster when Apprentice Beaver is placed", () => {
    const game = chop({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        inventory: {
          Axe: new Decimal(3),
        },
        collectibles: {
          "Apprentice Beaver": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 1, y: 1 },
              // ready at < now
              readyAt: dateNow - 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: now,
      action: {
        type: "timber.chopped",
        item: "Axe",

        index: "0",
      } as LandExpansionChopAction,
    });

    const { trees } = game;
    const tree = (trees as Record<number, Tree>)[0];

    // Should be set to now - add 5 ms to account for any CPU clock speed
    const ONE_HOUR = 60 * 60 * 1000;
    expect(tree.wood.choppedAt).toBeLessThan(now - ONE_HOUR + 5);
  });

  it("chops trees without axes when Foreman Beaver is placed and ready", () => {
    const game = chop({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: TEST_BUMPKIN,
        collectibles: {
          "Foreman Beaver": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 1, y: 1 },
              // Ready at < now
              readyAt: dateNow - 5 * 60 * 1000,
            },
          ],
        },
      },
      createdAt: now,
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "0",
      } as LandExpansionChopAction,
    });

    expect(game.inventory.Wood).toEqual(new Decimal(1.2));
  });

  it("applies a bud boost", () => {
    const state: GameState = {
      ...GAME_STATE,
      bumpkin: TEST_BUMPKIN,
      inventory: {
        Axe: new Decimal(1),
      },
      buds: {
        1: {
          aura: "No Aura",
          colour: "Green",
          type: "Woodlands",
          ears: "Ears",
          stem: "Egg Head",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      },
    };
    const payload = {
      state,
      createdAt: now,
      action: {
        type: "timber.chopped",
        item: "Axe",

        index: "0",
      } as LandExpansionChopAction,
      bonusDropGenerator: () => 0,
    };

    const game = chop({ ...payload, farmId });

    expect(game.inventory.Wood).toEqual(new Decimal(1.2));
  });

  describe("getWoodDropAmount", () => {
    const itemId = KNOWN_IDS["Tree"];

    // Helper to find a counter that doesn't trigger Native
    function findNonNativeCounter() {
      for (let counter = 0; counter < 100; counter++) {
        if (
          !prngChance({
            farmId,
            itemId,
            counter,
            chance: 20,
            criticalHitName: "Native",
          })
        ) {
          return counter;
        }
      }
      return 0;
    }

    it("adds the discord bonus", () => {
      const counter = findNonNativeCounter();
      const { amount } = getWoodDropAmount({
        game: {
          ...INITIAL_FARM,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Discord Mod": new Decimal(1) },
        },
        farmId,
        itemId,
        counter,
        tree: undefined,
      });

      expect(amount.toNumber()).toStrictEqual(1.35);
    });

    it("adds the wood nymph wendy bonus", () => {
      const counter = findNonNativeCounter();
      const { amount } = getWoodDropAmount({
        game: {
          ...INITIAL_FARM,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Wood Nymph Wendy": new Decimal(1) },
          collectibles: {
            "Wood Nymph Wendy": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "12",
                readyAt: 0,
              },
            ],
          },
        },
        farmId,
        itemId,
        counter,
        tree: undefined,
      });

      expect(amount.toNumber()).toStrictEqual(1.2);
    });

    it("adds the Tiki Totem bonus", () => {
      const counter = findNonNativeCounter();
      const { amount } = getWoodDropAmount({
        game: {
          ...INITIAL_FARM,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Tiki Totem": new Decimal(1) },
          collectibles: {
            "Tiki Totem": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "12",
                readyAt: 0,
              },
            ],
          },
        },
        farmId,
        itemId,
        counter,
        tree: undefined,
      });

      expect(amount.toNumber()).toStrictEqual(1.1);
    });

    it("adds the Faction Shield bonus +0.25 Wood", () => {
      const counter = findNonNativeCounter();
      const { amount } = getWoodDropAmount({
        game: {
          ...INITIAL_FARM,
          inventory: {},
          collectibles: {},
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
        },
        farmId,
        itemId,
        counter,
        tree: undefined,
      });

      expect(amount.toNumber()).toStrictEqual(1.25);
    });

    it("gives +0.1 wood when you have Squirrel in your inventory", () => {
      const counter = findNonNativeCounter();
      const { amount } = getWoodDropAmount({
        game: {
          ...INITIAL_FARM,
          inventory: { Squirrel: new Decimal(1) },
          bumpkin: TEST_BUMPKIN,
          collectibles: {
            Squirrel: [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "12",
                readyAt: 0,
              },
            ],
          },
        },
        farmId,
        itemId,
        counter,
        tree: undefined,
      });

      expect(amount.toNumber()).toStrictEqual(1.1);
    });

    it("Faction Shield bonus does not apply when not in the pledged faction", () => {
      const counter = findNonNativeCounter();
      const { amount } = getWoodDropAmount({
        game: {
          ...INITIAL_FARM,
          collectibles: {},
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
        },
        farmId,
        itemId,
        counter,
        tree: undefined,
      });

      expect(amount.toNumber()).toStrictEqual(1);
    });

    it("Faction Shield bonus does not apply when no pledged faction", () => {
      const counter = findNonNativeCounter();
      const { amount } = getWoodDropAmount({
        game: {
          ...INITIAL_FARM,
          collectibles: {},
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: {
              ...TEST_BUMPKIN.equipped,
              secondaryTool: "Goblin Shield",
            },
          },
        },
        farmId,
        itemId,
        counter,
        tree: undefined,
      });

      expect(amount.toNumber()).toStrictEqual(1);
    });

    it("adds Native bonus drop via PRNG", () => {
      // Find a counter that triggers Native
      function findNativeCounter() {
        for (let counter = 0; counter < 100; counter++) {
          if (
            prngChance({
              farmId,
              itemId,
              counter,
              chance: 20,
              criticalHitName: "Native",
            })
          ) {
            return counter;
          }
        }
        throw new Error("Could not find Native counter");
      }

      const nativeCounter = findNativeCounter();
      const { amount } = getWoodDropAmount({
        game: INITIAL_FARM,
        farmId,
        itemId,
        counter: nativeCounter,
        tree: undefined,
      });

      expect(amount.toNumber()).toStrictEqual(2);
    });

    it("drops 10% more with Lumberjack badge (LEGACY)", () => {
      const counter = findNonNativeCounter();
      const { amount } = getWoodDropAmount({
        game: {
          ...INITIAL_FARM,
          inventory: { Lumberjack: new Decimal(1) },
          bumpkin: TEST_BUMPKIN,
        },
        farmId,
        itemId,
        counter,
        tree: undefined,
      });

      expect(amount.toNumber()).toStrictEqual(1.1);
    });

    it("applies Tough Tree critical drop via PRNG", () => {
      // Find a counter that triggers Tough Tree but not Native
      function findToughTreeOnlyCounter() {
        for (let counter = 0; counter < 200; counter++) {
          const toughTreeTriggers = prngChance({
            farmId,
            itemId,
            counter,
            chance: 10,
            criticalHitName: "Tough Tree",
          });
          const nativeTriggers = prngChance({
            farmId,
            itemId,
            counter,
            chance: 20,
            criticalHitName: "Native",
          });
          if (toughTreeTriggers && !nativeTriggers) {
            return counter;
          }
        }
        throw new Error("Could not find Tough Tree only counter");
      }

      const toughTreeCounter = findToughTreeOnlyCounter();
      const { amount } = getWoodDropAmount({
        game: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Tough Tree": 1 },
          },
        },
        farmId,
        itemId,
        counter: toughTreeCounter,
        tree: undefined,
      });

      expect(amount.toNumber()).toStrictEqual(3);
    });

    it("applies a +.1 wood drop with Lumberjack's Extra skill", () => {
      const counter = findNonNativeCounter();
      const { amount } = getWoodDropAmount({
        game: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Lumberjack's Extra": 1 },
          },
        },
        farmId,
        itemId,
        counter,
        tree: undefined,
      });

      expect(amount.toNumber()).toEqual(1.1);
    });
  });

  it("ensures that outcome of tree turnaround is the same regardless of order of chop", () => {
    const itemId = KNOWN_IDS["Tree"];

    function getCounter() {
      let counter = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (
          prngChance({
            farmId,
            itemId,
            counter,
            chance: 15,
            criticalHitName: "Tree Turnaround",
          })
        ) {
          return counter;
        }
        counter++;
      }
    }

    const counter = getCounter();

    const state: GameState = {
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_FARM.bumpkin,
        skills: { "Tree Turnaround": 1 },
      },
      trees: {
        0: {
          createdAt: now,
          wood: { choppedAt: 0 },
          x: 1,
          y: 1,
        },
        1: {
          createdAt: now,
          wood: { choppedAt: 0 },
          x: 1,
          y: 2,
        },
      },
      farmActivity: {
        "Basic Tree Chopped": counter - 1,
      },
    };

    let state1 = chop({
      farmId,
      state,
      createdAt: now,
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "0",
      },
    });
    expect(state1.trees[0].wood.choppedAt).toEqual(now);
    expect(state1.farmActivity["Basic Tree Chopped"]).toEqual(counter);

    state1 = chop({
      farmId,
      state: state1,
      createdAt: now,
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "1",
      },
    });
    expect(state1.trees[1].wood.choppedAt).toEqual(
      now - TREE_RECOVERY_TIME * 1000,
    );
    expect(state1.farmActivity["Basic Tree Chopped"]).toEqual(counter + 1);

    let state2 = chop({
      farmId,
      state,
      createdAt: now,
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "1",
      },
    });
    expect(state2.trees[1].wood.choppedAt).toEqual(now);
    expect(state2.farmActivity["Basic Tree Chopped"]).toEqual(counter);

    state2 = chop({
      farmId,
      state: state2,
      createdAt: now,
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "0",
      },
    });
    expect(state2.trees[0].wood.choppedAt).toEqual(
      now - TREE_RECOVERY_TIME * 1000,
    );
    expect(state2.farmActivity["Basic Tree Chopped"]).toEqual(counter + 1);
  });

  describe("getChoppedAt", () => {
    it("applies a Timber Hourglass boost of -25% recovery time for 4 hours", () => {
      const { time: createdAt } = getChoppedAt({
        game: {
          ...INITIAL_FARM,
          collectibles: {
            "Timber Hourglass": [
              {
                id: "123",
                createdAt: now - 100,
                coordinates: { x: 1, y: 1 },
                readyAt: now - 100,
              },
            ],
          },
        },
        createdAt: now,
        prngArgs: { farmId, itemId: 0, counter: 0 },
      });

      const boostedRecoveryTime =
        (TREE_RECOVERY_TIME - TREE_RECOVERY_TIME * 0.75) * 1000;

      expect(createdAt).toEqual(now - boostedRecoveryTime);
    });

    it("does not apply a Timber Hourglass boost if it has expired", () => {
      const fiveHoursAgo = now - 5 * 60 * 60 * 1000;

      const { time: createdAt } = getChoppedAt({
        game: {
          ...INITIAL_FARM,
          collectibles: {
            "Timber Hourglass": [
              {
                id: "123",
                createdAt: fiveHoursAgo,
                coordinates: { x: 1, y: 1 },
                readyAt: fiveHoursAgo,
              },
            ],
          },
        },
        createdAt: now,
        prngArgs: { farmId, itemId: 0, counter: 0 },
      });

      expect(createdAt).toEqual(now);
    });

    it("applies a 10% speed boost with Tree Charge skill", () => {
      const { time } = getChoppedAt({
        game: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Tree Charge": 1 },
          },
        },
        createdAt: now,
        prngArgs: { farmId, itemId: 0, counter: 0 },
      });

      const treeTimeWithBoost = TREE_RECOVERY_TIME * 1000 * 0.1;
      expect(time).toEqual(now - treeTimeWithBoost);
    });

    it("applies an instant growth with Tree Turnaround skill", () => {
      const itemId = KNOWN_IDS["Tree"];

      function getCounter() {
        let counter = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          if (
            prngChance({
              farmId,
              itemId,
              counter,
              chance: 15,
              criticalHitName: "Tree Turnaround",
            })
          ) {
            return counter;
          }
          counter++;
        }
      }

      const counter = getCounter();

      const { time } = getChoppedAt({
        game: {
          ...INITIAL_FARM,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { "Tree Turnaround": 1 },
          },
        },
        createdAt: now,
        prngArgs: { farmId, itemId, counter },
      });

      expect(time).toEqual(now - TREE_RECOVERY_TIME * 1000);
    });

    it("applies the Badger Shrine boost", () => {
      const { time } = getChoppedAt({
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
        prngArgs: { farmId, itemId: 0, counter: 0 },
      });

      expect(time).toEqual(now - TREE_RECOVERY_TIME * 0.25 * 1000);
    });

    it("does not apply the Badger Shrine boost if expired", () => {
      const { time } = getChoppedAt({
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
        prngArgs: { farmId, itemId: 0, counter: 0 },
      });

      expect(time).toEqual(now);
    });
  });

  describe("BumpkinActivity", () => {
    it("increments Trees Chopped activity by 1 when 1 tree is chopped", () => {
      const createdAt = now;
      const bumpkin = {
        ...TEST_BUMPKIN,
      };
      const game = chop({
        farmId,
        state: {
          ...GAME_STATE,
          bumpkin,
          inventory: {
            Axe: new Decimal(1),
          },
        },
        createdAt,
        action: {
          type: "timber.chopped",
          item: "Axe",

          index: "0",
        } as LandExpansionChopAction,
      });

      expect(game.farmActivity["Tree Chopped"]).toBe(1);
    });
    it("increments Trees Chopped activity by 2 when 2 trees are chopped", () => {
      const createdAt = now;
      const bumpkin = {
        ...TEST_BUMPKIN,
      };
      const state1 = chop({
        farmId,
        state: {
          ...GAME_STATE,
          bumpkin,
          inventory: {
            Axe: new Decimal(2),
          },
        },
        createdAt,
        action: {
          type: "timber.chopped",
          item: "Axe",

          index: "0",
        } as LandExpansionChopAction,
      });
      const game = chop({
        farmId,
        state: {
          ...state1,
        },
        createdAt,
        action: {
          type: "timber.chopped",
          item: "Axe",

          index: "1",
        } as LandExpansionChopAction,
      });

      expect(game.farmActivity["Tree Chopped"]).toBe(2);
    });
  });

  it("tree replenishes faster with time warp", () => {
    const { time } = getChoppedAt({
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
      prngArgs: { farmId, itemId: 0, counter: 0 },
    });

    expect(time).toEqual(now - (TREE_RECOVERY_TIME * 1000) / 2);
  });

  it("tree replenishes faster with Super Totem", () => {
    const { time } = getChoppedAt({
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
      prngArgs: { farmId, itemId: 0, counter: 0 },
    });

    expect(time).toEqual(now - (TREE_RECOVERY_TIME * 1000) / 2);
  });

  it("doesn't stack Super Totem and Time warp totem", () => {
    const { time } = getChoppedAt({
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
      prngArgs: { farmId, itemId: 0, counter: 0 },
    });

    const buff = TREE_RECOVERY_TIME - TREE_RECOVERY_TIME * 0.5;

    expect(time).toEqual(now - buff * 1000);
  });

  it("does not go negative with all buffs", () => {
    const { time } = getChoppedAt({
      game: {
        ...INITIAL_FARM,
        collectibles: {
          "Apprentice Beaver": [
            {
              id: "123",
              createdAt: now,
              coordinates: { x: 1, y: 1 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
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
      prngArgs: { farmId, itemId: 0, counter: 0 },
    });

    const buff = TREE_RECOVERY_TIME - TREE_RECOVERY_TIME * 0.5 * 0.5;

    expect(time).toEqual(now - buff * 1000);
  });

  describe("PRNG counter security", () => {
    const itemId = KNOWN_IDS["Tree"];

    it("always increments the counter after each chop", () => {
      const initialCounter = 100;

      let state: GameState = {
        ...INITIAL_FARM,
        bumpkin: TEST_BUMPKIN,
        inventory: { Axe: new Decimal(10) },
        trees: {
          0: { createdAt: now, wood: { choppedAt: 0 }, x: 1, y: 1 },
          1: { createdAt: now, wood: { choppedAt: 0 }, x: 2, y: 1 },
          2: { createdAt: now, wood: { choppedAt: 0 }, x: 3, y: 1 },
        },
        farmActivity: { "Basic Tree Chopped": initialCounter },
      };

      // Chop tree 0
      state = chop({
        farmId,
        state,
        createdAt: now,
        action: { type: "timber.chopped", item: "Axe", index: "0" },
      });
      expect(state.farmActivity["Basic Tree Chopped"]).toEqual(
        initialCounter + 1,
      );

      // Chop tree 1
      state = chop({
        farmId,
        state,
        createdAt: now,
        action: { type: "timber.chopped", item: "Axe", index: "1" },
      });
      expect(state.farmActivity["Basic Tree Chopped"]).toEqual(
        initialCounter + 2,
      );

      // Chop tree 2
      state = chop({
        farmId,
        state,
        createdAt: now,
        action: { type: "timber.chopped", item: "Axe", index: "2" },
      });
      expect(state.farmActivity["Basic Tree Chopped"]).toEqual(
        initialCounter + 3,
      );
    });

    it("counter increments even when Tree Turnaround triggers", () => {
      // Find a counter that triggers Tree Turnaround
      function findTriggerCounter() {
        let counter = 0;
        while (counter < 1000) {
          if (
            prngChance({
              farmId,
              itemId,
              counter,
              chance: 15,
              criticalHitName: "Tree Turnaround",
            })
          ) {
            return counter;
          }
          counter++;
        }
        throw new Error("Could not find trigger counter");
      }

      const triggerCounter = findTriggerCounter();

      const state: GameState = {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          skills: { "Tree Turnaround": 1 },
        },
        inventory: { Axe: new Decimal(10) },
        trees: {
          0: { createdAt: now, wood: { choppedAt: 0 }, x: 1, y: 1 },
        },
        farmActivity: { "Basic Tree Chopped": triggerCounter },
      };

      const result = chop({
        farmId,
        state,
        createdAt: now,
        action: { type: "timber.chopped", item: "Axe", index: "0" },
      });

      // Tree Turnaround should have triggered (instant regrowth)
      expect(result.trees[0].wood.choppedAt).toEqual(
        now - TREE_RECOVERY_TIME * 1000,
      );

      // Counter should STILL increment
      expect(result.farmActivity["Basic Tree Chopped"]).toEqual(
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
        chance: 15,
        criticalHitName: "Tree Turnaround",
      });

      const result2 = prngChance({
        farmId,
        itemId,
        counter: testCounter,
        chance: 15,
        criticalHitName: "Tree Turnaround",
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
            chance: 15,
            criticalHitName: "Tree Turnaround",
          }),
        );
      }

      // With 15% chance over 100 tries, we should see both true and false
      const trueCount = results.filter((r) => r).length;
      const falseCount = results.filter((r) => !r).length;

      expect(trueCount).toBeGreaterThan(0);
      expect(falseCount).toBeGreaterThan(0);

      // Roughly 15% should be true (with some tolerance)
      expect(trueCount).toBeGreaterThan(5);
      expect(trueCount).toBeLessThan(30);
    });

    it("chopping multiple trees uses sequential counters", () => {
      const initialCounter = 50;

      // Find which counters trigger Tree Turnaround
      const triggeringCounters: number[] = [];
      for (let c = initialCounter; c < initialCounter + 5; c++) {
        if (
          prngChance({
            farmId,
            itemId,
            counter: c,
            chance: 15,
            criticalHitName: "Tree Turnaround",
          })
        ) {
          triggeringCounters.push(c);
        }
      }

      let state: GameState = {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          skills: { "Tree Turnaround": 1 },
        },
        inventory: { Axe: new Decimal(10) },
        trees: {
          0: { createdAt: now, wood: { choppedAt: 0 }, x: 1, y: 1 },
          1: { createdAt: now, wood: { choppedAt: 0 }, x: 2, y: 1 },
          2: { createdAt: now, wood: { choppedAt: 0 }, x: 3, y: 1 },
          3: { createdAt: now, wood: { choppedAt: 0 }, x: 4, y: 1 },
          4: { createdAt: now, wood: { choppedAt: 0 }, x: 5, y: 1 },
        },
        farmActivity: { "Basic Tree Chopped": initialCounter },
      };

      // Chop all 5 trees
      for (let i = 0; i < 5; i++) {
        state = chop({
          farmId,
          state,
          createdAt: now,
          action: { type: "timber.chopped", item: "Axe", index: String(i) },
        });
      }

      // Verify counter incremented correctly
      expect(state.farmActivity["Basic Tree Chopped"]).toEqual(
        initialCounter + 5,
      );

      // Verify the correct trees got instant regrowth based on their counter
      for (let i = 0; i < 5; i++) {
        const treeCounter = initialCounter + i;
        const shouldTrigger = triggeringCounters.includes(treeCounter);
        const hasInstantRegrowth =
          state.trees[i].wood.choppedAt === now - TREE_RECOVERY_TIME * 1000;

        expect(hasInstantRegrowth).toEqual(shouldTrigger);
      }
    });

    it("different tree types use different counters", () => {
      // State with a named tree (not "Tree")
      const stateWithNamedTree: GameState = {
        ...INITIAL_FARM,
        bumpkin: TEST_BUMPKIN,
        inventory: { Axe: new Decimal(10) },
        trees: {
          0: {
            name: "Sacred Tree",
            createdAt: now,
            wood: { choppedAt: 0 },
            x: 1,
            y: 1,
          },
        },
        farmActivity: {
          "Basic Tree Chopped": 100,
          "Sacred Tree Chopped": 50,
        },
      };

      const result = chop({
        farmId,
        state: stateWithNamedTree,
        createdAt: now,
        action: { type: "timber.chopped", item: "Axe", index: "0" },
      });

      // Pine Tree counter should increment, Basic Tree should not
      expect(result.farmActivity["Sacred Tree Chopped"]).toEqual(51);
      expect(result.farmActivity["Basic Tree Chopped"]).toEqual(100);
    });

    it("cannot reuse the same counter by chopping same tree twice", () => {
      const initialCounter = 0;

      const state: GameState = {
        ...INITIAL_FARM,
        bumpkin: TEST_BUMPKIN,
        inventory: { Axe: new Decimal(10) },
        trees: {
          0: { createdAt: now, wood: { choppedAt: 0 }, x: 1, y: 1 },
        },
        farmActivity: { "Basic Tree Chopped": initialCounter },
      };

      // First chop
      const afterFirstChop = chop({
        farmId,
        state,
        createdAt: now,
        action: { type: "timber.chopped", item: "Axe", index: "0" },
      });

      expect(afterFirstChop.farmActivity["Basic Tree Chopped"]).toEqual(1);

      // Trying to chop the same tree again should fail (tree still growing)
      expect(() =>
        chop({
          farmId,
          state: afterFirstChop,
          createdAt: now,
          action: { type: "timber.chopped", item: "Axe", index: "0" },
        }),
      ).toThrow("Tree is still growing");

      // Counter should still be 1 (not incremented by failed attempt)
      expect(afterFirstChop.farmActivity["Basic Tree Chopped"]).toEqual(1);
    });

    it("counter persists across game state - no way to reset", () => {
      const highCounter = 9999;

      const state: GameState = {
        ...INITIAL_FARM,
        bumpkin: TEST_BUMPKIN,
        inventory: { Axe: new Decimal(10) },
        trees: {
          0: { createdAt: now, wood: { choppedAt: 0 }, x: 1, y: 1 },
        },
        farmActivity: { "Basic Tree Chopped": highCounter },
      };

      const result = chop({
        farmId,
        state,
        createdAt: now,
        action: { type: "timber.chopped", item: "Axe", index: "0" },
      });

      // Counter should increment from the high value, not reset
      expect(result.farmActivity["Basic Tree Chopped"]).toEqual(
        highCounter + 1,
      );
    });
  });
});
