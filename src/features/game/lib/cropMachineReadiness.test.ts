import type {
  CropMachineBuilding,
  CropMachineQueueItem,
} from "features/game/types/game";
import type { BoostWindow } from "./boostWindows";
import { CROP_MACHINE_BOOST_SPEED } from "./boostWindows";
import {
  convertCropMachineToWindowed,
  getCropMachineFuelAt,
  getCropMachinePackProgress,
  getCropMachineSpeedAt,
  resolveCropMachine,
  settleCropMachine,
} from "./cropMachineReadiness";

const HOUR = 60 * 60 * 1000;
const T0 = 1_700_000_000_000;

const windowedPack = (
  baseDurationMs: number,
  overrides: Partial<CropMachineQueueItem> = {},
): CropMachineQueueItem => ({
  crop: "Sunflower",
  seeds: 10,
  growTimeRemaining: 0,
  totalGrowTime: baseDurationMs,
  baseDurationMs,
  ...overrides,
});

const machine = (
  queue: CropMachineQueueItem[],
  unallocatedOilTime: number,
  overrides: Partial<CropMachineBuilding> = {},
): CropMachineBuilding => ({
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  id: "1",
  readyAt: 0,
  queue,
  unallocatedOilTime,
  oilSettledAt: T0,
  ...overrides,
});

const speed2 = (from: number, to: number): BoostWindow => ({
  from,
  to,
  speed: 2,
});

