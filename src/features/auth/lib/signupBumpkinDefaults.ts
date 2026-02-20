import { ALLOWED_BUMPKIN_ITEMS } from "features/game/types/bumpkin";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { Wardrobe } from "features/game/types/game";

/**
 * Default signup wardrobe: one of each allowed item (mirrors API allowed set).
 */
export function getSignupWardrobe(): Wardrobe {
  return Object.fromEntries(
    ALLOWED_BUMPKIN_ITEMS.map((name) => [name, 1]),
  ) as Wardrobe;
}

/**
 * Default signup equipment: one valid combination from allowed sets
 * (required slots only; matches API createRandomBumpkinParts structure).
 */
export const DEFAULT_SIGNUP_EQUIPMENT: BumpkinParts = {
  background: "Farm Background",
  body: "Beige Farmer Potion",
  hair: "Rancher Hair",
  shirt: "Red Farmer Shirt",
  pants: "Farmer Pants",
  shoes: "Black Farmer Boots",
  tool: "Farmer Pitchfork",
};
