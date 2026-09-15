/**
 * Turns a signer load failure into something the API can count and read.
 *
 * Shared by index.ts (which sends the result in the sentinel headers) and
 * loader.ts (which uses the same classification to decide whether a stage
 * is worth retrying straight away). Kept in its own module so the loader
 * can import it without a cycle through index.ts.
 */

/**
 * Splits a loader error into the stage that threw (when the loader tagged
 * it — see SignerLoadError), how many attempts it took to fail, and the
 * underlying engine error. Duck-typed rather than instanceof so tests can
 * mock the loader with plain objects.
 */
export function unwrap(e: unknown): {
  stage?: string;
  attempt?: number;
  cause: unknown;
} {
  const wrapped = e as
    | { stage?: unknown; attempt?: unknown; cause?: unknown }
    | undefined;

  return typeof wrapped?.stage === "string" && "cause" in wrapped
    ? {
        stage: wrapped.stage,
        attempt:
          typeof wrapped.attempt === "number" ? wrapped.attempt : undefined,
        cause: wrapped.cause,
      }
    : { cause: e };
}

/**
 * Boils an unknown failure down to a short, header-safe code appended to
 * the sentinel (`incompatible_wasm:csp-blocked`). Without it every one of
 * these looks identical server-side, and "the module would not load" has
 * very different answers depending on whether the fetch never arrived, the
 * bytes would not compile, or the engine refused outright.
 *
 * Ordering matters: Chrome's CSP rejection mentions "WebAssembly" too, so
 * the CSP match must come before the WebAssembly one; likewise a bad MIME
 * type on the .wasm response, and likewise a streaming compile that Chrome
 * aborted because the *network* dropped ("WebAssembly compilation aborted:
 * Network error"), which is a delivery failure and must not land in the
 * non-retryable engine bucket. The engine's error `name` is folded in
 * because CompileError/LinkError carry the type there, not in the message.
 */
export function failureCode(e: unknown): string {
  // Checked before anything else and regardless of what was thrown: the
  // engine has no WebAssembly global at all (iOS Lockdown Mode, hardened
  // Firefox, stripped webviews). A stock desktop browser can never hit
  // this, so any volume of it from modern desktop UAs is a spoofed header.
  if (typeof WebAssembly === "undefined") return "no-wasm-global";

  const { stage, cause } = unwrap(e);
  const error = cause as Error | undefined;
  const text =
    `${error?.name ?? ""} ${error?.message ?? String(cause)}`.toLowerCase();

  if (
    text.includes("content security policy") ||
    text.includes("wasm-eval") ||
    text.includes("unsafe-eval") ||
    text.includes("csp")
  )
    return "csp-blocked";
  // The glue import failing, in each engine's words: Chrome/Firefox say
  // "dynamically imported module", WebKit "Importing a module script
  // failed." — which previously fell through to "unknown".
  if (
    text.includes("dynamically imported module") ||
    text.includes("importing a module script")
  )
    return "import-failed";
  // The .wasm URL answered with something that isn't wasm — a block page,
  // a rewritten 404, a data-saver proxy. The bytes arrived; wrong bytes.
  if (text.includes("mime")) return "bad-mime";
  if (text.includes("compileerror") || text.includes("magic"))
    return "compile-failed";
  if (text.includes("linkerror")) return "link-failed";
  if (
    text.includes("failed to fetch") ||
    text.includes("networkerror") ||
    text.includes("load failed") || // WebKit's fetch-failure TypeError
    // Chrome, when the connection drops mid-download: "WebAssembly
    // compilation aborted: Network error: error", "… Response body
    // loading was aborted". The bytes never arrived; nothing about the
    // engine is wrong.
    text.includes("network error") ||
    text.includes("aborted")
  )
    // Same message, different meaning per stage: the glue script never
    // arrived, or the glue ran and then the .wasm fetch failed.
    return stage === "import" ? "import-failed" : "fetch-failed";
  if (text.includes("webassembly")) return "wasm-unavailable";

  // Unmatched: keep the stage and the error type rather than flattening
  // everything into one "unknown" bucket — those two alone answer most of
  // the mysteries the flat bucket used to hide.
  const name = (error?.name ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const code = name && name !== "error" ? `unknown-${name}` : "unknown";

  return stage ? `${stage}-${code}` : code;
}

/**
 * The raw failure flattened for the `X-Token-Detail` header: stage, the
 * attempt it failed on, error name and message, printable ASCII only,
 * capped. The code above is for counting; this is for reading — the
 * rejection log line then shows exactly what the engine said, so a new
 * failure shape never has to be reverse-engineered from an "unknown"
 * tally, and `[init#3]` against `[init#1]` says whether the retries the
 * loader now makes are buying anything.
 */
export function failureDetail(e: unknown): string {
  const { stage, attempt, cause } = unwrap(e);
  const error = cause as Error | undefined;
  const where = stage
    ? `[${stage}${attempt !== undefined ? `#${attempt}` : ""}] `
    : "";
  const text = `${where}${error?.name ? `${error.name}: ` : ""}${
    error?.message ?? String(cause)
  }`;

  return text
    .replace(/[^\x20-\x7e]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 256);
}

/**
 * Failure codes worth trying again inside the same page session.
 *
 * Only the ones where nothing about the engine is wrong and the module
 * simply never arrived: an ad-blocker or DNS filter, a captive portal, a
 * mobile connection that dropped mid-fetch. Every one of those can be true
 * when `/session` completes and false a minute later.
 *
 * `compile-failed`, `link-failed`, `wasm-unavailable`, `no-wasm-global`,
 * `bad-mime` and `csp-blocked` are deliberately excluded: the bytes
 * arrived and this engine will not run them, so refetching is pure waste
 * on exactly the devices least able to afford it. So is `sign-*` — there
 * the module loaded and traps when used, which reloading does not fix.
 */
export function isTransientFailure(code: string): boolean {
  if (code === "fetch-failed" || code === "import-failed") return true;

  // Unmatched failures keep their stage and error type
  // (`init-unknown-typeerror`). A fetch failing in wording the classifier
  // has not seen still surfaces as a TypeError or a NetworkError, so treat
  // those as network-ish; any other unknown is left alone.
  return /^(?:(?:import|init)-)?unknown(?:-(?:typeerror|networkerror))?$/.test(
    code,
  );
}