describe("resolveCropMachine", () => {
  it("resolves a single fuelled pack to start + baseDurationMs with no windows", () => {
    const timings = resolveCropMachine({
      machine: machine([windowedPack(2 * HOUR)], 10 * HOUR),
      windows: [],
    });

    expect(timings.packs[0]).toEqual({
      startsAt: T0,
      readyAt: T0 + 2 * HOUR,
      workRemainingMs: 0,
    });
    expect(timings.fuelRemainingMs).toBe(8 * HOUR);
    expect(timings.fuelRunsOutAt).toBeUndefined();
  });

  it("chains packs sequentially", () => {
    const timings = resolveCropMachine({
      machine: machine(
        [windowedPack(2 * HOUR), windowedPack(3 * HOUR)],
        10 * HOUR,
      ),
      windows: [],
    });

    expect(timings.packs[0].readyAt).toBe(T0 + 2 * HOUR);
    expect(timings.packs[1].startsAt).toBe(T0 + 2 * HOUR);
    expect(timings.packs[1].readyAt).toBe(T0 + 5 * HOUR);
    expect(timings.fuelRemainingMs).toBe(5 * HOUR);
  });

  it("stalls at anchor + fuel when the tank empties mid-pack", () => {
    const timings = resolveCropMachine({
      machine: machine([windowedPack(5 * HOUR), windowedPack(HOUR)], 2 * HOUR),
      windows: [],
    });

    expect(timings.packs[0]).toEqual({
      startsAt: T0,
      growsUntil: T0 + 2 * HOUR,
      workRemainingMs: 3 * HOUR,
    });
    // Everything behind the stall never starts.
    expect(timings.packs[1]).toEqual({ workRemainingMs: HOUR });
    expect(timings.fuelRunsOutAt).toBe(T0 + 2 * HOUR);
    expect(timings.fuelRemainingMs).toBe(0);
  });

  it("never starts a pack on an empty tank", () => {
    const timings = resolveCropMachine({
      machine: machine([windowedPack(2 * HOUR)], 0),
      windows: [],
    });

    expect(timings.packs[0]).toEqual({ workRemainingMs: 2 * HOUR });
  });

  it("completes a pack whose finish ties exactly with fuel-out", () => {
    const timings = resolveCropMachine({
      machine: machine([windowedPack(2 * HOUR), windowedPack(HOUR)], 2 * HOUR),
      windows: [],
    });

    expect(timings.packs[0].readyAt).toBe(T0 + 2 * HOUR);
    expect(timings.packs[0].growsUntil).toBeUndefined();
    expect(timings.packs[1]).toEqual({ workRemainingMs: HOUR });
    expect(timings.fuelRemainingMs).toBe(0);
  });

  it("makes a fully-covered pack faster AND cheaper in oil, the surplus flowing to the next pack", () => {
    const timings = resolveCropMachine({
      machine: machine(
        [windowedPack(4 * HOUR), windowedPack(4 * HOUR)],
        5 * HOUR,
      ),
      windows: [speed2(T0, T0 + 10 * HOUR)],
    });

    // 4h of work at 2× takes 2h of wall clock and burns 2h of fuel.
    expect(timings.packs[0].readyAt).toBe(T0 + 2 * HOUR);
    expect(timings.packs[1].startsAt).toBe(T0 + 2 * HOUR);
    expect(timings.packs[1].readyAt).toBe(T0 + 4 * HOUR);
    expect(timings.fuelRemainingMs).toBe(HOUR);
  });

  it("credits only the overlap of a window that expires mid-pack", () => {
    const timings = resolveCropMachine({
      machine: machine([windowedPack(4 * HOUR)], 10 * HOUR),
      windows: [speed2(T0, T0 + HOUR)],
    });

    // 1h at 2× = 2h of work; the remaining 2h accrues at 1×.
    expect(timings.packs[0].readyAt).toBe(T0 + 3 * HOUR);
    expect(timings.fuelRemainingMs).toBe(7 * HOUR);
  });

  it("applies a window placed mid-grow to the remainder (retroactive speed-up saves fuel)", () => {
    const timings = resolveCropMachine({
      machine: machine([windowedPack(4 * HOUR)], 10 * HOUR),
      windows: [speed2(T0 + HOUR, T0 + 10 * HOUR)],
    });

    // 1h at 1×, then 3h of work at 2× = 1.5h of wall clock.
    expect(timings.packs[0].readyAt).toBe(T0 + 2.5 * HOUR);
    expect(timings.fuelRemainingMs).toBe(7.5 * HOUR);
  });

  it("reproduces the legacy ×0.9 under a full-coverage Tortoise window", () => {
    const speed = CROP_MACHINE_BOOST_SPEED["Tortoise Shrine"];
    const timings = resolveCropMachine({
      machine: machine([windowedPack(9 * HOUR)], 20 * HOUR),
      windows: [{ from: T0, to: T0 + 20 * HOUR, speed }],
    });

    expect(timings.packs[0].readyAt).toBeCloseTo(T0 + 8.1 * HOUR, 5);
  });

  it("accrues nothing over a stall — a window covering the stalled interval is never intersected", () => {
    const timings = resolveCropMachine({
      machine: machine([windowedPack(4 * HOUR)], HOUR),
      windows: [speed2(T0 + 2 * HOUR, T0 + 3 * HOUR)],
    });

    expect(timings.packs[0]).toEqual({
      startsAt: T0,
      growsUntil: T0 + HOUR,
      workRemainingMs: 3 * HOUR,
    });
  });

  it("accrues nothing past a lift (removedAt), without stamping growsUntil", () => {
    const timings = resolveCropMachine({
      machine: machine([windowedPack(4 * HOUR)], 10 * HOUR, {
        removedAt: T0 + HOUR,
      }),
      windows: [],
    });

    expect(timings.packs[0].startsAt).toBe(T0);
    expect(timings.packs[0].growsUntil).toBeUndefined();
    expect(timings.packs[0].readyAt).toBeUndefined();
    expect(timings.packs[0].workRemainingMs).toBe(3 * HOUR);
    expect(timings.fuelRemainingMs).toBe(9 * HOUR);
  });

  it("passes a finalised pack through as immutable history", () => {
    const done: CropMachineQueueItem = {
      crop: "Sunflower",
      seeds: 10,
      growTimeRemaining: 0,
      totalGrowTime: 2 * HOUR,
      readyAt: T0 - HOUR,
    };
    const timings = resolveCropMachine({
      machine: machine([done, windowedPack(2 * HOUR)], 5 * HOUR),
      windows: [speed2(T0 - 2 * HOUR, T0 + 10 * HOUR)],
    });

    expect(timings.packs[0]).toEqual({
      readyAt: T0 - HOUR,
      workRemainingMs: 0,
    });
    // The windowed pack behind it still resolves from the anchor.
    expect(timings.packs[1].startsAt).toBe(T0);
    expect(timings.packs[1].readyAt).toBe(T0 + HOUR);
  });
});

