/**
 * Runs async tasks one at a time per key, in the order they were queued.
 * A task starts only once the previous one for the same key has settled
 * (resolved or rejected); tasks for different keys don't wait on each other.
 * Keys are held weakly, so a key that goes away takes its queue with it.
 *
 * `isPending(key)` is true from the moment a task is queued until the last
 * queued task for that key settles; `subscribe` is told whenever that flips.
 * A caller awaiting a task sees the key no longer pending if it was the last.
 */
export const serializeByKey = <K extends object>() => {
  const tails = new WeakMap<K, Promise<unknown>>();
  const pending = new WeakMap<K, number>();
  const listeners = new WeakMap<K, Set<() => void>>();

  const notify = (key: K) =>
    listeners.get(key)?.forEach((listener) => listener());

  const adjust = (key: K, delta: 1 | -1) => {
    const before = pending.get(key) ?? 0;
    const after = before + delta;
    pending.set(key, after);
    if ((before === 0) !== (after === 0)) notify(key);
  };

  const run = <T>(key: K, task: () => Promise<T>): Promise<T> => {
    adjust(key, 1);
    const previous = tails.get(key) ?? Promise.resolve();
    const result = previous.then(task, task).finally(() => adjust(key, -1));
    // The next task waits for this one to settle, whatever the outcome.
    tails.set(
      key,
      result.catch(() => undefined),
    );
    return result;
  };

  return Object.assign(run, {
    isPending: (key: K) => (pending.get(key) ?? 0) > 0,
    subscribe: (key: K, listener: () => void) => {
      const set = listeners.get(key) ?? new Set<() => void>();
      set.add(listener);
      listeners.set(key, set);
      return () => {
        set.delete(listener);
      };
    },
  });
};
