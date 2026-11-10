import { removeCropMachinePack } from "./removeCropMachinePack";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { CROP_MACHINE_PLOTS } from "./supplyCropMachine";
import Decimal from "decimal.js-light";
import type {
  CropMachineBuilding,
  CropMachineQueueItem,
} from "features/game/types/game";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
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

  it("re-chains the downstream pack when removing the middle of 3 packs (fully fuelled)", () => {
    const growTime = (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE);
    const t0 = now + 5000;
    const tank = 5000 + growTime * 2;

    const result = removeCropMachinePack({
      state: {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": new Decimal(20),
          "Potato Seed": new Decimal(10),
        },
        buildings: {
          "Crop Machine": [
            {
              ...createCropMachineWithQueue(
                [
                  {
                    crop: "Sunflower",
                    growTimeRemaining: 0,
                    totalGrowTime: growTime,
                    baseDurationMs: 5000,
                    seeds: 10,
                    startTime: now - 1000,
                  },
                  {
                    crop: "Potato",
                    growTimeRemaining: 0,
                    totalGrowTime: growTime,
                    baseDurationMs: growTime,
                    seeds: 5,
                  },
                  {
                    crop: "Pumpkin",
                    growTimeRemaining: 0,
                    totalGrowTime: growTime,
                    baseDurationMs: growTime,
                    seeds: 10,
                  },
                ],
                tank,
              ),
              oilSettledAt: now,
            },
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

    const machine = result.buildings["Crop Machine"]?.[0];
    const queue = machine?.queue ?? [];
    expect(queue).toHaveLength(2);
    expect(queue[0].readyAt).toBe(t0);
    // The resolver re-chains the pack behind the removed one onto the head.
    expect(queue[1].startTime).toBe(t0);
    expect(queue[1].readyAt).toBe(t0 + growTime);
    // Fuel carries no per-pack earmarks: nothing is refunded or taken.
    expect(machine?.unallocatedOilTime).toBe(tank);
  });

  it("funds the downstream pack with the freed fuel when removing the middle of 3 packs (part fuelled)", () => {
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
            {
              // Enough fuel for P0, P1 and half of P2.
              ...createCropMachineWithQueue(
                [
                  {
                    crop: "Sunflower",
                    growTimeRemaining: 0,
                    totalGrowTime: growTime,
                    baseDurationMs: 5000,
                    seeds: 10,
                    startTime: now - 1000,
                  },
                  {
                    crop: "Potato",
                    growTimeRemaining: 0,
                    totalGrowTime: growTime,
                    baseDurationMs: growTime,
                    seeds: 5,
                  },
                  {
                    crop: "Pumpkin",
                    growTimeRemaining: 0,
                    totalGrowTime: growTime,
                    baseDurationMs: growTime,
                    seeds: 10,
                  },
                ],
                5000 + growTime * 1.5,
              ),
              oilSettledAt: now,
            },
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
    // The fuel P1 would have burned now carries P2 all the way to ready.
    expect(queue[1].readyAt).toBe(t0 + growTime);
    expect(queue[1].growsUntil).toBeUndefined();
    expect(queue[1].growTimeRemaining).toBe(0);
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

describe("removeCropMachinePack (windowed SPEED_BOOSTS)", () => {
  const HOUR = 60 * 60 * 1000;

  const stateWithMachine = (machine: Record<string, unknown>): GameState => ({
    ...GAME_STATE,
    buildings: {
      "Crop Machine": [
        {
          coordinates: { x: 0, y: 0 },
          createdAt: 0,
          id: "1",
          readyAt: 0,
          ...machine,
        },
      ],
    },
  });

  const queuedMachine = () => ({
    oilSettledAt: now - HOUR,
    unallocatedOilTime: 2 * HOUR,
    queue: [
      {
        crop: "Sunflower" as const,
        seeds: 10,
        growTimeRemaining: 0,
        totalGrowTime: 4 * HOUR,
        baseDurationMs: 4 * HOUR,
      },
      {
        crop: "Potato" as const,
        seeds: 5,
        growTimeRemaining: 0,
        totalGrowTime: 2 * HOUR,
        baseDurationMs: 2 * HOUR,
      },
    ],
  });

  it("removes a queued pack with a seed refund, no oil arithmetic, and the head undisturbed", () => {
    const state = removeCropMachinePack({
      state: stateWithMachine(queuedMachine()),
      action: { type: "cropMachine.packRemoved", packIndex: 1, machineId: "1" },
      createdAt: now,
    });

    const machine = state.buildings["Crop Machine"]?.[0];
    const head = machine?.queue?.[0];

    expect(state.inventory["Potato Seed"]?.toNumber()).toBe(5);
    expect(machine?.queue).toHaveLength(1);
    // The head grew [anchor, now] = 1h of its 4h (banked by the settle) and
    // stalls when the remaining 1h of fuel runs out; nothing was refunded to
    // or taken from the tank (fuel has no per-pack earmarks).
    expect(head?.baseDurationMs).toBe(3 * HOUR);
    expect(machine?.unallocatedOilTime).toBe(HOUR);
    expect(head?.growsUntil).toBe(now + HOUR);
  });

  it("throws when removing the pack the fuel has reached", () => {
    expect(() =>
      removeCropMachinePack({
        state: stateWithMachine(queuedMachine()),
        action: {
          type: "cropMachine.packRemoved",
          packIndex: 0,
          machineId: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Pack has already started");
  });

  it("throws when removing a pack that stalled part-grown", () => {
    // The pack was anchored 2h ago with 1h of fuel: it grew 1h of its 4h and
    // has been stalled dry since. `resolveCropMachine` gives a pack it cannot
    // fund no `startsAt`, so the derived check alone reads it as never-started
    // — but it has burned oil and banked progress, and legacy has always
    // treated a started pack as a binding commitment.
    const state = stateWithMachine({
      oilSettledAt: now - 2 * HOUR,
      unallocatedOilTime: HOUR,
      queue: [
        {
          crop: "Sunflower" as const,
          seeds: 10,
          growTimeRemaining: 0,
          totalGrowTime: 4 * HOUR,
          baseDurationMs: 4 * HOUR,
          startTime: now - 2 * HOUR,
        },
      ],
    });

    expect(() =>
      removeCropMachinePack({
        state,
        action: {
          type: "cropMachine.packRemoved",
          packIndex: 0,
          machineId: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Pack has already started");
  });

  it("throws when removing a finalised (completed) pack", () => {
    const state = stateWithMachine({
      oilSettledAt: now,
      unallocatedOilTime: 0,
      queue: [
        {
          crop: "Sunflower" as const,
          seeds: 10,
          growTimeRemaining: 0,
          totalGrowTime: HOUR,
          readyAt: now - HOUR,
        },
      ],
    });

    expect(() =>
      removeCropMachinePack({
        state,
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
