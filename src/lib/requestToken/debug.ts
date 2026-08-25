/**
 * Step-by-step tracing for the request-token layer.
 *
 * Off by default. Turn it on in the browser console with:
 *
 *   localStorage.setItem("requestTokenDebug", "true"); location.reload();
 *
 * or by loading the page with `?requestTokenDebug=1`. Turn it off with
 * `localStorage.removeItem("requestTokenDebug")`.
 *
 * The session code is only ever printed as a short prefix — enough to
 * confirm the client and server are talking about the same code (the
 * server logs the same prefix), never enough to reuse it. Tokens are
 * printed in full: they are ephemeral (30s window) and comparing the
 * client's token against the server's expected token is the whole point
 * when you are debugging a mismatch.
 */

const STORAGE_KEY = "requestTokenDebug";

let enabled: boolean | undefined;

export function requestTokenDebugEnabled(): boolean {
  if (enabled !== undefined) return enabled;

  try {
    const fromQuery = new URLSearchParams(window.location.search).get(
      STORAGE_KEY,
    );

    if (fromQuery === "1" || fromQuery === "true") {
      localStorage.setItem(STORAGE_KEY, "true");
    }

    enabled = localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    // Private mode / storage disabled — tracing simply stays off.
    enabled = false;
  }

  return enabled;
}

/** Short, non-reusable fingerprint of the session code for correlation. */
export function codePrefix(sessionCode: string | undefined): string {
  if (!sessionCode) return "<none>";
  return `${sessionCode.slice(0, 8)}…(${sessionCode.length} chars)`;
}

export function requestTokenDebug(step: string, values?: unknown): void {
  if (!requestTokenDebugEnabled()) return;

  // eslint-disable-next-line no-console
  console.log(
    `%c[requestToken]%c ${step}`,
    "color:#f0a726;font-weight:bold",
    "color:inherit",
    values ?? "",
  );
}