describe("getCropMachineFuelAt", () => {
  it("drains 1:1 with wall clock only while growing", () => {
    const m = machine([windowedPack(2 * HOUR), windowedPack(HOUR)], 10 * HOUR);

    expect(getCropMachineFuelAt({ machine: m, windows: [], at: T0 })).toBe(
      10 * HOUR,
    );
    expect(
      getCropMachineFuelAt({ machine: m, windows: [], at: T0 + HOUR }),
    ).toBe(9 * HOUR);
    // Queue done after 3h; the tank stops draining once the machine idles.
    expect(
      getCropMachineFuelAt({ machine: m, windows: [], at: T0 + 5 * HOUR }),
    ).toBe(7 * HOUR);
  });

  it("stops draining at a stall", () => {
    const m = machine([windowedPack(4 * HOUR)], HOUR);

    expect(
      getCropMachineFuelAt({ machine: m, windows: [], at: T0 + 3 * HOUR }),
    ).toBe(0);
  });
});

describe("getCropMachinePackProgress", () => {
  it("measures work done against totalGrowTime", () => {
    const m = machine([windowedPack(4 * HOUR)], 10 * HOUR);

    expect(
      getCropMachinePackProgress({
        machine: m,
        index: 0,
        windows: [],
        at: T0 + HOUR,
      }),
    ).toBe(25);
  });

  it("fills faster under a window", () => {
    const m = machine([windowedPack(4 * HOUR)], 10 * HOUR);
    const windows = [speed2(T0, T0 + 10 * HOUR)];

    expect(
      getCropMachinePackProgress({
        machine: m,
        index: 0,
        windows,
        at: T0 + HOUR,
      }),
    ).toBe(50);
  });

  it("caps at the stall and counts pre-settlement banked work", () => {
    // Half the work is already banked (totalGrowTime 4h, baseDurationMs 2h);
    // fuel covers one more hour.
    const m = machine(
      [windowedPack(2 * HOUR, { totalGrowTime: 4 * HOUR })],
      HOUR,
    );

    expect(
      getCropMachinePackProgress({
        machine: m,
        index: 0,
        windows: [],
        at: T0 + 3 * HOUR,
      }),
    ).toBe(75);
  });

  it("reports a finalised pack as done", () => {
    const m = machine(
      [windowedPack(4 * HOUR, { baseDurationMs: undefined, readyAt: T0 - 1 })],
      0,
    );

    expect(
      getCropMachinePackProgress({ machine: m, index: 0, windows: [], at: T0 }),
    ).toBe(100);
  });
});

describe("getCropMachineSpeedAt", () => {
  it("is the window product while growing and 1 while idle or stalled", () => {
    const m = machine([windowedPack(2 * HOUR)], HOUR);
    const windows = [speed2(T0 - HOUR, T0 + 10 * HOUR)];

    expect(
      getCropMachineSpeedAt({ machine: m, windows, at: T0 + 30 * 60 * 1000 }),
    ).toBe(2);
    // Stalled at T0 + 1h (fuel out): no growth, no speed.
    expect(
      getCropMachineSpeedAt({ machine: m, windows, at: T0 + 2 * HOUR }),
    ).toBe(1);
  });
});

