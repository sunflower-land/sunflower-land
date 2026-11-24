import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { TEST_FARM } from "./constants";
import { TEST_BUMPKIN } from "./bumpkinData";
import type { GameState, PlacedItem } from "../types/game";
import type { ScheduledWeatherEvent } from "../types/weather";
import { placeCollectible } from "../events/landExpansion/placeCollectible";
import { removeCollectible } from "../events/landExpansion/removeCollectible";
import { getCropYieldAmount } from "../events/landExpansion/harvest";
import { getPackYieldAmount } from "../events/landExpansion/harvestCropMachine";
import { getGreenhouseCropYieldAmount } from "../events/landExpansion/harvestGreenHouse";
import { getWeatherEvents } from "./weatherItemCover";
import { getHeavyRainsCropYield } from "./weatherHeavyRains";

const HOUR = 60 * 60 * 1000;

// The spring week of 2026-12-14 closes with a four-day Heavy Rains, and the
// spring week of 2027-02-08 with the next one.
const RAINS: ScheduledWeatherEvent = {
  name: "heavyRains",
  startAt: Date.UTC(2026, 11, 17),
  endAt: Date.UTC(2026, 11, 21),
};
const NEXT_RAINS: ScheduledWeatherEvent = {
  name: "heavyRains",
  startAt: Date.UTC(2027, 1, 11),
  endAt: Date.UTC(2027, 1, 15),
};
const MID = RAINS.startAt + 24 * HOUR;

const placed = (fields: Partial<PlacedItem> = {}): PlacedItem => ({
  id: "1",
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
  ...fields,
});

const farm = (collectibles: GameState["collectibles"] = {}): GameState => ({
  ...TEST_FARM,
  bumpkin: { ...TEST_BUMPKIN, skills: {} },
  inventory: {
    ...TEST_FARM.inventory,
    "Merino Wool Insulation": new Decimal(1),
    "Spring Guardian": new Decimal(1),
  },
  collectibles,
  buildings: {},
  trees: {},
  stones: {},
  gold: {},
  iron: {},
  crimstones: {},
  sunstones: {},
  oilReserves: {},
  crops: {},
  fruitPatches: {},
  beehives: {},
  lavaPits: {},
  flowers: { ...TEST_FARM.flowers, flowerBeds: {} },
  boostHistory: undefined,
  // The client reads the forecast the server sends.
  weather: { forecast: [RAINS, NEXT_RAINS], overlays: [] },
});

const INSULATION = (fields: Partial<PlacedItem> = {}) => ({
  "Merino Wool Insulation": [
    placed({ placedAt: RAINS.startAt - HOUR, ...fields }),
  ],
});
const GUARDIAN = (fields: Partial<PlacedItem> = {}) => ({
  "Spring Guardian": [
    placed({ id: "g", placedAt: RAINS.startAt - HOUR, ...fields }),
  ],
});

const move = (
  state: GameState,
  name: "Merino Wool Insulation" | "Spring Guardian",
  type: "placed" | "removed",
  createdAt: number,
) => {
  const id = name === "Spring Guardian" ? "g" : "1";

  return type === "placed"
    ? placeCollectible({
        state,
        action: {
          type: "collectible.placed",
          name,
          id,
          coordinates: { x: id === "g" ? 4 : 0, y: 0 },
          location: "farm",
        },
        createdAt,
      })
    : removeCollectible({
        state,
        action: { type: "collectible.removed", name, id, location: "farm" },
        createdAt,
      });
};

const change = (game: GameState, at = MID) =>
  getHeavyRainsCropYield({ game, events: getWeatherEvents(game), at });

const harvest = (
  game: GameState,
  createdAt = MID,
  crop: "Sunflower" | "Onion" | "Cauliflower" = "Sunflower",
) =>
  getCropYieldAmount({
    crop,
    game,
    createdAt,
    prngArgs: { farmId: 1, counter: 0 },
  });

