import { getMinigameTokenImage } from "features/minigame/lib/minigameTokenIcons";

/**
 * Uses API-provided minigame item image when present (CDN-relative or absolute),
 * otherwise falls back to bundled art from the token key.
 */
export function resolveMarketplaceMinigameItemImage(
  apiImage: string | undefined,
  currencyName: string,
): string {
  return getMinigameTokenImage(
    currencyName,
    apiImage ? { [currencyName]: apiImage } : undefined,
  );
}
