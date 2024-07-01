import { TEST_FARM } from "features/game/lib/constants";
import { claimMinigamePrize } from "./claimMinigamePrize";
import Decimal from "decimal.js-light";

describe("minigame.prizeClaimed", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-01"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("requires minigame exists", () => {
    expect(() =>
      claimMinigamePrize({
        state: TEST_FARM,
        action: {
          id: "not-a-game" as any,
          type: "minigame.prizeClaimed",
        },
      }),
    ).toThrow("not-a-game is not a valid minigame");
  });

  it("requires a prize exists", () => {
    expect(() =>
      claimMinigamePrize({
        state: TEST_FARM,
        action: {
          id: "chicken-rescue",
          type: "minigame.prizeClaimed",
        },
      }),
    ).toThrow("No prize found for chicken-rescue");
  });

  it("requires the prize is within the timeframe", () => {
    expect(() =>
      claimMinigamePrize({
        state: {
          ...TEST_FARM,
          minigames: {
            games: {},
            prizes: {
              "chicken-rescue": {
                coins: 100,
                startAt: Date.now() + 100,
                endAt: Date.now() + 1000,
                score: 10,
                items: {},
                wearables: {},
              },
            },
          },
        },
        action: {
          id: "chicken-rescue",
          type: "minigame.prizeClaimed",
        },
      }),
    ).toThrow("Prize is no longer available");
  });

  it("requires a player has played the minigame", () => {
    expect(() =>
      claimMinigamePrize({
        state: {
          ...TEST_FARM,
          minigames: {
            games: {},
            prizes: {
              "chicken-rescue": {
                coins: 100,
                startAt: Date.now() - 100,
                endAt: Date.now() + 1000,

                score: 10,
                items: {},
                wearables: {},
              },
            },
          },
        },
        action: {
          id: "chicken-rescue",
          type: "minigame.prizeClaimed",
        },
      }),
    ).toThrow("No history found for chicken-rescue");
  });

  it("requires a user has reached the required score", () => {
    const date = new Date("2024-05-05T00:00:00");
    expect(() =>
      claimMinigamePrize({
        state: {
          ...TEST_FARM,
          minigames: {
            games: {
              "chicken-rescue": {
                highscore: 10,
                history: {
                  [date.toISOString().substring(0, 10)]: {
                    attempts: 2,
                    highscore: 10,
                  },
                },
              },
            },
            prizes: {
              "chicken-rescue": {
                coins: 100,
                startAt: date.getTime() - 100,
                endAt: date.getTime() + 1000,
                items: {},
                wearables: {},
                score: 20,
              },
            },
          },
        },
        action: {
          id: "chicken-rescue",
          type: "minigame.prizeClaimed",
        },
        createdAt: date.getTime(),
      }),
    ).toThrow("Score 10 is less than 20");
  });

  it("requires a prize is not already claimed", () => {
    const date = new Date("2024-05-05T00:00:00");
    expect(() =>
      claimMinigamePrize({
        state: {
          ...TEST_FARM,
          minigames: {
            games: {
              "chicken-rescue": {
                highscore: 30,
                history: {
                  [date.toISOString().substring(0, 10)]: {
                    prizeClaimedAt: date.getTime(),
                    attempts: 2,
                    highscore: 30,
                  },
                },
              },
            },
            prizes: {
              "chicken-rescue": {
                coins: 100,
                startAt: date.getTime() - 100,
                endAt: date.getTime() + 1000,
                items: {},
                wearables: {},
                score: 20,
              },
            },
          },
        },
        action: {
          id: "chicken-rescue",
          type: "minigame.prizeClaimed",
        },
        createdAt: date.getTime(),
      }),
    ).toThrow("Already claimed chicken-rescue prize");
  });

  it("claims an item prize", () => {
    const date = new Date("2024-05-05T00:00:00");
    const state = claimMinigamePrize({
      state: {
        ...TEST_FARM,
        inventory: {
          Mark: new Decimal(10),
        },
        faction: {
          name: "bumpkins",
          pledgedAt: 10002000,
          points: 0,
          donated: {
            daily: {
              resources: {},
              sfl: {
                amount: 0,
                day: 0,
              },
            },
            totalItems: {},
          },
          history: {},
        },
        minigames: {
          games: {
            "chicken-rescue": {
              highscore: 30,
              history: {
                [date.toISOString().substring(0, 10)]: {
                  attempts: 2,
                  highscore: 30,
                },
              },
            },
          },
          prizes: {
            "chicken-rescue": {
              coins: 100,
              startAt: date.getTime() - 100,
              endAt: date.getTime() + 1000,
              items: {
                Mark: 20,
              },
              wearables: {},
              score: 20,
            },
          },
        },
      },
      action: {
        id: "chicken-rescue",
        type: "minigame.prizeClaimed",
      },
      createdAt: date.getTime(),
    });

    expect(state.coins).toEqual(100);
    expect(state.inventory["Mark"]?.toNumber()).toEqual(30);

    expect(
      state.minigames.games["chicken-rescue"]?.history?.[
        date.toISOString().substring(0, 10)
      ].prizeClaimedAt,
    ).toEqual(date.getTime());
  });

  it("claims a coin prize", () => {
    const date = new Date("2024-05-05T00:00:00");
    const state = claimMinigamePrize({
      state: {
        ...TEST_FARM,
        inventory: {
          Mark: new Decimal(10),
        },
        minigames: {
          games: {
            "chicken-rescue": {
              highscore: 30,
              history: {
                [date.toISOString().substring(0, 10)]: {
                  attempts: 2,
                  highscore: 30,
                },
              },
            },
          },
          prizes: {
            "chicken-rescue": {
              coins: 100,
              startAt: date.getTime() - 100,
              endAt: date.getTime() + 1000,
              items: {},
              wearables: {},
              score: 20,
            },
          },
        },
      },
      action: {
        id: "chicken-rescue",
        type: "minigame.prizeClaimed",
      },
      createdAt: date.getTime(),
    });

    expect(state.coins).toEqual(100);

    expect(
      state.minigames.games["chicken-rescue"]?.history?.[
        date.toISOString().substring(0, 10)
      ].prizeClaimedAt,
    ).toEqual(date.getTime());
  });

  it("claims a wearable prize", () => {
    const date = new Date("2024-05-05T00:00:00");
    const state = claimMinigamePrize({
      state: {
        ...TEST_FARM,
        inventory: {
          Mark: new Decimal(10),
        },
        wardrobe: {
          "Red Farmer Shirt": 2,
          "Blue Farmer Shirt": 1,
        },
        minigames: {
          games: {
            "chicken-rescue": {
              highscore: 30,
              history: {
                [date.toISOString().substring(0, 10)]: {
                  attempts: 2,
                  highscore: 30,
                },
              },
            },
          },
          prizes: {
            "chicken-rescue": {
              coins: 0,
              startAt: date.getTime() - 100,
              endAt: date.getTime() + 1000,
              items: {},
              wearables: {
                "Red Farmer Shirt": 1,
              },
              score: 20,
            },
          },
        },
      },
      action: {
        id: "chicken-rescue",
        type: "minigame.prizeClaimed",
      },
      createdAt: date.getTime(),
    });

    expect(state.wardrobe).toEqual({
      "Red Farmer Shirt": 3,
      "Blue Farmer Shirt": 1,
    });

    expect(
      state.minigames.games["chicken-rescue"]?.history?.[
        date.toISOString().substring(0, 10)
      ].prizeClaimedAt,
    ).toEqual(date.getTime());
  });
});
