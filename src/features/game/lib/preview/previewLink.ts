import Decimal from "decimal.js-light";

/**
 * Pure helpers behind the PR-preview "state in the URL" feature.
 *
 * A preview build is an ART_MODE build (no `VITE_API_URL`) synced to a
 * per-PR prefix of the preview S3 bucket. Testers open links like
 *
 *   https://<bucket>.s3.<region>.amazonaws.com/pr-123/index.html?fixture=test&patch=<b64>#/world/plaza
 *
 * and the game boots straight into the described state. This module has no
 * dependency on the game fixtures so it can be imported both by the browser
 * (`previewState.ts`) and by the CI script that validates LLM-generated
 * scenarios (`_scripts/preview/buildPreviewComment.ts`).
 *
 * ## URL parameters
 *
 * - `fixture` — name of the base farm (see `PREVIEW_FIXTURES` in
 *   `previewState.ts`). Defaults to the usual offline farm.
 * - `patch` — a partial `GameState` deep-merged over the fixture, as
 *   base64url(JSON) or raw JSON. `null` deletes a key, arrays replace
 *   wholesale, numbers merged over a `Decimal` become a `Decimal`.
 * - `ls` — base64url(JSON) object of localStorage keys to seed before boot.
 * - `intro=1` — keep the T&C / Pumpkin Pete intro gates (skipped by default
 *   whenever any other preview param is present).
 *
 * Any string value may be a relative-time token so links do not rot:
 *
 * - `$now`, `$now-2h`, `$now+30m` → epoch milliseconds (number)
 * - `$date`, `$date-1d` → ISO-8601 string (for localStorage dates)
 *
 * Units: ms, s, m, h, d, w.
 */

export const PREVIEW_PARAM_NAMES = ["fixture", "patch", "ls", "intro"] as const;
export type PreviewParamName = (typeof PREVIEW_PARAM_NAMES)[number];
export type PreviewParams = Partial<Record<PreviewParamName, string>>;

/**
 * Read preview params from both the real query string and the query string
 * inside the hash (`#/world/plaza?patch=...`), since the app is a HashRouter
 * and testers will type either. The real query string wins on conflict.
 */
export function readPreviewParams(location: {
  search: string;
  hash: string;
}): PreviewParams {
  const hashQuery = location.hash.includes("?")
    ? location.hash.slice(location.hash.indexOf("?"))
    : "";

  const fromHash = new URLSearchParams(hashQuery);
  const fromSearch = new URLSearchParams(location.search);

  const params: PreviewParams = {};
  for (const name of PREVIEW_PARAM_NAMES) {
    const value = fromSearch.get(name) ?? fromHash.get(name);
    if (value !== null && value !== "") params[name] = value;
  }

  return params;
}

export function hasPreviewParams(params: PreviewParams): boolean {
  return PREVIEW_PARAM_NAMES.some((name) => params[name] !== undefined);
}

// --- base64url -------------------------------------------------------------

const utf8ToBinary = (value: string) =>
  encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, hex: string) =>
    String.fromCharCode(parseInt(hex, 16)),
  );

