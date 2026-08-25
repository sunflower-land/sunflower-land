import type { TokenModule } from "./loader";

/**
 * WebCrypto fallback for environments that can't instantiate the WASM
 * module. Modern wasm-bindgen output needs post-2021 engines (reference
 * types — Chrome 96+/Firefox 79+/Safari 15+), and embedded webviews can
 * fail WASM compilation for their own reasons (e.g. a strict CSP without
 * 'wasm-unsafe-eval'). This computes byte-identical tokens, so the server
 * can't tell the difference and no player is ever rejected because their
 * browser can't run WASM.
 *
 * The game already requires `crypto.subtle` (state hashing on every save),
 * so this fallback runs anywhere the game itself runs. The code is
 * imported as a NON-extractable CryptoKey and the string is dropped —
 * comparable to the WASM module's "held in WASM memory" posture.
 */
export function createSubtleFallback(): TokenModule {
  let key: CryptoKey | undefined;

  return {
    async initSession(sessionCode: string) {
      key = await globalThis.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(sessionCode),
        { name: "HMAC", hash: "SHA-256" },
        false, // not extractable — the code can't be read back out
        ["sign"],
      );
    },

    clearSession() {
      key = undefined;
    },

    hasSession() {
      return !!key;
    },

    async computeToken(timestamp: number) {
      if (!key) throw new Error("Session not initialised");

      const message = new TextEncoder().encode(`${timestamp}`);
      const mac = await globalThis.crypto.subtle.sign("HMAC", key, message);

      return Array.from(new Uint8Array(mac))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    },
  };
}
