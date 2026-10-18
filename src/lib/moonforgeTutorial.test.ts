import { MoonForgeAnalytics } from "lib/moonforge";
import {
  TUTORIAL_STEPS,
  hasCompletedLoginStep,
  markLoginStepCompleted,
  trackTutorialStep,
} from "./moonforgeTutorial";

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

// `initialiseAnalytics` runs on every session load, including REFRESH, so
// without a marker the `login` step would emit once per session rather than
// once per player - producing a funnel step with more events than players.
describe("login step marker", () => {
  beforeEach(() => localStorage.clear());

  it("reports not-completed for an account that has never logged in", () => {
    expect(hasCompletedLoginStep(123)).toBe(false);
  });

  it("reports completed only after the marker is written", () => {
    markLoginStepCompleted(123);

    expect(hasCompletedLoginStep(123)).toBe(true);
  });

  it("emits once across an initial load followed by REFRESH", () => {
    const trackEventSpy = jest.spyOn(MoonForgeAnalytics, "trackEvent");

    // Mirrors the guard in gameMachine's initialiseAnalytics, which runs on
    // every session load including REFRESH.
    const emit = (farmId: number) => {
      if (!hasCompletedLoginStep(farmId)) {
        markLoginStepCompleted(farmId);
        trackTutorialStep("login");
        return true;
      }
      return false;
    };

    expect(emit(123)).toBe(true);
    expect(emit(123)).toBe(false);
    expect(emit(123)).toBe(false);

    // The boolean alone would pass even if the event were never sent, so
    // assert on the tracker itself.
    expect(trackEventSpy).toHaveBeenCalledTimes(1);
    expect(trackEventSpy).toHaveBeenCalledWith("tutorial_step_completed", {
      step: "login",
    });
  });

  it("scopes the marker per account, so a second farm still records its first login", () => {
    markLoginStepCompleted(123);

    expect(hasCompletedLoginStep(456)).toBe(false);
  });

  // Private browsing and some webviews refuse localStorage. Re-emitting is the
  // safer failure: an over-counted step is visible in analysis, a missing one
  // looks like real drop-off.
  it("reports not-completed when storage is unavailable", () => {
    const spy = jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("storage disabled");
      });

    expect(() => hasCompletedLoginStep(123)).not.toThrow();
    expect(hasCompletedLoginStep(123)).toBe(false);

    spy.mockRestore();
  });

  it("never throws when the marker cannot be written", () => {
    const spy = jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("quota exceeded");
      });

    expect(() => markLoginStepCompleted(123)).not.toThrow();

    spy.mockRestore();
  });
});
