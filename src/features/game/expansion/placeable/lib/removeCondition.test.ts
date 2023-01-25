import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import {
  Chicken,
  GameState,
  LandExpansionPlot,
} from "features/game/types/game";
import { isRemovable } from "./removeCondition";

const makeChickensStateObject = (numOfChickens: number, isBrewing: boolean) => {
  return Array.from(Array(numOfChickens).keys()).reduce((obj, curr) => {
    obj[curr] = {
      coordinates: {
        x: curr,
        y: curr,
      },
      multiplier: 1,
      fedAt: isBrewing ? 1 : undefined,
    };

    return obj;
  }, {} as Record<number, Chicken>);
};

const makePlotsWithCrops = (plotCount: number) => {
  const plots = {} as Record<number, LandExpansionPlot>;

  [...Array(plotCount).keys()].forEach(
    (key) =>
      (plots[key] = {
        crop: { name: "Sunflower", plantedAt: 0, amount: 1 },
        x: -2,
        y: 0,
        height: 1,
        width: 1,
      })
  );

  return plots;
};

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  balance: new Decimal(0),
  inventory: {
    "Rusty Shovel": new Decimal(1),
    "Hen House": new Decimal(2),
    "Water Well": new Decimal(2),
    "Chicken Coop": new Decimal(1),
  },
  buildings: {
    "Hen House": [
      {
        id: "123",
        createdAt: 0,
        coordinates: { x: 1, y: 1 },
        readyAt: 0,
      },
      {
        id: "124",
        createdAt: 0,
        coordinates: { x: 1, y: 1 },
        readyAt: 0,
      },
    ],
    "Water Well": [
      {
        id: "223",
        createdAt: 0,
        coordinates: { x: 1, y: 1 },
        readyAt: 0,
      },
      {
        id: "224",
        createdAt: 0,
        coordinates: { x: 1, y: 1 },
        readyAt: 0,
      },
    ],
  },
  collectibles: {
    "Chicken Coop": [
      {
        id: "323",
        createdAt: 0,
        coordinates: { x: 1, y: 1 },
        readyAt: 0,
      },
    ],
  },
  chickens: {},
  expansions: [],
};

describe("isRemovable", () => {
  it("returns true for placeables with no restrictions", () => {
    const gameState = {
      ...GAME_STATE,
      inventory: {
        "Basic Bear": new Decimal(1),
      },
      collectibles: {
        ...GAME_STATE.collectibles,
        "Basic Bear": [
          {
            id: "423",
            createdAt: 0,
            coordinates: { x: 1, y: 1 },
            readyAt: 0,
          },
        ],
      },
    };
    expect(isRemovable(gameState, "Basic Bear", "423")).toBeTruthy();
  });
  it("returns false for Water Well if ID not found in game state", () => {
    expect(isRemovable(GAME_STATE, "Water Well", "abc")).toBeFalsy();
  });
  it("returns true for Water Well if remove it will not uproot crops", () => {
    const gameState = {
      ...GAME_STATE,
      expansions: [
        { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
        { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
      ],
    };
    expect(isRemovable(gameState, "Water Well", "224")).toBeTruthy();
  });
  it("returns false for Water Well if remove it will uproot crops", () => {
    const gameState = {
      ...GAME_STATE,
      expansions: [
        { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
        { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
        { createdAt: 0, readyAt: 0, plots: makePlotsWithCrops(10) },
      ],
    };
    expect(isRemovable(gameState, "Water Well", "224")).toBeFalsy();
  });
  it("returns false for Hen House if ID not found in game state", () => {
    expect(isRemovable(GAME_STATE, "Hen House", "abc")).toBeFalsy();
  });
  it("returns true for Hen House if remove it will not remove chickens that are brewing eggs", () => {
    const gameState = {
      ...GAME_STATE,
      chickens: makeChickensStateObject(15, true),
    };
    expect(isRemovable(gameState, "Hen House", "124")).toBeTruthy();
  });
  it("returns false for Hen House if remove it will remove chickens that are brewing eggs", () => {
    const gameState = {
      ...GAME_STATE,
      chickens: makeChickensStateObject(30, true),
    };
    expect(isRemovable(gameState, "Hen House", "124")).toBeFalsy();
  });
  it("returns true for Hen House if chickens that are removed are all not brewing eggs", () => {
    const gameState = {
      ...GAME_STATE,
      chickens: makeChickensStateObject(30, false),
    };
    expect(isRemovable(gameState, "Hen House", "124")).toBeTruthy();
  });
  it("returns false for Chicken Coop if ID not found in game state", () => {
    expect(isRemovable(GAME_STATE, "Chicken Coop", "abc")).toBeFalsy();
  });
  it("returns true for Chicken Coop if remove it will not remove chickens that are brewing eggs", () => {
    const gameState = {
      ...GAME_STATE,
      chickens: makeChickensStateObject(20, true),
    };
    expect(isRemovable(gameState, "Chicken Coop", "323")).toBeTruthy();
  });
  it("returns false for Chicken Coop if remove it will remove chickens that are brewing eggs", () => {
    const gameState = {
      ...GAME_STATE,
      chickens: makeChickensStateObject(30, true),
    };
    expect(isRemovable(gameState, "Chicken Coop", "323")).toBeFalsy();
  });
  it("returns true for Chicken Coop if chickens that are removed are all not brewing eggs", () => {
    const gameState = {
      ...GAME_STATE,
      chickens: makeChickensStateObject(30, false),
    };
    expect(isRemovable(gameState, "Chicken Coop", "323")).toBeTruthy();
  });
});
