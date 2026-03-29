import wormery from "assets/buildings/wormery.webp";
import goldenNugget from "assets/icons/golden_nugget.webp";
import worm from "assets/icons/worm.png";
import chickenFeet from "assets/icons/chicken_feet.webp";
import chookIcon from "assets/icons/chook.webp";
import goldenChook from "assets/sfts/golden_chook.png";

/**
 * Local artwork for Chicken Rescue minigame balance keys (mock / future API `tokenImages`).
 * Keys align with `CHICKEN_RESCUE_CONFIG.itemIds`.
 */
export const CHICKEN_RESCUE_MOCK_TOKEN_IMAGES: Record<string, string> = {
  Cluckcoin: goldenNugget,
  Coin: worm,
  FatChicken: wormery,
  LoveChicken: wormery,
  AlienChicken: wormery,
  RoosterChicken: wormery,
  Chook: chookIcon,
  Nugget: chickenFeet,
  GoldenChook: goldenChook,
};
