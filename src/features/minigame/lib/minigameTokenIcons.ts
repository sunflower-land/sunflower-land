import wormery from "assets/buildings/wormery.webp";
import goldenNugget from "assets/icons/golden_nugget.webp";
import worm from "assets/icons/worm.png";
import chickenFeet from "assets/icons/chicken_feet.webp";
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
