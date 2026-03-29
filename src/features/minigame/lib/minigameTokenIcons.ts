import cluckCoinIcon from "assets/icons/cluck_coin.webp";
import chookIcon from "assets/icons/chook.webp";
import goldenChook from "assets/sfts/golden_chook.png";
import { SUNNYSIDE } from "assets/sunnyside";

/** Default icons when the minigame payload does not supply `tokenImages`. */
export function getMinigameTokenImage(
  token: string,
  overrides?: Record<string, string> | null,
): string {
  const fromPayload = overrides?.[token];
  if (fromPayload) return fromPayload;

  switch (token) {
    case "Cluckcoin":
      return cluckCoinIcon;
    case "Coin":
      return SUNNYSIDE.ui.coinsImg;
    case "Chook":
      return chookIcon;
    case "FatChicken":
    case "LoveChicken":
    case "AlienChicken":
    case "RoosterChicken":
      return SUNNYSIDE.resource.chicken;
    case "Nugget":
      return SUNNYSIDE.resource.sand;
    case "GoldenChook":
      return goldenChook;
    default:
      return SUNNYSIDE.ui.coins;
  }
}
