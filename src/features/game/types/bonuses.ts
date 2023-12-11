import { GameState, InventoryItemName, Wardrobe } from "./game";

export type BonusName = "discord-signup" | "ygg-giveaway";

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
  "ygg-giveaway": {
    isClaimed: (game) => !!game.wardrobe["Parsnip Horns"],
    reward: {
      wearables: {
        "Parsnip Horns": 1,
      },
      inventory: {},
    },
  },
};
