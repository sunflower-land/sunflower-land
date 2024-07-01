import Decimal from "decimal.js-light";
import {
  INITIAL_BUMPKIN,
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

const GAME_STATE: GameState = {
  ...TEST_FARM,
  trees: {
    0: {
      wood: {
        choppedAt: 0,
        amount: 3,
      },
      x: 1,
      y: 1,
      height: 2,
      width: 2,
    },
    1: {
      wood: {
        choppedAt: 0,
        amount: 4,
      },
      x: 4,
      y: 1,
      height: 2,
      width: 2,
    },
  },
};

describe("chop", () => {
  const dateNow = Date.now();

  it("throws an error if no axes are left", () => {
    expect(() =>
      chop({
        state: { ...GAME_STATE, inventory: {} },
        action: {
          type: "timber.chopped",
          item: "Axe",
          index: "0",
        },
      }),
    ).toThrow(CHOP_ERRORS.NO_AXES);
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

    const game = chop(payload);

    // Try same payload
    expect(() =>
      chop({
        state: game,
        action: payload.action,
      }),
    ).toThrow(CHOP_ERRORS.STILL_GROWING);
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

    const game = chop(payload);

    const { trees } = game;
    const tree = (trees as Record<number, Tree>)[0];

    expect(game.inventory.Axe).toEqual(new Decimal(0));
    expect(game.inventory.Wood).toEqual(new Decimal(3));
    expect(tree.wood.amount).toBeGreaterThan(0);
  });

  it("chops multiple trees", () => {
    let game = chop({
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
      state: game,
      action: {
        type: "timber.chopped",
        item: "Axe",
        index: "1",
      } as LandExpansionChopAction,
    });

    const { trees } = game;
    const tree1 = (trees as Record<number, Tree>)[0];
    const tree2 = (trees as Record<number, Tree>)[1];

    expect(game.inventory.Axe).toEqual(new Decimal(1));
    expect(game.inventory.Wood).toEqual(new Decimal(7));
    expect(tree1.wood.amount).toBeGreaterThan(0);
    expect(tree2.wood.amount).toBeGreaterThan(0);
  });

  it("chops trees with the logger Skill", () => {
    const game = chop({
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

    const { trees } = game;
    const tree = (trees as Record<number, Tree>)[0];

    expect(game.inventory.Wood).toEqual(new Decimal(3));
    expect(tree.wood.amount).toBeGreaterThan(0);
    expect(game.inventory.Axe).toEqual(new Decimal(0.5));
  });
  it("tree replenishes normally", () => {
    const dateNow = Date.now();
    const game = chop({
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

    const { trees } = game;
    const tree = (trees as Record<number, Tree>)[0];

    expect(game.inventory.Wood).toEqual(new Decimal(3));
    expect(tree.wood.amount).toBeGreaterThan(0);
  });

  it("throws an error if the player doesn't have a bumpkin", async () => {
    expect(() =>
      chop({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
          inventory: {
            Axe: new Decimal(1),
          },
        },
        action: {
          type: "timber.chopped",
          item: "Axe",
          index: "0",
        } as LandExpansionChopAction,
      }),
    ).toThrow("You do not have a Bumpkin");
  });

  describe("BumpkinActivity", () => {
    it("increments Trees Chopped activity by 1 when 1 tree is chopped", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
      };
      const game = chop({
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

      expect(game.bumpkin?.activity?.["Tree Chopped"]).toBe(1);
    });
    it("increments Trees Chopped activity by 2 when 2 trees are chopped", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
      };
      const state1 = chop({
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

      expect(game.bumpkin?.activity?.["Tree Chopped"]).toBe(2);
    });
  });
});

describe("getChoppedAt", () => {
  it("applies a 20% speed boost with Tree Hugger skill", () => {
    const now = Date.now();

    const time = getChoppedAt({
      game: TEST_FARM,
      skills: { "Tree Hugger": 1 },
      createdAt: now,
    });

    const treeTimeWithBoost = TREE_RECOVERY_TIME * 1000 * 0.2;
    expect(time).toEqual(now - treeTimeWithBoost);
  });

  it("tree replenishes faster when Apprentice Beaver is placed and the bumpkins has the skill Tree Hugger", () => {
    const now = Date.now();

    const time = getChoppedAt({
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
        },
      },
      skills: { "Tree Hugger": 1 },
      createdAt: now,
    });

    const buff = TREE_RECOVERY_TIME * 0.5 * 1.2 * 1000;
    expect(time).toEqual(now - buff);
  });

  it("tree replenishes faster with time warp", () => {
    const now = Date.now();

    const time = getChoppedAt({
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

    expect(time).toEqual(now - (TREE_RECOVERY_TIME * 1000) / 2);
  });

  it("does not go negative with all buffs", () => {
    const now = Date.now();

    const time = getChoppedAt({
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
        },
      },
      skills: { "Tree Hugger": 1 },
      createdAt: now,
    });

    const buff = TREE_RECOVERY_TIME - TREE_RECOVERY_TIME * 0.5 * 0.5 * 0.8;

    expect(time).toEqual(now - buff * 1000);
  });

  it("applies a Timber Hourglass boost of -25% recovery time for 4 hours", () => {
    const now = Date.now();

    const createdAt = getChoppedAt({
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
      skills: {},
      createdAt: now,
    });

    const boostedRecoveryTime =
      (TREE_RECOVERY_TIME - TREE_RECOVERY_TIME * 0.75) * 1000;

    expect(createdAt).toEqual(now - boostedRecoveryTime);
  });

  it("does not apply a Timber Hourglass boost if it has expired", () => {
    const now = Date.now();
    const fiveHoursAgo = now - 5 * 60 * 60 * 1000;

    const createdAt = getChoppedAt({
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
      skills: {},
      createdAt: now,
    });

    expect(createdAt).toEqual(now);
  });
});
