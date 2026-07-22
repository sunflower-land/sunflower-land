import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { Animal, GameState } from "features/game/types/game";
import {
  feedAllAnimals,
  getCoveredAnimalTypes,
  getFeedAllTargets,
} from "./feedAllAnimals";

const now = Date.now();

const makeAnimal = (
  overrides: Partial<Animal> & { id: string; type: Animal["type"] },
): Animal => ({
  state: "idle",
  asleepAt: 0,
  experience: 0,
  createdAt: 0,
  item: "Petting Hand",
  lovedAt: 0,
  awakeAt: 0,
  ...overrides,
});

const placed = { coordinates: { x: 0, y: 0 }, createdAt: 0, readyAt: 0 };

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  buildings: {
    "Hen House": [{ ...placed, id: "hh" }],
    Barn: [{ ...placed, id: "barn" }],
  },
};

const withGoldEgg = (state: GameState): GameState => ({
  ...state,
  inventory: { ...state.inventory, "Gold Egg": new Decimal(1) },
  collectibles: {
    ...state.collectibles,
    "Gold Egg": [{ ...placed, id: "1" }],
  },
});

const withGoldenCow = (state: GameState): GameState => ({
  ...state,
  inventory: { ...state.inventory, "Golden Cow": new Decimal(1) },
  collectibles: {
    ...state.collectibles,
    "Golden Cow": [{ ...placed, id: "1" }],
  },
});

const withGoldenSheep = (state: GameState): GameState => ({
  ...state,
  inventory: { ...state.inventory, "Golden Sheep": new Decimal(1) },
  collectibles: {
    ...state.collectibles,
    "Golden Sheep": [{ ...placed, id: "1" }],
  },
});

const withOracleSyringe = (state: GameState): GameState => ({
  ...state,
  bumpkin: {
    ...state.bumpkin,
    equipped: { ...state.bumpkin.equipped, wings: "Oracle Syringe" },
  },
});

describe("getCoveredAnimalTypes", () => {
  it("returns no types when no golden assets are placed", () => {
    expect(
      getCoveredAnimalTypes({ state: GAME_STATE, building: "Hen House" }),
    ).toEqual([]);
    expect(
      getCoveredAnimalTypes({ state: GAME_STATE, building: "Barn" }),
    ).toEqual([]);
  });

  it("covers chickens in the Hen House when Gold Egg is placed", () => {
    expect(
      getCoveredAnimalTypes({
        state: withGoldEgg(GAME_STATE),
        building: "Hen House",
      }),
    ).toEqual(["Chicken"]);
  });

  it("does not cover the Barn with only a Gold Egg", () => {
    expect(
      getCoveredAnimalTypes({
        state: withGoldEgg(GAME_STATE),
        building: "Barn",
      }),
    ).toEqual([]);
  });

  it("covers only cows with Golden Cow, and both with both assets", () => {
    expect(
      getCoveredAnimalTypes({
        state: withGoldenCow(GAME_STATE),
        building: "Barn",
      }),
    ).toEqual(["Cow"]);
    expect(
      getCoveredAnimalTypes({
        state: withGoldenSheep(withGoldenCow(GAME_STATE)),
        building: "Barn",
      }),
    ).toEqual(["Cow", "Sheep"]);
  });

  it("does not cover a Gold Egg that is owned but not placed", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: { ...GAME_STATE.inventory, "Gold Egg": new Decimal(1) },
      collectibles: {},
    };
    expect(getCoveredAnimalTypes({ state, building: "Hen House" })).toEqual([]);
  });
});