const binaryToUtf8 = (value: string) =>
  decodeURIComponent(
    Array.from(
      value,
      (c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`,
    ).join(""),
  );

export function encodeBase64Url(value: string): string {
  return btoa(utf8ToBinary(value))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (padded.length % 4)) % 4;
  return binaryToUtf8(atob(padded + "=".repeat(padding)));
}

/** JSON object → compact base64url suitable for a query parameter. */
export function encodeJsonParam(value: unknown): string {
  return encodeBase64Url(JSON.stringify(value));
}

/**
 * Accepts either base64url(JSON) or raw JSON (handy when hand-editing a link).
 * Throws on anything that is not a JSON object.
 */
export function decodeJsonParam(value: string): Record<string, unknown> {
  const trimmed = value.trim();
  const json = trimmed.startsWith("{") ? trimmed : decodeBase64Url(trimmed);
  const parsed: unknown = JSON.parse(json);

  if (!isPlainObject(parsed)) {
    throw new Error("Preview param must decode to a JSON object");
  }

  return parsed;
}

// --- relative time tokens --------------------------------------------------

const UNIT_MS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
};

const TIME_TOKEN = /^\$(now|date)(?:([+-])(\d+(?:\.\d+)?)(ms|s|m|h|d|w))?$/;

export function isTimeToken(value: unknown): value is string {
  return typeof value === "string" && TIME_TOKEN.test(value);
}

/**
 * `$now-2h` → `now - 2h` in ms; `$date+1d` → ISO string. Non-token strings
 * are returned unchanged.
 */
export function resolveTimeToken(value: string, now: number): string | number {
  const match = TIME_TOKEN.exec(value);
  if (!match) return value;

  const [, kind, sign, amount, unit] = match;
  const offset = amount ? Number(amount) * UNIT_MS[unit] : 0;
  const resolved = sign === "-" ? now - offset : now + offset;

  return kind === "date" ? new Date(resolved).toISOString() : resolved;
}

// --- deep merge ------------------------------------------------------------

export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  if (Array.isArray(value)) return false;
  if (value instanceof Decimal) return false;
  if (value instanceof Date) return false;
  return true;
}

const resolveLeaf = (value: unknown, now: number): unknown =>
  typeof value === "string" ? resolveTimeToken(value, now) : value;

/**
 * Resolve time tokens anywhere inside a freshly supplied value (one with no
 * base to merge over). `decimal` coerces numeric leaves into Decimals, used
 * when the surrounding record is Decimal-valued (e.g. a new inventory item).
 */
function materialise(value: unknown, now: number, decimal: boolean): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => materialise(item, now, false));
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      if (item === null) continue;
      out[key] = materialise(item, now, false);
    }
    return out;
  }
  const leaf = resolveLeaf(value, now);
  if (decimal && (typeof leaf === "number" || typeof leaf === "string")) {
    return new Decimal(leaf);
  }
  return leaf;
}

const hasDecimalValues = (record: Record<string, unknown>) =>
  Object.values(record).some((v) => v instanceof Decimal);

/**
 * Deep-merge `patch` over `base` without mutating either.
 *
 * - `null` in the patch deletes the key.
 * - Arrays and Decimals/Dates in the patch replace the base value.
 * - A number/string merged over a `Decimal` becomes a `Decimal`; so does a
 *   brand-new key inside a record whose existing values are Decimals.
 * - String leaves that are time tokens are resolved against `now`.
 */
export function applyPatch<T>(
  base: T,
  patch: Record<string, unknown>,
  now: number = Date.now(),
): T {
  return mergeInto(base, patch, now) as T;
}

function mergeInto(base: unknown, patch: unknown, now: number): unknown {
  if (patch === null) return undefined;

  if (!isPlainObject(patch)) {
    const leaf = Array.isArray(patch)
      ? materialise(patch, now, false)
      : resolveLeaf(patch, now);
    if (
      base instanceof Decimal &&
      (typeof leaf === "number" || typeof leaf === "string")
    ) {
      return new Decimal(leaf);
    }
    return leaf;
  }

  if (!isPlainObject(base)) {
    return materialise(patch, now, false);
  }

  const decimalRecord = hasDecimalValues(base);
  const out: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(patch)) {
    if (value === null) {
      delete out[key];
      continue;
    }

    if (key in base) {
      out[key] = mergeInto(base[key], value, now);
    } else {
      out[key] = materialise(value, now, decimalRecord);
    }
  }

  return out;
}

// --- diff (for "copy share link") -----------------------------------------

const leavesEqual = (a: unknown, b: unknown): boolean => {
  if (a instanceof Decimal || b instanceof Decimal) {
    try {
      return new Decimal(a as string | number | Decimal).eq(
        b as string | number | Decimal,
      );
    } catch {
      return false;
    }
  }
  if (a instanceof Date || b instanceof Date) {
    return (
      a instanceof Date && b instanceof Date && a.getTime() === b.getTime()
    );
  }
  if (Array.isArray(a) || Array.isArray(b)) {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return a === b;
};

/**
 * The smallest patch that turns `base` into `current`, i.e. the inverse of
 * `applyPatch`. Keys present in `base` but missing from `current` come back
 * as `null`. Decimals are emitted as strings so they survive JSON.
 */
export function diffState(
  base: unknown,
  current: unknown,
): Record<string, unknown> | undefined {
  if (!isPlainObject(base) || !isPlainObject(current)) return undefined;

  const patch: Record<string, unknown> = {};

  for (const key of new Set([...Object.keys(base), ...Object.keys(current)])) {
    const before = base[key];
    const after = current[key];

    if (after === undefined) {
      if (before !== undefined) patch[key] = null;
      continue;
    }

    if (isPlainObject(before) && isPlainObject(after)) {
      const nested = diffState(before, after);
      if (nested && Object.keys(nested).length > 0) patch[key] = nested;
      continue;
    }

    if (!leavesEqual(before, after)) {
      patch[key] = toJsonValue(after);
    }
  }

  return patch;
}

function toJsonValue(value: unknown): unknown {
  if (value instanceof Decimal) return value.toString();
  if (value instanceof Date) return value.getTime();
  if (Array.isArray(value)) return value.map(toJsonValue);
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      if (item !== undefined) out[key] = toJsonValue(item);
    }
    return out;
  }
  return value;
}

// --- link building ---------------------------------------------------------

export type PreviewLinkInput = {
  /** Origin + pathname of the preview build, e.g. `https://x.workers.dev/`. */
  base: string;
  /** Hash route, e.g. `/` or `/world/plaza`. */
  route?: string;
  fixture?: string;
  patch?: Record<string, unknown>;
  localStorage?: Record<string, unknown>;
  keepIntro?: boolean;
};

/**
 * Build a preview URL. Query params go BEFORE the hash so they are visible
 * to `location.search` regardless of how the router rewrites the hash.
 */
export function buildPreviewLink({
  base,
  route = "/",
  fixture,
  patch,
  localStorage,
  keepIntro,
}: PreviewLinkInput): string {
  const url = new URL(base);
  url.search = "";
  url.hash = "";

  if (fixture) url.searchParams.set("fixture", fixture);
  if (patch && Object.keys(patch).length > 0) {
    url.searchParams.set("patch", encodeJsonParam(patch));
  }
  if (localStorage && Object.keys(localStorage).length > 0) {
    url.searchParams.set("ls", encodeJsonParam(localStorage));
  }
  if (keepIntro) url.searchParams.set("intro", "1");

  const cleanRoute = route.startsWith("/") ? route : `/${route}`;
  url.hash = cleanRoute === "/" ? "" : cleanRoute;

  return url.toString();
}
