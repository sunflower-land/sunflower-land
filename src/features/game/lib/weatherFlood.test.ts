import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { TEST_FARM } from "./constants";
import type { GameState, PlacedItem, Rock, Tree } from "../types/game";
import type { ScheduledWeatherEvent } from "../types/weather";
import { placeCollectible } from "../events/landExpansion/placeCollectible";
import { removeCollectible } from "../events/landExpansion/removeCollectible";
import { getTreeReadyAt } from "../events/landExpansion/chop";
import { getCrimstoneResetAt, getMineReadyAt } from "./resourceNodes";
import { mineCrimstone } from "../events/landExpansion/mineCrimstone";
import { revealLand } from "../events/landExpansion/revealLand";
import { getOilReserveReadyAt } from "../events/landExpansion/drillOilReserve";
import type { RockName } from "../types/resources";
import {
  getCropPlotBoostWindows,
  getFlowerBoostWindows,
  getFruitBoostWindows,
  getMineBoostWindows,
  getOilBoostWindows,
  getTreeBoostWindows,
  getWeatherFloodWindows,
  getWeatherSunShowerWindows,
  computeReadyAt,
  pauseWindowedTimer,
} from "./boostWindows";
import { updateBeehives } from "./updateBeehives";
import { placeTree } from "../events/landExpansion/placeTree";
import { getWeatherEvents } from "./weatherItemCover";
import { getWeatherHoneyBoundaries } from "./weatherHoney";

const HOUR = 60 * 60 * 1000;

// The spring week of 2026-12-14 opens with a three-day Flood.
const FLOOD: ScheduledWeatherEvent = {
  name: "flood",
  startAt: Date.UTC(2026, 11, 14),
  endAt: Date.UTC(2026, 11, 17),
};
const MID = FLOOD.startAt + 24 * HOUR;
const WHOLE = { from: FLOOD.startAt, to: FLOOD.endAt, speed: 0.5 };

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
    Sandbag: new Decimal(1),
    "Spring Guardian": new Decimal(1),
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
  weather: { forecast: [FLOOD], overlays: [] },
  ...fields,
});

const SANDBAG = (fields: Partial<PlacedItem> = {}) => ({
  Sandbag: [placed({ placedAt: FLOOD.startAt - HOUR, ...fields })],
});
const GUARDIAN = (fields: Partial<PlacedItem> = {}) => ({
  "Spring Guardian": [
    placed({ id: "g", placedAt: FLOOD.startAt - HOUR, ...fields }),
  ],
});

const move = (
  state: GameState,
  name: "Sandbag" | "Spring Guardian",
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

/** The Flood windows that fall in FLOOD. */
const during = (game: GameState) =>
  getWeatherFloodWindows(game).filter(
    (window) => window.from < FLOOD.endAt && FLOOD.startAt < window.to,
  );

describe("getWeatherFloodWindows", () => {
  it("slows everything to 0.5× for the whole Flood", () => {
    expect(during(farm())).toEqual([WHOLE]);
  });

  it("doesn't slow anything with a Sandbag out", () => {
    expect(during(farm({ collectibles: SANDBAG() }))).toEqual([]);
  });

  it("doesn't slow anything with the spring Guardian out when it starts", () => {
    expect(during(farm({ collectibles: GUARDIAN() }))).toEqual([]);
  });

  it("still slows with a Guardian placed after the Flood started", () => {
    const game = farm({ collectibles: GUARDIAN({ placedAt: MID }) });

    expect(during(game)).toEqual([WHOLE]);
  });

  it("ignores another season's Guardian", () => {
    const game = farm({
      collectibles: {
        "Winter Guardian": [placed({ placedAt: FLOOD.startAt - HOUR })],
      },
    });

    expect(during(game)).toEqual([WHOLE]);
  });

  it("stops slowing from the moment the Sandbag is placed", () => {
    const state = move(farm(), "Sandbag", "placed", MID);

    expect(during(state)).toEqual([
      { from: FLOOD.startAt, to: MID, speed: 0.5 },
    ]);
  });

  it("slows again from the moment the Sandbag is lifted", () => {
    const state = move(
      farm({ collectibles: SANDBAG() }),
      "Sandbag",
      "removed",
      MID,
    );

    expect(during(state)).toEqual([{ from: MID, to: FLOOD.endAt, speed: 0.5 }]);
  });

  it("stops slowing again when the Sandbag is placed back during the same Flood", () => {
    const lifted = move(
      farm({ collectibles: SANDBAG() }),
      "Sandbag",
      "removed",
      MID,
    );
    const state = move(lifted, "Sandbag", "placed", MID + HOUR);

    expect(during(state)).toEqual([{ from: MID, to: MID + HOUR, speed: 0.5 }]);
  });

  describe("without the Weather flag", () => {
    const network = CONFIG.NETWORK;
    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });
    afterAll(() => {
      CONFIG.NETWORK = network;
    });

    it("has no Flood", () => {
      expect(getWeatherFloodWindows(farm())).toEqual([]);
    });
  });
});

