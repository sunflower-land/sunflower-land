import { removeCropMachinePack } from "./removeCropMachinePack";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { CROP_MACHINE_PLOTS } from "./supplyCropMachine";
import Decimal from "decimal.js-light";
import {
  CropMachineBuilding,
  CropMachineQueueItem,
} from "features/game/types/game";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  inventory: {
    ...TEST_FARM.inventory,
    "Beta Pass": new Decimal(1),
  },
};
const now = Date.now();

const createCropMachineWithQueue = (
  queue: CropMachineQueueItem[],
  unallocatedOilTime = 0,
): CropMachineBuilding => ({
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  id: "1",
  readyAt: 123,
  unallocatedOilTime,
  queue,
});

describe("removeCropMachinePack", () => {
  it("throws an error if Crop Machine does not exist", () => {
    expect(() =>
      removeCropMachinePack({
        state: GAME_STATE,
        action: {
          type: "cropMachine.packRemoved",
          packIndex: 0,
          machineId: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Crop Machine does not exist");
  });

  it("throws an error if Crop Machine is not placed (coordinates undefined)", () => {
    expect(() =>
      removeCropMachinePack({
        state: {
          ...GAME_STATE,
          inventory: { "Beta Pass": new Decimal(1) },
          buildings: {
            "Crop Machine": [
              {
                ...createCropMachineWithQueue([
                  {
                    crop: "Sunflower",
                    growTimeRemaining: 60000,
                    totalGrowTime: 60000,
                    seeds: 10,
                  },
                ]),
                coordinates: undefined,
              },
            ],
          },
        },
        action: {
          type: "cropMachine.packRemoved",
          packIndex: 0,
          machineId: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Crop Machine not found");
  });

  it("throws an error if queue is empty", () => {
    expect(() =>
      removeCropMachinePack({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [createCropMachineWithQueue([])],
          },
        },
        action: {
          type: "cropMachine.packRemoved",
          packIndex: 0,
          machineId: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Nothing in the queue");
  });

  it("throws an error if pack does not exist at index", () => {
    const totalGrowTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    expect(() =>
      removeCropMachinePack({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [
              createCropMachineWithQueue([
                {
                  crop: "Sunflower",
                  growTimeRemaining: totalGrowTime,
                  totalGrowTime,
                  seeds: 10,
                },
              ]),
            ],
          },
        },
        action: {
          type: "cropMachine.packRemoved",
          packIndex: 1,
          machineId: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Pack does not exist");
  });

  it("throws an error if pack has already started (startTime <= createdAt)", () => {
    const totalGrowTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    expect(() =>
      removeCropMachinePack({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [
              createCropMachineWithQueue([
                {
                  crop: "Sunflower",
                  growTimeRemaining: totalGrowTime / 2,
                  totalGrowTime,
                  seeds: 10,
                  startTime: now - 1000,
                  growsUntil: now + 5000,
                },
              ]),
            ],
          },
        },
        action: {
          type: "cropMachine.packRemoved",
          packIndex: 0,
          machineId: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Pack has already started");
  });

  it("throws an error if pack is finished (readyAt <= createdAt)", () => {
    const totalGrowTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    expect(() =>
      removeCropMachinePack({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [
              createCropMachineWithQueue([
                {
                  crop: "Sunflower",
                  growTimeRemaining: 0,
                  totalGrowTime,
                  seeds: 10,
                  startTime: now - 10000,
                  readyAt: now - 1000,
                },
              ]),
            ],
          },
        },
        action: {
          type: "cropMachine.packRemoved",
          packIndex: 0,
          machineId: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Pack has already started");
  });

  it("removes pack with no startTime and refunds seeds only, unallocatedOilTime unchanged", () => {
    const totalGrowTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const initialUnallocatedOilTime = 1000;
    const result = removeCropMachinePack({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(5),
        },
        buildings: {
          "Crop Machine": [
            createCropMachineWithQueue(
              [
                {
                  crop: "Sunflower",
                  growTimeRemaining: totalGrowTime,
                  totalGrowTime,
                  seeds: 10,
                },
              ],
              initialUnallocatedOilTime,
            ),
          ],
        },
      },
      action: {
        type: "cropMachine.packRemoved",
        packIndex: 0,
        machineId: "1",
      },
      createdAt: now,
    });

    const machine = result.buildings["Crop Machine"]?.[0];
    expect(machine?.queue).toHaveLength(0);
    expect(machine?.unallocatedOilTime).toBe(initialUnallocatedOilTime);
    expect(result.inventory["Sunflower Seed"]?.toNumber()).toBe(15);
  });

  it("removes pack with startTime > createdAt (scheduled but not started) and refunds seeds and oil", () => {
    const totalGrowTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const initialUnallocatedOilTime = 0;
    const result = removeCropMachinePack({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(5),
        },
        buildings: {
          "Crop Machine": [
            createCropMachineWithQueue(
              [
                {
                  crop: "Sunflower",
                  growTimeRemaining: 0,
                  totalGrowTime,
                  seeds: 10,
                  startTime: now + 60000,
                  readyAt: now + 60000 + totalGrowTime,
                },
              ],
              initialUnallocatedOilTime,
            ),
          ],
        },
      },
      action: {
        type: "cropMachine.packRemoved",
        packIndex: 0,
        machineId: "1",
      },
      createdAt: now,
    });

    const machine = result.buildings["Crop Machine"]?.[0];
    expect(machine?.queue).toHaveLength(0);
    expect(machine?.unallocatedOilTime).toBe(totalGrowTime);
    expect(result.inventory["Sunflower Seed"]?.toNumber()).toBe(15);
  });

  it("refunds partial oil for partially allocated pack with startTime > createdAt", () => {
    const totalGrowTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const allocatedOil = totalGrowTime / 2;
    const growTimeRemaining = totalGrowTime - allocatedOil;
    const initialUnallocatedOilTime = 0;
    const result = removeCropMachinePack({
      state: {
        ...GAME_STATE,
        inventory: {
          "Potato Seed": new Decimal(0),
        },
        buildings: {
          "Crop Machine": [
            createCropMachineWithQueue(
              [
                {
                  crop: "Potato",
                  growTimeRemaining,
                  totalGrowTime,
                  seeds: 5,
                  startTime: now + 60000,
                  growsUntil: now + 60000 + allocatedOil,
                },
              ],
              initialUnallocatedOilTime,
            ),
          ],
        },
      },
      action: {
        type: "cropMachine.packRemoved",
        packIndex: 0,
        machineId: "1",
      },
      createdAt: now,
    });

    const machine = result.buildings["Crop Machine"]?.[0];
    expect(machine?.queue).toHaveLength(0);
    expect(machine?.unallocatedOilTime).toBe(allocatedOil);
    expect(result.inventory["Potato Seed"]?.toNumber()).toBe(5);
  });

  it("reschedules downstream pack when removing middle of 3 packs (fully allocated)", () => {
    const growTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const t0 = now + 5000;
    const t1 = t0 + growTime;
    const t2 = t1 + growTime;

    const result = removeCropMachinePack({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(20),
          "Potato Seed": new Decimal(10),
        },
        buildings: {
          "Crop Machine": [
            createCropMachineWithQueue([
              {
                crop: "Sunflower",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: now - 1000,
                readyAt: t0,
              },
              {
                crop: "Potato",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 5,
                startTime: t0,
                readyAt: t1,
              },
              {
                crop: "Pumpkin",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: t1,
                readyAt: t2,
              },
            ]),
          ],
        },
      },
      action: {
        type: "cropMachine.packRemoved",
        packIndex: 1,
        machineId: "1",
      },
      createdAt: now,
    });

    const queue = result.buildings["Crop Machine"]?.[0]?.queue ?? [];
    expect(queue).toHaveLength(2);
    expect(queue[0].readyAt).toBe(t0);
    expect(queue[1].startTime).toBe(t0);
    expect(queue[1].readyAt).toBe(t0 + growTime);
  });

  it("reschedules downstream pack when removing middle of 3 packs (partially allocated)", () => {
    const growTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const allocatedOil = growTime / 2;
    const t0 = now + 5000;

    const result = removeCropMachinePack({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(20),
          "Potato Seed": new Decimal(10),
        },
        buildings: {
          "Crop Machine": [
            createCropMachineWithQueue([
              {
                crop: "Sunflower",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: now - 1000,
                readyAt: t0,
              },
              {
                crop: "Potato",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 5,
                startTime: t0,
                readyAt: t0 + growTime,
              },
              {
                crop: "Pumpkin",
                growTimeRemaining: growTime - allocatedOil,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: t0 + growTime,
                growsUntil: t0 + growTime + allocatedOil,
              },
            ]),
          ],
        },
      },
      action: {
        type: "cropMachine.packRemoved",
        packIndex: 1,
        machineId: "1",
      },
      createdAt: now,
    });

    const queue = result.buildings["Crop Machine"]?.[0]?.queue ?? [];
    expect(queue).toHaveLength(2);
    expect(queue[1].startTime).toBe(t0);
    // Refunded oil from P1 is reallocated by updateCropMachine; P2 becomes fully allocated
    expect(queue[1].readyAt).toBe(t0 + growTime);
  });

  it("reschedules both remaining packs when removing first of 3 packs", () => {
    const growTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const t0 = now + 10000;
    const t1 = t0 + growTime;

    const result = removeCropMachinePack({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(20),
          "Potato Seed": new Decimal(10),
        },
        buildings: {
          "Crop Machine": [
            createCropMachineWithQueue([
              {
                crop: "Sunflower",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: now + 5000,
                readyAt: t0,
              },
              {
                crop: "Potato",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 5,
                startTime: t0,
                readyAt: t1,
              },
              {
                crop: "Pumpkin",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: t1,
                readyAt: t1 + growTime,
              },
            ]),
          ],
        },
      },
      action: {
        type: "cropMachine.packRemoved",
        packIndex: 0,
        machineId: "1",
      },
      createdAt: now,
    });

    const queue = result.buildings["Crop Machine"]?.[0]?.queue ?? [];
    expect(queue).toHaveLength(2);
    expect(queue[0].startTime).toBe(now);
    expect(queue[0].readyAt).toBe(now + growTime);
    expect(queue[1].startTime).toBe(now + growTime);
    expect(queue[1].readyAt).toBe(now + growTime * 2);
  });

  it("does not reschedule when removing last pack", () => {
    const growTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const t0 = now + 5000;
    const t1 = t0 + growTime;

    const result = removeCropMachinePack({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(20),
          "Potato Seed": new Decimal(10),
        },
        buildings: {
          "Crop Machine": [
            createCropMachineWithQueue([
              {
                crop: "Sunflower",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: now - 1000,
                readyAt: t0,
              },
              {
                crop: "Potato",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 5,
                startTime: t0,
                readyAt: t1,
              },
              {
                crop: "Pumpkin",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: t1,
                readyAt: t1 + growTime,
              },
            ]),
          ],
        },
      },
      action: {
        type: "cropMachine.packRemoved",
        packIndex: 2,
        machineId: "1",
      },
      createdAt: now,
    });

    const queue = result.buildings["Crop Machine"]?.[0]?.queue ?? [];
    expect(queue).toHaveLength(2);
    expect(queue[0].readyAt).toBe(t0);
    expect(queue[1].startTime).toBe(t0);
    expect(queue[1].readyAt).toBe(t1);
  });

  it("reschedules both P2 and P3 when removing middle of 4 packs", () => {
    const growTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const t0 = now + 5000;
    const t1 = t0 + growTime;
    const t2 = t1 + growTime;

    const result = removeCropMachinePack({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(20),
          "Potato Seed": new Decimal(10),
          "Pumpkin Seed": new Decimal(10),
        },
        buildings: {
          "Crop Machine": [
            createCropMachineWithQueue([
              {
                crop: "Sunflower",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: now - 1000,
                readyAt: t0,
              },
              {
                crop: "Potato",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 5,
                startTime: t0,
                readyAt: t1,
              },
              {
                crop: "Pumpkin",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: t1,
                readyAt: t2,
              },
              {
                crop: "Cabbage",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: t2,
                readyAt: t2 + growTime,
              },
            ]),
          ],
        },
      },
      action: {
        type: "cropMachine.packRemoved",
        packIndex: 1,
        machineId: "1",
      },
      createdAt: now,
    });

    const queue = result.buildings["Crop Machine"]?.[0]?.queue ?? [];
    expect(queue).toHaveLength(3);
    expect(queue[1].startTime).toBe(t0);
    expect(queue[1].readyAt).toBe(t0 + growTime);
    expect(queue[2].startTime).toBe(t0 + growTime);
    expect(queue[2].readyAt).toBe(t0 + growTime * 2);
  });

  it("uses P0.readyAt as anchor when P2 stays partially allocated after refund", () => {
    const growTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const t0 = now + 5000;
    const refundFromP1 = growTime * 0.1;
    const p2NeedsMore = growTime * 0.5;

    const result = removeCropMachinePack({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(20),
          "Potato Seed": new Decimal(10),
        },
        buildings: {
          "Crop Machine": [
            createCropMachineWithQueue([
              {
                crop: "Sunflower",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: now - 1000,
                readyAt: t0,
              },
              {
                crop: "Potato",
                growTimeRemaining: growTime - refundFromP1,
                totalGrowTime: growTime,
                seeds: 5,
                startTime: t0,
                growsUntil: t0 + refundFromP1,
              },
              {
                crop: "Pumpkin",
                growTimeRemaining: p2NeedsMore,
                totalGrowTime: growTime,
                seeds: 10,
                growsUntil: t0 + growTime + (growTime - p2NeedsMore),
              },
            ]),
          ],
        },
      },
      action: {
        type: "cropMachine.packRemoved",
        packIndex: 1,
        machineId: "1",
      },
      createdAt: now,
    });

    const queue = result.buildings["Crop Machine"]?.[0]?.queue ?? [];
    expect(queue).toHaveLength(2);
    expect(queue[1].startTime).toBe(t0);
    expect(queue[1].growsUntil).toBeDefined();
  });

  it("refunded oil allocates unallocated downstream pack", () => {
    const growTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const t0 = now + 5000;

    const result = removeCropMachinePack({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(20),
          "Potato Seed": new Decimal(10),
        },
        buildings: {
          "Crop Machine": [
            createCropMachineWithQueue([
              {
                crop: "Sunflower",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: now - 1000,
                readyAt: t0,
              },
              {
                crop: "Potato",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 5,
                startTime: t0,
                readyAt: t0 + growTime,
              },
              {
                crop: "Pumpkin",
                growTimeRemaining: growTime,
                totalGrowTime: growTime,
                seeds: 10,
              },
            ]),
          ],
        },
      },
      action: {
        type: "cropMachine.packRemoved",
        packIndex: 1,
        machineId: "1",
      },
      createdAt: now,
    });

    const queue = result.buildings["Crop Machine"]?.[0]?.queue ?? [];
    expect(queue).toHaveLength(2);
    expect(queue[1].startTime).toBeDefined();
    expect(queue[1].readyAt ?? queue[1].growsUntil).toBeDefined();
  });

  it("anchors next pack to prev.growsUntil when prev has no readyAt (partially allocated)", () => {
    const growTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const t0 = now + 5000;
    const p0GrowsUntil = t0 + growTime * 0.5;

    const result = removeCropMachinePack({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(20),
          "Potato Seed": new Decimal(10),
        },
        buildings: {
          "Crop Machine": [
            createCropMachineWithQueue([
              {
                crop: "Sunflower",
                growTimeRemaining: growTime * 0.5,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: t0,
                growsUntil: p0GrowsUntil,
              },
              {
                crop: "Potato",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 5,
                startTime: p0GrowsUntil,
                readyAt: p0GrowsUntil + growTime,
              },
              {
                crop: "Pumpkin",
                growTimeRemaining: 0,
                totalGrowTime: growTime,
                seeds: 10,
                startTime: p0GrowsUntil + growTime,
                readyAt: p0GrowsUntil + growTime * 2,
              },
            ]),
          ],
        },
      },
      action: {
        type: "cropMachine.packRemoved",
        packIndex: 1,
        machineId: "1",
      },
      createdAt: now,
    });

    const queue = result.buildings["Crop Machine"]?.[0]?.queue ?? [];
    expect(queue).toHaveLength(2);
    expect(queue[1].startTime).toBe(p0GrowsUntil);
    expect(queue[1].readyAt).toBe(p0GrowsUntil + growTime);
  });

  it("schedules new head when removing unallocated pack at index 0 with unallocatedOilTime", () => {
    const growTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);

    const result = removeCropMachinePack({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(20),
          "Potato Seed": new Decimal(10),
        },
        buildings: {
          "Crop Machine": [
            createCropMachineWithQueue(
              [
                {
                  crop: "Sunflower",
                  growTimeRemaining: growTime,
                  totalGrowTime: growTime,
                  seeds: 10,
                },
                {
                  crop: "Potato",
                  growTimeRemaining: growTime,
                  totalGrowTime: growTime,
                  seeds: 5,
                },
              ],
              growTime,
            ),
          ],
        },
      },
      action: {
        type: "cropMachine.packRemoved",
        packIndex: 0,
        machineId: "1",
      },
      createdAt: now,
    });

    const queue = result.buildings["Crop Machine"]?.[0]?.queue ?? [];
    expect(queue).toHaveLength(1);
    expect(queue[0].startTime).toBeDefined();
    expect(queue[0].readyAt).toBeDefined();
  });

  it("treats startTime 0 as started (removal blocked)", () => {
    const totalGrowTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    expect(() =>
      removeCropMachinePack({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [
              createCropMachineWithQueue([
                {
                  crop: "Sunflower",
                  growTimeRemaining: totalGrowTime / 2,
                  totalGrowTime,
                  seeds: 10,
                  startTime: 0,
                  growsUntil: now + 5000,
                },
              ]),
            ],
          },
        },
        action: {
          type: "cropMachine.packRemoved",
          packIndex: 0,
          machineId: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Pack has already started");
  });
});
