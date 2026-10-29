import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type {
  CaveMerchant,
  CaveMerchantOffer,
  CaveMerchantVisitState,
  GameState,
} from "features/game/types/game";
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

// The stock the API puts in game state on load (`getCaveMerchantVisitState`).
// Built by hand, as Love Island's shop tests do: the reducer only trusts state.
const OFFERS: CaveMerchantOffer[] = [
  ["Cabbage", 100, "Iron", 5, 3],
  ["Zucchini", 800, "Gold", 2, 3],
  ["Mud", 100, "Sand Drill", 4, 2],
  ["Orange", 60, "Truffle", 15, 2],
  ["Banana", 60, "Leather", 15, 2],
  ["Milk", 30, "The Lot", 20, 1],
  ["Egg", 30, "Crimstone", 6, 1],
  ["Stone", 300, "Kale & Mushroom Pie", 20, 1],
].map(([cost, costAmount, reward, rewardAmount, limit], index) => ({
  slot: index + 1,
  cost: { item: cost, amount: costAmount },
  reward: { item: reward, amount: rewardAmount },
  limit,
  curiosity: false,
})) as CaveMerchantOffer[];

const OPENS_AT = Date.UTC(2026, 10, 2);
const VISIT: CaveMerchantVisitState = {
  index: 0,
  opensAt: OPENS_AT,
  closesAt: OPENS_AT + 48 * HOUR,
  nextOpensAt: OPENS_AT + 120 * HOUR,
  generous: false,
  offers: OFFERS,
};
const NOW = VISIT.opensAt + HOUR;
const NEXT_VISIT: CaveMerchantVisitState = {
  ...VISIT,
  index: 1,
  opensAt: VISIT.nextOpensAt,
  closesAt: VISIT.nextOpensAt + 48 * HOUR,
  nextOpensAt: VISIT.nextOpensAt + 120 * HOUR,
};
const FIRST = OFFERS[0];

/** A farm holding exactly `times` claims' worth of each offer's cost. */
const caveState = ({
  tier = 1,
  times = 10,
  merchant,
  merchantVisit = VISIT,
}: {
  tier?: number;
  times?: number;
  merchant?: CaveMerchant;
  merchantVisit?: CaveMerchantVisitState;
} = {}): GameState => ({
  ...TEST_FARM,
  buildings: { ...TEST_FARM.buildings, Cave: [READY_CAVE] },
  inventory: {
    ...TEST_FARM.inventory,
    ...Object.fromEntries(
      merchantVisit.offers.map((offer) => [
        offer.cost.item,
        new Decimal(offer.cost.amount * times),
      ]),
    ),
  },
  cave: { builtAt: 1, tier, machines: { "1": {} }, merchant, merchantVisit },
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
    "charges and rewards slot %s exactly as the visit in state offers",
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
    const state = caveState({
      merchantVisit: NEXT_VISIT,
      merchant: {
        purchases: { [String(VISIT.index)]: { 1: FIRST.limit } },
      },
    });
    const next = buy(state, 1, NEXT_VISIT.opensAt + HOUR, NEXT_VISIT.index);
    expect(next.cave?.merchant).toEqual({
      purchases: { [String(NEXT_VISIT.index)]: { 1: 1 } },
    });
  });

  it("sells from a pre-launch restock (negative visit index)", () => {
    const preLaunch = { ...VISIT, index: -1 };
    const next = buy(caveState({ merchantVisit: preLaunch }), 1, NOW, -1);

    expect(next.cave?.merchant).toEqual({ purchases: { "-1": { 1: 1 } } });
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

  it("rejects outside the visit in state", () => {
    expect(() => buy(caveState(), 1, VISIT.closesAt)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.NOT_OPEN,
    );
    expect(() => buy(caveState(), 1, VISIT.opensAt - 1)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.NOT_OPEN,
    );
  });

  it("rejects an offer from another visit's stock", () => {
    expect(() => buy(caveState(), 1, NOW, VISIT.index + 1)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.NOT_OPEN,
    );
  });

  it("rejects when no visit was loaded into state", () => {
    const state = caveState();
    const cave = state.cave && { ...state.cave, merchantVisit: undefined };
    expect(() => buy({ ...state, cave })).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.NOT_OPEN,
    );
  });

  it("rejects a slot the visit in state does not stock", () => {
    const state = caveState({
      tier: CAVE_MAX_TIER,
      merchantVisit: { ...VISIT, offers: OFFERS.filter((o) => o.slot !== 2) },
    });
    expect(() => buy(state, 2)).toThrow(
      BUY_CAVE_MERCHANT_OFFER_ERRORS.UNKNOWN_OFFER,
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
