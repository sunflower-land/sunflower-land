import wormery from "assets/buildings/wormery.webp";
import goldenNugget from "assets/icons/golden_nugget.webp";
import worm from "assets/icons/worm.png";
import chickenFeet from "assets/icons/chicken_feet.webp";
import chookIcon from "assets/icons/chook.webp";
import goldenChook from "assets/sfts/golden_chook.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { CONFIG } from "lib/config";
import { resolveMinigameCdnImageUrl } from "./resolveMinigameCdnImageUrl";

function bundledMinigameTokenImage(token: string): string {
  switch (token) {
    case "GoldenNugget":
      return goldenNugget;
    case "Worm":
      return worm;
    case "Wormery":
    case "Wormery_2":
    case "Wormery_3":
    case "Wormery_4":
      return wormery;
    case "ChickenFeet":
      return chickenFeet;
    case "Chook":
      return chookIcon;
    case "GoldenChook":
      return goldenChook;
    default:
      return SUNNYSIDE.ui.coins;
  }
}

/**
 * Resolves `items[token].image` from the session (CDN-relative, absolute, or
 * bundled `/...` URL) and falls back to bundled icons when the payload omits a
 * path or `VITE_PRIVATE_IMAGE_URL` is unset for relative CDN paths.
 */
export function getMinigameTokenImage(
  token: string,
  overrides?: Record<string, string> | null,
): string {
  const fromPayload = overrides?.[token];
  if (fromPayload) {
    const needsBundledFallback =
      !fromPayload.startsWith("http") &&
      !fromPayload.startsWith("/") &&
      !CONFIG.PROTECTED_IMAGE_URL;
    if (needsBundledFallback) {
      return bundledMinigameTokenImage(token);
    }
    return resolveMinigameCdnImageUrl(fromPayload);
  }
  return bundledMinigameTokenImage(token);
}
