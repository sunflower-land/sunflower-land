import { MoonForgeAnalytics, MoonForgeErrorTracker } from "lib/moonforge";
import { CONFIG } from "lib/config";

/**
 * MoonForge game analytics for Sunflower Land.
 *
 * Thin wrapper around the MoonForge Web SDK. Keeps every call site in game
 * code down to a one-liner and gives us a single place to swap out or
 * extend the underlying analytics provider.
 *
 * The SDK itself is a safe no-op before `MoonForgeAnalytics.init` has run
 * (e.g. during SSR/build, before app bootstrap completes, or when
 * VITE_MOONFORGE_GAME_ID is not configured), so these helpers do not need
 * their own guards.
 */
export const MOONFORGE_GAME_ID = CONFIG.MOONFORGE_GAME_ID;

/**
 * Tracks a one-off game event with optional properties.
 * Do not include scene, device, or language - these are auto-collected.
 */
export function mfTrack(name: string, data?: Record<string, unknown>): void {
  try {
    MoonForgeAnalytics.trackEvent(name, data);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`MoonForge analytics error: `, e);
  }
}

/**
 * Tracks a screen/scene view.
 */
export function mfScreen(name: string): void {
  try {
    MoonForgeAnalytics.trackScreenView(name);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`MoonForge analytics error: `, e);
  }
}

/**
 * Identifies the current player for analytics.
 */
export function mfIdentify(
  userId: string,
  traits?: Record<string, unknown>,
): void {
  try {
    MoonForgeAnalytics.identify(userId, traits);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`MoonForge analytics error: `, e);
  }
}

/**
 * Sets the current player on the error tracker, so captured errors are
 * attributed to the right account.
 */
export function mfSetUser(userId: string, tags?: Record<string, string>): void {
  try {
    MoonForgeErrorTracker.setUser(userId, tags);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`MoonForge analytics error: `, e);
  }
}

/**
 * Updates the current scene name on the error tracker's game state, so any
 * error captured afterwards is tagged with where the player is.
 */
export function mfSetScene(sceneName: string): void {
  try {
    MoonForgeErrorTracker.setGameState({ sceneName });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`MoonForge analytics error: `, e);
  }
}

/**
 * Records which variant of an experiment a player was assigned.
 *
 * This does not establish causation on its own. It is what makes a holdout
 * measurable after the fact - without it, the experiment that would settle
 * "does spend drive retention or the reverse" cannot be analysed once it has
 * already run.
 */
export function mfExperiment(experimentId: string, variant: string): void {
  try {
    MoonForgeAnalytics.trackEvent("experiment_assigned", {
      experiment_id: experimentId,
      variant,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`MoonForge analytics error: `, e);
  }
}