describe("getFeedAllTargets", () => {
  it("targets awake idle, sad and happy chickens for feeding", () => {
    const state = withGoldEgg({
      ...GAME_STATE,
      henHouse: {
        ...GAME_STATE.henHouse,
        animals: {
          "1": makeAnimal({ id: "1", type: "Chicken", state: "idle" }),
          "2": makeAnimal({ id: "2", type: "Chicken", state: "sad" }),
          "3": makeAnimal({ id: "3", type: "Chicken", state: "happy" }),
        },
      },
    });

    expect(
      getFeedAllTargets({ state, building: "Hen House", createdAt: now }),
    ).toEqual({ toClaim: [], toCure: [], toFeed: ["1", "2", "3"] });
  });

  it("skips sleeping animals", () => {
    const state = withGoldEgg({
      ...GAME_STATE,
      henHouse: {
        ...GAME_STATE.henHouse,
        animals: {
          "1": makeAnimal({
            id: "1",
            type: "Chicken",
            state: "idle",
            awakeAt: now + 10_000,
          }),
        },
      },
    });

    expect(
      getFeedAllTargets({ state, building: "Hen House", createdAt: now }),
    ).toEqual({ toClaim: [], toCure: [], toFeed: [] });
  });

  it("targets ready animals for claiming, not feeding", () => {
    const state = withGoldEgg({
      ...GAME_STATE,
      henHouse: {
        ...GAME_STATE.henHouse,
        animals: {
          "1": makeAnimal({ id: "1", type: "Chicken", state: "ready" }),
        },
      },
    });

    expect(
      getFeedAllTargets({ state, building: "Hen House", createdAt: now }),
    ).toEqual({ toClaim: ["1"], toCure: [], toFeed: [] });
  });

  it("skips sick animals without the Oracle Syringe", () => {
    const state = withGoldEgg({
      ...GAME_STATE,
      inventory: { ...GAME_STATE.inventory, "Barn Delight": new Decimal(5) },
      henHouse: {
        ...GAME_STATE.henHouse,
        animals: {
          "1": makeAnimal({ id: "1", type: "Chicken", state: "sick" }),
        },
      },
    });

    expect(
      getFeedAllTargets({ state, building: "Hen House", createdAt: now }),
    ).toEqual({ toClaim: [], toCure: [], toFeed: [] });
  });

  it("targets sick animals for curing with the Oracle Syringe active", () => {
    const state = withOracleSyringe(
      withGoldEgg({
        ...GAME_STATE,
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "1": makeAnimal({ id: "1", type: "Chicken", state: "sick" }),
          },
        },
      }),
    );

    expect(
      getFeedAllTargets({ state, building: "Hen House", createdAt: now }),
    ).toEqual({ toClaim: [], toCure: ["1"], toFeed: [] });
  });

  it("only targets covered species in the Barn", () => {
    const state = withGoldenCow({
      ...GAME_STATE,
      barn: {
        ...GAME_STATE.barn,
        animals: {
          cow: makeAnimal({ id: "cow", type: "Cow", state: "idle" }),
          sheep: makeAnimal({ id: "sheep", type: "Sheep", state: "idle" }),
        },
      },
    });

    expect(
      getFeedAllTargets({ state, building: "Barn", createdAt: now }),
    ).toEqual({ toClaim: [], toCure: [], toFeed: ["cow"] });
  });

  it("does not target over-capacity animals for feeding but still claims them", () => {
    // Hen House level 1 has a base capacity of 10; the oldest animals beyond
    // capacity are locked (see getOverCapacityAnimalIds in buyAnimal.ts).
    const animals: Record<string, Animal> = {};
    for (let i = 0; i < 11; i++) {
      animals[`chicken-${i}`] = makeAnimal({
        id: `chicken-${i}`,
        type: "Chicken",
        state: i === 0 ? "ready" : "idle",
        createdAt: i + 1, // chicken-0 is oldest -> locked
      });
    }

    const state = withGoldEgg({
      ...GAME_STATE,
      henHouse: { ...GAME_STATE.henHouse, level: 1, animals },
    });

    const targets = getFeedAllTargets({
      state,
      building: "Hen House",
      createdAt: now,
    });

    expect(targets.toClaim).toEqual(["chicken-0"]);
    expect(targets.toFeed).toHaveLength(10);
    expect(targets.toFeed).not.toContain("chicken-0");
  });
});

