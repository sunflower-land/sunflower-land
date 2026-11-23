import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { TEST_FARM } from "./constants";
import type { GameState, PlacedItem } from "../types/game";
import type { ScheduledWeatherEvent } from "../types/weather";
import { placeCollectible } from "../events/landExpansion/placeCollectible";
import { removeCollectible } from "../events/landExpansion/removeCollectible";
import { getWeatherEvents } from "./weatherItemCover";
import { getWeatherHoneyBonus } from "./weatherHoney";
import { updateBeehives } from "./updateBeehives";

const HOUR = 60 * 60 * 1000;

// The summer week of 2026-12-21 opens with a three-day Bee Migration.
const BEES: ScheduledWeatherEvent = {
  name: "beeMigration",
  startAt: Date.UTC(2026, 11, 21),
  endAt: Date.UTC(2026, 11, 24),
};
const MID = BEES.startAt + 24 * HOUR;

const placed = (fields: Partial<PlacedItem> = {}): PlacedItem => ({
  id: "1",
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
  ...fields,
});

const farm = (fields: Partial<GameState> = {}): GameState => ({
  ...TEST_FARM,
  inventory: {
    ...TEST_FARM.inventory,
    "Wildflower Lure": new Decimal(1),
    "Summer Guardian": new Decimal(1),
  },
  collectibles: {},
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
  weather: { forecast: [BEES], overlays: [] },
  ...fields,
});

const LURE = (fields: Partial<PlacedItem> = {}) => ({
  "Wildflower Lure": [placed({ placedAt: BEES.startAt - HOUR, ...fields })],
});
const GUARDIAN = (fields: Partial<PlacedItem> = {}) => ({
  "Summer Guardian": [
    placed({ id: "g", placedAt: BEES.startAt - HOUR, ...fields }),
  ],
});

const bonus = (game: GameState, at = MID) =>
  getWeatherHoneyBonus({ game, events: getWeatherEvents(game), at });

const move = (
  state: GameState,
  name: "Wildflower Lure" | "Summer Guardian",
  type: "placed" | "removed",
  createdAt: number,
) => {
  const id = name === "Summer Guardian" ? "g" : "1";

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

describe("getWeatherHoneyBonus", () => {
  it("adds nothing outside Bee Migration", () => {
    expect(
      bonus(farm({ collectibles: LURE() }), BEES.endAt + HOUR).amount,
    ).toBe(0);
  });

  it("adds 0.2 during Bee Migration", () => {
    expect(bonus(farm())).toEqual({ amount: 0.2, boostsUsed: [] });
  });

  it("adds 0.3 with the summer Guardian out", () => {
    expect(bonus(farm({ collectibles: GUARDIAN() }))).toEqual({
      amount: 0.3,
      boostsUsed: ["Summer Guardian"],
    });
  });

  it("adds the Lure's 1.25 on top: 1.45", () => {
    expect(bonus(farm({ collectibles: LURE() }))).toEqual({
      amount: 1.45,
      boostsUsed: ["Wildflower Lure"],
    });
  });

  it("adds 0.3 + 1.875 = 2.175 with both", () => {
    expect(bonus(farm({ collectibles: { ...LURE(), ...GUARDIAN() } }))).toEqual(
      {
        amount: 2.175,
        boostsUsed: ["Summer Guardian", "Wildflower Lure"],
      },
    );
  });

  it("ignores another season's Guardian", () => {
    const game = farm({
      collectibles: {
        "Spring Guardian": [placed({ placedAt: BEES.startAt - HOUR })],
      },
    });

    expect(bonus(game).amount).toBe(0.2);
  });

  it("counts the Lure from the moment it's placed until it's lifted", () => {
    const placedMid = move(farm(), "Wildflower Lure", "placed", MID);
    expect(bonus(placedMid, MID - HOUR).amount).toBe(0.2);
    expect(bonus(placedMid, MID + HOUR).amount).toBe(1.45);

    const lifted = move(
      placedMid,
      "Wildflower Lure",
      "removed",
      MID + 2 * HOUR,
    );
    expect(bonus(lifted, MID + HOUR).amount).toBe(1.45);
    expect(bonus(lifted, MID + 3 * HOUR).amount).toBe(0.2);
  });

  it("counts the Guardian only while it is placed", () => {
    const lifted = move(
      farm({ collectibles: GUARDIAN() }),
      "Summer Guardian",
      "removed",
      MID,
    );

    expect(bonus(lifted, MID - HOUR).amount).toBe(0.3);
    expect(bonus(lifted, MID + HOUR).amount).toBe(0.2);
  });

  describe("without the Weather flag", () => {
    const network = CONFIG.NETWORK;
    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });
    afterAll(() => {
      CONFIG.NETWORK = network;
    });

    it("adds nothing", () => {
      expect(bonus(farm({ collectibles: LURE() })).amount).toBe(0);
    });
  });
});

