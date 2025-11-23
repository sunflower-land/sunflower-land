import { GameState, InventoryItemName, Wardrobe } from "./game";

export type BonusName = "discord-signup" | "pixel-font-bonus" | "gam3s-cap";

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
  "pixel-font-bonus": {
    isClaimed: (game) => !!game.wardrobe["Pixel Perfect Hoodie"],
    reward: {
      wearables: {
        "Pixel Perfect Hoodie": 1,
      },
      inventory: {},
    },
  },
  "gam3s-cap": {
    isClaimed: (game) => !!game.wardrobe["Gam3s Cap"],
    reward: {
      wearables: {
        "Gam3s Cap": 1,
      },
      inventory: {},
    },
  },
};
