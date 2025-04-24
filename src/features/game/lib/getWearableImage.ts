import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";

export const getWearableImage = (item: BumpkinItem) =>
  new URL(`/src/assets/wearables/${ITEM_IDS[item]}.webp`, import.meta.url).href;