describe("honey during Bee Migration", () => {
  // A Sunpetal flower (1 day) and an empty hive (a full hive is 24h of honey
  // at rate 1), attached 2h before Bee Migration starts.
  const attachedAt = BEES.startAt - 2 * HOUR;
  const hive = (game: GameState) =>
    updateBeehives({
      game: {
        ...game,
        beehives: {
          h: {
            swarm: false,
            x: 3,
            y: 3,
            honey: { updatedAt: attachedAt, produced: 0 },
            flowers: [],
          },
        },
        flowers: {
          ...game.flowers,
          flowerBeds: {
            f: {
              createdAt: attachedAt,
              x: 0,
              y: 3,
              flower: { name: "Red Pansy", plantedAt: attachedAt },
            },
          },
        },
      },
      createdAt: attachedAt,
    }).h;

  it("splits the hive's flower time where Bee Migration starts", () => {
    const { flowers } = hive(farm());

    // 2h at rate 1, then the 22h of honey left take ⌈22h / 1.2⌉ at 1.2.
    expect(flowers).toEqual([
      { id: "f", attachedAt, attachedUntil: BEES.startAt, rate: 1 },
      {
        id: "f",
        attachedAt: BEES.startAt,
        attachedUntil: BEES.startAt + Math.ceil((22 * HOUR) / 1.2),
        rate: 1.2,
      },
    ]);
  });

  it("credits honey at 1.2 once Bee Migration starts", () => {
    const game = farm();
    const attached = { ...game, beehives: { h: hive(game) } };
    // The flower bed is needed to credit the honey.
    const withFlower = {
      ...attached,
      flowers: {
        ...attached.flowers,
        flowerBeds: {
          f: {
            createdAt: attachedAt,
            x: 0,
            y: 3,
            flower: { name: "Red Pansy" as const, plantedAt: attachedAt },
          },
        },
      },
    };

    const later = updateBeehives({
      game: withFlower,
      createdAt: BEES.startAt + HOUR,
    }).h;

    // 2h at 1 + 1h at 1.2.
    expect(later.honey.produced).toBeCloseTo(2 * HOUR + 1.2 * HOUR, 0);
  });

  it("re-splits at the Lure's rate when the Lure is placed before the event", () => {
    const game = farm();
    const withHive: GameState = {
      ...game,
      beehives: { h: hive(game) },
      flowers: {
        ...game.flowers,
        flowerBeds: {
          f: {
            createdAt: attachedAt,
            x: 0,
            y: 3,
            flower: { name: "Red Pansy", plantedAt: attachedAt },
          },
        },
      },
    };

    const state = move(
      withHive,
      "Wildflower Lure",
      "placed",
      attachedAt + HOUR,
    );
    const after = state.beehives.h.flowers.filter(
      ({ attachedAt }) => attachedAt >= BEES.startAt,
    );

    expect(after[0]?.rate).toBe(2.45);
  });
});
