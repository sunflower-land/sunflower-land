import { INITIAL_FARM } from "features/game/lib/constants";

import Decimal from "decimal.js-light";
import { catchMarvel } from "./catchMarvel";

const farm = { ...INITIAL_FARM };

describe("catchMarvel", () => {
  it("requires player has not already caught the Marvel", () => {
    expect(() =>
      catchMarvel({
        action: { type: "marvel.caught", name: "Starlight Tuna" },
        state: {
          ...farm,
          farmActivity: {
            "Starlight Tuna Map Piece Found": 9,
            "Starlight Tuna Caught": 1,
          },
        },
      }),
    ).toThrow("Player has already caught the Marvel");
  });

  it("requries player has the map pieces", () => {
    expect(() =>
      catchMarvel({
        action: { type: "marvel.caught", name: "Starlight Tuna" },
        state: {
          ...farm,
          farmActivity: {
            "Starlight Tuna Map Piece Found": 8,
          },
        },
      }),
    ).toThrow("Player does not have the map pieces");
  });

  it("catches the marvel", () => {
    const state = catchMarvel({
      action: { type: "marvel.caught", name: "Starlight Tuna" },
      state: {
        ...farm,
        farmActivity: {
          "Starlight Tuna Map Piece Found": 9,
        },
      },
    });

    expect(state.inventory["Starlight Tuna"]).toEqual(new Decimal(1));
    expect(state.farmActivity["Starlight Tuna Caught"]).toEqual(1);
  });
});
