import Decimal from "decimal.js-light";
import { InventoryItemName } from "./game";
import { BumpkinItem } from "./bumpkin";
import { SEASONS } from "./seasons";

export type ArtefactWearables = {
  coins: number;
  ingredients: Partial<Record<InventoryItemName, Decimal>>;
  from?: Date;
  to?: Date;
  hoursPlayed?: number;
};

export type ArtefactShopWearables = Partial<
  Record<BumpkinItem, ArtefactWearables>
>;

export const ARTEFACT_SHOP_WEARABLES: ArtefactShopWearables = {
  "Bionic Drill": {
    coins: 0,
    ingredients: {
      Hieroglyph: new Decimal(50),
      Sand: new Decimal(300),
    },
  },
};
