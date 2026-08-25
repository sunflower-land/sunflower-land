//! Request token computation.
//!
//! The session code is handed to `initSession` once, straight after the
//! `/session` response arrives, and lives only in WASM linear memory from
//! then on. `computeToken` derives one token per protected request:
//!
//!   HMAC-SHA256(sessionCode, "{timestamp}") as lowercase hex
//!
//! The code itself is bound (server-side) to the caller's address and an
//! expiry, so the server can re-derive it from the JWT plus the X-Expires
//! header and check this MAC. The message layout here must match
//! `sunflower-land-api/src/domain/game/lib/requestToken.ts` exactly.
//!
//! There is deliberately no request counter: requests fire concurrently
//! and out of order in the real client, and a counter made that a source
//! of false rejections.

use hmac::{Hmac, Mac};
use sha2::Sha256;
use std::cell::RefCell;
use wasm_bindgen::prelude::*;

type HmacSha256 = Hmac<Sha256>;

thread_local! {
    static SESSION_CODE: RefCell<Option<Vec<u8>>> = const { RefCell::new(None) };
}

/// Store the session code. Called once per session; calling again (e.g.
/// after a re-login) replaces the previous code, which is zeroed before
/// being dropped.
#[wasm_bindgen(js_name = initSession)]
pub fn init_session(code: &str) {
    SESSION_CODE.with(|s| {
        if let Some(old) = s.borrow_mut().take() {
            drop(zero(old));
        }
        *s.borrow_mut() = Some(code.as_bytes().to_vec());
    });
}

/// Forget the session code (logout / session end).
#[wasm_bindgen(js_name = clearSession)]
pub fn clear_session() {
    SESSION_CODE.with(|s| {
        if let Some(old) = s.borrow_mut().take() {
            drop(zero(old));
        }
    });
}

#[wasm_bindgen(js_name = hasSession)]
pub fn has_session() -> bool {
    SESSION_CODE.with(|s| s.borrow().is_some())
}

/// Compute the token for one protected request.
///
/// `timestamp` is unix seconds, formatted in decimal — exactly the value
/// sent in the X-Timestamp header.
#[wasm_bindgen(js_name = computeToken)]
pub fn compute_token(timestamp: u32) -> Result<String, JsError> {
    SESSION_CODE.with(|s| {
        let borrowed = s.borrow();
        let code = borrowed
            .as_ref()
            .ok_or_else(|| JsError::new("Session not initialised"))?;

        Ok(mac_hex(code, timestamp))
    })
}

fn mac_hex(code: &[u8], timestamp: u32) -> String {
    // HMAC accepts any key length, so new_from_slice cannot fail.
    let mut mac = HmacSha256::new_from_slice(code).expect("HMAC accepts any key length");
    mac.update(format!("{timestamp}").as_bytes());
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
        let code = b"0123456789abcdef0123456789abcdef";
        assert_eq!(
            mac_hex(code, 1_700_000_000),
            "6458320a3e327061ab7bfe28ace9cb02bb2b840c75b483a0c002831176bd6256"
        );
    }
}
