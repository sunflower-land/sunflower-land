import { readLocalStorageJSON, writeLocalStorageJSON } from "lib/localStorage";

export const CONSENT_KEY = "sl_consent";

export type ConsentRecord = {
  /** Ad measurement (Meta Pixel, hashed email to Meta). */
  ads: boolean;
  at: number;
  /** How the decision was made: the banner, or implied where no banner is required. */
  via: "banner" | "implied";
};

/**
 * Where a consent banner is required before ad measurement. Decided from
 * the browser timezone, which is available offline and before any request:
 * Europe/* covers the EU, UK, EEA and Switzerland with a handful of false
 * positives (e.g. Europe/Istanbul), which only means an extra banner. Swap
 * for a server geo header when legal advice narrows the list.
 */
export function consentRequired(
  timeZone: string | undefined = (() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return undefined;
    }
  })(),
): boolean {
  if (!timeZone) return true; // unknown: be careful
  return (
    timeZone.startsWith("Europe/") ||
    timeZone === "Atlantic/Canary" ||
    timeZone === "Atlantic/Madeira" ||
    timeZone === "Atlantic/Reykjavik" ||
    timeZone === "Atlantic/Azores" ||
    timeZone === "Atlantic/Faroe"
  );
}

export function getConsent(): ConsentRecord | undefined {
  return readLocalStorageJSON<ConsentRecord>(CONSENT_KEY);
}

export function setConsent(
  ads: boolean,
  via: ConsentRecord["via"],
  now = Date.now(),
): ConsentRecord {
  const record: ConsentRecord = { ads, at: now, via };
  writeLocalStorageJSON(CONSENT_KEY, record);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }));
  return record;
}

/** Fired on `window` whenever the decision changes; the Pixel listens. */
export const CONSENT_EVENT = "sl:consent";

/**
 * True when ad measurement may run right now: an explicit yes, or no banner
 * required in this region (implied). Undecided in a banner region is false.
 */
export function hasAdConsent(): boolean {
  const stored = getConsent();
  if (stored) return stored.ads;
  return !consentRequired();
}

/** The banner shows only where required and only until a decision is made. */
export function shouldShowConsentBanner(): boolean {
  return consentRequired() && !getConsent();
}
