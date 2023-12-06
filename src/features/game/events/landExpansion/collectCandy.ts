import Decimal from "decimal.js-light";
import { BumpkinItem } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/craftables";
import { GameState, InventoryItemName } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

type ChristmasReward = {
  sfl: number;
  items: Partial<Record<InventoryItemName, number>>;
  wearables: Partial<Record<BumpkinItem, number>>;
};

export const DAILY_CHRISTMAS_REWARDS: Record<number, ChristmasReward> = {
  // 1 - 5 SFL
  1: {
    sfl: 5,
    items: {},
    wearables: {},
  },

  // 2 - Carrot Cake
  2: {
    sfl: 0,
    items: { "Carrot Cake": 1 },
    wearables: {},
  },

  // 3 - Santa Beard
  3: {
    sfl: 0,
    items: {},
    wearables: { "Santa Beard": 1 },
  },

  // 4 - Time Warp Totem
  4: {
    sfl: 0,
    items: { "Time Warp Totem": 1 },
    wearables: {},
  },

  // 5 - 10 Axes
  5: {
    sfl: 0,
    items: { Axe: 10 },
    wearables: {},
  },

  // 6 - Radish Cake
  6: {
    sfl: 0,
    items: { "Radish Cake": 1 },
    wearables: {},
  },

  // 7 - 1 Block Buck
  7: {
    sfl: 0,
    items: { "Block Buck": 1 },
    wearables: {},
  },

  // 8 - Bumpkin Nutcracker
  8: {
    sfl: 0,
    items: { "Bumpkin Nutcracker": 1 },
    wearables: {},
  },

  // 9 - Eggplant Cake
  9: {
    sfl: 0,
    items: { "Eggplant Cake": 1 },
    wearables: {},
  },

  // 10 - 5 Fishing Rod, 5 Earthworm
  10: {
    sfl: 0,
    items: { Rod: 5, Earthworm: 5 },
    wearables: {},
  },

  // 11 - 20 Rapid Root
  11: {
    sfl: 0,
    items: { "Rapid Root": 20 },
    wearables: {},
  },

  // 12 - Festive Tree
  12: {
    sfl: 0,
    items: { "Festive Tree": 1 },
    wearables: {},
  },
};

export type CollectCandyAction = {
  type: "candy.collected";
};

type Options = {
  state: Readonly<GameState>;
  action: CollectCandyAction;
  createdAt?: number;
};

export function getDayOfChristmas(game: GameState, now = Date.now()) {
  const christmas = game.christmas ?? { day: {} };

  const daysCompleted = getKeys(christmas.day).filter(
    (index) =>
      // They have completed the daily requirement
      christmas.day[index].candy >= DAILY_CANDY &&
      // A new day has begun
      new Date(now).getUTCDate() >
        new Date(christmas.day[index].collectedAt).getUTCDate()
  ).length;

  const dayOfChristmas = daysCompleted + 1;

  return {
    daysCompleted,
    dayOfChristmas,
  };
}

export const DAILY_CANDY = 10;

export function collectCandy({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;

  const christmas = game.christmas ?? { day: {} };

  // Which day are they up to in the event
  const { dayOfChristmas, daysCompleted } = getDayOfChristmas(game, createdAt);

  if (daysCompleted >= 12) {
    throw new Error("Event finished");
  }

  const previous = christmas.day[dayOfChristmas]?.candy ?? 0;

  console.log({ daysCompleted, previous });
  if (previous >= 10) {
    throw new Error("Reached daily limit");
  }
  christmas.day[dayOfChristmas] = {
    candy: previous + 1,
    collectedAt: createdAt,
  };

  // Reward
  if (christmas.day[dayOfChristmas].candy === 10) {
    const reward = DAILY_CHRISTMAS_REWARDS[dayOfChristmas];

    if (reward.sfl > 0) {
      game.balance = game.balance.add(reward.sfl);
    }

    if (getKeys(reward.items).length > 0) {
      getKeys(reward.items).forEach((name) => {
        const previous = game.inventory[name] ?? new Decimal(0);
        game.inventory[name] = previous.add(reward.items[name] ?? 0);
      });
    }

    if (getKeys(reward.wearables).length > 0) {
      getKeys(reward.wearables).forEach((name) => {
        const previous = game.wardrobe[name] ?? 0;
        game.wardrobe[name] = previous + (reward.wearables[name] ?? 0);
      });
    }
  }

  game.christmas = christmas;

  return game;
}
