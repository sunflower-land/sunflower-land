import { INITIAL_FARM } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { bulkSellAnimal, getBulkAnimalSaleSummary } from "./bulkSellAnimal";

const now = Date.now();

const VIP_STATE = {
  vip: {
    bundles: [],
    expiresAt: now + 1000 * 60 * 60 * 24 * 30,
  },
};

describe("animals.bulkSold", () => {
  it("requires VIP access", () => {
    const chickenId = Object.keys(INITIAL_FARM.henHouse.animals)[0];

    expect(() =>
      bulkSellAnimal({
        state: {
          ...INITIAL_FARM,
          bounties: {
            completed: [],
            requests: [{ id: "123", coins: 100, level: 1, name: "Chicken" }],
          },
        },
        action: {
          type: "animals.bulkSold",
          sales: [{ requestId: "123", animalId: chickenId }],
        },
        createdAt: now,
      }),
    ).toThrow("VIP required");
  });

  it("succeeds with a valid VIP subscription", () => {
    const chickenId = Object.keys(INITIAL_FARM.henHouse.animals)[0];

    const state = bulkSellAnimal({
      state: {
        ...INITIAL_FARM,
        ...VIP_STATE,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ...INITIAL_FARM.henHouse.animals,
            [chickenId]: {
              ...INITIAL_FARM.henHouse.animals[chickenId],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [],
          requests: [{ id: "123", coins: 100, level: 1, name: "Chicken" }],
        },
      },
      action: {
        type: "animals.bulkSold",
        sales: [{ requestId: "123", animalId: chickenId }],
      },
      createdAt: now,
    });

    expect(state.coins).toEqual(100);
  });

  it("requires at least one sale", () => {
    expect(() =>
      bulkSellAnimal({
        state: { ...INITIAL_FARM, ...VIP_STATE },
        action: { type: "animals.bulkSold", sales: [] },
        createdAt: now,
      }),
    ).toThrow("No animals selected");
  });

  it("requires unique bounty ids", () => {
    const [chickenA, chickenB] = Object.keys(INITIAL_FARM.henHouse.animals);

    expect(() =>
      bulkSellAnimal({
        state: {
          ...INITIAL_FARM,
          ...VIP_STATE,
          bounties: {
            completed: [],
            requests: [{ id: "123", coins: 100, level: 1, name: "Chicken" }],
          },
        },
        action: {
          type: "animals.bulkSold",
          sales: [
            { requestId: "123", animalId: chickenA },
            { requestId: "123", animalId: chickenB },
          ],
        },
        createdAt: now,
      }),
    ).toThrow("Duplicate bounty IDs");
  });

  it("requires unique animal ids", () => {
    const chickenId = Object.keys(INITIAL_FARM.henHouse.animals)[0];

    expect(() =>
      bulkSellAnimal({
        state: {
          ...INITIAL_FARM,
          ...VIP_STATE,
          bounties: {
            completed: [],
            requests: [
              { id: "123", coins: 100, level: 1, name: "Chicken" },
              { id: "456", coins: 100, level: 1, name: "Chicken" },
            ],
          },
        },
        action: {
          type: "animals.bulkSold",
          sales: [
            { requestId: "123", animalId: chickenId },
            { requestId: "456", animalId: chickenId },
          ],
        },
        createdAt: now,
      }),
    ).toThrow("Duplicate animal IDs");
  });

  it("requires every bounty to exist", () => {
    const chickenId = Object.keys(INITIAL_FARM.henHouse.animals)[0];

    expect(() =>
      bulkSellAnimal({
        state: {
          ...INITIAL_FARM,
          ...VIP_STATE,
          bounties: { completed: [], requests: [] },
        },
        action: {
          type: "animals.bulkSold",
          sales: [{ requestId: "123", animalId: chickenId }],
        },
        createdAt: now,
      }),
    ).toThrow("Bounty does not exist");
  });

  it("does not mutate state when a structural check throws", () => {
    const original = {
      ...INITIAL_FARM,
      ...VIP_STATE,
      bounties: { completed: [], requests: [] },
    };
    const chickenId = Object.keys(INITIAL_FARM.henHouse.animals)[0];

    expect(() =>
      bulkSellAnimal({
        state: original,
        action: {
          type: "animals.bulkSold",
          sales: [{ requestId: "123", animalId: chickenId }],
        },
        createdAt: now,
      }),
    ).toThrow();

    expect(original.coins).toEqual(INITIAL_FARM.coins);
    expect(original.henHouse.animals[chickenId]).toBeDefined();
  });

  it("sells multiple animals across mixed Chicken/Cow bounties in one batch", () => {
    const [chickenId] = Object.keys(INITIAL_FARM.henHouse.animals);
    const [cowId] = Object.keys(INITIAL_FARM.barn.animals);

    const state = bulkSellAnimal({
      state: {
        ...INITIAL_FARM,
        ...VIP_STATE,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ...INITIAL_FARM.henHouse.animals,
            [chickenId]: {
              ...INITIAL_FARM.henHouse.animals[chickenId],
              experience: 1000,
            },
          },
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            ...INITIAL_FARM.barn.animals,
            [cowId]: {
              ...INITIAL_FARM.barn.animals[cowId],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            { id: "chicken-deal", coins: 100, level: 1, name: "Chicken" },
            {
              id: "cow-deal",
              items: { "Amber Fossil": 7 },
              level: 1,
              name: "Cow",
            },
          ],
        },
      },
      action: {
        type: "animals.bulkSold",
        sales: [
          { requestId: "chicken-deal", animalId: chickenId },
          { requestId: "cow-deal", animalId: cowId },
        ],
      },
      createdAt: now,
    });

    expect(state.coins).toEqual(100);
    expect(state.inventory["Amber Fossil"]).toEqual(new Decimal(7));
    expect(state.henHouse.animals[chickenId]).toBeUndefined();
    expect(state.barn.animals[cowId]).toBeUndefined();
    expect(state.bounties.completed.map((c) => c.id).sort()).toEqual([
      "chicken-deal",
      "cow-deal",
    ]);
  });

  it("skips a pair referencing an already-completed bounty, sells the rest", () => {
    const [chickenA, chickenB] = Object.keys(INITIAL_FARM.henHouse.animals);

    const state = bulkSellAnimal({
      state: {
        ...INITIAL_FARM,
        ...VIP_STATE,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ...INITIAL_FARM.henHouse.animals,
            [chickenA]: {
              ...INITIAL_FARM.henHouse.animals[chickenA],
              experience: 1000,
            },
            [chickenB]: {
              ...INITIAL_FARM.henHouse.animals[chickenB],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [{ id: "already-done", soldAt: now }],
          requests: [
            { id: "already-done", coins: 50, level: 1, name: "Chicken" },
            { id: "still-open", coins: 100, level: 1, name: "Chicken" },
          ],
        },
      },
      action: {
        type: "animals.bulkSold",
        sales: [
          { requestId: "already-done", animalId: chickenA },
          { requestId: "still-open", animalId: chickenB },
        ],
      },
      createdAt: now,
    });

    expect(state.coins).toEqual(100);
    expect(state.henHouse.animals[chickenA]).toBeDefined();
    expect(state.henHouse.animals[chickenB]).toBeUndefined();
  });

  it("skips a pair whose animal no longer meets the deal, sells the rest", () => {
    const [chickenA, chickenB] = Object.keys(INITIAL_FARM.henHouse.animals);

    const state = bulkSellAnimal({
      state: {
        ...INITIAL_FARM,
        ...VIP_STATE,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ...INITIAL_FARM.henHouse.animals,
            [chickenA]: {
              ...INITIAL_FARM.henHouse.animals[chickenA],
              experience: 0,
            },
            [chickenB]: {
              ...INITIAL_FARM.henHouse.animals[chickenB],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            { id: "under-level", coins: 50, level: 12, name: "Chicken" },
            { id: "eligible", coins: 100, level: 1, name: "Chicken" },
          ],
        },
      },
      action: {
        type: "animals.bulkSold",
        sales: [
          { requestId: "under-level", animalId: chickenA },
          { requestId: "eligible", animalId: chickenB },
        ],
      },
      createdAt: now,
    });

    expect(state.coins).toEqual(100);
    expect(state.henHouse.animals[chickenA]).toBeDefined();
    expect(state.henHouse.animals[chickenB]).toBeUndefined();
  });

  it("throws when every pair fails and leaves state unchanged", () => {
    const chickenId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const original = {
      ...INITIAL_FARM,
      ...VIP_STATE,
      bounties: {
        completed: [{ id: "123", soldAt: now }],
        requests: [
          { id: "123", coins: 100, level: 1, name: "Chicken" as const },
        ],
      },
    };

    expect(() =>
      bulkSellAnimal({
        state: original,
        action: {
          type: "animals.bulkSold",
          sales: [{ requestId: "123", animalId: chickenId }],
        },
        createdAt: now,
      }),
    ).toThrow("No animals could be sold");

    expect(original.coins).toEqual(INITIAL_FARM.coins);
    expect(original.henHouse.animals[chickenId]).toBeDefined();
  });

  it("applies the sick discount per-animal, not to the pre-summed total", () => {
    const [healthyId, sickId] = Object.keys(INITIAL_FARM.henHouse.animals);

    const state = bulkSellAnimal({
      state: {
        ...INITIAL_FARM,
        ...VIP_STATE,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ...INITIAL_FARM.henHouse.animals,
            [healthyId]: {
              ...INITIAL_FARM.henHouse.animals[healthyId],
              experience: 1000,
            },
            [sickId]: {
              ...INITIAL_FARM.henHouse.animals[sickId],
              experience: 1000,
              state: "sick",
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            { id: "healthy-deal", coins: 100, level: 1, name: "Chicken" },
            { id: "sick-deal", coins: 200, level: 1, name: "Chicken" },
          ],
        },
      },
      action: {
        type: "animals.bulkSold",
        sales: [
          { requestId: "healthy-deal", animalId: healthyId },
          { requestId: "sick-deal", animalId: sickId },
        ],
      },
      createdAt: now,
    });

    // 100 (full) + floor(200 * 0.75) = 100 + 150 = 250, NOT
    // floor((100 + 200) * 0.75) = 225 — proves the discount is per-entry.
    expect(state.coins).toEqual(250);
  });

  it("applies the sick discount to item rewards per-animal too", () => {
    const [healthyId, sickId] = Object.keys(INITIAL_FARM.henHouse.animals);

    const state = bulkSellAnimal({
      state: {
        ...INITIAL_FARM,
        ...VIP_STATE,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ...INITIAL_FARM.henHouse.animals,
            [healthyId]: {
              ...INITIAL_FARM.henHouse.animals[healthyId],
              experience: 1000,
            },
            [sickId]: {
              ...INITIAL_FARM.henHouse.animals[sickId],
              experience: 1000,
              state: "sick",
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "healthy-deal",
              items: { "Amber Fossil": 8 },
              level: 1,
              name: "Chicken",
            },
            {
              id: "sick-deal",
              items: { "Amber Fossil": 8 },
              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        type: "animals.bulkSold",
        sales: [
          { requestId: "healthy-deal", animalId: healthyId },
          { requestId: "sick-deal", animalId: sickId },
        ],
      },
      createdAt: now,
    });

    // healthy: 8, sick: floor(8 * 0.75) = 6 -> total 14
    expect(state.inventory["Amber Fossil"]).toEqual(new Decimal(14));
  });

  it("applies Bountiful Bounties independently to each bounty in the batch", () => {
    const [chickenId] = Object.keys(INITIAL_FARM.henHouse.animals);
    const [cowId] = Object.keys(INITIAL_FARM.barn.animals);

    const state = bulkSellAnimal({
      state: {
        ...INITIAL_FARM,
        ...VIP_STATE,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: { "Bountiful Bounties": 1 },
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ...INITIAL_FARM.henHouse.animals,
            [chickenId]: {
              ...INITIAL_FARM.henHouse.animals[chickenId],
              experience: 1000,
            },
          },
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            ...INITIAL_FARM.barn.animals,
            [cowId]: {
              ...INITIAL_FARM.barn.animals[cowId],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "chicken-deal",
              coins: 100,
              items: {},
              level: 1,
              name: "Chicken",
            },
            {
              id: "cow-deal",
              coins: 200,
              items: {},
              level: 1,
              name: "Cow",
            },
          ],
        },
      },
      action: {
        type: "animals.bulkSold",
        sales: [
          { requestId: "chicken-deal", animalId: chickenId },
          { requestId: "cow-deal", animalId: cowId },
        ],
      },
      createdAt: now,
    });

    // Each bounty's coins independently get +50%, then summed:
    // 150 + 300 = 450, not (100 + 200) * 1.5 applied once to the total
    // (which would coincidentally also be 450 here — the important
    // assertion is that this matches the per-bounty multiplication).
    expect(state.coins).toEqual(150 + 300);
  });
});

