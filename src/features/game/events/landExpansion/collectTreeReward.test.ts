import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { INITIAL_FARM } from "features/game/lib/constants";
import { KNOWN_IDS } from "features/game/types";
import { GameState } from "features/game/types/game";
import { prngChance } from "lib/prng";
import { getReward } from "./collectTreeReward";
import { collectTreeReward } from "./collectTreeReward";

const now = Date.now();
const farmId = 1;
const itemId = KNOWN_IDS["Tree"];

describe("collectTreeReward", () => {
  it("only checks for rewards on tree that exist", () => {
    expect(() =>
      collectTreeReward({
        state: INITIAL_FARM,
        action: {
          type: "treeReward.collected",
          treeIndex: 30,
        },
        createdAt: now,
        farmId,
      }),
    ).toThrow("Tree does not exist");
  });

  it("checks if tree has reward", () => {
    expect(() =>
      collectTreeReward({
        state: {
          ...INITIAL_FARM,
          trees: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,
              wood: {
                choppedAt: 0, // Tree is ready (not still growing)
              },
            },
          },
        },
        action: {
          type: "treeReward.collected",
          treeIndex: 0,
        },
        createdAt: now,
        farmId,
      }),
    ).toThrow("Tree does not have a reward");
  });

  it("checks if reward is ready", () => {
    expect(() =>
      collectTreeReward({
        state: {
          ...INITIAL_FARM,
          trees: {
            0: {
              createdAt: now,
              x: -2,
              y: -1,
              wood: {
                choppedAt: now, // Tree just chopped, still recovering
                reward: {
                  coins: 320,
                },
              },
            },
          },
        },
        action: {
          type: "treeReward.collected",
          treeIndex: 0,
        },
        createdAt: now,
        farmId,
      }),
    ).toThrow("Tree is still growing");
  });

  it("provides coin rewards", () => {
    const state = collectTreeReward({
      state: {
        ...INITIAL_FARM,
        coins: 0,
        trees: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,
            wood: {
              choppedAt: 0,
              reward: {
                coins: 320,
              },
            },
          },
        },
      },
      action: {
        type: "treeReward.collected",
        treeIndex: 0,
      },
      createdAt: now,
      farmId,
    });

    const { crops } = state;

    expect(crops?.[0]?.crop?.reward).toBeUndefined();
    expect(state.coins).toEqual(320);
  });

  it("provides coin rewards for upgraded trees", () => {
    const state = collectTreeReward({
      state: {
        ...INITIAL_FARM,
        trees: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,
            multiplier: 4,
            wood: {
              choppedAt: 0,
              reward: {
                coins: 100,
              },
            },
          },
        },
      },
      action: {
        type: "treeReward.collected",
        treeIndex: 0,
      },
      createdAt: now,
      farmId,
    });

    const { trees } = state;

    expect(trees?.[0]?.wood?.reward).toBeUndefined();
    expect(state.coins).toEqual(400);
  });

  it("deletes reward after collection", () => {
    const state = collectTreeReward({
      state: {
        ...INITIAL_FARM,
        coins: 0,
        trees: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,
            wood: {
              choppedAt: 0,
              reward: {
                coins: 200,
              },
            },
          },
        },
      },
      action: {
        type: "treeReward.collected",
        treeIndex: 0,
      },
      createdAt: now,
      farmId,
    });

    expect(state.trees[0].wood.reward).toBeUndefined();
    expect(state.coins).toEqual(200);
  });

  it("calculates reward via PRNG when Money Tree skill is active", () => {
    // Find a counter that triggers Money Tree
    function findMoneyTreeCounter() {
      for (let counter = 0; counter < 500; counter++) {
        if (
          prngChance({
            farmId,
            itemId,
            counter,
            chance: 1,
            criticalHitName: "Money Tree",
          })
        ) {
          return counter;
        }
      }
      throw new Error("Could not find Money Tree counter");
    }

    const moneyTreeCounter = findMoneyTreeCounter();

    const state = collectTreeReward({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          skills: { "Money Tree": 1 },
        },
        coins: 0,
        trees: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,
            wood: {
              choppedAt: 0,
              // No pre-existing reward - will be calculated via PRNG
            },
          },
        },
        farmActivity: { "Tree Chopped": moneyTreeCounter },
      },
      action: {
        type: "treeReward.collected",
        treeIndex: 0,
      },
      createdAt: now,
      farmId,
    });

    expect(state.coins).toEqual(200);
  });
});

