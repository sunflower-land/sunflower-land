import Decimal from "decimal.js-light";
import { EMPTY, INITIAL_FARM } from "../lib/constants";
import { GameState } from "../types/game";
import { chop, ChopAction } from "./chop";

const GAME_STATE: GameState = INITIAL_FARM;

describe("chop", () => {
  it("throws an error if axe is not selected", () => {
    expect(() =>
      chop({
        state: GAME_STATE,
        action: {
          type: "tree.chopped",
          item: "Sunflower Statue",
          index: 0,
        },
      })
    ).toThrow("No axe");
  });

  it("throws an error if no axes are left", () => {
    expect(() =>
      chop({
        state: EMPTY,
        action: {
          type: "tree.chopped",
          item: "Axe",
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
        type: "tree.chopped",
        item: "Axe",
        index: 0,
      } as ChopAction,
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
        type: "tree.chopped",
        item: "Axe",
        index: 0,
      } as ChopAction,
    };
    const game = chop(payload);

    expect(game.inventory.Axe).toEqual(new Decimal(0));
    expect(game.inventory.Wood).toEqual(new Decimal(3));
    expect(game.trees["0"].wood.toNumber()).toBeGreaterThan(2);
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
        type: "tree.chopped",
        item: "Axe",
        index: 0,
      } as ChopAction,
    });

    game = chop({
      state: game,
      action: {
        type: "tree.chopped",
        item: "Axe",
        index: 1,
      } as ChopAction,
    });

    expect(game.inventory.Axe).toEqual(new Decimal(1));
    expect(game.inventory.Wood).toEqual(new Decimal(7));
    expect(game.trees["0"].wood.toNumber()).toBeGreaterThan(2);
    expect(game.trees["1"].wood.toNumber()).toBeGreaterThan(2);
  });
});
