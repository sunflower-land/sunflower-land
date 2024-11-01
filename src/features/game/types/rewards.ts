import { getBumpkinLevel } from "../lib/level";
import { SellEvent } from "./bumpkinActivity";
import { PLOT_CROPS } from "./crops";
import { getKeys } from "./decorations";
import {
  BB_TO_GEM_RATIO,
  GameState,
  InventoryItemName,
  Wardrobe,
} from "./game";

export type Rewards = {
  challenges: {
    completed: number;
    active: {
      startCount: number;
      index: number;
      completedAt?: number;
    };
  };
};

export type DailyChallenge = {
  description: string;
  requirement: number;
  progress: (options: { game: GameState }) => number;
  reward: {
    coins?: number;
    items?: Partial<Record<InventoryItemName, number>>;
    wearables?: Wardrobe;
  };
};

// Coming soon!
export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    description: "Chop a tree!",
    progress: () => 0,
    requirement: 1,
    reward: {
      coins: 100,
    },
  },
];

export const ONBOARDING_CHALLENGES: DailyChallenge[] = [
  {
    description: "Chop 10 trees",

    requirement: 10,
    progress: ({ game }) => game.bumpkin.activity["Tree Chopped"] ?? 0,
    reward: {
      coins: 10,
    },
  },
  {
    description: "Reach level 2",
    progress: ({ game }) => getBumpkinLevel(game.bumpkin.experience),
    requirement: 2,
    reward: {
      items: { "Mashed Potato": 1 },
    },
  },
  {
    description: "Sell 30 Crops",
    progress: ({ game }) => {
      const events = getKeys(PLOT_CROPS).map(
        (name) => `${name} Sold` as SellEvent,
      );

      return events.reduce((count, activityName) => {
        const amount = game.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 30,
    reward: {
      items: {
        Gem: 1 * BB_TO_GEM_RATIO,
      },
    },
  },
  {
    description: "Complete 2 deliveries",
    progress: ({ game }) => game.delivery.fulfilledCount,
    requirement: 2,
    reward: {
      items: { "Basic Bear": 1 },
    },
  },

  {
    description: "Unlock a skill",
    progress: ({ game }) => Object.keys(game.bumpkin.skills).length,
    requirement: 1,
    reward: {
      coins: 20,
    },
  },
  {
    description: "Mine 3 stones",
    requirement: 3,
    progress: ({ game }) => game.bumpkin.activity["Stone Mined"] ?? 0,
    reward: {
      items: { Gem: 1 * BB_TO_GEM_RATIO },
    },
  },
  {
    description: "Build a Kitchen",
    requirement: 1,
    progress: ({ game }) => game.inventory.Kitchen?.toNumber() ?? 0,
    reward: {
      items: { Pickaxe: 5 },
    },
  },
  {
    description: "Complete 10 Deliveries",
    requirement: 10,
    progress: ({ game }) => game.delivery.fulfilledCount,
    reward: {
      items: { Pancakes: 1 },
    },
  },
  {
    description: "Catch an Anchovy",
    requirement: 1,
    progress: ({ game }) => game.farmActivity["Anchovy Caught"] ?? 0,
    reward: {
      coins: 250,
    },
  },
  {
    description: "Complete Hank's Chore",
    requirement: 1,
    progress: ({ game }) => game.chores?.choresCompleted ?? 0,
    reward: {
      items: { Gem: 1 * BB_TO_GEM_RATIO },
    },
  },
  {
    description: "Deliver to Pete",
    requirement: 1,
    progress: ({ game }) => game.npcs?.["pumpkin' pete"]?.deliveryCount ?? 0,
    reward: {
      items: { "Giant Pumpkin": 1 },
    },
  },
  {
    description: "Buy Megastore Item",
    requirement: 1,
    progress: ({ game }) => {
      const collectibles =
        game.megastore?.collectibles.filter(
          (item) => !!game.inventory[item.name],
        ).length ?? 0;
      const wearables =
        game.megastore?.wearables.filter((item) => !!game.wardrobe[item.name])
          .length ?? 0;

      return collectibles + wearables;
    },
    reward: {
      coins: 750,
    },
  },
  {
    description: "Upgrade to Spring Paradise",
    requirement: 1,
    progress: ({ game }) => (game.island.type === "spring" ? 1 : 0),
    reward: {
      coins: 1000,
      wearables: { "Unicorn Hat": 1 },
      items: { Pickaxe: 10, "Iron Pickaxe": 5 },
    },
  },
];

export const INITIAL_REWARDS: GameState["rewards"] = {
  challenges: {
    completed: 0,
    active: {
      index: 0,
      startCount: 0,
    },
  },
};
