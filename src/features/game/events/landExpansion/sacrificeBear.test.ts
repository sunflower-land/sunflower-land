import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { sacrificeBear } from "./sacrificeBear";

const GAME_STATE: GameState = TEST_FARM;

describe("sacrificeBear", () => {
  it("throws an error if player does not provide 10 bears", () => {
    expect(() =>
      sacrificeBear({
        state: GAME_STATE,
        action: {
          type: "bear.sacrificed",
          bears: ["Basic Bear", "Chef Bear"],
        },
      }),
    ).toThrow("Must sacrifice exactly 10 bears");
  });

  it("throws an error if bears are not unique", () => {
    expect(() =>
      sacrificeBear({
        state: GAME_STATE,
        action: {
          type: "bear.sacrificed",
          bears: [
            "Basic Bear",
            "Basic Bear",
            "Chef Bear",
            "Construction Bear",
            "Angel Bear",
            "Badass Bear",
            "Brilliant Bear",
            "Classy Bear",
            "Farmer Bear",
            "Sunflower Bear",
          ],
        },
      }),
    ).toThrow("All bears must be unique");
  });

  it("throws an error if player does not own the bears", () => {
    expect(() =>
      sacrificeBear({
        state: {
          ...GAME_STATE,
          inventory: {
            "Basic Bear": new Decimal(1),
          },
        },
        action: {
          type: "bear.sacrificed",
          bears: [
            "Basic Bear",
            "Chef Bear",
            "Construction Bear",
            "Angel Bear",
            "Badass Bear",
            "Brilliant Bear",
            "Classy Bear",
            "Farmer Bear",
            "Sunflower Bear",
            "Rich Bear",
          ],
        },
      }),
    ).toThrow("You do not have any Chef Bear bears");
  });

  it("burns the bears and mints a new King Bear", () => {
    const state = sacrificeBear({
      state: {
        ...GAME_STATE,
        inventory: {
          "Basic Bear": new Decimal(1),
          "Chef Bear": new Decimal(1),
          "Construction Bear": new Decimal(1),
          "Angel Bear": new Decimal(1),
          "Badass Bear": new Decimal(1),
          "Brilliant Bear": new Decimal(1),
          "Classy Bear": new Decimal(1),
          "Farmer Bear": new Decimal(1),
          "Sunflower Bear": new Decimal(1),
          "Rich Bear": new Decimal(1),
        },
      },
      action: {
        type: "bear.sacrificed",
        bears: [
          "Basic Bear",
          "Chef Bear",
          "Construction Bear",
          "Angel Bear",
          "Badass Bear",
          "Brilliant Bear",
          "Classy Bear",
          "Farmer Bear",
          "Sunflower Bear",
          "Rich Bear",
        ],
      },
    });

    // Check bears were burned
    expect(state.inventory["King of Bears"]).toEqual(new Decimal(1)); // 0 + 1 from minting
    expect(state.inventory["Chef Bear"]).toEqual(new Decimal(0));
    expect(state.inventory["Construction Bear"]).toEqual(new Decimal(0));
    expect(state.inventory["Angel Bear"]).toEqual(new Decimal(0));
    expect(state.inventory["Badass Bear"]).toEqual(new Decimal(0));
    expect(state.inventory["Brilliant Bear"]).toEqual(new Decimal(0));
    expect(state.inventory["Classy Bear"]).toEqual(new Decimal(0));
    expect(state.inventory["Farmer Bear"]).toEqual(new Decimal(0));
    expect(state.inventory["Sunflower Bear"]).toEqual(new Decimal(0));
    expect(state.inventory["Rich Bear"]).toEqual(new Decimal(0));
  });
});
