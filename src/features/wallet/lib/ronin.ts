import { GameState, InventoryItemName } from "features/game/types/game";

/**
 * Temporary function to determine if wallet is Ronin
 */
export function isRonin({ game }: { game: GameState }) {
  if (game.nfts?.ronin) {
    return true;
  }

  return false;
}

export type RoninV2PackName =
  | "Bronze Pack"
  | "Silver Pack"
  | "Gold Pack"
  | "Platinum Pack"
  | "Legendary Pack"
  | "Whale Pack";

export const RONIN_BOX_REWARDS: Record<
  RoninV2PackName,
  {
    items: Partial<Record<InventoryItemName, number>>;
    estimatedValue: number;
  }
> = {
  ["Bronze Pack"]: {
    items: { Gem: 50 },
    estimatedValue: 0.5,
  },
  ["Silver Pack"]: {
    items: { Gem: 100, "Time Warp Totem": 1, "Bronze Food Box": 1 },
    estimatedValue: 1,
  },
  ["Gold Pack"]: {
    items: { Gem: 300, "Time Warp Totem": 3, "Silver Food Box": 1 },
    estimatedValue: 3,
  },
  ["Platinum Pack"]: {
    items: {
      Gem: 1000,
      "Gold Food Box": 1,
      "Silver Love Box": 1,
    },
    estimatedValue: 20,
  },
  ["Legendary Pack"]: {
    items: {
      Gem: 5000,
      "Gold Love Box": 1,
      "Gold Food Box": 1,
    },
    estimatedValue: 100,
  },
  ["Whale Pack"]: {
    items: {
      Gem: 10000,
      "Lifetime Farmer Banner": 1,
      // NFT Pet Egg
    },
    estimatedValue: 500,
  },
};
