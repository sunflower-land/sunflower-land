import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { mixPotion } from "./mixPotion";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";

describe("mixPotion", () => {
  const now = Date.now();
  const GAME_STATE: GameState = {
    ...TEST_FARM,
    potionHouse: {
      game: { status: "in_progress", attempts: [] },
      history: [],
    },
    bumpkin: INITIAL_BUMPKIN,
    balance: new Decimal(100),
  };

  it("sets the results of the first attempt", () => {
    const newState = mixPotion({
      state: GAME_STATE,
      action: {
        type: "potion.mixed",
        attemptNumber: 1,
        potions: ["Happy Hooch", "Happy Hooch", "Happy Hooch", "Happy Hooch"],
      },
    });

    expect(newState.potionHouse?.game.attempts).toEqual([
      [
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
      ],
    ]);
  });

  it("prevents the same row being attempted twice", () => {
    const firstState = mixPotion({
      state: GAME_STATE,
      action: {
        type: "potion.mixed",
        attemptNumber: 1,
        potions: ["Happy Hooch", "Happy Hooch", "Happy Hooch", "Happy Hooch"],
      },
    });

    expect(() =>
      mixPotion({
        state: firstState,
        action: {
          type: "potion.mixed",
          attemptNumber: 1,
          potions: ["Happy Hooch", "Happy Hooch", "Happy Hooch", "Happy Hooch"],
        },
      }),
    ).toThrowError("Attempt 1 has already been made");
  });

  it("prevents the second attempt being made before the first", () => {
    expect(() =>
      mixPotion({
        state: GAME_STATE,
        action: {
          type: "potion.mixed",
          attemptNumber: 2,
          potions: ["Happy Hooch", "Happy Hooch", "Happy Hooch", "Happy Hooch"],
        },
      }),
    ).toThrowError("Attempt 1 has not been made yet");
  });

  it("allows a second attempt to be made", () => {
    const firstState = mixPotion({
      state: GAME_STATE,
      action: {
        type: "potion.mixed",
        attemptNumber: 1,
        potions: ["Happy Hooch", "Happy Hooch", "Bloom Boost", "Happy Hooch"],
      },
    });

    const secondState = mixPotion({
      state: firstState,
      action: {
        type: "potion.mixed",
        attemptNumber: 2,
        potions: ["Happy Hooch", "Happy Hooch", "Bloom Boost", "Happy Hooch"],
      },
    });

    expect(secondState.potionHouse?.game.attempts).toEqual([
      [
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Bloom Boost", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
      ],
      [
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
        { potion: "Bloom Boost", status: "pending" },
        { potion: "Happy Hooch", status: "pending" },
      ],
    ]);
  });

  it("prevents a fourth attempt being made", () => {
    const firstState = mixPotion({
      state: GAME_STATE,
      action: {
        type: "potion.mixed",
        attemptNumber: 1,
        potions: ["Happy Hooch", "Happy Hooch", "Bloom Boost", "Happy Hooch"],
      },
    });

    const secondState = mixPotion({
      state: firstState,
      action: {
        type: "potion.mixed",
        attemptNumber: 2,
        potions: ["Happy Hooch", "Happy Hooch", "Bloom Boost", "Happy Hooch"],
      },
    });

    expect(() =>
      mixPotion({
        state: secondState,
        action: {
          type: "potion.mixed",
          attemptNumber: 4 as any,
          potions: ["Happy Hooch", "Happy Hooch", "Bloom Boost", "Happy Hooch"],
        },
      }),
    ).toThrowError("Attempt 3 is the last attempt");
  });

  it("prevents third guess on a finished game", () => {
    expect(() =>
      mixPotion({
        state: {
          ...GAME_STATE,
          potionHouse: {
            game: {
              status: "finished",
              attempts: [
                [
                  { potion: "Happy Hooch", status: "incorrect" },
                  { potion: "Happy Hooch", status: "incorrect" },
                  { potion: "Happy Hooch", status: "incorrect" },
                  { potion: "Happy Hooch", status: "incorrect" },
                ],
                [
                  { potion: "Happy Hooch", status: "incorrect" },
                  { potion: "Happy Hooch", status: "incorrect" },
                  { potion: "Happy Hooch", status: "incorrect" },
                  { potion: "Happy Hooch", status: "incorrect" },
                ],
              ],
            },
            history: {},
          },
        },
        action: {
          type: "potion.mixed",
          attemptNumber: 3,
          potions: ["Happy Hooch", "Happy Hooch", "Flower Power", "Dream Drip"],
        },
      }),
    ).toThrowError("Cannot mix potion on a finished game");
  });
});
