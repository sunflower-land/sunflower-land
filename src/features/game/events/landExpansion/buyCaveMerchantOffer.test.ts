import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type {
  CaveMerchant,
  CaveMerchantOfferId,
  GameState,
} from "features/game/types/game";
import {
  CAVE_MERCHANT_OFFERS,
  getCaveMerchantOffers,
} from "features/game/types/caveMerchant";
import { CAVE_MAX_TIER } from "features/game/types/caveTiers";
import { getKeys } from "lib/object";
import { CONFIG } from "lib/config";
import {
  BUY_CAVE_MERCHANT_OFFER_ERRORS,
  buyCaveMerchantOffer,
} from "./buyCaveMerchantOffer";

// The Cave building, placed and finished: every cave.* event requires it.
const READY_CAVE = {
  id: "cave",
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
};

// Tuesday 29 September 2026; its week starts on Monday the 28th.
const NOW = Date.UTC(2026, 8, 29, 12);
const WEEK_KEY = "2026-09-28";
const NEXT_WEEK = NOW + 7 * 24 * 60 * 60 * 1000;
const NEXT_WEEK_KEY = "2026-10-05";

const OFFER_IDS = getKeys(CAVE_MERCHANT_OFFERS);
const FIRST_OFFER = OFFER_IDS.find(
  (id) => CAVE_MERCHANT_OFFERS[id].requiresTier === 1,
) as CaveMerchantOfferId;
const COIN_OFFER = OFFER_IDS.find(
  (id) => (CAVE_MERCHANT_OFFERS[id].cost.coins ?? 0) > 0,
) as CaveMerchantOfferId;

const caveState = ({
  tier = 1,
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
  buildings: { ...TEST_FARM.buildings, Cave: [READY_CAVE] },
  coins,
  inventory: {
    ...TEST_FARM.inventory,
    "Green Beetle": new Decimal(beetles),
    "Blue Beetle": new Decimal(beetles),
    "Pink Beetle": new Decimal(beetles),
    "Amber Beetle": new Decimal(beetles),
  },
  cave: { builtAt: 1, tier, machines: { "1": {} }, merchant },
});

const buy = (
  state: GameState,
  offerId: CaveMerchantOfferId = FIRST_OFFER,
  createdAt = NOW,
) =>
  buyCaveMerchantOffer({
    state,
    action: { type: "cave.merchantOfferBought", offerId },
    createdAt,
  });

describe("CAVE_MERCHANT_OFFERS", () => {
  it("adds one offer per Cave tier, I to VIII, in shop order", () => {
    expect(
      OFFER_IDS.map((id) => CAVE_MERCHANT_OFFERS[id].requiresTier),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("rewards Leather from the leather offer, never a Pig resource", () => {
    expect(CAVE_MERCHANT_OFFERS.leather.reward).toEqual({
      Leather: new Decimal(3),
    });
    getKeys(CAVE_MERCHANT_OFFERS).forEach((id) => {
      expect(CAVE_MERCHANT_OFFERS[id].reward["Pig Bristles"]).toBeUndefined();
    });
  });

  it("stocks nothing without a Cave tier", () => {
    expect(getCaveMerchantOffers(0)).toEqual([]);
  });

  it.each([1, 2, 3, 4, 5, 6, 7, 8])(
    "stocks one offer per tier up to Cave tier %i",
    (tier) => {
      expect(getCaveMerchantOffers(tier)).toEqual(OFFER_IDS.slice(0, tier));
    },
  );
});

describe("buyCaveMerchantOffer (cave.merchantOfferBought)", () => {
  it("throws while the Cave building is under construction", () => {
    const state = caveState();

    expect(() =>
      buy({
        ...state,
        buildings: {
          ...state.buildings,
          Cave: [{ ...READY_CAVE, readyAt: Number.MAX_SAFE_INTEGER }],
        },
      }),
    ).toThrow(BUY_CAVE_MERCHANT_OFFER_ERRORS.NO_CAVE);
  });

  it.each(OFFER_IDS)("charges and rewards %s exactly", (offerId) => {
    const { cost, reward } = CAVE_MERCHANT_OFFERS[offerId];
    const state = caveState({ tier: CAVE_MAX_TIER });
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
      purchases: { [WEEK_KEY]: { [FIRST_OFFER]: 2 } },
    });
  });

  it("enforces the per-player limit", () => {
    let state = caveState();
    for (let i = 0; i < CAVE_MERCHANT_OFFERS[FIRST_OFFER].limit; i++) {
      state = buy(state);
    }
    expect(() => buy(state)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.LIMIT_REACHED,
    );
  });

  it("resets the limit in a new week and drops the old week", () => {
    const { limit } = CAVE_MERCHANT_OFFERS[FIRST_OFFER];
    const state = caveState({
      merchant: { purchases: { [WEEK_KEY]: { [FIRST_OFFER]: limit } } },
    });
    const next = buy(state, FIRST_OFFER, NEXT_WEEK);
    expect(next.cave?.merchant).toEqual({
      purchases: { [NEXT_WEEK_KEY]: { [FIRST_OFFER]: 1 } },
    });
  });

  it("rejects a purchase from a week that has already ended", () => {
    // Late events from the previous week must not wipe the new week's counts.
    const state = caveState({
      merchant: { purchases: { [NEXT_WEEK_KEY]: { [FIRST_OFFER]: 1 } } },
    });
    expect(() => buy(state)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.PERIOD_ENDED,
    );
  });

  it("sells the first offer at Cave tier I", () => {
    expect(buy(caveState({ tier: 1 })).cave?.merchant).toEqual({
      purchases: { [WEEK_KEY]: { [FIRST_OFFER]: 1 } },
    });
  });

  it.each(OFFER_IDS)(
    "locks %s below its tier and sells it at it",
    (offerId) => {
      const { requiresTier } = CAVE_MERCHANT_OFFERS[offerId];
      if (requiresTier > 1) {
        expect(() =>
          buy(caveState({ tier: requiresTier - 1 }), offerId),
        ).toThrow(BUY_CAVE_MERCHANT_OFFER_ERRORS.OFFER_LOCKED);
      }
      expect(() =>
        buy(caveState({ tier: requiresTier }), offerId),
      ).not.toThrow();
    },
  );

  it("rejects without enough of an item", () => {
    expect(() => buy(caveState({ beetles: 0 }))).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.INSUFFICIENT_ITEMS,
    );
  });

  it("rejects without enough coins", () => {
    expect(() =>
      buy(caveState({ tier: CAVE_MAX_TIER, coins: 0 }), COIN_OFFER),
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