describe("getHeavyRainsCropYield", () => {
  it("changes nothing outside Heavy Rains", () => {
    expect(change(farm(), RAINS.endAt + HOUR)).toEqual({
      amount: 0,
      boostsUsed: [],
    });
    expect(change(farm(), RAINS.startAt - 1).amount).toBe(0);
    expect(change(farm(), RAINS.endAt).amount).toBe(0);
  });

  it("takes 0.2 without the Merino Wool Insulation", () => {
    expect(change(farm())).toEqual({ amount: -0.2, boostsUsed: [] });
    expect(change(farm(), RAINS.startAt).amount).toBe(-0.2);
    expect(change(farm(), RAINS.endAt - 1).amount).toBe(-0.2);
  });

  it("adds 0.2 with the Merino Wool Insulation placed", () => {
    expect(change(farm(INSULATION()))).toEqual({
      amount: 0.2,
      boostsUsed: ["Merino Wool Insulation"],
    });
  });

  it("changes nothing with the spring Guardian placed (Blessed)", () => {
    expect(change(farm(GUARDIAN()))).toEqual({
      amount: 0,
      boostsUsed: ["Spring Guardian"],
    });
  });

  it("adds 0.3 with both: the item stacks with the Guardian", () => {
    expect(change(farm({ ...INSULATION(), ...GUARDIAN() }))).toEqual({
      amount: 0.3,
      boostsUsed: ["Spring Guardian", "Merino Wool Insulation"],
    });
  });

  it("ignores another season's Guardian", () => {
    const game = farm({
      "Summer Guardian": [placed({ id: "g", placedAt: RAINS.startAt - HOUR })],
    });

    expect(change(game).amount).toBe(-0.2);
  });

  it("covers from the moment the item is placed until it's lifted", () => {
    const placedMid = move(farm(), "Merino Wool Insulation", "placed", MID);
    expect(change(placedMid, MID - HOUR).amount).toBe(-0.2);
    expect(change(placedMid, MID + HOUR).amount).toBe(0.2);

    const lifted = move(
      placedMid,
      "Merino Wool Insulation",
      "removed",
      MID + 2 * HOUR,
    );
    expect(change(lifted, MID + 3 * HOUR).amount).toBe(-0.2);
  });

  it("counts the Guardian from the moment it's placed until it's lifted", () => {
    const placedMid = move(farm(), "Spring Guardian", "placed", MID);
    expect(change(placedMid, MID - HOUR).amount).toBe(-0.2);
    expect(change(placedMid, MID + HOUR).amount).toBe(0);

    const lifted = move(
      placedMid,
      "Spring Guardian",
      "removed",
      MID + 2 * HOUR,
    );
    expect(change(lifted, MID + 3 * HOUR).amount).toBe(-0.2);
  });

  it("is used up on its Heavy Rains: it doesn't cover the next one", () => {
    const at = NEXT_RAINS.startAt + HOUR;

    expect(change(farm(INSULATION()), at).amount).toBe(-0.2);
    // Used even with the Guardian out, since Heavy Rains is a positive event.
    expect(change(farm({ ...INSULATION(), ...GUARDIAN() }), at).amount).toBe(0);
  });

  describe("without the Weather flag", () => {
    const network = CONFIG.NETWORK;
    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });
    afterAll(() => {
      CONFIG.NETWORK = network;
    });

    it("changes nothing", () => {
      expect(change(farm())).toEqual({ amount: 0, boostsUsed: [] });
      expect(change(farm({ ...INSULATION(), ...GUARDIAN() })).amount).toBe(0);
    });
  });
});

describe("crop harvests during Heavy Rains", () => {
  it("leaves crops alone outside the event", () => {
    expect(harvest(farm(), RAINS.endAt + HOUR).amount).toBe(1);
  });

  it("takes 0.2 from each crop harvest without the item", () => {
    expect(harvest(farm()).amount).toBe(0.8);
  });

  it("adds 0.2 with the item and records it", () => {
    const { amount, boostsUsed } = harvest(farm(INSULATION()));

    expect(amount).toBe(1.2);
    expect(boostsUsed).toContainEqual({
      name: "Merino Wool Insulation",
      value: "+0.2",
    });
  });

  it("adds 0.3 with the item and the Guardian, and records both", () => {
    const { amount, boostsUsed } = harvest(
      farm({ ...INSULATION(), ...GUARDIAN() }),
    );

    expect(amount).toBe(1.3);
    expect(boostsUsed).toContainEqual({
      name: "Spring Guardian",
      value: "+0.3",
    });
    expect(boostsUsed).toContainEqual({
      name: "Merino Wool Insulation",
      value: "+0.3",
    });
  });

  it("lands with the flat bonuses", () => {
    // Onion 1 + Giant Onion 3 - Heavy Rains 0.2 = 3.8.
    const giantOnion = { "Giant Onion": [placed({ id: "o" })] };
    expect(harvest(farm(giantOnion), MID, "Onion").amount).toBe(3.8);
  });

  it("comes after the multipliers", () => {
    // Cauliflower 1 × Golden Cauliflower 2 - Heavy Rains 0.2 = 1.8 (not
    // (1 - 0.2) × 2 = 1.6).
    const golden = { "Golden Cauliflower": [placed({ id: "c" })] };
    expect(harvest(farm(golden), MID, "Cauliflower").amount).toBe(1.8);
  });

  it("changes each seed of a Crop Machine pack", () => {
    const { amount } = getPackYieldAmount({
      state: farm(INSULATION()),
      pack: {
        crop: "Sunflower",
        seeds: 10,
        growTimeRemaining: 0,
        totalGrowTime: 0,
      },
      createdAt: MID,
      prngArgs: { farmId: 1, initialCounter: 0 },
    });

    // The pack sums each seed's yield in floats, as for every flat bonus.
    expect(amount).toBeCloseTo(12, 10);
  });

  it("changes Greenhouse crops", () => {
    const { amount } = getGreenhouseCropYieldAmount({
      crop: "Rice",
      game: farm(),
      createdAt: MID,
      prngArgs: { farmId: 1, counter: 0 },
    });

    expect(amount).toBe(0.8);
  });

  describe("without the Weather flag", () => {
    const network = CONFIG.NETWORK;
    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });
    afterAll(() => {
      CONFIG.NETWORK = network;
    });

    it("leaves crop harvests alone", () => {
      expect(harvest(farm()).amount).toBe(1);
      expect(harvest(farm(INSULATION())).amount).toBe(1);
    });
  });
});
