import { BoostType, BoostValue } from "../types/boosts";
import { BumpkinItem } from "../types/bumpkin";
import { FactionName, FactionPrize, GameState } from "../types/game";
import { isWearableActive } from "./wearables";

export const START_DATE = new Date("2024-06-24T00:00:00Z");

/**
 * Returns the date key for the current faction week
 * Begins on Monday 24th June
 * E.g returns start of the week - "2024-06-24"
 */
export function getFactionWeek({
  date = new Date(),
}: { date?: Date } = {}): string {
  const proposedDate = new Date(date);

  // Ensure the provided date is set to the beginning of the day
  proposedDate.setUTCHours(0, 0, 0, 0);

  // Calculate the difference in time (milliseconds) between the provided date and the start date
  const timeDifference = proposedDate.getTime() - START_DATE.getTime();

  // Calculate the difference in days
  const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Calculate the current faction week number
  const weekNumber = Math.floor(dayDifference / 7);

  // Calculate the start date of the current faction week
  const currentFactionWeekStartDate = new Date(START_DATE);
  currentFactionWeekStartDate.setUTCDate(
    START_DATE.getUTCDate() + weekNumber * 7,
  );

  // Format the date as YYYY-MM-DD and return
  return currentFactionWeekStartDate.toISOString().substring(0, 10);
}

export function getPreviousWeek() {
  const current = getFactionWeek();

  return getFactionWeek({
    date: new Date(new Date(current).getTime() - 7 * 24 * 60 * 60 * 1000),
  });
}

/**
 * Returns the week number since the competitions started
 * E.g Week #1, Week #2
 */
export function getWeekNumber({
  date = new Date(),
}: { date?: Date } = {}): number {
  const proposedDate = new Date(date);

  // Ensure the provided date is set to the beginning of the day
  proposedDate.setUTCHours(0, 0, 0, 0);

  // Calculate the difference in time (milliseconds) between the provided date and the start date
  const timeDifference = proposedDate.getTime() - START_DATE.getTime();

  // Calculate the difference in days
  const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Calculate and return the current faction week number (1-based)
  return Math.floor(dayDifference / 7) + 1;
}

export function secondsTillWeekReset(): number {
  const weekStart = getFactionWeek();
  const weekEnd = new Date(
    new Date(weekStart).getTime() + 7 * 24 * 60 * 60 * 1000,
  );

  const currentTime = Date.now();

  // Calculate the time until the next faction week start in milliseconds
  const timeUntilNextFactionWeek = weekEnd.getTime() - currentTime;

  // Convert milliseconds to seconds
  const secondsUntilNextFactionWeek = Math.floor(
    timeUntilNextFactionWeek / 1000,
  );

  return secondsUntilNextFactionWeek;
}

/**
 * Returns the date key for the end of the current faction week
 * If week begins on Monday 24th June then the end of the week is Sunday 30th June at 23:59:59
 * E.g returns end of week unix timestamp
 */
export function getFactionWeekEndTime({
  date = new Date(),
}: { date?: Date } = {}): number {
  const start = new Date(getFactionWeek({ date }));
  start.setUTCDate(start.getUTCDate() + 7);

  return start.getTime();
}

/**
 * Get the current day number of the current faction week.
 * @param now milliseconds since epoch
 * @returns day of the week Mon = 1 Sun = 7 | undefined if the faction week has not started yet
 */
export function getFactionWeekday(now = Date.now()) {
  const day = new Date(now).getUTCDay();

  if (day === 0) return 7;

  return day;
}

type OutfitPart = "hat" | "shirt" | "pants" | "shoes" | "tool";

export const FACTION_OUTFITS: Record<
  FactionName,
  Record<OutfitPart, BumpkinItem>
> = {
  bumpkins: {
    hat: "Bumpkin Helmet",
    shirt: "Bumpkin Armor",
    pants: "Bumpkin Pants",
    shoes: "Bumpkin Sabatons",
    tool: "Bumpkin Sword",
  },
  goblins: {
    hat: "Goblin Helmet",
    shirt: "Goblin Armor",
    pants: "Goblin Pants",
    shoes: "Goblin Sabatons",
    tool: "Goblin Axe",
  },
  sunflorians: {
    hat: "Sunflorian Helmet",
    shirt: "Sunflorian Armor",
    pants: "Sunflorian Pants",
    shoes: "Sunflorian Sabatons",
    tool: "Sunflorian Sword",
  },
  nightshades: {
    hat: "Nightshade Helmet",
    shirt: "Nightshade Armor",
    pants: "Nightshade Pants",
    shoes: "Nightshade Sabatons",
    tool: "Nightshade Sword",
  },
};

