import { useSyncExternalStore } from "react";
import { requestTokensInitialised, subscribeRequestTokens } from "./index";

/**
 * Whether the request-token layer has been handed the outcome of the
 * session handshake — the one thing a protected read should wait for
 * before it is worth sending.
 *
 * For hooks that key a fetch (SWR) on it: a request keyed on this only
 * starts once a session code can be signed with, instead of firing at
 * mount as `unsigned:not-initialised`, being rejected, and — for an
 * immutable key — never being asked again. It flips true exactly once per
 * page load, whether the handshake produced a code, no code, or a signer
 * that failed: in every one of those the layer has an answer to send.
 */
export const useRequestTokensReady = (): boolean =>
  useSyncExternalStore(
    subscribeRequestTokens,
    requestTokensInitialised,
    requestTokensInitialised,
  );
