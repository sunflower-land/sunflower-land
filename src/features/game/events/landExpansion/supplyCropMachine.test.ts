import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import {
  CROP_MACHINE_PLOTS,
  OIL_PER_HOUR_CONSUMPTION,
  calculateCropTime,
  supplyCropMachine,
} from "./supplyCropMachine";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";

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
                oilTimeRemaining: 0,
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
                oilTimeRemaining: 0,
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
            oilTimeRemaining: 0,
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
            oilTimeRemaining: 0,
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
        amount: 5,
        growTimeRemaining: sunflowerTime,
        totalGrowTime: sunflowerTime,
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
            oilTimeRemaining: 0,
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
      },
      {
        crop: "Potato",
        amount: 5,
        growTimeRemaining: potatoTime,
        totalGrowTime: potatoTime,
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
            oilTimeRemaining: 500,
            queue: [
              {
                crop: "Sunflower",
                amount: 5,
                readyAt: 34567,
                growTimeRemaining: 0,
                totalGrowTime: 0,
              },
              {
                crop: "Sunflower",
                amount: 5000,
                readyAt: 34567,
                growTimeRemaining: 0,
                totalGrowTime: 0,
              },
              {
                crop: "Sunflower",
                amount: 5,
                readyAt: 34567,
                growTimeRemaining: 0,
                totalGrowTime: 0,
              },
              {
                crop: "Sunflower",
                amount: 5,
                readyAt: 34567,
                growTimeRemaining: 0,
                totalGrowTime: 0,
              },
              {
                crop: "Sunflower",
                amount: 5,
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
            oilTimeRemaining: 0,
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
            oilTimeRemaining: 0,
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
      newState.buildings["Crop Machine"]?.[0].oilTimeRemaining
    ).toStrictEqual(oilTimeRemaining);
  });

  it("recalculates one item in queue when supplying oil", () => {
    const sunflowerPackGrowTime = (60 * 100 * 1000) / CROP_MACHINE_PLOTS;

    const now = Date.now();
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Potato Seed": new Decimal(50),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            oilTimeRemaining: 0,
            queue: [
              {
                crop: "Sunflower",
                amount: 100,
                growTimeRemaining: sunflowerPackGrowTime,
                totalGrowTime: sunflowerPackGrowTime,
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
    expect(result.buildings["Crop Machine"]?.[0].queue).toStrictEqual([
      {
        crop: "Sunflower",
        amount: 100,
        growTimeRemaining: 0,
        totalGrowTime: sunflowerPackGrowTime,
        startTime: now,
        readyAt: now + sunflowerTime,
      },
    ]);
    expect(
      result.buildings["Crop Machine"]?.[0].oilTimeRemaining
    ).toStrictEqual(oilTimeRemain - sunflowerTime);
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
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            oilTimeRemaining: 0,
            queue: [
              {
                crop: "Sunflower",
                amount: 100,
                growTimeRemaining: sunflowerPackGrowTime,
                totalGrowTime: sunflowerPackGrowTime,
              },
              {
                crop: "Potato",
                amount: 100,
                growTimeRemaining: potatoPackGrowTime,
                totalGrowTime: potatoPackGrowTime,
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

    expect(result.buildings["Crop Machine"]?.[0].queue).toStrictEqual([
      {
        crop: "Sunflower",
        amount: 100,
        growTimeRemaining: 0,
        startTime: now,
        totalGrowTime: sunflowerPackGrowTime,
        readyAt: item1ReadyAt,
      },
      {
        crop: "Potato",
        amount: 100,
        totalGrowTime: potatoPackGrowTime,
        startTime: item1ReadyAt,
        growTimeRemaining: 0,
        readyAt: item2ReadyAt,
      },
    ]);
    expect(
      result.buildings["Crop Machine"]?.[0].oilTimeRemaining
    ).toStrictEqual(
      oilTimeRemaining - sunflowerPackGrowTime - potatoPackGrowTime
    );
  });

  it("recalculates queue when supplying half of the oil needed to finish first seed pack", () => {
    const now = Date.now();
    const sunflowerTime = (60 * 300 * 1000) / CROP_MACHINE_PLOTS;

    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Potato Seed": new Decimal(50),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            oilTimeRemaining: 0,
            queue: [
              {
                crop: "Sunflower",
                amount: 300,
                totalGrowTime: sunflowerTime,
                growTimeRemaining: sunflowerTime,
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

    expect(result.buildings["Crop Machine"]?.[0].queue).toStrictEqual([
      {
        crop: "Sunflower",
        amount: 300,
        totalGrowTime: sunflowerTime,
        startTime: now,
        growTimeRemaining: sunflowerTime - oilTimeRemaining,
        growsUntil: now + oilTimeRemaining,
      },
    ]);
    expect(
      result.buildings["Crop Machine"]?.[0].oilTimeRemaining
    ).toStrictEqual(0);
  });

  it("recalculates queue when supplying oil for the first pack and half of the oil needed to finish the second seed pack", () => {
    const now = Date.now();
    const sunflowerTimeForThreeHundred = (60 * 300 * 1000) / CROP_MACHINE_PLOTS;
    const sunflowerTimeForSixHundred = sunflowerTimeForThreeHundred * 2;

    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        "Potato Seed": new Decimal(50),
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            oilTimeRemaining: 0,
            queue: [
              {
                crop: "Sunflower",
                amount: 300,
                totalGrowTime: sunflowerTimeForThreeHundred,
                growTimeRemaining: sunflowerTimeForThreeHundred,
              },
              {
                crop: "Sunflower",
                amount: 600,
                totalGrowTime: sunflowerTimeForSixHundred,
                growTimeRemaining: sunflowerTimeForSixHundred,
              },
            ],
          },
        ],
      },
    };

    // 2 hours of oil
    const oilToAdd = 2;

    const result = supplyCropMachine({
      state,
      action: {
        type: "cropMachine.supplied",
        oil: oilToAdd,
      },
      createdAt: now,
    });

    const pack1ReadyAt = now + sunflowerTimeForThreeHundred;

    expect(result.buildings["Crop Machine"]?.[0].queue).toStrictEqual([
      {
        crop: "Sunflower",
        amount: 300,
        totalGrowTime: sunflowerTimeForThreeHundred,
        startTime: now,
        growTimeRemaining: 0,
        readyAt: pack1ReadyAt,
      },
      {
        crop: "Sunflower",
        amount: 600,
        totalGrowTime: sunflowerTimeForSixHundred,
        startTime: pack1ReadyAt,
        growTimeRemaining: sunflowerTimeForSixHundred / 2,
        growsUntil: pack1ReadyAt + sunflowerTimeForSixHundred / 2,
      },
    ]);
    expect(
      result.buildings["Crop Machine"]?.[0].oilTimeRemaining
    ).toStrictEqual(0);
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
      },
      buildings: {
        "Crop Machine": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            oilTimeRemaining: 0,
            queue: [
              {
                crop: "Sunflower",
                amount: 300,
                totalGrowTime: sunflowerTime,
                growTimeRemaining: sunflowerTime,
              },
              {
                crop: "Potato",
                amount: 500,
                totalGrowTime: potatoTime,
                growTimeRemaining: potatoTime,
              },
              {
                crop: "Sunflower",
                amount: 300,
                totalGrowTime: sunflowerTime,
                growTimeRemaining: sunflowerTime,
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

    expect(result.buildings["Crop Machine"]?.[0].queue).toStrictEqual([
      {
        crop: "Sunflower",
        amount: 300,
        totalGrowTime: sunflowerTime,
        startTime: now,
        growTimeRemaining: 0,
        readyAt: sunflower1ReadyAt,
      },
      {
        crop: "Potato",
        amount: 500,
        totalGrowTime: potatoTime,
        startTime: sunflower1ReadyAt,
        growTimeRemaining: 0,
        readyAt: potatoReadyAt,
      },
      {
        crop: "Sunflower",
        amount: 300,
        totalGrowTime: sunflowerTime,
        startTime: potatoReadyAt,
        growTimeRemaining: 0,
        readyAt: sunflower2ReadyAt,
      },
    ]);
    expect(
      result.buildings["Crop Machine"]?.[0].oilTimeRemaining
    ).toStrictEqual(oilTimeRemaining);
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
            oilTimeRemaining: 0,
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
      },
    ]);
  });
});

describe("calculateCropTime", () => {
  it("calculates the time to harvest 10 Sunflower Seeds", () => {
    const result = calculateCropTime({ type: "Sunflower Seed", amount: 10 });
    expect(result).toBe((60 * 10 * 1000) / CROP_MACHINE_PLOTS);
  });
});
