import coinsIcon from "assets/icons/coins.webp";
import cluckCoinIcon from "assets/icons/cluck_coin.webp";
import chookIcon from "assets/icons/chook.webp";
import fatChicken from "assets/animals/chickens/fat_chicken.webp";
import loveChicken from "assets/animals/chickens/love_chicken.webp";
import alienChicken from "assets/sfts/alien_chicken.webp";
import rooster from "assets/animals/chickens/rooster.webp";
import goldenChook from "assets/sfts/golden_chook.png";
import { SUNNYSIDE } from "assets/sunnyside";

/**
 * Local artwork for Chicken Rescue minigame balance keys (mock / future API `tokenImages`).
 * Keys align with `CHICKEN_RESCUE_CONFIG.itemIds`.
 */
export const CHICKEN_RESCUE_MOCK_TOKEN_IMAGES: Record<string, string> = {
  Cluckcoin: cluckCoinIcon,
  Coin: coinsIcon,
  FatChicken: fatChicken,
  Chook: chookIcon,
  Nugget: SUNNYSIDE.resource.sand,
  LoveChicken: loveChicken,
  AlienChicken: alienChicken,
  RoosterChicken: rooster,
  GoldenChook: goldenChook,
};