describe("Flood on resource nodes", () => {
  it.each([
    ["crop plots", getCropPlotBoostWindows],
    ["trees", getTreeBoostWindows],
    ["fruit patches", getFruitBoostWindows],
    ["flower beds", getFlowerBoostWindows],
    ["oil reserves", getOilBoostWindows],
  ])("slows %s", (_, windows) => {
    expect(windows(farm())).toContainEqual(WHOLE);
  });

  it.each<RockName>([
    "Stone Rock",
    "Fused Stone Rock",
    "Reinforced Stone Rock",
    "Iron Rock",
    "Refined Iron Rock",
    "Tempered Iron Rock",
    "Gold Rock",
    "Pure Gold Rock",
    "Prime Gold Rock",
    "Crimstone Rock",
    "Sunstone Rock",
  ])("slows a %s", (rock) => {
    expect(getMineBoostWindows(farm(), rock)).toContainEqual(WHOLE);
  });

  it("leaves Ascension Crystals alone", () => {
    expect(getMineBoostWindows(farm(), "Ascension Crystal")).toEqual([]);
  });

  it("takes a tree chopped at the start twice as long to grow back", () => {
    const tree: Tree = {
      createdAt: 0,
      x: 0,
      y: 0,
      wood: { choppedAt: FLOOD.startAt, baseDurationMs: 2 * HOUR },
    };

    // 2h of growth at 0.5× takes 4h; with the Sandbag, 2h.
    expect(getTreeReadyAt(tree, farm())).toBe(FLOOD.startAt + 4 * HOUR);
    expect(getTreeReadyAt(tree, farm({ collectibles: SANDBAG() }))).toBe(
      FLOOD.startAt + 2 * HOUR,
    );
  });

  it("takes a stone mined an hour before the end 1h + 2h to recover", () => {
    const rock: Rock = {
      createdAt: 0,
      x: 0,
      y: 0,
      stone: { minedAt: FLOOD.endAt - HOUR, baseDurationMs: 3 * HOUR },
    };

    // 1h at 0.5× is 0.5h of work, then the other 2.5h at 1×.
    expect(getMineReadyAt(rock, "Stone Rock", farm())).toBe(
      FLOOD.endAt + 2.5 * HOUR,
    );
  });

  it("stacks with other speed boosts", () => {
    const game = farm({
      collectibles: {
        "Super Totem": [
          placed({ createdAt: FLOOD.startAt, readyAt: FLOOD.startAt }),
        ],
      },
    });
    const tree: Tree = {
      createdAt: 0,
      x: 0,
      y: 0,
      wood: { choppedAt: FLOOD.startAt, baseDurationMs: 2 * HOUR },
    };

    // 2× × 0.5× = 1×.
    expect(getTreeReadyAt(tree, game)).toBe(FLOOD.startAt + 2 * HOUR);
  });
});

