/**
 * Runs async tasks one at a time per key, in the order they were queued.
 * A task starts only once the previous one for the same key has settled
 * (resolved or rejected); tasks for different keys don't wait on each other.
 * Keys are held weakly, so a key that goes away takes its queue with it.
 */
export const serializeByKey = <K extends object>() => {
  const tails = new WeakMap<K, Promise<unknown>>();

  return <T>(key: K, task: () => Promise<T>): Promise<T> => {
    const previous = tails.get(key) ?? Promise.resolve();
    const run = previous.then(task, task);
    // The next task waits for this one to settle, whatever the outcome.
    tails.set(
      key,
      run.catch(() => undefined),
    );
    return run;
  };
};
