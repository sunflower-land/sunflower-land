import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import {
  CROP_MACHINE_PLOTS,
  MAX_OIL_CAPACITY_IN_MILLIS,
  OIL_PER_HOUR_CONSUMPTION,
  calculateCropTime,
  getOilTimeInMillis,
  supplyCropMachine,
} from "./supplyCropMachine";
import { supplyCropMachineOil } from "./supplyCropMachineOil";
import Decimal from "decimal.js-light";
import {
  CropMachineBuilding,
  CropMachineQueueItem,
  GameState,
} from "features/game/types/game";
import { setPrecision } from "lib/utils/formatNumber";

const GAME_STATE: GameState = { ...TEST_FARM, bumpkin: INITIAL_BUMPKIN };

describe("supplyCropMachine", () => {
  it("throws an error if Crop Machine does not exist", () => {
    expect(() =>
      supplyCropMachine({
        state: GAME_STATE,
        action: {
          type: "cropMachine.supplied",
          seeds: { type: "Sunflower Seed", amount: 10 },
          machineId: "0",
        },
      }),
    ).toThrow("Crop Machine does not exist");
  });

  it("throws an error if Crop Machine is not placed", () => {
    expect(() =>
      supplyCropMachine({
        state: {
          ...GAME_STATE,
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
          type: "cropMachine.supplied",
          seeds: { type: "Sunflower Seed", amount: 10 },
          machineId: "1",
        },
      }),
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
          machineId: "1",
        },
      }),
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
          machineId: "1",
        },
      }),
    ).toThrow("Invalid amount supplied");
  });

  it("throws an error if seeds amount is less than 1", () => {
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
          seeds: { type: "Sunflower Seed", amount: 0 },
          machineId: "1",
        },
      }),
    ).toThrow("Invalid amount supplied");
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
          machineId: "0",
          seeds: { type: "Radish Seed", amount: 10 },
        },
      }),
    ).toThrow("You can't supply these seeds");
  });

  it("adds packs successfully when oil in machine exceeds 48h (post-reset over capacity)", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Pumpkin Seed": new Decimal(20),
      },
      season: {
        season: "autumn",
        startedAt: 0,
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            unallocatedOilTime: MAX_OIL_CAPACITY_IN_MILLIS(GAME_STATE) * 2,
          },
        ],
      },
    };

    const newState = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        machineId: "0",
        seeds: { type: "Pumpkin Seed", amount: 20 },
      },
      createdAt: Date.now(),
    });

    expect(newState.buildings["Crop Machine"]?.[0]?.queue?.length).toBe(1);
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
        machineId: "0",
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
        machineId: "0",
        seeds: { type: "Sunflower Seed", amount: 5 },
      },
      createdAt: now,
    });

    const sunflowerTime = (60 * 1000 * 5) / CROP_MACHINE_PLOTS(GAME_STATE);

    expect(newState.buildings["Crop Machine"]?.[0].queue).toStrictEqual([
      {
        crop: "Sunflower",
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
        machineId: "0",
        seeds: { type: "Sunflower Seed", amount: 5 },
      },
      createdAt: now,
    });

    const result = supplyCropMachine({
      state: newState,
      action: {
        type: "cropMachine.supplied",
        machineId: "0",
        seeds: { type: "Potato Seed", amount: 5 },
      },
      createdAt: now + 1000,
    });

    const sunflowerTime = (60 * 1000 * 5) / CROP_MACHINE_PLOTS(GAME_STATE);
    const potatoTime = (60 * 5 * 1000 * 5) / CROP_MACHINE_PLOTS(GAME_STATE);
    expect(result.buildings["Crop Machine"]?.[0].queue).toStrictEqual([
      {
        crop: "Sunflower",
        growTimeRemaining: sunflowerTime, // 5 plots,
        totalGrowTime: sunflowerTime,
        seeds: 5,
      },
      {
        crop: "Potato",
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
                readyAt: 34567,
                growTimeRemaining: 0,
                totalGrowTime: 0,
                seeds: 5,
              },
              {
                crop: "Sunflower",
                readyAt: 34567,
                growTimeRemaining: 0,
                totalGrowTime: 0,
                seeds: 5000,
              },
              {
                crop: "Sunflower",
                seeds: 5,
                readyAt: 34567,
                growTimeRemaining: 0,
                totalGrowTime: 0,
              },
              {
                crop: "Sunflower",
                seeds: 5,
                readyAt: 34567,
                growTimeRemaining: 0,
                totalGrowTime: 0,
              },
              {
                crop: "Sunflower",
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
          machineId: "0",
          seeds: { type: "Sunflower Seed", amount: 10 },
        },
      }),
    ).toThrow("Queue is full");
  });

  it("recalculates one item in queue when supplying oil", () => {
    const sunflowerPackGrowTime =
      (60 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);

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
                growTimeRemaining: sunflowerPackGrowTime,
                totalGrowTime: sunflowerPackGrowTime,
                seeds: 100,
              },
            ],
          },
        ],
      },
    };

    const result = supplyCropMachineOil({
      state,
      action: {
        type: "cropMachine.oilSupplied",
        oil: 10,
        machineId: "0",
      },
      createdAt: now,
    });

    const sunflowerTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE); // 5 plots;
    const oilTimeRemain =
      (10 / OIL_PER_HOUR_CONSUMPTION(GAME_STATE)) * 60 * 60 * 1000;
    const pack = result.buildings["Crop Machine"]?.[0]
      .queue?.[0] as CropMachineQueueItem;
    expect(pack.growTimeRemaining).toBe(0);
    expect(pack.readyAt).toBeCloseTo(now + sunflowerTime);
    expect(
      result.buildings["Crop Machine"]?.[0].unallocatedOilTime,
    ).toBeCloseTo(oilTimeRemain - sunflowerTime);
  });

  it("recalculates multiple items in queue when supplying oil", () => {
    //  100 Sunflower Seed Pack takes 20 minutes to grow
    const sunflowerPackGrowTime =
      (60 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    // 100 Potato Seed Pack takes 100 minutes to grow
    const potatoPackGrowTime =
      (60 * 5 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);

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
                growTimeRemaining: sunflowerPackGrowTime,
                totalGrowTime: sunflowerPackGrowTime,
                seeds: 100,
              },
              {
                crop: "Potato",
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

    const result = supplyCropMachineOil({
      state,
      action: {
        type: "cropMachine.oilSupplied",
        oil,
        machineId: "0",
      },
      createdAt: now,
    });

    // 600 minutes of oil remaining
    const oilTimeRemaining =
      (oil / OIL_PER_HOUR_CONSUMPTION(GAME_STATE)) * 60 * 60 * 1000;

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
      result.buildings["Crop Machine"]?.[0].unallocatedOilTime,
    ).toBeCloseTo(
      oilTimeRemaining - sunflowerPackGrowTime - potatoPackGrowTime,
    );
  });

  it("recalculates queue when supplying half of the oil needed to finish first seed pack", () => {
    const now = Date.now();
    const sunflowerTime = (60 * 600 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);

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
                totalGrowTime: sunflowerTime,
                growTimeRemaining: sunflowerTime,
                seeds: 600,
              },
            ],
          },
        ],
      },
    };

    const oil = OIL_PER_HOUR_CONSUMPTION(GAME_STATE) / 2;
    const oilTimeRemaining =
      (oil / OIL_PER_HOUR_CONSUMPTION(GAME_STATE)) * 60 * 60 * 1000;

    const result = supplyCropMachineOil({
      state,
      action: {
        type: "cropMachine.oilSupplied",
        oil,
        machineId: "0",
      },
      createdAt: now,
    });

    const packOne = result.buildings["Crop Machine"]?.[0]
      .queue?.[0] as CropMachineQueueItem;
    expect(packOne.growTimeRemaining).toBeCloseTo(
      sunflowerTime - oilTimeRemaining,
    );
    expect(packOne.growsUntil).toBeCloseTo(now + oilTimeRemaining);
    expect(
      result.buildings["Crop Machine"]?.[0].unallocatedOilTime,
    ).toStrictEqual(0);
  });

  it("recalculates queue when supplying oil for the first pack and half of the oil needed to finish the second seed pack", () => {
    const now = Date.now();
    const sunflowerTimeForThreeHundred =
      (60 * 300 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE); // 30 minutes;
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
                totalGrowTime: sunflowerTimeForThreeHundred,
                growTimeRemaining: sunflowerTimeForThreeHundred,
                seeds: 300,
              },
              {
                crop: "Sunflower",
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

    const result = supplyCropMachineOil({
      state,
      action: {
        type: "cropMachine.oilSupplied",
        oil: oilToAdd,
        machineId: "0",
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
      sunflowerTimeForSixHundred / 2,
    );
    expect(packTwo.growsUntil).toBeCloseTo(
      pack1ReadyAt + sunflowerTimeForSixHundred / 2,
    );
    expect(
      result.buildings["Crop Machine"]?.[0].unallocatedOilTime,
    ).toBeCloseTo(0);
  });

  it("allocates enough oil to finish all packs in queue", () => {
    const now = Date.now();
    const sunflowerTime = (60 * 300 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const potatoTime = (60 * 5 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);

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
                totalGrowTime: sunflowerTime,
                growTimeRemaining: sunflowerTime,
                seeds: 300,
              },
              {
                crop: "Potato",
                totalGrowTime: potatoTime,
                growTimeRemaining: potatoTime,
                seeds: 500,
              },
              {
                crop: "Sunflower",
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
    const oilMillis =
      (oil / OIL_PER_HOUR_CONSUMPTION(GAME_STATE)) * 60 * 60 * 1000;
    const oilTimeRemaining = oilMillis - sunflowerTime * 2 - potatoTime;

    const result = supplyCropMachineOil({
      state,
      action: {
        type: "cropMachine.oilSupplied",
        oil,
        machineId: "0",
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
      result.buildings["Crop Machine"]?.[0].unallocatedOilTime,
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
        machineId: "0",
        seeds: { type: "Sunflower Seed", amount: 5 },
      },
      createdAt: now,
    });

    const sunflowerTime = (60 * 1000 * 5) / CROP_MACHINE_PLOTS(GAME_STATE);

    expect(newState.buildings["Crop Machine"]?.[0].queue).toStrictEqual([
      {
        crop: "Sunflower",
        totalGrowTime: sunflowerTime,
        growTimeRemaining: sunflowerTime,
        seeds: 5,
      },
    ]);
  });

  it("allocates oil when 1 oil is added and there is one pack in queue with no oil allocated", () => {
    const now = Date.now();
    const sunflowerPackGrowTime =
      (60 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
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
                totalGrowTime: sunflowerPackGrowTime,
                growTimeRemaining: sunflowerPackGrowTime,
                seeds: 100,
              },
            ],
          },
        ],
      },
    };

    const result = supplyCropMachineOil({
      state,
      action: {
        type: "cropMachine.oilSupplied",
        oil: 1,
        machineId: "1",
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
    const sunflowerPackGrowTime =
      (60 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
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
        machineId: "1",
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
      (firstPack.readyAt as number) + sunflowerPackGrowTime,
    );
    expect(addedPack.growsUntil).toBeUndefined();
    expect(machine.unallocatedOilTime).toBe(oneHour - sunflowerPackGrowTime);
  });

  it("allocates the remaining half oil needed if the second pack is half short on oil", () => {
    const now = Date.now();
    const packOneGrowTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const packOneStartTime = now;
    const packOneReadyAt = packOneStartTime + packOneGrowTime;
    const packTwoGrowTime =
      (5 * 60 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
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
                totalGrowTime: packOneGrowTime,
                growTimeRemaining: 0,
                startTime: packOneStartTime,
                readyAt: packOneReadyAt,
                seeds: 100,
              },
              {
                crop: "Potato",
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

    const result = supplyCropMachineOil({
      state,
      action: {
        type: "cropMachine.oilSupplied",
        oil: 1,
        machineId: "1",
      },
      createdAt: now,
    });

    const machine = result.buildings[
      "Crop Machine"
    ]?.[0] as CropMachineBuilding;

    const secondPack = machine.queue?.[1] as CropMachineQueueItem;
    const oilMillisAdded = getOilTimeInMillis(1, GAME_STATE);

    expect(secondPack.growTimeRemaining).toBe(0);
    expect(secondPack.growsUntil).toBeUndefined();
    expect(machine.unallocatedOilTime).toBe(
      oilMillisAdded - packTwoGrowTime / 2,
    );
    expect(secondPack.readyAt).toBeCloseTo(packTwoStartTime + packTwoGrowTime);
  });

  it("updates the readyAt on an unfinished pack where the growsUntil has passed", () => {
    const now = Date.now();
    const oneHourPast = Date.now() - 60 * 60 * 1000;
    const packOneGrowTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
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

    const result = supplyCropMachineOil({
      state,
      action: {
        type: "cropMachine.oilSupplied",
        oil: 1,
        machineId: "1",
      },
      createdAt: now,
    });

    const machine = result.buildings[
      "Crop Machine"
    ]?.[0] as CropMachineBuilding;

    const firstPack = machine.queue?.[0] as CropMachineQueueItem;
    const oilMillisAdded = getOilTimeInMillis(1, GAME_STATE);
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
                totalGrowTime: packOneGrowTime,
                growTimeRemaining: 0,
                startTime: now,
                readyAt: now + packOneGrowTime,
                seeds: 100,
              },
              {
                crop: "Sunflower",
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

    const result = supplyCropMachineOil({
      state,
      action: {
        type: "cropMachine.oilSupplied",
        oil: 1,
        machineId: "1",
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
    const packOneGrowTime = (1000 * 60 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE); // 100 minutes
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
                totalGrowTime: packOneGrowTime,
                growTimeRemaining: 70 * 60 * 1000, // 70 minutes
                startTime: packOneStartTime,
                growsUntil: packOneStartTime + 30 * 60 * 1000,
                seeds: 1000,
              },
            ],
          },
        ],
      },
    };

    const result = supplyCropMachineOil({
      state,
      action: {
        type: "cropMachine.oilSupplied",
        oil: 1,
        machineId: "1",
      },
      createdAt: now,
    });

    const machine = result.buildings[
      "Crop Machine"
    ]?.[0] as CropMachineBuilding;

    const firstPack = machine.queue?.[0] as CropMachineQueueItem;
    const oilMillisAdded = getOilTimeInMillis(1, GAME_STATE);

    expect(firstPack.growTimeRemaining).toBe(10 * 60 * 1000); // 10 minutes
    expect(firstPack.growsUntil).toBeCloseTo(now + oilMillisAdded);
    expect(machine.unallocatedOilTime).toBe(0);
    expect(firstPack.readyAt).toBeUndefined();
  });

  it("can add oil when the queue is full", () => {
    const now = Date.now();
    const sunflowerPackGrowTime =
      (60 * 100 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);

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
                totalGrowTime: sunflowerPackGrowTime,
                growTimeRemaining: 0,
                startTime: now,
                readyAt: now + sunflowerPackGrowTime,
                seeds: 100,
              },
              {
                crop: "Sunflower",
                totalGrowTime: sunflowerPackGrowTime,
                growTimeRemaining: 0,
                startTime: now,
                readyAt: now + sunflowerPackGrowTime,
                seeds: 100,
              },
              {
                crop: "Sunflower",
                totalGrowTime: sunflowerPackGrowTime,
                growTimeRemaining: 0,
                startTime: now,
                readyAt: now + sunflowerPackGrowTime,
                seeds: 100,
              },
              {
                crop: "Sunflower",
                totalGrowTime: sunflowerPackGrowTime,
                growTimeRemaining: 0,
                startTime: now,
                readyAt: now + sunflowerPackGrowTime,
                seeds: 100,
              },
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

    const result = supplyCropMachineOil({
      state,
      action: {
        type: "cropMachine.oilSupplied",
        oil: 1,
        machineId: "1",
      },
      createdAt: now,
    });

    const machine = result.buildings[
      "Crop Machine"
    ]?.[0] as CropMachineBuilding;

    expect(machine.unallocatedOilTime).toBe(getOilTimeInMillis(1, GAME_STATE));
  });

  it("completely allocates when the oil time perfectly matches the grow time", () => {
    const now = Date.now();
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Pumpkin Seed": new Decimal(20),
        Oil: new Decimal(1),
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
        machineId: "0",
        seeds: { type: "Pumpkin Seed", amount: 20 },
      },
      createdAt: now,
    });

    const finalState = supplyCropMachineOil({
      state: newState,
      action: {
        type: "cropMachine.oilSupplied",
        oil: 1,
        machineId: "0",
      },
      createdAt: now,
    });

    expect(
      finalState.buildings["Crop Machine"]?.[0]?.queue?.[0].readyAt,
    ).toBeDefined();
  });

  it("sets the readyAt to a minimum of Date.now + grow time when fully allocating slot 1", () => {
    const now = Date.now();
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Pumpkin Seed": new Decimal(40),
        Oil: new Decimal(1),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            unallocatedOilTime: MAX_OIL_CAPACITY_IN_MILLIS(GAME_STATE),
            queue: [],
          },
        ],
      },
    };

    const newState = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        machineId: "0",
        seeds: { type: "Pumpkin Seed", amount: 20 },
      },
      createdAt: 1,
    });

    const finalState = supplyCropMachine({
      state: newState,
      action: {
        type: "cropMachine.supplied",
        machineId: "0",
        seeds: { type: "Pumpkin Seed", amount: 20 },
      },
      createdAt: now,
    });

    expect(
      finalState.buildings["Crop Machine"]?.[0]?.queue?.[1].readyAt,
    ).toBeGreaterThan(now);
  });

  it("sets the readyAt to a minimum of Date.now + grow time when fully allocating slot 1 (previously partially allocated)", () => {
    const now = Date.now();
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Pumpkin Seed": new Decimal(40),
        Oil: new Decimal(1),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            unallocatedOilTime: 3600000 + 1800000,
            queue: [],
          },
        ],
      },
    };

    const firstState = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        machineId: "0",
        seeds: { type: "Pumpkin Seed", amount: 20 },
      },
      createdAt: 1,
    });

    const secondState = supplyCropMachine({
      state: firstState,
      action: {
        type: "cropMachine.supplied",
        machineId: "0",
        seeds: { type: "Pumpkin Seed", amount: 20 },
      },
      createdAt: firstState.buildings["Crop Machine"]?.[0]?.queue?.[0].readyAt,
    });

    // Not full allocated
    expect(
      secondState.buildings["Crop Machine"]?.[0]?.queue?.[1].readyAt,
    ).toBeUndefined();

    const thirdState = supplyCropMachineOil({
      state: secondState,
      action: {
        type: "cropMachine.oilSupplied",
        oil: 1,
        machineId: "0",
      },
      createdAt: now,
    });

    expect(
      thirdState.buildings["Crop Machine"]?.[0]?.queue?.[1].readyAt,
    ).toBeGreaterThan(now);
  });

  it("sets the growsUntil to a minimum of growsUntil + oil when partially allocating slot 0 (previously partially allocated)", () => {
    const now = Date.now();
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Pumpkin Seed": new Decimal(1000),
        Oil: new Decimal(11),
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

    const seedState = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        machineId: "0",
        seeds: { type: "Pumpkin Seed", amount: 1000 },
      },
      createdAt: now,
    });

    const newState = supplyCropMachineOil({
      state: seedState,
      action: {
        type: "cropMachine.oilSupplied",
        oil: 10,
        machineId: "0",
      },
      createdAt: now,
    });

    const finalState = supplyCropMachineOil({
      state: newState,
      action: {
        type: "cropMachine.oilSupplied",
        oil: 1,
        machineId: "0",
      },
      createdAt: now,
    });

    const firstGrowsUntil =
      newState.buildings["Crop Machine"]?.[0]?.queue?.[0].growsUntil;
    const secondGrowsUntil =
      finalState.buildings["Crop Machine"]?.[0]?.queue?.[0].growsUntil;

    expect(secondGrowsUntil).toBeGreaterThan(firstGrowsUntil ?? Infinity);
  });

  it("sets the growsUntil to a minimum of growsUntil + oil when partially allocating slot 1 (previously partially allocated)", () => {
    const now = Date.now();
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Pumpkin Seed": new Decimal(1000),
        Oil: new Decimal(11),
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
                growTimeRemaining: 0,
                seeds: 1,
                totalGrowTime: 1,
                readyAt: 1,
                startTime: 1,
              },
            ],
          },
        ],
      },
    };

    const seedState = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        machineId: "0",
        seeds: { type: "Pumpkin Seed", amount: 1000 },
      },
      createdAt: now,
    });

    const newState = supplyCropMachineOil({
      state: seedState,
      action: {
        type: "cropMachine.oilSupplied",
        oil: 10,
        machineId: "0",
      },
      createdAt: now,
    });

    const finalState = supplyCropMachineOil({
      state: newState,
      action: {
        type: "cropMachine.oilSupplied",
        oil: 1,
        machineId: "0",
      },
      createdAt: now,
    });

    const firstGrowsUntil =
      newState.buildings["Crop Machine"]?.[0]?.queue?.[1].growsUntil;
    const secondGrowsUntil =
      finalState.buildings["Crop Machine"]?.[0]?.queue?.[1].growsUntil;

    expect(secondGrowsUntil).toBeGreaterThan(firstGrowsUntil ?? Infinity);
  });

  it("sets startTime greater than Date.now when the queue has finished crops", () => {
    const now = Date.now();
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Pumpkin Seed": new Decimal(40),
        Oil: new Decimal(1),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            unallocatedOilTime: MAX_OIL_CAPACITY_IN_MILLIS(GAME_STATE),
            queue: [],
          },
        ],
      },
    };

    const newState = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        machineId: "0",
        seeds: { type: "Pumpkin Seed", amount: 20 },
      },
      createdAt: 1,
    });

    const finalState = supplyCropMachine({
      state: newState,
      action: {
        type: "cropMachine.supplied",
        machineId: "0",
        seeds: { type: "Pumpkin Seed", amount: 20 },
      },
      createdAt: now,
    });

    expect(
      finalState.buildings["Crop Machine"]?.[0]?.queue?.[1].startTime,
    ).toBeGreaterThanOrEqual(now);
  });

  it("increases Oil consumption per hour by 10% when Crop Processor Unit is active", () => {
    const oilConsumedPerHour = OIL_PER_HOUR_CONSUMPTION({
      ...GAME_STATE,
      bumpkin: {
        ...GAME_STATE.bumpkin,
        skills: {
          "Crop Processor Unit": 1,
        },
      },
    });

    expect(oilConsumedPerHour).toEqual(1.1);
  });

  it("increases Oil consumption per hour by 40% when Rapid Rig is active", () => {
    const oilConsumedPerHour = OIL_PER_HOUR_CONSUMPTION({
      ...GAME_STATE,
      bumpkin: {
        ...GAME_STATE.bumpkin,
        skills: {
          "Rapid Rig": 1,
        },
      },
    });

    expect(oilConsumedPerHour).toEqual(1.4);
  });

  it("increases Oil consumption per hour by 50% when Crop Processor Unit and Rapid Rig are active", () => {
    const oilConsumedPerHour = OIL_PER_HOUR_CONSUMPTION({
      ...GAME_STATE,
      bumpkin: {
        ...GAME_STATE.bumpkin,
        skills: {
          "Crop Processor Unit": 1,
          "Rapid Rig": 1,
        },
      },
    });

    expect(oilConsumedPerHour).toEqual(1.5);
  });

  it("decreases Oil consumption per hour by 10% when Oil Gadget is active", () => {
    const oilConsumedPerHour = OIL_PER_HOUR_CONSUMPTION({
      ...GAME_STATE,
      bumpkin: {
        ...GAME_STATE.bumpkin,
        skills: {
          "Oil Gadget": 1,
        },
      },
    });

    expect(oilConsumedPerHour).toEqual(0.9);
  });

  it("decreases Oil consumption per hour by 30% when Efficiency Extension Module is active", () => {
    const oilConsumedPerHour = OIL_PER_HOUR_CONSUMPTION({
      ...GAME_STATE,
      bumpkin: {
        ...GAME_STATE.bumpkin,
        skills: {
          "Efficiency Extension Module": 1,
        },
      },
    });

    expect(oilConsumedPerHour).toEqual(0.7);
  });

  it("decreases Oil consumption per hour by 40% when Oil Gadget and Efficiency Extension Module are active", () => {
    const oilConsumedPerHour = setPrecision(
      OIL_PER_HOUR_CONSUMPTION({
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Oil Gadget": 1,
            "Efficiency Extension Module": 1,
          },
        },
      }),
    ).toNumber();

    expect(oilConsumedPerHour).toEqual(0.6);
  });

  it("decreases Oil consumption per hour by 10% when Oil Gadget, Efficiency Extension Module, Crop Processor Unit and Rapid Rig are active", () => {
    const oilConsumedPerHour = setPrecision(
      OIL_PER_HOUR_CONSUMPTION({
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Oil Gadget": 1,
            "Efficiency Extension Module": 1,
            "Crop Processor Unit": 1,
            "Rapid Rig": 1,
          },
        },
      }),
    ).toNumber();

    expect(oilConsumedPerHour).toEqual(0.9);
  });

  it("does not let player plant Rhubarb if player doesn't have Crop Extension Module I", () => {
    expect(() =>
      supplyCropMachine({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                unallocatedOilTime: 3600000 + 1800000,
                queue: [],
              },
            ],
          },
        },
        action: {
          type: "cropMachine.supplied",
          machineId: "0",
          seeds: { type: "Rhubarb Seed", amount: 20 },
        },
        createdAt: Date.now(),
      }),
    ).toThrow("You can't supply these seeds");
  });

  it("does not let player plant cabbage if player doesn't have Crop Extension Module II", () => {
    expect(() =>
      supplyCropMachine({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                unallocatedOilTime: 3600000 + 1800000,
                queue: [],
              },
            ],
          },
        },
        action: {
          type: "cropMachine.supplied",
          machineId: "0",
          seeds: { type: "Cabbage Seed", amount: 20 },
        },
        createdAt: Date.now(),
      }),
    ).toThrow("You can't supply these seeds");
  });

  it("does not let player plant Yam if player doesn't have Crop Extension Module III", () => {
    expect(() =>
      supplyCropMachine({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                unallocatedOilTime: 3600000 + 1800000,
                queue: [],
              },
            ],
          },
        },
        action: {
          type: "cropMachine.supplied",
          machineId: "0",
          seeds: { type: "Yam Seed", amount: 20 },
        },
        createdAt: Date.now(),
      }),
    ).toThrow("You can't supply these seeds");
  });
});

