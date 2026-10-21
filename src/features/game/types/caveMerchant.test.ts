import {
  CAVE_MERCHANT_BANDS,
  CAVE_MERCHANT_CURIOSITIES,
  CAVE_MERCHANT_CURIOSITY_CHANCE,
  CAVE_MERCHANT_EPOCH,
  CAVE_MERCHANT_LANES,
  CAVE_MERCHANT_MAX_GAP_HOURS,
  CAVE_MERCHANT_MAX_GENEROSITY,
  CAVE_MERCHANT_MIN_GAP_HOURS,
  CAVE_MERCHANT_MIN_GENEROSITY,
  CAVE_MERCHANT_PRE_LAUNCH_RESTOCK_HOURS,
  CAVE_MERCHANT_STAY_MS,
  CAVE_MERCHANT_WEEKLY_GATHER,
  type CaveMerchantLane,
  type CaveMerchantVisit,
  getCaveMerchantGenerosity,
  getCaveMerchantOffers,
  getCaveMerchantOffersLeft,
  getCaveMerchantSeed,
  getCaveMerchantStock,
  getCaveMerchantVisit,
  isCaveMerchantOpen,
  roundCostDown,
} from "./caveMerchant";
import { getItemValue } from "./itemValue";
import { ITEM_RECIPES } from "./itemValueSources";
import type { InventoryItemName } from "./game";

const HOUR = 60 * 60 * 1000;

/** The first `count` scheduled visits, walked from the chapter launch. */
const walkVisits = (count: number): CaveMerchantVisit[] => {
  const visits: CaveMerchantVisit[] = [];
  let at = CAVE_MERCHANT_EPOCH;
  for (let i = 0; i < count; i++) {
    const visit = getCaveMerchantVisit(at);
    visits.push(visit);
    at = visit.nextOpensAt;
  }
  return visits;
};

const laneOf = (item: InventoryItemName): CaveMerchantLane | undefined =>
  (Object.keys(CAVE_MERCHANT_LANES) as CaveMerchantLane[]).find((lane) =>
    CAVE_MERCHANT_LANES[lane].items.includes(item),
  );

describe("getCaveMerchantSeed", () => {
  it("is a 128-bit Cave seed that differs by visit", () => {
    const seeds = [0, 1, 2, 100, 20_000].map(getCaveMerchantSeed);
    seeds.forEach((seed) => expect(seed).toMatch(/^[0-9a-f]{32}$/));
    expect(new Set(seeds).size).toBe(seeds.length);
    expect(getCaveMerchantSeed(7)).toBe(getCaveMerchantSeed(7));
  });
});

