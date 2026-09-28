import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type {
  CaveMerchant,
  CaveMerchantOfferId,
  GameState,
} from "features/game/types/game";
import {
  CAVE_MERCHANT_OFFERS,
  CAVE_MERCHANT_OFFERS_TIER,
  CAVE_MERCHANT_TIER,
  getCaveMerchantOffers,
} from "features/game/types/caveMerchant";
import { CAVE_TIERS } from "features/game/types/caveTiers";
import { getKeys } from "lib/object";
import { CONFIG } from "lib/config";
import {
  BUY_CAVE_MERCHANT_OFFER_ERRORS,
  buyCaveMerchantOffer,
} from "./buyCaveMerchantOffer";

// Tuesday 29 September 2026; its week starts on Monday the 28th.
const NOW = Date.UTC(2026, 8, 29, 12);
const WEEK_KEY = "2026-09-28";
const NEXT_WEEK = NOW + 7 * 24 * 60 * 60 * 1000;
const NEXT_WEEK_KEY = "2026-10-05";

const OFFER_IDS = getKeys(CAVE_MERCHANT_OFFERS);
const TIER_V_OFFER = OFFER_IDS.find(
  (id) => CAVE_MERCHANT_OFFERS[id].requiresTier === CAVE_MERCHANT_TIER,
) as CaveMerchantOfferId;
const TIER_VIII_OFFER = OFFER_IDS.find(
  (id) => CAVE_MERCHANT_OFFERS[id].requiresTier === CAVE_MERCHANT_OFFERS_TIER,
) as CaveMerchantOfferId;
const COIN_OFFER = OFFER_IDS.find(
  (id) => (CAVE_MERCHANT_OFFERS[id].cost.coins ?? 0) > 0,
) as CaveMerchantOfferId;

const caveState = ({
  tier = CAVE_MERCHANT_TIER,
  coins = 1_000_000,
  beetles = 1000,
  merchant,
}: {
  tier?: number;
  coins?: number;
  beetles?: number;
  merchant?: CaveMerchant;
} = {}): GameState => ({
  ...TEST_FARM,
  coins,
  inventory: {
    ...TEST_FARM.inventory,
    "Brown Beetle": new Decimal(beetles),
    "Blue Beetle": new Decimal(beetles),
    "Pink Beetle": new Decimal(beetles),
    "Amber Beetle": new Decimal(beetles),
  },
  cave: { builtAt: 1, tier, machines: { "1": {} }, merchant },
});

const buy = (
  state: GameState,
  offerId: CaveMerchantOfferId = TIER_V_OFFER,
  createdAt = NOW,
) =>
  buyCaveMerchantOffer({
    state,
    action: { type: "cave.merchantOfferBought", offerId },
    createdAt,
  });

describe("CAVE_MERCHANT_OFFERS", () => {
  it("opens the shop at Cave V and adds offers at Cave VIII", () => {
    expect(CAVE_MERCHANT_TIER).toBe(5);
    expect(CAVE_MERCHANT_OFFERS_TIER).toBe(8);
    expect(CAVE_TIERS[CAVE_MERCHANT_TIER].unlocks).toBe("merchant");
    expect(CAVE_TIERS[CAVE_MERCHANT_OFFERS_TIER].unlocks).toBe(
      "merchantOffers",
    );
  });

  it("stocks nothing before the shop opens", () => {
    expect(getCaveMerchantOffers(CAVE_MERCHANT_TIER - 1)).toEqual([]);
  });

  it("stocks only the tier V offers until Cave VIII", () => {
    const offers = getCaveMerchantOffers(CAVE_MERCHANT_OFFERS_TIER - 1);
    expect(offers).toContain(TIER_V_OFFER);
    expect(offers).not.toContain(TIER_VIII_OFFER);
  });

  it("stocks every offer at Cave VIII", () => {
    expect(getCaveMerchantOffers(CAVE_MERCHANT_OFFERS_TIER)).toEqual(OFFER_IDS);
  });
});

