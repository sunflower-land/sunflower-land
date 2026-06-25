import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { MAX_LAYOUT_NAME_LENGTH } from "features/game/types/game";
import { CONFIG } from "lib/config";
import { saveLayout } from "./saveLayout";

const createdAt = 1_700_000_000_000;

const baseFarm: GameState = {
  ...TEST_FARM,
  inventory: {
    ...TEST_FARM.inventory,
    "Basic Land": new Decimal(1),
    "Beta Pass": new Decimal(1),
  },
  collectibles: {},
  buildings: {},
  trees: {},
  stones: {},
  gold: {},
  iron: {},
  crimstones: {},
  sunstones: {},
  ascensionCrystals: {},
  oilReserves: {},
  crops: {},
  fruitPatches: {},
  beehives: {},
  lavaPits: {},
  flowers: { ...TEST_FARM.flowers, flowerBeds: {} },
  layouts: [],
};

describe("saveLayout", () => {
  it("snapshots placed collectibles, buildings and resources", () => {
    const state: GameState = {
      ...baseFarm,
      collectibles: {
        "Wicker Man": [
          { id: "a", coordinates: { x: 0, y: 0 }, flipped: true, createdAt },
          { id: "n", createdAt }, // no coordinates → skipped
        ],
      },
      buildings: {
        "Fire Pit": [
          {
            id: "fp",
            coordinates: { x: -3, y: 0 },
            createdAt,
            readyAt: createdAt,
          },
        ],
        "Town Center": [
          {
            id: "tc",
            coordinates: { x: -2, y: 3 },
            createdAt,
            readyAt: createdAt,
          },
        ],
      },
      trees: { t1: { x: 0, y: 2, wood: { choppedAt: 0 }, createdAt } },
      crops: { c1: { x: 2, y: 0, createdAt } },
      flowers: {
        ...baseFarm.flowers,
        flowerBeds: { f1: { x: -1, y: 3, createdAt } },
      },
    };

    const result = saveLayout({
      state,
      action: { type: "layout.saved", name: "My Farm" },
      createdAt,
    });
    const layout = result.layouts![0];

    expect(layout.name).toEqual("My Farm");
    expect(layout.createdAt).toEqual(createdAt);
    expect(layout.updatedAt).toEqual(createdAt);
    expect(layout.collectibles["Wicker Man"]).toEqual([
      { id: "a", coordinates: { x: 0, y: 0 }, flipped: true },
    ]);
    expect(layout.buildings["Fire Pit"]).toEqual([
      { id: "fp", coordinates: { x: -3, y: 0 } },
    ]);
    // Immovable buildings are never captured.
    expect(layout.buildings["Town Center"]).toBeUndefined();
    expect(layout.resources.trees).toEqual({ t1: { x: 0, y: 2 } });
    expect(layout.resources.crops).toEqual({ c1: { x: 2, y: 0 } });
    expect(layout.resources.flowerBeds).toEqual({ f1: { x: -1, y: 3 } });
  });

  it("captures sub-tile oX/oY render offsets", () => {
    const state: GameState = {
      ...baseFarm,
      collectibles: {
        "Wicker Man": [
          { id: "a", coordinates: { x: 0, y: 0, oX: 4, oY: -4 }, createdAt },
        ],
      },
    };

    const result = saveLayout({
      state,
      action: { type: "layout.saved", name: "Offsets" },
      createdAt,
    });

    expect(result.layouts![0].collectibles["Wicker Man"]).toEqual([
      { id: "a", coordinates: { x: 0, y: 0, oX: 4, oY: -4 } },
    ]);
  });

  it("overwrites an existing layout, preserving createdAt", () => {
    const first = saveLayout({
      state: baseFarm,
      action: { type: "layout.saved", name: "First" },
      createdAt,
    });

    const second = saveLayout({
      state: first,
      action: { type: "layout.saved", name: "Renamed", layoutId: 0 },
      createdAt: createdAt + 1000,
    });

    expect(second.layouts).toHaveLength(1);
    expect(second.layouts![0].name).toEqual("Renamed");
    expect(second.layouts![0].createdAt).toEqual(createdAt);
    expect(second.layouts![0].updatedAt).toEqual(createdAt + 1000);
  });

  it("throws when overwriting a layout that does not exist", () => {
    expect(() =>
      saveLayout({
        state: baseFarm,
        action: { type: "layout.saved", name: "x", layoutId: 2 },
        createdAt,
      }),
    ).toThrow("Layout does not exist");
  });

  it("throws when the maximum number of layouts is reached", () => {
    let state = saveLayout({
      state: baseFarm,
      action: { type: "layout.saved", name: "a" },
      createdAt,
    });
    state = saveLayout({
      state,
      action: { type: "layout.saved", name: "b" },
      createdAt,
    });

    expect(() =>
      saveLayout({
        state,
        action: { type: "layout.saved", name: "c" },
        createdAt,
      }),
    ).toThrow("Maximum number of layouts reached");
  });

  it("trims the name and rejects empty / too-long names", () => {
    const trimmed = saveLayout({
      state: baseFarm,
      action: { type: "layout.saved", name: "  Padded  " },
      createdAt,
    });
    expect(trimmed.layouts![0].name).toEqual("Padded");

    expect(() =>
      saveLayout({
        state: baseFarm,
        action: { type: "layout.saved", name: "   " },
        createdAt,
      }),
    ).toThrow("Layout name cannot be empty");

    expect(() =>
      saveLayout({
        state: baseFarm,
        action: {
          type: "layout.saved",
          name: "x".repeat(MAX_LAYOUT_NAME_LENGTH + 1),
        },
        createdAt,
      }),
    ).toThrow("Layout name is too long");
  });

  describe("feature gate", () => {
    const originalNetwork = CONFIG.NETWORK;
    afterEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
    });

    it("throws when the player does not have feature access", () => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
      const noAccess: GameState = {
        ...baseFarm,
        inventory: { "Basic Land": new Decimal(1) },
      };

      expect(() =>
        saveLayout({
          state: noAccess,
          action: { type: "layout.saved", name: "x" },
          createdAt,
        }),
      ).toThrow("Saved layouts are not available");
    });
  });
});