describe("feedAllAnimals", () => {
  it("throws when the building is not placed", () => {
    expect(() =>
      feedAllAnimals({
        createdAt: now,
        state: withGoldEgg({
          ...GAME_STATE,
          buildings: {
            "Hen House": [
              { id: "hh", coordinates: undefined, createdAt: 0, readyAt: 0 },
            ],
          },
        }),
        action: { type: "animals.fedAll", building: "Hen House" },
      }),
    ).toThrow("Building does not exist");
  });

  it("throws when no golden asset is active for the building", () => {
    expect(() =>
      feedAllAnimals({
        createdAt: now,
        state: withGoldEgg(GAME_STATE), // Gold Egg does not cover the Barn
        action: { type: "animals.fedAll", building: "Barn" },
      }),
    ).toThrow("No active golden asset for this building");
  });

  it("throws when no animals are eligible", () => {
    const state = withGoldEgg({
      ...GAME_STATE,
      henHouse: {
        ...GAME_STATE.henHouse,
        animals: {
          "1": makeAnimal({
            id: "1",
            type: "Chicken",
            state: "idle",
            awakeAt: now + 10_000,
          }),
          "2": makeAnimal({ id: "2", type: "Chicken", state: "sick" }),
        },
      },
    });

    expect(() =>
      feedAllAnimals({
        createdAt: now,
        state,
        action: { type: "animals.fedAll", building: "Hen House" },
      }),
    ).toThrow("No animals to feed");
  });

  it("feeds every awake chicken for free with the Gold Egg", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldEgg({
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Gold Egg": new Decimal(1),
          Hay: new Decimal(5),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "1": makeAnimal({ id: "1", type: "Chicken" }),
            "2": makeAnimal({ id: "2", type: "Chicken" }),
            "3": makeAnimal({ id: "3", type: "Chicken" }),
          },
        },
      }),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    expect(state.henHouse.animals["1"].experience).toBeGreaterThan(0);
    expect(state.henHouse.animals["2"].experience).toBeGreaterThan(0);
    expect(state.henHouse.animals["3"].experience).toBeGreaterThan(0);
    // A free feed levels the animal to ready, so the same click harvests
    // its produce and puts it to sleep.
    expect(state.henHouse.animals["1"].state).toEqual("idle");
    expect(state.henHouse.animals["1"].asleepAt).toEqual(now);
    expect(state.henHouse.animals["1"].awakeAt).toBeGreaterThan(now);
    expect(state.inventory.Egg?.gte(3)).toBe(true);
    // No food consumed
    expect(state.inventory.Hay).toEqual(new Decimal(5));
    // Boost + activity tracked
    expect(state.boostsUsedAt?.["Gold Egg"]).toEqual(now);
    expect(state.farmActivity["Chicken Fed"]).toEqual(3);
  });

  it("feeds only cows with Golden Cow in the Barn", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldenCow({
        ...GAME_STATE,
        barn: {
          ...GAME_STATE.barn,
          animals: {
            cow: makeAnimal({ id: "cow", type: "Cow" }),
            sheep: makeAnimal({ id: "sheep", type: "Sheep" }),
          },
        },
      }),
      action: { type: "animals.fedAll", building: "Barn" },
    });

    expect(state.barn.animals["cow"].experience).toBeGreaterThan(0);
    expect(state.barn.animals["sheep"].experience).toEqual(0);
    expect(state.boostsUsedAt?.["Golden Cow"]).toEqual(now);
  });

  it("feeds only sheep with Golden Sheep in the Barn", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldenSheep({
        ...GAME_STATE,
        barn: {
          ...GAME_STATE.barn,
          animals: {
            cow: makeAnimal({ id: "cow", type: "Cow" }),
            sheep: makeAnimal({ id: "sheep", type: "Sheep" }),
          },
        },
      }),
      action: { type: "animals.fedAll", building: "Barn" },
    });

    expect(state.barn.animals["sheep"].experience).toBeGreaterThan(0);
    expect(state.barn.animals["sheep"].asleepAt).toEqual(now);
    expect(state.barn.animals["cow"].experience).toEqual(0);
    expect(state.barn.animals["cow"].state).toEqual("idle");
    expect(state.boostsUsedAt?.["Golden Sheep"]).toEqual(now);
  });

  it("feeds cows and sheep with both golden assets in the Barn", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldenSheep(
        withGoldenCow({
          ...GAME_STATE,
          barn: {
            ...GAME_STATE.barn,
            animals: {
              cow: makeAnimal({ id: "cow", type: "Cow" }),
              sheep: makeAnimal({ id: "sheep", type: "Sheep" }),
            },
          },
        }),
      ),
      action: { type: "animals.fedAll", building: "Barn" },
    });

    expect(state.barn.animals["cow"].experience).toBeGreaterThan(0);
    expect(state.barn.animals["sheep"].experience).toBeGreaterThan(0);
  });

  it("leaves sleeping animals untouched while feeding awake ones", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldEgg({
        ...GAME_STATE,
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            awake: makeAnimal({ id: "awake", type: "Chicken" }),
            asleep: makeAnimal({
              id: "asleep",
              type: "Chicken",
              awakeAt: now + 10_000,
            }),
          },
        },
      }),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    expect(state.henHouse.animals["awake"].experience).toBeGreaterThan(0);
    expect(state.henHouse.animals["asleep"].experience).toEqual(0);
    expect(state.henHouse.animals["asleep"].state).toEqual("idle");
  });

  it("claims produce of ready animals and puts them to sleep", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldEgg({
        ...GAME_STATE,
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "1": makeAnimal({
              id: "1",
              type: "Chicken",
              state: "ready",
              experience: 120,
              reward: { items: [{ name: "Egg", amount: 1 }] },
            }),
          },
        },
      }),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    const chicken = state.henHouse.animals["1"];
    expect(chicken.state).toEqual("idle");
    expect(chicken.asleepAt).toEqual(now);
    expect(chicken.awakeAt).toBeGreaterThan(now);
    // Reward items granted by claimProduce
    expect(state.inventory.Egg?.gte(1)).toBe(true);
    // Claiming must not be followed by a feed
    expect(chicken.experience).toEqual(120);
  });

  it("skips sick animals without the Oracle Syringe even with Barn Delight", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldEgg({
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Gold Egg": new Decimal(1),
          "Barn Delight": new Decimal(5),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            sick: makeAnimal({ id: "sick", type: "Chicken", state: "sick" }),
            healthy: makeAnimal({ id: "healthy", type: "Chicken" }),
          },
        },
      }),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    expect(state.henHouse.animals["sick"].state).toEqual("sick");
    expect(state.henHouse.animals["sick"].experience).toEqual(0);
    expect(state.inventory["Barn Delight"]).toEqual(new Decimal(5));
    expect(state.henHouse.animals["healthy"].experience).toBeGreaterThan(0);
  });

  it("cures and feeds sick animals with the Oracle Syringe, consuming no Barn Delight", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withOracleSyringe(
        withGoldEgg({
          ...GAME_STATE,
          henHouse: {
            ...GAME_STATE.henHouse,
            animals: {
              sick: makeAnimal({ id: "sick", type: "Chicken", state: "sick" }),
            },
          },
        }),
      ),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    const chicken = state.henHouse.animals["sick"];
    // Cured, fed to ready, then harvested and put to sleep in one click
    expect(chicken.state).toEqual("idle");
    expect(chicken.asleepAt).toEqual(now);
    expect(chicken.experience).toBeGreaterThan(0);
    expect(state.inventory["Barn Delight"] ?? new Decimal(0)).toEqual(
      new Decimal(0),
    );
    expect(state.farmActivity["Chicken Cured"]).toEqual(1);
  });

  it("does not feed over-capacity animals", () => {
    const animals: Record<string, Animal> = {};
    for (let i = 0; i < 11; i++) {
      animals[`chicken-${i}`] = makeAnimal({
        id: `chicken-${i}`,
        type: "Chicken",
        createdAt: i + 1, // chicken-0 is oldest -> locked at capacity 10
      });
    }

    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldEgg({
        ...GAME_STATE,
        henHouse: { ...GAME_STATE.henHouse, level: 1, animals },
      }),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    expect(state.henHouse.animals["chicken-0"].experience).toEqual(0);
    expect(state.henHouse.animals["chicken-1"].experience).toBeGreaterThan(0);
    expect(state.henHouse.animals["chicken-10"].experience).toBeGreaterThan(0);
  });

  it("harvests animals that become ready from feeding in the same click", () => {
    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldEgg({
        ...GAME_STATE,
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "1": makeAnimal({ id: "1", type: "Chicken", state: "idle" }),
          },
        },
      }),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    const chicken = state.henHouse.animals["1"];
    // The free feed grants exactly the XP needed for the next level, which
    // makes the animal ready; the same action then claims its produce.
    expect(chicken.experience).toBeGreaterThan(0);
    expect(chicken.state).toEqual("idle");
    expect(chicken.asleepAt).toEqual(now);
    expect(chicken.awakeAt).toBeGreaterThan(now);
    expect(state.inventory.Egg?.gte(1)).toBe(true);
    expect(state.farmActivity["Egg Collected"]).toEqual(1);
  });

  it("cures a sick over-capacity animal without feeding or claiming it", () => {
    const animals: Record<string, Animal> = {};
    for (let i = 0; i < 11; i++) {
      animals[`chicken-${i}`] = makeAnimal({
        id: `chicken-${i}`,
        type: "Chicken",
        state: i === 0 ? "sick" : "idle",
        createdAt: i + 1, // chicken-0 is oldest -> locked at capacity 10
      });
    }

    const state = feedAllAnimals({
      createdAt: now,
      state: withOracleSyringe(
        withGoldEgg({
          ...GAME_STATE,
          henHouse: { ...GAME_STATE.henHouse, level: 1, animals },
        }),
      ),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    const chicken = state.henHouse.animals["chicken-0"];
    // Cured (curing is allowed while capacity-locked)...
    expect(state.farmActivity["Chicken Cured"]).toEqual(1);
    // ...but not fed (locked) and therefore not claimed: awake and idle
    expect(chicken.state).toEqual("idle");
    expect(chicken.experience).toEqual(0);
    expect(chicken.asleepAt).toEqual(0);
  });

  it("still claims a ready over-capacity animal without feeding it", () => {
    const animals: Record<string, Animal> = {};
    for (let i = 0; i < 11; i++) {
      animals[`chicken-${i}`] = makeAnimal({
        id: `chicken-${i}`,
        type: "Chicken",
        state: i === 0 ? "ready" : "idle",
        experience: i === 0 ? 120 : 0,
        reward: i === 0 ? { items: [{ name: "Egg", amount: 1 }] } : undefined,
        createdAt: i + 1, // chicken-0 is oldest -> locked at capacity 10
      });
    }

    const state = feedAllAnimals({
      createdAt: now,
      state: withGoldEgg({
        ...GAME_STATE,
        henHouse: { ...GAME_STATE.henHouse, level: 1, animals },
      }),
      action: { type: "animals.fedAll", building: "Hen House" },
    });

    const chicken = state.henHouse.animals["chicken-0"];
    expect(state.inventory.Egg?.gte(1)).toBe(true);
    expect(chicken.state).toEqual("idle");
    expect(chicken.asleepAt).toEqual(now);
    expect(chicken.awakeAt).toBeGreaterThan(chicken.createdAt);
    // Claiming must not be followed by a feed
    expect(chicken.experience).toEqual(120);
  });
});
