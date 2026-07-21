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
    // Non-removable buildings (Town Center) can still be moved → captured.
    expect(layout.buildings["Town Center"]).toEqual([
      { id: "tc", coordinates: { x: -2, y: 3 } },
    ]);
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

  it("snapshots farm-placed buds, pet NFTs, farmhands and the bumpkin", () => {
    const equipped = {
      background: "Farm Background" as const,
      body: "Beige Farmer Potion" as const,
      hair: "Basic Hair" as const,
      shoes: "Black Farmer Boots" as const,
      pants: "Farmer Pants" as const,
      shirt: "Yellow Farmer Shirt" as const,
      tool: "Farmer Pitchfork" as const,
    };
    const bud = {
      aura: "Basic" as const,
      colour: "Beige" as const,
      ears: "Ears" as const,
      stem: "3 Leaf Clover" as const,
      type: "Beach" as const,
    };

    const state: GameState = {
      ...baseFarm,
      buds: {
        1: { ...bud, coordinates: { x: 1, y: 1 }, location: "farm" },
        2: { ...bud }, // not placed → skipped
        3: { ...bud, coordinates: { x: 5, y: 5 }, location: "home" }, // not farm
      },
      pets: {
        nfts: {
          1: {
            id: 1,
            name: "Pet #1",
            requests: { food: [], fedAt: createdAt },
            energy: 100,
            experience: 0,
            pettedAt: createdAt,
            coordinates: { x: 2, y: 2 },
            location: "farm",
          },
          2: {
            id: 2,
            name: "Pet #2",
            requests: { food: [], fedAt: createdAt },
            energy: 100,
            experience: 0,
            pettedAt: createdAt,
            coordinates: { x: 0, y: 0 },
            location: "petHouse", // not farm → excluded
          },
        },
      },
      farmHands: {
        bumpkins: {
          "fh-1": {
            equipped,
            coordinates: { x: 3, y: 3 },
            flipped: true,
            location: "farm",
          },
          "fh-2": {
            equipped,
            coordinates: { x: 6, y: 6 },
            location: "home", // not farm → excluded
          },
        },
      },
      bumpkin: {
        ...baseFarm.bumpkin,
        coordinates: { x: -1, y: -1 },
        location: "farm",
        flipped: true,
      },
    };

    const result = saveLayout({
      state,
      action: { type: "layout.saved", name: "Avatars" },
      createdAt,
    });
    const layout = result.layouts![0];

    expect(layout.buds).toEqual({ 1: { x: 1, y: 1 } });
    expect(layout.petNFTs).toEqual({ 1: { x: 2, y: 2 } });
    expect(layout.farmHands).toEqual({ "fh-1": { x: 3, y: 3, flipped: true } });
    expect(layout.bumpkin).toEqual({ x: -1, y: -1, flipped: true });
  });

  it("empties the avatar buckets when nothing of that kind is farm-placed", () => {
    const state: GameState = {
      ...baseFarm,
      buds: {},
      pets: { nfts: {} },
      farmHands: { bumpkins: {} },
      bumpkin: { ...baseFarm.bumpkin, coordinates: undefined },
    };

    const layout = saveLayout({
      state,
      action: { type: "layout.saved", name: "Empty" },
      createdAt,
    }).layouts![0];

    expect(layout.buds).toEqual({});
    expect(layout.petNFTs).toEqual({});
    expect(layout.farmHands).toEqual({});
    expect(layout.bumpkin).toBeUndefined();
  });

  it("clears stale avatar placements when overwriting a layout", () => {
    const bud = {
      aura: "Basic" as const,
      colour: "Beige" as const,
      ears: "Ears" as const,
      stem: "3 Leaf Clover" as const,
      type: "Beach" as const,
    };
    // First save captures a placed bud.
    const withBud = saveLayout({
      state: {
        ...baseFarm,
        buds: { 1: { ...bud, coordinates: { x: 1, y: 1 }, location: "farm" } },
      },
      action: { type: "layout.saved", name: "Farm" },
      createdAt,
    });

    // Overwrite from a farm with no bud — the stale bud must not survive.
    const overwritten = saveLayout({
      state: { ...withBud, buds: {} },
      action: { type: "layout.saved", layoutId: 0 },
      createdAt: createdAt + 1000,
    });

    expect(overwritten.layouts![0].buds).toEqual({});
  });

  it("captures the land extent (expansion count + island) at save time", () => {
    const layout = saveLayout({
      state: baseFarm,
      action: { type: "layout.saved", name: "Land" },
      createdAt,
    }).layouts![0];

    expect(layout.land).toEqual({ expansions: 1, island: TEST_FARM.island });
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
    state = saveLayout({
      state,
      action: { type: "layout.saved", name: "c" },
      createdAt,
    });

    expect(() =>
      saveLayout({
        state,
        action: { type: "layout.saved", name: "d" },
        createdAt,
      }),
    ).toThrow("Maximum number of layouts reached");
  });

  it("does not count the protected Ascension Layout against the limit", () => {
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
    // Mark one of the two as the auto Ascension Layout — it should be exempt, so a
    // third manual layout still fits (2 manual < MAX_SAVED_LAYOUTS).
    const withAuto: GameState = {
      ...state,
      layouts: state.layouts!.map((layout, i) =>
        i === 0 ? { ...layout, auto: true } : layout,
      ),
    };

    const result = saveLayout({
      state: withAuto,
      action: { type: "layout.saved", name: "c" },
      createdAt,
    });

    expect(result.layouts).toHaveLength(3);
  });

  it("throws when overwriting the protected Ascension Layout", () => {
    const saved = saveLayout({
      state: baseFarm,
      action: { type: "layout.saved", name: "a" },
      createdAt,
    });
    const state: GameState = {
      ...saved,
      layouts: saved.layouts!.map((layout) => ({ ...layout, auto: true })),
    };

    expect(() =>
      saveLayout({
        state,
        action: { type: "layout.saved", name: "x", layoutId: 0 },
        createdAt,
      }),
    ).toThrow("The Ascension Layout cannot be overwritten");
  });

  it("trims a provided name and rejects too-long names", () => {
    const trimmed = saveLayout({
      state: baseFarm,
      action: { type: "layout.saved", name: "  Padded  " },
      createdAt,
    });
    expect(trimmed.layouts![0].name).toEqual("Padded");

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

  it("defaults an unnamed new layout to 'Layout N'", () => {
    let state = saveLayout({
      state: baseFarm,
      action: { type: "layout.saved" },
      createdAt,
    });
    expect(state.layouts![0].name).toEqual("Layout 1");

    // A blank/whitespace name is treated the same as no name.
    state = saveLayout({
      state,
      action: { type: "layout.saved", name: "   " },
      createdAt,
    });
    expect(state.layouts![1].name).toEqual("Layout 2");
  });

  it("keeps the existing name when overwriting without a name", () => {
    const first = saveLayout({
      state: baseFarm,
      action: { type: "layout.saved", name: "Keep" },
      createdAt,
    });
    const second = saveLayout({
      state: first,
      action: { type: "layout.saved", layoutId: 0 },
      createdAt: createdAt + 1000,
    });
    expect(second.layouts![0].name).toEqual("Keep");
    expect(second.layouts![0].updatedAt).toEqual(createdAt + 1000);
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