describe("buyCaveMerchantOffer (cave.merchantOfferBought)", () => {
  it.each(OFFER_IDS)("charges and rewards %s exactly", (offerId) => {
    const { cost, reward } = CAVE_MERCHANT_OFFERS[offerId];
    const state = caveState({ tier: CAVE_MERCHANT_OFFERS_TIER });
    const next = buy(state, offerId);

    expect(next.coins).toBe(state.coins - (cost.coins ?? 0));
    for (const item of getKeys(cost.items)) {
      expect(next.inventory[item]).toEqual(
        (state.inventory[item] ?? new Decimal(0)).minus(cost.items[item] ?? 0),
      );
    }
    for (const item of getKeys(reward)) {
      expect(next.inventory[item]).toEqual(
        (state.inventory[item] ?? new Decimal(0)).add(reward[item] ?? 0),
      );
    }
  });

  it("records the purchase under the current week", () => {
    const next = buy(buy(caveState()));
    expect(next.cave?.merchant).toEqual({
      purchases: { [WEEK_KEY]: { [TIER_V_OFFER]: 2 } },
    });
  });

  it("enforces the per-player limit", () => {
    let state = caveState();
    for (let i = 0; i < CAVE_MERCHANT_OFFERS[TIER_V_OFFER].limit; i++) {
      state = buy(state);
    }
    expect(() => buy(state)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.LIMIT_REACHED,
    );
  });

  it("resets the limit in a new week and drops the old week", () => {
    const { limit } = CAVE_MERCHANT_OFFERS[TIER_V_OFFER];
    const state = caveState({
      merchant: { purchases: { [WEEK_KEY]: { [TIER_V_OFFER]: limit } } },
    });
    const next = buy(state, TIER_V_OFFER, NEXT_WEEK);
    expect(next.cave?.merchant).toEqual({
      purchases: { [NEXT_WEEK_KEY]: { [TIER_V_OFFER]: 1 } },
    });
  });

  it("rejects a purchase from a week that has already ended", () => {
    // Late events from the previous week must not wipe the new week's counts.
    const state = caveState({
      merchant: { purchases: { [NEXT_WEEK_KEY]: { [TIER_V_OFFER]: 1 } } },
    });
    expect(() => buy(state)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.PERIOD_ENDED,
    );
  });

  it("rejects before the shop opens", () => {
    expect(() => buy(caveState({ tier: CAVE_MERCHANT_TIER - 1 }))).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.MERCHANT_CLOSED,
    );
  });

  it("rejects a Cave VIII offer before Cave VIII", () => {
    expect(() =>
      buy(caveState({ tier: CAVE_MERCHANT_OFFERS_TIER - 1 }), TIER_VIII_OFFER),
    ).toThrow(BUY_CAVE_MERCHANT_OFFER_ERRORS.OFFER_LOCKED);
  });

  it("rejects without enough of an item", () => {
    expect(() => buy(caveState({ beetles: 0 }))).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.INSUFFICIENT_ITEMS,
    );
  });

  it("rejects without enough coins", () => {
    expect(() =>
      buy(caveState({ tier: CAVE_MERCHANT_OFFERS_TIER, coins: 0 }), COIN_OFFER),
    ).toThrow(BUY_CAVE_MERCHANT_OFFER_ERRORS.INSUFFICIENT_COINS);
  });

  it("rejects an unknown offer", () => {
    expect(() => buy(caveState(), "toString" as CaveMerchantOfferId)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.UNKNOWN_OFFER,
    );
  });

  it("rejects when the Cave has not been built", () => {
    expect(() => buy({ ...caveState(), cave: undefined })).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.NO_CAVE,
    );
  });

  describe("off testnet", () => {
    // jest runs on amoy, so the flag-off path is only reachable by pretending
    // to be mainnet.
    let previousNetwork: (typeof CONFIG)["NETWORK"];

    beforeEach(() => {
      previousNetwork = CONFIG.NETWORK;
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    });

    afterEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = previousNetwork;
    });

    it("throws without the CAVE feature flag", () => {
      expect(() => buy(caveState())).toThrow(
        BUY_CAVE_MERCHANT_OFFER_ERRORS.NO_FEATURE_ACCESS,
      );
    });
  });
});