describe("settleCropMachine", () => {
  it("is behaviour-neutral: resolving a settled machine matches resolving the original", () => {
    const windows = [speed2(T0 + HOUR, T0 + 2 * HOUR)];
    const original = machine(
      [windowedPack(3 * HOUR), windowedPack(2 * HOUR)],
      10 * HOUR,
    );
    const reference = resolveCropMachine({ machine: original, windows });

    const settled = machine(
      [windowedPack(3 * HOUR), windowedPack(2 * HOUR)],
      10 * HOUR,
    );
    settleCropMachine({ machine: settled, windows, now: T0 + 1.5 * HOUR });
    const after = resolveCropMachine({ machine: settled, windows });

    // Head: 1h at 1× + banked 30min at 2× = 2h of the 3h done by t1; the
    // remaining 1h of work finishes at T0+2h under the window's tail.
    expect(settled.oilSettledAt).toBe(T0 + 1.5 * HOUR);
    expect(after.packs[0].readyAt).toBeCloseTo(reference.packs[0].readyAt!, 5);
    expect(after.packs[1].readyAt).toBeCloseTo(reference.packs[1].readyAt!, 5);
    expect(after.fuelRemainingMs).toBeCloseTo(reference.fuelRemainingMs, 5);
  });

  it("is behaviour-neutral across a stall", () => {
    const original = machine([windowedPack(4 * HOUR)], HOUR);
    const reference = resolveCropMachine({ machine: original, windows: [] });

    const settled = machine([windowedPack(4 * HOUR)], HOUR);
    // Settle well after the stall: only the fuelled hour may bank.
    settleCropMachine({ machine: settled, windows: [], now: T0 + 3 * HOUR });
    const after = resolveCropMachine({ machine: settled, windows: [] });

    expect(settled.unallocatedOilTime).toBe(0);
    expect(after.packs[0].workRemainingMs).toBe(
      reference.packs[0].workRemainingMs,
    );
    // Post-settlement the anchor has moved past the stall; the pack simply
    // waits (fuel 0) with the same work owed.
    expect(after.packs[0].startsAt).toBeUndefined();
  });

  it("settling twice at the same instant changes nothing", () => {
    const windows = [speed2(T0, T0 + 10 * HOUR)];
    const m = machine(
      [windowedPack(3 * HOUR), windowedPack(2 * HOUR)],
      4 * HOUR,
    );

    settleCropMachine({ machine: m, windows, now: T0 + HOUR });
    const once = JSON.parse(JSON.stringify(m));
    settleCropMachine({ machine: m, windows, now: T0 + HOUR });

    expect(JSON.parse(JSON.stringify(m))).toEqual(once);
  });

  it("finalises a completed pack into immutable history a later window cannot move", () => {
    const m = machine([windowedPack(HOUR), windowedPack(2 * HOUR)], 10 * HOUR);

    settleCropMachine({ machine: m, windows: [], now: T0 + 2 * HOUR });

    const [head, tail] = m.queue!;
    expect(head.readyAt).toBe(T0 + HOUR);
    expect(head.baseDurationMs).toBeUndefined();
    expect(head.growTimeRemaining).toBe(0);
    expect(head.startTime).toBe(T0);
    expect(tail.baseDurationMs).toBe(HOUR);

    // A window over the whole past changes nothing for the finalised pack.
    const timings = resolveCropMachine({
      machine: m,
      windows: [speed2(T0, T0 + 10 * HOUR)],
    });
    expect(timings.packs[0].readyAt).toBe(T0 + HOUR);
  });

  it("burns fuel through the settlement and advances the anchor", () => {
    const m = machine([windowedPack(4 * HOUR)], 10 * HOUR);

    settleCropMachine({ machine: m, windows: [], now: T0 + HOUR });

    expect(m.unallocatedOilTime).toBe(9 * HOUR);
    expect(m.oilSettledAt).toBe(T0 + HOUR);
    expect(m.queue![0].baseDurationMs).toBe(3 * HOUR);
    // Caches refreshed from the new anchor.
    expect(m.queue![0].readyAt).toBe(T0 + 4 * HOUR);
    expect(m.queue![0].growTimeRemaining).toBe(0);
    expect(m.queue![0].startTime).toBe(T0);
  });

  it("resumes a stalled pack from the refuel settlement, the stall gap costing nothing", () => {
    const m = machine([windowedPack(4 * HOUR)], HOUR);

    // Tank ran dry at T0+1h; the player refuels at T0+2h (the oil event
    // settles first, then adds fuel).
    settleCropMachine({ machine: m, windows: [], now: T0 + 2 * HOUR });
    m.unallocatedOilTime = (m.unallocatedOilTime ?? 0) + HOUR;

    const timings = resolveCropMachine({ machine: m, windows: [] });
    expect(m.queue![0].baseDurationMs).toBe(3 * HOUR);
    expect(timings.packs[0].startsAt).toBe(T0 + 2 * HOUR);
    expect(timings.packs[0].growsUntil).toBe(T0 + 3 * HOUR);
    expect(timings.packs[0].workRemainingMs).toBe(2 * HOUR);
  });

  it("no-ops on a legacy machine", () => {
    const legacy: CropMachineBuilding = {
      coordinates: { x: 0, y: 0 },
      createdAt: 0,
      id: "1",
      readyAt: 0,
      queue: [
        {
          crop: "Sunflower",
          seeds: 10,
          growTimeRemaining: 0,
          totalGrowTime: HOUR,
          startTime: T0,
          readyAt: T0 + HOUR,
        },
      ],
      unallocatedOilTime: 2 * HOUR,
    };
    const before = JSON.parse(JSON.stringify(legacy));

    settleCropMachine({
      machine: legacy,
      windows: [],
      now: T0 + 30 * 60 * 1000,
    });

    expect(JSON.parse(JSON.stringify(legacy))).toEqual(before);
  });
});

