import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import {
  CROP_MACHINE_PLOTS,
  OIL_PER_HOUR_CONSUMPTION,
  calculateCropTime,
  getOilTimeInMillis,
  getTotalOilMillisInMachine,
  supplyCropMachine,
} from "./supplyCropMachine";
import Decimal from "decimal.js-light";
import {
  CropMachineBuilding,
  CropMachineQueueItem,
  GameState,
} from "features/game/types/game";

const GAME_STATE: GameState = { ...TEST_FARM, bumpkin: INITIAL_BUMPKIN };

describe("supplyCropMachine", () => {
  it("throws an error if Crop Machine does not exist", () => {
    expect(() =>
      supplyCropMachine({
        state: GAME_STATE,
        action: {
          type: "cropMachine.supplied",
          seeds: { type: "Sunflower Seed", amount: 10 },
        },
      })
    ).toThrow("Crop Machine does not exist");
  });

  it("throws an error if the user does not have the requirements", () => {
    expect(() =>
      supplyCropMachine({
        state: {
          ...GAME_STATE,
          inventory: {
            "Sunflower Seed": new Decimal(0),
          },
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
          type: "cropMachine.supplied",
          seeds: { type: "Sunflower Seed", amount: 10 },
        },
      })
    ).toThrow("Missing requirements");
  });

  it("throws an error if a negative amount is passed into the action", () => {
    expect(() =>
      supplyCropMachine({
        state: {
          ...GAME_STATE,
          inventory: {
            "Sunflower Seed": new Decimal(10),
          },
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
          type: "cropMachine.supplied",
          seeds: { type: "Sunflower Seed", amount: -10 },
        },
      })
    ).toThrow("Invalid amount supplied");
  });

  it("throws an error if you don't have enough oil", () => {
    expect(() =>
      supplyCropMachine({
        state: {
          ...GAME_STATE,
          inventory: {
            "Sunflower Seed": new Decimal(10),
          },
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
          type: "cropMachine.supplied",
          oil: 10,
        },
      })
    ).toThrow("Missing requirements");
  });

  it("throws an error if the seed is not a basic crop seed", () => {
    expect(() =>
      supplyCropMachine({
        state: {
          ...GAME_STATE,
          inventory: {
            "Radish Seed": new Decimal(10),
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
        },
        action: {
          type: "cropMachine.supplied",
          seeds: { type: "Radish Seed", amount: 10 },
        },
      })
    ).toThrow("You can only supply basic crop seeds!");
  });

  it("throws an error if the oil capacity is exceeded with an empty queue", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Oil: new Decimal(100),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            unallocatedOilTime: 0,
            queue: [],
          },
        ],
      },
    };

    expect(() =>
      supplyCropMachine({
        state,
        action: {
          type: "cropMachine.supplied",
          oil: 49,
        },
      })
    ).toThrow("Oil capacity exceeded");
  });

  it("throws and error if the oil capacity is exceeded with queue items", () => {
    const sunflowerPackGrowTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS;

    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Oil: new Decimal(100),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            unallocatedOilTime: 0,
            queue: [
              {
                crop: "Sunflower",
                amount: 100,
                totalGrowTime: sunflowerPackGrowTime,
                growTimeRemaining: 0,
                startTime: Date.now(),
                readyAt: Date.now() + sunflowerPackGrowTime,
                seeds: 100,
              },
            ],
          },
        ],
      },
    };

    expect(() =>
      supplyCropMachine({
        state,
        action: {
          type: "cropMachine.supplied",
          oil: 48,
        },
      })
    ).toThrow("Oil capacity exceeded");
  });

  it("removes ingredients from inventory", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Sunflower Seed": new Decimal(5),
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

    const newState = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        seeds: { type: "Sunflower Seed", amount: 5 },
      },
    });

    expect(newState.inventory["Sunflower Seed"]).toStrictEqual(new Decimal(0));
  });

  it("adds seeds to Crop Machine queue", () => {
    const now = Date.now();
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Sunflower Seed": new Decimal(5),
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

    const newState = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        seeds: { type: "Sunflower Seed", amount: 5 },
      },
      createdAt: now,
    });

    const sunflowerTime = (60 * 1000 * 5) / CROP_MACHINE_PLOTS;

    const pack = newState.buildings["Crop Machine"]?.[0]
      .queue?.[0] as CropMachineQueueItem;

    expect(newState.buildings["Crop Machine"]?.[0].queue).toStrictEqual([
      {
        crop: "Sunflower",
        amount: 5,
        growTimeRemaining: sunflowerTime,
        totalGrowTime: sunflowerTime,
        seeds: 5,
      },
    ]);
  });

  it("adds multiple seeds packs to Crop Machine queue", () => {
    const now = Date.now();
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Sunflower Seed": new Decimal(5),
        "Potato Seed": new Decimal(5),
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

    const newState = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        seeds: { type: "Sunflower Seed", amount: 5 },
      },
    });

    const result = supplyCropMachine({
      state: newState,
      action: {
        type: "cropMachine.supplied",
        seeds: { type: "Potato Seed", amount: 5 },
      },
      createdAt: now + 1000,
    });

    const sunflowerTime = (60 * 1000 * 5) / CROP_MACHINE_PLOTS;
    const potatoTime = (60 * 5 * 1000 * 5) / CROP_MACHINE_PLOTS;
    expect(result.buildings["Crop Machine"]?.[0].queue).toStrictEqual([
      {
        crop: "Sunflower",
        amount: 5,
        growTimeRemaining: sunflowerTime, // 5 plots,
        totalGrowTime: sunflowerTime,
        seeds: 5,
      },
      {
        crop: "Potato",
        amount: 5,
        growTimeRemaining: potatoTime,
        totalGrowTime: potatoTime,
        seeds: 5,
      },
    ]);
  });

  it("throws an error when there are already 5 items in queue", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Sunflower Seed": new Decimal(10),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            unallocatedOilTime: 500,
            queue: [
              {
                crop: "Sunflower",
                amount: 5,
                readyAt: 34567,
                growTimeRemaining: 0,
                totalGrowTime: 0,
                seeds: 5,
              },
              {
                crop: "Sunflower",
                amount: 5000,
                readyAt: 34567,
                growTimeRemaining: 0,
                totalGrowTime: 0,
                seeds: 5000,
              },
              {
                crop: "Sunflower",
                amount: 5,
                seeds: 5,
                readyAt: 34567,
                growTimeRemaining: 0,
                totalGrowTime: 0,
              },
              {
                crop: "Sunflower",
                amount: 5,
                seeds: 5,
                readyAt: 34567,
                growTimeRemaining: 0,
                totalGrowTime: 0,
              },
              {
                crop: "Sunflower",
                amount: 5,
                seeds: 5,
                readyAt: 34567,
                growTimeRemaining: 0,
                totalGrowTime: 0,
              },
            ],
          },
        ],
      },
    };

    expect(() =>
      supplyCropMachine({
        state,
        action: {
          type: "cropMachine.supplied",
          seeds: { type: "Sunflower Seed", amount: 10 },
        },
      })
    ).toThrow("Queue is full");
  });

  it("removes oil from inventory", () => {
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

    const newState = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        oil: 10,
      },
    });

    expect(newState.inventory["Oil"]).toStrictEqual(new Decimal(0));
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

    const newState = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        oil: 10,
      },
    });

    const oilTime = 10 / OIL_PER_HOUR_CONSUMPTION;
    const oilTimeRemaining = oilTime * 60 * 60 * 1000;

    expect(
      newState.buildings["Crop Machine"]?.[0].unallocatedOilTime
    ).toBeCloseTo(oilTimeRemaining);
  });

  it("recalculates one item in queue when supplying oil", () => {
    const sunflowerPackGrowTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS;

    const now = Date.now();
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Potato Seed": new Decimal(50),
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
            queue: [
              {
                crop: "Sunflower",
                amount: 100,
                growTimeRemaining: sunflowerPackGrowTime,
                totalGrowTime: sunflowerPackGrowTime,
                seeds: 100,
              },
            ],
          },
        ],
      },
    };

    const result = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        oil: 10,
      },
    });

    const sunflowerTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS; // 5 plots;
    const oilTimeRemain = (10 / OIL_PER_HOUR_CONSUMPTION) * 60 * 60 * 1000;
    const pack = result.buildings["Crop Machine"]?.[0]
      .queue?.[0] as CropMachineQueueItem;
    expect(pack.growTimeRemaining).toBe(0);
    expect(pack.readyAt).toBeCloseTo(now + sunflowerTime);
    expect(
      result.buildings["Crop Machine"]?.[0].unallocatedOilTime
    ).toBeCloseTo(oilTimeRemain - sunflowerTime);
  });

  it("recalculates multiple items in queue when supplying oil", () => {
    //  100 Sunflower Seed Pack takes 20 minutes to grow
    const sunflowerPackGrowTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS;
    // 100 Potato Seed Pack takes 100 minutes to grow
    const potatoPackGrowTime = (60 * 5 * 100 * 1000) / CROP_MACHINE_PLOTS;

    const now = Date.now();
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Potato Seed": new Decimal(50),
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
            queue: [
              {
                crop: "Sunflower",
                amount: 100,
                growTimeRemaining: sunflowerPackGrowTime,
                totalGrowTime: sunflowerPackGrowTime,
                seeds: 100,
              },
              {
                crop: "Potato",
                amount: 100,
                growTimeRemaining: potatoPackGrowTime,
                totalGrowTime: potatoPackGrowTime,
                seeds: 100,
              },
            ],
          },
        ],
      },
    };

    const oil = 10;

    const result = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        oil,
      },
    });

    // 600 minutes of oil remaining
    const oilTimeRemaining = (oil / OIL_PER_HOUR_CONSUMPTION) * 60 * 60 * 1000;

    const item1ReadyAt = now + sunflowerPackGrowTime;
    const item2ReadyAt = item1ReadyAt + potatoPackGrowTime;

    const packOne = result.buildings["Crop Machine"]?.[0]
      .queue?.[0] as CropMachineQueueItem;
    const packTwo = result.buildings["Crop Machine"]?.[0]
      .queue?.[1] as CropMachineQueueItem;
    expect(packOne.growTimeRemaining).toBe(0);
    expect(packOne.readyAt).toBeCloseTo(item1ReadyAt);
    expect(packTwo.growTimeRemaining).toBe(0);
    expect(packTwo.readyAt).toBeCloseTo(item2ReadyAt);
    expect(
      result.buildings["Crop Machine"]?.[0].unallocatedOilTime
    ).toBeCloseTo(
      oilTimeRemaining - sunflowerPackGrowTime - potatoPackGrowTime
    );
  });

  it("recalculates queue when supplying half of the oil needed to finish first seed pack", () => {
    const now = Date.now();
    const sunflowerTime = (60 * 600 * 1000) / CROP_MACHINE_PLOTS;

    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Potato Seed": new Decimal(50),
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
            queue: [
              {
                crop: "Sunflower",
                amount: 600,
                totalGrowTime: sunflowerTime,
                growTimeRemaining: sunflowerTime,
                seeds: 600,
              },
            ],
          },
        ],
      },
    };

    const oil = OIL_PER_HOUR_CONSUMPTION / 2;
    const oilTimeRemaining = (oil / OIL_PER_HOUR_CONSUMPTION) * 60 * 60 * 1000;

    const result = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        oil,
      },
      createdAt: now,
    });

    const packOne = result.buildings["Crop Machine"]?.[0]
      .queue?.[0] as CropMachineQueueItem;
    expect(packOne.growTimeRemaining).toBeCloseTo(
      sunflowerTime - oilTimeRemaining
    );
    expect(packOne.growsUntil).toBeCloseTo(now + oilTimeRemaining);
    expect(
      result.buildings["Crop Machine"]?.[0].unallocatedOilTime
    ).toStrictEqual(0);
  });

  it("recalculates queue when supplying oil for the first pack and half of the oil needed to finish the second seed pack", () => {
    const now = Date.now();
    const sunflowerTimeForThreeHundred = (60 * 300 * 1000) / CROP_MACHINE_PLOTS; // 30 minutes;
    const sunflowerTimeForSixHundred = sunflowerTimeForThreeHundred * 2; // 60 minutes;

    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Potato Seed": new Decimal(50),
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
            queue: [
              {
                crop: "Sunflower",
                amount: 300,
                totalGrowTime: sunflowerTimeForThreeHundred,
                growTimeRemaining: sunflowerTimeForThreeHundred,
                seeds: 300,
              },
              {
                crop: "Sunflower",
                amount: 600,
                totalGrowTime: sunflowerTimeForSixHundred,
                growTimeRemaining: sunflowerTimeForSixHundred,
                seeds: 600,
              },
            ],
          },
        ],
      },
    };

    // 1 hours of oil
    const oilToAdd = 1;

    const result = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        oil: oilToAdd,
      },
      createdAt: now,
    });

    const pack1ReadyAt = now + sunflowerTimeForThreeHundred;

    const packOne = result.buildings["Crop Machine"]?.[0]
      .queue?.[0] as CropMachineQueueItem;
    const packTwo = result.buildings["Crop Machine"]?.[0]
      .queue?.[1] as CropMachineQueueItem;

    expect(packOne.growTimeRemaining).toBeCloseTo(0);
    expect(packOne.readyAt).toBeCloseTo(pack1ReadyAt);
    expect(packTwo.growTimeRemaining).toBeCloseTo(
      sunflowerTimeForSixHundred / 2
    );
    expect(packTwo.growsUntil).toBeCloseTo(
      pack1ReadyAt + sunflowerTimeForSixHundred / 2
    );
    expect(
      result.buildings["Crop Machine"]?.[0].unallocatedOilTime
    ).toBeCloseTo(0);
  });

  it("allocates enough oil to finish all packs in queue", () => {
    const now = Date.now();
    const sunflowerTime = (60 * 300 * 1000) / CROP_MACHINE_PLOTS;
    const potatoTime = (60 * 5 * 100 * 1000) / CROP_MACHINE_PLOTS;

    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Potato Seed": new Decimal(50),
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
            queue: [
              {
                crop: "Sunflower",
                amount: 300,
                totalGrowTime: sunflowerTime,
                growTimeRemaining: sunflowerTime,
                seeds: 300,
              },
              {
                crop: "Potato",
                amount: 500,
                totalGrowTime: potatoTime,
                growTimeRemaining: potatoTime,
                seeds: 500,
              },
              {
                crop: "Sunflower",
                amount: 300,
                totalGrowTime: sunflowerTime,
                growTimeRemaining: sunflowerTime,
                seeds: 300,
              },
            ],
          },
        ],
      },
    };

    const oil = 10;
    const oilMillis = (oil / OIL_PER_HOUR_CONSUMPTION) * 60 * 60 * 1000;
    const oilTimeRemaining = oilMillis - sunflowerTime * 2 - potatoTime;

    const result = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        oil,
      },
      createdAt: now,
    });

    const sunflower1ReadyAt = now + sunflowerTime;
    const potatoReadyAt = sunflower1ReadyAt + potatoTime;
    const sunflower2ReadyAt = potatoReadyAt + sunflowerTime;

    const packOne = result.buildings["Crop Machine"]?.[0]
      .queue?.[0] as CropMachineQueueItem;
    const packTwo = result.buildings["Crop Machine"]?.[0]
      .queue?.[1] as CropMachineQueueItem;
    const packThree = result.buildings["Crop Machine"]?.[0]
      ?.queue?.[2] as CropMachineQueueItem;

    expect(packOne.growTimeRemaining).toBe(0);
    expect(packOne.readyAt).toBeCloseTo(sunflower1ReadyAt);
    expect(packTwo.growTimeRemaining).toBe(0);
    expect(packTwo.readyAt).toBeCloseTo(potatoReadyAt);
    expect(packThree.growTimeRemaining).toBe(0);
    expect(packThree.readyAt).toBeCloseTo(sunflower2ReadyAt);

    expect(
      result.buildings["Crop Machine"]?.[0].unallocatedOilTime
    ).toBeCloseTo(oilTimeRemaining);
  });

  it("adds 10% yield onto Sunflowers wearing Sunflower Amulet", () => {
    const now = Date.now();
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Sunflower Seed": new Decimal(5),
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        equipped: { ...INITIAL_BUMPKIN.equipped, necklace: "Sunflower Amulet" },
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

    const newState = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        seeds: { type: "Sunflower Seed", amount: 5 },
      },
      createdAt: now,
    });

    const sunflowerTime = (60 * 1000 * 5) / CROP_MACHINE_PLOTS;

    expect(newState.buildings["Crop Machine"]?.[0].queue).toStrictEqual([
      {
        crop: "Sunflower",
        amount: 5.5,
        totalGrowTime: sunflowerTime,
        growTimeRemaining: sunflowerTime,
        seeds: 5,
      },
    ]);
  });

  it("allocates oil when 1 oil is added and there is one pack in queue with no oil allocated", () => {
    const now = Date.now();
    const sunflowerPackGrowTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS;
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Oil: new Decimal(1),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "1",
            unallocatedOilTime: 0,
            queue: [
              {
                crop: "Sunflower",
                amount: 100,
                totalGrowTime: sunflowerPackGrowTime,
                growTimeRemaining: sunflowerPackGrowTime,
                seeds: 100,
              },
            ],
          },
        ],
      },
    };

    const result = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        oil: 1,
      },
      createdAt: now,
    });

    const machine = result.buildings[
      "Crop Machine"
    ]?.[0] as CropMachineBuilding;

    const firstPack = machine.queue?.[0] as CropMachineQueueItem;

    expect(firstPack.growTimeRemaining).toBe(0);
    expect(firstPack.startTime).toBeCloseTo(now);
    expect(firstPack.readyAt).toBeCloseTo(now + sunflowerPackGrowTime);
  });

  it("adds a new crop pack and allocates the unallocated oil time to pack", () => {
    const now = Date.now();
    const sunflowerPackGrowTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS;
    const oneHour = 60 * 60 * 1000;
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Sunflower Seed": new Decimal(10000),
        Oil: new Decimal(1),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "1",
            unallocatedOilTime: oneHour,
            queue: [
              {
                crop: "Sunflower",
                amount: 100,
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

    const result = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        seeds: {
          type: "Sunflower Seed",
          amount: 100,
        },
      },
      createdAt: now,
    });

    const machine = result.buildings[
      "Crop Machine"
    ]?.[0] as CropMachineBuilding;

    const firstPack = machine.queue?.[0] as CropMachineQueueItem;
    const addedPack = machine.queue?.[1] as CropMachineQueueItem;

    expect(addedPack.growTimeRemaining).toBe(0);
    expect(addedPack.startTime).toBeCloseTo(firstPack.readyAt as number);
    expect(addedPack.readyAt).toBeCloseTo(
      (firstPack.readyAt as number) + sunflowerPackGrowTime
    );
    expect(addedPack.growsUntil).toBeUndefined();
    expect(machine.unallocatedOilTime).toBe(oneHour - sunflowerPackGrowTime);
  });

  it("allocates the remaining half oil needed if the second pack is half short on oil", () => {
    const now = Date.now();
    const packOneGrowTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS;
    const packOneStartTime = now;
    const packOneReadyAt = packOneStartTime + packOneGrowTime;
    const packTwoGrowTime = (5 * 60 * 100 * 1000) / CROP_MACHINE_PLOTS;
    const packTwoStartTime = packOneReadyAt;

    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Sunflower Seed": new Decimal(10000),
        Oil: new Decimal(1),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "1",
            unallocatedOilTime: 0,
            queue: [
              {
                crop: "Sunflower",
                amount: 100,
                totalGrowTime: packOneGrowTime,
                growTimeRemaining: 0,
                startTime: packOneStartTime,
                readyAt: packOneReadyAt,
                seeds: 100,
              },
              {
                crop: "Potato",
                amount: 100,
                totalGrowTime: packTwoGrowTime,
                growTimeRemaining: packTwoGrowTime / 2,
                startTime: packTwoStartTime,
                growsUntil: packTwoStartTime + packTwoGrowTime / 2,
                seeds: 100,
              },
            ],
          },
        ],
      },
    };

    const result = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        oil: 1,
      },
      createdAt: now,
    });

    const machine = result.buildings[
      "Crop Machine"
    ]?.[0] as CropMachineBuilding;

    const secondPack = machine.queue?.[1] as CropMachineQueueItem;
    const oilMillisAdded = getOilTimeInMillis(1);

    expect(secondPack.growTimeRemaining).toBe(0);
    expect(secondPack.growsUntil).toBeUndefined();
    expect(machine.unallocatedOilTime).toBe(
      oilMillisAdded - packTwoGrowTime / 2
    );
    expect(secondPack.readyAt).toBeCloseTo(packTwoStartTime + packTwoGrowTime);
  });

  it("updates the readyAt on an unfinished pack where the growsUntil has passed", () => {
    const now = Date.now();
    const oneHourPast = Date.now() - 60 * 60 * 1000;
    const packOneGrowTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS;
    const packOneStartTime = oneHourPast;

    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Sunflower Seed": new Decimal(10000),
        Oil: new Decimal(1),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "1",
            unallocatedOilTime: 0,
            queue: [
              {
                crop: "Sunflower",
                amount: 100,
                totalGrowTime: packOneGrowTime,
                growTimeRemaining: packOneGrowTime / 2,
                startTime: packOneStartTime,
                growsUntil: packOneStartTime + packOneGrowTime / 2,
                seeds: 100,
              },
            ],
          },
        ],
      },
    };

    const result = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        oil: 1,
      },
      createdAt: now,
    });

    const machine = result.buildings[
      "Crop Machine"
    ]?.[0] as CropMachineBuilding;

    const firstPack = machine.queue?.[0] as CropMachineQueueItem;
    const oilMillisAdded = getOilTimeInMillis(1);
    const newUnallocatedOilTime = oilMillisAdded - packOneGrowTime / 2;

    expect(firstPack.growTimeRemaining).toBe(0);
    expect(firstPack.growsUntil).toBeUndefined();
    expect(machine.unallocatedOilTime).toBe(newUnallocatedOilTime);
    expect(firstPack.readyAt).toBeCloseTo(now + packOneGrowTime / 2);
  });

  it("allocates partial grow time when half the amount of oil is added", () => {
    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;
    const fourHours = 4 * 60 * 60 * 1000;
    const packOneGrowTime = twoHours;
    const packTwoGrowTime = fourHours;
    const packTwoGrowsUntil = now + packOneGrowTime + packTwoGrowTime / 2;

    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Sunflower Seed": new Decimal(10000),
        Oil: new Decimal(1),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "1",
            unallocatedOilTime: 0,
            queue: [
              {
                crop: "Sunflower",
                amount: 100,
                totalGrowTime: packOneGrowTime,
                growTimeRemaining: 0,
                startTime: now,
                readyAt: now + packOneGrowTime,
                seeds: 100,
              },
              {
                crop: "Sunflower",
                amount: 100,
                startTime: now + packOneGrowTime,
                totalGrowTime: packTwoGrowTime,
                growTimeRemaining: packTwoGrowTime / 2,
                growsUntil: packTwoGrowsUntil,
                seeds: 100,
              },
            ],
          },
        ],
      },
    };

    const result = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        oil: 1,
      },
      createdAt: now,
    });

    const machine = result.buildings[
      "Crop Machine"
    ]?.[0] as CropMachineBuilding;

    const secondPack = machine.queue?.[1] as CropMachineQueueItem;
    const oneHour = 60 * 60 * 1000;

    expect(secondPack.growTimeRemaining).toBe(oneHour);
    expect(secondPack.growsUntil).toBeCloseTo(packTwoGrowsUntil + oneHour);
    expect(machine.unallocatedOilTime).toBe(0);
  });

  it("updates the growsUntil on an unfinished pack that stopped growing 1 hour ago", () => {
    const now = Date.now();
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const packOneGrowTime = (1000 * 60 * 1000) / CROP_MACHINE_PLOTS; // 100 minutes
    const packOneStartTime = oneHourAgo;

    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Sunflower Seed": new Decimal(10000),
        Oil: new Decimal(1),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "1",
            unallocatedOilTime: 0,
            queue: [
              {
                crop: "Sunflower",
                amount: 1000,
                totalGrowTime: packOneGrowTime,
                growTimeRemaining: 70 * 60 * 1000, // 70 minutes
                startTime: packOneStartTime,
                growsUntil: packOneStartTime + 70 * 60 * 1000,
                seeds: 1000,
              },
            ],
          },
        ],
      },
    };

    const result = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        oil: 1,
      },
      createdAt: now,
    });

    const machine = result.buildings[
      "Crop Machine"
    ]?.[0] as CropMachineBuilding;

    const firstPack = machine.queue?.[0] as CropMachineQueueItem;
    const oilMillisAdded = getOilTimeInMillis(1);

    expect(firstPack.growTimeRemaining).toBe(10 * 60 * 1000); // 10 minutes
    expect(firstPack.growsUntil).toBeCloseTo(now + oilMillisAdded);
    expect(machine.unallocatedOilTime).toBe(0);
    expect(firstPack.readyAt).toBeUndefined();
  });

  it("can add oil when the queue is full", () => {
    const now = Date.now();
    const sunflowerPackGrowTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS;

    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Oil: new Decimal(1),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: now,
            id: "1",
            unallocatedOilTime: 0,
            queue: [
              {
                crop: "Sunflower",
                amount: 100,
                totalGrowTime: sunflowerPackGrowTime,
                growTimeRemaining: 0,
                startTime: now,
                readyAt: now + sunflowerPackGrowTime,
                seeds: 100,
              },
              {
                crop: "Sunflower",
                amount: 100,
                totalGrowTime: sunflowerPackGrowTime,
                growTimeRemaining: 0,
                startTime: now,
                readyAt: now + sunflowerPackGrowTime,
                seeds: 100,
              },
              {
                crop: "Sunflower",
                amount: 100,
                totalGrowTime: sunflowerPackGrowTime,
                growTimeRemaining: 0,
                startTime: now,
                readyAt: now + sunflowerPackGrowTime,
                seeds: 100,
              },
              {
                crop: "Sunflower",
                amount: 100,
                totalGrowTime: sunflowerPackGrowTime,
                growTimeRemaining: 0,
                startTime: now,
                readyAt: now + sunflowerPackGrowTime,
                seeds: 100,
              },
              {
                crop: "Sunflower",
                amount: 100,
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

    const result = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        oil: 1,
      },
      createdAt: now,
    });

    const machine = result.buildings[
      "Crop Machine"
    ]?.[0] as CropMachineBuilding;

    expect(machine.unallocatedOilTime).toBe(getOilTimeInMillis(1));
  });
});

