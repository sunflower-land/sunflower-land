import Decimal from "decimal.js-light";
import {
  CHOP_STAMINA_COST,
  INITIAL_BUMPKIN,
  INITIAL_FARM,
  MAX_STAMINA,
} from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";
import { GameState, LandExpansionTree } from "features/game/types/game";
import { TREE_RECOVERY_SECONDS } from "../chop";
import { chop, getChoppedAt, LandExpansionChopAction } from "./chop";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  expansions: [
    {
      ...INITIAL_FARM.expansions[0],
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
    },
  ],
};

describe("chop", () => {
  const dateNow = Date.now();
  it("throws an error if expansion does not exist", () => {
    expect(() =>
      chop({
        state: GAME_STATE,
        action: {
          type: "timber.chopped",
          item: "Sunflower Statue",
          expansionIndex: -1,
          index: 0,
        },
      })
    ).toThrow("Expansion does not exist");
  });

  it("throws an error if expansion has no trees", () => {
    expect(() =>
      chop({
        state: { ...GAME_STATE, expansions: [{ createdAt: 0, readyAt: 0 }] },
        action: {
          type: "timber.chopped",
          item: "Sunflower Statue",
          expansionIndex: 0,
          index: 0,
        },
      })
    ).toThrow("Expansion has no trees");
  });

  it("throws an error if axe is not selected", () => {
    expect(() =>
      chop({
        state: GAME_STATE,
        action: {
          type: "timber.chopped",
          item: "Sunflower Statue",
          expansionIndex: 0,
          index: 0,
        },
      })
    ).toThrow("No axe");
  });

  it("throws an error if no axes are left", () => {
    expect(() =>
      chop({
        state: { ...GAME_STATE, inventory: {} },
        action: {
          type: "timber.chopped",
          item: "Axe",
          expansionIndex: 0,
          index: 0,
        },
      })
    ).toThrow("No axes left");
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
        expansionIndex: 0,
        index: 0,
      } as LandExpansionChopAction,
    };

    const game = chop(payload);

    // Try same payload
    expect(() =>
      chop({
        state: game,
        action: payload.action,
      })
    ).toThrow("Tree is still growing");
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
        expansionIndex: 0,
        index: 0,
      } as LandExpansionChopAction,
    };

    const game = chop(payload);

    const { expansions } = game;
    const trees = expansions[0].trees;
    const tree = (trees as Record<number, LandExpansionTree>)[0];

    expect(game.inventory.Axe).toEqual(new Decimal(0));
    expect(game.inventory.Wood).toEqual(new Decimal(3));
    expect(tree.wood.amount).toBeGreaterThan(2);
  });

  it("chops multiple tree", () => {
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
        expansionIndex: 0,
        index: 0,
      } as LandExpansionChopAction,
    });

    game = chop({
      state: game,
      action: {
        type: "timber.chopped",
        item: "Axe",
        expansionIndex: 0,
        index: 1,
      } as LandExpansionChopAction,
    });

    const { expansions } = game;
    const trees = expansions[0].trees;
    const tree1 = (trees as Record<number, LandExpansionTree>)[0];
    const tree2 = (trees as Record<number, LandExpansionTree>)[1];

    expect(game.inventory.Axe).toEqual(new Decimal(1));
    expect(game.inventory.Wood).toEqual(new Decimal(7));
    expect(tree1.wood.amount).toBeGreaterThan(2);
    expect(tree2.wood.amount).toBeGreaterThan(2);
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
        expansionIndex: 0,
        index: 0,
      } as LandExpansionChopAction,
    });

    const { expansions } = game;
    const trees = expansions[0].trees;
    const tree = (trees as Record<number, LandExpansionTree>)[0];

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
        expansionIndex: 0,
        index: 0,
      } as LandExpansionChopAction,
    });

    const { expansions } = game;
    const trees = expansions[0].trees;
    const tree = (trees as Record<number, LandExpansionTree>)[0];

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
        expansionIndex: 0,
        index: 0,
      } as LandExpansionChopAction,
    });

    const { expansions } = game;
    const trees = expansions[0].trees;
    const tree = (trees as Record<number, LandExpansionTree>)[0];

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
        index: 0,
        expansionIndex: 0,
      } as LandExpansionChopAction,
    });

    const { expansions } = game;
    const trees = expansions[0].trees;
    const tree = (trees as Record<number, LandExpansionTree>)[0];

    expect(game.inventory.Wood).toEqual(new Decimal(3));
    expect(tree.wood.amount).toBeGreaterThan(2);
  });

  it("throws an error if the player doesnt have a bumpkin", async () => {
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
          expansionIndex: 0,
          index: 0,
        } as LandExpansionChopAction,
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("requires player has enough stamina", () => {
    expect(() =>
      chop({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            stamina: { value: 0, replenishedAt: Date.now() },
          },
          inventory: {
            Axe: new Decimal(1),
          },
        },
        action: {
          type: "timber.chopped",
          item: "Axe",
          expansionIndex: 0,
          index: 0,
        } as LandExpansionChopAction,
      })
    ).toThrow("You do not have enough stamina");
  });

  it("replenishes stamina before chopping", () => {
    const createdAt = Date.now();

    const state = chop({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          stamina: { value: 0, replenishedAt: 0 },
        },
        inventory: {
          Axe: new Decimal(1),
        },
      },
      action: {
        type: "timber.chopped",
        item: "Axe",
        expansionIndex: 0,
        index: 0,
      } as LandExpansionChopAction,
      createdAt,
    });

    expect(state.bumpkin?.stamina.replenishedAt).toBe(createdAt);
  });

  it("deducts stamina from bumpkin", () => {
    const createdAt = Date.now();

    const state = chop({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          stamina: { value: 0, replenishedAt: 0 },
        },
        inventory: {
          Axe: new Decimal(1),
        },
      },
      action: {
        type: "timber.chopped",
        item: "Axe",
        expansionIndex: 0,
        index: 0,
      } as LandExpansionChopAction,
      createdAt,
    });

    expect(state.bumpkin?.stamina.value).toBe(
      MAX_STAMINA[getBumpkinLevel(INITIAL_BUMPKIN.experience)] -
        CHOP_STAMINA_COST
    );
  });

  describe("BumpkinActivity", () => {
    it("increments Trees Chopped activity by 1 when 1 tree is chopped", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
        stamina: { value: 0, replenishedAt: 0 },
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
          expansionIndex: 0,
          index: 0,
        } as LandExpansionChopAction,
      });

      expect(game.bumpkin?.activity?.["Tree Chopped"]).toBe(1);
    });
    it("increments Trees Chopped activity by 2 when 2 trees are chopped", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
        stamina: { value: 0, replenishedAt: 0 },
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
          expansionIndex: 0,
          index: 0,
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
          expansionIndex: 0,
          index: 1,
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
      collectibles: {},
      skills: { "Tree Hugger": 1 },
      createdAt: now,
    });

    const treeTimeWithBoost = TREE_RECOVERY_SECONDS * 1000 * 0.8;
    expect(time).toEqual(now - treeTimeWithBoost);
  });
});
