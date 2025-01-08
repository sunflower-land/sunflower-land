import { TEST_FARM } from "features/game/lib/constants";
import { purchaseVIP } from "./vipPurchased";
import Decimal from "decimal.js-light";

describe("vipPurchased", () => {
  it("requires gems", () => {
    expect(() =>
      purchaseVIP({
        state: TEST_FARM,
        action: { type: "vip.purchased", name: "1_MONTH" },
      }),
    ).toThrow("Missing gems");
  });

  it("should buy 1 month", () => {
    const now = Date.now();
    const state = purchaseVIP({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Gem: new Decimal(1000),
        },
      },
      action: { type: "vip.purchased", name: "1_MONTH" },
      createdAt: now,
    });

    expect(state.vip).toEqual({
      bundles: [
        {
          name: "1_MONTH",
          boughtAt: now,
        },
      ],
      expiresAt: now + 1000 * 60 * 60 * 24 * 31,
    });

    expect(state.inventory.Gem).toEqual(new Decimal(350));
  });

  it("should buy 3 months", () => {
    const now = Date.now();
    const state = purchaseVIP({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Gem: new Decimal(10000),
        },
      },
      action: { type: "vip.purchased", name: "3_MONTHS" },
      createdAt: now,
    });

    expect(state.vip).toEqual({
      bundles: [
        {
          name: "3_MONTHS",
          boughtAt: now,
        },
      ],
      expiresAt: now + 1000 * 60 * 60 * 24 * 93,
    });

    expect(state.inventory.Gem).toEqual(new Decimal(8500));
  });

  it("should buy 12 months", () => {
    const now = Date.now();
    const state = purchaseVIP({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Gem: new Decimal(10000),
        },
      },
      action: { type: "vip.purchased", name: "1_YEAR" },
      createdAt: now,
    });

    expect(state.vip).toEqual({
      bundles: [
        {
          name: "1_YEAR",
          boughtAt: now,
        },
      ],
      expiresAt: now + 1000 * 60 * 60 * 24 * 365,
    });

    expect(state.inventory.Gem).toEqual(new Decimal(4000));
  });

  it("adds onto existing VIP time", () => {
    const oldBoughtAt = Date.now() - 1000 * 60 * 60 * 24 * 25; // 6 Days left in VIP
    const oldExpiresAt = oldBoughtAt + 1000 * 60 * 60 * 24 * 31;

    const now = Date.now();
    const state = purchaseVIP({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Gem: new Decimal(10000),
        },
        vip: {
          bundles: [
            {
              name: "1_MONTH",
              boughtAt: oldBoughtAt,
            },
          ],
          expiresAt: oldExpiresAt, // 6 Days left in VIP
        },
      },
      action: { type: "vip.purchased", name: "3_MONTHS" },
      createdAt: now,
    });

    expect(state.vip).toEqual({
      bundles: [
        {
          name: "1_MONTH",
          boughtAt: oldBoughtAt,
        },
        {
          name: "3_MONTHS",
          boughtAt: now,
        },
      ],
      expiresAt: oldExpiresAt + 1000 * 60 * 60 * 24 * 93,
    });
  });

  it("buys a new VIP once expired", () => {
    const now = Date.now();
    const oldBoughtAt = now - 1000 * 60 * 60 * 24 * 34; // 3 days expired
    const oldExpiresAt = oldBoughtAt + 1000 * 60 * 60 * 24 * 31;

    const state = purchaseVIP({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Gem: new Decimal(10000),
        },
        vip: {
          bundles: [
            {
              name: "1_MONTH",
              boughtAt: oldBoughtAt,
            },
          ],
          expiresAt: oldExpiresAt, // 6 Days left in VIP
        },
      },
      action: { type: "vip.purchased", name: "3_MONTHS" },
      createdAt: now,
    });

    expect(state.vip).toEqual({
      bundles: [
        {
          name: "1_MONTH",
          boughtAt: oldBoughtAt,
        },
        {
          name: "3_MONTHS",
          boughtAt: now,
        },
      ],
      expiresAt: now + 1000 * 60 * 60 * 24 * 93,
    });
  });
});
