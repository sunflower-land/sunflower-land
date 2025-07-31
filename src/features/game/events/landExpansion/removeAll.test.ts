import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { removeAll } from "./removeAll";
const dateNow = Date.now();

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  home: {
    ...INITIAL_FARM.home,
    collectibles: {
      "Abandoned Bear": [
        {
          id: "1",
          coordinates: { x: 0, y: 0 },
          readyAt: dateNow,
          createdAt: dateNow,
        },
      ],
    },
  },
  collectibles: {
    "Abandoned Bear": [
      {
        id: "1",
        coordinates: { x: 0, y: 0 },
        readyAt: dateNow,
        createdAt: dateNow,
      },
    ],
  },
  buds: {
    1: {
      type: "Beach",
      colour: "Beige",
      stem: "3 Leaf Clover",
      aura: "No Aura",
      ears: "Ears",
      location: "farm",
      coordinates: { x: 0, y: 1 },
    },
    2: {
      type: "Beach",
      colour: "Beige",
      stem: "3 Leaf Clover",
      aura: "No Aura",
      ears: "Ears",
      location: "home",
      coordinates: { x: 0, y: 1 },
    },
  },
  beehives: {
    "1": {
      swarm: false,
      honey: {
        updatedAt: dateNow,
        produced: 0,
      },
      flowers: [
        {
          id: "1",
          attachedAt: dateNow,
          attachedUntil: dateNow + 1000,
          rate: 1,
        },
      ],
      x: 0,
      y: 2,
    },
  },
  flowers: {
    discovered: {},
    flowerBeds: {
      "1": {
        createdAt: dateNow,
        x: 0,
        y: 3,
      },
    },
  },
  buildings: {
    "Fire Pit": [
      {
        id: "1",
        coordinates: { x: 1, y: 0 },
        readyAt: dateNow,
        createdAt: dateNow,
      },
    ],
  },
  crimstones: {
    "1": {
      minesLeft: 5,
      stone: {
        minedAt: dateNow,
      },
      createdAt: dateNow,
      x: 2,
      y: 0,
    },
  },
  fruitPatches: {
    "1": {
      createdAt: dateNow,
      x: 2,
      y: 1,
    },
  },
  gold: {
    "1": {
      stone: {
        minedAt: dateNow,
      },
      createdAt: dateNow,
      x: 2,
      y: 2,
    },
  },
  iron: {
    "1": {
      stone: {
        minedAt: dateNow,
      },
      createdAt: dateNow,
      x: 2,
      y: 3,
    },
  },
  stones: {
    "1": {
      stone: {
        minedAt: dateNow,
      },
      createdAt: dateNow,
      x: 2,
      y: 3,
    },
  },
  oilReserves: {
    "1": {
      oil: {
        drilledAt: dateNow,
      },
      createdAt: dateNow,
      x: 2,
      y: 5,
      drilled: 0,
    },
  },
  sunstones: {
    "1": {
      stone: {
        minedAt: dateNow,
      },
      createdAt: dateNow,
      x: 2,
      y: 4,
      minesLeft: 5,
    },
  },
  lavaPits: {
    "1": {
      createdAt: dateNow,
      x: 2,
      y: 6,
    },
  },
  crops: {
    "1": {
      createdAt: dateNow,
      x: 2,
      y: 7,
    },
  },
  trees: {
    "1": {
      wood: {
        choppedAt: dateNow,
      },
      createdAt: dateNow,
      x: 2,
      y: 8,
    },
  },
};

