import { useCallback, useEffect, useRef, useState } from "react";
import { CONFIG } from "lib/config";

type GoogleLinkMessage = {
  type: "sunflower-google-link";
  idToken?: string;
  email?: string;
  error?: string;
};

export type GoogleLinkResult = {
  /** Triggers the popup. Resets `idToken`, `error`, and `popupBlocked`. */
  open: () => void;
  /** True when window.open returned null (popups blocked). */
  popupBlocked: boolean;
  /** Set when the popup posts an error or the URL parse fails. */
  error: string | null;
  /** Captured id_token from a successful popup round-trip. */
  idToken: string | null;
  /** Captured email from the same payload, if Google returned one. */
  email: string | null;
  /** Clear all internal state and discard any pending popup result. */
  reset: () => void;
};

/**
 * Drives the popup-based Google OAuth flow used for both first-time
 * linking and re-auth-before-link ceremonies.
 *
 * Security model:
 *  - Refs track the popup window and the expected origin set at
 *    open-time, so a stale/cross-origin message can't be processed.
 *  - Refs are cleared after consumption to prevent replay.
 *  - If `CONFIG.API_URL` can't be parsed into an origin, `open()` fails
 *    closed (no popup, error surfaced).
 */
export function useGoogleLinkPopup(): GoogleLinkResult {
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const popupRef = useRef<Window | null>(null);
  const expectedOriginRef = useRef<string | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent<GoogleLinkMessage>) => {
      if (!popupRef.current || !expectedOriginRef.current) return;
      if (event.origin !== expectedOriginRef.current) return;
      if (event.source !== popupRef.current) return;
      if (event.data?.type !== "sunflower-google-link") return;

      // Consume the message: clear refs so the same popup can't deliver twice.
      popupRef.current = null;
      expectedOriginRef.current = null;

      if (event.data.error) {
        setError(event.data.error);
        return;
      }
      if (!event.data.idToken) {
        setError("MISSING_ID_TOKEN");
        return;
      }
      setIdToken(event.data.idToken);
      setEmail(event.data.email ?? null);
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const reset = useCallback(() => {
    setPopupBlocked(false);
    setError(null);
    setIdToken(null);
    setEmail(null);
    popupRef.current = null;
    expectedOriginRef.current = null;
  }, []);

  const open = useCallback(() => {
    reset();

    let expectedOrigin: string;
    try {
      expectedOrigin = new URL(CONFIG.API_URL).origin;
    } catch {
      setError("INVALID_API_URL");
      return;
    }

    const popup = window.open(
      `${CONFIG.API_URL}/google/link/authorize`,
      "sunflower-google-link",
      "width=500,height=650",
    );
    if (!popup) {
      setPopupBlocked(true);
      return;
    }

    popupRef.current = popup;
    expectedOriginRef.current = expectedOrigin;
  }, [reset]);

  return { open, popupBlocked, error, idToken, email, reset };
}
