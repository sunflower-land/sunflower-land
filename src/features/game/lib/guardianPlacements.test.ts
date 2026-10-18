import Decimal from "decimal.js-light";
import { produce } from "immer";
import { TEST_FARM } from "./constants";
import type { GameState } from "../types/game";
import { placeCollectible } from "../events/landExpansion/placeCollectible";
import { removeCollectible } from "../events/landExpansion/removeCollectible";
import {
  applyFarmLayout,
  snapshotFarm,
} from "../events/landExpansion/lib/layouts";

const HOUR = 60 * 60 * 1000;
const t0 = 1_700_000_000_000;

const baseFarm: GameState = {
  ...TEST_FARM,
  inventory: {
    ...TEST_FARM.inventory,
    "Basic Land": new Decimal(1),
    "Summer Guardian": new Decimal(1),
    "Brazilian Flag": new Decimal(1),
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
  boostHistory: undefined,
};

const place = (state: GameState, createdAt: number) =>
  placeCollectible({
    state,
    action: {
      type: "collectible.placed",
      name: "Summer Guardian",
      id: "g1",
      coordinates: { x: 0, y: 0 },
      location: "farm",
    },
    createdAt,
  });

const remove = (state: GameState, createdAt: number) =>
  removeCollectible({
    state,
    action: {
      type: "collectible.removed",
      name: "Summer Guardian",
      id: "g1",
      location: "farm",
    },
    createdAt,
  });

describe("Guardian placement tracking", () => {
  it("stamps placedAt when a Guardian is placed", () => {
    const state = place(baseFarm, t0);

    expect(state.collectibles["Summer Guardian"]?.[0].placedAt).toBe(t0);
  });

  it("archives the placed period when a Guardian is removed", () => {
    const state = remove(place(baseFarm, t0), t0 + HOUR);

    expect(state.boostHistory?.["Summer Guardian"]).toEqual([
      { from: t0, to: t0 + HOUR },
    ]);
    expect(state.collectibles["Summer Guardian"]?.[0].placedAt).toBeUndefined();
  });

  it("stamps a new placedAt when a removed Guardian is placed back", () => {
    const removed = remove(place(baseFarm, t0), t0 + HOUR);
    const state = place(removed, t0 + 2 * HOUR);

    expect(state.collectibles["Summer Guardian"]?.[0].placedAt).toBe(
      t0 + 2 * HOUR,
    );
    expect(state.boostHistory?.["Summer Guardian"]).toEqual([
      { from: t0, to: t0 + HOUR },
    ]);
  });

  it("archives a Guardian placed before tracking existed as placed since 0", () => {
    const state = remove(
      {
        ...baseFarm,
        collectibles: {
          "Summer Guardian": [{ id: "g1", coordinates: { x: 0, y: 0 } }],
        },
      },
      t0,
    );

    expect(state.boostHistory?.["Summer Guardian"]).toEqual([
      { from: 0, to: t0 },
    ]);
  });

  it("leaves an already-placed Guardian alone when something else is placed", () => {
    const state = placeCollectible({
      state: {
        ...baseFarm,
        collectibles: {
          "Summer Guardian": [{ id: "g1", coordinates: { x: 0, y: 0 } }],
        },
      },
      action: {
        type: "collectible.placed",
        name: "Brazilian Flag",
        id: "f1",
        coordinates: { x: -3, y: 0 },
        location: "farm",
      },
      createdAt: t0,
    });

    expect(state.collectibles["Summer Guardian"]?.[0].placedAt).toBeUndefined();
    expect(state.collectibles["Brazilian Flag"]?.[0].placedAt).toBeUndefined();
    expect(state.boostHistory).toBeUndefined();
  });

  it("archives a Guardian that applying a layout lifts", () => {
    const placed = place(baseFarm, t0);
    const layout = {
      id: "layout-1",
      name: "L",
      createdAt: t0,
      updatedAt: t0,
      ...snapshotFarm({ ...placed, collectibles: {} }),
    };

    const state = produce(placed, (draft) => {
      applyFarmLayout(draft, layout, t0 + HOUR);
    });

    expect(state.collectibles["Summer Guardian"]?.[0].coordinates).toBe(
      undefined,
    );
    expect(state.boostHistory?.["Summer Guardian"]).toEqual([
      { from: t0, to: t0 + HOUR },
    ]);
  });
});
