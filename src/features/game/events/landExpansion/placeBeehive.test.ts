import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { placeBeehive } from "./placeBeehive";

describe("placeBeehive", () => {
  it("throws an error if no beehives are available to be placed", () => {
    expect(() =>
      placeBeehive({
        state: {
          ...TEST_FARM,
          inventory: {
            Beehive: new Decimal(0),
          },
        },
        action: {
          id: "1234",
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "beehive.placed",
        },
      })
    ).toThrow("You do not have any available beehives");
  });

  it("places a beehive", () => {
    const state = placeBeehive({
      state: {
        ...TEST_FARM,
        inventory: {
          Beehive: new Decimal(1),
        },
      },
      action: {
        id: "1234",
        coordinates: {
          x: 2,
          y: 2,
        },
        type: "beehive.placed",
      },
    });

    expect(state.beehives?.["1234"]).toBeDefined();
    expect(state.beehives?.["1234"].x).toEqual(2);
    expect(state.beehives?.["1234"].y).toEqual(2);
  });
});
