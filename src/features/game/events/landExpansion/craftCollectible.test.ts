import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { craftCollectible } from "./craftCollectible";

const GAME_STATE: GameState = TEST_FARM;

describe("craftCollectible", () => {
  it("throws an error if item is not craftable", () => {
    expect(() =>
      craftCollectible({
        state: GAME_STATE,
        action: {
          type: "collectible.crafted",
          name: "Sunflower Statue" as any,
        },
      })
    ).toThrow("Item does not exist");
  });

  it("does not craft item if there is insufficient ingredients", () => {
    expect(() =>
      craftCollectible({
        state: {
          ...GAME_STATE,
          balance: new Decimal(10),
          inventory: {},
        },
        action: {
          type: "collectible.crafted",
          name: "Immortal Pear",
        },
      })
    ).toThrow("Insufficient ingredient: Gold");
  });

  it("crafts item with sufficient ingredients", () => {
    const state = craftCollectible({
      state: {
        ...GAME_STATE,
        balance: new Decimal(1),
        inventory: { Gold: new Decimal(100) },
      },
      action: {
        type: "collectible.crafted",
        name: "Immortal Pear",
      },
    });

    expect(state.inventory["Immortal Pear"]).toEqual(new Decimal(1));
    expect(state.inventory["Gold"]).toEqual(new Decimal(75));
  });

  it("does not craft an item that is not in stock", () => {
    expect(() =>
      craftCollectible({
        state: {
          ...GAME_STATE,
          stock: {
            "Immortal Pear": new Decimal(0),
          },
          balance: new Decimal(10),
        },
        action: {
          type: "collectible.crafted",
          name: "Immortal Pear",
        },
      })
    ).toThrow("Not enough stock");
  });

  it("increments Immortal Pear Crafted activity by 1 when 1 pear is crafted", () => {
    const state = craftCollectible({
      state: {
        ...GAME_STATE,
        balance: new Decimal(1),
        inventory: {
          Gold: new Decimal(100),
        },
      },
      action: {
        type: "collectible.crafted",
        name: "Immortal Pear",
      },
    });

    expect(state.bumpkin?.activity?.["Immortal Pear Crafted"]).toBe(1);
  });
});
