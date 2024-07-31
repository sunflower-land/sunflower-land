import Decimal from "decimal.js-light";
import { InventoryItemName } from "./game";
import { BumpkinItem } from "./bumpkin";
import { SEASONS } from "./seasons";

export type ArtefactWerables = {
  coins: number;
  ingredients: Partial<Record<InventoryItemName, Decimal>>;
  disabled?: boolean;
  hoursPlayed?: number;
  from?: Date;
  to?: Date;
  requiresItem?: InventoryItemName;
};

export type ArtefactShopWearables = Partial<
  Record<BumpkinItem, ArtefactWerables>
>;

export const ARTEFACT_SHOP_WEARABLES: ArtefactShopWearables = {
  "Scarab Wings": {
    coins: 0,
    ingredients: {
      Scarab: new Decimal(150),
    },
    from: SEASONS["Pharaoh's Treasure"].startDate,
    to: SEASONS["Pharaoh's Treasure"].endDate,
  },
};
