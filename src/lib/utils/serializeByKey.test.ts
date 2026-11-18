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
