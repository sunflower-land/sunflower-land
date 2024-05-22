import Decimal from "decimal.js-light";
import { harvestCropMachine } from "./harvestCropMachine";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { CROP_MACHINE_PLOTS } from "./supplyCropMachine";

const GAME_STATE: GameState = { ...TEST_FARM, bumpkin: INITIAL_BUMPKIN };

describe("harvestCropMachine", () => {
  it("throws an error if there is no bumpkin", () => {
    expect(() =>
      harvestCropMachine({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
        },
        action: {
          type: "cropMachine.harvested",
        },
      })
    ).toThrow("Bumpkin does not exist");
  });

  it("throws an error if Crop Machine does not exist", () => {
    expect(() =>
      harvestCropMachine({
        state: GAME_STATE,
        action: {
          type: "cropMachine.harvested",
        },
      })
    ).toThrow("Crop Machine does not exist");
  });

  it("throws an error if queue is empty", () => {
    expect(() =>
      harvestCropMachine({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "1",
                readyAt: 123,
                unallocatedOilTime: 0,
                queue: [],
              },
            ],
          },
        },
        action: {
          type: "cropMachine.harvested",
        },
      })
    ).toThrow("Nothing in the queue");
  });

  it("throws an error if there are no crops to collect", () => {
    expect(() =>
      harvestCropMachine({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "1",
                readyAt: 123,
                unallocatedOilTime: 0,
                queue: [
                  {
                    amount: 10,
                    crop: "Sunflower",
                    growTimeRemaining: 100,
                    totalGrowTime: (60 * 10 * 1000) / CROP_MACHINE_PLOTS,
                    seeds: 10,
                  },
                ],
              },
            ],
          },
        },
        action: {
          type: "cropMachine.harvested",
        },
      })
    ).toThrow("There are no crops to collect");
  });

  it("adds the harvested crops to the player's inventory", () => {
    const dateNow = Date.now();
    const result = harvestCropMachine({
      state: {
        ...GAME_STATE,
        buildings: {
          "Crop Machine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 123,
              unallocatedOilTime: 0,
              queue: [
                {
                  amount: 10,
                  crop: "Sunflower",
                  growTimeRemaining: 0,
                  readyAt: dateNow - 1000,
                  totalGrowTime: (60 * 10 * 1000) / CROP_MACHINE_PLOTS,
                  seeds: 10,
                },
              ],
            },
          ],
        },
        inventory: {},
      },
      action: {
        type: "cropMachine.harvested",
      },
    });

    expect(result.inventory).toEqual({
      Sunflower: new Decimal(10),
    });
  });

  it("doesn't harvest seed packs that are not ready", () => {
    const dateNow = Date.now();
    const result = harvestCropMachine({
      state: {
        ...GAME_STATE,
        buildings: {
          "Crop Machine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 123,
              unallocatedOilTime: 0,
              queue: [
                {
                  amount: 10,
                  crop: "Sunflower",
                  growTimeRemaining: 0,
                  readyAt: dateNow - 1000,
                  totalGrowTime: (60 * 10 * 1000) / CROP_MACHINE_PLOTS,
                  seeds: 10,
                },
                {
                  amount: 10,
                  crop: "Sunflower",
                  growTimeRemaining: 200,
                  totalGrowTime: (60 * 10 * 1000) / CROP_MACHINE_PLOTS,
                  seeds: 10,
                },
              ],
            },
          ],
        },
        inventory: {},
      },
      action: {
        type: "cropMachine.harvested",
      },
    });

    expect(result.inventory).toEqual({
      Sunflower: new Decimal(10),
    });
    expect(result.buildings["Crop Machine"]?.[0].queue).toEqual([
      {
        amount: 10,
        crop: "Sunflower",
        growTimeRemaining: 200,
        totalGrowTime: (60 * 10 * 1000) / CROP_MACHINE_PLOTS,
        seeds: 10,
      },
    ]);
  });

  it("adds bumpkin activity for all harvested crops", () => {
    const dateNow = Date.now();
    const state = harvestCropMachine({
      state: {
        ...GAME_STATE,
        buildings: {
          "Crop Machine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 123,
              unallocatedOilTime: 0,
              queue: [
                {
                  amount: 10,
                  crop: "Sunflower",
                  growTimeRemaining: 0,
                  readyAt: dateNow - 1000,
                  totalGrowTime: (60 * 10 * 1000) / CROP_MACHINE_PLOTS,
                  seeds: 10,
                },
                {
                  amount: 10,
                  crop: "Sunflower",
                  growTimeRemaining: 0,
                  readyAt: dateNow - 2000,
                  totalGrowTime: (60 * 10 * 1000) / CROP_MACHINE_PLOTS,
                  seeds: 10,
                },
              ],
            },
          ],
        },
        inventory: {},
      },
      action: {
        type: "cropMachine.harvested",
      },
    });

    expect(state.bumpkin?.activity?.["Sunflower Harvested"]).toEqual(20);
  });
});
