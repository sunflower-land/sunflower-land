import util from "util";
import Decimal from "decimal.js-light";
import { sdk } from "@farcaster/miniapp-sdk";

import { initialiseFont } from "./fonts";
import { initialiseCustomCursor } from "./customCursor";
import { initMetaPixel } from "lib/analytics/meta";
import { MoonForgeAnalytics } from "lib/moonforge";
import { MOONFORGE_GAME_ID } from "lib/moonforgeAnalytics";

let moonForgeInitialised = false;

function initMoonForge() {
  if (moonForgeInitialised) return;

  // Not configured (e.g. local dev without VITE_MOONFORGE_GAME_ID) — skip,
  // matching how the other analytics integrations behave without their keys.
  if (!MOONFORGE_GAME_ID) return;

  moonForgeInitialised = true;

  try {
    MoonForgeAnalytics.init({
      gameId: MOONFORGE_GAME_ID,
      trackNetworkErrors: true,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`MoonForge analytics error: `, e);
  }
}

export async function initialise() {
  /**
   * Override the default stringify of Decimal.js for assist in debugging.
   */
  (Decimal.prototype as any)[util.inspect.custom] = Decimal.prototype.toString;

  /**
   * Decimal precision standard to handle ERC20 18 decimals + 12 decimal places reserved for in game actions
   */
  Decimal.set({ toExpPos: 30 });
  Decimal.set({ toExpNeg: -30 });

  initialiseFont();
  initialiseCustomCursor();
  initMetaPixel();
  initMoonForge();

  await sdk.actions.ready();
}
