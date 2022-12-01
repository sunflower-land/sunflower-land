import Decimal from "decimal.js-light";
import { marketRate } from "../lib/halvening";
import { Inventory } from "./game";

export type BeanName = "Magic Bean" | "Shiny Bean" | "Golden Bean";

export type Bean = {
  name: BeanName;
  sfl: Decimal;
  ingredients: Inventory;
  description: string;
  plantSeconds: number;
};

export const BEANS: () => Record<BeanName, Bean> = () => ({
  "Magic Bean": {
    name: "Magic Bean",
    sfl: marketRate(5),
    ingredients: {
      Wood: new Decimal(30),
      Stone: new Decimal(10),
    },
    description: "What will grow?",
    plantSeconds: 2 * 24 * 60 * 60,
  },
  "Shiny Bean": {
    name: "Shiny Bean",
    sfl: marketRate(10),
    ingredients: {
      Wood: new Decimal(30),
      Iron: new Decimal(10),
    },
    description: "What will grow?",
    plantSeconds: 3 * 24 * 60 * 60,
  },
  "Golden Bean": {
    name: "Golden Bean",
    sfl: marketRate(15),
    ingredients: {
      Wood: new Decimal(30),
      Gold: new Decimal(10),
    },
    description: "What will grow?",
    plantSeconds: 4 * 24 * 60 * 60,
  },
});

export type MutantCropName =
  | "Stellar Sunflower"
  | "Peaceful Potato"
  | "Perky Pumpkin"
  | "Colossal Crop";
