import craftingTable from "assets/buildings/crafting_table.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  SUPPORTED_MINIGAMES,
  type MinigameName,
} from "features/game/types/minigames";
import { buildMinigameDashboardData } from "./minigameConfigHelpers";
import type { MinigameDashboardData } from "./minigameDashboardTypes";
import type { PlayerEconomyConfig, PlayerEconomyRuntimeState } from "./types";

function resolvePortalName(slug: string): MinigameName {
  return SUPPORTED_MINIGAMES.includes(slug as MinigameName)
    ? (slug as MinigameName)
    : "chicken-rescue-v2";
}

const MOCK_IMG = {
  coin: SUNNYSIDE.icons.disc,
  egg: SUNNYSIDE.icons.heart,
  flour: SUNNYSIDE.icons.plant,
} as const;

/**
 * Static player-economy config for local testing when `CONFIG.API_URL` is unset.
 */
export function getLocalMinigameDashboardMock(
  slug: string,
): MinigameDashboardData {
  const portalName = resolvePortalName(slug);
  const today = new Date().toISOString().slice(0, 10);

  const config: PlayerEconomyConfig = {
    mainCurrencyToken: "MockCoin",
    visualTheme: "chicken-rescue",
    descriptions: {
      title: "Minigame (local)",
      subtitle: "No API — mock economy for layout testing",
      welcome: "This session uses hard-coded data while API_URL is disabled.",
      rules: "Play is not available until a play URL is configured.",
    },
    items: {
      MockCoin: {
        name: "Mock coin",
        description: "Test currency",
        image: MOCK_IMG.coin,
        tradeable: true,
        id: 0,
        initialBalance: 100,
      },
      Kitchen: {
        name: "Kitchen",
        description: "Produces goods",
        image: craftingTable,
        generator: true,
        initialBalance: 1,
      },
      Egg: {
        name: "Egg",
        description: "Quick batch",
        image: MOCK_IMG.egg,
      },
      Flour: {
        name: "Flour",
        description: "Slower batch",
        image: MOCK_IMG.flour,
      },
      DemoTrophy: {
        name: "Demo trophy",
        description: "Shown when marked as trophy and owned",
        image: MOCK_IMG.egg,
        trophy: true,
      },
    },
    actions: {
      MOCK_BUY: {
        burn: {
          MockCoin: { amount: 10 },
        },
        mint: {
          Kitchen: { amount: 1 },
        },
      },
      MOCK_PRODUCE: {
        produce: {
          Egg: { requires: "Kitchen" },
          Flour: { requires: "Kitchen" },
        },
        collect: {
          Egg: { amount: 1, seconds: 3 },
          Flour: { amount: 2, seconds: 10 },
        },
      },
    },
  };

  const state: PlayerEconomyRuntimeState = {
    balances: { MockCoin: 100, Kitchen: 1, DemoTrophy: 1 },
    generating: {},
    dailyMinted: { utcDay: today, minted: {} },
    activity: 1,
    dailyActivity: { date: today, count: 0 },
  };

  return buildMinigameDashboardData(slug, portalName, config, state);
}
