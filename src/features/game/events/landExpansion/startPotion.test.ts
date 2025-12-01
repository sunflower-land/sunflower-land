import { TEST_FARM } from "features/game/lib/constants";
import { GAME_FEE, startPotion } from "./startPotion";

describe("startPotion", () => {
  const GAME_STATE = {
    ...TEST_FARM,
    coins: 10000,
  };

  it("starts the first game", () => {
    const newState = startPotion({
      state: GAME_STATE,
      action: {
        type: "potion.started",
        multiplier: 1,
      },
    });

    expect(newState.potionHouse?.game.status).toEqual("in_progress");
  });

  it("stores the multiplier in the game state", () => {
    const newState = startPotion({
      state: GAME_STATE,
      action: {
        type: "potion.started",
        multiplier: 10,
      },
    });

    expect(newState.potionHouse?.game.multiplier).toEqual(10);
  });

  it("deducts the correct fee based on multiplier", () => {
    const coins = 100000;
    const newState = startPotion({
      state: { ...GAME_STATE, coins },
      action: {
        type: "potion.started",
        multiplier: 50,
      },
    });

    expect(newState.coins).toEqual(coins - GAME_FEE * 50);
  });

  it("throws if there is already a game in progress", () => {
    expect(() =>
      startPotion({
        state: {
          ...GAME_STATE,
          potionHouse: {
            game: {
              status: "in_progress",
              attempts: [],
              multiplier: 1,
            },
            history: [],
          },
        },
        action: {
          type: "potion.started",
          multiplier: 1,
        },
      }),
    ).toThrow("There is already a game in progress");
  });

  it("throws an error if the player cannot afford the game fee", () => {
    expect(() =>
      startPotion({
        state: {
          ...GAME_STATE,
          coins: 0,
        },
        action: {
          type: "potion.started",
          multiplier: 1,
        },
      }),
    ).toThrow("Insufficient coins to start a game");
  });

  it("throws an error if the player cannot afford the multiplied game fee", () => {
    expect(() =>
      startPotion({
        state: {
          ...GAME_STATE,
          coins: 1000, // Enough for 1x but not 10x
        },
        action: {
          type: "potion.started",
          multiplier: 10,
        },
      }),
    ).toThrow("Insufficient coins to start a game");
  });

  it("deducts the game fee", () => {
    const newState = startPotion({
      state: { ...GAME_STATE },
      action: {
        type: "potion.started",
        multiplier: 1,
      },
    });

    expect(newState.coins).toEqual(GAME_STATE.coins - GAME_FEE);
  });

  it("increments the coins spent activity", () => {
    const newState = startPotion({
      state: { ...GAME_STATE },
      action: {
        type: "potion.started",
        multiplier: 1,
      },
    });

    expect(newState.coins).toEqual(GAME_STATE.coins - GAME_FEE);
    expect(newState.farmActivity["Coins Spent"]).toEqual(GAME_FEE);
  });

  it("increments the coins spent activity with correct multiplied amount", () => {
    const multiplier = 50;
    const coins = 100000;
    const newState = startPotion({
      state: { ...GAME_STATE, coins },
      action: {
        type: "potion.started",
        multiplier,
      },
    });

    expect(newState.coins).toEqual(coins - GAME_FEE * multiplier);
    expect(newState.farmActivity["Coins Spent"]).toEqual(GAME_FEE * multiplier);
  });
});
