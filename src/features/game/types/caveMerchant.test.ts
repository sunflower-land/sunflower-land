import type { Cave, CaveMerchantOffer } from "./game";
import {
  getAvailableCaveMerchantOffers,
  hasUnseenCaveMerchantOffers,
  viewCaveMerchantOffers,
} from "./caveMerchant";

const NOW = 10_000;
const offer: CaveMerchantOffer = {
  slot: 1,
  cost: { item: "Wood", amount: 10 },
  reward: { item: "Sand Shovel", amount: 1 },
  limit: 3,
  curiosity: false,
};
const makeCave = (): Cave => ({
  builtAt: 0,
  tier: 1,
  machines: {},
  merchantVisit: {
    index: 1,
    opensAt: 1_000,
    closesAt: 100_000,
    nextOpensAt: 200_000,
    generous: false,
    offers: [offer, { ...offer, slot: 2 }],
  },
});

describe("unseen Cave merchant offers", () => {
  it("requires a loaded, open visit with unlocked stock", () => {
    expect(hasUnseenCaveMerchantOffers(undefined, NOW)).toBe(false);
    const cave = makeCave();
    expect(hasUnseenCaveMerchantOffers(cave, NOW)).toBe(true);
    expect(hasUnseenCaveMerchantOffers(cave, 999)).toBe(false);
    expect(hasUnseenCaveMerchantOffers(cave, 100_000)).toBe(false);
    expect(hasUnseenCaveMerchantOffers(cave, 200_000)).toBe(false);
    cave.merchantVisit!.offers = [];
    expect(hasUnseenCaveMerchantOffers(cave, NOW)).toBe(false);
    expect(viewCaveMerchantOffers(cave, NOW)).toBeUndefined();
    cave.merchantVisit = undefined;
    expect(hasUnseenCaveMerchantOffers(cave, NOW)).toBe(false);
  });

  it("acknowledges only unlocked offers and reveals the new tier's stock", () => {
    const cave = makeCave();
    const seen = viewCaveMerchantOffers(cave, NOW);
    expect(seen?.offers).toHaveLength(1);
    expect(hasUnseenCaveMerchantOffers(cave, NOW, seen)).toBe(false);
    cave.tier = 2;
    expect(hasUnseenCaveMerchantOffers(cave, NOW, seen)).toBe(true);
    const expanded = viewCaveMerchantOffers(cave, NOW, seen);
    expect(expanded?.offers).toHaveLength(2);
    expect(hasUnseenCaveMerchantOffers(cave, NOW, expanded)).toBe(false);
  });

  it("recognises new visits even with identical offers", () => {
    const cave = makeCave();
    const seen = viewCaveMerchantOffers(cave, NOW);
    cave.merchantVisit!.index++;
    expect(hasUnseenCaveMerchantOffers(cave, NOW, seen)).toBe(true);
    expect(viewCaveMerchantOffers(cave, NOW, seen)?.offers).toHaveLength(1);
  });

  it.each([
    { cost: { item: "Wood" as const, amount: 20 } },
    { reward: { item: "Sand Drill" as const, amount: 2 } },
    { limit: 4 },
    { curiosity: true },
  ])("recognises updated stock within the same visit: %p", (update) => {
    const cave = makeCave();
    const seen = viewCaveMerchantOffers(cave, NOW);
    cave.merchantVisit!.offers[0] = { ...offer, ...update };
    expect(hasUnseenCaveMerchantOffers(cave, NOW, seen)).toBe(true);
    const updated = viewCaveMerchantOffers(cave, NOW, seen);
    expect(hasUnseenCaveMerchantOffers(cave, NOW, updated)).toBe(false);
  });

  it("ignores ordering, purchases and remaining stock when identifying offers", () => {
    const cave = makeCave();
    cave.tier = 2;
    const seen = viewCaveMerchantOffers(cave, NOW);
    cave.merchantVisit!.offers.reverse();
    cave.merchant = { purchases: { "1": { 1: 1 } } };
    expect(hasUnseenCaveMerchantOffers(cave, NOW, seen)).toBe(false);
    cave.merchant.purchases["1"][1] = 3;
    expect(
      getAvailableCaveMerchantOffers(cave, NOW).map(({ slot }) => slot),
    ).toEqual([2]);
    expect(hasUnseenCaveMerchantOffers(cave, NOW, seen)).toBe(false);
    cave.merchant.purchases["1"][2] = 3;
    expect(hasUnseenCaveMerchantOffers(cave, NOW)).toBe(false);
  });

  it("does not acknowledge locked or sold out offers", () => {
    const cave = makeCave();
    cave.merchant = { purchases: { "1": { 1: 3 } } };
    expect(viewCaveMerchantOffers(cave, NOW)).toBeUndefined();
    cave.tier = 2;
    const seen = viewCaveMerchantOffers(cave, NOW);
    expect(seen?.offers).toHaveLength(1);
    expect(hasUnseenCaveMerchantOffers(cave, NOW, seen)).toBe(false);
  });

  it("preserves earlier views when stock disappears and returns in the same visit", () => {
    const cave = makeCave();
    const seen = viewCaveMerchantOffers(cave, NOW);
    cave.merchantVisit!.offers = [];
    expect(viewCaveMerchantOffers(cave, NOW, seen)).toEqual(seen);
    cave.merchantVisit!.offers = [offer];
    expect(hasUnseenCaveMerchantOffers(cave, NOW, seen)).toBe(false);
  });
});
