import { CONFIG } from "./config";

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
      const report = buildErrorReport(source, farmId, input);
      const key =
        report.errorId ??
        report.transactionId ??
        `${source}:${report.code ?? ""}:${report.error.message ?? ""}`;
      if (sent.has(key)) return;
      sent.add(key);
      if (errorsEmitted-- <= 0) return;

      await fetch(`${CONFIG.API_URL}/support/errors`, {
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
