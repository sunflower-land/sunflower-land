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
   * Landscaping as a sandbox: edits are drafted client-side and committed in
   * one `arrangement.saved` event when the player saves, so they can cancel
   * out of the whole session. Saved Layouts rides along with it - re-applying
   * a layout is the same commit path. Off = the legacy live-event
   * landscaping, where every move is already saved and there is nothing to
   * cancel, and the layouts button is hidden.
   */
  newLandscaping: false,
} satisfies Record<string, boolean>;

export type ExperimentName = keyof typeof EXPERIMENT_DEFAULTS;

export const hasExperiment = (game: GameState, name: ExperimentName): boolean =>
  game.settings.experiments?.[name] ?? EXPERIMENT_DEFAULTS[name];
