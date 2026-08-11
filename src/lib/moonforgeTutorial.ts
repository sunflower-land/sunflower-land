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
 * its call sites):
 * - `auth` - the player is authenticated. This is deliberately ONE step,
 *   not the `connect_wallet`/`create_account` pair those onboarding events
 *   use: a player takes one branch or the other and never both, so two
 *   sequential funnel steps would show a ~100% drop at step 2 by
 *   construction. The branch survives as the `method` property, which is
 *   what it actually is - a discriminator, not a stage.
 * - `login` - the first authenticated game session begins
 *   (`features/game/lib/gameMachine.ts`)
 * - `expand_to_3_land` - existing tutorial-complete milestone
 *   (`features/game/events/landExpansion/expandLand.ts`), kept verbatim so
 *   existing production history stays comparable
 */
export const TUTORIAL_STEPS = ["auth", "login", "expand_to_3_land"] as const;

export type TutorialStep = (typeof TUTORIAL_STEPS)[number];

/** Which branch out of the welcome screen the player took to authenticate. */
export type TutorialAuthMethod = "wallet" | "account";

export type TutorialStepProperties = {
  method?: TutorialAuthMethod;
};

/**
 * Records a COMPLETED tutorial milestone.
 *
 * Call sites must fire on the transition where the milestone has actually
 * happened - a token exists, an account exists - never on the transition
 * where the player merely expressed the intent by pressing a button. The
 * event is named `tutorial_step_completed`; an intent-shaped call site makes
 * it a lie and inflates every downstream conversion rate.
 */
export function trackTutorialStep(
  step: TutorialStep,
  properties?: TutorialStepProperties,
): void {
  mfTrack("tutorial_step_completed", { step, ...properties });
}
