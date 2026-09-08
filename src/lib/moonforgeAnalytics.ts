import { MoonForgeAnalytics, MoonForgeErrorTracker } from "lib/moonforge";
import { CONFIG } from "lib/config";

/**
 * MoonForge game analytics for Sunflower Land.
 *
 * Thin wrapper around the MoonForge Web SDK. Keeps every call site in game
 * code down to a one-liner and gives us a single place to swap out or
 * extend the underlying analytics provider.
 *
 * The SDK itself is a safe no-op before `MoonForgeAnalytics.init` has run
 * (e.g. during SSR/build, before app bootstrap completes, or when
 * VITE_MOONFORGE_GAME_ID is not configured), so these helpers do not need
 * their own guards.
 */
export const MOONFORGE_GAME_ID = CONFIG.MOONFORGE_GAME_ID;

/**
 * Tracks a one-off game event with optional properties.
 * Do not include scene, device, or language - these are auto-collected.
 */
export function mfTrack(name: string, data?: Record<string, unknown>): void {
  try {
    MoonForgeAnalytics.trackEvent(name, data);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`MoonForge analytics error: `, e);
  }
}

/**
 * Like `mfTrack`, but also swallows a rejected `trackEvent` promise.
 *
 * `trackEvent` returns `postEvent`'s promise, so a network or collector
 * failure surfaces as a rejection rather than a synchronous throw - which a
 * bare try/catch never sees, leaving an unhandled rejection in the player's
 * browser. Used for the schema-locked events below, where a call site is
 * more likely to be a one-off (a purchase, a tutorial step) whose failure
 * should stay silent.
 */
function mfTrackLocked(name: string, data: Record<string, unknown>): void {
  try {
    const result = MoonForgeAnalytics.trackEvent(name, data) as unknown;

    if (result instanceof Promise) {
      result.catch((e) => {
        // eslint-disable-next-line no-console
        console.log(`MoonForge analytics error: `, e);
      });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`MoonForge analytics error: `, e);
  }
}

/**
 * Tracks a screen/scene view.
 */
export function mfScreen(name: string): void {
  try {
    MoonForgeAnalytics.trackScreenView(name);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`MoonForge analytics error: `, e);
  }
}

/**
 * Identifies the current player for analytics.
 */
export function mfIdentify(
  userId: string,
  traits?: Record<string, unknown>,
): void {
  try {
    MoonForgeAnalytics.identify(userId, traits);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`MoonForge analytics error: `, e);
  }
}

/**
 * Sets the current player on the error tracker, so captured errors are
 * attributed to the right account.
 */
export function mfSetUser(userId: string, tags?: Record<string, string>): void {
  try {
    MoonForgeErrorTracker.setUser(userId, tags);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`MoonForge analytics error: `, e);
  }
}

/**
 * Updates the current scene name on the error tracker's game state, so any
 * error captured afterwards is tagged with where the player is.
 */
export function mfSetScene(sceneName: string): void {
  try {
    MoonForgeErrorTracker.setGameState({ sceneName });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`MoonForge analytics error: `, e);
  }
}

/**
 * Records which variant of an experiment a player was assigned.
 *
 * This does not establish causation on its own. It is what makes a holdout
 * measurable after the fact - without it, the experiment that would settle
 * "does spend drive retention or the reverse" cannot be analysed once it has
 * already run.
 */
export function mfExperiment(experimentId: string, variant: string): void {
  mfTrackLocked("experiment_assigned", {
    experiment_id: experimentId,
    variant,
  });
}

/** One side of an economy transaction: a resource type and its balance
 * before / after the change. `before` / `after` are optional for the ends
 * that are not known (a free reward has no input balance, a pure sink has no
 * output). */
export type EconomyRow = { type: string; before?: number; after?: number };

function flattenEconomyRows(
  data: Record<string, unknown>,
  prefix: "input" | "output",
  rows: EconomyRow[] | undefined,
): void {
  rows?.forEach((row, i) => {
    const n = i + 1;
    data[`${prefix}_${n}_type`] = row.type;
    if (row.before !== undefined) data[`${prefix}_${n}_before`] = row.before;
    if (row.after !== undefined) data[`${prefix}_${n}_after`] = row.after;
  });
}

/**
 * Records one economic state change as the canonical `economy_transaction`
 * event. Game-specific meaning goes in `reason` (e.g. `harvest_crop`,
 * `speed_up_building`), never in the event name.
 *
 * Every input and output is sent as flat `input_N_type/before/after` and
 * `output_N_type/before/after` keys - `N` is unbounded on the collector, so a
 * change with many sides (a land expansion costing 8 resources, a 6-ingredient
 * collectible) is emitted whole, in one event. Free reward -> omit `inputs`;
 * sink with no grant -> omit `outputs`.
 */
export function mfEconomy(
  reason: string,
  opts?: { inputs?: EconomyRow[]; outputs?: EconomyRow[] },
): void {
  const data: Record<string, unknown> = { reason };
  flattenEconomyRows(data, "input", opts?.inputs);
  flattenEconomyRows(data, "output", opts?.outputs);
  mfTrackLocked("economy_transaction", data);
}

