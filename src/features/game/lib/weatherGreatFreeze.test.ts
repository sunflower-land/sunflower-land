import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { TEST_FARM } from "./constants";
import type { CropPlot, GameState, PlacedItem } from "../types/game";
import type { ScheduledWeatherEvent } from "../types/weather";
import { placeCollectible } from "../events/landExpansion/placeCollectible";
import { removeCollectible } from "../events/landExpansion/removeCollectible";
import { plant } from "../events/landExpansion/plant";
import { bulkPlant } from "../events/landExpansion/bulkPlant";
import { harvest } from "../events/landExpansion/harvest";
import {
  bulkHarvest,
  getCropsToHarvest,
} from "../events/landExpansion/bulkHarvest";
import { removePlot } from "../events/landExpansion/removePlot";
import { placePlot } from "../events/landExpansion/placePlot";
import { getGreatFreezeLock, isPlotFrozen } from "./weatherGreatFreeze";

const HOUR = 60 * 60 * 1000;

// The winter week of 2026-12-07 closes with a three-day Great Freeze.
const FREEZE: ScheduledWeatherEvent = {
  name: "greatFreeze",
  startAt: Date.UTC(2026, 11, 11),
  endAt: Date.UTC(2026, 11, 14),
};
const MID = FREEZE.startAt + 24 * HOUR;

const plot = (x: number, fields: Partial<CropPlot> = {}): CropPlot => ({
  createdAt: 0,
  x,
  y: -3,
  ...fields,
});

// Ten plots. The server picked "1", "2" and "3" when the Great Freeze started.
const PLOTS: Record<string, CropPlot> = Object.fromEntries(
  Array.from({ length: 10 }, (_, i) => [`${i + 1}`, plot(i)]),
);
const LOCKED = ["1", "2", "3"];

const placed = (fields: Partial<PlacedItem> = {}): PlacedItem => ({
  id: "1",
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
  ...fields,
});

