import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState, SavedLayout } from "features/game/types/game";
import { CONFIG } from "lib/config";
import { saveAscensionLayout } from "./saveAscensionLayout";
import { saveLayout } from "./saveLayout";

const createdAt = 1_700_000_000_000;

const baseFarm: GameState = {
  ...TEST_FARM,
  inventory: {
    ...TEST_FARM.inventory,
    "Basic Land": new Decimal(42),
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

// (0, 0) is the centre of the first expansion → always within 30 lands.
// (0, 18) is the centre of the 34th expansion (index 33) → only exists once the
// farm grows past 30 lands, so it is trimmed away when snapshotting to 30.
const WITHIN_30 = { x: 0, y: 0 };
const BEYOND_30 = { x: 0, y: 18 };

describe("saveAscensionLayout", () => {
  it("throws when SAVED_LAYOUTS access is missing", () => {
    const previousNetwork = CONFIG.NETWORK;
    // Testnet forces the beta flag on; use mainnet + no Beta Pass so the guard
    // (which runs before any snapshotting) actually fails.
    CONFIG.NETWORK = "mainnet";
    try {
      const state: GameState = {
        ...baseFarm,
        inventory: { ...baseFarm.inventory, "Beta Pass": new Decimal(0) },
      };
      expect(() =>
        saveAscensionLayout({
          state,
          action: { type: "layout.ascensionSaved" },
          createdAt,
        }),
      ).toThrow("Saved layouts are not available");
    } finally {
      CONFIG.NETWORK = previousNetwork;
    }
  });

  it("trims placed items that fall beyond the first 30 expansions", () => {
    const state: GameState = {
      ...baseFarm,
      crops: {
        keep: { ...WITHIN_30, createdAt },
        drop: { ...BEYOND_30, createdAt },
      },
    };

    const layout = saveAscensionLayout({
      state,
      action: { type: "layout.ascensionSaved" },
      createdAt,
    }).layouts![0];

    expect(layout.resources.crops).toEqual({ keep: { x: 0, y: 0 } });
  });

  it("stamps the land extent to 30 regardless of the current farm size", () => {
    const big = saveAscensionLayout({
      state: baseFarm,
      action: { type: "layout.ascensionSaved" },
      createdAt,
    }).layouts![0];
    expect(big.land!.expansions).toEqual(30);

    const small = saveAscensionLayout({
      state: {
        ...baseFarm,
        inventory: { ...baseFarm.inventory, "Basic Land": new Decimal(5) },
      },
      action: { type: "layout.ascensionSaved" },
      createdAt,
    }).layouts![0];
    expect(small.land!.expansions).toEqual(30);
  });

  it("stores it as the protected, auto-managed Ascension Layout", () => {
    const layout = saveAscensionLayout({
      state: baseFarm,
      action: { type: "layout.ascensionSaved" },
      createdAt,
    }).layouts![0];

    expect(layout.name).toEqual("Ascension Layout");
    expect(layout.auto).toBe(true);
    expect(layout.createdAt).toEqual(createdAt);
    expect(layout.updatedAt).toEqual(createdAt);
  });

  it("never stores single-use ascension crystals", () => {
    const state: GameState = {
      ...baseFarm,
      ascensionCrystals: {
        c1: { ...WITHIN_30, stone: { minedAt: 0 }, minesLeft: 1 },
      },
    };

    const layout = saveAscensionLayout({
      state,
      action: { type: "layout.ascensionSaved" },
      createdAt,
    }).layouts![0];

    expect(layout.resources.ascensionCrystals).toEqual({});
  });

  it("re-assigns an existing Ascension Layout, preserving its createdAt", () => {
    const first = saveAscensionLayout({
      state: { ...baseFarm, crops: { a: { ...WITHIN_30, createdAt } } },
      action: { type: "layout.ascensionSaved" },
      createdAt,
    });

    const second = saveAscensionLayout({
      state: { ...first, crops: {} },
      action: { type: "layout.ascensionSaved" },
      createdAt: createdAt + 5000,
    });

    expect(second.layouts!.filter((l) => l.auto)).toHaveLength(1);
    const layout = second.layouts!.find((l) => l.auto)!;
    expect(layout.createdAt).toEqual(createdAt);
    expect(layout.updatedAt).toEqual(createdAt + 5000);
    expect(layout.resources.crops).toEqual({});
  });

  it("promotes an existing saved layout, trimming it and keeping the original", () => {
    // A manual layout that includes an item beyond the first 30 lands.
    const withManual = saveLayout({
      state: {
        ...baseFarm,
        crops: {
          keep: { ...WITHIN_30, createdAt },
          drop: { ...BEYOND_30, createdAt },
        },
      },
      action: { type: "layout.saved", name: "My Farm" },
      createdAt,
    });
    expect(Object.keys(withManual.layouts![0].resources.crops)).toEqual([
      "keep",
      "drop",
    ]);

    const result = saveAscensionLayout({
      state: withManual,
      action: { type: "layout.ascensionSaved", layoutId: 0 },
      createdAt: createdAt + 1000,
    });

    expect(result.layouts).toHaveLength(2);
    const manual = result.layouts!.find((l) => l.name === "My Farm")!;
    expect(Object.keys(manual.resources.crops)).toEqual(["keep", "drop"]);

    const auto = result.layouts!.find((l) => l.auto)!;
    expect(auto.resources.crops).toEqual({ keep: { x: 0, y: 0 } });
    expect(auto.land!.expansions).toEqual(30);
  });

  it("throws when promoting a layout that does not exist", () => {
    expect(() =>
      saveAscensionLayout({
        state: baseFarm,
        action: { type: "layout.ascensionSaved", layoutId: 5 },
        createdAt,
      }),
    ).toThrow("Layout does not exist");
  });

  it("keeps existing manual layouts alongside the Ascension Layout", () => {
    const manual: SavedLayout = {
      name: "My Farm",
      createdAt,
      updatedAt: createdAt,
      collectibles: {},
      buildings: {},
      resources: {
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
        flowerBeds: {},
        lavaPits: {},
      },
    };

    const result = saveAscensionLayout({
      state: { ...baseFarm, layouts: [manual] },
      action: { type: "layout.ascensionSaved" },
      createdAt,
    });

    expect(result.layouts).toHaveLength(2);
    expect(result.layouts!.filter((l) => l.auto)).toHaveLength(1);
    expect(result.layouts!.some((l) => l.name === "My Farm")).toBe(true);
  });
});
