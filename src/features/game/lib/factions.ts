import { KingdomLeaderboard } from "../expansion/components/leaderboard/actions/leaderboard";
import { BoostType, BoostValue } from "../types/boosts";
import { BumpkinItem } from "../types/bumpkin";
import { getKeys } from "../types/decorations";
import {
  FactionBanner,
  FactionName,
  FactionPrize,
  GameState,
  InventoryItemName,
  Wardrobe,
} from "../types/game";
import { isWearableActive } from "./wearables";

export const START_DATE = new Date("2024-06-24T00:00:00Z");

/**
 * Returns the date key for the current faction week
 * Begins on Monday 24th June
 * E.g returns start of the week - "2024-06-24"
 */
export function getWeekKey({
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
  const current = getWeekKey();

  return getWeekKey({
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

export function weekResetsAt({
  date = new Date(),
}: { date?: Date } = {}): number {
  const weekStart = getWeekKey({ date });
  const weekEnd = new Date(
    new Date(weekStart).getTime() + 7 * 24 * 60 * 60 * 1000,
  );

  return weekEnd.getTime();
}

export function secondsTillWeekReset(): number {
  const weekEnd = weekResetsAt();

  const currentTime = Date.now();

  // Calculate the time until the next faction week start in milliseconds
  const timeUntilNextFactionWeek = weekEnd - currentTime;

  // Convert milliseconds to seconds
  const secondsUntilNextFactionWeek = timeUntilNextFactionWeek / 1000;
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
  const start = new Date(getWeekKey({ date }));
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

type OutfitPart = "crown" | "hat" | "shirt" | "pants" | "shoes" | "tool";

export const FACTION_OUTFITS: Record<
  FactionName,
  Record<OutfitPart, BumpkinItem>
> = {
  bumpkins: {
    crown: "Bumpkin Crown",
    hat: "Bumpkin Helmet",
    shirt: "Bumpkin Armor",
    pants: "Bumpkin Pants",
    shoes: "Bumpkin Sabatons",
    tool: "Bumpkin Sword",
  },
  goblins: {
    crown: "Goblin Crown",
    hat: "Goblin Helmet",
    shirt: "Goblin Armor",
    pants: "Goblin Pants",
    shoes: "Goblin Sabatons",
    tool: "Goblin Axe",
  },
  sunflorians: {
    crown: "Sunflorian Crown",
    hat: "Sunflorian Helmet",
    shirt: "Sunflorian Armor",
    pants: "Sunflorian Pants",
    shoes: "Sunflorian Sabatons",
    tool: "Sunflorian Sword",
  },
  nightshades: {
    crown: "Nightshade Crown",
    hat: "Nightshade Helmet",
    shirt: "Nightshade Armor",
    pants: "Nightshade Pants",
    shoes: "Nightshade Sabatons",
    tool: "Nightshade Sword",
  },
};

type MiscPart = "secondaryTool" | "wings" | "necklace";
export const FACTION_ITEMS: Record<
  FactionName,
  Record<MiscPart, BumpkinItem>
> = {
  bumpkins: {
    secondaryTool: "Bumpkin Shield",
    wings: "Bumpkin Quiver",
    necklace: "Bumpkin Medallion",
  },
  goblins: {
    secondaryTool: "Goblin Shield",
    wings: "Goblin Quiver",
    necklace: "Goblin Medallion",
  },
  nightshades: {
    secondaryTool: "Nightshade Shield",
    wings: "Nightshade Quiver",
    necklace: "Nightshade Medallion",
  },
  sunflorians: {
    secondaryTool: "Sunflorian Shield",
    wings: "Sunflorian Quiver",
    necklace: "Sunflorian Medallion",
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
  let boost = 0;
  const boostLabels: Partial<Record<BoostType, BoostValue>> = {};

  const factionName = game.faction?.name;
  if (!factionName) return [boost, boostLabels];

  // Assign the boost amount with each part
  const boosts: Record<OutfitPart, number> = {
    pants: 0.05,
    shoes: 0.05,
    tool: 0.1,
    hat: 0.1,
    crown: 0.1,
    shirt: 0.2,
  };

  // Dynamically sets the boost based on the boost set for each wearable
  for (const wearable of Object.keys(boosts) as (keyof typeof boosts)[]) {
    const wearableName = FACTION_OUTFITS[factionName][wearable];

    // Skip the hat boost if a crown is active
    if (
      wearable === "hat" &&
      isWearableActive({ game, name: FACTION_OUTFITS[factionName].crown })
    ) {
      continue;
    }

    if (isWearableActive({ game, name: wearableName })) {
      boost += baseAmount * boosts[wearable];
      boostLabels[wearableName] = `+${boosts[wearable] * 100}%`;
    }
  }

  return [boost, boostLabels];
}

/**
 * Calculates the decrementing reward amount for the faction kitchen and faction pet
 * @param fulfilledCount number
 * @param basePoints number
 * @param amount number
 * @returns number
 */
export function calculatePoints(
  fulfilledCount: number,
  basePoints: number,
  amount = 1,
): number {
  let points = 0;
  for (let i = 0; i < amount; i++) {
    points += Math.max(basePoints - fulfilledCount * 2, 1);
    fulfilledCount++;
  }

  return points;
}

// Rewarded items from treasury
type MonthlyFactionPrize = {
  wearables?: Wardrobe;
  items?: Partial<Record<InventoryItemName, number>>;
};

export const FACTION_BONUS_WEEKS = [
  "2024-10-28",
  "2024-12-02",
  "2024-12-30",
  "2025-01-27",
  "2025-02-24",
  "2025-03-24",
  "2025-04-28",
  "2025-05-26",
  "2025-06-30",
  "2025-07-28",
  "2025-08-25",
  "2025-09-29",
  "2025-10-27",
  "2025-11-24",
  "2025-12-29",
];

export const FACTION_PRIZES: (week: string) => Record<number, FactionPrize> = (
  week,
) => {
  const isBonusWeek = FACTION_BONUS_WEEKS.includes(week);

  if (isBonusWeek) {
    return {
      1: {
        coins: 64000,
        sfl: 200,
        items: {
          Mark: 10000,
          "Luxury Key": 20,
        },
      },
      2: {
        coins: 50000,
        sfl: 175,
        items: {
          Mark: 8000,
          "Luxury Key": 15,
        },
      },
      3: {
        coins: 44000,
        sfl: 150,
        items: {
          Mark: 7000,
          "Luxury Key": 10,
        },
      },
      4: {
        coins: 36000,
        sfl: 150,
        items: {
          Mark: 6000,
          "Luxury Key": 5,
        },
      },
      5: {
        coins: 32000,
        sfl: 125,
        items: {
          Mark: 5000,
          "Luxury Key": 5,
        },
      },
      6: {
        coins: 25000,
        sfl: 100,
        items: {
          Mark: 5000,
          "Luxury Key": 3,
        },
      },
      7: {
        coins: 25000,
        sfl: 100,
        items: {
          Mark: 5000,
          "Luxury Key": 3,
        },
      },
      8: {
        coins: 25000,
        sfl: 100,
        items: {
          Mark: 5000,
          "Luxury Key": 3,
        },
      },
      9: {
        coins: 25000,
        sfl: 100,
        items: {
          Mark: 5000,
          "Luxury Key": 3,
        },
      },
      10: {
        coins: 25000,
        sfl: 100,
        items: {
          Mark: 5000,
          "Luxury Key": 3,
        },
      },
      // 11th - 25th all get marks
      ...new Array(15)
        .fill({
          coins: 15000,
          sfl: 50,
          items: {
            Mark: 2500,
            "Rare Key": 3,
          },
        })
        .reduce(
          (acc, item, index) => ({
            ...acc,
            [index + 11]: item,
          }),
          {},
        ),
      // 26th - 50th
      ...new Array(25)
        .fill({
          coins: 10000,
          sfl: 0,
          items: {
            Mark: 1500,
            "Treasure Key": 5,
          },
        })
        .reduce(
          (acc, item, index) => ({
            ...acc,
            [index + 26]: item,
          }),
          {},
        ),
      // 51st - 100th get coins and marks
      ...new Array(50)
        .fill({
          coins: 5000,
          sfl: 0,
          items: {
            Mark: 500,
          },
        })
        .reduce(
          (acc, item, index) => ({
            ...acc,
            [index + 51]: item,
          }),
          {},
        ),
    };
  }

  return {
    1: {
      coins: 64000,
      sfl: 200,
      items: {
        Mark: 10000,
      },
    },
    2: {
      coins: 50000,
      sfl: 175,
      items: {
        Mark: 8000,
      },
    },
    3: {
      coins: 44000,
      sfl: 150,
      items: {
        Mark: 7000,
      },
    },
    4: {
      coins: 36000,
      sfl: 150,
      items: {
        Mark: 6000,
      },
    },
    5: {
      coins: 32000,
      sfl: 125,
      items: {
        Mark: 5000,
      },
    },
    6: {
      coins: 25000,
      sfl: 100,
      items: {
        Mark: 5000,
      },
    },
    7: {
      coins: 25000,
      sfl: 100,
      items: {
        Mark: 5000,
      },
    },
    8: {
      coins: 25000,
      sfl: 100,
      items: {
        Mark: 5000,
      },
    },
    9: {
      coins: 25000,
      sfl: 100,
      items: {
        Mark: 5000,
      },
    },
    10: {
      coins: 25000,
      sfl: 100,
      items: {
        Mark: 5000,
      },
    },
    // 11th - 25th all get marks
    ...new Array(15)
      .fill({
        coins: 15000,
        sfl: 50,
        items: {
          Mark: 2500,
        },
      })
      .reduce(
        (acc, item, index) => ({
          ...acc,
          [index + 11]: item,
        }),
        {},
      ),
    // 26th - 50th
    ...new Array(25)
      .fill({
        coins: 10000,
        sfl: 0,
        items: {
          Mark: 1500,
        },
      })
      .reduce(
        (acc, item, index) => ({
          ...acc,
          [index + 26]: item,
        }),
        {},
      ),
    // 51st - 100th get coins and marks
    ...new Array(50)
      .fill({
        coins: 5000,
        sfl: 0,
        items: {
          Mark: 500,
        },
      })
      .reduce(
        (acc, item, index) => ({
          ...acc,
          [index + 51]: item,
        }),
        {},
      ),
  };
};

export const FACTION_BANNERS: Record<FactionName, FactionBanner> = {
  bumpkins: "Bumpkin Faction Banner",
  sunflorians: "Sunflorian Faction Banner",
  goblins: "Goblin Faction Banner",
  nightshades: "Nightshade Faction Banner",
};

export const FACTIONS: FactionName[] = [
  "bumpkins",
  "sunflorians",
  "goblins",
  "nightshades",
];

// Example:
// Week 2 streak achieved = 10% XP during week 3
// Week 4 streak achieved = 20% XP during week 5
// Week 6 streak achieved = 30% XP during week 7
// Week 8 streak achieved = 50% XP during week 9
export function getFactionPetBoostMultiplier(game: GameState) {
  const { faction } = game;

  if (!faction) return 1;

  if (faction.boostCooldownUntil && Date.now() < faction.boostCooldownUntil) {
    return 1;
  }

  const week = getWeekKey({ date: new Date() });
  const lastWeek = getWeekKey({
    date: new Date(new Date(week).getTime() - 7 * 24 * 60 * 60 * 1000),
  });

  const lastWeekStreak =
    game.faction?.history[lastWeek]?.collectivePet?.streak ?? 0;

  if (lastWeekStreak < 2) return 1;

  const qualifiesForBoost = game.faction?.pet?.qualifiesForBoost ?? false;

  if (!qualifiesForBoost) return 1;

  if (lastWeekStreak >= 2 && lastWeekStreak < 4) return 1.1;
  if (lastWeekStreak >= 4 && lastWeekStreak < 6) return 1.2;
  if (lastWeekStreak >= 6 && lastWeekStreak < 8) return 1.3;

  return 1.5;
}

export function getFactionScores({
  leaderboard,
}: {
  leaderboard: KingdomLeaderboard;
}) {
  let scores = {
    bumpkins: 0,
    goblins: 0,
    nightshades: 0,
    sunflorians: 0,
  };

  if (!leaderboard.marks) {
    return { scores };
  }

  scores = leaderboard.marks.score;

  // In the past, faction score was calculated by total marks from faction
  if (new Date(leaderboard.week).getTime() < new Date("2024-08-05").getTime()) {
    scores = leaderboard.marks.totalTickets;
  }

  const winner = getKeys(scores).reduce((winner, name) => {
    return scores[winner] > scores[name] ? winner : name;
  }, "bumpkins");

  return {
    scores,
    winner,
  };
}
