import { startCacheStorageHeartbeat } from "./cacheStorageHeartbeat";

/** Resolves to true if `promise` has already settled. */
const isSettled = (promise: Promise<void>) =>
  Promise.race([promise.then(() => true), Promise.resolve().then(() => false)]);

describe("startCacheStorageHeartbeat", () => {
  const url = "https://sunflower-land.com/game-assets/icons/disc.png";
  const cacheName = "protected-icons";

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("matches the cache entry once per interval and stops after the tick budget", async () => {
    const match = jest.fn().mockResolvedValue(undefined);

    const { done } = startCacheStorageHeartbeat({
      caches: { match },
      cacheName,
      url,
      ticks: 3,
      intervalMs: 1000,
    });

    expect(match).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(match).toHaveBeenCalledTimes(1);
    expect(match).toHaveBeenCalledWith(url, { cacheName });
    expect(await isSettled(done)).toBe(false);

    jest.advanceTimersByTime(2000);
    expect(match).toHaveBeenCalledTimes(3);
    expect(await isSettled(done)).toBe(true);

    // Budget spent: no further calls however long we wait.
    jest.advanceTimersByTime(60_000);
    expect(match).toHaveBeenCalledTimes(3);
  });

  it("keeps ticking when a match rejects", async () => {
    const match = jest
      .fn()
      .mockRejectedValueOnce(new Error("storage unavailable"))
      .mockResolvedValue(undefined);

    const { done } = startCacheStorageHeartbeat({
      caches: { match },
      cacheName,
      url,
      ticks: 2,
      intervalMs: 1000,
    });

    jest.advanceTimersByTime(1000);
    // Let the rejection settle; it must not surface as an unhandled rejection.
    await Promise.resolve();
    jest.advanceTimersByTime(1000);

    expect(match).toHaveBeenCalledTimes(2);
    await expect(done).resolves.toBeUndefined();
  });

  it("can be stopped early, which settles done", async () => {
    const match = jest.fn().mockResolvedValue(undefined);

    const { done, stop } = startCacheStorageHeartbeat({
      caches: { match },
      cacheName,
      url,
      ticks: 10,
      intervalMs: 1000,
    });

    jest.advanceTimersByTime(2000);
    expect(match).toHaveBeenCalledTimes(2);
    expect(await isSettled(done)).toBe(false);

    stop();
    expect(await isSettled(done)).toBe(true);

    jest.advanceTimersByTime(60_000);
    expect(match).toHaveBeenCalledTimes(2);
  });

  it("does nothing and settles at once when CacheStorage is unavailable", async () => {
    const { done, stop } = startCacheStorageHeartbeat({
      caches: undefined,
      cacheName,
      url,
      ticks: 3,
      intervalMs: 1000,
    });

    expect(jest.getTimerCount()).toBe(0);
    expect(await isSettled(done)).toBe(true);
    expect(() => stop()).not.toThrow();
  });

  it("defaults to a 30 tick, one second budget", async () => {
    const match = jest.fn().mockResolvedValue(undefined);

    const { done } = startCacheStorageHeartbeat({
      caches: { match },
      cacheName,
      url,
    });

    jest.advanceTimersByTime(29_000);
    expect(match).toHaveBeenCalledTimes(29);
    expect(await isSettled(done)).toBe(false);

    jest.advanceTimersByTime(1000);
    expect(match).toHaveBeenCalledTimes(30);
    expect(await isSettled(done)).toBe(true);

    jest.advanceTimersByTime(60_000);
    expect(match).toHaveBeenCalledTimes(30);
  });
});
