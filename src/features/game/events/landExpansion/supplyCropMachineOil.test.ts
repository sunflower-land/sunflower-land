import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import {
  CROP_MACHINE_PLOTS,
  getOilTimeInMillis,
  OIL_PER_HOUR_CONSUMPTION,
} from "./supplyCropMachine";
import {
  getTotalOilMillisInMachine,
  supplyCropMachineOil,
} from "./supplyCropMachineOil";
import Decimal from "decimal.js-light";
import {
  CropMachineBuilding,
  CropMachineQueueItem,
  GameState,
} from "features/game/types/game";

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

  describe("getTotalOilMillisInMachine", () => {
    it("returns all the unallocated oil if there are no packs in the queue", () => {
      const oneHour = 60 * 60 * 1000;
      const now = Date.now();
      const state: GameState = {
        ...GAME_STATE,
        buildings: {
          "Crop Machine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              unallocatedOilTime: oneHour,
              id: "0",
              queue: [],
            },
          ],
        },
      };

      const machine = state.buildings[
        "Crop Machine"
      ]?.[0] as CropMachineBuilding;
      const queue = machine.queue as CropMachineQueueItem[];
      const unallocatedOilTime = machine.unallocatedOilTime ?? 0;

      const result = getTotalOilMillisInMachine(queue, unallocatedOilTime, now);
      expect(result).toBe(oneHour);
    });

    it("returns the allocated oil for one pack in the queue starts now when there is no unallocated oil", () => {
      const now = Date.now();
      const sunflowerPackGrowTime =
        (60 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
      const state: GameState = {
        ...GAME_STATE,
        buildings: {
          "Crop Machine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: now,
              readyAt: now + sunflowerPackGrowTime,
              unallocatedOilTime: 0,
              id: "0",
              queue: [
                {
                  crop: "Sunflower",
                  totalGrowTime: sunflowerPackGrowTime,
                  growTimeRemaining: 0,
                  startTime: now,
                  readyAt: now + sunflowerPackGrowTime,
                  seeds: 100,
                },
              ],
            },
          ],
        },
      };

      const machine = state.buildings[
        "Crop Machine"
      ]?.[0] as CropMachineBuilding;
      const queue = machine.queue as CropMachineQueueItem[];
      const unallocatedOilTime = machine.unallocatedOilTime ?? 0;

      const result = getTotalOilMillisInMachine(queue, unallocatedOilTime, now);
      expect(result).toBe(sunflowerPackGrowTime);
    });

    it("does not return the allocated oil for a pack that has reached its readyAt time", () => {
      const now = Date.now();
      const sunflowerPackGrowTime =
        (60 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
      const state: GameState = {
        ...GAME_STATE,
        buildings: {
          "Crop Machine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: now,
              readyAt: now + sunflowerPackGrowTime,
              unallocatedOilTime: 0,
              id: "0",
              queue: [
                {
                  crop: "Sunflower",
                  totalGrowTime: sunflowerPackGrowTime,
                  growTimeRemaining: 0,
                  startTime: now - sunflowerPackGrowTime,
                  readyAt: now,
                  seeds: 100,
                },
              ],
            },
          ],
        },
      };

      const machine = state.buildings[
        "Crop Machine"
      ]?.[0] as CropMachineBuilding;
      const queue = machine.queue as CropMachineQueueItem[];
      const unallocatedOilTime = machine.unallocatedOilTime ?? 0;

      const result = getTotalOilMillisInMachine(queue, unallocatedOilTime, now);
      expect(result).toBe(0);
    });

    it("does not return the allocated oil for a pack that has reached its readyAt time", () => {
      const now = Date.now();
      const sunflowerPackGrowTime =
        (60 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
      const state: GameState = {
        ...GAME_STATE,
        buildings: {
          "Crop Machine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: now,
              readyAt: now + sunflowerPackGrowTime,
              unallocatedOilTime: 0,
              id: "0",
              queue: [
                {
                  crop: "Sunflower",
                  totalGrowTime: sunflowerPackGrowTime,
                  growTimeRemaining: 0,
                  startTime: now - sunflowerPackGrowTime,
                  readyAt: now,
                  seeds: 100,
                },
              ],
            },
          ],
        },
      };

      const machine = state.buildings[
        "Crop Machine"
      ]?.[0] as CropMachineBuilding;
      const queue = machine.queue as CropMachineQueueItem[];
      const unallocatedOilTime = machine.unallocatedOilTime ?? 0;

      const result = getTotalOilMillisInMachine(queue, unallocatedOilTime, now);
      expect(result).toBe(0);
    });

    it("does not return the allocated oil for a pack that has passed its grownUntil time", () => {
      const now = Date.now();
      const packGrowTime = 60 * 60 * 1000; // 1 hour
      const oneHourAgo = now - 60 * 60 * 1000;
      const packGrowsUntil = packGrowTime / 2;

      const state: GameState = {
        ...GAME_STATE,
        buildings: {
          "Crop Machine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              unallocatedOilTime: 0,
              id: "0",
              queue: [
                {
                  crop: "Sunflower",
                  totalGrowTime: packGrowTime,
                  growTimeRemaining: packGrowTime / 2,
                  startTime: oneHourAgo,
                  growsUntil: packGrowsUntil,
                  seeds: 100,
                },
              ],
            },
          ],
        },
      };

      const machine = state.buildings[
        "Crop Machine"
      ]?.[0] as CropMachineBuilding;
      const queue = machine.queue as CropMachineQueueItem[];
      const unallocatedOilTime = machine.unallocatedOilTime ?? 0;

      const result = getTotalOilMillisInMachine(queue, unallocatedOilTime, now);
      expect(result).toBe(0);
    });

    it("returns the unallocated oil and the allocated oil for a pack that is still growing", () => {
      const now = Date.now();
      const packGrowTime = 60 * 60 * 1000; // 1 hour
      const oneHourAgo = now - 60 * 60 * 1000;

      const state: GameState = {
        ...GAME_STATE,
        buildings: {
          "Crop Machine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              unallocatedOilTime: 1000,
              id: "0",
              queue: [
                {
                  crop: "Sunflower",
                  totalGrowTime: packGrowTime,
                  growTimeRemaining: 0,
                  startTime: oneHourAgo,
                  readyAt: oneHourAgo + packGrowTime,
                  seeds: 100,
                },
                {
                  crop: "Sunflower",
                  totalGrowTime: packGrowTime,
                  growTimeRemaining: 0,
                  startTime: now,
                  readyAt: now + packGrowTime,
                  seeds: 100,
                },
              ],
            },
          ],
        },
      };

      const machine = state.buildings[
        "Crop Machine"
      ]?.[0] as CropMachineBuilding;
      const queue = machine.queue as CropMachineQueueItem[];
      const unallocatedOilTime = machine.unallocatedOilTime ?? 0;

      const result = getTotalOilMillisInMachine(queue, unallocatedOilTime, now);
      expect(result).toBe(packGrowTime + 1000);
    });
  });
});
