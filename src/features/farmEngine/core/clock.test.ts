import { FarmClock, readNodeTimer } from "./clock";

describe("readNodeTimer", () => {
  it("uses legacy back-dated timing when baseDurationMs is absent", () => {
    const reading = readNodeTimer(
      { startedAt: 0, windows: [], legacyReadyAt: 100_000 },
      25_000,
    );

    expect(reading.readyAt).toEqual(100_000);
    expect(reading.progress).toBeCloseTo(0.25);
    expect(reading.ready).toBe(false);
  });

  it("derives readyAt from boost windows on the speed-rate model", () => {
    // 100s of work at 2x for the first 25s: 50s of work done by t=25s,
    // remaining 50s at 1x -> ready at 75s.
    const spec = {
      startedAt: 0,
      baseDurationMs: 100_000,
      windows: [{ from: 0, to: 25_000, speed: 2 }],
      legacyReadyAt: 999_999_999, // must be ignored on this model
    };

    expect(readNodeTimer(spec, 0).readyAt).toEqual(75_000);
    expect(readNodeTimer(spec, 25_000).progress).toBeCloseTo(0.5);
    expect(readNodeTimer(spec, 75_000).ready).toBe(true);
  });
});

describe("FarmClock", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const makeSpec = () => ({
    startedAt: 0,
    windows: [],
    legacyReadyAt: 100_000,
    stageFractions: [0.25, 0.5, 1],
  });

  it("fires when progress crosses a registered stage fraction", () => {
    const clock = new FarmClock();
    const onStage = jest.fn();
    clock.register("crop-1", makeSpec(), onStage);

    jest.setSystemTime(30_000);
    clock.tick(1000);

    expect(onStage).toHaveBeenCalledTimes(1);
    expect(onStage.mock.calls[0][0].progress).toBeCloseTo(0.3);
  });

  it("fires each stage once, including completion, then goes quiet", () => {
    const clock = new FarmClock();
    const onStage = jest.fn();
    clock.register("crop-1", makeSpec(), onStage);

    jest.setSystemTime(30_000);
    clock.tick(1000);
    jest.setSystemTime(120_000);
    clock.tick(1000);
    clock.tick(1000);
    clock.tick(1000);

    // once for 0.25, once for 0.5 + 1 together (batched into one call)
    expect(onStage).toHaveBeenCalledTimes(2);
    expect(onStage.mock.calls[1][0].ready).toBe(true);
  });

  it("only fires on whole-second accumulation", () => {
    const clock = new FarmClock();
    const onStage = jest.fn();
    clock.register("crop-1", makeSpec(), onStage);

    jest.setSystemTime(30_000);
    clock.tick(400);
    clock.tick(400);
    expect(onStage).not.toHaveBeenCalled();

    clock.tick(400);
    expect(onStage).toHaveBeenCalledTimes(1);
  });

  it("stops firing after the entry is unregistered", () => {
    const clock = new FarmClock();
    const onStage = jest.fn();
    const unregister = clock.register("crop-1", makeSpec(), onStage);

    unregister();
    jest.setSystemTime(120_000);
    clock.tick(1000);

    expect(onStage).not.toHaveBeenCalled();
  });
});
