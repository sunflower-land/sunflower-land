import Decimal from "decimal.js-light";
import { leaveFaction } from "./leaveFaction";
import { TEST_FARM } from "features/game/lib/constants";

const INITIAL_FARM = TEST_FARM;

describe("leaveFaction", () => {
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
});
