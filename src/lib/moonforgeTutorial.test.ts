import { MoonForgeAnalytics } from "lib/moonforge";
import { TUTORIAL_STEPS, trackTutorialStep } from "./moonforgeTutorial";

describe("moonforgeTutorial", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("emits tutorial_step_completed with the step name", () => {
    const trackEventSpy = jest.spyOn(MoonForgeAnalytics, "trackEvent");

    trackTutorialStep("connect_wallet");

    expect(trackEventSpy).toHaveBeenCalledWith("tutorial_step_completed", {
      step: "connect_wallet",
    });
  });

  // A free-form string produces a property with unbounded distinct values
  // and no funnel - which is exactly the state this task exists to fix.
  it("exposes a fixed, non-empty step vocabulary", () => {
    expect(TUTORIAL_STEPS.length).toBeGreaterThan(3);
    expect(new Set(TUTORIAL_STEPS).size).toBe(TUTORIAL_STEPS.length);
  });

  it("keeps expand_to_3_land so existing history stays comparable", () => {
    expect(TUTORIAL_STEPS).toContain("expand_to_3_land");
  });
});