describe("getCaveMerchantVisit", () => {
  // TODO(Cave Dwellers): pre-launch only - delete after launch.
  it("is in town around the clock before launch, restocking every 3 days", () => {
    const restock = CAVE_MERCHANT_PRE_LAUNCH_RESTOCK_HOURS * HOUR;
    expect(restock).toBe(72 * HOUR);

    const last = getCaveMerchantVisit(CAVE_MERCHANT_EPOCH - 1);
    expect(last).toEqual({
      index: -1,
      opensAt: CAVE_MERCHANT_EPOCH - restock,
      closesAt: CAVE_MERCHANT_EPOCH,
      waitHours: CAVE_MERCHANT_PRE_LAUNCH_RESTOCK_HOURS,
      nextOpensAt: CAVE_MERCHANT_EPOCH,
    });
    expect(getCaveMerchantVisit(CAVE_MERCHANT_EPOCH - restock).index).toBe(-1);
    expect(getCaveMerchantVisit(CAVE_MERCHANT_EPOCH - restock - 1).index).toBe(
      -2,
    );

    // Open at every hour of the three weeks before launch.
    for (
      let at = CAVE_MERCHANT_EPOCH - 21 * 24 * HOUR;
      at < CAVE_MERCHANT_EPOCH;
      at += HOUR
    ) {
      expect(isCaveMerchantOpen(getCaveMerchantVisit(at), at)).toBe(true);
    }
    // Today's farms (21 October 2026) are already trading.
    const today = Date.UTC(2026, 9, 21);
    expect(isCaveMerchantOpen(getCaveMerchantVisit(today), today)).toBe(true);
  });

  it("starts the schedule at the chapter launch, 2 November 2026", () => {
    expect(CAVE_MERCHANT_EPOCH).toBe(Date.UTC(2026, 10, 2));
    const visit = getCaveMerchantVisit(CAVE_MERCHANT_EPOCH);
    expect(visit.index).toBe(0);
    expect(visit.opensAt).toBe(CAVE_MERCHANT_EPOCH);
  });

  it("stays for 48 hours once the schedule starts", () => {
    const visit = getCaveMerchantVisit(CAVE_MERCHANT_EPOCH + HOUR);
    expect(visit.index).toBe(0);
    expect(visit.closesAt - visit.opensAt).toBe(CAVE_MERCHANT_STAY_MS);
    expect(isCaveMerchantOpen(visit, CAVE_MERCHANT_EPOCH + HOUR)).toBe(true);
    expect(isCaveMerchantOpen(visit, CAVE_MERCHANT_EPOCH + 47 * HOUR)).toBe(
      true,
    );
    expect(isCaveMerchantOpen(visit, CAVE_MERCHANT_EPOCH + 48 * HOUR)).toBe(
      false,
    );
  });

  it("opens visits 4 to 7 days apart, on the hour, with the wait recorded", () => {
    const visits = walkVisits(400);
    visits.forEach((visit, index) => {
      expect(visit.index).toBe(index);
      const gapHours = (visit.nextOpensAt - visit.opensAt) / HOUR;
      expect(Number.isInteger(gapHours)).toBe(true);
      expect(gapHours).toBeGreaterThanOrEqual(CAVE_MERCHANT_MIN_GAP_HOURS);
      expect(gapHours).toBeLessThanOrEqual(CAVE_MERCHANT_MAX_GAP_HOURS);
      if (index > 0) {
        expect(visit.waitHours).toBe(
          (visit.opensAt - visits[index - 1].opensAt) / HOUR,
        );
      }
    });
    // Launch follows the last 3-day pre-launch restock.
    // TODO(Cave Dwellers): expect CAVE_MERCHANT_MIN_GAP_HOURS after launch.
    expect(visits[0].waitHours).toBe(CAVE_MERCHANT_PRE_LAUNCH_RESTOCK_HOURS);
    // The gaps vary, so the schedule is not a fixed cadence.
    const gaps = new Set(visits.map((v) => v.nextOpensAt - v.opensAt));
    expect(gaps.size).toBeGreaterThan(10);
  });

  it("finds the same visit anywhere inside its gap", () => {
    const [, second] = walkVisits(2);
    expect(getCaveMerchantVisit(second.opensAt + 3 * HOUR)).toEqual(second);
    expect(getCaveMerchantVisit(second.nextOpensAt - 1)).toEqual(second);
    expect(getCaveMerchantVisit(second.nextOpensAt).index).toBe(2);
  });

  it("agrees with the walk whatever order it is asked in", () => {
    const visits = walkVisits(600);
    [599, 3, 420, 0, 598, 250].forEach((index) => {
      const visit = visits[index];
      expect(getCaveMerchantVisit(visit.opensAt + HOUR)).toEqual(visit);
      expect(getCaveMerchantVisit(visit.nextOpensAt - 1)).toEqual(visit);
    });
  });
});

describe("getCaveMerchantGenerosity", () => {
  it("rises with the wait, clamped to the gap range", () => {
    expect(getCaveMerchantGenerosity(CAVE_MERCHANT_MIN_GAP_HOURS)).toBe(
      CAVE_MERCHANT_MIN_GENEROSITY,
    );
    expect(getCaveMerchantGenerosity(CAVE_MERCHANT_MAX_GAP_HOURS)).toBe(
      CAVE_MERCHANT_MAX_GENEROSITY,
    );
    expect(getCaveMerchantGenerosity(0)).toBe(CAVE_MERCHANT_MIN_GENEROSITY);
    expect(getCaveMerchantGenerosity(10_000)).toBe(
      CAVE_MERCHANT_MAX_GENEROSITY,
    );
    const mid = (CAVE_MERCHANT_MIN_GAP_HOURS + CAVE_MERCHANT_MAX_GAP_HOURS) / 2;
    expect(getCaveMerchantGenerosity(mid)).toBeCloseTo(1.2, 5);
  });
});

