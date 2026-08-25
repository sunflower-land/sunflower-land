import {
  getDisplaySeconds,
  getPreActionDisplay,
  getPreActionTime,
  getSurfacedSpeed,
  getTickIntervalMs,
  projectSeconds,
} from "./timerDisplay";
import type { BoostWindow } from "./boostWindows";

const HOUR = 60 * 60;
const HOUR_MS = HOUR * 1000;

describe("getDisplaySeconds", () => {
  it("shows the work reading by default (speed view)", () => {
    expect(
      getDisplaySeconds({
        showActualTime: false,
        workLeftSeconds: 3 * HOUR,
        countdownSeconds: 1.5 * HOUR,
      }),
    ).toEqual(3 * HOUR);
  });

  it("shows the wall-clock reading when the setting is on", () => {
    expect(
      getDisplaySeconds({
        showActualTime: true,
        workLeftSeconds: 3 * HOUR,
        countdownSeconds: 1.5 * HOUR,
      }),
    ).toEqual(1.5 * HOUR);
  });

  it("is the same number either way when nothing is boosting", () => {
    // An unboosted task accrues work at 1×, so the two readings coincide — which
    // is why the toggle is invisible on most of the farm.
    const unboosted = { workLeftSeconds: 2 * HOUR, countdownSeconds: 2 * HOUR };

    expect(getDisplaySeconds({ showActualTime: false, ...unboosted })).toEqual(
      getDisplaySeconds({ showActualTime: true, ...unboosted }),
    );
  });
});

describe("getTickIntervalMs", () => {
  it("ticks once a second in the wall-clock view, whatever the speed", () => {
    expect(getTickIntervalMs({ showActualTime: true, speed: 1 })).toEqual(1000);
    expect(getTickIntervalMs({ showActualTime: true, speed: 4 })).toEqual(1000);
  });

  it("ticks once a second in the speed view when nothing is boosting", () => {
    expect(getTickIntervalMs({ showActualTime: false, speed: 1 })).toEqual(
      1000,
    );
  });

  it("ticks faster in the speed view so the work reading drops ~1s per tick", () => {
    expect(getTickIntervalMs({ showActualTime: false, speed: 2 })).toEqual(500);
    expect(getTickIntervalMs({ showActualTime: false, speed: 4 })).toEqual(250);
  });

  it("floors at 250ms so a big stack cannot spin the render loop", () => {
    expect(getTickIntervalMs({ showActualTime: false, speed: 100 })).toEqual(
      250,
    );
  });

  it("never speeds up below 1× (a debuff must not slow the clock)", () => {
    expect(getTickIntervalMs({ showActualTime: false, speed: 0.5 })).toEqual(
      1000,
    );
  });
});

describe("projectSeconds", () => {
  const at = 1_000_000;

  it("returns the duration unchanged when no window applies", () => {
    expect(projectSeconds({ seconds: 4 * HOUR, windows: [], at })).toEqual(
      4 * HOUR,
    );
  });

  it("halves a task fully covered by a 2× window", () => {
    const windows: BoostWindow[] = [
      { from: at, to: at + 10 * HOUR_MS, speed: 2 },
    ];

    expect(projectSeconds({ seconds: 4 * HOUR, windows, at })).toEqual(
      2 * HOUR,
    );
  });

  it("credits only the covered part when the window expires mid-task", () => {
    // 1h at 2× = 2h of the 4h work, leaving 2h to run at 1× → 3h in total.
    const windows: BoostWindow[] = [{ from: at, to: at + HOUR_MS, speed: 2 }];
    const projected = projectSeconds({ seconds: 4 * HOUR, windows, at });

    expect(projected).toEqual(3 * HOUR);
    // Longer than the naive work/speed, shorter than un-boosted: the whole point
    // of projecting rather than dividing.
    expect(projected).toBeGreaterThan(4 * HOUR * 0.5);
    expect(projected).toBeLessThan(4 * HOUR);
  });

  it("ignores a window that has already closed", () => {
    const windows: BoostWindow[] = [
      { from: at - 10 * HOUR_MS, to: at - HOUR_MS, speed: 2 },
    ];

    expect(projectSeconds({ seconds: 4 * HOUR, windows, at })).toEqual(
      4 * HOUR,
    );
  });

  it("credits a window that only starts later in the task", () => {
    // 1h at 1×, then 2× for the remaining 3h of work → 1h + 1.5h = 2.5h.
    const windows: BoostWindow[] = [
      { from: at + HOUR_MS, to: at + 10 * HOUR_MS, speed: 2 },
    ];

    expect(projectSeconds({ seconds: 4 * HOUR, windows, at })).toEqual(
      2.5 * HOUR,
    );
  });

  it("stacks overlapping windows multiplicatively", () => {
    const windows: BoostWindow[] = [
      { from: at, to: at + 10 * HOUR_MS, speed: 2 },
      { from: at, to: at + 10 * HOUR_MS, speed: 1.35 },
    ];

    expect(projectSeconds({ seconds: 4 * HOUR, windows, at })).toBeCloseTo(
      (4 * HOUR) / 2.7,
      5,
    );
  });
});

