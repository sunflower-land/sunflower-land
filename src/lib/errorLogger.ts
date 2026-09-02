import { CONFIG } from "./config";
import { fetchWithRetry } from "./fetchWithRetry";
import { ERRORS } from "./errors";

type Source =
  | "phaser_preloader_scene"
  | "phaser_base_scene"
  | "react_error_modal";

/**
 * Anything we might want to report. Errors are serialised; plain strings are
 * treated as a code when they look like one ("EF-001", "SESSION_EXPIRED"),
 * otherwise as a message; objects may carry the fields below.
 */
export type ErrorReport =
  | Error
  | string
  | {
      /** Client error code shown to the player, e.g. ERRORS.EFFECT_SERVER_ERROR */
      code?: string;
      /** Legacy field: same as `code` when it looks like a code, otherwise a message */
      error?: string;
      message?: string;
      stack?: string;
      /** x-transaction-id of the failed request — lets the API merge this onto the row it already wrote */
      transactionId?: string;
      /** errorId returned by the API, if any */
      errorId?: string;
      /** Failed endpoint, e.g. "POST /autosave" */
      endpoint?: string;
      status?: number;
      meta?: Record<string, unknown>;
    };

const looksLikeErrorCode = (s: unknown): s is string =>
  typeof s === "string" &&
  s.length <= 40 &&
  (/^[A-Z]{2,3}-\d{3}$/.test(s) || /^[A-Z][A-Z0-9_]{3,}$/.test(s));

/**
 * Error codes the backend returns on purpose (400 + errorCode) when a
 * request is rejected by a business rule, plus player-driven rejections
 * (wallet prompts). The API already knows about these — they are outcomes,
 * not bugs — so the client never reports them to /support/errors. Keep in
 * sync with the codes returned by sunflower-land-api domain events.
 */
export const EXPECTED_ERROR_CODES: ReadonlySet<string> = new Set([
  // Trading (sunflower-land-api domain/trading TradeError)
  "ALREADY_BOUGHT",
  "TRADE_NOT_FOUND",
  "INSUFFICIENT_FLOWER",
  "NO_REQUESTED_LISTINGS_AVAILABLE",
  // Marketplace / gems / reset guards
  ERRORS.BUY_GEMS_MARKETPLACE_TRANSFER_IN_PROGRESS,
  ERRORS.BUY_GEMS_MARKETPLACE_UNCLAIMED_LISTINGS,
  ERRORS.RESET_MARKETPLACE_TRANSFER_IN_PROGRESS,
  ERRORS.RESET_MARKETPLACE_UNCLAIMED_LISTINGS,
  // Withdrawals
  ERRORS.WITHDRAW_DUPLICATE,
  "WITHDRAW_DAILY_LIMIT",
  // Accounts / linking / social login
  "USERNAME_TAKEN",
  "IDENTITY_MISMATCH",
  "INVALID_ID_TOKEN",
  "PROVIDER_MISMATCH",
  "NO_SOCIAL_IDENTITY",
  "LINKED_WALLET_REQUIRED",
  "NO_LINKED_WALLET",
  "ADDRESS_IN_USE",
  "NO_POSITIONS",
  ERRORS.WALLET_ALREADY_LINKED,
  ERRORS.SOCIAL_IDENTITY_HAS_FARM,
  ERRORS.LINKED_WALLET_HAS_FARM,
  ERRORS.GOOGLE_LOGIN_DISABLED,
  ERRORS.DISCORD_USER_EXISTS,
  ERRORS.DISCORD_NOT_ON_SERVER,
  "REFERRAL_CODE_NOT_FOUND",
  "ECONOMY_INVALIDATE_COOLDOWN",
  // Twitter showcase
  ERRORS.TWITTER_NOT_CONNECTED,
  ERRORS.TWITTER_ALREADY_SHOWCASED,
  ERRORS.TWITTER_INVALID_URL,
  "TWITTER_NOT_SHOWCASED",
  // Session / rate limiting / maintenance — handled with dedicated UI
  ERRORS.SESSION_EXPIRED,
  // A 401 on a read endpoint: the JWT expired while the tab sat open, or
  // the player signed out in another tab. The answer is always "log in
  // again", never a code change, so it is an outcome like the rest here.
  ERRORS.UNAUTHORIZED,
  ERRORS.MULTIPLE_DEVICES_OPEN,
  ERRORS.TOO_MANY_REQUESTS,
  ERRORS.EFFECT_TOO_MANY_REQUESTS,
  ERRORS.MAINTENANCE,
  ERRORS.SIGN_UP_TOO_MANY_FARMS,
  ERRORS.CLAIM_FARM_TOO_MANY_FARMS,
  // Player declined a wallet prompt
  ERRORS.WEB3_REJECTED,
  ERRORS.REJECTED_TRANSACTION,
]);

export const isExpectedErrorCode = (code: unknown): boolean =>
  typeof code === "string" && EXPECTED_ERROR_CODES.has(code);

/**
 * Messages the browser's fetch() rejects with when a request never got an
 * HTTP response — offline, DNS/TLS failure, connection dropped mid-flight,
 * tab suspended on mobile, navigation aborting in-flight requests, or a
 * VPN/firewall/extension blocking the call. None of these are bugs the API
 * can act on, so they are shown to the player as a connection problem and
 * never reported.
 */
