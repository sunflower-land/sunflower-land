import { ALLOWED_BUMPKIN_ITEMS } from "features/game/types/bumpkin";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { Wardrobe } from "features/game/types/game";

/**
 * Default signup wardrobe: one of each allowed item (mirrors API allowed set).
 * Contains no dress items—at signup players must choose shirt and pants.
 */
export function getSignupWardrobe(): Wardrobe {
  return Object.fromEntries(ALLOWED_BUMPKIN_ITEMS.map((name) => [name, 1]));
}

/**
 * Default signup equipment: one valid combination from allowed sets.
 * Uses shirt and pants only (no dress); the signup allowed set has no dress
 * to choose from, so shirt + pants are required. Matches API createRandomBumpkinParts structure.
 */
export const DEFAULT_SIGNUP_EQUIPMENT: BumpkinParts = {
  background: "Farm Background",
  body: "Beige Farmer Potion",
  hair: "Basic Hair",
  shirt: "Red Farmer Shirt",
  pants: "Farmer Pants",
  shoes: "Black Farmer Boots",
  tool: "Farmer Pitchfork",
};

export type Gender = "male" | "female";
