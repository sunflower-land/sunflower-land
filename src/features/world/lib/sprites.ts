import { ITEM_IDS } from "features/game/types/bumpkin";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

export function generateBumpkinSpriteKey(clothing: BumpkinParts) {
  return Object.values(clothing)
    .map((id) => ITEM_IDS[id])
    .sort((a, b) => (a > b ? 1 : -1))
    .join("_");
}