describe("getReward", () => {
  it("rewards 200 coins with Money Tree skill when PRNG triggers", () => {
    // Find a counter that triggers Money Tree (1% chance)
    function findMoneyTreeCounter() {
      for (let counter = 0; counter < 500; counter++) {
        if (
          prngChance({
            farmId,
            itemId,
            counter,
            chance: 1,
            criticalHitName: "Money Tree",
          })
        ) {
          return counter;
        }
      }
      throw new Error("Could not find Money Tree trigger counter");
    }

    const moneyTreeCounter = findMoneyTreeCounter();

    const { reward: result } = getReward({
      skills: { "Money Tree": 1 },
      farmId,
      itemId,
      counter: moneyTreeCounter,
    });

    expect(result?.coins).toEqual(200);
  });

  it("does not reward coins when PRNG does not trigger", () => {
    // Find a counter that does NOT trigger Money Tree
    function findNonMoneyTreeCounter() {
      for (let counter = 0; counter < 500; counter++) {
        if (
          !prngChance({
            farmId,
            itemId,
            counter,
            chance: 1,
            criticalHitName: "Money Tree",
          })
        ) {
          return counter;
        }
      }
      throw new Error("Could not find non-Money Tree counter");
    }

    const nonMoneyTreeCounter = findNonMoneyTreeCounter();

    const { reward: result } = getReward({
      skills: { "Money Tree": 1 },
      farmId,
      itemId,
      counter: nonMoneyTreeCounter,
    });

    expect(result).toBe(undefined);
  });

  it("does not reward coins without Money Tree skill", () => {
    // Even with a triggering counter, no reward without the skill
    function findMoneyTreeCounter() {
      for (let counter = 0; counter < 500; counter++) {
        if (
          prngChance({
            farmId,
            itemId,
            counter,
            chance: 1,
            criticalHitName: "Money Tree",
          })
        ) {
          return counter;
        }
      }
      throw new Error("Could not find Money Tree trigger counter");
    }

    const moneyTreeCounter = findMoneyTreeCounter();

    const { reward: result } = getReward({
      skills: {},
      farmId,
      itemId,
      counter: moneyTreeCounter,
    });

    expect(result).toBe(undefined);
  });
});