describe("calculateCropTime", () => {
  it("calculates the time to harvest 10 Sunflower Seeds", () => {
    const { milliSeconds: result } = calculateCropTime(
      { type: "Sunflower Seed", amount: 10 },
      GAME_STATE,
    );
    expect(result).toBe((60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE));
  });

  it("reduces crop machine growth time by 5% with Crop Processor Unit", () => {
    const { milliSeconds: result } = calculateCropTime(
      { type: "Sunflower Seed", amount: 10 },
      {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Crop Processor Unit": 1,
          },
        },
      },
    );

    expect(result).toBe(
      (60 * 10 * 1000 * 0.95) / CROP_MACHINE_PLOTS(GAME_STATE),
    );
  });

  it("reduces crop machine growth time by 20% with Rapid Rig", () => {
    const { milliSeconds: result } = calculateCropTime(
      { type: "Sunflower Seed", amount: 10 },
      {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Rapid Rig": 1,
          },
        },
      },
    );

    expect(result).toBe(
      (60 * 10 * 1000 * 0.8) / CROP_MACHINE_PLOTS(GAME_STATE),
    );
  });

  it("reduces crop machine growth time by 50% with Groovy Gramophone", () => {
    const { milliSeconds: result } = calculateCropTime(
      { type: "Sunflower Seed", amount: 10 },
      {
        ...GAME_STATE,
        collectibles: {
          "Groovy Gramophone": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              id: "0",
            },
          ],
        },
      },
    );

    expect(result).toBe(
      (60 * 10 * 1000 * 0.5) / CROP_MACHINE_PLOTS(GAME_STATE),
    );
  });

  it("reduces crop machine growth time by 24% with Crop Processor Unit and Rapid Rig", () => {
    const { milliSeconds: result } = calculateCropTime(
      { type: "Sunflower Seed", amount: 10 },
      {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Crop Processor Unit": 1,
            "Rapid Rig": 1,
          },
        },
      },
    );

    expect(result).toBe(
      (60 * 10 * 1000 * 0.76) / CROP_MACHINE_PLOTS(GAME_STATE),
    );
  });
});
