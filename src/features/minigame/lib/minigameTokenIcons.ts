import { SUNNYSIDE } from "assets/sunnyside";
import { resolveMinigameCdnImageUrl } from "./resolveMinigameCdnImageUrl";

/** When `items[token].image` is missing or unusable (e.g. load error). */
export const MINIGAME_TOKEN_IMAGE_FALLBACK =
  SUNNYSIDE.icons.expression_confused;

/**
 * URL for a minigame balance token: always from `items[token].image` in `overrides`
 * (session / config). Relative paths are joined with `VITE_PRIVATE_IMAGE_URL` when set.
 * No bundled per-token art — use {@link MINIGAME_TOKEN_IMAGE_FALLBACK} if there is no item image.
 */
export function getMinigameTokenImage(
  token: string,
  overrides?: Record<string, string> | null,
): string {
  const raw = overrides?.[token]?.trim();
  if (raw) {
    return resolveMinigameCdnImageUrl(raw);
  }
  return MINIGAME_TOKEN_IMAGE_FALLBACK;
}
