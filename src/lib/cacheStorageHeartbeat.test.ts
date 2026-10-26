import { startCacheStorageHeartbeat } from "./cacheStorageHeartbeat";

describe("startCacheStorageHeartbeat", () => {
  const url = "https://sunflower-land.com/game-assets/icons/disc.png";
  const cacheName = "protected-icons";

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("matches the cache entry once per second and keeps going", () => {
    const match = jest.fn().mockResolvedValue(undefined);

    startCacheStorageHeartbeat({ caches: { match }, cacheName, url });

    expect(match).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(match).toHaveBeenCalledTimes(1);
    expect(match).toHaveBeenCalledWith(url, { cacheName });

    jest.advanceTimersByTime(600_000);
    expect(match).toHaveBeenCalledTimes(601);
  });

  it("stops after the tick budget when one is given", () => {
    const match = jest.fn().mockResolvedValue(undefined);

    startCacheStorageHeartbeat({
      caches: { match },
      cacheName,
      url,
      ticks: 3,
      intervalMs: 500,
    });

    jest.advanceTimersByTime(1500);
    expect(match).toHaveBeenCalledTimes(3);

    jest.advanceTimersByTime(60_000);
    expect(match).toHaveBeenCalledTimes(3);
  });

  it("keeps ticking when a match rejects", async () => {
    const match = jest
      .fn()
      .mockRejectedValueOnce(new Error("storage unavailable"))
      .mockResolvedValue(undefined);

    startCacheStorageHeartbeat({ caches: { match }, cacheName, url });

    jest.advanceTimersByTime(1000);
    // Let the rejection settle; it must not surface as an unhandled rejection.
    await Promise.resolve();
    jest.advanceTimersByTime(1000);

    expect(match).toHaveBeenCalledTimes(2);
  });

  it("can be stopped", () => {
    const match = jest.fn().mockResolvedValue(undefined);

    const stop = startCacheStorageHeartbeat({
      caches: { match },
      cacheName,
      url,
    });

    jest.advanceTimersByTime(2000);
    expect(match).toHaveBeenCalledTimes(2);

    stop();
    jest.advanceTimersByTime(60_000);
    expect(match).toHaveBeenCalledTimes(2);
  });

  it("does nothing when CacheStorage is unavailable", () => {
    const stop = startCacheStorageHeartbeat({
      caches: undefined,
      cacheName,
      url,
    });

    expect(jest.getTimerCount()).toBe(0);
    expect(() => stop()).not.toThrow();
  });
});
