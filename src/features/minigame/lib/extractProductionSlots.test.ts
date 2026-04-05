import {
  type CapBalanceProductionSlot,
  getCollectDropOddsForAction,
  getProductionZoneEntries,
  isDeterministicCollectYield,
} from "./extractProductionSlots";
import { migrateLegacyPlayerEconomyConfigFields } from "./minigameConfigMigration";
import { mergeRuntimeWithInitialBalances } from "./minigameConfigHelpers";
import type { PlayerEconomyRuntimeState } from "./types";

describe("getProductionZoneEntries", () => {
  const baseActions = {
    "1": {
      produce: { "4": { requires: "5" } },
      collect: { "4": { amount: 3, seconds: 28800 } },
      type: "generator" as const,
    },
  };

  const runtimeBase: PlayerEconomyRuntimeState = {
    balances: { "4": 3, "5": 1 },
    generating: {},
    activity: 0,
    dailyActivity: { date: "2026-04-03", count: 0 },
    dailyMinted: { utcDay: "2026-04-03", minted: {} },
  };

  it("lists owned wormery when API wrongly sets generator false (infer from produce requires)", () => {
    const raw = {
      actions: baseActions,
      items: {
        "4": { name: "Worm", description: "w", id: 4 },
        "5": {
          name: "Wormery",
          description: "w",
          id: 5,
          generator: false,
        },
      },
    };
    const config = migrateLegacyPlayerEconomyConfigFields(raw as any);
    const runtime = mergeRuntimeWithInitialBalances(config, runtimeBase);
    const entries = getProductionZoneEntries(config, runtime);
    expect(entries.map((e) => e.capToken)).toContain("5");
    expect(
      entries.find((e) => e.capToken === "5")?.recipes.length,
    ).toBeGreaterThan(0);
  });

  it("lists owned wormery when generator is a string boolean from the API", () => {
    const raw = {
      actions: baseActions,
      items: {
        "4": { name: "Worm", description: "w", id: 4 },
        "5": {
          name: "Wormery",
          description: "w",
          id: 5,
          generator: "true" as unknown as boolean,
        },
      },
    };
    const config = migrateLegacyPlayerEconomyConfigFields(raw as any);
    const runtime = mergeRuntimeWithInitialBalances(config, runtimeBase);
    const entries = getProductionZoneEntries(config, runtime);
    expect(entries.map((e) => e.capToken)).toContain("5");
  });
});

describe("getCollectDropOddsForAction", () => {
  it("returns null for a single collect row", () => {
    expect(
      getCollectDropOddsForAction({ A: { amount: 1, chance: 50 } }),
    ).toBeNull();
  });

  it("normalizes two equal weights to 50/50", () => {
    const rows = getCollectDropOddsForAction({
      A: { amount: 1, chance: 50 },
      B: { amount: 3, chance: 50 },
    });
    expect(rows).toHaveLength(2);
    expect(rows?.[0].percent).toBe(50);
    expect(rows?.[1].percent).toBe(50);
    expect(rows?.[0].amount).toBe(1);
    expect(rows?.[1].amount).toBe(3);
  });

  it("uses weight 100 when chance is omitted", () => {
    const rows = getCollectDropOddsForAction({
      A: { amount: 1 },
      B: { amount: 1, chance: 100 },
    });
    expect(rows?.[0].percent).toBe(50);
    expect(rows?.[1].percent).toBe(50);
  });
});

describe("isDeterministicCollectYield", () => {
  const slot = (collectActionId: string, outputToken: string) =>
    ({
      capToken: "cap",
      outputToken,
      startActionId: collectActionId,
      collectActionId,
      msToComplete: 1000,
    }) satisfies CapBalanceProductionSlot;

  it("is true for a single collect row without chance", () => {
    const config = {
      actions: {
        g: {
          produce: { W: { requires: "cap" } },
          collect: { W: { amount: 3, seconds: 1 } },
        },
      },
    } as any;
    expect(isDeterministicCollectYield(config, slot("g", "W"))).toBe(true);
  });

  it("is true for a single row with chance 100", () => {
    const config = {
      actions: {
        g: {
          produce: { W: { requires: "cap" } },
          collect: { W: { amount: 2, seconds: 1, chance: 100 } },
        },
      },
    } as any;
    expect(isDeterministicCollectYield(config, slot("g", "W"))).toBe(true);
  });

  it("is false for a single row with chance below 100", () => {
    const config = {
      actions: {
        g: {
          produce: { W: { requires: "cap" } },
          collect: { W: { amount: 2, seconds: 1, chance: 50 } },
        },
      },
    } as any;
    expect(isDeterministicCollectYield(config, slot("g", "W"))).toBe(false);
  });

  it("is false when multiple collect rows exist", () => {
    const config = {
      actions: {
        g: {
          produce: { W: { requires: "cap" } },
          collect: {
            W: { amount: 1, seconds: 1, chance: 50 },
            C: { amount: 3, seconds: 1, chance: 50 },
          },
        },
      },
    } as any;
    expect(isDeterministicCollectYield(config, slot("g", "W"))).toBe(false);
  });
});
