import { GameState, InventoryItemName, Wardrobe } from "./game";

export type BonusName =
  | "discord-signup"
  | "pixel-font-bonus"
  | "gam3s-cap"
  | "2026-tiara-wave"
  | "welcome";

export type Bonus = {
  isClaimed: (game: GameState) => boolean;
  reward: {
    wearables: Wardrobe;
    inventory: Partial<Record<InventoryItemName, number>>;
  };
  expiresAt?: number;
};

export const BONUSES: Record<BonusName, Bonus> = {
  welcome: {
    isClaimed: (game) => !!game.farmActivity["welcome Bonus Claimed"],
    reward: {
      wearables: {},
      inventory: {
        Gem: 50,
      },
    },
  },
  "discord-signup": {
    isClaimed: (game) => !!game.wardrobe["Companion Cap"],
    reward: {
      wearables: {
        "Companion Cap": 1,
      },
      inventory: {
        Axe: 5,
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
  "2026-tiara-wave": {
    isClaimed: (game) => !!game.wardrobe["2026 Tiara"],
    reward: {
      wearables: {
        "2026 Tiara": 1,
      },
      inventory: {},
    },
    expiresAt: new Date("2026-01-19T00:00:00Z").getTime(),
  },
};
