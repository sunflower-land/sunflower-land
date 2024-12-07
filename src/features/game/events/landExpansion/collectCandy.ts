import Decimal from "decimal.js-light";
import { BumpkinItem } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/craftables";
import { GameState, InventoryItemName } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type ChristmasRewards = {
  sfl: number;
  items: Partial<Record<InventoryItemName, number>>;
  wearables: Partial<Record<BumpkinItem, number>>;
};

export const DAILY_CHRISTMAS_REWARDS: Record<number, ChristmasRewards> = {
  1: {
    sfl: 0,
    items: {},
    wearables: { "Gingerbread Onesie": 1 },
  },
  2: {
    sfl: 0,
    items: { "Carrot Cake": 1 },
    wearables: {},
  },
  3: {
    sfl: 0,
    items: { "Treasure Key": 1 },
    wearables: {},
  },
  4: {
    sfl: 0,
    items: { Axe: 20 },
    wearables: {},
  },
  5: {
    sfl: 0,
    items: { "Christmas Stocking": 1 },
    wearables: {},
  },
  6: {
    sfl: 0,
    items: { "Fishing Lure": 5 },
    wearables: {},
  },
  7: {
    sfl: 0,
    items: { "Barn Delight": 5 },
    wearables: {},
  },
  8: {
    sfl: 0,
    items: { "Rapid Root": 10 },
    wearables: {},
  },
  9: {
    sfl: 0,
    items: { "Cozy Fireplace": 1 },
    wearables: {},
  },
  10: {
    sfl: 0,
    items: { Omnifeed: 10 },
    wearables: {},
  },
  11: {
    sfl: 5,
    items: {},
    wearables: {},
  },
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
  const christmas = game.christmas2024 ?? { day: {} };

  const daysCompleted = getKeys(christmas.day).filter(
    (index) =>
      // They have completed the daily requirement
      christmas.day[index].candy >= DAILY_CANDY &&
      // A new day has begun
      new Date(now).getUTCDate() >
        new Date(christmas.day[index].collectedAt).getUTCDate(),
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

  const christmas = game.christmas2024 ?? { day: {} };

  // Which day are they up to in the event
  const { dayOfChristmas, daysCompleted } = getDayOfChristmas(game, createdAt);

  if (daysCompleted >= 12) {
    throw new Error("Event finished");
  }

  const previous = christmas.day[dayOfChristmas]?.candy ?? 0;

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

  game.christmas2024 = christmas;

  return game;
}
