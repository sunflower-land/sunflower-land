import { CONFIG } from "lib/config";
import { setConsent } from "./consent";
import {
  initMetaPixel,
  META_EVENT_IDS,
  resetMetaPixelForTests,
  trackMetaEvent,
} from "./meta";

describe("Meta pixel consent gating", () => {
  beforeEach(() => {
    localStorage.clear();
    resetMetaPixelForTests();
    delete (window as { fbq?: unknown }).fbq;
    document
      .querySelectorAll("script[src*='fbevents']")
      .forEach((s) => s.remove());
    (CONFIG as { META_PIXEL_ID?: string }).META_PIXEL_ID = "123";
  });

  it("does not load without consent and loads once consent is given", () => {
    setConsent(false, "banner");
    initMetaPixel();
    expect(window.fbq).toBeUndefined();
    expect(document.querySelector("script[src*='fbevents']")).toBeNull();

    setConsent(true, "banner"); // the listener registered above fires
    expect(window.fbq).toBeDefined();
    expect(document.querySelector("script[src*='fbevents']")).not.toBeNull();
  });

  it("tracks standard events with the shared event id only with consent", () => {
    setConsent(true, "banner");
    initMetaPixel();
    const fbq = jest.fn();
    window.fbq = fbq;
    trackMetaEvent(
      "CompleteRegistration",
      META_EVENT_IDS.completeRegistration(42),
    );
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "CompleteRegistration",
      {},
      { eventID: "signup-42" },
    );

    setConsent(false, "banner");
    fbq.mockClear();
    trackMetaEvent("CompleteRegistration", "signup-42");
    expect(fbq).not.toHaveBeenCalled();
  });
});
