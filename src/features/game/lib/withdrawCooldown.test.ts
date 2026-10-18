import Decimal from "decimal.js-light";
import { TEST_FARM } from "../lib/constants";
import { ERRORS } from "lib/errors";
import { createEffectError } from "../actions/effect";
import {
  getMarketplaceWithdrawBlock,
  getWithdrawCooldownItems,
} from "./withdrawCooldown";

const NOW = 1_760_000_000_000;
const DAY = 24 * 60 * 60 * 1000;

describe("getWithdrawCooldownItems", () => {
  it("reads the blocked items off a cooldown rejection", () => {
    const error = createEffectError(ERRORS.WITHDRAW_MARKETPLACE_COOLDOWN, {
      items: { Kuebiko: NOW + 80 * DAY, "Tin Turtle": NOW + DAY },
    });

    expect(getWithdrawCooldownItems(error)).toEqual({
      Kuebiko: NOW + 80 * DAY,
      "Tin Turtle": NOW + DAY,
    });
  });

  it("ignores other error codes", () => {
    const error = createEffectError(ERRORS.WITHDRAW_DUPLICATE, {
      items: { Kuebiko: NOW + DAY },
    });

    expect(getWithdrawCooldownItems(error)).toEqual({});
  });

  it("tolerates a missing or malformed payload", () => {
    expect(
      getWithdrawCooldownItems(new Error(ERRORS.WITHDRAW_MARKETPLACE_COOLDOWN)),
    ).toEqual({});
    expect(
      getWithdrawCooldownItems(
        createEffectError(ERRORS.WITHDRAW_MARKETPLACE_COOLDOWN, {
          items: { Kuebiko: "soon", "Tin Turtle": NOW + DAY },
        }),
      ),
    ).toEqual({ "Tin Turtle": NOW + DAY });
    expect(getWithdrawCooldownItems(undefined)).toEqual({});
    expect(getWithdrawCooldownItems("WITHDRAW_MARKETPLACE_COOLDOWN")).toEqual(
      {},
    );
  });
});

describe("getMarketplaceWithdrawBlock", () => {
  const cooldowns = { Kuebiko: NOW + 10 * DAY, "Tin Turtle": NOW - DAY };

  it("returns the release time for a blocked item", () => {
    expect(
      getMarketplaceWithdrawBlock({
        game: TEST_FARM,
        cooldowns,
        name: "Kuebiko",
        now: NOW,
      }),
    ).toBe(NOW + 10 * DAY);
  });

  it("is clear once the cooldown has passed", () => {
    expect(
      getMarketplaceWithdrawBlock({
        game: TEST_FARM,
        cooldowns,
        name: "Tin Turtle",
        now: NOW,
      }),
    ).toBeUndefined();
    expect(
      getMarketplaceWithdrawBlock({
        game: TEST_FARM,
        cooldowns,
        name: "Kuebiko",
        now: NOW + 10 * DAY,
      }),
    ).toBeUndefined();
  });

  it("is clear for items the API never flagged", () => {
    expect(
      getMarketplaceWithdrawBlock({
        game: TEST_FARM,
        cooldowns,
        name: "Bale",
        now: NOW,
      }),
    ).toBeUndefined();
    expect(
      getMarketplaceWithdrawBlock({
        game: TEST_FARM,
        cooldowns: undefined,
        name: "Kuebiko",
        now: NOW,
      }),
    ).toBeUndefined();
  });

  it("is lifted by paid VIP or a Lifetime Farmer Banner", () => {
    expect(
      getMarketplaceWithdrawBlock({
        game: { ...TEST_FARM, vip: { expiresAt: NOW + DAY, bundles: [] } },
        cooldowns,
        name: "Kuebiko",
        now: NOW,
      }),
    ).toBeUndefined();
    expect(
      getMarketplaceWithdrawBlock({
        game: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            "Lifetime Farmer Banner": new Decimal(1),
          },
        },
        cooldowns,
        name: "Kuebiko",
        now: NOW,
      }),
    ).toBeUndefined();
  });

  it("is not lifted by the free VIP trial or an expired VIP", () => {
    expect(
      getMarketplaceWithdrawBlock({
        game: {
          ...TEST_FARM,
          vip: { expiresAt: 0, trialStartedAt: NOW - DAY, bundles: [] },
        },
        cooldowns,
        name: "Kuebiko",
        now: NOW,
      }),
    ).toBe(NOW + 10 * DAY);
    expect(
      getMarketplaceWithdrawBlock({
        game: { ...TEST_FARM, vip: { expiresAt: NOW - DAY, bundles: [] } },
        cooldowns,
        name: "Kuebiko",
        now: NOW,
      }),
    ).toBe(NOW + 10 * DAY);
  });
});
