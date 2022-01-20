import { GameState } from "../GameProvider";

import { craft } from "./craft";

let GAME_STATE: GameState = {
  fields: [],
  actions: [],
  balance: 0,
  inventory: {},
  level: 1,
};

describe("craft", () => {
  it("throws an error if item is not craftable", () => {
    expect(() =>
      craft(GAME_STATE, {
        type: "item.crafted",
        item: "Sunflower",
      })
    ).toThrow("This item is not craftable: Sunflower");
  });

  it("does not craft item if there is not enough funds", () => {
    expect(() =>
      craft(
        {
          ...GAME_STATE,
          balance: 0.005,
        },
        {
          type: "item.crafted",
          item: "Sunflower Seed",
        }
      )
    ).toThrow("Insufficient tokens");
  });

  it("does not craft item if there is insufficient ingredients", () => {
    expect(() =>
      craft(
        {
          ...GAME_STATE,
          balance: 10,
          inventory: { Wood: 0 },
        },
        {
          type: "item.crafted",
          item: "Pickaxe",
        }
      )
    ).toThrow("Insufficient ingredient: Wood");
  });

  it("crafts item with sufficient balance", () => {
    const state = craft(
      {
        ...GAME_STATE,
        balance: 1,
      },
      {
        type: "item.crafted",
        item: "Sunflower Seed",
      }
    );

    expect(state.balance).toBe(0.99);
    expect(state.inventory["Sunflower Seed"]).toBe(1);
  });

  it("crafts item with sufficient ingredients", () => {
    const state = craft(
      {
        ...GAME_STATE,
        balance: 1,
        inventory: { Wood: 10 },
      },
      {
        type: "item.crafted",
        item: "Pickaxe",
      }
    );

    expect(state.balance).toBe(0);
    expect(state.inventory["Pickaxe"]).toBe(1);
    expect(state.inventory["Wood"]).toBe(9);
  });
});
