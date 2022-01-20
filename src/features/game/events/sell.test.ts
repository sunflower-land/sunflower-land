import { FieldItem, GameState } from "../GameProvider";

import { sell } from "./sell";

const EMPTY_FIELDS: FieldItem[] = Array(5)
  .fill(null)
  .map((_, fieldIndex) => ({ fieldIndex }));

let GAME_STATE: GameState = {
  fields: EMPTY_FIELDS,
  actions: [],
  balance: 0,
  inventory: {},
  level: 1,
};

describe("sell", () => {
  it("does not sell a non sellable item", () => {
    expect(() =>
      sell(GAME_STATE, {
        type: "item.sell",
        item: "Axe",
      })
    ).toThrow("Not for sale");
  });

  it("does not sell a missing item", () => {
    expect(() =>
      sell(GAME_STATE, {
        type: "item.sell",
        item: "Sunflower",
      })
    ).toThrow("No crops to sell");
  });

  it("sells an item", () => {
    const state = sell(
      {
        ...GAME_STATE,
        inventory: {
          Sunflower: 5,
        },
      },
      {
        type: "item.sell",
        item: "Sunflower",
      }
    );

    expect(state.inventory.Sunflower).toEqual(4);
    expect(state.balance).toEqual(0.02);
  });
});