describe("getSurfacedSpeed", () => {
  it("reports the live rate in the speed view", () => {
    expect(getSurfacedSpeed({ showActualTime: false, speed: 1.25 })).toEqual(
      1.25,
    );
  });

  it("reports no rate in the actual-time view, whatever is running", () => {
    // Every ⚡ in the game keys off this being > 1, so suppressing it here turns
    // off the popover rate AND the in-world tile indicator together.
    expect(getSurfacedSpeed({ showActualTime: true, speed: 1.25 })).toEqual(1);
  });

  it("is 1 either way when nothing is boosting", () => {
    expect(getSurfacedSpeed({ showActualTime: false, speed: 1 })).toEqual(1);
    expect(getSurfacedSpeed({ showActualTime: true, speed: 1 })).toEqual(1);
  });
});

describe("getPreActionTime", () => {
  const at = 1_000_000;
  const seconds = 4 * HOUR;
  // A 1.35× hourglass with only 30 minutes left to run.
  const expiring: BoostWindow[] = [
    { from: at - HOUR_MS, to: at + HOUR_MS / 2, speed: 1.35 },
  ];

  it("keeps the un-projected duration and reports the live speed in the speed view", () => {
    expect(
      getPreActionTime({
        showActualTime: false,
        seconds,
        windows: expiring,
        at,
      }),
    ).toEqual({ displaySeconds: seconds, speed: 1.35 });
  });

  it("projects the duration in the actual-time view", () => {
    const { displaySeconds } = getPreActionTime({
      showActualTime: true,
      seconds,
      windows: expiring,
      at,
    });

    // Only the last 30 min of the hourglass covers the grow: 0.5h at 1.35× banks
    // 40.5min of work, leaving 3h19.5m to run at 1× → 3h 49.5m.
    expect(displaySeconds).toBeCloseTo(3.825 * HOUR, 5);
    // Emphatically NOT the naive 4h / 1.35 = 2h 58m.
    expect(displaySeconds).toBeGreaterThan(seconds / 1.35);
  });

  it("reports no rate in the actual-time view, where the duration carries it", () => {
    // The projected number already accounts for the window, so surfacing the
    // rate beside it would state the same boost twice.
    expect(
      getPreActionTime({
        showActualTime: true,
        seconds,
        windows: expiring,
        at,
      }).speed,
    ).toEqual(1);
  });

  it("reports speed 1 and an unchanged duration with nothing running", () => {
    expect(
      getPreActionTime({ showActualTime: true, seconds, windows: [], at }),
    ).toEqual({ displaySeconds: seconds, speed: 1 });
  });
});

describe("getPreActionDisplay", () => {
  const at = 1_000_000;
  const base = 4 * HOUR;
  const live: BoostWindow[] = [{ from: at, to: at + 10 * HOUR_MS, speed: 2 }];

  const call = (
    args: Partial<Parameters<typeof getPreActionDisplay>[0]> = {},
  ) =>
    getPreActionDisplay({
      showActualTime: false,
      seconds: base,
      baseSeconds: base,
      namedBoostCount: 0,
      windows: [],
      at,
      ...args,
    });

  it("stays plain with no boost of either kind", () => {
    expect(call()).toEqual({
      displaySeconds: base,
      speed: 1,
      hasNamedBoosts: false,
      isBoosted: false,
    });
  });

  it("uses the boosted layout for a live window alone, but isn't clickable", () => {
    // The window has no name to itemise, so the panel shows the rate without
    // offering a boost list.
    expect(call({ windows: live })).toMatchObject({
      speed: 2,
      hasNamedBoosts: false,
      isBoosted: true,
    });
  });

  it("drops the rate but keeps the boosted layout in the actual-time view", () => {
    // No rate to show, yet the projected 2h against a 4h base is still a boost.
    expect(call({ windows: live, showActualTime: true })).toEqual({
      displaySeconds: 2 * HOUR,
      speed: 1,
      hasNamedBoosts: false,
      isBoosted: true,
    });
  });

  it("is clickable when a named boost shortened the time", () => {
    expect(call({ seconds: 3 * HOUR, namedBoostCount: 1 })).toMatchObject({
      hasNamedBoosts: true,
      isBoosted: true,
    });
  });

  it("combines a named boost with a live window in the actual-time view", () => {
    const { displaySeconds, isBoosted, hasNamedBoosts } = call({
      showActualTime: true,
      seconds: 3 * HOUR,
      namedBoostCount: 1,
      windows: live,
    });

    // The 3h already carries the named boost; the window halves it on top.
    expect(displaySeconds).toEqual(1.5 * HOUR);
    expect(isBoosted).toBe(true);
    expect(hasNamedBoosts).toBe(true);
  });

  it("does not claim a boost for a debuffed (longer) time", () => {
    expect(call({ seconds: 5 * HOUR, namedBoostCount: 1 })).toMatchObject({
      isBoosted: true, // named boosts differ from base — existing behaviour
    });
    expect(call({ seconds: 5 * HOUR })).toMatchObject({ isBoosted: false });
  });
});
