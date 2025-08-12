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
  | "White Carrot"
  | GiantFruit;

export type GiantFruit = "Giant Orange" | "Giant Apple" | "Giant Banana";

export type ExoticCrop = {
  description: string;
  sellPrice: number;
  name: ExoticCropName;
  disabled: boolean;
};

export const EXOTIC_CROPS: Record<ExoticCropName, ExoticCrop> = {
  "Black Magic": {
    name: "Black Magic",
    description: translate("description.black.magic"),
    sellPrice: 32000,
    disabled: false,
  },
  "Golden Helios": {
    name: "Golden Helios",
    description: translate("description.golden.helios"),
    sellPrice: 16000,
    disabled: false,
  },
  Chiogga: {
    name: "Chiogga",
    description: translate("description.chiogga"),
    sellPrice: 8000,
    disabled: false,
  },
  "Purple Cauliflower": {
    name: "Purple Cauliflower",
    description: translate("description.purple.cauliflower"),
    sellPrice: 3200,
    disabled: false,
  },
  "Adirondack Potato": {
    name: "Adirondack Potato",
    description: translate("description.adirondack.potato"),
    sellPrice: 2400,
    disabled: false,
  },
  "Warty Goblin Pumpkin": {
    name: "Warty Goblin Pumpkin",
    description: translate("description.warty.goblin.pumpkin"),
    sellPrice: 1600,
    disabled: false,
  },
  "White Carrot": {
    name: "White Carrot",
    description: translate("description.white.carrot"),
    sellPrice: 800,
    disabled: false,
  },
  "Giant Orange": {
    name: "Giant Orange",
    description: translate("description.giantOrange"),
    sellPrice: 800,
    disabled: false,
  },
  "Giant Apple": {
    name: "Giant Apple",
    description: translate("description.giantApple"),
    sellPrice: 2000,
    disabled: false,
  },
  "Giant Banana": {
    name: "Giant Banana",
    description: translate("description.giantBanana"),
    sellPrice: 5000,
    disabled: false,
  },
};
