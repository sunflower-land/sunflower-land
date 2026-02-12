import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import {
  CROP_MACHINE_PLOTS,
  getOilTimeInMillis,
  OIL_PER_HOUR_CONSUMPTION,
} from "./supplyCropMachine";
import { supplyCropMachineOil } from "./supplyCropMachineOil";
import Decimal from "decimal.js-light";
import { CropMachineQueueItem, GameState } from "features/game/types/game";

const GAME_STATE: GameState = { ...TEST_FARM, bumpkin: INITIAL_BUMPKIN };

describe("supplyCropMachineOil", () => {
  it("throws an error if Crop Machine does not exist", () => {
    expect(() =>
      supplyCropMachineOil({
        state: GAME_STATE,
        action: {
          type: "cropMachine.oilSupplied",
          oil: 1,
        },
      }),
    ).toThrow("Crop Machine does not exist");
  });

  it("throws an error if Crop Machine is not placed", () => {
    expect(() =>
      supplyCropMachineOil({
        state: {
          ...GAME_STATE,
          inventory: { Oil: new Decimal(1) },
          buildings: {
            "Crop Machine": [
              {
                coordinates: undefined,
                createdAt: 0,
                id: "1",
                readyAt: 123,
                unallocatedOilTime: 0,
              },
            ],
          },
        },
        action: {
          type: "cropMachine.oilSupplied",
          oil: 1,
        },
      }),
    ).toThrow("Crop Machine does not exist");
  });

  it("throws an error if oil amount is zero or negative", () => {
    expect(() =>
      supplyCropMachineOil({
        state: {
          ...GAME_STATE,
          inventory: { Oil: new Decimal(10) },
          buildings: {
            "Crop Machine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "1",
                readyAt: 123,
                unallocatedOilTime: 0,
              },
            ],
          },
        },
        action: {
          type: "cropMachine.oilSupplied",
          oil: 0,
        },
      }),
    ).toThrow("Invalid amount supplied");
  });

  it("throws an error if missing oil in inventory", () => {
    expect(() =>
      supplyCropMachineOil({
        state: {
          ...GAME_STATE,
          inventory: { Oil: new Decimal(0) },
          buildings: {
            "Crop Machine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "1",
                readyAt: 123,
                unallocatedOilTime: 0,
              },
            ],
          },
        },
        action: {
          type: "cropMachine.oilSupplied",
          oil: 1,
        },
      }),
    ).toThrow("Missing requirements");
  });

  it("throws an error if oil capacity exceeded (empty machine)", () => {
    const hoursOverCapacity = 49;
    const oilNeeded = Math.ceil(
      (hoursOverCapacity * 60 * 60 * 1000) / getOilTimeInMillis(1, GAME_STATE),
    );
    expect(() =>
      supplyCropMachineOil({
        state: {
          ...GAME_STATE,
          inventory: { Oil: new Decimal(oilNeeded + 10) },
          buildings: {
            "Crop Machine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "1",
                readyAt: 123,
                unallocatedOilTime: 0,
              },
            ],
          },
        },
        action: {
          type: "cropMachine.oilSupplied",
          oil: oilNeeded,
        },
      }),
    ).toThrow("Oil capacity exceeded");
  });

  it("removes oil from inventory", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: { Oil: new Decimal(5) },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            id: "1",
            readyAt: 123,
            unallocatedOilTime: 0,
          },
        ],
      },
    };
    const result = supplyCropMachineOil({
      state,
      action: { type: "cropMachine.oilSupplied", oil: 3 },
    });
    expect(result.inventory["Oil"]?.toNumber()).toBe(2);
  });

  it("adds oil to Crop Machine", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Oil: new Decimal(10),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            unallocatedOilTime: 0,
          },
        ],
      },
    };

    const newState = supplyCropMachineOil({
      state,
      action: {
        type: "cropMachine.oilSupplied",
        oil: 10,
      },
    });

    const oilTime = 10 / OIL_PER_HOUR_CONSUMPTION(GAME_STATE);
    const oilTimeRemaining = oilTime * 60 * 60 * 1000;

    expect(
      newState.buildings["Crop Machine"]?.[0].unallocatedOilTime,
    ).toBeCloseTo(oilTimeRemaining);
  });

  it("adding oil never checks queue size (machine has 8 packs from reset)", () => {
    const sunflowerPackGrowTime =
      (60 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const eightPacks: CropMachineQueueItem[] = Array(8).fill({
      crop: "Sunflower",
      totalGrowTime: sunflowerPackGrowTime,
      growTimeRemaining: 0,
      startTime: Date.now(),
      readyAt: Date.now() + sunflowerPackGrowTime,
      seeds: 100,
    });

    const state: GameState = {
      ...GAME_STATE,
      inventory: { Oil: new Decimal(2) },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: Date.now(),
            id: "1",
            unallocatedOilTime: 0,
            queue: eightPacks,
          },
        ],
      },
    };

    const result = supplyCropMachineOil({
      state,
      action: { type: "cropMachine.oilSupplied", oil: 1 },
    });

    expect(result.buildings["Crop Machine"]?.[0]?.unallocatedOilTime).toBe(
      getOilTimeInMillis(1, GAME_STATE),
    );
    expect(result.inventory["Oil"]?.toNumber()).toBe(1);
  });
});