type CurrencyBalance = { before: number; after: number };

/**
 * Shorthand for the common case where an economic change only moved the
 * standard currency balances (a reward claim, a currency-only purchase or
 * exchange). Pass the before/after of each balance that could have moved -
 * ones that did not move are dropped. `direction` puts the moved balances on
 * the input side (a spend) or the output side (a grant).
 *
 * For anything that also moves inventory items, use `mfEconomy` directly.
 */
export function mfCurrencyChange(
  reason: string,
  direction: "grant" | "spend",
  balances: {
    coin?: CurrencyBalance;
    sfl?: CurrencyBalance;
    gem?: CurrencyBalance;
    flower?: CurrencyBalance;
  },
): void {
  const rows: EconomyRow[] = [];
  const add = (type: string, b?: CurrencyBalance) => {
    if (b && b.before !== b.after)
      rows.push({ type, before: b.before, after: b.after });
  };
  add("Coin", balances.coin);
  add("SFL", balances.sfl);
  add("Gem", balances.gem);
  add("FLOWER", balances.flower);

  if (rows.length === 0) return;

  mfEconomy(
    reason,
    direction === "grant" ? { outputs: rows } : { inputs: rows },
  );
}

/** Locked revenue event: the player has entered a purchase / checkout flow. */
export function mfIapInitiated(p: {
  product_id: string;
  price: number;
  currency: string;
  product_name?: string;
  store?: string;
}): void {
  const data: Record<string, unknown> = {
    product_id: p.product_id,
    price: p.price,
    currency: p.currency,
  };
  if (p.product_name !== undefined) data.product_name = p.product_name;
  if (p.store !== undefined) data.store = p.store;
  mfTrackLocked("iap_initiated", data);
}

/** Locked revenue event: a purchase has succeeded. `transaction_id` is
 * required - reuse the real id the payment flow already generated so a
 * double-fired success callback de-duplicates. */
export function mfIapCompleted(p: {
  product_id: string;
  price: number;
  currency: string;
  transaction_id: string;
  product_name?: string;
  store?: string;
}): void {
  const data: Record<string, unknown> = {
    product_id: p.product_id,
    price: p.price,
    currency: p.currency,
    transaction_id: p.transaction_id,
  };
  if (p.product_name !== undefined) data.product_name = p.product_name;
  if (p.store !== undefined) data.store = p.store;
  mfTrackLocked("iap_completed", data);
}

/** Locked FTUE event: the onboarding flow has begun. */
export function mfTutorialStart(): void {
  mfTrackLocked("tutorial_start", {});
}

/** Locked FTUE event: the onboarding flow has ended, however it ended. */
export function mfTutorialComplete(outcome?: "completed" | "skipped"): void {
  mfTrackLocked("tutorial_complete", outcome === undefined ? {} : { outcome });
}

export type SignupMethod =
  | "email"
  | "social"
  | "platform"
  | "guest_upgrade"
  | "other";

export type SignupInfo = { signup_method: SignupMethod; provider?: string };

/**
 * Locked account event: a signup has completed.
 *
 * Call `mfIdentify` first, then this - two separate calls, in that order,
 * never inferred from `mfIdentify` alone. A returning player's first
 * `mfIdentify` on a new device is a login, not a signup.
 */
export function mfAccountCreated(p: SignupInfo): void {
  const data: Record<string, unknown> = { signup_method: p.signup_method };
  if (p.provider !== undefined) data.provider = p.provider;
  mfTrackLocked("account_created", data);
}

const signupPendingKey = (farmId: number | string) =>
  `mf_signup_pending_${farmId}`;

/**
 * Records that a signup just completed, keyed to the new farm.
 *
 * `account_created` must fire *after* `mfIdentify` and with the real analytics
 * id, but signup finishes in the auth machine while `mfIdentify` only runs
 * later in the game machine's `initialiseAnalytics`. The auth machine leaves
 * this marker; the game machine turns it into the event via
 * `consumeSignupPending(farmId)`. localStorage rather than a module variable so
 * it survives the auth -> game reload.
 *
 * Scoped per farm so a marker orphaned by an interrupted first load can only
 * ever be consumed by the farm it belongs to - never by the next, unrelated
 * account to sign in on the same browser.
 */
export function markSignupPending(
  farmId: number | string,
  info: SignupInfo,
): void {
  try {
    localStorage.setItem(signupPendingKey(farmId), JSON.stringify(info));
  } catch {
    // Never throws into auth code.
  }
}

/**
 * Reads and clears this farm's signup marker. `undefined` in the common case -
 * a returning player logging in wrote no marker (and a stale marker for a
 * *different* farm is left untouched), so no spurious `account_created`.
 */
export function consumeSignupPending(
  farmId: number | string,
): SignupInfo | undefined {
  try {
    const key = signupPendingKey(farmId);
    const raw = localStorage.getItem(key);
    if (raw === null) return undefined;
    localStorage.removeItem(key);
    return JSON.parse(raw) as SignupInfo;
  } catch {
    return undefined;
  }
}
