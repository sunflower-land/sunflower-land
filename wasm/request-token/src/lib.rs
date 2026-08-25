//! Per-session request token computation.
//!
//! The session secret is handed to `initSession` once, straight after the
//! `/session` response arrives, and lives only in WASM linear memory from
//! then on. `computeToken` derives one token per protected request:
//!
//!   HMAC-SHA256(secret, "{sessionId}:{timestamp}:{counter}") as lowercase hex
//!
//! The server recomputes the same MAC from the farm document's copy of the
//! secret, so the message layout here must match
//! `sunflower-land-api/src/domain/game/lib/requestToken.ts` exactly.

use hmac::{Hmac, Mac};
use sha2::Sha256;
use std::cell::RefCell;
use wasm_bindgen::prelude::*;

type HmacSha256 = Hmac<Sha256>;

thread_local! {
    static SECRET: RefCell<Option<Vec<u8>>> = const { RefCell::new(None) };
}

/// Store the per-session secret. Called once per session; calling again
/// (e.g. after a re-login) replaces the previous secret, which is zeroed
/// before being dropped.
#[wasm_bindgen(js_name = initSession)]
pub fn init_session(secret: &[u8]) {
    SECRET.with(|s| {
        if let Some(old) = s.borrow_mut().take() {
            drop(zero(old));
        }
        *s.borrow_mut() = Some(secret.to_vec());
    });
}

/// Forget the secret (logout / session end).
#[wasm_bindgen(js_name = clearSession)]
pub fn clear_session() {
    SECRET.with(|s| {
        if let Some(old) = s.borrow_mut().take() {
            drop(zero(old));
        }
    });
}

#[wasm_bindgen(js_name = hasSession)]
pub fn has_session() -> bool {
    SECRET.with(|s| s.borrow().is_some())
}

/// Compute the token for one protected request.
///
/// `timestamp` is unix seconds rounded to the coarse window by the caller;
/// `counter` is the caller's monotonic request counter. Both are formatted
/// in decimal, matching the values sent in the X-Timestamp / X-Counter
/// headers verbatim.
#[wasm_bindgen(js_name = computeToken)]
pub fn compute_token(session_id: &str, timestamp: u32, counter: u32) -> Result<String, JsError> {
    SECRET.with(|s| {
        let borrowed = s.borrow();
        let secret = borrowed
            .as_ref()
            .ok_or_else(|| JsError::new("Session not initialised"))?;

        Ok(mac_hex(secret, session_id, timestamp, counter))
    })
}

fn mac_hex(secret: &[u8], session_id: &str, timestamp: u32, counter: u32) -> String {
    // HMAC accepts any key length, so new_from_slice cannot fail.
    let mut mac = HmacSha256::new_from_slice(secret).expect("HMAC accepts any key length");
    mac.update(format!("{session_id}:{timestamp}:{counter}").as_bytes());
    hex(&mac.finalize().into_bytes())
}

fn hex(bytes: &[u8]) -> String {
    const TABLE: &[u8; 16] = b"0123456789abcdef";
    let mut out = String::with_capacity(bytes.len() * 2);
    for b in bytes {
        out.push(TABLE[(b >> 4) as usize] as char);
        out.push(TABLE[(b & 0x0f) as usize] as char);
    }
    out
}

fn zero(mut v: Vec<u8>) -> Vec<u8> {
    for b in v.iter_mut() {
        *b = 0;
    }
    v
}

#[cfg(test)]
mod tests {
    use super::*;

    // RFC 4231 test case 2: known-answer test for the HMAC-SHA256 core.
    #[test]
    fn hmac_sha256_rfc4231_case2() {
        let mut mac = HmacSha256::new_from_slice(b"Jefe").unwrap();
        mac.update(b"what do ya want for nothing?");
        assert_eq!(
            hex(&mac.finalize().into_bytes()),
            "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843"
        );
    }

    // Pinned end-to-end vector; the server-side test in
    // sunflower-land-api (requestToken.test.ts) pins the same constant, so
    // a drift in message layout on either side fails a test.
    #[test]
    fn token_vector_matches_server() {
        let secret = b"0123456789abcdef0123456789abcdef"; // 32 bytes
        assert_eq!(
            mac_hex(secret, "session-abc", 1_700_000_000, 7),
            "338d69c4d0833fd26ad07e75b8d4ceba6913a59ef8171e1f6b9fd6668968216e"
        );
    }
}
