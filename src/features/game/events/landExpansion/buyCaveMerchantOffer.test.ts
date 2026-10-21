import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { CaveMerchant, GameState } from "features/game/types/game";
import {
  CAVE_MERCHANT_EPOCH,
  type CaveMerchantOffer,
  getCaveMerchantOffers,
  getCaveMerchantVisit,
} from "features/game/types/caveMerchant";
import { CAVE_MAX_TIER } from "features/game/types/caveTiers";
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

const HOUR = 60 * 60 * 1000;

// Visit 0 opens at the chapter launch and stays 48h; visit 1 opens 4-7 days
// later. Before launch he restocks every 3 days and never leaves.
const VISIT = getCaveMerchantVisit(CAVE_MERCHANT_EPOCH);
const NOW = VISIT.opensAt + HOUR;
const CLOSED_NOW = VISIT.closesAt + HOUR;
const NEXT_VISIT = getCaveMerchantVisit(VISIT.nextOpensAt);
const NEXT_NOW = NEXT_VISIT.opensAt + HOUR;

const OFFERS = getCaveMerchantOffers(VISIT.index);
const FIRST = OFFERS[0];

/** A farm holding exactly `times` claims' worth of each offer's cost. */
const caveState = ({
  tier = 1,
  times = 10,
  merchant,
  offers = OFFERS,
}: {
  tier?: number;
  times?: number;
  merchant?: CaveMerchant;
  offers?: CaveMerchantOffer[];
} = {}): GameState => ({
  ...TEST_FARM,
  buildings: { ...TEST_FARM.buildings, Cave: [READY_CAVE] },
  inventory: {
    ...TEST_FARM.inventory,
    ...Object.fromEntries(
      offers.map((offer) => [
        offer.cost.item,
        new Decimal(offer.cost.amount * times),
      ]),
    ),
  },
  cave: { builtAt: 1, tier, machines: { "1": {} }, merchant },
});

const buy = (
  state: GameState,
  slot = 1,
  createdAt = NOW,
  visit = VISIT.index,
) =>
  buyCaveMerchantOffer({
    state,
    action: { type: "cave.merchantOfferBought", visit, slot },
    createdAt,
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

  it.each(OFFERS.map((offer) => [offer.slot, offer] as const))(
    "charges and rewards slot %s exactly as generated",
    (slot, offer) => {
      const state = caveState({ tier: CAVE_MAX_TIER });
      const next = buy(state, slot);

      expect(next.inventory[offer.cost.item]).toEqual(
        (state.inventory[offer.cost.item] as Decimal).minus(offer.cost.amount),
      );
      expect(next.inventory[offer.reward.item]).toEqual(
        (state.inventory[offer.reward.item] ?? new Decimal(0)).add(
          offer.reward.amount,
        ),
      );
    },
  );

  it("records the purchase under the visit", () => {
    const next = buy(buy(caveState()));
    expect(next.cave?.merchant).toEqual({
      purchases: { [String(VISIT.index)]: { 1: 2 } },
    });
  });

  it("enforces the per-visit limit", () => {
    let state = caveState();
    for (let i = 0; i < FIRST.limit; i++) {
      state = buy(state);
    }
    expect(() => buy(state)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.LIMIT_REACHED,
    );
  });

  it("resets the limit on the next visit and drops the old one", () => {
    const nextOffers = getCaveMerchantOffers(NEXT_VISIT.index);
    const state = caveState({
      offers: nextOffers,
      merchant: {
        purchases: { [String(VISIT.index)]: { 1: FIRST.limit } },
      },
    });
    const next = buy(state, 1, NEXT_NOW, NEXT_VISIT.index);
    expect(next.cave?.merchant).toEqual({
      purchases: { [String(NEXT_VISIT.index)]: { 1: 1 } },
    });
  });

  // TODO(Cave Dwellers): pre-launch only - delete both tests after launch.
  it("sells before launch, from the 3-day restock", () => {
    const at = CAVE_MERCHANT_EPOCH - HOUR;
    const preLaunch = getCaveMerchantVisit(at);
    expect(preLaunch.index).toBe(-1);

    const [offer] = getCaveMerchantOffers(preLaunch.index);
    const state = caveState({ offers: [offer] });
    const next = buy(state, 1, at, preLaunch.index);

    expect(next.inventory[offer.reward.item]).toEqual(
      (state.inventory[offer.reward.item] ?? new Decimal(0)).add(
        offer.reward.amount,
      ),
    );
    expect(next.cave?.merchant).toEqual({ purchases: { "-1": { 1: 1 } } });
  });

  it("keeps the launch visit's counts safe from a late pre-launch event", () => {
    const at = CAVE_MERCHANT_EPOCH - HOUR;
    const [offer] = getCaveMerchantOffers(-1);
    const state = caveState({
      offers: [offer],
      merchant: { purchases: { [String(VISIT.index)]: { 1: 1 } } },
    });
    expect(() => buy(state, 1, at, -1)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.PERIOD_ENDED,
    );
  });

  it("rejects a purchase from a visit that has already ended", () => {
    // Late events from the previous visit must not wipe the new counts.
    const state = caveState({
      merchant: { purchases: { [String(NEXT_VISIT.index)]: { 1: 1 } } },
    });
    expect(() => buy(state)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.PERIOD_ENDED,
    );
  });

  it("rejects while the Merchant is away", () => {
    expect(() => buy(caveState(), 1, CLOSED_NOW)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.NOT_OPEN,
    );
    expect(() => buy(caveState(), 1, NEXT_VISIT.opensAt - HOUR)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.NOT_OPEN,
    );
  });

  it("rejects an offer from another visit's stock", () => {
    expect(() => buy(caveState(), 1, NOW, VISIT.index + 1)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.NOT_OPEN,
    );
  });

  it.each([1, 2, 3, 4, 5, 6, 7, 8])(
    "locks slot %s below its tier and sells it at it",
    (slot) => {
      if (slot > 1) {
        expect(() => buy(caveState({ tier: slot - 1 }), slot)).toThrow(
          BUY_CAVE_MERCHANT_OFFER_ERRORS.OFFER_LOCKED,
        );
      }
      expect(() => buy(caveState({ tier: slot }), slot)).not.toThrow();
    },
  );

  it.each([0, 9, 1.5, NaN])("rejects slot %s", (slot) => {
    expect(() => buy(caveState({ tier: CAVE_MAX_TIER }), slot)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.UNKNOWN_OFFER,
    );
  });

  it("rejects without enough of the cost item", () => {
    expect(() => buy(caveState({ times: 0 }))).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.INSUFFICIENT_ITEMS,
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
