import { InventoryItemName } from "./game";

export type BeanName = "Magic Bean";

export type Bean = {
  name: BeanName;
  description: string;
  plantSeconds: number;
};

export const BEANS: () => Record<BeanName, Bean> = () => ({
  "Magic Bean": {
    name: "Magic Bean",
    description: "What will grow?",
    plantSeconds: 2 * 24 * 60 * 60,
  },
});

export function isBean(item: InventoryItemName): item is BeanName {
  return item in BEANS();
}

export type MutantCropName =
  | "Stellar Sunflower"
  | "Potent Potato"
  | "Radical Radish";

export type ExoticCropName =
  | "Black Magic"
  | "Golden Helios"
  | "Chiogga"
  | "Purple Cauliflower"
  | "Adirondack Potato"
  | "Warty Goblin Pumpkin"
  | "White Carrot";

export const EXOTIC_CROPS: Record<ExoticCropName, { description: string }> = {
  "Black Magic": { description: "A dark and mysterious flower!" },
  "Golden Helios": { description: "Sun-kissed grandeur!" },
  Chiogga: { description: "A rainbow beet!" },
  "Purple Cauliflower": { description: "A regal purple cauliflower" },
  "Adirondack Potato": { description: "A rugged spud, Adirondack style!" },
  "Warty Goblin Pumpkin": { description: "A whimsical, wart-covered pumpkin" },
  "White Carrot": { description: "A pale carrot with pale roots" },
};
