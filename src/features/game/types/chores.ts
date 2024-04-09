import { BumpkinActivityName } from "./bumpkinActivity";
import { InventoryItemName } from "./game";

export type Chore = {
  // Challenges
  activity?: BumpkinActivityName;
  bumpkinLevel?: number;
  expansionCount?: number;
  sfl?: number;

  description: string;
  image?: string;
  introduction?: string;
  requirement: number;
  reward: {
    items?: Partial<Record<InventoryItemName, number>>;
    sfl?: number;
  };
};

// TODO Goals should be means - not do X task - reach level 2, not eat 2 potatos

export const CHORES: Chore[] = [];
