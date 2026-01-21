import { BumpkinItem } from "features/game/types/bumpkin";
import { InventoryItemName } from "features/game/types/game";
import { PetNFTName } from "features/game/types/pets";

export type RafflePrize = {
  items?: Partial<Record<InventoryItemName, number>>;
  wearables?: Partial<Record<BumpkinItem, number>>;
  nft?: PetNFTName;
  onChain?: boolean;
};

export type RaffleDefinition = {
  id: string;
  startAt: number;
  endAt: number;
  prizes: Record<number, RafflePrize>;
  entryRequirements: Partial<Record<InventoryItemName, number>>;
};
