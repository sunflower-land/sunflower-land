import { BumpkinItem } from "../types/bumpkin";
import { FactionName, GameState } from "../types/game";
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

const FACTION_OUTFITS: Record<FactionName, Record<OutfitPart, BumpkinItem>> = {
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
) {
  const factionName = game.faction?.name as FactionName;

  let boost = 0;

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].pants,
    })
  ) {
    boost += baseAmount * 0.05;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].shoes,
    })
  ) {
    boost += baseAmount * 0.05;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].tool,
    })
  ) {
    boost += baseAmount * 0.1;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].hat,
    })
  ) {
    boost += baseAmount * 0.1;
  }

  if (
    isWearableActive({
      game,
      name: FACTION_OUTFITS[factionName].shirt,
    })
  ) {
    boost += baseAmount * 0.2;
  }

  return boost;
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
