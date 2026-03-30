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
  GoldenNugget: goldenNugget,
  Worm: worm,
  Wormery: wormery,
  Wormery_2: wormery,
  Wormery_3: wormery,
  Wormery_4: wormery,
  Chook: chookIcon,
  ChickenFeet: chickenFeet,
  GoldenChook: goldenChook,
};
