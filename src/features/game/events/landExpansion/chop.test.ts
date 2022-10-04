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
});

describe("getChoppedAt", () => {
  it("applies a 20% speed boost with Tree Hugger skill", () => {
    const now = Date.now();

    const time = getChoppedAt({
      inventory: {},
      skills: { "Tree Hugger": 1 },
      createdAt: now,
    });

    expect(time).toEqual(now - (TREE_RECOVERY_SECONDS - 0.2) * 1000);
  });
});
