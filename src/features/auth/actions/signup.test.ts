import type { BumpkinParts } from "lib/utils/tokenUriBuilder";
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

    const equipment: BumpkinParts = {
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

  it("sends first/last touch attribution and consent alongside the legacy utm", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      status: 200,
      json: async () => ({ token: "jwt", farm: { id: 1 } }),
    });

    const result = await signUp({
      token: "test-token",
      transactionId: "tx-1",
      referrerId: null,
      utm: { source: "meta", campaign: "SL | seasonal" },
      attribution: {
        first_touch: { at: 1, utm_source: "meta", sl_aid: "ad1" },
        last_touch: { at: 2, utm_source: "google" },
        consent: false,
      },
    });

    const body = JSON.parse(
      (globalThis.fetch as jest.Mock).mock.calls[0][1].body,
    );
    expect(body.utm).toMatchObject({
      source: "meta",
      campaign: "SL | seasonal",
    });
    expect(body.attribution).toEqual({
      first_touch: { at: 1, utm_source: "meta", sl_aid: "ad1" },
      last_touch: { at: 2, utm_source: "google" },
      consent: false,
    });
    // The farm comes back so the caller can mirror CompleteRegistration.
    expect(result.farm).toEqual({ id: 1 });
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