describe("PRNG counter security for tree rewards", () => {
  it("PRNG outcome is deterministic for the same counter", () => {
    const testCounter = 42;

    // Same inputs should always produce the same result
    const result1 = prngChance({
      farmId,
      itemId,
      counter: testCounter,
      chance: 1,
      criticalHitName: "Money Tree",
    });

    const result2 = prngChance({
      farmId,
      itemId,
      counter: testCounter,
      chance: 1,
      criticalHitName: "Money Tree",
    });

    expect(result1).toEqual(result2);
  });

  it("different counters produce different PRNG outcomes", () => {
    // Test that incrementing counter changes the outcome
    const results: boolean[] = [];

    for (let counter = 0; counter < 500; counter++) {
      results.push(
        prngChance({
          farmId,
          itemId,
          counter,
          chance: 1,
          criticalHitName: "Money Tree",
        }),
      );
    }

    // With 1% chance over 500 tries, we should see both true and false
    const trueCount = results.filter((r) => r).length;
    const falseCount = results.filter((r) => !r).length;

    expect(trueCount).toBeGreaterThan(0);
    expect(falseCount).toBeGreaterThan(0);

    // Roughly 1% should be true (with some tolerance)
    expect(trueCount).toBeGreaterThan(1);
    expect(trueCount).toBeLessThan(20);
  });

  it("uses farmActivity counter for PRNG calculation", () => {
    // Find a counter that triggers Money Tree
    function findMoneyTreeCounter() {
      for (let counter = 0; counter < 500; counter++) {
        if (
          prngChance({
            farmId,
            itemId,
            counter,
            chance: 1,
            criticalHitName: "Money Tree",
          })
        ) {
          return counter;
        }
      }
      throw new Error("Could not find Money Tree counter");
    }

    // Find a counter that does NOT trigger Money Tree
    function findNonMoneyTreeCounter() {
      for (let counter = 0; counter < 500; counter++) {
        if (
          !prngChance({
            farmId,
            itemId,
            counter,
            chance: 1,
            criticalHitName: "Money Tree",
          })
        ) {
          return counter;
        }
      }
      throw new Error("Could not find non-Money Tree counter");
    }

    const triggerCounter = findMoneyTreeCounter();
    const nonTriggerCounter = findNonMoneyTreeCounter();

    // With trigger counter - should get reward
    const { reward: triggerReward } = getReward({
      skills: { "Money Tree": 1 },
      farmId,
      itemId,
      counter: triggerCounter,
    });
    expect(triggerReward?.coins).toEqual(200);

    // With non-trigger counter - should NOT get reward
    const { reward: noReward } = getReward({
      skills: { "Money Tree": 1 },
      farmId,
      itemId,
      counter: nonTriggerCounter,
    });
    expect(noReward).toBe(undefined);
  });

  it("cannot collect reward twice from the same tree", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      coins: 0,
      trees: {
        0: {
          createdAt: now,
          x: -2,
          y: -1,
          wood: {
            choppedAt: 0,
            reward: {
              coins: 200,
            },
          },
        },
      },
    };

    // First collection
    const afterFirstCollection = collectTreeReward({
      state,
      action: {
        type: "treeReward.collected",
        treeIndex: 0,
      },
      createdAt: now,
      farmId,
    });

    expect(afterFirstCollection.coins).toEqual(200);
    expect(afterFirstCollection.trees[0].wood.reward).toBeUndefined();

    // Second collection should fail because reward was deleted
    expect(() =>
      collectTreeReward({
        state: afterFirstCollection,
        action: {
          type: "treeReward.collected",
          treeIndex: 0,
        },
        createdAt: now,
        farmId,
      }),
    ).toThrow("Tree does not have a reward");
  });

  it("pre-existing reward takes precedence over PRNG calculation", () => {
    // Find a counter that would NOT trigger Money Tree via PRNG
    function findNonMoneyTreeCounter() {
      for (let counter = 0; counter < 500; counter++) {
        if (
          !prngChance({
            farmId,
            itemId,
            counter,
            chance: 1,
            criticalHitName: "Money Tree",
          })
        ) {
          return counter;
        }
      }
      throw new Error("Could not find non-Money Tree counter");
    }

    const nonTriggerCounter = findNonMoneyTreeCounter();

    // Even though PRNG wouldn't trigger, pre-existing reward is used
    const state = collectTreeReward({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...TEST_BUMPKIN,
          skills: { "Money Tree": 1 },
        },
        coins: 0,
        trees: {
          0: {
            createdAt: now,
            x: -2,
            y: -1,
            wood: {
              choppedAt: 0,
              reward: {
                coins: 999, // Pre-existing reward
              },
            },
          },
        },
        farmActivity: { "Tree Chopped": nonTriggerCounter },
      },
      action: {
        type: "treeReward.collected",
        treeIndex: 0,
      },
      createdAt: now,
      farmId,
    });

    // Should use the pre-existing reward of 999, not PRNG
    expect(state.coins).toEqual(999);
  });

  it("different tree names use different itemIds for PRNG", () => {
    const basicTreeItemId = KNOWN_IDS["Tree"];
    const sacredTreeItemId = KNOWN_IDS["Sacred Tree"];

    // Verify that the itemIds are different
    expect(basicTreeItemId).not.toEqual(sacredTreeItemId);
    expect(basicTreeItemId).toBeDefined();
    expect(sacredTreeItemId).toBeDefined();

    // Test that different itemIds can produce different PRNG outcomes
    // by checking over a range of counters
    let differenceFound = false;
    for (let counter = 0; counter < 100; counter++) {
      const basicResult = prngChance({
        farmId,
        itemId: basicTreeItemId,
        counter,
        chance: 10, // Higher chance to find differences
        criticalHitName: "Money Tree",
      });

      const sacredResult = prngChance({
        farmId,
        itemId: sacredTreeItemId,
        counter,
        chance: 10,
        criticalHitName: "Money Tree",
      });

      if (basicResult !== sacredResult) {
        differenceFound = true;
        break;
      }
    }

    // Different itemIds should produce at least some different results
    expect(differenceFound).toBe(true);
  });

  it("different farmIds produce different PRNG outcomes", () => {
    const testCounter = 42;

    // Test across multiple farmIds
    const results: boolean[] = [];
    for (let testFarmId = 1; testFarmId <= 100; testFarmId++) {
      results.push(
        prngChance({
          farmId: testFarmId,
          itemId,
          counter: testCounter,
          chance: 10, // Higher chance for more variation
          criticalHitName: "Money Tree",
        }),
      );
    }

    // With 10% chance over 100 different farmIds, we should see variation
    const trueCount = results.filter((r) => r).length;
    const falseCount = results.filter((r) => !r).length;

    // Should have both true and false values
    expect(trueCount).toBeGreaterThan(0);
    expect(falseCount).toBeGreaterThan(0);
  });
});
