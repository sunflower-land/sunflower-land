import { TEST_FARM } from "features/game/lib/constants";
import { FactionName } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { joinFaction } from "./joinFaction";

describe("joinFaction", () => {
  it("throws an error if the faction is invalid", () => {
    expect(() =>
      joinFaction({
        state: TEST_FARM,
        action: {
          type: "faction.joined",
          faction: "invalid" as FactionName,
        },
      })
    ).toThrow("Invalid faction");
  });

  it("throws an error the player already joined a faction", () => {
    expect(() =>
      joinFaction({
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
          type: "faction.joined",
          faction: "sunflorians",
        },
      })
    ).toThrow("You already pledged a faction");
  });

  it("joins a faction", () => {
    const state = joinFaction({
      state: TEST_FARM,
      action: {
        type: "faction.joined",
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
    const state = joinFaction({
      state: TEST_FARM,
      action: {
        type: "faction.joined",
        faction: "sunflorians",
      },
    });

    expect(state.inventory["Sunflorian Faction Banner"]).toEqual(
      new Decimal(1)
    );
  });

  it("deducts 10 SFL from the players inventory", () => {
    const state = joinFaction({
      state: {
        ...TEST_FARM,
        balance: new Decimal(100),
        inventory: {
          ...TEST_FARM.inventory,
        },
      },
      action: {
        type: "faction.joined",
        faction: "sunflorians",
      },
    });

    expect(state.balance).toEqual(new Decimal(90));
  });

  it("adds 5 Emblems to the players inventory", () => {
    const state = joinFaction({
      state: TEST_FARM,
      action: {
        type: "faction.joined",
        faction: "sunflorians",
      },
    });

    expect(state.inventory["Sunflorian Emblem"]).toEqual(new Decimal(5));
  });
});
