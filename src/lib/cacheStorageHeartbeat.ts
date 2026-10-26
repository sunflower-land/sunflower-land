/**
 * CacheStorage heartbeat for the service worker.
 *
 * Observed on iOS 26.6 (iPhone 17 Pro, installed PWA): a freshly started
 * service worker answers page requests from CacheStorage with a fixed ~1s
 * stall whenever the lookup happens inside a fetch event after a few seconds
 * of quiet. The entry is a hit and the same lookup made by the worker on its
 * own takes ~1ms. Every image the game shows then lags a second behind, which
 * players see as assets flashing in.
 *
 * While the worker is making timer-driven lookups of its own, one per second,
 * the stall does not occur: zero stalled samples in every on-device run, over
 * two days and several fresh worker instances. Whether the worker stays fast
 * after such a run stops turned out to be unreliable (it did on some workers
 * and not on others, including a 30-tick run attached to a fetch event's
 * waitUntil), so the heartbeat simply runs for the worker's lifetime.
 *
 * Cost: one ~1ms cache lookup per second while the worker process is alive.
 * A timer does not keep a worker alive, and that is fine here: a terminated
 * worker has no stalls to mask, and the next worker starts its own heartbeat
 * when it evaluates this script. It adds no network traffic and changes
 * nothing about what is cached.
 */

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
  intervalMs?: number;
  /** Stop after this many lookups. Unbounded when omitted. */
  ticks?: number;
};

/**
 * Starts the heartbeat and returns a function that stops it. Does nothing
 * when CacheStorage is unavailable.
 */
export function startCacheStorageHeartbeat({
  caches,
  cacheName,
  url,
  intervalMs = DEFAULT_HEARTBEAT_INTERVAL_MS,
  ticks = Infinity,
}: HeartbeatOptions): () => void {
  if (!caches || ticks <= 0) return () => undefined;

  // A miss is fine: the point is the worker-initiated CacheStorage call.
  const lookup = () => caches.match(url, { cacheName }).catch(() => undefined);

  // First lookup right away, so requests in the worker's first second are
  // covered too, then one per interval.
  lookup();
  let remaining = ticks - 1;
  if (remaining <= 0) return () => undefined;

  const timer = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) clearInterval(timer);
    lookup();
  }, intervalMs);

  return () => clearInterval(timer);
}
