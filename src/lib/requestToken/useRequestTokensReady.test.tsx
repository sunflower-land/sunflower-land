import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";

// esbuild-runner does not hoist jest.mock, so register the mock explicitly
// before requiring the modules under test.
jest.doMock("./loader", () => ({
  loadTokenModule: () =>
    Promise.resolve({
      initSession: () => undefined,
      clearSession: () => undefined,
      hasSession: () => true,
      signRequest: () => "1:tok",
    }),
}));

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
const { initRequestTokens } = require("./index") as typeof import("./index");
const { useRequestTokensReady } =
  require("./useRequestTokensReady") as typeof import("./useRequestTokensReady");
/* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const Probe: React.FC = () => {
  const ready = useRequestTokensReady();

  return <span data-testid="ready">{ready ? "ready" : "waiting"}</span>;
};

describe("useRequestTokensReady", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("flips from waiting to ready when the session handshake completes", async () => {
    act(() => root.render(<Probe />));
    expect(container.textContent).toBe("waiting");

    // The handshake lands — the component re-renders without a poll.
    await act(() =>
      initRequestTokens({ sessionCode: "a", sessionCodeExpiresAt: 1 }),
    );
    expect(container.textContent).toBe("ready");

    // And stays ready across later sessions.
    await act(() => initRequestTokens({}));
    expect(container.textContent).toBe("ready");
  });

  it("is ready straight away for a component mounted after the handshake", () => {
    act(() => root.render(<Probe />));
    expect(container.textContent).toBe("ready");
  });
});
