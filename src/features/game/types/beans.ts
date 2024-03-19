import { InventoryItemName } from "./game";
import { translate } from "lib/i18n/translate";

export type BeanName = "Magic Bean";

export type Bean = {
  name: BeanName;
  description: string;
  plantSeconds: number;
};

export const BEANS: () => Record<BeanName, Bean> = () => ({
  "Magic Bean": {
    name: "Magic Bean",
    description: translate("description.magic.bean"),
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

export type ExoticCrop = {
  description: string;
  sellPrice: number;
  name: ExoticCropName;
};

export const EXOTIC_CROPS: Record<ExoticCropName, ExoticCrop> = {
  "Black Magic": {
    name: "Black Magic",
    description: translate("description.black.magic"),
    sellPrice: 32000,
  },
  "Golden Helios": {
    name: "Golden Helios",
    description: translate("description.golden.helios"),
    sellPrice: 16000,
  },
  Chiogga: {
    name: "Chiogga",
    description: translate("description.chiogga"),
    sellPrice: 8000,
  },
  "Purple Cauliflower": {
    name: "Purple Cauliflower",
    description: translate("description.purple.cauliflower"),
    sellPrice: 3200,
  },
  "Adirondack Potato": {
    name: "Adirondack Potato",
    description: translate("description.adirondack.potato"),
    sellPrice: 2400,
  },
  "Warty Goblin Pumpkin": {
    name: "Warty Goblin Pumpkin",
    description: translate("description.warty.goblin.pumpkin"),
    sellPrice: 1600,
  },
  "White Carrot": {
    name: "White Carrot",
    description: translate("description.white.carrot"),
    sellPrice: 800,
  },
};
