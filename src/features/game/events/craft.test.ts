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

  it("does not craft item if there is not enough funds", () => {});

  it("does not craft item if there is insufficient ingredients", () => {});

  it("crafts item", () => {});
});
