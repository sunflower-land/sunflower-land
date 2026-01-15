import { BumpkinItem } from "features/game/types/bumpkin";
import { InventoryItemName } from "features/game/types/game";

export type RafflePrize = {
  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Partial<Record<BumpkinItem, number>>;
  sfl?: number;
  onChain?: boolean;
};

export type RaffleDefinition = {
  id: string;
  startAt: number;
  endAt: number;
  firstPlace: RafflePrize;
};
