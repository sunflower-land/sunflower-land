import Decimal from "decimal.js-light";
import { harvestCropMachine } from "./harvestCropMachine";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";

const GAME_STATE: GameState = { ...TEST_FARM, bumpkin: INITIAL_BUMPKIN };

describe("harvestCropMachine", () => {
  const dateNow = Date.now();

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
                oilTimeRemaining: 0,
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
                oilTimeRemaining: 0,
                queue: [
                  {
                    amount: 10,
                    crop: "Sunflower",
                    growTimeRemaining: 100,
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
              oilTimeRemaining: 0,
              queue: [
                {
                  amount: 10,
                  crop: "Sunflower",
                  growTimeRemaining: 0,
                  readyAt: dateNow - 1000,
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
              oilTimeRemaining: 0,
              queue: [
                {
                  amount: 10,
                  crop: "Sunflower",
                  growTimeRemaining: 0,
                  readyAt: dateNow - 1000,
                },
                {
                  amount: 10,
                  crop: "Sunflower",
                  growTimeRemaining: 200,
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
      },
    ]);
  });
});
