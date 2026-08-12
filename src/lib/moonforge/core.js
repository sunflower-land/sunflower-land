// MoonForge Web SDK — core: config, identity, session, transport. Zero deps.
const DISTINCT_ID_KEY = "mf_distinct_id";
const SESSION_ID_KEY = "mf_session_id";
const SESSION_TS_KEY = "mf_session_ts";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const DEFAULT_ENDPOINT = "https://collector.moonforge.co";

export const ErrorLevel = Object.freeze({
  Info: "info",
  Warning: "warning",
  Error: "error",
  Fatal: "fatal",
});
export const BreadcrumbType = Object.freeze({
  Navigation: "navigation",
  Network: "network",
  User: "user",
  Debug: "debug",
  Error: "error",
});
export const BreadcrumbLevel = Object.freeze({
  Debug: "debug",
  Info: "info",
  Warning: "warning",
  Error: "error",
  Fatal: "fatal",
});

const state = { config: null, cacheToken: null, userProps: {} };

function uuid() {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    return (ch === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
function lget(k) {
  try {
    return globalThis.localStorage?.getItem(k) ?? null;
  } catch {
    return null;
  }
}
function lset(k, v) {
  try {
    globalThis.localStorage?.setItem(k, v);
  } catch {
    /* ignore */
  }
}

/** Unix timestamp in SECONDS — the collector's analytics pipeline rejects milliseconds. */
export function unixSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function init(options = {}) {
  if (!options.gameId) {
    warnLog("init: gameId is required; SDK disabled.");
    state.config = null;
    return undefined;
  }
  state.config = {
    gameId: options.gameId,
    apiEndpoint: (options.apiEndpoint ?? DEFAULT_ENDPOINT).replace(/\/+$/, ""),
    debug: options.debug ?? false,
    autoTrackSession: options.autoTrackSession ?? true,
    trackNetworkErrors: options.trackNetworkErrors ?? false,
    appVersion: options.appVersion ?? "1.0.0",
    buildNumber: options.buildNumber ?? "1",
  };
  return state.config;
}
export function isReady() {
  return state.config !== null;
}
export function getConfig() {
  return state.config;
}
// The console is the only channel an embedded SDK has to surface integrator
// misconfiguration and debug output; these wrappers are the single sanctioned
// use — everything else must go through them.
/* eslint-disable no-console */
export function warnLog(...args) {
  console.warn("[MoonForge]", ...args);
}
export function debugLog(...args) {
  if (state.config?.debug) console.debug("[MoonForge]", ...args);
}
/* eslint-enable no-console */

export function getDistinctId() {
  let id = lget(DISTINCT_ID_KEY);
  if (!id) {
    id = uuid();
    lset(DISTINCT_ID_KEY, id);
  }
  return id;
}
export function setDistinctId(id) {
  if (id) lset(DISTINCT_ID_KEY, id);
}
export function getSessionId() {
  const now = Date.now();
  const last = parseInt(lget(SESSION_TS_KEY) ?? "0", 10);
  let id = lget(SESSION_ID_KEY);
  if (!id || !last || now - last > SESSION_TIMEOUT_MS) {
    id = uuid();
    lset(SESSION_ID_KEY, id);
  }
  lset(SESSION_TS_KEY, String(now));
  return id;
}
export function resetSession() {
  const id = uuid();
  lset(SESSION_ID_KEY, id);
  lset(SESSION_TS_KEY, String(Date.now()));
  return id;
}

export function getUserProps() {
  return { ...state.userProps };
}
export function setUserProp(k, v) {
  state.userProps = { ...state.userProps, [k]: v };
}
export function removeUserProp(k) {
  const n = { ...state.userProps };
  delete n[k];
  state.userProps = n;
}
export function clearUserProps() {
  state.userProps = {};
}
export function resetAll() {
  state.userProps = {};
  state.cacheToken = null;
  setDistinctId(uuid());
  resetSession();
}

export function collectAutoFields() {
  const loc = globalThis.location ?? {};
  const doc = globalThis.document ?? {};
  const nav = globalThis.navigator ?? {};
  const scr = globalThis.screen ?? {};
  return {
    game: state.config?.gameId,
    id: getDistinctId(),
    url: `${loc.pathname ?? ""}${loc.hash ?? ""}`,
    title: doc.title ?? "",
    referrer: doc.referrer ?? "",
    screen: scr.width && scr.height ? `${scr.width}x${scr.height}` : "",
    language: nav.language ?? "",
    hostname: loc.hostname ?? "",
    timestamp: unixSeconds(),
  };
}

// Abort collector requests that hang so slow endpoints can't pin browser
// connections; callers already treat an AbortError as a failed send.
const FETCH_TIMEOUT_MS = 10_000;

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Events emitted before the player is identified are held here.
 *
 * `session_start` fires the moment `init` runs, while the game cannot call
 * `identify` until an async session round trip completes. Sending immediately
 * stamps those events with the anonymous id, and `identify` only takes effect
 * going forward - so the earliest events of every session were permanently
 * unattributable to the account that produced them.
 *
 * Buffering holds them until the id is known, then rewrites and sends. If
 * identification never arrives (a logged-out visitor, a failed session call)
 * the buffer flushes anonymously on a timer, so nothing is lost - it just
 * carries the id it would have had anyway.
 */
const IDENTIFY_GRACE_MS = 10_000;
const MAX_BUFFERED_EVENTS = 50;

let pendingEvents = [];
let identified = false;
let flushTimer = null;

function sendBuffered() {
  const queued = pendingEvents;
  pendingEvents = [];

  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  const id = getDistinctId();

  for (const { payload, opts } of queued) {
    // Rewrite to the id we know now. The payload was built when the event
    // happened, so every other field - timestamp included - stays truthful.
    if (payload?.payload && typeof payload.payload === "object") {
      payload.payload.id = id;
    }
    void deliver(payload, opts);
  }
}

/**
 * Marks the player as identified and releases anything buffered.
 * Called by `identify`; safe to call more than once.
 */
export function markIdentified() {
  if (identified) return;
  identified = true;
  sendBuffered();
}

/** Test seam: clears buffering state between cases. */
export function resetBuffering() {
  pendingEvents = [];
  identified = false;
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
}

export async function postEvent(payload, { beacon = false } = {}) {
  if (!state.config) return false;

  // Beacon events fire at page teardown - buffering one loses it outright.
  // Identify itself must never be buffered; it is what releases the buffer.
  const bufferable = !identified && !beacon && payload?.type !== "identify";

  if (bufferable) {
    if (pendingEvents.length < MAX_BUFFERED_EVENTS) {
      pendingEvents.push({ payload, opts: { beacon } });
    } else {
      debugLog("buffer full, sending anonymously", payload.type);
      return deliver(payload, { beacon });
    }

    if (!flushTimer && typeof setTimeout === "function") {
      flushTimer = setTimeout(() => {
        debugLog("identify grace expired, flushing anonymously");
        sendBuffered();
      }, IDENTIFY_GRACE_MS);
      // Never hold a Node process open on account of analytics.
      flushTimer?.unref?.();
    }

    return true;
  }

  return deliver(payload, { beacon });
}

async function deliver(payload, { beacon = false } = {}) {
  if (!state.config) return false;
  const url = `${state.config.apiEndpoint}/api/send`;
  const body = JSON.stringify(payload);
  if (beacon && typeof globalThis.navigator?.sendBeacon === "function") {
    // sendBeacon returning false (e.g. queue full) is a soft failure — fall
    // through to the fetch(keepalive) path so unload-time events still send.
    try {
      const ok = globalThis.navigator.sendBeacon(
        url,
        new Blob([body], { type: "application/json" }),
      );
      debugLog("beacon", payload.type, ok);
      if (ok) return true;
    } catch (e) {
      debugLog("beacon failed", e);
    }
  }
  try {
    const res = await fetchWithTimeout(url, {
      method: "POST",
      // A mobile browser may background or unload the page before an
      // ordinary fetch completes; keepalive lets the request outlive that,
      // which is how session_start events from mobile players were being
      // lost while their gameplay events still arrived.
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        ...(state.cacheToken ? { "x-moonforge-cache": state.cacheToken } : {}),
      },
      body,
    });
    if (res.ok) {
      try {
        const d = await res.json();
        if (d?.cache) state.cacheToken = d.cache;
      } catch {
        /* no body */
      }
    }
    debugLog("send", payload.type, res.status);
    return res.ok;
  } catch (e) {
    debugLog("send failed", e);
    return false;
  }
}

export async function postError(body) {
  if (!state.config) return false;
  try {
    const res = await fetchWithTimeout(
      `${state.config.apiEndpoint}/api/errors`,
      {
        method: "POST",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    debugLog("error", res.status);
    return res.ok;
  } catch (e) {
    debugLog("error send failed", e);
    return false;
  }
}
