import Decimal from "decimal.js-light";
import { CollectibleName } from "./craftables";
import { InventoryItemName } from "./game";

export type BuildingName =
  | "Fire Pit"
  | "Market"
  | "Oven"
  | "Bakery"
  | "Blacksmith"
  | "Workbench"
  | "Tent"
  | "Water Well"
  | "Chicken House";

export type BuildingBluePrint = {
  unlocksAtLevels: number[];
  ingredients: {
    item: InventoryItemName;
    amount: Decimal;
  }[];
  sfl: Decimal;
  constructionSeconds: number;
};

export type PlaceableName = CollectibleName | BuildingName | "Chicken";
