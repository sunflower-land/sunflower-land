import type { GameState } from "features/game/types/game";

/**
 * Player opt-in experiments, toggled from Settings -> Advanced -> Experiments.
 *
 * Unlike a feature flag (lib/flags.ts) an experiment is not decided for the
 * player: it is stored on their farm, follows them across devices, and they
 * can turn it back off when it misbehaves. Reach for one when a change is
 * finished but still earning trust in production - a refactor of a flow people
 * already rely on - where "off" has to keep the old behaviour intact.
 *
 * The value below is what a farm that has never touched the toggle gets. Flip
 * a default to `true` to roll an experiment out to everyone while the toggle
 * still lets people back out; delete the entry (and the old code path) once it
 * ships for good.
 */
export const EXPERIMENT_DEFAULTS = {
  /**
   * Saved Layouts: keep up to three named farm arrangements and re-apply one
   * from landscaping. Off = the layouts button is hidden.
   */
  savedLayouts: false,
  /**
   * Calendar icon on each upcoming drop in the auction schedule: iOS opens
   * Apple Calendar via the API's `/auction/:id/calendar`, Android the default
   * calendar app (Google Calendar web fallback), desktop Google Calendar.
   */
  auctionCalendar: false,
} satisfies Record<string, boolean>;

export type ExperimentName = keyof typeof EXPERIMENT_DEFAULTS;

export const hasExperiment = (game: GameState, name: ExperimentName): boolean =>
  game.settings.experiments?.[name] ?? EXPERIMENT_DEFAULTS[name];
