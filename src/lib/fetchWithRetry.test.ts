import { fetchWithRetry, isRetryableStatus } from "./fetchWithRetry";

const makeResponse = (
  status: number,
  body: unknown = {},
  headers: Record<string, string> = {},
): Response =>
  ({
    status,
    ok: status >= 200 && status < 300,
    headers: new Headers(headers),
    json: () => Promise.resolve(body),
    clone() {
      return makeResponse(status, body, headers);
    },
  }) as unknown as Response;

const drainMicrotasks = async () => {
  for (let i = 0; i < 10; i++) await Promise.resolve();
};

const flush = async (ms: number) => {
  // Let the promise chain progress, then advance timers.
  await drainMicrotasks();
  jest.advanceTimersByTime(ms);
  await drainMicrotasks();
};

describe("fetchWithRetry", () => {
  const originalFetch = globalThis.fetch;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    // Pin jitter to its upper bound so delays equal the exponential value.
    jest.spyOn(Math, "random").mockReturnValue(1);
    fetchMock = jest.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("returns a successful response without retrying", async () => {
    fetchMock.mockResolvedValue(makeResponse(200, { ok: true }));

    const res = await fetchWithRetry("https://api.test/x");

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("passes url and init through to fetch", async () => {
    fetchMock.mockResolvedValue(makeResponse(200));
    const init = { method: "POST", body: "{}" };

    await fetchWithRetry("https://api.test/x", init);

    expect(fetchMock).toHaveBeenCalledWith("https://api.test/x", init);
  });

  it("does not retry client errors", async () => {
    fetchMock.mockResolvedValue(makeResponse(400));

    const res = await fetchWithRetry("https://api.test/x");

    expect(res.status).toBe(400);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it.each([429, 502, 503, 504])(
    "retries a %s with exponential backoff and returns the final response",
    async (status) => {
      fetchMock.mockResolvedValue(makeResponse(status));

      const promise = fetchWithRetry("https://api.test/x");

      // attempt 1 happens immediately
      await flush(0);
      expect(fetchMock).toHaveBeenCalledTimes(1);

      await flush(1000); // 1s
      expect(fetchMock).toHaveBeenCalledTimes(2);
      await flush(2000); // 2s
      expect(fetchMock).toHaveBeenCalledTimes(3);
      await flush(4000); // 4s
      expect(fetchMock).toHaveBeenCalledTimes(4);

      const res = await promise;
      expect(res.status).toBe(status);
      expect(fetchMock).toHaveBeenCalledTimes(4);
    },
  );

  it("returns the first successful response after a retry", async () => {
    fetchMock
      .mockResolvedValueOnce(makeResponse(503))
      .mockResolvedValueOnce(makeResponse(200, { ok: true }));

    const promise = fetchWithRetry("https://api.test/x");
    await flush(0);
    await flush(1000);

    const res = await promise;
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not retry a 503 temporary maintenance response", async () => {
    fetchMock.mockResolvedValue(
      makeResponse(503, { message: "Temporary maintenance" }),
    );

    const res = await fetchWithRetry("https://api.test/x");

    expect(res.status).toBe(503);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    // Body must still be readable by the caller
    await expect(res.json()).resolves.toEqual({
      message: "Temporary maintenance",
    });
  });

  it("caps the backoff delay", async () => {
    fetchMock.mockResolvedValue(makeResponse(503));

    const promise = fetchWithRetry("https://api.test/x", undefined, {
      retries: 6,
    });

    await flush(0);
    await flush(1000);
    await flush(2000);
    await flush(4000);
    await flush(8000);
    expect(fetchMock).toHaveBeenCalledTimes(5);
    // 16s would be next uncapped; with a 10s cap the 6th call fires at 10s
    await flush(9999);
    expect(fetchMock).toHaveBeenCalledTimes(5);
    await flush(1);
    expect(fetchMock).toHaveBeenCalledTimes(6);
    await flush(10000);
    expect(fetchMock).toHaveBeenCalledTimes(7);

    await promise;
  });

  it("never backs off less than half the exponential window", async () => {
    (Math.random as jest.Mock).mockReturnValue(0);
    fetchMock
      .mockResolvedValueOnce(makeResponse(503))
      .mockResolvedValueOnce(makeResponse(200));

    const promise = fetchWithRetry("https://api.test/x");
    await flush(0);
    await flush(499);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await flush(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await expect(promise).resolves.toMatchObject({ status: 200 });
  });

  it("honours a Retry-After header in seconds", async () => {
    fetchMock
      .mockResolvedValueOnce(makeResponse(429, {}, { "Retry-After": "5" }))
      .mockResolvedValueOnce(makeResponse(200));

    const promise = fetchWithRetry("https://api.test/x");
    await flush(0);
    await flush(4999);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await flush(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await expect(promise).resolves.toMatchObject({ status: 200 });
  });

  it("retries network failures for GET requests", async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(makeResponse(200));

    const promise = fetchWithRetry("https://api.test/x");
    await flush(0);
    await flush(1000);

    await expect(promise).resolves.toMatchObject({ status: 200 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("rethrows a network failure once retries are exhausted", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    const promise = fetchWithRetry("https://api.test/x");
    // Attach the rejection handler up-front so jest doesn't flag it
    const outcome = promise.then(
      () => "resolved",
      (e: Error) => e.message,
    );
    await flush(0);
    await flush(1000);
    await flush(2000);
    await flush(4000);

    await expect(outcome).resolves.toBe("Failed to fetch");
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("does not retry network failures for a plain POST", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(
      fetchWithRetry("https://api.test/x", { method: "POST" }),
    ).rejects.toThrow("Failed to fetch");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries network failures for a POST carrying a transaction id", async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(makeResponse(200));

    const promise = fetchWithRetry("https://api.test/x", {
      method: "POST",
      headers: { "X-Transaction-ID": "abc" },
    });
    await flush(0);
    await flush(1000);

    await expect(promise).resolves.toMatchObject({ status: 200 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retries network failures for a POST when idempotent is forced", async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(makeResponse(200));

    const promise = fetchWithRetry(
      "https://api.test/x",
      { method: "POST" },
      { idempotent: true },
    );
    await flush(0);
    await flush(1000);

    await expect(promise).resolves.toMatchObject({ status: 200 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("still retries 5xx responses for a plain POST", async () => {
    fetchMock
      .mockResolvedValueOnce(makeResponse(503))
      .mockResolvedValueOnce(makeResponse(200));

    const promise = fetchWithRetry("https://api.test/x", { method: "POST" });
    await flush(0);
    await flush(1000);

    await expect(promise).resolves.toMatchObject({ status: 200 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not retry an aborted request", async () => {
    const abortError = new DOMException("Aborted", "AbortError");
    fetchMock.mockRejectedValue(abortError);

    await expect(fetchWithRetry("https://api.test/x")).rejects.toBe(abortError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("stops waiting when the signal aborts during backoff", async () => {
    const controller = new AbortController();
    fetchMock.mockResolvedValue(makeResponse(503));

    const promise = fetchWithRetry("https://api.test/x", {
      signal: controller.signal,
    });
    const outcome = promise.then(
      () => "resolved",
      (e: Error) => e.name,
    );
    await flush(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    controller.abort();
    await flush(0);

    await expect(outcome).resolves.toBe("AbortError");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("respects retries: 0", async () => {
    fetchMock.mockResolvedValue(makeResponse(503));

    const res = await fetchWithRetry("https://api.test/x", undefined, {
      retries: 0,
    });

    expect(res.status).toBe(503);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("isRetryableStatus", () => {
  it.each([429, 502, 503, 504])("treats %s as retryable", (status) => {
    expect(isRetryableStatus(status)).toBe(true);
  });

  it.each([200, 400, 401, 403, 409, 500])(
    "treats %s as not retryable",
    (status) => {
      expect(isRetryableStatus(status)).toBe(false);
    },
  );
});
