import { serializeByKey } from "./serializeByKey";

/** A task whose completion the test controls. */
const deferred = () => {
  let resolve!: (value: string) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<string>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("serializeByKey", () => {
  it("starts a second task for the same key only after the first settles", async () => {
    const run = serializeByKey<object>();
    const key = {};
    const first = deferred();
    const started: string[] = [];

    const a = run(key, () => {
      started.push("a");
      return first.promise;
    });
    const b = run(key, async () => {
      started.push("b");
      return "b";
    });

    await flush();
    expect(started).toEqual(["a"]);

    first.resolve("a");
    await expect(a).resolves.toBe("a");
    await expect(b).resolves.toBe("b");
    expect(started).toEqual(["a", "b"]);
  });

  it("still runs the next task when the previous one fails", async () => {
    const run = serializeByKey<object>();
    const key = {};
    const first = deferred();

    const a = run(key, () => first.promise);
    const b = run(key, async () => "b");

    first.reject(new Error("save failed"));
    await expect(a).rejects.toThrow("save failed");
    await expect(b).resolves.toBe("b");
  });

  it("does not hold up tasks for other keys", async () => {
    const run = serializeByKey<object>();
    const blocked = deferred();
    const started: string[] = [];

    void run({}, () => {
      started.push("a");
      return blocked.promise;
    });
    void run({}, async () => {
      started.push("b");
      return "b";
    });

    await flush();
    expect(started).toEqual(["a", "b"]);
    blocked.resolve("a");
  });
});

describe("serializeByKey pending state", () => {
  it("reports a key as pending until its last queued task settles", async () => {
    const run = serializeByKey<object>();
    const key = {};
    const first = deferred();
    const second = deferred();

    expect(run.isPending(key)).toBe(false);

    const a = run(key, () => first.promise);
    const b = run(key, () => second.promise);
    expect(run.isPending(key)).toBe(true);

    first.resolve("a");
    await a;
    expect(run.isPending(key)).toBe(true);

    second.reject(new Error("save failed"));
    await expect(b).rejects.toThrow("save failed");
    expect(run.isPending(key)).toBe(false);
  });

  it("notifies subscribers when a key starts and stops being pending", async () => {
    const run = serializeByKey<object>();
    const key = {};
    const task = deferred();
    const seen: boolean[] = [];

    const unsubscribe = run.subscribe(key, () => seen.push(run.isPending(key)));
    const done = run(key, () => task.promise);
    task.resolve("a");
    await done;
    await flush();

    expect(seen).toEqual([true, false]);

    unsubscribe();
    await run(key, async () => "b");
    expect(seen).toEqual([true, false]);
  });
});
