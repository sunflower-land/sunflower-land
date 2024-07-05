import { INITIAL_FARM } from "features/game/lib/constants";
import { claimFactionPrize } from "./claimFactionPrize";
import { Faction, GameState } from "features/game/types/game";
import Decimal from "decimal.js-light";

const FARM: GameState = {
  ...INITIAL_FARM,
  faction: {
    name: "bumpkins",
    pledgedAt: 10001000,
    points: 100,
    emblemsClaimedAt: 10000100,
    history: {
      "2024-06-24": {
        score: 100,
        petXP: 0,
        results: {
          rank: 1,
          reward: {
            sfl: 0,
            coins: 100,
            items: {},
          },
        },
      },
      "2024-06-17": {
        petXP: 0,
        score: 100,
        results: {
          rank: 1,
          claimedAt: 100002000,
          reward: {
            sfl: 0,
            coins: 100,
            items: {},
          },
        },
      },
    },
  },
};

describe("claimFactionPrize", () => {
  it("requires a prize exists for the week", () => {
    expect(() =>
      claimFactionPrize({
        action: {
          type: "faction.prizeClaimed",
          week: "2022-01-01",
        },
        state: FARM,
      }),
    ).toThrow("Prize not found for week 2022-01-01");
  });

  it("does not let you claim a prize twice", () => {
    expect(() =>
      claimFactionPrize({
        action: {
          type: "faction.prizeClaimed",
          week: "2024-06-17",
        },
        state: {
          ...FARM,
        },
      }),
    ).toThrow("Prize already claimed");
  });

  it("claims a coin prize", () => {
    const state = claimFactionPrize({
      action: {
        type: "faction.prizeClaimed",
        week: "2024-06-24",
      },
      state: {
        ...FARM,
        coins: 30,
        faction: {
          ...(FARM.faction as Faction),
          history: {
            "2024-06-24": {
              petXP: 0,
              score: 200,
              results: {
                rank: 12,
                reward: {
                  coins: 200,
                  sfl: 0,
                  items: {},
                },
              },
            },
          },
        },
      },
    });

    expect(state.coins).toEqual(230);
  });
  it("claims item prize", () => {
    const state = claimFactionPrize({
      action: {
        type: "faction.prizeClaimed",
        week: "2024-06-24",
      },
      state: {
        ...FARM,
        inventory: {
          Mark: new Decimal(5),
          Sunflower: new Decimal(6),
        },
        faction: {
          ...(FARM.faction as Faction),
          history: {
            "2024-06-24": {
              petXP: 0,
              score: 200,
              results: {
                rank: 12,
                reward: {
                  coins: 0,
                  sfl: 0,
                  items: { Mark: 10 },
                },
              },
            },
          },
        },
      },
    });

    expect(state.inventory).toEqual({
      Mark: new Decimal(15),
      Sunflower: new Decimal(6),
    });
  });

  it("claims sfl prize", () => {
    const state = claimFactionPrize({
      action: {
        type: "faction.prizeClaimed",
        week: "2024-06-24",
      },
      state: {
        ...FARM,
        balance: new Decimal(100),
        faction: {
          ...(FARM.faction as Faction),
          history: {
            "2024-06-24": {
              petXP: 0,
              score: 200,
              results: {
                rank: 12,
                reward: {
                  coins: 0,
                  sfl: 18,
                  items: {},
                },
              },
            },
          },
        },
      },
    });

    expect(state.balance).toEqual(new Decimal(118));
  });

  it("stores claimed at", () => {
    const now = Date.now();
    const state = claimFactionPrize({
      action: {
        type: "faction.prizeClaimed",
        week: "2024-06-24",
      },
      state: {
        ...FARM,
      },
      createdAt: now,
    });

    expect(state.faction?.history?.["2024-06-24"]?.results?.claimedAt).toBe(
      now,
    );
  });
});
