import Decimal from "decimal.js-light";

import { INITIAL_FARM } from "../lib/constants";
import { GameState } from "../types/game";
import { removeCrop, REMOVE_CROP_ERRORS } from "./removeCrop";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  fields: {},
  balance: new Decimal(0),
  inventory: {
    Shovel: new Decimal(1),
  },
  trees: {},
};

describe("removeCrop", () => {
  it("does not remove on non-existent field", () => {
    expect(() =>
      removeCrop({
        state: GAME_STATE,
        action: {
          type: "item.removed",
          item: "Shovel",
          fieldIndex: -1,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.FIELD_DOESNT_EXIST);
  });

  it("does not remove on non-integer field", () => {
    expect(() =>
      removeCrop({
        state: GAME_STATE,
        action: {
          type: "item.removed",
          item: "Shovel",
          fieldIndex: 1.2,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.FIELD_DOESNT_EXIST);
  });

  it("will not remove if the shovel is rusty", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
          inventory: {
            "Rusty Shovel": new Decimal(1),
          },
          fields: {
            1: {
              name: "Sunflower",
              plantedAt: Date.now(),
            },
          },
        },
        action: {
          type: "item.removed",
          item: "Rusty Shovel",
          fieldIndex: 1,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.NO_VALID_SHOVEL_SELECTED);
  });

  it("throws an error if shovel is not selected", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
          fields: {
            1: {
              name: "Sunflower",
              plantedAt: Date.now(),
            },
          },
        },
        action: {
          type: "item.removed",
          fieldIndex: 1,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.NO_VALID_SHOVEL_SELECTED);
  });

  it("throws an error if no shovel exists in inventory", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
          inventory: {},
          fields: {
            1: {
              name: "Sunflower",
              plantedAt: Date.now(),
            },
          },
        },
        action: {
          type: "item.removed",
          item: "Shovel",
          fieldIndex: 1,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.NO_SHOVEL_AVAILABLE);
  });

  it("doesn't remove if the crop is ready to harvest", () => {
    expect(() =>
      removeCrop({
        state: {
          ...GAME_STATE,
          fields: {
            1: {
              name: "Sunflower",
              plantedAt: Date.now() - 2 * 60 * 1000,
            },
          },
        },
        action: {
          type: "item.removed",
          item: "Shovel",
          fieldIndex: 1,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.READY_TO_HARVEST);
  });

  it("removes nothing if nothing is planted", () => {
    expect(() =>
      removeCrop({
        state: GAME_STATE,
        action: {
          type: "item.removed",
          item: "Shovel",
          fieldIndex: 1,
        },
      })
    ).toThrow(REMOVE_CROP_ERRORS.NO_CROP_PLANTED);
  });

  it("removes a crop", () => {
    const state = removeCrop({
      state: {
        ...GAME_STATE,
        fields: {
          1: {
            name: "Sunflower",
            plantedAt: Date.now(),
          },
        },
      },
      action: {
        type: "item.removed",
        item: "Shovel",
        fieldIndex: 1,
      },
    });

    expect(state.inventory.Sunflower).toBeFalsy();
    expect(state.inventory["Sunflower Seed"]).toBeFalsy();
    expect(state.fields[1]).toBeFalsy();
  });
});
