import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { startPotion } from "./startPotion";

describe("startPotion", () => {
  const GAME_STATE = {
    ...TEST_FARM,
    balance: new Decimal(100),
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
          balance: new Decimal(0),
        },
        action: {
          type: "potion.started",
        },
      })
    ).toThrow("Insufficient funds to start a game");
  });

  it("deducts the game fee", () => {
    const newState = startPotion({
      state: { ...GAME_STATE, balance: new Decimal(100) },
      action: {
        type: "potion.started",
      },
    });

    expect(newState.balance).toEqual(new Decimal(99));
  });
});