describe("honey during a Flood", () => {
  // A Red Pansy (1 day) and an empty hive (a full hive is 24h of honey at
  // rate 1), attached 2h before the Flood starts.
  const attachedAt = FLOOD.startAt - 2 * HOUR;
  const withHive = (game: GameState): GameState => ({
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
  });
  const hive = (game: GameState) =>
    updateBeehives({ game: withHive(game), createdAt: attachedAt }).h;

  it("halves the honey rate from the start of the Flood", () => {
    const { flowers } = hive(farm());

    // 2h at rate 1, then the hive's other 22h of honey take 44h at 0.5. The
    // flower's last 22h of growth take 44h at 0.5× too.
    expect(flowers).toEqual([
      { id: "f", attachedAt, attachedUntil: FLOOD.startAt, rate: 1 },
      {
        id: "f",
        attachedAt: FLOOD.startAt,
        attachedUntil: FLOOD.startAt + 44 * HOUR,
        rate: 0.5,
      },
    ]);
  });

  it("halves the whole rate, permanent boosts included", () => {
    const game = farm({
      collectibles: {
        "Queen Bee": [placed({ id: "q", coordinates: { x: 6, y: 6 } })],
      },
    });

    // Queen Bee makes it 2; the Flood halves that to 1.
    expect(hive(game).flowers.map(({ rate }) => rate)).toEqual([2, 1]);
  });

  it("leaves the rate alone with a Sandbag out", () => {
    const { flowers } = hive(farm({ collectibles: SANDBAG() }));

    expect(flowers.map(({ rate }) => rate)).toEqual([1]);
  });

  it("leaves the rate alone with the spring Guardian out when it starts", () => {
    const { flowers } = hive(farm({ collectibles: GUARDIAN() }));

    // Cut where the Guardian was placed, at the same rate.
    expect([...new Set(flowers.map(({ rate }) => rate))]).toEqual([1]);
  });

  it("restores the rate from the moment a Sandbag is placed mid-Flood", () => {
    const game = farm();
    const attached = { ...withHive(game), beehives: { h: hive(game) } };

    const placedAt = FLOOD.startAt + 10 * HOUR;
    const state = move(attached, "Sandbag", "placed", placedAt);

    // Banked: 2h at 1 + 10h at 0.5 = 7h of honey. The hive's other 17h, and
    // the flower's last 17h of growth (it grew 2h + 10h at 0.5×), run at 1.
    expect(state.beehives.h.honey.produced).toBeCloseTo(7 * HOUR, 0);
    expect(state.beehives.h.flowers.at(-1)).toEqual({
      id: "f",
      attachedAt: placedAt,
      attachedUntil: placedAt + 17 * HOUR,
      rate: 1,
    });
  });

  describe("without the Weather flag", () => {
    const network = CONFIG.NETWORK;
    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });
    afterAll(() => {
      CONFIG.NETWORK = network;
    });

    it("keeps the honey rate", () => {
      expect(hive(farm()).flowers.map(({ rate }) => rate)).toEqual([1]);
    });
  });
});

describe("the Crimstone streak during a Flood", () => {
  // A Crimstone (24h recovery) mined at the start of the Flood, three mines
  // into its streak. 24h of recovery at 0.5× take 48h.
  const minedAt = FLOOD.startAt;
  const crimstone = (game: GameState): GameState => ({
    ...game,
    inventory: { ...game.inventory, "Gold Pickaxe": new Decimal(5) },
    crimstones: {
      0: {
        createdAt: 0,
        x: 0,
        y: 0,
        minesLeft: 3,
        stone: { minedAt, baseDurationMs: 24 * HOUR },
      },
    },
  });
  const mineAt = (createdAt: number) =>
    mineCrimstone({
      state: crimstone(farm()),
      action: { type: "crimstoneRock.mined", index: 0 },
      createdAt,
      farmId: 1,
    }).crimstones[0].minesLeft;

  it("resets 24h after the rock recovers, not 24h after its base recovery", () => {
    expect(getCrimstoneResetAt({ minedAt, readyAt: minedAt + 48 * HOUR })).toBe(
      minedAt + 72 * HOUR,
    );
  });

  it("never resets sooner than 24h after its base recovery", () => {
    // Sped up to 12h, it still has until 24h + 24h.
    expect(getCrimstoneResetAt({ minedAt, readyAt: minedAt + 12 * HOUR })).toBe(
      minedAt + 48 * HOUR,
    );
  });

  it("keeps the streak for a mine an hour after the flooded rock recovers", () => {
    // Without the Flood, 49h after mining would be past the 48h reset.
    expect(mineAt(minedAt + 49 * HOUR)).toBe(2);
  });

  it("still resets the streak 24h after the flooded rock recovers", () => {
    expect(mineAt(minedAt + 72 * HOUR + 1)).toBe(4);
  });
});

