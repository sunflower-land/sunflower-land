import Decimal from "decimal.js-light";
import { TEST_FARM } from "../lib/constants";
import { fertiliseCrop } from "./fertiliseCrop";

describe("fertiliseCrop", () => {
  it("does not fertilise an empty field", () => {
    expect(() =>
      fertiliseCrop({
        state: {
          ...TEST_FARM,
          fields: {},
        },
        action: {
          fieldIndex: 3,
          type: "item.fertilised",
          fertiliser: "Rapid Growth",
        },
      })
    ).toThrow("Cannot fertilise an empty field");
  });

  it("does not fertilise a crop that is ready", () => {
    expect(() =>
      fertiliseCrop({
        state: {
          ...TEST_FARM,
          fields: {
            3: {
              name: "Sunflower",
              plantedAt: Date.now() - 120 * 1000,
            },
          },
        },
        action: {
          fieldIndex: 3,
          type: "item.fertilised",
          fertiliser: "Rapid Growth",
        },
      })
    ).toThrow("Crop is already grown");
  });

  it("does not fertilise a crop that is already fertilised", () => {
    expect(() =>
      fertiliseCrop({
        state: {
          ...TEST_FARM,
          fields: {
            3: {
              name: "Sunflower",
              plantedAt: Date.now() - 30 * 1000,
              fertilisers: [
                {
                  name: "Rapid Growth",
                  fertilisedAt: Date.now(),
                },
              ],
            },
          },
        },
        action: {
          fieldIndex: 3,
          type: "item.fertilised",
          fertiliser: "Rapid Growth",
        },
      })
    ).toThrow("Crop is already fertilised");
  });

  it("requires player has enough fertiliser", () => {
    expect(() =>
      fertiliseCrop({
        state: {
          ...TEST_FARM,
          inventory: {
            "Rapid Growth": new Decimal(0),
          },
          fields: {
            3: {
              name: "Sunflower",
              plantedAt: Date.now() - 30 * 1000,
            },
          },
        },
        action: {
          fieldIndex: 3,
          type: "item.fertilised",
          fertiliser: "Rapid Growth",
        },
      })
    ).toThrow("Not enough fertiliser");
  });

  it("fertilises a crop with Rapid Growth", () => {
    const sunflowerPlantedAt = Date.now() - 30 * 1000;
    const fertilisedAt = Date.now();

    const gameState = fertiliseCrop({
      state: {
        ...TEST_FARM,
        inventory: {
          "Rapid Growth": new Decimal(1),
        },
        fields: {
          3: {
            name: "Sunflower",
            plantedAt: sunflowerPlantedAt,
          },
        },
      },
      action: {
        fieldIndex: 3,
        type: "item.fertilised",
        fertiliser: "Rapid Growth",
      },
      createdAt: fertilisedAt,
    });

    expect(gameState.fields[3]).toEqual({
      name: "Sunflower",
      plantedAt: sunflowerPlantedAt - 30 * 1000,
      fertilisers: [
        {
          name: "Rapid Growth",
          fertilisedAt,
        },
      ],
    });
  });

  it("uses the fertiliser", () => {
    const gameState = fertiliseCrop({
      state: {
        ...TEST_FARM,
        inventory: {
          "Rapid Growth": new Decimal(5),
        },
        fields: {
          3: {
            name: "Sunflower",
            plantedAt: Date.now() - 30 * 1000,
          },
        },
      },
      action: {
        fieldIndex: 3,
        type: "item.fertilised",
        fertiliser: "Rapid Growth",
      },
    });

    expect(gameState.inventory["Rapid Growth"]).toEqual(new Decimal(4));
  });
});
