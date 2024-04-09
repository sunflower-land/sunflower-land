import { TEST_FARM } from "features/game/lib/constants";
import { GAME_FEE, startPotion } from "./startPotion";

describe("startPotion", () => {
  const GAME_STATE = {
    ...TEST_FARM,
    coins: 1000,
  };

  it("starts the first game", () => {
    const newState = startPotion({
      state: GAME_STATE,
      action: {
        type: "potion.started",
      },
    });

    expect(newState.potionHouse?.game.status).toEqual("in_progress");
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
            },
            history: [],
          },
        },
        action: {
          type: "potion.started",
        },
      })
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
        },
      })
    ).toThrow("Insufficient coins to start a game");
  });

  it("deducts the game fee", () => {
    const newState = startPotion({
      state: { ...GAME_STATE },
      action: {
        type: "potion.started",
      },
    });

    expect(newState.coins).toEqual(GAME_STATE.coins - GAME_FEE);
  });

  it("increments the coins spent activity", () => {
    const newState = startPotion({
      state: { ...GAME_STATE },
      action: {
        type: "potion.started",
      },
    });

    expect(newState.coins).toEqual(GAME_STATE.coins - GAME_FEE);
    expect(newState.bumpkin?.activity?.["Coins Spent"]).toEqual(GAME_FEE);
  });
});
