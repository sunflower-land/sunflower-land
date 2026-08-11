import { mfTrack } from "./moonforgeAnalytics";

/**
 * The tutorial funnel's fixed vocabulary.
 *
 * `tutorial_step_completed` previously carried a single observed `step`
 * value (`expand_to_3_land`), so "where do players drop off in the
 * tutorial" had no answer on any platform. Fixing that with a free-form
 * string would trade one failure for another - unbounded distinct values
 * and still no funnel - so the vocabulary is a fixed, exported union
 * instead: a typo fails `tsc`, not analytics.
 *
 * Names come from the onboarding milestones Sunflower Land already tracks
 * via `onboardingAnalytics.logEvent` (see `lib/onboardingAnalytics.ts` and
 * its call sites), reused verbatim rather than inventing a parallel
 * vocabulary:
 * - `connect_wallet` / `create_account` - the two entry paths out of the
 *   welcome screen (`features/auth/lib/authMachine.ts`)
 * - `login` - the first authenticated game session begins
 *   (`features/game/lib/gameMachine.ts`)
 * - `expand_to_3_land` - existing tutorial-complete milestone
 *   (`features/game/events/landExpansion/expandLand.ts`), kept so
 *   existing history stays comparable
 */
export const TUTORIAL_STEPS = [
  "connect_wallet",
  "create_account",
  "login",
  "expand_to_3_land",
] as const;

export type TutorialStep = (typeof TUTORIAL_STEPS)[number];

/** Records a completed tutorial milestone. */
export function trackTutorialStep(step: TutorialStep): void {
  mfTrack("tutorial_step_completed", { step });
}
