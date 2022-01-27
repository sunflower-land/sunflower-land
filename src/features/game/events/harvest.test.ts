import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../lib/constants";
import { FieldItem, GameState } from "../types/game";
import { harvest } from "./harvest";

let GAME_STATE: GameState = {
  id: 1,
  fields: {},
  balance: new Decimal(0),
  inventory: {},
};

describe("harvest", () => {
  it("does not harvest empty air", () => {
    expect(() =>
      harvest(GAME_STATE, {
        type: "item.harvested",
        index: 0,
      })
    ).toThrow("Nothing was planted");
  });

  it("does not harvest if the crop is not ripe", () => {
    expect(() =>
      harvest(
        {
          ...GAME_STATE,
          fields: {
            0: {
              name: "Sunflower",
              plantedAt: Date.now() - 100,
            },
          },
        },
        {
          type: "item.harvested",
          index: 0,
        }
      )
    ).toThrow("Crop is not ready to harvest");
  });

  it("harvests a crop", () => {
    const state = harvest(
      {
        ...GAME_STATE,
        fields: {
          0: {
            name: "Sunflower",
            plantedAt: Date.now() - 2 * 60 * 1000,
          },
        },
      },
      {
        type: "item.harvested",
        index: 0,
      }
    );

    expect(state.inventory.Sunflower).toBe(1);
    expect(state.fields).toEqual({});
  });

  it("does not harvest on the first goblin land", () => {
    expect(() =>
      harvest(
        { ...INITIAL_FARM, inventory: {} },
        {
          type: "item.harvested",
          index: 6,
        }
      )
    ).toThrow("Goblin land!");
  });

  it("harvests once the first goblin is gone", () => {
    const state = harvest(
      { ...INITIAL_FARM, inventory: { "Pumpkin Soup": 1 } },
      {
        type: "item.harvested",
        index: 5,
      }
    );

    expect(state.inventory.Carrot).toBe(1);
  });

  it("does not harvest on the second goblin land", () => {
    expect(() =>
      harvest(
        { ...INITIAL_FARM, inventory: {} },
        {
          type: "item.harvested",
          index: 11,
        }
      )
    ).toThrow("Goblin land!");
  });

  it("harvests once the second goblin is gone", () => {
    const state = harvest(
      { ...INITIAL_FARM, inventory: { Sauerkraut: 1 } },
      {
        type: "item.harvested",
        index: 10,
      }
    );

    expect(state.inventory.Cauliflower).toBe(1);
  });

  it("does not harvest on the third goblin land", () => {
    expect(() =>
      harvest(
        { ...INITIAL_FARM, inventory: {} },
        {
          type: "item.harvested",
          index: 16,
        }
      )
    ).toThrow("Goblin land!");
  });

  it("harvests once the third goblin is gone", () => {
    const state = harvest(
      { ...INITIAL_FARM, inventory: { "Roasted Cauliflower": 1 } },
      {
        type: "item.harvested",
        index: 16,
      }
    );

    expect(state.inventory.Parsnip).toBe(1);
  });
});
