import { GameState, InventoryItemName, Wardrobe } from "./game";

export type BonusName = "discord-signup" | "2024-nye-bonus";

export type Bonus = {
  isClaimed: (game: GameState) => boolean;
  reward: {
    wearables: Wardrobe;
    inventory: Partial<Record<InventoryItemName, number>>;
  };
};

export const BONUSES: Record<BonusName, Bonus> = {
  "discord-signup": {
    isClaimed: (game) => !!game.wardrobe["Companion Cap"],
    reward: {
      wearables: {
        "Companion Cap": 1,
      },
      inventory: {
        Axe: 5,
        "Community Coin": 1,
      },
    },
  },
  "2024-nye-bonus": {
    isClaimed: (game) => !!game.wardrobe["New Years Tiara"],
    reward: {
      wearables: {
        "New Years Tiara": 1,
      },
      inventory: {},
    },
  },
};