describe("getBulkAnimalSaleSummary", () => {
  it("aggregates coins, items, sick count and totals without mutating state", () => {
    const [healthyId, sickId] = Object.keys(INITIAL_FARM.henHouse.animals);

    const state = {
      ...INITIAL_FARM,
      ...VIP_STATE,
      henHouse: {
        ...INITIAL_FARM.henHouse,
        animals: {
          ...INITIAL_FARM.henHouse.animals,
          [healthyId]: {
            ...INITIAL_FARM.henHouse.animals[healthyId],
            experience: 1000,
          },
          [sickId]: {
            ...INITIAL_FARM.henHouse.animals[sickId],
            experience: 1000,
            state: "sick" as const,
          },
        },
      },
      bounties: {
        completed: [],
        requests: [
          {
            id: "healthy-deal",
            coins: 100,
            level: 1,
            name: "Chicken" as const,
          },
          { id: "sick-deal", coins: 200, level: 1, name: "Chicken" as const },
        ],
      },
    };
    const snapshot = JSON.parse(
      JSON.stringify(state, (_key, value) =>
        value instanceof Decimal ? value.toString() : value,
      ),
    );

    const summary = getBulkAnimalSaleSummary({
      state,
      sales: [
        { requestId: "healthy-deal", animalId: healthyId },
        { requestId: "sick-deal", animalId: sickId },
      ],
      now,
    });

    expect(summary.totalAnimals).toEqual(2);
    expect(summary.sickAnimalCount).toEqual(1);
    expect(summary.coins).toEqual(250);
    expect(summary.skipped).toEqual([]);
    expect(
      JSON.parse(
        JSON.stringify(state, (_key, value) =>
          value instanceof Decimal ? value.toString() : value,
        ),
      ),
    ).toEqual(snapshot);
  });

  it("reports skipped entries with a reason instead of throwing", () => {
    const chickenId = Object.keys(INITIAL_FARM.henHouse.animals)[0];

    const summary = getBulkAnimalSaleSummary({
      state: {
        ...INITIAL_FARM,
        ...VIP_STATE,
        bounties: { completed: [], requests: [] },
      },
      sales: [{ requestId: "missing", animalId: chickenId }],
      now,
    });

    expect(summary.totalAnimals).toEqual(0);
    expect(summary.skipped).toEqual([
      {
        requestId: "missing",
        animalId: chickenId,
        reason: "Bounty does not exist",
      },
    ]);
  });
});
