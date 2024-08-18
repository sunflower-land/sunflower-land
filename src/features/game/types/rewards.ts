import { SUNNYSIDE } from "assets/sunnyside";
import { getBumpkinLevel } from "../lib/level";
import {
  BumpkinActivityName,
  CookEvent,
  HarvestEvent,
  SellEvent,
} from "./bumpkinActivity";
import { CROPS } from "./crops";
import { getKeys } from "./decorations";
import { GameState, InventoryItemName, Wardrobe } from "./game";
import { ITEM_DETAILS } from "./images";

import levelUp from "assets/icons/level_up.png";
import chefHat from "assets/icons/chef_hat.png";
import shopIcon from "assets/icons/shop.png";

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
  image: string;
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
    image: ITEM_DETAILS.Axe.image,
    requirement: 1,
    reward: {
      coins: 100,
    },
  },
];

export const ONBOARDING_CHALLENGES: DailyChallenge[] = [
  {
    description: "Chop 10 trees",
    image: ITEM_DETAILS.Axe.image,

    requirement: 10,
    progress: ({ game }) => game.bumpkin.activity["Tree Chopped"] ?? 0,
    reward: {
      coins: 10,
    },
  },
  {
    description: "Reach level 2",
    image: levelUp,
    progress: ({ game }) => getBumpkinLevel(game.bumpkin.experience),
    requirement: 2,
    reward: {
      items: { "Mashed Potato": 1 },
    },
  },
  {
    description: "Sell 30 Crops",
    image: ITEM_DETAILS.Sunflower.image,
    progress: ({ game }) => {
      const events = getKeys(CROPS).map((name) => `${name} Sold` as SellEvent);

      return events.reduce((count, activityName) => {
        const amount = game.bumpkin?.activity?.[activityName] || 0;

        return count + amount;
      }, 0);
    },
    requirement: 30,
    reward: {
      items: {
        "Block Buck": 1,
      },
    },
  },
  {
    description: "Complete 2 deliveries",
    image: SUNNYSIDE.icons.player,
    progress: ({ game }) => game.delivery.fulfilledCount,
    requirement: 2,
    reward: {
      items: { "Basic Bear": 1 },
    },
  },

  {
    description: "Unlock a skill",
    image: SUNNYSIDE.icons.heart,
    progress: ({ game }) => Object.keys(game.bumpkin.skills).length,
    requirement: 1,
    reward: {
      coins: 20,
    },
  },
  {
    description: "Mine 5 stones",
    image: ITEM_DETAILS.Pickaxe.image,

    requirement: 5,
    progress: ({ game }) => game.bumpkin.activity["Stone Mined"] ?? 0,
    reward: {
      items: { "Block Buck": 1 },
    },
  },
  {
    description: "Build a Kitchen",
    image: ITEM_DETAILS.Hammer.image,

    requirement: 1,
    progress: ({ game }) => game.inventory.Kitchen?.toNumber() ?? 0,
    reward: {
      items: { Pickaxe: 5 },
    },
  },
  {
    description: "Complete 10 Deliveries",
    image: SUNNYSIDE.icons.player,
    requirement: 10,
    progress: ({ game }) => game.delivery.fulfilledCount,
    reward: {
      items: { Pancakes: 1 },
    },
  },
  {
    description: "Catch an Anchovy",
    image: SUNNYSIDE.tools.fishing_rod,
    requirement: 1,
    progress: ({ game }) => game.farmActivity["Anchovy Caught"] ?? 0,
    reward: {
      coins: 250,
    },
  },
  {
    description: "Complete Hank's Chore",
    image: SUNNYSIDE.icons.hank,
    requirement: 1,
    progress: ({ game }) => game.chores?.choresCompleted ?? 0,
    reward: {
      items: { "Block Buck": 1 },
    },
  },
  {
    description: "Deliver to Pete",
    image: SUNNYSIDE.icons.pete,
    requirement: 1,
    progress: ({ game }) => game.npcs?.["pumpkin' pete"]?.deliveryCount ?? 0,
    reward: {
      items: { "Giant Pumpkin": 1 },
    },
  },
  {
    description: "Buy Megastore Item",
    image: shopIcon,
    requirement: 1,
    progress: ({ game }) => {
      const collectibles = game.megastore.collectibles.filter(
        (item) => !!game.inventory[item.name],
      ).length;
      const wearables = game.megastore.wearables.filter(
        (item) => !!game.wardrobe[item.name],
      ).length;

      return collectibles + wearables;
    },
    reward: {
      coins: 750,
    },
  },
  {
    description: "Upgrade to Spring Paradise",
    image: levelUp,
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