const NETWORK_ERROR_MESSAGES = [
  /^failed to fetch$/i, // Chrome / Edge
  /^networkerror when attempting to fetch resource\.?$/i, // Firefox
  /^load failed$/i, // Safari
  /^network error$/i, // axios / older WebKit
  /^network request failed$/i, // React Native / some WebViews
  /the internet connection appears to be offline/i, // iOS
  /the network connection was lost/i, // iOS
  /a server with the specified hostname could not be found/i, // iOS
  /^cancelled$/i, // iOS aborted request
];

/** Pulls the message out of anything `createErrorLogger` accepts. */
const getErrorMessage = (input: unknown): unknown =>
  input instanceof Error
    ? input.message
    : typeof input === "string"
      ? input
      : input && typeof input === "object"
        ? ((input as { message?: unknown; error?: unknown }).message ??
          (input as { error?: unknown }).error)
        : undefined;

/**
 * True when the error is a browser-level network failure. Accepts anything
 * `createErrorLogger` accepts (Error, string, or the report object).
 */
export const isNetworkError = (input: unknown): boolean => {
  const message = getErrorMessage(input);

  return (
    typeof message === "string" &&
    NETWORK_ERROR_MESSAGES.some((re) => re.test(message.trim()))
  );
};

/**
 * React's commit phase throws these when something outside React has moved the
 * DOM nodes it is tracking — a browser extension, or the browser's own page
 * translation replacing text nodes with <font> wrappers. React then calls
 * insertBefore/removeChild with a reference node that is no longer a child of
 * its parent. Nothing in the fiber tree can be fixed to prevent it, so these
 * are reported under their own code rather than as game crashes.
 */
const EXTERNAL_DOM_MUTATION_MESSAGES = [
  /Failed to execute '(insertBefore|removeChild|appendChild)' on 'Node'/i,
  /The node (before which the new node is to be inserted|to be removed) is not a child of this node/i,
  // Firefox / Safari wording for the same DOM exception
  /Node was not found/i,
  /The object can not be found here/i,
];

/**
 * True when the error came from external DOM mutation rather than the game.
 * Accepts anything `createErrorLogger` accepts (Error, string, report object).
 */
export const isExternalDomMutationError = (input: unknown): boolean => {
  const message = getErrorMessage(input);

  return (
    typeof message === "string" &&
    EXTERNAL_DOM_MUTATION_MESSAGES.some((re) => re.test(message))
  );
};

/** Never sends the same error twice per page load. */
const sent = new Set<string>();

/**
 * Structured payload for sunflower-land-api POST /support/errors. The API
 * titles and groups errors from these fields; a `transactionId`/`errorId`
 * that matches a row the backend already recorded is merged onto that row
 * (backend detail wins) rather than stored again.
 */
export function buildErrorReport(
  source: Source,
  farmId: number,
  input: ErrorReport,
) {
  let code: string | undefined;
  let name: string | undefined;
  let message: string | undefined;
  let stack: string | undefined;
  let transactionId: string | undefined;
  let errorId: string | undefined;
  let endpoint: string | undefined;
  let status: number | undefined;
  let meta: Record<string, unknown> | undefined;

  if (input instanceof Error) {
    const withCode = input as Error & { code?: unknown };
    name = input.name;
    message = input.message;
    stack = input.stack;
    code = looksLikeErrorCode(withCode.code)
      ? withCode.code
      : looksLikeErrorCode(input.message)
        ? input.message
        : undefined;
  } else if (typeof input === "string") {
    if (looksLikeErrorCode(input)) code = input;
    else message = input;
  } else if (input && typeof input === "object") {
    code = looksLikeErrorCode(input.code)
      ? input.code
      : looksLikeErrorCode(input.error)
        ? input.error
        : undefined;
    message =
      input.message ??
      (input.error && !looksLikeErrorCode(input.error)
        ? input.error
        : undefined);
    stack = input.stack;
    transactionId = input.transactionId;
    errorId = input.errorId;
    endpoint = input.endpoint;
    status = input.status;
    meta = input.meta;
  }

  return {
    source,
    farmId,
    transactionId,
    errorId,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    endpoint,
    status,
    code,
    error: { name, message, stack, code },
    meta,
  };
}

export const createErrorLogger = (source: Source, farmId: number) => {
  let errorsEmitted = 3;

  return async (input: ErrorReport) => {
    try {
      // Connection problems are surfaced to the player, not the support tool.
      if (isNetworkError(input)) return;

      const report = buildErrorReport(source, farmId, input);

      // Crashes caused by extensions / browser page translation are not game
      // bugs. Still reported — we want to see whether the notranslate opt-out
      // is working — but under their own code so they group separately
      // instead of drowning out real crashes.
      if (isExternalDomMutationError(input)) {
        report.code = ERRORS.EXTERNAL_DOM_MUTATION;
        report.error.code = ERRORS.EXTERNAL_DOM_MUTATION;
      }

      // Deliberate backend rejections (already_bought, trade_not_found, …)
      // are outcomes the API already knows about — don't pollute the log.
      if (isExpectedErrorCode(report.code)) return;

      const key =
        report.errorId ??
        report.transactionId ??
        `${source}:${report.code ?? ""}:${report.error.message ?? ""}`;
      if (sent.has(key)) return;
      sent.add(key);
      if (errorsEmitted-- <= 0) return;

      await fetchWithRetry(`${CONFIG.API_URL}/support/errors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
        keepalive: true,
      });
    } catch {
      // never let error reporting throw
    }
  };
};
