import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { Animal, GameState } from "features/game/types/game";
import { getCoveredAnimalTypes, getFeedAllTargets } from "./feedAllAnimals";

const now = Date.now();

const makeAnimal = (
  overrides: Partial<Animal> & { id: string; type: Animal["type"] },
): Animal => ({
  state: "idle",
  coordinates: { x: 0, y: 0 },
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
