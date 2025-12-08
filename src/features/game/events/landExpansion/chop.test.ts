/* eslint-disable no-var */
import Decimal from "decimal.js-light";
import {
  INITIAL_BUMPKIN,
  INITIAL_FARM,
  TEST_FARM,
  TREE_RECOVERY_TIME,
} from "features/game/lib/constants";
import { GameState, Tree } from "features/game/types/game";
import {
  chop,
  getChoppedAt,
  LandExpansionChopAction,
  CHOP_ERRORS,
} from "./chop";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import { prngChance } from "lib/prng";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  trees: {
    0: {
      wood: {
        choppedAt: 0,
      },
      x: 1,
      y: 1,
    },
    1: {
      wood: {
        choppedAt: 0,
      },
      x: 4,
      y: 1,
    },
  },
};

describe("chop", () => {
  const dateNow = Date.now();
  const farmId = 1;
  it("throws an error if no axes are left", () => {
    expect(() =>
      chop({
        farmId,
        state: { ...GAME_STATE, inventory: {} },
        action: {
          type: "timber.chopped",
          item: "Axe",
          index: "0",
        },
      }),
    ).toThrow(CHOP_ERRORS.NO_AXES);
  });

  it("throws an error if tree is not placed", () => {
    expect(() =>
      chop({
        farmId,
        state: {
          ...GAME_STATE,
          trees: { 0: { x: undefined, y: undefined, wood: { choppedAt: 0 } } },
        },
        action: {
          type: "timber.chopped",
          item: "Axe",
          index: "0",
        },
      }),
    ).toThrow("Tree is not placed");
  });

  it("throws an error if tree is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          Axe: new Decimal(2),
        },
      },
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "0",
      } as LandExpansionChopAction,
    };

    const game = chop({ farmId, ...payload });

    // Try same payload
    expect(() => chop({ farmId, state: game, action: payload.action })).toThrow(
      CHOP_ERRORS.STILL_GROWING,
    );
  });

  it("chops a tree", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          Axe: new Decimal(1),
        },
      },
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "0",
      } as LandExpansionChopAction,
    };

    const game = chop({ farmId, ...payload });

    expect(game.inventory.Axe).toEqual(new Decimal(0));
    expect(game.inventory.Wood).toEqual(new Decimal(1));
  });

  it("chops multiple trees", () => {
    let game = chop({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          Axe: new Decimal(3),
        },
      },
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "0",
      } as LandExpansionChopAction,
    });

    game = chop({
      farmId,
      state: game,
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "1",
      } as LandExpansionChopAction,
    });

    expect(game.inventory.Axe).toEqual(new Decimal(1));
    expect(game.inventory.Wood).toEqual(new Decimal(2));
  });

  it("chops trees with the logger Skill", () => {
    const game = chop({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          Logger: new Decimal(1),
          Axe: new Decimal(1),
        },
        bumpkin: INITIAL_BUMPKIN,
        collectibles: {},
      },
      createdAt: Date.now(),
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "0",
      } as LandExpansionChopAction,
    });

    expect(game.inventory.Wood).toEqual(new Decimal(1));
    expect(game.inventory.Axe).toEqual(new Decimal(0.5));
  });
  it("tree replenishes normally", () => {
    const dateNow = Date.now();
    const game = chop({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
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

  it("tree replenishes on normal rate when Apprentice Beaver is placed but not ready", () => {
    const game = chop({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
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
        bumpkin: INITIAL_BUMPKIN,
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
      createdAt: Date.now(),
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
    expect(tree.wood.choppedAt).toBeLessThan(Date.now() - ONE_HOUR + 5);
  });

  it("chops trees without axes when Foreman Beaver is placed and ready", () => {
    const game = chop({
      farmId,
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
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
      createdAt: Date.now(),
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "0",
      } as LandExpansionChopAction,
    });

    expect(game.inventory.Wood).toEqual(new Decimal(1.2));
  });

  describe("BumpkinActivity", () => {
    it("increments Trees Chopped activity by 1 when 1 tree is chopped", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
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

      expect(game.farmActivity?.["Tree Chopped"]).toBe(1);
    });
    it("increments Trees Chopped activity by 2 when 2 trees are chopped", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
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

      expect(game.farmActivity?.["Tree Chopped"]).toBe(2);
    });
  });
});

describe("getChoppedAt", () => {
  const farmId = 1;
  it("tree replenishes faster with time warp", () => {
    const now = Date.now();

    const { time } = getChoppedAt({
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
      createdAt: now,
      farmId,
      itemId: 0,
      counter: 0,
    });

    expect(time).toEqual(now - (TREE_RECOVERY_TIME * 1000) / 2);
  });

  it("tree replenishes faster with Super Totem", () => {
    const now = Date.now();

    const { time } = getChoppedAt({
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
      createdAt: now,
      farmId,
      itemId: 0,
      counter: 0,
    });

    expect(time).toEqual(now - (TREE_RECOVERY_TIME * 1000) / 2);
  });

  it(" doesn't stack Super Totem and Time warp totem", () => {
    const now = Date.now();

    const { time } = getChoppedAt({
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
      createdAt: now,
      farmId,
      itemId: 0,
      counter: 0,
    });

    const buff = TREE_RECOVERY_TIME - TREE_RECOVERY_TIME * 0.5;

    expect(time).toEqual(now - buff * 1000);
  });

  it("applies an instant growth with Tree Turnaround skill", () => {
    const now = Date.now();
    const itemId = parseInt("0x0876d42a");

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
          ...INITIAL_BUMPKIN,
          skills: { "Tree Turnaround": 1 },
        },
      },
      createdAt: now,
      farmId,
      itemId,
      counter,
    });

    expect(time).toEqual(now - TREE_RECOVERY_TIME * 1000);
  });

  it("does not go negative with all buffs", () => {
    const now = Date.now();

    const { time } = getChoppedAt({
      game: {
        ...TEST_FARM,
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
      farmId,
      itemId: 0,
      counter: 0,
    });

    const buff = TREE_RECOVERY_TIME - TREE_RECOVERY_TIME * 0.5 * 0.5;

    expect(time).toEqual(now - buff * 1000);
  });

  it("applies a Timber Hourglass boost of -25% recovery time for 4 hours", () => {
    const now = Date.now();

    const { time: createdAt } = getChoppedAt({
      game: {
        ...TEST_FARM,
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
      farmId,
      itemId: 0,
      counter: 0,
    });

    const boostedRecoveryTime =
      (TREE_RECOVERY_TIME - TREE_RECOVERY_TIME * 0.75) * 1000;

    expect(createdAt).toEqual(now - boostedRecoveryTime);
  });

  it("does not apply a Timber Hourglass boost if it has expired", () => {
    const now = Date.now();
    const fiveHoursAgo = now - 5 * 60 * 60 * 1000;

    const { time: createdAt } = getChoppedAt({
      game: {
        ...TEST_FARM,
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
      farmId,
      itemId: 0,
      counter: 0,
    });

    expect(createdAt).toEqual(now);
  });

  it("applies a 10% recovery time boost with Tree Charge skill", () => {
    const now = Date.now();

    const { time } = getChoppedAt({
      game: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { "Tree Charge": 1 },
        },
      },
      createdAt: now,
      farmId,
      itemId: 0,
      counter: 0,
    });

    const treeTimeWithBoost = TREE_RECOVERY_TIME * 1000 * 0.1;
    expect(time).toEqual(now - treeTimeWithBoost);
  });
  it("applies the Badger Shrine boost", () => {
    const now = Date.now();
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
      farmId,
      itemId: 0,
      counter: 0,
    });

    expect(time).toEqual(now - TREE_RECOVERY_TIME * 0.25 * 1000);
  });

  it("does not apply the Badger Shrine boost if expired", () => {
    const now = Date.now();
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
      farmId,
      itemId: 0,
      counter: 0,
    });

    expect(time).toEqual(now);
  });
});
