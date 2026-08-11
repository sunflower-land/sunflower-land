import { MoonForgeAnalytics } from "lib/moonforge";
import { TUTORIAL_STEPS, trackTutorialStep } from "./moonforgeTutorial";

describe("moonforgeTutorial", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("emits tutorial_step_completed with the step name", () => {
    const trackEventSpy = jest.spyOn(MoonForgeAnalytics, "trackEvent");

    trackTutorialStep("login");

    expect(trackEventSpy).toHaveBeenCalledWith("tutorial_step_completed", {
      step: "login",
    });
  });

  // connect_wallet and create_account are EXCLUSIVE branches - a player takes
  // one or the other, never both - so as two sequential funnel steps they
  // showed a ~100% drop at step 2 by construction. One step plus a
  // discriminator is the shape that can actually be funnelled.
  it("emits a single auth step carrying the branch as a property", () => {
    const trackEventSpy = jest.spyOn(MoonForgeAnalytics, "trackEvent");

    trackTutorialStep("auth", { method: "wallet" });

    expect(trackEventSpy).toHaveBeenCalledWith("tutorial_step_completed", {
      step: "auth",
      method: "wallet",
    });
  });

  // `toBeGreaterThan(3)` asserted nothing: it passed for any vocabulary of
  // four or more names, including a wrong one. The membership is the contract
  // every downstream funnel is built on, so it is pinned exactly.
  it("exposes exactly the expected, ordered step vocabulary", () => {
    expect(TUTORIAL_STEPS).toEqual(["auth", "login", "expand_to_3_land"]);
    expect(new Set(TUTORIAL_STEPS).size).toBe(TUTORIAL_STEPS.length);
  });

  it("keeps expand_to_3_land so existing history stays comparable", () => {
    expect(TUTORIAL_STEPS).toContain("expand_to_3_land");
  });

  // The whole point of the union: a typo fails `tsc` rather than silently
  // producing an unfunnellable value. If this ever compiles, the type has
  // widened to `string` and the guarantee is gone - @ts-expect-error then
  // fails the build as "unused", which is the intended alarm.
  it("rejects an unknown step at typecheck time", () => {
    const trackEventSpy = jest.spyOn(MoonForgeAnalytics, "trackEvent");

    // @ts-expect-error "connect_wallet" is no longer a step in the vocabulary
    trackTutorialStep("connect_wallet");
    // @ts-expect-error free-form strings are not steps
    trackTutorialStep("some_made_up_step");
    // @ts-expect-error the auth method is a fixed union too
    trackTutorialStep("auth", { method: "carrier_pigeon" });

    expect(trackEventSpy).toHaveBeenCalled();
  });
});
