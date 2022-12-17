import Decimal from "decimal.js-light";
import { TEST_FARM } from "../lib/constants";
import { WarSide, pickSide } from "./pickSide";

describe("pickSide", () => {
  it("cannot pick a side if they have already chosen a side", () => {
    expect(() => {
      pickSide({
        state: {
          ...TEST_FARM,
          inventory: { "Goblin War Banner": new Decimal(1) },
        },
        action: { type: "side.picked", side: WarSide.Human },
      });
    }).toThrow("You have already picked a side");

    expect(() => {
      pickSide({
        state: {
          ...TEST_FARM,
          inventory: { "Human War Banner": new Decimal(1) },
        },
        action: { type: "side.picked", side: WarSide.Goblin },
      });
    }).toThrow("You have already picked a side");
  });

  it("can pick the human side", () => {
    const state = pickSide({
      state: {
        ...TEST_FARM,
        inventory: {},
      },
      action: { type: "side.picked", side: WarSide.Human },
    });

    expect(state.inventory).toEqual({
      "Human War Banner": new Decimal(1),
    });

    expect(state.inventory).not.toEqual({
      "Goblin War Banner": new Decimal(1),
    });
  });

  it("can pick the goblin side", () => {
    const state = pickSide({
      state: {
        ...TEST_FARM,
        inventory: {},
      },
      action: { type: "side.picked", side: WarSide.Goblin },
    });

    expect(state.inventory).toEqual({
      "Goblin War Banner": new Decimal(1),
    });

    expect(state.inventory).not.toEqual({
      "Human War Banner": new Decimal(1),
    });
  });
});