describe("removeAll", () => {
  it("should remove all items from the farm", () => {
    const state = removeAll({
      state: GAME_STATE,
      action: { type: "items.removed", location: "farm" },
    });
    expect(
      state.collectibles["Abandoned Bear"]?.[0]?.coordinates,
    ).toBeUndefined();
    expect(state.buds![1].coordinates).toBeUndefined();
    expect(state.buds![1].location).toBeUndefined();
    expect(state.beehives["1"].x).toBeUndefined();
    expect(state.beehives["1"].y).toBeUndefined();
    expect(state.flowers.flowerBeds["1"].x).toBeUndefined();
    expect(state.flowers.flowerBeds["1"].y).toBeUndefined();
    expect(state.buildings["Fire Pit"]![0].coordinates).toBeUndefined();
    expect(state.crimstones["1"].x).toBeUndefined();
    expect(state.crimstones["1"].y).toBeUndefined();
    expect(state.fruitPatches["1"].x).toBeUndefined();
    expect(state.fruitPatches["1"].y).toBeUndefined();
    expect(state.gold["1"].x).toBeUndefined();
    expect(state.gold["1"].y).toBeUndefined();
    expect(state.iron["1"].x).toBeUndefined();
    expect(state.iron["1"].y).toBeUndefined();
    expect(state.stones["1"].x).toBeUndefined();
    expect(state.stones["1"].y).toBeUndefined();
    expect(state.oilReserves["1"].x).toBeUndefined();
    expect(state.oilReserves["1"].y).toBeUndefined();
    expect(state.sunstones["1"].x).toBeUndefined();
    expect(state.sunstones["1"].y).toBeUndefined();
    expect(state.lavaPits["1"].x).toBeUndefined();
    expect(state.lavaPits["1"].y).toBeUndefined();
    expect(state.crops["1"].x).toBeUndefined();
    expect(state.crops["1"].y).toBeUndefined();
    expect(state.trees["1"].x).toBeUndefined();
    expect(state.trees["1"].y).toBeUndefined();
  });
  it("should remove all items from the home", () => {
    const state = removeAll({
      state: GAME_STATE,
      action: { type: "items.removed", location: "home" },
    });
    expect(
      state.home.collectibles["Abandoned Bear"]?.[0]?.coordinates,
    ).toBeUndefined();
    expect(state.buds![2].coordinates).toBeUndefined();
    expect(state.buds![2].location).toBeUndefined();
  });
  it("shouldn't remove items in home if location is farm", () => {
    const state = removeAll({
      state: GAME_STATE,
      action: { type: "items.removed", location: "farm" },
    });
    expect(
      state.home.collectibles["Abandoned Bear"]?.[0]?.coordinates,
    ).toBeDefined();
    expect(state.buds![2].coordinates).toBeDefined();
    expect(state.buds![2].location).toBeDefined();
  });
  it("shouldn't remove items in farm if location is home", () => {
    const state = removeAll({
      state: GAME_STATE,
      action: { type: "items.removed", location: "home" },
    });
    expect(
      state.collectibles["Abandoned Bear"]?.[0]?.coordinates,
    ).toBeDefined();
    expect(state.buds![1].coordinates).toBeDefined();
    expect(state.buds![1].location).toBeDefined();
    expect(state.beehives["1"].x).toBeDefined();
    expect(state.beehives["1"].y).toBeDefined();
    expect(state.flowers.flowerBeds["1"].x).toBeDefined();
    expect(state.flowers.flowerBeds["1"].y).toBeDefined();
    expect(state.buildings["Fire Pit"]![0].coordinates).toBeDefined();
    expect(state.crimstones["1"].x).toBeDefined();
    expect(state.crimstones["1"].y).toBeDefined();
    expect(state.fruitPatches["1"].x).toBeDefined();
    expect(state.fruitPatches["1"].y).toBeDefined();
    expect(state.gold["1"].x).toBeDefined();
    expect(state.gold["1"].y).toBeDefined();
    expect(state.iron["1"].x).toBeDefined();
    expect(state.iron["1"].y).toBeDefined();
    expect(state.stones["1"].x).toBeDefined();
    expect(state.stones["1"].y).toBeDefined();
    expect(state.oilReserves["1"].x).toBeDefined();
    expect(state.oilReserves["1"].y).toBeDefined();
    expect(state.sunstones["1"].x).toBeDefined();
    expect(state.sunstones["1"].y).toBeDefined();
    expect(state.lavaPits["1"].x).toBeDefined();
    expect(state.lavaPits["1"].y).toBeDefined();
    expect(state.crops["1"].x).toBeDefined();
    expect(state.crops["1"].y).toBeDefined();
    expect(state.trees["1"].x).toBeDefined();
    expect(state.trees["1"].y).toBeDefined();
  });
});
