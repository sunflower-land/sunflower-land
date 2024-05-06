import { TEST_FARM } from "features/game/lib/constants";
import { pledgeFaction } from "./pledgeFaction";
import { FactionName } from "features/game/types/game";
import Decimal from "decimal.js-light";

describe("pledgeFaction", () => {
  it("throws an error if the faction is invalid", () => {
    expect(() =>
      pledgeFaction({
        state: TEST_FARM,
        action: {
          type: "faction.pledged",
          faction: "invalid" as FactionName,
        },
      })
    ).toThrow("Invalid faction");
  });

  it("throws an error the player already pledged a faction", () => {
    expect(() =>
      pledgeFaction({
        state: {
          ...TEST_FARM,
          faction: {
            name: "bumpkins",
            pledgedAt: Date.now() - 1000,
            points: 0,
            donated: {
              daily: {
                resources: {},
                sfl: {},
              },
              totalItems: {},
            },
          },
        },
        action: {
          type: "faction.pledged",
          faction: "sunflorians",
        },
      })
    ).toThrow("You already pledged a faction");
  });

  it("pledges a faction", () => {
    const state = pledgeFaction({
      state: TEST_FARM,
      action: {
        type: "faction.pledged",
        faction: "sunflorians",
      },
    });

    expect(state.faction).toBeDefined();
    expect(state.faction?.name).toBe("sunflorians");
    expect(state.faction?.pledgedAt).toBeGreaterThan(0);
    expect(state.faction?.points).toEqual(0);
    expect(state.faction?.donated).toBeDefined();
    expect(state.faction?.donated.daily).toBeDefined();
    expect(state.faction?.donated.daily.resources).toBeDefined();
    expect(state.faction?.donated.daily.sfl).toBeDefined();
    expect(state.faction?.donated.totalItems).toBeDefined();
  });

  it("adds the faction banner to the players inventory", () => {
    const state = pledgeFaction({
      state: TEST_FARM,
      action: {
        type: "faction.pledged",
        faction: "sunflorians",
      },
    });

    expect(state.inventory["Sunflorian Faction Banner"]).toEqual(
      new Decimal(1)
    );
  });
});
