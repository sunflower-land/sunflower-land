# request-token (WASM)

The client half of the anti-bot request-token layer. A small Rust module
that holds the per-session secret in WASM memory and computes one
HMAC-SHA256 token per protected API request:

```
computeToken(sessionId, timestamp, counter)
  = hex(HMAC-SHA256(secret, `${sessionId}:${timestamp}:${counter}`))
```

The server half (secret issuance + verification) lives in
`sunflower-land-api` — see `docs/request-tokens.md` there for the full
design, the protected-endpoint list, and the `REQUEST_TOKENS_MODE`
(off / log / enforce) rollout switch.

## How it's used

- `src/lib/requestToken/index.ts` — `initRequestTokens()` is called inside
  `loadSession()` with the one-time `sessionSecret` from the `/session`
  response; the secret goes straight into WASM and is not kept in JS.
- `secureFetch()` wraps every protected (state-mutating) request: it
  serialises dispatch (so counters arrive at the server in order) and
  attaches `X-Token` / `X-Timestamp` / `X-Counter`.
- If no secret was issued (old API, init failure) the wrapper degrades to
  plain `fetch` — the game never breaks because of this layer.

Be honest about what this buys: the repo is public, so the algorithm is
public. This raises the floor (no raw endpoint scripts, no replays, bots
must maintain live sessions) — it does not prove our client binary ran.

## Building

The compiled artifact is **committed** at `src/lib/requestToken/wasm/` so
contributors don't need a Rust toolchain. Rebuild only when this crate
changes:

```bash
# one-time setup
rustup toolchain install 1.98.0   # pinned in rust-toolchain.toml
cargo install wasm-pack --version 0.15.0 --locked

# test + build (from wasm/request-token/)
cargo test
wasm-pack build --target web --release \
  --out-dir ../../src/lib/requestToken/wasm --out-name request_token
rm -f ../../src/lib/requestToken/wasm/.gitignore \
      ../../src/lib/requestToken/wasm/package.json
```

Commit the regenerated `wasm/` output together with the source change.

CI (`.github/workflows/ci.yml`, job `request-token-wasm`) runs `cargo test`
and rebuilds with the pinned toolchain, failing on any byte difference
between the committed artifact and the source — so the binary in the repo
always provably matches this crate. Keep the toolchain pins
(`rust-toolchain.toml`, wasm-pack version in CI) in sync with what you
build locally, or the byte-diff will fail.

## Browser compatibility

Baseline WebAssembly has shipped in every major engine since 2017 —
including iOS WKWebView (which all iOS browsers and in-app browsers use),
Android WebView (Telegram/Discord/Instagram in-app browsers), and desktop
wrappers. The game already ships another WASM module (`brotli_wasm`).

This module is built with current Rust/wasm-bindgen defaults, which use
post-MVP features (reference types), raising its floor to roughly
**Chrome/Edge 96+, Firefox 79+, Safari 15 / iOS 15+** (all 2021).
wasm-bindgen ≥0.2.100 hard-requires these features, so building for the
2017 baseline would mean pinning an old toolchain.

Instead, `src/lib/requestToken/fallback.ts` covers the gap: if the WASM
module fails to instantiate for any reason (older engine, webview quirk,
CSP without `'wasm-unsafe-eval'`), the wrapper computes byte-identical
tokens via `crypto.subtle` — which the game already hard-requires for
state hashing, so the fallback runs anywhere the game itself runs. No
player can be locked out by WASM support; the WASM path is simply the
preferred (higher-friction) implementation.

## Cross-repo test vector

`token_vector_matches_server` in `src/lib.rs` pins the same
input → token constant as `requestToken.test.ts` in the API repo. If either
side drifts (message layout, encoding), a test fails on that side.