describe("roundCostDown", () => {
  it("rounds down to a round number", () => {
    expect(roundCostDown(0.4)).toBe(1);
    expect(roundCostDown(7.9)).toBe(6);
    expect(roundCostDown(10)).toBe(10);
    expect(roundCostDown(17)).toBe(15);
    expect(roundCostDown(23)).toBe(20);
    expect(roundCostDown(187)).toBe(150);
    expect(roundCostDown(2_347)).toBe(2_000);
    expect(roundCostDown(8_000)).toBe(8_000);
    expect(roundCostDown(19_999)).toBe(15_000);
  });
});

describe("getCaveMerchantOffers", () => {
  const SWEEP = 400;

  it("stocks eight offers, one per Cave tier", () => {
    const offers = getCaveMerchantOffers(0);
    expect(offers.map((offer) => offer.slot)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(getCaveMerchantStock(0, 0)).toEqual([]);
    expect(getCaveMerchantStock(0, 3)).toEqual(offers.slice(0, 3));
    expect(getCaveMerchantStock(0, 99)).toEqual(offers);
  });

  // TODO(Cave Dwellers): pre-launch only - delete after launch.
  it("restocks before launch at the lowest generosity", () => {
    expect(getCaveMerchantOffers(-1)).not.toEqual(getCaveMerchantOffers(-2));
    [-1, -2, -3].forEach((visit) =>
      getCaveMerchantOffers(visit).forEach((offer) =>
        expect(offer.generosity).toBeGreaterThanOrEqual(
          CAVE_MERCHANT_MIN_GENEROSITY - 1e-9,
        ),
      ),
    );
  });

  it("is deterministic", () => {
    expect(getCaveMerchantOffers(12)).toEqual(getCaveMerchantOffers(12));
    expect(getCaveMerchantOffers(12)).not.toEqual(getCaveMerchantOffers(13));
  });

  it("derives the same stock in both repos", () => {
    // Pinned in full so the client and the API can never disagree on what a
    // visit sells, and so a change to any value table, recipe or pool fails
    // here instead of reshuffling live stock. Update both copies of this test
    // together, and only before the visits involved are live.
    const stock = (visit: number) =>
      getCaveMerchantOffers(visit).map(
        ({ cost, reward }) =>
          `${cost.amount} ${cost.item} -> ${reward.amount} ${reward.item}`,
      );

    expect(stock(-2)).toEqual([
      "30 Wood -> 10 Axe",
      "40 Wood -> 2 Leather",
      "100 Pepper -> 10 Iron",
      "100 Artichoke -> 8 Gold",
      "300 Mud -> 20 Truffle",
      "20 Milk -> 5 Crimstone",
      "10 Pink Beetle -> 20 Oil",
      "100 Wild Mushroom -> 20 Cabbage Cake",
    ]);
    expect(stock(-1)).toEqual([
      "500 Rhubarb -> 5 Wool",
      "300 Yam -> 2 Oil",
      "80 Lemon -> 3 Gold",
      "40 Banana -> 2 Crimstone",
      "80 Banana -> 20 Leather",
      "300 Blueberry -> 1 Obsidian",
      "10 Pink Beetle -> 15 Potato Cake",
      "300 Stone -> 20 Cabbage Cake",
    ]);
    expect(stock(0)).toEqual([
      "100 Cabbage -> 5 Iron",
      "800 Zucchini -> 2 Gold",
      "100 Mud -> 4 Sand Drill",
      "60 Orange -> 15 Truffle",
      "60 Banana -> 15 Leather",
      "30 Milk -> 20 The Lot",
      "30 Milk -> 6 Crimstone",
      "300 Stone -> 20 Kale & Mushroom Pie",
    ]);
    expect(stock(1)).toEqual([
      "10 Stone -> 3 Truffle",
      "1500 Rhubarb -> 8 Magic Mushroom",
      "150 Soybean -> 15 Wool",
      "1000 Carrot -> 15 Milk",
      "6 Oil -> 12 Leather",
      "200 Corn -> 15 Gold",
      "200 Artichoke -> 1 Obsidian",
      "100 Wild Mushroom -> 12 Crimstone",
    ]);
    expect(stock(2)).toEqual([
      "10 Stone -> 5 Roast Veggies",
      "10 Merino Wool -> 3 Oil",
      "150 Beetroot -> 1 Gold Pickaxe",
      "50 Orange -> 20 Magic Mushroom",
      "60 Banana -> 20 Leather",
      "400 Turnip -> 1 Obsidian",
      "20 Blue Beetle -> 6 Crimstone",
      "8000 Carrot -> 5 Oil Drill",
    ]);
    expect(stock(25)).toEqual([
      "5 Merino Wool -> 4 Magic Mushroom",
      "40 Lemon -> 2 Gold",
      "200 Cabbage -> 15 Wool",
      "300 Tomato -> 6 Oil",
      "10 Leather -> 4 Crimstone",
      "30 Milk -> 1 Obsidian",
      "100 Orange -> 5 Gold Pickaxe",
      "50 Milk -> 15 Parsnip Cake",
    ]);
  });

  it("always favours the player, in bulk, across a sweep of visits", () => {
    const visits = walkVisits(SWEEP);
    let curiosities = 0;

    for (const visit of visits) {
      const offers = getCaveMerchantOffers(visit.index);
      const rewards = new Set(offers.map((offer) => offer.reward.item));
      const floor = getCaveMerchantGenerosity(visit.waitHours);

      for (const offer of offers) {
        const band = CAVE_MERCHANT_BANDS[offer.slot - 1];
        const rewardValue =
          (getItemValue(offer.reward.item) as number) * offer.reward.amount;
        const costValue =
          (getItemValue(offer.cost.item) as number) * offer.cost.amount;

        // Favourable, by at least the visit's generosity and never absurdly.
        expect(rewardValue / costValue).toBeGreaterThanOrEqual(floor - 1e-9);
        expect(rewardValue / costValue).toBeLessThanOrEqual(2);
        expect(offer.generosity).toBeCloseTo(rewardValue / costValue, 9);

        // The reward sits in its slot's band.
        expect(rewardValue).toBeGreaterThanOrEqual(band.minValue);
        expect(rewardValue).toBeLessThanOrEqual(band.maxValue);
        // Reward counts are round numbers.
        expect([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20]).toContain(
          offer.reward.amount,
        );
        expect(offer.limit).toBe(band.limit);
        expect(offer.reward.item).not.toBe("Pig Bristles");

        // The cost is bulk from a lane, at most a week's farming, and never
        // something he also sells this visit (so no offer can feed another).
        const lane = laneOf(offer.cost.item) as CaveMerchantLane;
        expect(lane).toBeDefined();
        expect(offer.cost.amount).toBeGreaterThanOrEqual(
          CAVE_MERCHANT_LANES[lane].minAmount,
        );
        expect(offer.cost.amount).toBeLessThanOrEqual(
          CAVE_MERCHANT_WEEKLY_GATHER[offer.cost.item] as number,
        );
        expect(rewards.has(offer.cost.item)).toBe(false);
        expect(laneOf(offer.reward.item)).not.toBe(lane);

        // A dish is never bought with crops or fruit, nor with one of its
        // own ingredients, and never a Fire Pit dish; Truffles never with crops.
        const recipe = ITEM_RECIPES[offer.reward.item];
        if (recipe?.kind === "food") {
          expect(["crops", "fruit"]).not.toContain(lane);
          expect(recipe.building).not.toBe("Fire Pit");
          expect(Object.keys(recipe.ingredients)).not.toContain(
            offer.cost.item,
          );
        }
        if (offer.reward.item === "Truffle") expect(lane).not.toBe("crops");

        if (offer.curiosity) {
          curiosities += 1;
          expect(CAVE_MERCHANT_CURIOSITIES).toContain(offer.reward.item);
        }
      }
    }

    const rate = curiosities / (SWEEP * 8);
    expect(rate).toBeGreaterThan(CAVE_MERCHANT_CURIOSITY_CHANCE - 0.07);
    expect(rate).toBeLessThan(CAVE_MERCHANT_CURIOSITY_CHANCE + 0.07);
  });

  it("never stocks the same reward twice in a visit", () => {
    const indexes = [
      ...walkVisits(SWEEP).map((visit) => visit.index),
      ...Array.from({ length: 50 }, (_, i) => -1 - i),
    ];
    indexes.forEach((index) => {
      const rewards = getCaveMerchantOffers(index).map(
        (offer) => offer.reward.item,
      );
      expect(new Set(rewards).size).toBe(rewards.length);
    });
  });

  it("brings better deals after a longer wait", () => {
    const visits = walkVisits(SWEEP);
    const mean = (indexes: number[]) =>
      indexes
        .flatMap((index) => getCaveMerchantOffers(index))
        .reduce((sum, offer, _, all) => sum + offer.generosity / all.length, 0);

    const short = visits
      .filter((v) => v.waitHours <= CAVE_MERCHANT_MIN_GAP_HOURS + 12)
      .map((v) => v.index);
    const long = visits
      .filter((v) => v.waitHours >= CAVE_MERCHANT_MAX_GAP_HOURS - 12)
      .map((v) => v.index);

    expect(short.length).toBeGreaterThan(10);
    expect(long.length).toBeGreaterThan(10);
    expect(mean(long)).toBeGreaterThan(mean(short) + 0.1);
  });

  it("has a week's gathering for every cost item", () => {
    (Object.keys(CAVE_MERCHANT_LANES) as CaveMerchantLane[]).forEach((lane) =>
      CAVE_MERCHANT_LANES[lane].items.forEach((item) =>
        expect(CAVE_MERCHANT_WEEKLY_GATHER[item]).toBeGreaterThan(0),
      ),
    );
  });

  it("spreads costs across every lane", () => {
    const lanes = new Set(
      walkVisits(100)
        .flatMap((visit) => getCaveMerchantOffers(visit.index))
        .map((offer) => laneOf(offer.cost.item)),
    );
    expect([...lanes].sort()).toEqual(
      (Object.keys(CAVE_MERCHANT_LANES) as CaveMerchantLane[]).sort(),
    );
  });
});

describe("CAVE_MERCHANT_CURIOSITIES", () => {
  it("is a fixed list of priced dishes and tools, never a regular reward", () => {
    expect(CAVE_MERCHANT_CURIOSITIES.length).toBeGreaterThan(50);
    expect(new Set(CAVE_MERCHANT_CURIOSITIES).size).toBe(
      CAVE_MERCHANT_CURIOSITIES.length,
    );
    CAVE_MERCHANT_CURIOSITIES.forEach((item) => {
      expect(getItemValue(item)).toBeGreaterThan(0);
      expect(laneOf(item)).toBeUndefined();
      // The beginner Fire Pit dishes are no prize.
      expect(ITEM_RECIPES[item]?.building).not.toBe("Fire Pit");
    });
  });
});

describe("getCaveMerchantOffersLeft", () => {
  it("counts down the visit's claims per slot", () => {
    expect(
      getCaveMerchantOffersLeft({
        merchant: undefined,
        visit: 3,
        slot: 1,
        limit: 3,
      }),
    ).toBe(3);
    const merchant = { purchases: { "3": { 1: 2, 2: 5 } } };
    expect(
      getCaveMerchantOffersLeft({ merchant, visit: 3, slot: 1, limit: 3 }),
    ).toBe(1);
    expect(
      getCaveMerchantOffersLeft({ merchant, visit: 3, slot: 2, limit: 3 }),
    ).toBe(0);
    expect(
      getCaveMerchantOffersLeft({ merchant, visit: 4, slot: 1, limit: 3 }),
    ).toBe(3);
  });
});