const farm = (fields: Partial<GameState> = {}): GameState => ({
  ...TEST_FARM,
  season: { season: "winter", startedAt: 0 },
  inventory: {
    ...TEST_FARM.inventory,
    "Potato Seed": new Decimal(10),
    "Crop Plot": new Decimal(10),
    "Thaw Stone": new Decimal(1),
    "Winter Guardian": new Decimal(1),
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
  fruitPatches: {},
  beehives: {},
  lavaPits: {},
  flowers: { ...TEST_FARM.flowers, flowerBeds: {} },
  crops: PLOTS,
  boostHistory: undefined,
  // The client reads the forecast and the pick the server sends.
  weather: {
    forecast: [FREEZE],
    overlays: [],
    greatFreeze: { startAt: FREEZE.startAt, plotIds: LOCKED },
  },
  ...fields,
});

const THAW_STONE = (fields: Partial<PlacedItem> = {}) => ({
  "Thaw Stone": [placed({ placedAt: FREEZE.startAt - HOUR, ...fields })],
});
const GUARDIAN = (fields: Partial<PlacedItem> = {}) => ({
  "Winter Guardian": [
    placed({
      id: "g",
      coordinates: { x: 4, y: 0 },
      placedAt: FREEZE.startAt - HOUR,
      ...fields,
    }),
  ],
});

const move = (
  state: GameState,
  type: "placed" | "removed",
  createdAt: number,
) =>
  type === "placed"
    ? placeCollectible({
        state,
        action: {
          type: "collectible.placed",
          name: "Thaw Stone",
          id: "1",
          coordinates: { x: 0, y: 0 },
          location: "farm",
        },
        createdAt,
      })
    : removeCollectible({
        state,
        action: {
          type: "collectible.removed",
          name: "Thaw Stone",
          id: "1",
          location: "farm",
        },
        createdAt,
      });

const plantOn = (state: GameState, index: string, createdAt: number) =>
  plant({
    state,
    action: {
      type: "seed.planted",
      item: "Potato Seed",
      index,
      cropId: "c",
    },
    createdAt,
  });

const harvestOn = (state: GameState, index: string, createdAt: number) =>
  harvest({
    state,
    action: { type: "crop.harvested", index },
    createdAt,
  });

/** Every plot with a Potato planted at 0, ready long before the freeze. */
const grown = () =>
  Object.fromEntries(
    Object.entries(PLOTS).map(([id, p]) => [
      id,
      { ...p, crop: { name: "Potato" as const, plantedAt: 0, amount: 1 } },
    ]),
  );

const frozen = (game: GameState, now: number) =>
  Object.keys(game.crops).filter((id) => isPlotFrozen({ game, id, now }));

describe("Great Freeze", () => {
  it("locks the plots the server picked for the whole Great Freeze", () => {
    expect(frozen(farm(), FREEZE.startAt)).toEqual(LOCKED);
    expect(frozen(farm(), FREEZE.endAt - 1)).toEqual(LOCKED);
    expect(getGreatFreezeLock({ game: farm(), now: MID })).toEqual({
      event: FREEZE,
      plotIds: LOCKED,
    });
  });

  it("locks nothing before it starts or once it ends", () => {
    expect(frozen(farm(), FREEZE.startAt - 1)).toEqual([]);
    expect(frozen(farm(), FREEZE.endAt)).toEqual([]);
  });

  it("ignores a pick stored for another Great Freeze", () => {
    const game = farm({
      weather: {
        forecast: [FREEZE],
        overlays: [],
        greatFreeze: {
          startAt: FREEZE.startAt - 28 * 24 * HOUR,
          plotIds: LOCKED,
        },
      },
    });

    expect(frozen(game, MID)).toEqual([]);
  });

  it("locks nothing without a stored pick", () => {
    const game = farm({ weather: { forecast: [FREEZE], overlays: [] } });

    expect(frozen(game, MID)).toEqual([]);
  });

  it("never locks a plot placed during the Great Freeze", () => {
    const game = farm({
      crops: { ...PLOTS, "11": plot(10, { createdAt: MID }) },
    });

    expect(isPlotFrozen({ game, id: "11", now: MID + HOUR })).toBe(false);
  });

  describe("planting", () => {
    it("can't plant on a locked plot", () => {
      expect(() => plantOn(farm(), "1", MID)).toThrow(
        "Plot is affected by greatFreeze",
      );
    });

    it("plants on a plot that isn't locked", () => {
      const game = plantOn(farm(), "4", MID);

      expect(game.crops["4"].crop?.name).toBe("Potato");
    });

    it("plants on a locked plot once the Great Freeze ends", () => {
      const game = plantOn(farm(), "1", FREEZE.endAt);

      expect(game.crops["1"].crop?.name).toBe("Potato");
    });

    it("plants every plot but the locked ones in bulk", () => {
      const game = bulkPlant({
        state: farm(),
        action: { type: "seeds.bulkPlanted", seed: "Potato Seed" },
        createdAt: MID,
      });

      expect(
        Object.keys(game.crops).filter((id) => !game.crops[id].crop),
      ).toEqual(LOCKED);
      // Only the seven plots planted take a seed.
      expect(game.inventory["Potato Seed"]).toEqual(new Decimal(3));
    });
    it("only takes a seed for each plot it plants in bulk", () => {
      // Twenty plots and no Water Well: the last ones can't be planted, and
      // with the locked plots skipped the bulk plant reaches them.
      const crops = Object.fromEntries(
        // Distinct ages, so the plots past the well's support are 18 to 20.
        Array.from({ length: 20 }, (_, i) => [
          `${i + 1}`,
          plot(i, { createdAt: i }),
        ]),
      );
      const state = farm({ crops });
      state.inventory["Potato Seed"] = new Decimal(17);

      const game = bulkPlant({
        state,
        action: { type: "seeds.bulkPlanted", seed: "Potato Seed" },
        createdAt: MID,
      });
      const planted = Object.values(game.crops).filter((p) => !!p.crop);

      expect(planted.length).toBeLessThan(17);
      expect(game.inventory["Potato Seed"]).toEqual(
        new Decimal(17 - planted.length),
      );
    });
  });

  describe("harvesting", () => {
    it("can't harvest a crop on a locked plot", () => {
      expect(() => harvestOn(farm({ crops: grown() }), "1", MID)).toThrow(
        "Plot is affected by greatFreeze",
      );
    });

    it("harvests a crop on a plot that isn't locked", () => {
      const game = harvestOn(farm({ crops: grown() }), "4", MID);

      expect(game.crops["4"].crop).toBeUndefined();
    });

    it("harvests the crop on a locked plot once the Great Freeze ends", () => {
      const game = harvestOn(farm({ crops: grown() }), "1", FREEZE.endAt);

      expect(game.crops["1"].crop).toBeUndefined();
    });

    it("lists every ready crop but the locked ones for bulk harvest", () => {
      const { readyPlots } = getCropsToHarvest(farm({ crops: grown() }), MID);

      expect(Object.keys(readyPlots)).toEqual(
        Object.keys(PLOTS).filter((id) => !LOCKED.includes(id)),
      );
    });

    it("harvests every crop but the locked ones in bulk", () => {
      const game = bulkHarvest({
        state: farm({ crops: grown() }),
        action: { type: "crops.bulkHarvested" },
        createdAt: MID,
        farmId: 1,
      });

      expect(
        Object.keys(game.crops).filter((id) => !!game.crops[id].crop),
      ).toEqual(LOCKED);
    });
  });

  describe("removing", () => {
    it("can't remove a locked plot", () => {
      expect(() =>
        removePlot({
          state: farm(),
          action: { type: "plot.removed", id: "1" },
          createdAt: MID,
        }),
      ).toThrow("Plot is affected by greatFreeze");
    });

    it("removes a plot that isn't locked", () => {
      const game = removePlot({
        state: farm(),
        action: { type: "plot.removed", id: "4" },
        createdAt: MID,
      });

      expect(game.crops["4"].x).toBeUndefined();
    });

    it("keeps a locked plot locked when it's placed back", () => {
      // Lifted while a Thaw Stone was out, then the stone was lifted too.
      let game = farm({ collectibles: THAW_STONE() });
      game = removePlot({
        state: game,
        action: { type: "plot.removed", id: "1" },
        createdAt: MID,
      });
      game = move(game, "removed", MID + HOUR);
      game = placePlot({
        state: game,
        action: {
          type: "plot.placed",
          name: "Crop Plot",
          id: "new",
          coordinates: { x: 0, y: 2 },
        },
        createdAt: MID + 2 * HOUR,
      });

      expect(game.crops.new).toBeUndefined();
      expect(isPlotFrozen({ game, id: "1", now: MID + 2 * HOUR })).toBe(true);
    });
  });

  describe("protection", () => {
    it("locks nothing with a Thaw Stone out", () => {
      expect(frozen(farm({ collectibles: THAW_STONE() }), MID)).toEqual([]);
    });

    it("unlocks the plots from the moment a Thaw Stone is placed", () => {
      expect(frozen(farm(), MID)).toEqual(LOCKED);

      const game = move(farm(), "placed", MID);

      expect(frozen(game, MID)).toEqual([]);
      expect(plantOn(game, "1", MID).crops["1"].crop?.name).toBe("Potato");
    });

    it("locks the plots again from the moment the Thaw Stone is lifted", () => {
      const game = move(farm({ collectibles: THAW_STONE() }), "removed", MID);

      expect(frozen(game, MID)).toEqual(LOCKED);
      expect(() => plantOn(game, "1", MID)).toThrow(
        "Plot is affected by greatFreeze",
      );
    });

    it("locks nothing with the winter Guardian out when it starts", () => {
      expect(frozen(farm({ collectibles: GUARDIAN() }), MID)).toEqual([]);
    });

    it("still locks with a Guardian placed after the Great Freeze started", () => {
      const game = farm({
        collectibles: GUARDIAN({ placedAt: FREEZE.startAt + HOUR }),
      });

      expect(frozen(game, MID)).toEqual(LOCKED);
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

    it("locks nothing", () => {
      expect(frozen(farm(), MID)).toEqual([]);
      expect(plantOn(farm(), "1", MID).crops["1"].crop?.name).toBe("Potato");
    });
  });
});
