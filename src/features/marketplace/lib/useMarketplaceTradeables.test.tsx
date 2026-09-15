import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";

// esbuild-runner does not hoist jest.mock, so every mock is registered
// explicitly before the hook is required.
const loadMarketplace = jest.fn(() =>
  Promise.resolve({
    items: [{ collection: "collectibles", id: 1, isActive: true }],
  }),
);

jest.doMock("lib/config", () => ({ CONFIG: { API_URL: "https://api.test" } }));
jest.doMock("features/auth/lib/Provider", () => ({
  Context: React.createContext({ authService: {} }),
}));
jest.doMock("@xstate/react", () => ({
  useActor: () => [{ context: { user: { rawToken: "jwt" } } }],
}));
jest.doMock("../actions/loadMarketplace", () => ({ loadMarketplace }));
jest.doMock("lib/requestToken/loader", () => ({
  loadTokenModule: () =>
    Promise.resolve({
      initSession: () => undefined,
      clearSession: () => undefined,
      hasSession: () => true,
      signRequest: () => "1:tok",
    }),
}));

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */
const { initRequestTokens } =
  require("lib/requestToken") as typeof import("lib/requestToken");
const { useMarketplaceTradeables } =
  require("./useMarketplaceTradeables") as typeof import("./useMarketplaceTradeables");
/* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/consistent-type-imports */

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const Badge: React.FC = () => {
  const { isTradeable } = useMarketplaceTradeables({
    filters: ["collectibles"],
  });

  return (
    <span>
      {isTradeable({ collection: "collectibles", id: 1 }) ? "tradeable" : "-"}
    </span>
  );
};

const settle = () =>
  act(async () => {
    await new Promise((res) => setTimeout(res, 20));
  });

describe("useMarketplaceTradeables", () => {
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

  it("does not ask the marketplace until the session handshake has completed", async () => {
    act(() => root.render(<Badge />));
    await settle();

    // Mounted with a JWT but before /session: previously this fired at
    // once, went out unsigned, was rejected, and — the key being immutable
    // — was never asked again, so the badges stayed broken all session.
    expect(loadMarketplace).not.toHaveBeenCalled();
    expect(container.textContent).toBe("-");

    await act(() =>
      initRequestTokens({ sessionCode: "a", sessionCodeExpiresAt: 1 }),
    );
    await settle();

    expect(loadMarketplace).toHaveBeenCalledTimes(1);
    expect(loadMarketplace).toHaveBeenCalledWith({
      filters: "collectibles",
      token: "jwt",
    });
    expect(container.textContent).toBe("tradeable");
  });
});
