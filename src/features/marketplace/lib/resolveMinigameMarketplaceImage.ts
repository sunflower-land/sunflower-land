import { CONFIG } from "lib/config";
import { getMinigameTokenImage } from "features/minigame/lib/minigameTokenIcons";

/**
 * Uses API-provided minigame item image when present (CDN-relative or absolute),
 * otherwise falls back to bundled art from the token key.
 */
export function resolveMarketplaceMinigameItemImage(
  apiImage: string | undefined,
  currencyName: string,
): string {
  if (apiImage?.startsWith("http")) return apiImage;
  if (apiImage && CONFIG.PROTECTED_IMAGE_URL) {
    return `${CONFIG.PROTECTED_IMAGE_URL.replace(/\/$/, "")}/${apiImage.replace(/^\//, "")}`;
  }
  return getMinigameTokenImage(currencyName);
}
