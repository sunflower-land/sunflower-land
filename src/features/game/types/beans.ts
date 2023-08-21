import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
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

export const EXOTIC_CROPS: Record<
  ExoticCropName,
  { description: string; sellPrice: Decimal }
> = {
  "Black Magic": {
    description: "A dark and mysterious flower!",
    sellPrice: marketRate(32000),
  },
  "Golden Helios": {
    description: "Sun-kissed grandeur!",
    sellPrice: marketRate(16000),
  },
  Chiogga: { description: "A rainbow beet!", sellPrice: marketRate(8000) },
  "Purple Cauliflower": {
    description: "A regal purple cauliflower",
    sellPrice: marketRate(3200),
  },
  "Adirondack Potato": {
    description: "A rugged spud, Adirondack style!",
    sellPrice: marketRate(2400),
  },
  "Warty Goblin Pumpkin": {
    description: "A whimsical, wart-covered pumpkin",
    sellPrice: marketRate(1600),
  },
  "White Carrot": {
    description: "A pale carrot with pale roots",
    sellPrice: marketRate(800),
  },
};