/**
 * Returns the total boost gained from faction wearables
 * @param game gameState
 * @param baseAmount base amount to calculate the boost from
 * @returns number total boost amount
 */
export function getFactionWearableBoostAmount(
  game: GameState,
  baseAmount: number,
): [number, Partial<Record<BoostType, BoostValue>>] {
  const factionName = game.faction?.name as FactionName;

  let boost = 0;
  const boostLabels: Partial<Record<BoostType, BoostValue>> = {};

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].pants,
    })
  ) {
    boost += baseAmount * 0.05;
    boostLabels[FACTION_OUTFITS[factionName].pants] = `+${0.05 * 100}%`;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].shoes,
    })
  ) {
    boost += baseAmount * 0.05;
    boostLabels[FACTION_OUTFITS[factionName].shoes] = `+${0.05 * 100}%`;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].tool,
    })
  ) {
    boost += baseAmount * 0.1;
    boostLabels[FACTION_OUTFITS[factionName].tool] = `+${0.1 * 100}%`;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].hat,
    })
  ) {
    boost += baseAmount * 0.1;
    boostLabels[FACTION_OUTFITS[factionName].hat] = `+${0.1 * 100}%`;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].shirt,
    })
  ) {
    boost += baseAmount * 0.2;
    boostLabels[FACTION_OUTFITS[factionName].shirt] = `+${0.2 * 100}%`;
  }

  return [boost, boostLabels] as const;
}

/**
 * Calculates the decrementing reward amount for the faction kitchen and faction pet
 * @param fulfilledCount number
 * @param basePoints number
 * @returns
 */
export function calculatePoints(
  fulfilledCount: number,
  basePoints: number,
): number {
  if (fulfilledCount === 0) return basePoints;

  return Math.max(basePoints - fulfilledCount * 2, 1);
}

export const FACTION_PRIZES: Record<number, FactionPrize> = {
  1: {
    coins: 64000,
    sfl: 200,
    items: {
      Mark: 10000,
      // [getSeasonalTicket()]: 10,
    },
  },
  2: {
    coins: 50000,
    sfl: 175,
    items: {
      Mark: 8000,
      // [getSeasonalTicket()]: 10,
    },
  },
  3: {
    coins: 44000,
    sfl: 150,
    items: {
      Mark: 7000,
      // [getSeasonalTicket()]: 10,
    },
  },
  4: {
    coins: 36000,
    sfl: 150,
    items: {
      Mark: 6000,
      // [getSeasonalTicket()]: 8,
    },
  },
  5: {
    coins: 32000,
    sfl: 125,
    items: {
      Mark: 5000,
      // [getSeasonalTicket()]: 8,
    },
  },
  6: {
    coins: 25000,
    sfl: 100,
    items: {
      Mark: 5000,
      // [getSeasonalTicket()]: 8,
    },
  },
  7: {
    coins: 25000,
    sfl: 100,
    items: {
      Mark: 5000,
      // [getSeasonalTicket()]: 6,
    },
  },
  8: {
    coins: 25000,
    sfl: 100,
    items: {
      Mark: 5000,
      // [getSeasonalTicket()]: 6,
    },
  },
  9: {
    coins: 25000,
    sfl: 100,
    items: {
      Mark: 5000,
      // [getSeasonalTicket()]: 6,
    },
  },
  10: {
    coins: 25000,
    sfl: 100,
    items: {
      Mark: 5000,
      // [getSeasonalTicket()]: 6,
    },
  },
  // 11th - 50th all get 5 seasonal tickets
  ...new Array(40)
    .fill({
      coins: 500,
      sfl: 50,
      items: {
        // [getSeasonalTicket()]: 5,
      },
    })
    .reduce(
      (acc, item, index) => ({
        ...acc,
        [index + 11]: item,
      }),
      {},
    ),
};
