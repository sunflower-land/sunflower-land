import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { INITIAL_FARM } from "features/game/lib/constants";
import { ANIMAL_LEVELS, type AnimalLevel } from "features/game/types/animals";
import type { Animal, GameState } from "features/game/types/game";
import { tradeInPig, TRADE_IN_PIG_ERRORS } from "./tradeInPig";

const pig = (
  id: string,
  level: number,
  overrides: Partial<Animal> = {},
): Animal => ({
  id,
  type: "Pig",
  state: "idle",
  createdAt: 0,
  experience: ANIMAL_LEVELS.Pig[level as AnimalLevel],
  asleepAt: 0,
  awakeAt: 0,
  lovedAt: 0,
  item: "Petting Hand",
  ...overrides,
});

const farm = (
  animals: Record<string, Animal> = { "1": pig("1", 15), "2": pig("2", 3) },
  overrides: Partial<GameState> = {},
): GameState => ({
  ...INITIAL_FARM,
  buildings: {
    ...INITIAL_FARM.buildings,
    Pigpen: [
      { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
    ],
  },
  pigpen: { level: 1, animals },
  ...overrides,
});

const now = Date.now();

const tradeIn = (state: GameState, id = "1") =>
  tradeInPig({ state, action: { type: "pig.tradedIn", id }, createdAt: now });

describe("tradeInPig", () => {
  it("requires a placed Pigpen", () => {
    expect(() => tradeIn({ ...farm(), buildings: {} })).toThrow(
      "Building does not exist",
    );
  });

  it("requires the Pig to exist", () => {
    expect(() => tradeIn(farm(), "99")).toThrow(TRADE_IN_PIG_ERRORS.NOT_FOUND);
  });

  it("rejects a sleeping Pig", () => {
    expect(() =>
      tradeIn(
        farm({ "1": pig("1", 15, { asleepAt: now, awakeAt: now + 60_000 }) }),
      ),
    ).toThrow(TRADE_IN_PIG_ERRORS.ASLEEP);
  });

  it("rejects a Pig that would pay no Bristles", () => {
    expect(() => tradeIn(farm({ "1": pig("1", 2) }))).toThrow(
      TRADE_IN_PIG_ERRORS.NO_BRISTLES,
    );
    // A ready level-3 Pig counts as level 2.
    expect(() =>
      tradeIn(farm({ "1": pig("1", 3, { state: "ready" }) })),
    ).toThrow(TRADE_IN_PIG_ERRORS.NO_BRISTLES);
  });

  it("removes the Pig and pays its Bristles, leaving the others alone", () => {
    const state = tradeIn(farm());

    expect(state.pigpen.animals["1"]).toBeUndefined();
    expect(state.pigpen.animals["2"]).toEqual(pig("2", 3));
    expect(state.inventory["Pig Bristles"]).toEqual(new Decimal(12));
  });

  it("adds to Bristles already held", () => {
    const state = tradeIn(
      farm(undefined, { inventory: { "Pig Bristles": new Decimal(3) } }),
      "2",
    );

    expect(state.inventory["Pig Bristles"]).toEqual(new Decimal(4));
  });

  it("frees a Pigpen slot", () => {
    const full = farm({
      "1": pig("1", 15),
      "2": pig("2", 3),
      "3": pig("3", 3),
    });

    expect(Object.keys(tradeIn(full).pigpen.animals)).toHaveLength(2);
  });

  it("pays a ready Pig for the level below and a sick Pig 75%", () => {
    expect(
      tradeIn(farm({ "1": pig("1", 6, { state: "ready" }) })).inventory[
        "Pig Bristles"
      ],
    ).toEqual(new Decimal(2));

    expect(
      tradeIn(farm({ "1": pig("1", 5, { state: "sick" }) })).inventory[
        "Pig Bristles"
      ],
    ).toEqual(new Decimal(1.5));
  });

  it("applies Bristle Payout and records the boosts used", () => {
    const state = tradeIn(
      farm(undefined, {
        bumpkin: { ...INITIAL_FARM.bumpkin, skills: { "Bristle Payout": 2 } },
      }),
    );

    expect(state.inventory["Pig Bristles"]).toEqual(new Decimal(14.4));
    expect(state.boostsUsedAt?.["Bristle Payout"]).toEqual(now);
  });

  it("tracks the Bristles collected", () => {
    const state = tradeIn(farm());

    expect(state.farmActivity["Pig Bristles Collected"]).toEqual(1);
  });

  describe("off testnet", () => {
    const network = CONFIG.NETWORK;

    beforeEach(() => {
      CONFIG.NETWORK = "mainnet";
    });

    afterEach(() => {
      CONFIG.NETWORK = network;
    });

    it("is not available", () => {
      expect(() => tradeIn(farm())).toThrow(
        TRADE_IN_PIG_ERRORS.NO_FEATURE_ACCESS,
      );
    });
  });
});
