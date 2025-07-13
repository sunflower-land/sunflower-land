import { TEST_FARM } from "features/game/lib/constants";
import { FactionName } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { FACTION_BOOST_COOLDOWN, joinFaction } from "./joinFaction";
import { leaveFaction } from "./leaveFaction";

describe("joinFaction", () => {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  it("throws an error if the faction is invalid", () => {
    expect(() =>
      joinFaction({
        state: TEST_FARM,
        action: {
          type: "faction.joined",
          faction: "invalid" as FactionName,
          sfl: 10,
        },
      }),
    ).toThrow("Invalid faction");
  });

  it("throws an error the player already joined a faction", () => {
    expect(() =>
      joinFaction({
        state: {
          ...TEST_FARM,
          balance: new Decimal(20),
          faction: {
            name: "bumpkins",
            pledgedAt: Date.now() - 1000,
            points: 0,
            history: {},
          },
        },
        action: {
          type: "faction.joined",
          faction: "sunflorians",
          sfl: 10,
        },
      }),
    ).toThrow("You already pledged a faction");
  });

  it("joins a faction", () => {
    const state = joinFaction({
      state: { ...TEST_FARM, balance: new Decimal(20) },
      action: {
        type: "faction.joined",
        faction: "sunflorians",
        sfl: 10,
      },
    });

    expect(state.faction).toBeDefined();
    expect(state.faction?.name).toBe("sunflorians");
    expect(state.faction?.pledgedAt).toBeGreaterThan(0);
    expect(state.faction?.points).toEqual(0);
  });

  it("adds the faction banner to the players inventory", () => {
    const state = joinFaction({
      state: { ...TEST_FARM, balance: new Decimal(20) },
      action: {
        type: "faction.joined",
        faction: "sunflorians",
        sfl: 10,
      },
    });

    expect(state.inventory["Sunflorian Faction Banner"]).toEqual(
      new Decimal(1),
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
        sfl: 10,
      },
    });

    expect(state.balance).toEqual(new Decimal(90));
  });

  it("throws an error if the player doesn't have enough SFL", () => {
    expect(() =>
      joinFaction({
        state: {
          ...TEST_FARM,
          balance: new Decimal(0),
        },
        action: {
          type: "faction.joined",
          faction: "sunflorians",
          sfl: 10,
        },
      }),
    ).toThrow("Not enough SFL");
  });

  it("does not set boostCooldownUntil when joining a faction for the first time", () => {
    const now = Date.now();
    const state = joinFaction({
      state: { ...TEST_FARM, balance: new Decimal(20) },
      action: {
        type: "faction.joined",
        faction: "sunflorians",
        sfl: 10,
      },
      createdAt: now,
    });
    expect(state.faction?.boostCooldownUntil).toBeUndefined();
  });

  it("sets boostCooldownUntil when switching factions", () => {
    const now = Date.now();
    let state = leaveFaction({
      state: {
        ...TEST_FARM,
        balance: new Decimal(20),
        faction: {
          name: "bumpkins",
          pledgedAt: now - TWENTY_FOUR_HOURS - 1000,
          points: 0,
          history: {},
        },
      },
      action: {
        type: "faction.left",
      },
      createdAt: now,
    });

    state = joinFaction({
      state,
      action: {
        type: "faction.joined",
        faction: "sunflorians",
        sfl: 10,
      },
    });

    expect(state.faction?.boostCooldownUntil).toBeGreaterThanOrEqual(
      now + FACTION_BOOST_COOLDOWN - 1000,
    );
    expect(state.faction?.boostCooldownUntil).toBeLessThanOrEqual(
      now + FACTION_BOOST_COOLDOWN + 1000,
    );
  });

  it("sets boostCooldownUntil to 2 weeks in the future and disables boost during cooldown", () => {
    const now = Date.now();
    const state = joinFaction({
      state: {
        ...TEST_FARM,
        balance: new Decimal(20),
        previousFaction: {
          name: "bumpkins",
          leftAt: now,
        },
      },
      action: {
        type: "faction.joined",
        faction: "sunflorians",
        sfl: 10,
      },
      createdAt: now,
    });
    expect(state.faction?.boostCooldownUntil).toBeGreaterThanOrEqual(
      now + FACTION_BOOST_COOLDOWN - 1000,
    );
    expect(state.faction?.boostCooldownUntil).toBeLessThanOrEqual(
      now + FACTION_BOOST_COOLDOWN + 1000,
    );
  });

  it("switches factions and resets previousFaction", () => {
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
    expect(state.previousFaction).toBeUndefined();

    state = leaveFaction({
      state,
      action: { type: "faction.left" },
      createdAt: now + TWENTY_FOUR_HOURS + 1000,
    });
    expect(state.previousFaction?.name).toBe("bumpkins");
    expect(state.previousFaction?.leftAt).toBe(now + TWENTY_FOUR_HOURS + 1000);

    state = joinFaction({
      state: { ...state, balance: new Decimal(20) },
      action: {
        type: "faction.joined",
        faction: "sunflorians",
        sfl: 10,
      },
      createdAt: now + TWENTY_FOUR_HOURS + 2000,
    });
    expect(state.previousFaction).toBeUndefined();

    state = leaveFaction({
      state,
      action: { type: "faction.left" },
      createdAt: now + TWENTY_FOUR_HOURS * 2 + 3000,
    });
    expect(state.previousFaction?.name).toBe("sunflorians");
    expect(state.previousFaction?.leftAt).toBe(
      now + TWENTY_FOUR_HOURS * 2 + 3000,
    );

    state = joinFaction({
      state: { ...state, balance: new Decimal(20) },
      action: {
        type: "faction.joined",
        faction: "goblins",
        sfl: 10,
      },
      createdAt: now + TWENTY_FOUR_HOURS * 2 + 4000,
    });
    expect(state.previousFaction).toBeUndefined();
  });

  it("validates previousFaction is reset when joining after leaving a faction", () => {
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

    state = leaveFaction({
      state,
      action: { type: "faction.left" },
      createdAt: now + TWENTY_FOUR_HOURS + 1000,
    });

    state = joinFaction({
      state: { ...state, balance: new Decimal(20) },
      action: {
        type: "faction.joined",
        faction: "sunflorians",
        sfl: 10,
      },
      createdAt: now + TWENTY_FOUR_HOURS + 2000,
    });

    expect(state.previousFaction).toBeUndefined();
    expect(state.faction?.name).toBe("sunflorians");
    expect(state.faction?.pledgedAt).toBe(now + TWENTY_FOUR_HOURS + 2000);
  });

  it("does not set a cooldown when rejoining the same faction", () => {
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

    state = leaveFaction({
      state,
      action: { type: "faction.left" },
      createdAt: now + TWENTY_FOUR_HOURS + 1000,
    });

    // Rejoin same faction
    state = joinFaction({
      state: { ...state, balance: new Decimal(20) },
      action: {
        type: "faction.joined",
        faction: "bumpkins", // Same faction
        sfl: 10,
      },
      createdAt: now + TWENTY_FOUR_HOURS + 2000,
    });

    expect(state.faction?.boostCooldownUntil).toBeUndefined();
  });
});
