import Decimal from "decimal.js-light";

import { INITIAL_FARM } from "../lib/constants";
import { GameState } from "../types/game";
import { harvest } from "./harvest";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  fields: {},
  balance: new Decimal(0),
  inventory: {},
  trees: {},
};

describe("harvest", () => {
  it("does not harvest on non-existent field", () => {
    expect(() =>
      harvest({
        state: GAME_STATE,
        action: {
          type: "item.harvested",
          index: -1,
        },
      })
    ).toThrow("Field does not exist");
  });

  it("does not harvest on non-integer field", () => {
    expect(() =>
      harvest({
        state: GAME_STATE,
        action: {
          type: "item.harvested",
          index: 1.2,
        },
      })
    ).toThrow("Field does not exist");
  });

  it("does not harvest empty air", () => {
    expect(() =>
      harvest({
        state: GAME_STATE,
        action: {
          type: "item.harvested",
          index: 0,
        },
      })
    ).toThrow("Nothing was planted");
  });

  it("does not harvest if the crop is not ripe", () => {
    expect(() =>
      harvest({
        state: {
          ...GAME_STATE,
          fields: {
            0: {
              name: "Sunflower",
              plantedAt: Date.now() - 100,
            },
          },
        },
        action: {
          type: "item.harvested",
          index: 0,
        },
      })
    ).toThrow("Not ready");
  });

  it("harvests a crop", () => {
    const state = harvest({
      state: {
        ...GAME_STATE,
        fields: {
          0: {
            name: "Sunflower",
            plantedAt: Date.now() - 2 * 60 * 1000,
          },
        },
      },
      action: {
        type: "item.harvested",
        index: 0,
      },
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(1));
    expect(state.fields).toEqual({});
  });

  it("does not harvest on the first goblin land", () => {
    expect(() =>
      harvest({
        state: { ...INITIAL_FARM, inventory: {} },
        action: {
          type: "item.harvested",
          index: 6,
        },
      })
    ).toThrow("Goblin land!");
  });

  it("harvests once the first goblin is gone", () => {
    const state = harvest({
      state: { ...INITIAL_FARM, inventory: { "Pumpkin Soup": new Decimal(1) } },
      action: {
        type: "item.harvested",
        index: 5,
      },
    });

    expect(state.inventory.Carrot).toEqual(new Decimal(1));
  });

  it("does not harvest on the second goblin land", () => {
    expect(() =>
      harvest({
        state: { ...INITIAL_FARM, inventory: {} },
        action: {
          type: "item.harvested",
          index: 11,
        },
      })
    ).toThrow("Goblin land!");
  });

  it("harvests once the second goblin is gone", () => {
    const state = harvest({
      state: { ...INITIAL_FARM, inventory: { Sauerkraut: new Decimal(1) } },
      action: {
        type: "item.harvested",
        index: 10,
      },
    });

    expect(state.inventory.Cauliflower).toEqual(new Decimal(1));
  });

  it("does not harvest on the third goblin land", () => {
    expect(() =>
      harvest({
        state: { ...INITIAL_FARM, inventory: {} },
        action: {
          type: "item.harvested",
          index: 16,
        },
      })
    ).toThrow("Goblin land!");
  });

  it("harvests once the third goblin is gone", () => {
    const state = harvest({
      state: {
        ...INITIAL_FARM,
        inventory: { "Roasted Cauliflower": new Decimal(1) },
      },
      action: {
        type: "item.harvested",
        index: 16,
      },
    });

    expect(state.inventory.Parsnip).toEqual(new Decimal(1));
  });
});
