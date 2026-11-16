import type { LoaderDeps } from "./loader";

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
const load = () => require("./loader") as typeof import("./loader");
/* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */

const GLUE_URL = "https://sunflower-land.com/wasm/request_token.js";
const WASM_URL = "https://sunflower-land.com/wasm/request_token_bg.wasm";

const bytes = new ArrayBuffer(8);

const wasmResponse = (status = 200) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Origin Error",
    arrayBuffer: () => Promise.resolve(bytes),
  }) as unknown as Response;

/** A glue module whose init records what it was handed. */
const glue = () => {
  const init = jest.fn(() => Promise.resolve());

  return {
    module: {
      default: init,
      initSession: () => undefined,
      clearSession: () => undefined,
      hasSession: () => true,
      signRequest: () => "1:tok",
    },
    init,
  };
};

type MockDeps = { [K in keyof LoaderDeps]: jest.Mock };

const deps = (overrides: Partial<MockDeps>): MockDeps => ({
  importModule: jest.fn(() => Promise.resolve(glue().module)),
  fetch: jest.fn(() => Promise.resolve(wasmResponse())),
  sleep: jest.fn(() => Promise.resolve()),
  ...overrides,
});

const networkFailure = () =>
  Promise.reject(new TypeError("Failed to fetch dynamically imported module"));

describe("loader", () => {
  beforeEach(() => {
    // The loader caches a successful load and counts attempts across the
    // page session; each test gets its own page.
    jest.resetModules();
  });

  it("fetches the wasm itself and hands the glue the bytes", async () => {
    const { module, init } = glue();
    const d = deps({ importModule: jest.fn(() => Promise.resolve(module)) });

    const loaded = await load().loadTokenModule(d);

    expect(loaded).toBe(module);
    expect(d.importModule).toHaveBeenCalledWith(GLUE_URL);
    expect(d.fetch).toHaveBeenCalledWith(WASM_URL);
    // A buffer, not a URL: the glue then instantiates directly, never
    // touching its own fetch or its Response detection.
    expect(init).toHaveBeenCalledWith({ module_or_path: bytes });
    expect(d.sleep).not.toHaveBeenCalled();
  });

  it("retries a failed glue import with a cache-busting URL", async () => {
    const { module } = glue();
    const d = deps({
      importModule: jest
        .fn()
        .mockImplementationOnce(networkFailure)
        .mockImplementation(() => Promise.resolve(module)),
    });

    await load().loadTokenModule(d);

    // The first load keeps the plain URL and the HTTP cache with it. The
    // retry must not: the module map has recorded the plain URL as failed
    // and would reject it again without a fetch (verified in Chrome).
    expect(d.importModule.mock.calls.map(([url]) => url)).toEqual([
      GLUE_URL,
      `${GLUE_URL}?attempt=2`,
    ]);
    expect(d.sleep).toHaveBeenCalledWith(1_000);
  });

  it("retries a wasm fetch that drops, about a second then three apart", async () => {
    const d = deps({
      fetch: jest
        .fn()
        .mockRejectedValueOnce(new TypeError("Failed to fetch"))
        .mockRejectedValueOnce(
          new TypeError("Response body loading was aborted"),
        )
        .mockResolvedValue(wasmResponse()),
    });

    await load().loadTokenModule(d);

    expect(d.fetch).toHaveBeenCalledTimes(3);
    expect(d.sleep.mock.calls.map(([ms]) => ms)).toEqual([1_000, 3_000]);
  });

  it("retries a 5xx from the wasm origin, then gives up with the status", async () => {
    const d = deps({
      fetch: jest.fn(() => Promise.resolve(wasmResponse(522))),
    });

    const failure = await load()
      .loadTokenModule(d)
      .catch((e) => e);

    expect(d.fetch).toHaveBeenCalledTimes(3);
    expect(failure.stage).toBe("init");
    // The import took one attempt; the wasm fetch took the next three.
    expect(failure.attempt).toBe(4);
    expect(failure.cause.message).toBe(
      `failed to fetch Wasm: 522 Origin Error fetching '${WASM_URL}'`,
    );
  });

  it("does not retry a 4xx from the wasm origin", async () => {
    const d = deps({
      fetch: jest.fn(() => Promise.resolve(wasmResponse(404))),
    });

    const failure = await load()
      .loadTokenModule(d)
      .catch((e) => e);

    expect(d.fetch).toHaveBeenCalledTimes(1);
    expect(failure.stage).toBe("init");
    expect(failure.attempt).toBe(2);
  });

  it("does not retry an engine failure", async () => {
    const compile = new Error("WebAssembly.instantiate(): expected magic word");
    compile.name = "CompileError";
    const { module } = glue();
    module.default = jest.fn(() => Promise.reject(compile));
    const d = deps({ importModule: jest.fn(() => Promise.resolve(module)) });

    const failure = await load()
      .loadTokenModule(d)
      .catch((e) => e);

    // The bytes arrived and this engine will not run them; fetching them
    // again cannot change that.
    expect(d.fetch).toHaveBeenCalledTimes(1);
    expect(module.default).toHaveBeenCalledTimes(1);
    expect(failure.cause).toBe(compile);
    expect(d.sleep).not.toHaveBeenCalled();
  });

  it("gives up on a glue import after three attempts, reporting the last", async () => {
    const d = deps({ importModule: jest.fn(networkFailure) });

    const failure = await load()
      .loadTokenModule(d)
      .catch((e) => e);

    expect(d.importModule).toHaveBeenCalledTimes(3);
    expect(failure.name).toBe("SignerLoadError");
    expect(failure.stage).toBe("import");
    expect(failure.attempt).toBe(3);
    expect(d.fetch).not.toHaveBeenCalled();
  });

  it("busts the import URL on a later load too, and does not cache a failure", async () => {
    const { module } = glue();
    const loader = load();
    const failing = deps({ importModule: jest.fn(networkFailure) });

    await expect(loader.loadTokenModule(failing)).rejects.toMatchObject({
      stage: "import",
    });

    // The lazy retry from index.ts, half a minute later: a fresh load, and
    // its first import must not be the URL the module map already holds
    // as failed. Attempts keep counting across loads.
    const recovering = deps({
      importModule: jest.fn(() => Promise.resolve(module)),
    });
    await expect(loader.loadTokenModule(recovering)).resolves.toBe(module);
    expect(recovering.importModule).toHaveBeenCalledWith(
      `${GLUE_URL}?attempt=4`,
    );
  });

  it("caches a successful load", async () => {
    const loader = load();
    const d = deps({});

    const first = await loader.loadTokenModule(d);
    const second = await loader.loadTokenModule(d);

    expect(second).toBe(first);
    expect(d.importModule).toHaveBeenCalledTimes(1);
  });
});
