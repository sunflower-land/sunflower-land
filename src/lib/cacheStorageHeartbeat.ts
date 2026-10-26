/**
 * Bounded CacheStorage heartbeat for the service worker.
 *
 * Observed on iOS 26.6 (iPhone 17 Pro, installed PWA): a freshly started
 * service worker answers page requests from CacheStorage with a fixed ~1s
 * stall whenever the lookup happens inside a fetch event after a few seconds
 * of quiet. The entry is a hit and the same lookup made by the worker on its
 * own takes ~1ms. Every image the game shows then lags a second behind, which
 * players see as assets flashing in.
 *
 * Lookups the worker makes from a timer, outside any fetch event, move the
 * worker out of that state for the rest of its life: a one-per-second run of
 * ~30 lookups did it on the device, while single calls, short bursts and
 * per-request nudges did not. So the worker runs this heartbeat once at every
 * start-up and then stops; it adds no network traffic and changes nothing
 * about what is cached.
 */

export const DEFAULT_HEARTBEAT_TICKS = 30;
export const DEFAULT_HEARTBEAT_INTERVAL_MS = 1000;

type CacheMatcher = {
  match: (
    url: string,
    options: { cacheName: string },
  ) => Promise<Response | undefined>;
};

type HeartbeatOptions = {
  /** `self.caches` in the worker; undefined when CacheStorage is unavailable. */
  caches: CacheMatcher | undefined;
  cacheName: string;
  url: string;
  ticks?: number;
  intervalMs?: number;
};

/**
 * Starts the heartbeat and returns a function that stops it early.
 */
export function startCacheStorageHeartbeat({
  caches,
  cacheName,
  url,
  ticks = DEFAULT_HEARTBEAT_TICKS,
  intervalMs = DEFAULT_HEARTBEAT_INTERVAL_MS,
}: HeartbeatOptions): () => void {
  if (!caches || ticks <= 0) return () => undefined;

  let remaining = ticks;

  const timer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) clearInterval(timer);

    // A miss is fine: the point is the worker-initiated CacheStorage call.
    caches.match(url, { cacheName }).catch(() => undefined);
  }, intervalMs);

  return () => clearInterval(timer);
}
