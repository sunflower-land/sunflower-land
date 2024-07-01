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
          packIndex: 0,
        },
      }),
    ).toThrow("Bumpkin does not exist");
  });

  it("throws an error if Crop Machine does not exist", () => {
    expect(() =>
      harvestCropMachine({
        state: GAME_STATE,
        action: {
          type: "cropMachine.harvested",
          packIndex: 0,
        },
      }),
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
          packIndex: 0,
        },
      }),
    ).toThrow("Nothing in the queue");
  });

  it("throws and error if there is no pack at the index", () => {
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
                    growTimeRemaining: 0,
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
          packIndex: 1,
        },
      }),
    ).toThrow("Pack does not exist");
  });

  it("throws an error if the pack is not ready", () => {
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
          packIndex: 0,
        },
      }),
    ).toThrow("The pack is not ready yet");
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
        packIndex: 0,
      },
    });

    expect(result.inventory).toEqual({
      Sunflower: new Decimal(10),
    });
  });

  it("removes the harvested seed pack from the queue", () => {
    const packIndex = 0;
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
        packIndex,
      },
    });

    expect(
      result.buildings["Crop Machine"]?.[0].queue?.[packIndex],
    ).toBeUndefined();
  });

  it("adds bumpkin activity for harvested crops", () => {
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
        packIndex: 0,
      },
    });

    expect(state.bumpkin?.activity?.["Sunflower Harvested"]).toEqual(10);
  });
});
