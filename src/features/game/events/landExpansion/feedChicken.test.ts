import Decimal from "decimal.js-light";
import {
  CHICKEN_TIME_TO_EGG,
  INITIAL_BUMPKIN,
  TEST_FARM,
} from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { feedChicken } from "./feedChicken";

const GAME_STATE: GameState = TEST_FARM;

describe("feed chickens", () => {
  const dateNow = Date.now();
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if chicken does not exist", () => {
    expect(() =>
      feedChicken({
        state: GAME_STATE,
        action: { type: "chicken.fed", id: "3" },
      }),
    ).toThrow("This chicken does not exist");
  });

  it("throws an error if chicken is not hungry", () => {
    expect(() =>
      feedChicken({
        state: {
          ...GAME_STATE,
          inventory: { Chicken: new Decimal(1) },
          chickens: {
            0: {
              fedAt: dateNow,
              multiplier: 0,
            },
          },
        },
        action: { type: "chicken.fed", id: "0" },
      }),
    ).toThrow("This chicken is not hungry");
  });

  it("throws an error if the user has no wheat", () => {
    expect(() =>
      feedChicken({
        state: {
          ...GAME_STATE,
          inventory: { Chicken: new Decimal(1), Wheat: new Decimal(0.1) },
          chickens: {
            0: {
              fedAt: 0,
              multiplier: 0,
            },
          },
        },
        action: { type: "chicken.fed", id: "0" },
      }),
    ).toThrow("No wheat to feed chickens");
  });

  it("feeds a chicken", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(1), Wheat: new Decimal(1) },
      chickens: {
        "0": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", id: "0" },
    });

    const newChickens = newState.chickens || {};

    expect(newChickens["0"].fedAt).toBeGreaterThan(0);
    expect(newState.inventory.Wheat).toStrictEqual(new Decimal(0));
  });

  it("feeds a chicken multiple times", () => {
    const state = {
      ...GAME_STATE,
      inventory: { Chicken: new Decimal(1), Wheat: new Decimal(2) },
      chickens: {
        0: {
          fedAt: 0,
          multiplier: 0,
        },
      },
    };

    const firstFeed = feedChicken({
      state,
      action: { type: "chicken.fed", id: "0" },
    });

    jest.advanceTimersByTime(CHICKEN_TIME_TO_EGG);

    const secondFeed = feedChicken({
      state: firstFeed,
      action: { type: "chicken.fed", id: "0" },
    });

    const newChickens = secondFeed.chickens || {};

    expect(newChickens["0"].fedAt).toBeGreaterThan(0);
    expect(secondFeed.inventory.Wheat).toStrictEqual(new Decimal(0));
  });

  it("takes 10% less wheat to feed a chicken if a user has a single Fat Chicken placed and ready", () => {
    const state = {
      ...GAME_STATE,
      inventory: {
        Chicken: new Decimal(1),
        Wheat: new Decimal(1),
        ["Fat Chicken"]: new Decimal(1),
      },
      collectibles: {
        "Fat Chicken": [
          {
            id: "123",
            createdAt: dateNow,
            coordinates: { x: 1, y: 1 },
            // ready at < now
            readyAt: dateNow - 5 * 60 * 1000,
          },
        ],
      },
      chickens: {
        "0": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", id: "0" },
    });

    expect(newState.inventory.Wheat).toEqual(new Decimal(0.1));
  });

  it("chickens produce goods 10% faster with speed chicken", () => {
    const newDate = Date.now();
    const state = {
      ...GAME_STATE,
      inventory: {
        Chicken: new Decimal(1),
        Wheat: new Decimal(1),
        ["Speed Chicken"]: new Decimal(1),
      },
      collectibles: {
        "Speed Chicken": [
          {
            id: "123",
            createdAt: dateNow,
            coordinates: { x: 1, y: 1 },
            // ready at < now
            readyAt: dateNow - 5 * 60 * 1000,
          },
        ],
      },
      chickens: {
        "0": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", id: "0" },
    });
    const chickenTime = CHICKEN_TIME_TO_EGG * 0.1;
    const createdAt = newDate - chickenTime;
    expect(newState.chickens["0"].fedAt).toEqual(createdAt);
  });

  it("chickens produce goods 10% faster with Bumpkin Skill Stable Hand", () => {
    const newDate = Date.now();
    const state = {
      ...GAME_STATE,
      bumpkin: { ...INITIAL_BUMPKIN, skills: { "Stable Hand": 1 } },
      inventory: {
        Chicken: new Decimal(1),
        Wheat: new Decimal(1),
      },
      collectibles: {},
      chickens: {
        "0": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", id: "0" },
    });
    const chickenTime = CHICKEN_TIME_TO_EGG * 0.1;
    const createdAt = newDate - chickenTime;
    expect(newState.chickens["0"].fedAt).toEqual(createdAt);
  });

  it("chickens produce in normal time", () => {
    const newDate = Date.now();
    const state = {
      ...GAME_STATE,
      inventory: {
        Chicken: new Decimal(1),
        Wheat: new Decimal(1),
      },
      collectibles: {},
      chickens: {
        "0": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", id: "0" },
    });
    expect(newState.chickens["0"].fedAt).toEqual(newDate);
  });

  it("chickens produce goods 10% faster with Wrangler Badge", () => {
    const newDate = Date.now();
    const state = {
      ...GAME_STATE,
      inventory: {
        Chicken: new Decimal(1),
        Wheat: new Decimal(1),
        Wrangler: new Decimal(1),
      },
      collectibles: {},
      chickens: {
        "0": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", id: "0" },
    });
    const chickenTime = CHICKEN_TIME_TO_EGG * 0.1;
    const createdAt = newDate - chickenTime;
    expect(newState.chickens["0"].fedAt).toEqual(createdAt);
  });

  it("chickens produce goods 30% faster with Speed Chicken, Wrangler Badge and Stable Hand skill", () => {
    const newDate = Date.now();
    const state = {
      ...GAME_STATE,
      bumpkin: { ...INITIAL_BUMPKIN, skills: { "Stable Hand": 1 } },
      inventory: {
        Chicken: new Decimal(1),
        Wheat: new Decimal(1),
        Wrangler: new Decimal(1),
        ["Speed Chicken"]: new Decimal(1),
      },
      collectibles: {
        "Speed Chicken": [
          {
            id: "123",
            createdAt: dateNow,
            coordinates: { x: 1, y: 1 },
            // ready at < now
            readyAt: dateNow - 5 * 60 * 1000,
          },
        ],
      },
      chickens: {
        "0": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", id: "0" },
    });
    const boost = CHICKEN_TIME_TO_EGG * 0.9 * 0.9 * 0.9;
    const seconds = CHICKEN_TIME_TO_EGG - boost;
    const createdAt = newDate - seconds;

    expect(newState.chickens["0"].fedAt).toEqual(createdAt);
  });

  it("chickens produce goods 4 hours faster with El Pollo Veloz", () => {
    const newDate = Date.now();
    const state = {
      ...GAME_STATE,
      inventory: {
        Chicken: new Decimal(1),
        Wheat: new Decimal(1),
        ["El Pollo Veloz"]: new Decimal(1),
      },
      collectibles: {
        "El Pollo Veloz": [
          {
            id: "123",
            createdAt: dateNow,
            coordinates: { x: 1, y: 1 },
            // ready at < now
            readyAt: dateNow - 5 * 60 * 1000,
          },
        ],
      },
      chickens: {
        "0": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", id: "0" },
    });
    const savedMilliseconds = 1000 * 60 * 60 * 4;
    const createdAt = newDate - savedMilliseconds;
    expect(newState.chickens["0"].fedAt).toEqual(createdAt);
  });

  it("does not stack Fat Chicken boost when a user has more than one", () => {
    const state = {
      ...GAME_STATE,
      inventory: {
        Chicken: new Decimal(1),
        Wheat: new Decimal(1),
        ["Fat Chicken"]: new Decimal(5),
      },
      collectibles: {
        "Fat Chicken": [
          {
            id: "123",
            createdAt: dateNow,
            coordinates: { x: 1, y: 1 },
            // ready at < now
            readyAt: dateNow - 5 * 60 * 1000,
          },
        ],
      },
      chickens: {
        "0": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", id: "0" },
    });

    expect(newState.inventory.Wheat).toEqual(new Decimal(0.1));
  });

  it("increases max chickens to 15 when Chicken Coop is placed and ready", () => {
    const state = {
      ...GAME_STATE,
      bumpkin: INITIAL_BUMPKIN,
      inventory: {
        Chicken: new Decimal(15),
        "Chicken Coop": new Decimal(1),
        Wheat: new Decimal(1),
      },
      collectibles: {
        "Chicken Coop": [
          {
            id: "123",
            createdAt: dateNow,
            coordinates: { x: 1, y: 1 },
            // ready at < now
            readyAt: dateNow - 5 * 60 * 1000,
          },
        ],
      },
      chickens: {
        "1": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
        "2": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
        "3": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
        "4": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
        "5": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
        "6": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
        "7": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
        "8": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
        "9": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
        "10": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
        "11": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
        "12": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
        "13": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
        "14": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
        "15": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", id: "15" },
      createdAt: dateNow,
    });

    expect(newState.chickens["15"]).toBeTruthy();
  });

  it("requires wheat to feed a chicken when Gold Egg is placed but not ready", () => {
    jest.useRealTimers();
    const state = {
      ...GAME_STATE,
      bumpkin: INITIAL_BUMPKIN,
      inventory: {
        Chicken: new Decimal(1),
        Wheat: new Decimal(2),
        "Gold Egg": new Decimal(1),
      },
      collectibles: {
        "Gold Egg": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            id: "123",
            readyAt: dateNow + 60 * 60 * 1000,
          },
        ],
      },
      chickens: {
        "123": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", id: "123" },
      createdAt: dateNow,
    });

    expect(newState.inventory.Wheat).toEqual(new Decimal(1));
  });

  it("requires no wheat to feed a chicken when player has wheat and when Gold Egg is placed and ready", () => {
    jest.useRealTimers();
    const state = {
      ...GAME_STATE,
      bumpkin: INITIAL_BUMPKIN,
      inventory: {
        Chicken: new Decimal(1),
        Wheat: new Decimal(2),
        "Gold Egg": new Decimal(1),
      },
      collectibles: {
        "Gold Egg": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
      chickens: {
        "123": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", id: "123" },
      createdAt: dateNow,
    });

    expect(newState.inventory.Wheat).toEqual(new Decimal(2));
  });

  it("feeds a chicken when a player has no wheat but has the Gold Egg is placed and it's ready", () => {
    jest.useRealTimers();
    const state = {
      ...GAME_STATE,
      bumpkin: INITIAL_BUMPKIN,
      inventory: {
        Chicken: new Decimal(1),
        "Gold Egg": new Decimal(1),
      },
      collectibles: {
        "Gold Egg": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            id: "123",
            readyAt: 0,
          },
        ],
      },
      chickens: {
        "123": {
          multiplier: 1,
          coordinates: { x: 1, y: 1 },
          fedAt: 0,
        },
      },
    };

    const newState = feedChicken({
      state,
      action: { type: "chicken.fed", id: "123" },
      createdAt: dateNow,
    });

    const chicken = newState.chickens["123"];

    expect(chicken.fedAt).toEqual(dateNow);
  });
});
