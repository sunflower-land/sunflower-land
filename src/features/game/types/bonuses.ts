import { GameState, InventoryItemName, Wardrobe } from "./game";

export type BonusName = "discord-signup";

export type Bonus = {
  isClaimed: (game: GameState) => boolean;
  reward: {
    wearables: Wardrobe;
    inventory: Partial<Record<InventoryItemName, number>>;
  };
};

const BONUSES: Record<BonusName, Bonus> = {
  "discord-signup": {
    isClaimed: (game) => !game.wardrobe["Community Hat"].gte(1),
    reward: {
      wearables: {},
      inventory: { Axe: 5 },
    },
  },
};
