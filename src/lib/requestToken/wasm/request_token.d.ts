/* tslint:disable */
/* eslint-disable */

/**
 * Forget the secret (logout / session end).
 */
export function clearSession(): void;

/**
 * Compute the token for one protected request.
 *
 * `timestamp` is unix seconds rounded to the coarse window by the caller;
 * `counter` is the caller's monotonic request counter. Both are formatted
 * in decimal, matching the values sent in the X-Timestamp / X-Counter
 * headers verbatim.
 */
export function computeToken(
  session_id: string,
  timestamp: number,
  counter: number,
): string;

export function hasSession(): boolean;

/**
 * Store the per-session secret. Called once per session; calling again
 * (e.g. after a re-login) replaces the previous secret, which is zeroed
 * before being dropped.
 */
export function initSession(secret: Uint8Array): void;

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly computeToken: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => [number, number, number, number];
  readonly hasSession: () => number;
  readonly initSession: (a: number, b: number) => void;
  readonly clearSession: () => void;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(
  module: { module: SyncInitInput } | SyncInitInput,
): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>,
): Promise<InitOutput>;
