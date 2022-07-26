import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState, LandExpansionTree } from "features/game/types/game";
import { chop, LandExpansionChopAction } from "./chop";

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
});
