import { CONFIG } from "lib/config";
import { randomID } from "lib/utils/random";
import { CONSENT_EVENT, hasAdConsent } from "./consent";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

type MetaCustomParams = Record<string, string | number | boolean | null>;

/** Standard events we send. Custom ones go through `trackMetaCustomEvent`. */
export type MetaStandardEvent =
  | "PageView"
  | "CompleteRegistration"
  | "Purchase";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;

  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&")}=([^;]*)`,
    ),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function getMetaBrowserIdentifiers(): {
  fbp?: string;
  fbc?: string;
} {
  const fbp = getCookie("_fbp");
  const fbc = getCookie("_fbc");

  return {
    fbp: fbp || undefined,
    fbc: fbc || undefined,
  };
}

let pixelLoaded = false;
let listening = false;

/**
 * Loads fbevents.js and fires PageView. Only runs with ad consent: an
 * explicit yes from the banner, or implied where no banner is required.
 * Without consent nothing is loaded and no `_fbp` / `_fbc` cookie is set;
 * when consent arrives later the `sl:consent` event triggers the load.
 */
export function initMetaPixel() {
  const pixelId = (CONFIG as any).META_PIXEL_ID as string | undefined;
  if (!pixelId) return;
  if (typeof window === "undefined") return;

  if (!listening) {
    listening = true;
    window.addEventListener(CONSENT_EVENT, () => initMetaPixel());
  }

  if (!hasAdConsent() || pixelLoaded) return;
  pixelLoaded = true;

  // Already initialised (e.g. a hot reload)
  if (window.fbq) {
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
    return;
  }

  // Meta Pixel bootstrap (slightly adapted to TS / linting)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  const fbq: any = function (...args: any[]) {
    fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args);
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;
  w.fbq = fbq;
  w._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", pixelId);
  fbq("track", "PageView");
}

/** Test hook: forget that the Pixel was loaded. */
export function resetMetaPixelForTests() {
  pixelLoaded = false;
}

function canTrack(): boolean {
  if (!CONFIG || typeof window === "undefined") return false;
  if (!window.fbq) return false;
  return hasAdConsent();
}

/**
 * Standard event. `eventId` must match the id the server uses for the same
 * event (e.g. `signup-<farmId>`), which is how Meta deduplicates the Pixel
 * and Conversions API copies.
 */
export function trackMetaEvent(
  eventName: MetaStandardEvent,
  eventId: string,
  params?: MetaCustomParams,
) {
  if (!canTrack()) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window.fbq as any)("track", eventName, params ?? {}, { eventID: eventId });
}

export function trackMetaCustomEvent(
  eventName: string,
  params?: MetaCustomParams,
  eventId?: string,
) {
  if (!canTrack()) return;

  const id = eventId ?? randomID();

  // For custom events: fbq('trackCustom', name, params, { eventID })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window.fbq as any)("trackCustom", eventName, params ?? {}, { eventID: id });
}

/**
 * Event ids shared with the server (`services/adEvents.ts` in the API).
 * Keep these in lockstep: a mismatch means Meta counts the event twice.
 */
export const META_EVENT_IDS = {
  completeRegistration: (farmId: number) => `signup-${farmId}`,
  tutorialComplete: (farmId: number) => `tutorial-${farmId}`,
};
