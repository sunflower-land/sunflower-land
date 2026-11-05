import { readLocalStorageJSON, writeLocalStorageJSON } from "lib/localStorage";

/**
 * Where a visitor came from, as seen on one page load. Mirrors the server's
 * `AttributionTouch` (sunflower-land-api `domain/growth/attribution.ts`).
 */
export type AttributionTouch = {
  /** Epoch ms when this touch landed. */
  at: number;
  landing_path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  /** Meta ids our ad URLs carry (set by the prefill tool, never by hand). */
  sl_cid?: string;
  sl_asid?: string;
  sl_aid?: string;
  sl_angle?: string;
  fbclid?: string;
  fbp?: string;
  fbc?: string;
};

export type AttributionPayload = {
  first_touch?: AttributionTouch;
  last_touch?: AttributionTouch;
  consent?: boolean;
};

export const FIRST_TOUCH_KEY = "sl_first_touch";
export const LAST_TOUCH_KEY = "sl_last_touch";

const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "sl_cid",
  "sl_asid",
  "sl_aid",
  "sl_angle",
  "fbclid",
] as const;

const MAX_VALUE_LENGTH = 512;

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&")}=([^;]*)`,
    ),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Meta's `_fbc` cookie is only written once fbevents.js loads, which with
 * consent gating may be never. Meta documents the format so we can build it
 * ourselves from the click id: `fb.<subdomainIndex>.<creationTime>.<fbclid>`.
 */
export function fbcFromClickId(fbclid: string, now: number): string {
  return `fb.1.${now}.${fbclid}`;
}

function clip(value: string | null): string | undefined {
  if (!value) return undefined;
  return value.slice(0, MAX_VALUE_LENGTH);
}

/**
 * Reads the current URL, referrer and Meta cookies into a touch. Returns
 * `undefined` when there is nothing attributable on this load (no tracked
 * params, no referrer from another site), so plain in-app navigation never
 * overwrites a real last touch.
 */
export function readTouchFromLocation(
  location: Pick<Location, "search" | "pathname" | "hash">,
  referrer: string,
  now: number,
): AttributionTouch | undefined {
  // The app uses a HashRouter, so real query params sit before the `#`, but
  // shared links sometimes carry them after it. Read both.
  const params = new URLSearchParams(location.search);
  const hashQuery = location.hash.includes("?")
    ? location.hash.slice(location.hash.indexOf("?") + 1)
    : "";
  for (const [key, value] of new URLSearchParams(hashQuery)) {
    if (!params.has(key)) params.set(key, value);
  }

  const touch: AttributionTouch = { at: now };
  let attributable = false;
  for (const key of TRACKED_PARAMS) {
    const value = clip(params.get(key));
    if (value) {
      touch[key] = value;
      attributable = true;
    }
  }

  let externalReferrer: string | undefined;
  if (referrer) {
    try {
      const host = new URL(referrer).hostname;
      if (typeof window === "undefined" || host !== window.location.hostname) {
        externalReferrer = clip(referrer);
      }
    } catch {
      // not a URL, ignore
    }
  }
  if (externalReferrer) {
    touch.referrer = externalReferrer;
    attributable = true;
  }

  if (!attributable) return undefined;

  touch.landing_path = clip(`${location.pathname}${location.search}`);
  touch.fbp = readCookie("_fbp");
  touch.fbc =
    readCookie("_fbc") ??
    (touch.fbclid ? fbcFromClickId(touch.fbclid, now) : undefined);
  return touch;
}

/**
 * Runs once per page load, before the Pixel. First touch wins and is never
 * overwritten; the last touch is replaced on every attributable load.
 * Survives OAuth redirects (localStorage) and is only consumed at signup.
 */
export function captureTouch(now = Date.now()): void {
  if (typeof window === "undefined") return;
  const touch = readTouchFromLocation(
    window.location,
    typeof document === "undefined" ? "" : document.referrer,
    now,
  );
  if (!touch) return;

  if (!readLocalStorageJSON<AttributionTouch>(FIRST_TOUCH_KEY)) {
    writeLocalStorageJSON(FIRST_TOUCH_KEY, touch);
  }
  writeLocalStorageJSON(LAST_TOUCH_KEY, touch);
}

/**
 * Called at signup. Refreshes the Meta cookies on both touches (the Pixel may
 * have set `_fbp` after the landing load) and attaches the consent decision.
 */
export function getAttributionPayload(consent: boolean): AttributionPayload {
  const first = readLocalStorageJSON<AttributionTouch>(FIRST_TOUCH_KEY);
  const last = readLocalStorageJSON<AttributionTouch>(LAST_TOUCH_KEY);
  const fbp = readCookie("_fbp");
  const fbc = readCookie("_fbc");
  const refresh = (touch?: AttributionTouch) =>
    touch
      ? { ...touch, fbp: fbp ?? touch.fbp, fbc: fbc ?? touch.fbc }
      : undefined;
  return {
    first_touch: refresh(first),
    last_touch: refresh(last),
    consent,
  };
}

export function getFirstTouch(): AttributionTouch | undefined {
  return readLocalStorageJSON<AttributionTouch>(FIRST_TOUCH_KEY);
}
