import { getMinigameTokenImage } from "features/minigame/lib/minigameTokenIcons";

/**
 * Uses API-provided minigame item `image` when present (CDN-relative or absolute).
 * When absent, {@link getMinigameTokenImage} returns the shared placeholder.
 */
export function resolveMarketplaceMinigameItemImage(
  apiImage: string | undefined,
  currencyName: string,
): string {
  const trimmed = apiImage?.trim();
  return getMinigameTokenImage(
    currencyName,
    trimmed ? { [currencyName]: trimmed } : undefined,
  );
}