describe("land expansion during a Flood", () => {
  // 3h into the Flood, the new land refills every tree, rock and oil reserve.
  const createdAt = FLOOD.startAt + 3 * HOUR;
  const node = { createdAt: 0, x: 0, y: 0 };
  const reveal = () =>
    revealLand({
      action: { type: "land.revealed" },
      state: {
        ...farm(),
        inventory: { ...farm().inventory, "Basic Land": new Decimal(3) },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
        trees: {
          t: { ...node, wood: { choppedAt: createdAt - HOUR } },
          lifted: {
            createdAt: 0,
            removedAt: createdAt - HOUR,
            wood: { choppedAt: createdAt - 2 * HOUR },
          },
        },
        stones: { s: { ...node, stone: { minedAt: createdAt - HOUR } } },
        crimstones: {
          c: { ...node, minesLeft: 3, stone: { minedAt: createdAt - HOUR } },
        },
        oilReserves: {
          o: { ...node, oil: { drilledAt: createdAt - HOUR }, drilled: 1 },
        },
      },
      createdAt,
    });

  it("refills trees, rocks and oil even though the Flood slows them", () => {
    const state = reveal();

    expect(getTreeReadyAt(state.trees.t, state)).toBeLessThanOrEqual(createdAt);
    expect(
      getMineReadyAt(state.stones.s, "Stone Rock", state),
    ).toBeLessThanOrEqual(createdAt);
    expect(
      getMineReadyAt(state.crimstones.c, "Crimstone Rock", state),
    ).toBeLessThanOrEqual(createdAt);
    expect(
      getOilReserveReadyAt(state.oilReserves.o, state),
    ).toBeLessThanOrEqual(createdAt);
  });

  it("keeps the Crimstone streak", () => {
    expect(reveal().crimstones.c.minesLeft).toBe(3);
  });

  it("refills a lifted tree for when it's placed back", () => {
    const state = reveal();
    const { wood } = state.trees.lifted;
    const placedAt = createdAt + HOUR;

    // What placing it back does (see placeTree).
    const timer = { ...wood };
    const startedAt = pauseWindowedTimer({
      timer,
      startedAt: wood.choppedAt,
      removedAt: createdAt - HOUR,
      createdAt: placedAt,
      rawBaseMs: 2 * HOUR,
      windows: getTreeBoostWindows(state),
    });

    expect(
      computeReadyAt({
        startedAt,
        baseDurationMs: timer.baseDurationMs ?? 2 * HOUR,
        windows: getTreeBoostWindows(state),
      }),
    ).toBeLessThanOrEqual(placedAt);
  });
});

