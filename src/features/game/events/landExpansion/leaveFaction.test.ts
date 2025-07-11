import Decimal from "decimal.js-light";
import { leaveFaction } from "./leaveFaction";
import { TEST_FARM } from "features/game/lib/constants";
import { joinFaction } from "./joinFaction";

const INITIAL_FARM = TEST_FARM;

describe("leaveFaction", () => {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  it("throws an error if the player is not in a faction", () => {
    expect(() =>
      leaveFaction({
        state: {
          ...INITIAL_FARM,
        },
        action: {
          type: "faction.left",
        },
      }),
    ).toThrow("You are not in a faction");
  });

  it("throws an error if the player still has emblems", () => {
    expect(() =>
      leaveFaction({
        state: {
          ...INITIAL_FARM,
          faction: {
            name: "goblins",
            history: {},
            pledgedAt: 100000,
          },
          inventory: {
            "Goblin Emblem": new Decimal(5),
          },
        },
        action: {
          type: "faction.left",
        },
      }),
    ).toThrow("Cannot leave a faction with emblems");
  });
  it("throws an error if the player is new to faction", () => {
    const now = Date.now();
    expect(() =>
      leaveFaction({
        state: {
          ...INITIAL_FARM,
          faction: {
            name: "goblins",
            history: {},
            pledgedAt: now - 1000,
          },
        },
        action: {
          type: "faction.left",
        },
        createdAt: now,
      }),
    ).toThrow("Cannot leave a newly joined faction");
  });

  it("leaves a faction", () => {
    const state = leaveFaction({
      state: {
        ...INITIAL_FARM,
        faction: {
          name: "goblins",
          history: {},
          pledgedAt: 1200100,
        },
      },
      action: {
        type: "faction.left",
      },
    });

    expect(state.faction).toBeUndefined();
  });
  it("removes any marks from the players inventory", () => {
    const state = leaveFaction({
      state: {
        ...INITIAL_FARM,
        faction: {
          name: "goblins",
          history: {},
          pledgedAt: 1200100,
        },
        inventory: {
          Mark: new Decimal(1000),
        },
      },
      action: {
        type: "faction.left",
      },
    });

    expect(state.inventory.Mark).toBeUndefined();
  });

  it("removes the banner", () => {
    const state = leaveFaction({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Goblin Faction Banner": new Decimal(1),
        },
        faction: {
          name: "goblins",
          history: {},
          pledgedAt: 1200100,
        },
      },
      action: {
        type: "faction.left",
      },
    });

    expect(state.inventory["Goblin Faction Banner"]).toBeUndefined();
  });

  it("throws error when trying to leave faction before 24 hours", () => {
    const now = Date.now();

    let state = joinFaction({
      state: { ...TEST_FARM, balance: new Decimal(20) },
      action: {
        type: "faction.joined",
        faction: "bumpkins",
        sfl: 10,
      },
      createdAt: now,
    });

    expect(() =>
      leaveFaction({
        state,
        action: { type: "faction.left" },
        createdAt: now + TWENTY_FOUR_HOURS - 1000,
      }),
    ).toThrow("Cannot leave a newly joined faction");

    state = leaveFaction({
      state,
      action: { type: "faction.left" },
      createdAt: now + TWENTY_FOUR_HOURS + 1000,
    });

    expect(state.previousFaction?.leftAt).toBe(now + TWENTY_FOUR_HOURS + 1000);
  });
});
