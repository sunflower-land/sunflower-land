import { getPreActionDisplay, projectSeconds } from "./timerDisplay";
import type { BoostWindow } from "./boostWindows";

const HOUR = 60 * 60;
const HOUR_MS = HOUR * 1000;

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

  it("does not project through the naive division when a booster is expiring", () => {
    // A 1.35× hourglass with only 30 minutes left to run: 0.5h at 1.35× banks
    // 40.5min of work, leaving 3h19.5m to run at 1× → 3h 49.5m.
    const expiring: BoostWindow[] = [
      { from: at - HOUR_MS, to: at + HOUR_MS / 2, speed: 1.35 },
    ];
    const projected = projectSeconds({
      seconds: 4 * HOUR,
      windows: expiring,
      at,
    });

    expect(projected).toBeCloseTo(3.825 * HOUR, 5);
    // Emphatically NOT the naive 4h / 1.35 = 2h 58m.
    expect(projected).toBeGreaterThan((4 * HOUR) / 1.35);
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
      hasNamedBoosts: false,
      isBoosted: false,
    });
  });

  it("projects a live window and uses the boosted layout, but isn't clickable", () => {
    // The window has no name to itemise, so the panel shows the shorter
    // projected time without offering a boost list.
    expect(call({ windows: live })).toEqual({
      displaySeconds: 2 * HOUR,
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

  it("combines a named boost with a live window", () => {
    const { displaySeconds, isBoosted, hasNamedBoosts } = call({
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
