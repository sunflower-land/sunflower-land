import { TEST_FARM } from "features/game/lib/constants";
import { oilGreenhouse } from "./oilGreenHouse";
import Decimal from "decimal.js-light";

describe("greenhouse.oiled", () => {
  it("requires player has oil", () => {
    expect(() =>
      oilGreenhouse({
        state: TEST_FARM,
        action: {
          amount: 10,
          type: "greenhouse.oiled",
        },
      }),
    ).toThrow("Missing oil");
  });

  it("requires oil is valid amount", () => {
    expect(() =>
      oilGreenhouse({
        state: {
          ...TEST_FARM,
          inventory: {
            Oil: new Decimal(10),
          },
        },
        action: {
          amount: -2.2,
          type: "greenhouse.oiled",
        },
      }),
    ).toThrow("Incorrect amount");
  });

  it("requires greenhouse is not full", () => {
    expect(() =>
      oilGreenhouse({
        state: {
          ...TEST_FARM,
          inventory: {
            Oil: new Decimal(10),
          },
          greenhouse: {
            oil: 95,
            pots: {},
          },
        },
        action: {
          amount: 10,
          type: "greenhouse.oiled",
        },
      }),
    ).toThrow("Greenhouse is full");
  });

  it("applies oil", () => {
    const state = oilGreenhouse({
      state: {
        ...TEST_FARM,
        inventory: {
          Oil: new Decimal(15),
        },
        greenhouse: {
          oil: 15,
          pots: {},
        },
      },
      action: {
        amount: 10,
        type: "greenhouse.oiled",
      },
    });

    expect(state.inventory.Oil).toEqual(new Decimal(5));
    expect(state.greenhouse.oil).toEqual(25);
  });
});