describe("calculateCropTime", () => {
  it("calculates the time to harvest 10 Sunflower Seeds", () => {
    const result = calculateCropTime({ type: "Sunflower Seed", amount: 10 });
    expect(result).toBe((60 * 10 * 1000) / CROP_MACHINE_PLOTS);
  });
});

describe("getTotalOilMillisInMachine", () => {
  it("returns all the unallocated oil if there are no packs in the queue", () => {
    const oneHour = 60 * 60 * 1000;
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

    const machine = state.buildings["Crop Machine"]?.[0] as CropMachineBuilding;
    const queue = machine.queue as CropMachineQueueItem[];
    const unallocatedOilTime = machine.unallocatedOilTime ?? 0;

    const result = getTotalOilMillisInMachine(queue, unallocatedOilTime);
    expect(result).toBe(oneHour);
  });

  it("returns the allocated oil for one pack in the queue starts now when there is no unallocated oil", () => {
    const now = Date.now();
    const sunflowerPackGrowTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS;
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
                amount: 100,
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

    const machine = state.buildings["Crop Machine"]?.[0] as CropMachineBuilding;
    const queue = machine.queue as CropMachineQueueItem[];
    const unallocatedOilTime = machine.unallocatedOilTime ?? 0;

    const result = getTotalOilMillisInMachine(queue, unallocatedOilTime);
    expect(result).toBe(sunflowerPackGrowTime);
  });

  it("does not return the allocated oil for a pack that has reached its readyAt time", () => {
    const now = Date.now();
    const sunflowerPackGrowTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS;
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
                amount: 100,
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

    const machine = state.buildings["Crop Machine"]?.[0] as CropMachineBuilding;
    const queue = machine.queue as CropMachineQueueItem[];
    const unallocatedOilTime = machine.unallocatedOilTime ?? 0;

    const result = getTotalOilMillisInMachine(queue, unallocatedOilTime);
    expect(result).toBe(0);
  });

  it("does not return the allocated oil for a pack that has reached its readyAt time", () => {
    const now = Date.now();
    const sunflowerPackGrowTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS;
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
                amount: 100,
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

    const machine = state.buildings["Crop Machine"]?.[0] as CropMachineBuilding;
    const queue = machine.queue as CropMachineQueueItem[];
    const unallocatedOilTime = machine.unallocatedOilTime ?? 0;

    const result = getTotalOilMillisInMachine(queue, unallocatedOilTime);
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
                amount: 100,
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

    const machine = state.buildings["Crop Machine"]?.[0] as CropMachineBuilding;
    const queue = machine.queue as CropMachineQueueItem[];
    const unallocatedOilTime = machine.unallocatedOilTime ?? 0;

    const result = getTotalOilMillisInMachine(queue, unallocatedOilTime);
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
                amount: 100,
                totalGrowTime: packGrowTime,
                growTimeRemaining: 0,
                startTime: oneHourAgo,
                readyAt: oneHourAgo + packGrowTime,
                seeds: 100,
              },
              {
                crop: "Sunflower",
                amount: 100,
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

    const machine = state.buildings["Crop Machine"]?.[0] as CropMachineBuilding;
    const queue = machine.queue as CropMachineQueueItem[];
    const unallocatedOilTime = machine.unallocatedOilTime ?? 0;

    const result = getTotalOilMillisInMachine(queue, unallocatedOilTime);
    expect(result).toBe(packGrowTime + 1000);
  });
});