describe("weather a week or more before the action", () => {
  // The client's forecast always reaches a week back, so both sides read
  // weather from 7 days before an action that banks old work.
  const DAY = 24 * HOUR;

  it("leaves a Flood that ended over a week ago out of the windows", () => {
    expect(during({ ...farm() }).length).toBe(1);
    expect(
      getWeatherFloodWindows(farm(), FLOOD.endAt + 8 * DAY).filter(
        (window) => window.from < FLOOD.endAt && FLOOD.startAt < window.to,
      ),
    ).toEqual([]);
  });

  it("keeps the part of a Flood less than a week ago", () => {
    expect(
      getWeatherFloodWindows(farm(), FLOOD.startAt + 8 * DAY),
    ).toContainEqual({
      from: FLOOD.startAt + DAY,
      to: FLOOD.endAt,
      speed: 0.5,
    });
  });

  it("does the same for a Sun Shower", () => {
    // The winter week of 2026-12-07 opens with a four-day Sun Shower.
    const SUN = {
      startAt: Date.UTC(2026, 11, 7),
      endAt: Date.UTC(2026, 11, 11),
    };
    const inSun = (now: number) =>
      getWeatherSunShowerWindows(
        farm({
          weather: { forecast: [{ name: "sunshower", ...SUN }], overlays: [] },
        }),
        now,
      ).filter((window) => window.from < SUN.endAt && SUN.startAt < window.to);

    expect(inSun(SUN.endAt + 8 * DAY)).toEqual([]);
    expect(inSun(SUN.startAt + 8 * DAY)).toEqual([
      { from: SUN.startAt + DAY, to: SUN.endAt, speed: 1.3 },
    ]);
  });

  it("still keeps an old calendar Sun Shower out where a weather one ran", () => {
    // The winter week of 2026-12-07 opens with a four-day Sun Shower. A
    // calendar Sun Shower record (2×) from before the flag overlaps its first
    // day.
    const SUN = {
      startAt: Date.UTC(2026, 11, 7),
      endAt: Date.UTC(2026, 11, 11),
    };
    const game: GameState = {
      ...farm({
        weather: { forecast: [{ name: "sunshower", ...SUN }], overlays: [] },
        boostHistory: {
          Sunshower: [
            { from: SUN.startAt - 10 * HOUR, to: SUN.startAt + 24 * HOUR },
          ],
        },
      }),
    };

    // Read from over a week later, the weather Sun Shower is cut off, but the
    // calendar record still only counts before it started.
    const calendar = getCropPlotBoostWindows(game, SUN.endAt + 8 * DAY).filter(
      (window) => window.speed === 2,
    );
    expect(calendar).toEqual([
      { from: SUN.startAt - 10 * HOUR, to: SUN.startAt, speed: 2 },
    ]);
  });

  describe("placing back a tree lifted during the Flood", () => {
    // A tree (2h) chopped as the Flood starts and lifted an hour in: half an
    // hour of its work done at 0.5×.
    const placeBack = (placedAt: number) => {
      const state = placeTree({
        state: {
          ...farm(),
          inventory: { ...farm().inventory, Tree: new Decimal(1) },
          trees: {
            t: {
              createdAt: 0,
              removedAt: FLOOD.startAt + HOUR,
              wood: { choppedAt: FLOOD.startAt, baseDurationMs: 2 * HOUR },
            },
          },
        },
        action: {
          type: "tree.placed",
          name: "Tree",
          id: "t",
          coordinates: { x: 0, y: 0 },
        },
        createdAt: placedAt,
      });

      return getTreeReadyAt(state.trees.t, state) - placedAt;
    };

    it("banks the Flood when placed back within a week", () => {
      // 0.5h banked, so 1.5h of work is left.
      expect(placeBack(FLOOD.endAt + DAY)).toBe(1.5 * HOUR);
    });

    it("banks the lifted hour at 1× once the Flood is over a week old", () => {
      // The client's forecast no longer has this Flood: 1h banked, 1h left.
      expect(placeBack(FLOOD.endAt + 10 * DAY)).toBe(HOUR);
    });
  });

  it("only looks a week ahead for honey rate changes", () => {
    const game = farm();
    const boundaries = (from: number) =>
      getWeatherHoneyBoundaries({ game, events: getWeatherEvents(game), from });

    expect(boundaries(FLOOD.startAt - 6 * DAY)).toContain(FLOOD.startAt);
    expect(boundaries(FLOOD.startAt - 8 * DAY)).not.toContain(FLOOD.startAt);
  });
});
