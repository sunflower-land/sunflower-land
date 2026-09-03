import type { GameState } from "features/game/types/game";

/**
 * Discord, Telegram and X can be unlinked from Settings. Google sign-in is a
 * separate system (see LinkedGooglePanel) and is not covered here.
 *
 * Rules the UI reflects (the server enforces them):
 *  1. A player can unlink any of the three at any time.
 *  2. An unlinked account is locked for 30 days before it can be linked to
 *     any farm, then 90 days on the next unlink, then 180. The server sends
 *     the exact `availableAt`; never compute it client-side.
 *  3. Linking an account that is on another farm pulls it off that farm and
 *     refuses the link until `availableAt`.
 */
export type UnlinkableSocialProvider = "discord" | "twitter" | "telegram";

export const UNLINKABLE_SOCIAL_PROVIDERS: UnlinkableSocialProvider[] = [
  "discord",
  "twitter",
  "telegram",
];

export type SocialUnlinkEvent =
  | "discord.unlinked"
  | "twitter.unlinked"
  | "telegram.unlinked";

export const SOCIAL_UNLINK_EVENTS: Record<
  UnlinkableSocialProvider,
  SocialUnlinkEvent
> = {
  discord: "discord.unlinked",
  twitter: "twitter.unlinked",
  telegram: "telegram.unlinked",
};

/** Player-facing names. X is what the Linked Accounts screen already uses. */
export const SOCIAL_PROVIDER_LABELS: Record<UnlinkableSocialProvider, string> =
  {
    discord: "Discord",
    twitter: "X",
    telegram: "Telegram",
  };

/** Shortest lock after an unlink. Repeat unlinks escalate to 90 then 180. */
export const SOCIAL_UNLINK_MIN_COOLDOWN_DAYS = 30;

/** `data.unlinkingSocial` after a successful `*.unlinked` effect. */
export type SocialUnlinkResult = {
  provider?: UnlinkableSocialProvider;
  availableAt?: number;
};

const isProvider = (value: unknown): value is UnlinkableSocialProvider =>
  typeof value === "string" &&
  (UNLINKABLE_SOCIAL_PROVIDERS as string[]).includes(value);

/** Linked ⇔ the provider key is present on the game state. */
export const isSocialLinked = (
  state: Pick<GameState, UnlinkableSocialProvider>,
  provider: UnlinkableSocialProvider,
): boolean => !!state[provider];

// --- OAuth round trip -------------------------------------------------------
//
// Discord and X link via a full-page redirect through the API. When the API
// refuses the link it redirects back with `?error=CODE&availableAt=...` but
// nothing that says *which* provider was being linked, so we note it before
// leaving and read it back on the error screen.

const LINK_ATTEMPT_KEY = "socialLinkAttempt";

export function rememberSocialLinkAttempt(provider: UnlinkableSocialProvider) {
  try {
    localStorage.setItem(LINK_ATTEMPT_KEY, provider);
  } catch {
    // Storage unavailable (private mode / quota) - the error copy falls
    // back to a generic "social account".
  }
}

export function readSocialLinkAttempt(): UnlinkableSocialProvider | undefined {
  try {
    const value = localStorage.getItem(LINK_ATTEMPT_KEY);
    return isProvider(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function clearSocialLinkAttempt() {
  try {
    localStorage.removeItem(LINK_ATTEMPT_KEY);
  } catch {
    // Nothing to clear
  }
}

/** `?availableAt=` on the OAuth error redirect (epoch ms). */
export function getUrlAvailableAt(): number | undefined {
  const raw = new URLSearchParams(window.location.search).get("availableAt");
  if (!raw) return undefined;

  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

/**
 * Drop `?error=&availableAt=` so a refresh doesn't replay the error. Only
 * those two params go: the app uses hash routing, so the hash (and any
 * other query params) must survive.
 */
export function clearSocialLinkUrlParams() {
  const url = new URL(window.location.href);
  url.searchParams.delete("error");
  url.searchParams.delete("availableAt");
  window.history.pushState({}, "", url.toString());
}

/** `availableAt` in the player's locale, date only - the hour is noise. */
export function formatAvailableAt(availableAt: number): string {
  return new Date(availableAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
