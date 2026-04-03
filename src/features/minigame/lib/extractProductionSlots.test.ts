import { getProductionZoneEntries } from "./extractProductionSlots";
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
    expect(entries.find((e) => e.capToken === "5")?.recipes.length).toBeGreaterThan(
      0,
    );
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
