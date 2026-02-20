import { signUp } from "./signup";

describe("signUp", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = jest.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("includes equipped in request body when equipment is provided", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ token: "jwt", farm: { id: 1 } }),
    });

    const equipment = {
      background: "Farm Background",
      body: "Beige Farmer Potion",
      hair: "Rancher Hair",
      shirt: "Red Farmer Shirt",
      pants: "Farmer Pants",
      shoes: "Black Farmer Boots",
      tool: "Farmer Pitchfork",
    };

    await signUp({
      token: "test-token",
      transactionId: "tx-1",
      referrerId: null,
      equipment,
    });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"equipped"'),
      }),
    );
    const body = JSON.parse(
      (globalThis.fetch as jest.Mock).mock.calls[0][1].body,
    );
    expect(body.equipped).toEqual(equipment);
  });

  it("omits equipped from request body when equipment is not provided", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ token: "jwt", farm: { id: 1 } }),
    });

    await signUp({
      token: "test-token",
      transactionId: "tx-1",
      referrerId: null,
    });

    const body = JSON.parse(
      (globalThis.fetch as jest.Mock).mock.calls[0][1].body,
    );
    expect(body.equipped).toBeUndefined();
  });
});
