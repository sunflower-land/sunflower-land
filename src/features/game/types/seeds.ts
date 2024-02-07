import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { CropName, CropSeedName } from "./crops";
import { FruitName, FruitSeedName, FRUIT_SEEDS } from "./fruits";
import { CONFIG } from "lib/config";
import { SEASONS } from "./seasons";
import { translate } from "lib/i18n/translate";
import { FLOWER_SEEDS, FlowerSeedName } from "./flowers";

export type SeedName = CropSeedName | FruitSeedName | FlowerSeedName;

export type Seed = {
  sfl: Decimal;
  description: string;
  plantSeconds: number;
  bumpkinLevel: number;
  yield?: CropName | FruitName;
  disabled?: boolean;
};

export const CROP_SEEDS: () => Record<CropSeedName, Seed> = () => ({
  "Sunflower Seed": {
    sfl: marketRate(0.01),
    description: translate("description.sunflower"),
    plantSeconds: 60,
    bumpkinLevel: 1,
    yield: "Sunflower",
  },
  "Potato Seed": {
    sfl: marketRate(0.1),
    description: translate("description.potato"),
    plantSeconds: 5 * 60,
    bumpkinLevel: 1,
    yield: "Potato",
  },
  "Pumpkin Seed": {
    description: translate("description.pumpkin"),
    sfl: marketRate(0.2),
    plantSeconds: 30 * 60,
    bumpkinLevel: 2,
    yield: "Pumpkin",
  },
  "Carrot Seed": {
    description: translate("description.carrot"),
    sfl: marketRate(0.5),
    plantSeconds: 60 * 60,
    bumpkinLevel: 2,
    yield: "Carrot",
  },
  "Cabbage Seed": {
    description: translate("description.cabbage"),
    sfl: marketRate(1),
    bumpkinLevel: 3,
    plantSeconds: 2 * 60 * 60,
    yield: "Cabbage",
  },
  "Beetroot Seed": {
    description: translate("description.beetroot"),
    sfl: marketRate(2),
    bumpkinLevel: 3,
    plantSeconds: 4 * 60 * 60,
    yield: "Beetroot",
  },
  "Cauliflower Seed": {
    description: translate("description.cauliflower"),
    sfl: marketRate(3),
    bumpkinLevel: 4,
    plantSeconds: 8 * 60 * 60,
    yield: "Cauliflower",
  },
  "Parsnip Seed": {
    description: translate("description.parsnip"),
    sfl: marketRate(5),
    bumpkinLevel: 4,
    plantSeconds: 12 * 60 * 60,
    yield: "Parsnip",
  },
  "Eggplant Seed": {
    description: translate("description.eggplant"),
    sfl: marketRate(6),
    bumpkinLevel: 5,
    plantSeconds: 16 * 60 * 60,
    yield: "Eggplant",
  },
  "Corn Seed": {
    description: translate("description.corn"),
    sfl: marketRate(7),
    bumpkinLevel: 5,
    plantSeconds: 20 * 60 * 60,
    yield: "Corn",
    disabled:
      CONFIG.NETWORK === "mainnet"
        ? new Date() < SEASONS["Witches' Eve"].startDate
        : false,
  },
  "Radish Seed": {
    description: translate("description.radish"),
    sfl: marketRate(7),
    bumpkinLevel: 5,
    plantSeconds: 24 * 60 * 60,
    yield: "Radish",
  },
  "Wheat Seed": {
    description: translate("description.wheat"),
    sfl: marketRate(5),
    bumpkinLevel: 5,
    plantSeconds: 24 * 60 * 60,
    yield: "Wheat",
  },
  "Kale Seed": {
    sfl: marketRate(7),
    description: translate("description.kale"),
    bumpkinLevel: 7,
    plantSeconds: 36 * 60 * 60,
    yield: "Kale",
  },
});

export const SEEDS: () => Record<SeedName, Seed> = () => ({
  ...CROP_SEEDS(),
  ...FRUIT_SEEDS(),
  ...FLOWER_SEEDS(),
});