describe("convertCropMachineToWindowed", () => {
  const legacyMachine = (
    queue: CropMachineQueueItem[],
    unallocatedOilTime = 0,
  ): CropMachineBuilding => ({
    coordinates: { x: 0, y: 0 },
    createdAt: 0,
    id: "1",
    readyAt: 0,
    queue,
    unallocatedOilTime,
  });

  it("skips a ready pack, leaving it as legacy completed history", () => {
    const m = legacyMachine([
      {
        crop: "Sunflower",
        seeds: 10,
        growTimeRemaining: 0,
        totalGrowTime: HOUR,
        startTime: T0 - 2 * HOUR,
        readyAt: T0 - HOUR,
      },
    ]);

    convertCropMachineToWindowed({ machine: m, windows: [], now: T0 });

    expect(m.oilSettledAt).toBe(T0);
    expect(m.queue![0].baseDurationMs).toBeUndefined();
    expect(m.queue![0].readyAt).toBe(T0 - HOUR);
  });

  it("freezes a fully-allocated in-flight pack and reclaims its earmark (timing-neutral at 1×)", () => {
    const m = legacyMachine(
      [
        {
          crop: "Sunflower",
          seeds: 10,
          growTimeRemaining: 0,
          totalGrowTime: 3 * HOUR,
          startTime: T0 - HOUR,
          readyAt: T0 + 2 * HOUR,
        },
      ],
      HOUR,
    );

    convertCropMachineToWindowed({ machine: m, windows: [], now: T0 });

    expect(m.queue![0].baseDurationMs).toBe(2 * HOUR);
    expect(m.unallocatedOilTime).toBe(3 * HOUR);

    const timings = resolveCropMachine({ machine: m, windows: [] });
    expect(timings.packs[0].readyAt).toBe(T0 + 2 * HOUR);
    expect(timings.fuelRemainingMs).toBe(HOUR);
  });

  it("freezes a scheduled future pack at its full remaining schedule, preserving the chain", () => {
    const m = legacyMachine([
      {
        crop: "Sunflower",
        seeds: 10,
        growTimeRemaining: 0,
        totalGrowTime: 2 * HOUR,
        startTime: T0 - HOUR,
        readyAt: T0 + HOUR,
      },
      {
        crop: "Potato",
        seeds: 10,
        growTimeRemaining: 0,
        totalGrowTime: 3 * HOUR,
        startTime: T0 + HOUR,
        readyAt: T0 + 4 * HOUR,
      },
    ]);

    convertCropMachineToWindowed({ machine: m, windows: [], now: T0 });

    expect(m.queue![0].baseDurationMs).toBe(HOUR);
    expect(m.queue![1].baseDurationMs).toBe(3 * HOUR);
    expect(m.unallocatedOilTime).toBe(4 * HOUR);

    const timings = resolveCropMachine({ machine: m, windows: [] });
    expect(timings.packs[0].readyAt).toBe(T0 + HOUR);
    expect(timings.packs[1].readyAt).toBe(T0 + 4 * HOUR);
    expect(timings.fuelRemainingMs).toBe(0);
  });

  it("freezes a partially-allocated pack, reclaiming only the funded remainder", () => {
    const m = legacyMachine([
      {
        crop: "Sunflower",
        seeds: 10,
        growTimeRemaining: 2 * HOUR,
        totalGrowTime: 4 * HOUR,
        startTime: T0 - HOUR,
        growsUntil: T0 + HOUR,
      },
    ]);

    convertCropMachineToWindowed({ machine: m, windows: [], now: T0 });

    expect(m.queue![0].baseDurationMs).toBe(3 * HOUR);
    expect(m.unallocatedOilTime).toBe(HOUR);

    const timings = resolveCropMachine({ machine: m, windows: [] });
    expect(timings.packs[0].growsUntil).toBe(T0 + HOUR);
    expect(timings.packs[0].workRemainingMs).toBe(2 * HOUR);
  });

  it("freezes a stalled pack with nothing to reclaim", () => {
    const m = legacyMachine([
      {
        crop: "Sunflower",
        seeds: 10,
        growTimeRemaining: 2 * HOUR,
        totalGrowTime: 4 * HOUR,
        startTime: T0 - 3 * HOUR,
        growsUntil: T0 - HOUR,
      },
    ]);

    convertCropMachineToWindowed({ machine: m, windows: [], now: T0 });

    expect(m.queue![0].baseDurationMs).toBe(2 * HOUR);
    expect(m.queue![0].growsUntil).toBeUndefined();
    expect(m.unallocatedOilTime).toBe(0);

    const timings = resolveCropMachine({ machine: m, windows: [] });
    expect(timings.packs[0].startsAt).toBeUndefined();
    expect(timings.packs[0].workRemainingMs).toBe(2 * HOUR);
  });

  it("freezes an unstarted pack at its unfunded work", () => {
    const m = legacyMachine([
      {
        crop: "Sunflower",
        seeds: 10,
        growTimeRemaining: 4 * HOUR,
        totalGrowTime: 4 * HOUR,
      },
    ]);

    convertCropMachineToWindowed({ machine: m, windows: [], now: T0 });

    expect(m.queue![0].baseDurationMs).toBe(4 * HOUR);
  });

  it("is idempotent", () => {
    const m = legacyMachine(
      [
        {
          crop: "Sunflower",
          seeds: 10,
          growTimeRemaining: 0,
          totalGrowTime: 3 * HOUR,
          startTime: T0 - HOUR,
          readyAt: T0 + 2 * HOUR,
        },
      ],
      HOUR,
    );

    convertCropMachineToWindowed({ machine: m, windows: [], now: T0 });
    const once = JSON.parse(JSON.stringify(m));
    convertCropMachineToWindowed({ machine: m, windows: [], now: T0 + HOUR });

    expect(JSON.parse(JSON.stringify(m))).toEqual(once);
  });

  it("does NOT instantly grow a part-grown pack under an active window (the migration bug)", () => {
    const G = 5 * HOUR;
    // 60% grown: 2h of the 5h remain.
    const m = legacyMachine([
      {
        crop: "Sunflower",
        seeds: 10,
        growTimeRemaining: 0,
        totalGrowTime: G,
        startTime: T0 - 3 * HOUR,
        readyAt: T0 + 2 * HOUR,
      },
    ]);
    const speed = CROP_MACHINE_BOOST_SPEED["Tortoise Shrine"];
    const windows = [{ from: T0 - 4 * HOUR, to: T0 + 4 * HOUR, speed }];

    convertCropMachineToWindowed({ machine: m, windows, now: T0 });

    const timings = resolveCropMachine({ machine: m, windows });
    // Only the REMAINDER is windowed: 2h of work at 10/9 speed = 1.8h of wall
    // clock — never `<= now`.
    expect(timings.packs[0].readyAt).toBeCloseTo(T0 + 1.8 * HOUR, 5);
    expect(timings.packs[0].readyAt!).toBeGreaterThan(T0);
  });
});
