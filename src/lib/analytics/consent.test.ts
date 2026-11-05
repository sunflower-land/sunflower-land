import {
  consentRequired,
  getConsent,
  hasAdConsent,
  setConsent,
  shouldShowConsentBanner,
} from "./consent";

describe("consent", () => {
  beforeEach(() => localStorage.clear());

  it("requires a banner for European timezones only", () => {
    expect(consentRequired("Europe/Berlin")).toBe(true);
    expect(consentRequired("Europe/London")).toBe(true);
    expect(consentRequired("Atlantic/Canary")).toBe(true);
    expect(consentRequired("America/New_York")).toBe(false);
    expect(consentRequired("Australia/Sydney")).toBe(false);
    expect(consentRequired("")).toBe(true);
  });

  it("stores the decision and notifies listeners", () => {
    const listener = jest.fn();
    window.addEventListener("sl:consent", listener);
    setConsent(true, "banner", 123);
    expect(getConsent()).toEqual({ ads: true, at: 123, via: "banner" });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(hasAdConsent()).toBe(true);
    setConsent(false, "banner", 124);
    expect(hasAdConsent()).toBe(false);
  });

  it("hides the banner once decided", () => {
    const required = consentRequired();
    expect(shouldShowConsentBanner()).toBe(required);
    setConsent(false, "banner");
    expect(shouldShowConsentBanner()).toBe(false);
  });
});
