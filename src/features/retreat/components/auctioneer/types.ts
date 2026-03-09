import { BumpkinItem } from "features/game/types/bumpkin";
import { InventoryItemName } from "features/game/types/game";
import { BudNFTName } from "features/game/types/marketplace";
import { PetNFTName } from "features/game/types/pets";

export type RaffleRewards =
  | {
      type: "collectible";
      items: Partial<Record<InventoryItemName, number>>;
    }
  | {
      type: "wearable";
      wearables: Partial<Record<BumpkinItem, number>>;
    }
  | {
      type: "Pet";
      nft: PetNFTName;
      onChain: true;
    }
  | {
      type: "Bud";
      nft: BudNFTName;
      onChain: true;
    };

export type RafflePrize = {
  onChain?: boolean;
} & RaffleRewards;

export type RaffleDefinition = {
  id: string;
  startAt: number;
  endAt: number;
  prizes: Record<number, RafflePrize>;
  entryRequirements: Partial<Record<InventoryItemName, number>>;
};
