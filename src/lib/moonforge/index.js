// MoonForge Web SDK — public entry. Wires modules, session, auto-capture, globals.
import * as core from "./core.js";
import * as analytics from "./analytics.js";
import * as errors from "./errors.js";
import {
  setGameState,
  setGameStateData,
  getGameState,
  clearGameState,
} from "./context.js";

let sessionStartedAt = 0;
let autoInstalled = false;

const NETWORK_ERROR_STATUS_THRESHOLD = 400;

/**
 * Extracts a usable URL string from a fetch() first argument, which may be
 * a plain string, a URL object, or a Request object.
 * @param {string | URL | Request | undefined} input
 * @returns {string}
 */
function requestUrl(input) {
  if (typeof input === "string") return input;
  if (input && typeof input.href === "string") return input.href; // URL object
  if (input && typeof input.url === "string") return input.url; // Request object
  return "";
}

/**
 * Begins a new foreground session span. Idempotent: calling this while a
 * span is already active is a no-op, so redundant 'visible' transitions
 * (e.g. duplicate visibilitychange events) never emit duplicate starts.
 */
function beginSpan() {
  if (globalThis.__mfSessionActive) return;
  globalThis.__mfSessionActive = true;
  sessionStartedAt = Date.now();
  analytics.trackEvent("session_start", { session_id: core.getSessionId() });
}

/**
 * Ends the current foreground session span and reports its duration via a
 * beacon so the event survives page teardown. Idempotent: calling this when
 * no span is active is a no-op, so 'hidden' followed by 'pagehide' (or any
 * other repeated end trigger) never emits duplicate ends.
 */
function endSpan() {
  if (!globalThis.__mfSessionActive) return;
  globalThis.__mfSessionActive = false;
  const duration_seconds = Math.round((Date.now() - sessionStartedAt) / 1000);
  analytics.trackEvent(
    "session_end",
    { session_id: core.getSessionId(), duration_seconds },
    { beacon: true },
  );
}

/**
 * Wires up re-armable foreground session spans. Unlike a single session
 * that ends permanently on the first tab-blur, this tracks each foreground
 * span independently: a new 'session_start' fires whenever the tab becomes
 * visible again, and a 'session_end' fires whenever it becomes hidden or
 * the page is torn down, so total foreground duration stays accurate
 * across repeated tab switches.
 */
let sessionListenersInstalled = false;

function startSession() {
  beginSpan();
  if (
    sessionListenersInstalled ||
    typeof globalThis.addEventListener !== "function"
  )
    return;
  sessionListenersInstalled = true;
  globalThis.addEventListener("pagehide", endSpan);
  globalThis.addEventListener("visibilitychange", () => {
    const vis = globalThis.document?.visibilityState;
    if (vis === "hidden") endSpan();
    else if (vis === "visible") beginSpan();
  });
}

function installAutoCapture() {
  if (autoInstalled || typeof globalThis.addEventListener !== "function")
    return;
  autoInstalled = true;
  globalThis.addEventListener("error", (e) => {
    if (e?.error) errors._captureUnhandled(e.error);
    else if (e?.message)
      errors.captureMessage(e.message, { level: core.ErrorLevel.Error });
  });
  globalThis.addEventListener("unhandledrejection", (e) => {
    const r = e?.reason;
    errors._captureUnhandled(r instanceof Error ? r : new Error(String(r)));
  });
}

function installFetchInterceptor(threshold = NETWORK_ERROR_STATUS_THRESHOLD) {
  if (typeof globalThis.fetch !== "function" || globalThis.__mfFetchWrapped)
    return;
  globalThis.__mfFetchWrapped = true;
  const orig = globalThis.fetch.bind(globalThis);
  globalThis.fetch = async (...args) => {
    const start = Date.now();
    const url = requestUrl(args[0]);
    const method = (
      args[1]?.method ??
      (typeof args[0] !== "string" ? args[0]?.method : undefined) ??
      "GET"
    ).toUpperCase();
    // Never intercept our own collector calls (also skips capture when the URL is unresolvable).
    const cfg = core.getConfig();
    if (!url || (cfg && url.startsWith(cfg.apiEndpoint))) return orig(...args);
    try {
      const res = await orig(...args);
      if (res.status >= threshold)
        errors.captureNetworkError(url, {
          method,
          statusCode: res.status,
          durationMs: Date.now() - start,
        });
      return res;
    } catch (e) {
      errors.captureNetworkError(url, {
        method,
        errorMessage: String(e),
        durationMs: Date.now() - start,
      });
      throw e;
    }
  };
}

function init(options = {}) {
  const cfg = core.init(options);
  if (!cfg) return undefined;
  installAutoCapture();
  if (cfg.autoTrackSession) startSession();
  if (cfg.trackNetworkErrors) installFetchInterceptor();
  return cfg;
}

export const MoonForgeAnalytics = {
  init,
  trackEvent: analytics.trackEvent,
  trackScreenView: analytics.trackScreenView,
  identify: analytics.identify,
  setUserProperty: analytics.setUserProperty,
  removeUserProperty: analytics.removeUserProperty,
  clearUserProperties: analytics.clearUserProperties,
  getDistinctId: analytics.getDistinctId,
  getSessionId: analytics.getSessionId,
  reset: analytics.reset,
  flush: analytics.flush,
  // Exposed so a host app can release buffered events on a path that does not
  // call identify, and so tests can reset buffering between cases.
  markIdentified: core.markIdentified,
  resetBuffering: core.resetBuffering,
};

export const MoonForgeErrorTracker = {
  setUser: errors.setUser,
  clearUser: errors.clearUser,
  setGameState,
  setGameStateData,
  getGameState,
  clearGameState,
  addBreadcrumb: errors.addBreadcrumb,
  getBreadcrumbs: errors.getBreadcrumbs,
  captureException: errors.captureException,
  captureMessage: errors.captureMessage,
  captureNetworkError: errors.captureNetworkError,
  flush: errors.flush,
};

export const ErrorLevel = core.ErrorLevel;
export const BreadcrumbType = core.BreadcrumbType;
export const BreadcrumbLevel = core.BreadcrumbLevel;

if (typeof globalThis !== "undefined") {
  globalThis.MoonForgeAnalytics = MoonForgeAnalytics;
  globalThis.MoonForgeErrorTracker = MoonForgeErrorTracker;
}
