import Decimal from "decimal.js-light";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { INITIAL_FARM } from "features/game/lib/constants";
import { CROPS } from "features/game/types/crops";
import { GameState } from "features/game/types/game";
import { bulkFertilisePlot, getPlotsToFertilise } from "./bulkFertilisePlot";

const BASE_STATE: GameState = {
  ...INITIAL_FARM,
  balance: new Decimal(0),
  inventory: {
    "Sprout Mix": new Decimal(10),
  },
  bumpkin: TEST_BUMPKIN,
};

describe("bulkFertilisePlot", () => {
  const createdAt = Date.now();

  it("getPlotsToFertilise includes empty & growing plots, excludes ready/unplaced/fertilised", () => {
    const harvestMs = CROPS.Sunflower.harvestSeconds * 1000;

    const state: GameState = {
      ...BASE_STATE,
      crops: {
        // eligible: empty + placed
        "1": { x: 0, y: 0, createdAt: 0 },
        // eligible: growing + placed
        "2": {
          x: 1,
          y: 0,
          createdAt: 0,
          crop: { name: "Sunflower", plantedAt: createdAt - 1000 },
        },
        // excluded: ready to harvest
        "3": {
          x: 2,
          y: 0,
          createdAt: 0,
          crop: { name: "Sunflower", plantedAt: createdAt - harvestMs },
        },
        // excluded: unplaced
        "4": { createdAt: 0 },
        // excluded: already fertilised
        "5": {
          x: 3,
          y: 0,
          createdAt: 0,
          fertiliser: { name: "Sprout Mix", fertilisedAt: createdAt - 5000 },
        },
      },
    };

    const eligible = getPlotsToFertilise(state, createdAt).map(([id]) => id);
    expect(eligible.sort()).toEqual(["1", "2"]);
  });

  it("fertilises only eligible plots (skips ready to harvest) and decrements inventory", () => {
    const harvestMs = CROPS.Sunflower.harvestSeconds * 1000;

    const state: GameState = {
      ...BASE_STATE,
      inventory: { "Sprout Mix": new Decimal(2) },
      crops: {
        // eligible empty
        "1": { x: 0, y: 0, createdAt: 0 },
        // eligible growing
        "2": {
          x: 1,
          y: 0,
          createdAt: 0,
          crop: { name: "Sunflower", plantedAt: createdAt - 1000 },
        },
        // excluded ready
        "3": {
          x: 2,
          y: 0,
          createdAt: 0,
          crop: { name: "Sunflower", plantedAt: createdAt - harvestMs },
        },
      },
    };

    const newState = bulkFertilisePlot({
      state,
      createdAt,
      action: { type: "plots.bulkFertilised", fertiliser: "Sprout Mix" },
    });

    expect(newState.inventory["Sprout Mix"]).toEqual(new Decimal(0));
    expect(newState.crops["1"].fertiliser?.name).toEqual("Sprout Mix");
    expect(newState.crops["2"].fertiliser?.name).toEqual("Sprout Mix");
    expect(newState.crops["3"].fertiliser).toBeUndefined();
  });

  it("throws if there are no eligible plots to fertilise", () => {
    const harvestMs = CROPS.Sunflower.harvestSeconds * 1000;

    const state: GameState = {
      ...BASE_STATE,
      inventory: { "Sprout Mix": new Decimal(10) },
      crops: {
        // ready only -> not eligible
        "1": {
          x: 0,
          y: 0,
          createdAt: 0,
          crop: { name: "Sunflower", plantedAt: createdAt - harvestMs },
        },
      },
    };

    expect(() =>
      bulkFertilisePlot({
        state,
        createdAt,
        action: { type: "plots.bulkFertilised", fertiliser: "Sprout Mix" },
      }),
    ).toThrow("Not enough fertiliser to apply");
  });
});
