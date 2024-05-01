import { Faction, GameState } from "features/game/types/game";
import { donateToFaction } from "./donateToFaction";
import { TEST_FARM } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { getDayOfYear } from "lib/utils/time";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  faction: {
    name: "sunflorians",
    pledgedAt: 0,
    points: 0,
    donated: {
      daily: {
        sfl: {},
        resources: {},
      },
      totalItems: {},
    },
  },
};

describe("donateToFaction", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it("throws an error if the player is not a part of the faction they are donating to", () => {
    expect(() =>
      donateToFaction({
        state: {
          ...GAME_STATE,
          faction: {
            name: "bumpkins",
            pledgedAt: 0,
            points: 0,
            donated: {
              daily: {
                sfl: {},
                resources: {},
              },
              totalItems: {},
            },
          },
          dailyFactionDonationRequest: {
            resource: "Apple",
            amount: new Decimal(40),
          },
        },
        action: {
          type: "faction.donated",
          faction: "sunflorians",
          donation: {
            resources: 40,
          },
        },
      })
    ).toThrow("You are not a member of the this faction");
  });

  it("throws an error if there is no requested donation for the faction", () => {
    expect(() =>
      donateToFaction({
        state: GAME_STATE,
        action: {
          type: "faction.donated",
          faction: "sunflorians",
          donation: {
            resources: 40,
          },
        },
      })
    ).toThrow("No donation request found for the faction");
  });

  it("throws an error if the player doesn't have enough resources to donate", () => {
    expect(() =>
      donateToFaction({
        state: {
          ...GAME_STATE,
          inventory: {
            Sunflower: new Decimal(1),
          },
          dailyFactionDonationRequest: {
            resource: "Apple",
            amount: new Decimal(40),
          },
        },
        action: {
          type: "faction.donated",
          faction: "sunflorians",
          donation: {
            resources: 10,
          },
        },
      })
    ).toThrow("You do not have enough resources to donate");
  });

  it("throws an error if no donation amount is provided", () => {
    expect(() =>
      donateToFaction({
        state: {
          ...GAME_STATE,
          dailyFactionDonationRequest: {
            resource: "Apple",
            amount: new Decimal(40),
          },
        },
        action: {
          type: "faction.donated",
          faction: "sunflorians",
          donation: {},
        },
      })
    ).toThrow("Invalid donation");
  });

  it("throws an error if the sfl amount is not a multiple of 10", () => {
    expect(() =>
      donateToFaction({
        state: {
          ...GAME_STATE,
          dailyFactionDonationRequest: {
            resource: "Apple",
            amount: new Decimal(40),
          },
        },
        action: {
          type: "faction.donated",
          faction: "sunflorians",
          donation: {
            sfl: 1,
          },
        },
      })
    ).toThrow("SFL donation amount must be a multiple of 10");
  });

  it("throws an error if the player doesn't have enough SFL to donate", () => {
    expect(() =>
      donateToFaction({
        state: {
          ...GAME_STATE,
          balance: new Decimal(5),
          dailyFactionDonationRequest: {
            resource: "Apple",
            amount: new Decimal(40),
          },
        },
        action: {
          type: "faction.donated",
          faction: "sunflorians",
          donation: {
            sfl: 10,
          },
        },
      })
    ).toThrow("You do not have enough SFL to donate");
  });

  it("throws an error if the player has reached the daily SFL donation limit", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-02"));
    const today = getDayOfYear(new Date("2024-05-02"));

    expect(() =>
      donateToFaction({
        state: {
          ...GAME_STATE,
          balance: new Decimal(100),
          faction: {
            ...(GAME_STATE.faction as Faction),
            donated: {
              daily: {
                sfl: {
                  day: today,
                  amount: 480,
                },
                resources: {},
              },
              totalItems: {},
            },
          },
          dailyFactionDonationRequest: {
            resource: "Apple",
            amount: new Decimal(40),
          },
        },
        action: {
          type: "faction.donated",
          faction: "sunflorians",
          donation: {
            sfl: 60,
          },
        },
      })
    ).toThrow("You have reached the daily donation limit");
  });

  it("donates SFL when no SFL has been donated today", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-02"));
    const today = getDayOfYear(new Date("2024-05-02"));

    const state = donateToFaction({
      state: {
        ...GAME_STATE,
        balance: new Decimal(100),
        dailyFactionDonationRequest: {
          resource: "Apple",
          amount: new Decimal(40),
        },
      },
      action: {
        type: "faction.donated",
        faction: "sunflorians",
        donation: {
          sfl: 10,
        },
      },
    });

    expect(state.balance.toNumber()).toBe(90);
    expect(state.faction?.donated?.daily.sfl).toEqual({
      day: today,
      amount: 10,
    });
    expect(state.faction?.donated.totalItems.sfl).toBe(10);
  });

  it("donates SFL when SFL has already been donated today", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-02"));
    const today = getDayOfYear(new Date("2024-05-02"));

    const state = donateToFaction({
      state: {
        ...GAME_STATE,
        balance: new Decimal(100),
        dailyFactionDonationRequest: {
          resource: "Apple",
          amount: new Decimal(40),
        },
        faction: {
          ...(GAME_STATE.faction as Faction),
          donated: {
            daily: {
              sfl: {
                day: today,
                amount: 40,
              },
              resources: {},
            },
            totalItems: {
              sfl: 40,
            },
          },
        },
      },
      action: {
        type: "faction.donated",
        faction: "sunflorians",
        donation: {
          sfl: 20,
        },
      },
    });

    expect(state.balance.toNumber()).toBe(80);
    expect(state.faction?.donated?.daily.sfl).toEqual({
      day: today,
      amount: 60,
    });
    expect(state.faction?.donated.totalItems.sfl).toBe(60);
  });

  it("donates SFL and awards 20 points for 10 SFL donated", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-02"));

    const state = donateToFaction({
      state: {
        ...GAME_STATE,
        balance: new Decimal(100),
        dailyFactionDonationRequest: {
          resource: "Apple",
          amount: new Decimal(40),
        },
      },
      action: {
        type: "faction.donated",
        faction: "sunflorians",
        donation: {
          sfl: 10,
        },
      },
    });

    expect(state.faction?.points).toBe(20);
  });

  it("donates SFL and awards 40 points for 20 SFL donated", () => {
    const state = donateToFaction({
      state: {
        ...GAME_STATE,
        balance: new Decimal(100),
        dailyFactionDonationRequest: {
          resource: "Apple",
          amount: new Decimal(40),
        },
      },
      action: {
        type: "faction.donated",
        faction: "sunflorians",
        donation: {
          sfl: 20,
        },
      },
    });

    expect(state.faction?.points).toBe(40);
  });

  it("increments the total sfl donated", () => {
    const state = donateToFaction({
      state: {
        ...GAME_STATE,
        dailyFactionDonationRequest: {
          resource: "Apple",
          amount: new Decimal(40),
        },
        balance: new Decimal(100),
        faction: {
          ...(GAME_STATE.faction as Faction),
          donated: {
            daily: {
              sfl: {
                day: 123,
                amount: 10,
              },
              resources: {},
            },
            totalItems: {
              sfl: 100,
            },
          },
        },
      },
      action: {
        type: "faction.donated",
        faction: "sunflorians",
        donation: {
          sfl: 20,
        },
      },
    });

    expect(state.faction?.donated.totalItems.sfl).toBe(120);
  });

  it("donates resources", () => {
    const state = donateToFaction({
      state: {
        ...GAME_STATE,
        inventory: {
          Apple: new Decimal(40),
        },
        dailyFactionDonationRequest: {
          resource: "Apple",
          amount: new Decimal(40),
        },
      },
      action: {
        type: "faction.donated",
        faction: "sunflorians",
        donation: {
          resources: 40,
        },
      },
    });

    expect((state.inventory.Apple ?? new Decimal(0)).toNumber()).toBe(0);
  });

  it("can handle multiple bundles of the requested amount of resources", () => {
    const state = donateToFaction({
      state: {
        ...GAME_STATE,
        inventory: {
          Apple: new Decimal(40),
        },
        dailyFactionDonationRequest: {
          resource: "Apple",
          amount: new Decimal(40),
        },
      },
      action: {
        type: "faction.donated",
        faction: "sunflorians",
        donation: {
          resources: 40,
        },
      },
    });

    expect((state.inventory.Apple ?? new Decimal(0)).toNumber()).toBe(0);
  });

  it("adds the donated resources to the daily record", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-05-02"));
    const today = getDayOfYear(new Date("2024-05-02"));

    const state = donateToFaction({
      state: {
        ...GAME_STATE,
        inventory: {
          Apple: new Decimal(40),
        },
        dailyFactionDonationRequest: {
          resource: "Apple",
          amount: new Decimal(40),
        },
      },
      action: {
        type: "faction.donated",
        faction: "sunflorians",
        donation: {
          resources: 40,
        },
      },
    });

    expect(state.faction?.donated?.daily.resources).toEqual({
      day: today,
      amount: 40,
    });
  });

  it("increments the total items donated", () => {
    const state = donateToFaction({
      state: {
        ...GAME_STATE,
        inventory: {
          Apple: new Decimal(40),
        },
        dailyFactionDonationRequest: {
          resource: "Apple",
          amount: new Decimal(40),
        },
      },
      action: {
        type: "faction.donated",
        faction: "sunflorians",
        donation: {
          resources: 40,
        },
      },
    });

    expect(state.faction?.donated?.totalItems).toEqual({
      Apple: 40,
    });
  });

  it("awards 5 points for a resource donation", () => {
    const state = donateToFaction({
      state: {
        ...GAME_STATE,
        inventory: {
          Apple: new Decimal(40),
        },
        dailyFactionDonationRequest: {
          resource: "Apple",
          amount: new Decimal(40),
        },
      },
      action: {
        type: "faction.donated",
        faction: "sunflorians",
        donation: {
          resources: 40,
        },
      },
    });

    expect(state.faction?.points).toBe(5);
  });

  it("increments faction points by 5 for each resource donated", () => {
    const state = donateToFaction({
      state: {
        ...GAME_STATE,
        faction: {
          ...(GAME_STATE.faction as Faction),
          points: 20,
        },
        inventory: {
          Apple: new Decimal(40),
        },
        dailyFactionDonationRequest: {
          resource: "Apple",
          amount: new Decimal(40),
        },
      },
      action: {
        type: "faction.donated",
        faction: "sunflorians",
        donation: {
          resources: 40,
        },
      },
    });

    expect(state.faction?.points).toBe(25);
  });

  it("throws an error if the player tries to donate more bulk resources than they have", () => {
    expect(() =>
      donateToFaction({
        state: {
          ...GAME_STATE,
          inventory: {
            Apple: new Decimal(40),
          },
          dailyFactionDonationRequest: {
            resource: "Apple",
            amount: new Decimal(40),
          },
        },
        action: {
          type: "faction.donated",
          faction: "sunflorians",
          donation: {
            resources: 80,
          },
        },
      })
    ).toThrow("You do not have enough resources to donate");
  });

  it("donates multiple bulk amounts of requested item", () => {
    const state = donateToFaction({
      state: {
        ...GAME_STATE,
        inventory: {
          Apple: new Decimal(120),
        },
        dailyFactionDonationRequest: {
          resource: "Apple",
          amount: new Decimal(40),
        },
      },
      action: {
        type: "faction.donated",
        faction: "sunflorians",
        donation: {
          resources: 120,
        },
      },
    });

    expect(state.faction?.points).toBe(15);
  });
});
