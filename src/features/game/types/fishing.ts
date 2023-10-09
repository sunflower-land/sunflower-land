import { Bait } from "./composters";
import { InventoryItemName } from "./game";

export type FishingBait = Bait;

export type FishName = "Sardine" | "Mackerel" | "Salmon";

export const CHUM_AMOUNTS: Partial<Record<InventoryItemName, number>> = {
  Gold: 1,
  Iron: 5,
  Egg: 5,
  Sunflower: 50,
  Potato: 20,
  Pumpkin: 20,
  Cabbage: 10,
  Carrot: 10,
  Beetroot: 10,
  Cauliflower: 5,
  Radish: 5,
  Eggplant: 5,
  Parsnip: 5,
  Wheat: 5,
  Kale: 5,
  Blueberry: 3,
  Orange: 3,
  Apple: 3,
};
