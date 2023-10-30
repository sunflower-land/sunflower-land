export type SeasonName =
  | "Solar Flare"
  | "Dawn Breaker"
  | "Witches' Eve"
  | "Catch the Kraken";

type SeasonDates = { startDate: Date; endDate: Date };

export const SEASONS: Record<SeasonName, SeasonDates> = {
  "Solar Flare": {
    startDate: new Date("2023-01-01T00:00:00.000Z"),
    endDate: new Date("2023-05-01T00:00:00.000Z"),
  },
  "Dawn Breaker": {
    startDate: new Date("2023-05-01T00:00:00.000Z"),
    endDate: new Date("2023-08-01T00:00:00.000Z"),
  },
  "Witches' Eve": {
    startDate: new Date("2023-08-01T00:00:00.000Z"),
    endDate: new Date("2023-11-01T00:00:00.000Z"),
  },
  "Catch the Kraken": {
    startDate: new Date("2023-11-01T00:00:00.000Z"),
    endDate: new Date("2024-02-01T00:00:00.000Z"),
  },
};

export const SEASONAL_TICKETS_PER_GRUB_SHOP_ORDER = 10;

export type SeasonalTicket =
  | "Solar Flare Ticket"
  | "Dawn Breaker Ticket"
  | "Crow Feather"
  | "Mermaid Scale";

type SeasonalBanner =
  | "Solar Flare Banner"
  | "Dawn Breaker Banner"
  | "Witches' Eve Banner"
  | "Catch the Kraken Banner";

export const SEASON_TICKET_NAME: Record<SeasonName, SeasonalTicket> = {
  "Solar Flare": "Solar Flare Ticket",
  "Dawn Breaker": "Dawn Breaker Ticket",
  "Witches' Eve": "Crow Feather",
  "Catch the Kraken": "Mermaid Scale",
};

export function getCurrentSeason(now = new Date()): SeasonName {
  const seasons = Object.keys(SEASONS) as SeasonName[];

  const currentSeason = seasons.find((season) => {
    const { startDate, endDate } = SEASONS[season];

    return now >= startDate && now <= endDate;
  });

  if (!currentSeason) {
    throw new Error("No Season found");
  }

  return currentSeason;
}

/**
 * Preseason is the period where time sensitive features pause (deliveries, chores etc.)
 * This ensures a smooth transition and testing period.
 */
export function isPreSeason(): SeasonName {
  const now = new Date();

  const seasons = Object.keys(SEASONS) as SeasonName[];

  const currentSeason = seasons.find((season) => {
    const { startDate, endDate } = SEASONS[season];

    return now >= startDate && now <= endDate;
  });

  if (!currentSeason) {
    throw new Error("No Season found");
  }

  return currentSeason;
}

export function getSeasonalTicket(): SeasonalTicket {
  const currentSeason = getCurrentSeason();

  return SEASON_TICKET_NAME[currentSeason];
}

export function getSeasonalBanner(): SeasonalBanner {
  const currentSeason = getCurrentSeason();

  return `${currentSeason} Banner`;
}

export function secondsLeftInSeason() {
  const season = getCurrentSeason();

  const times = SEASONS[season];

  const secondsLeft = (times.endDate.getTime() - Date.now()) / 1000;

  return secondsLeft;
}

export function hasSeasonStarted(season: SeasonName, now = Date.now()) {
  return now >= SEASONS[season].startDate.getTime();
}

export function hasSeasonEnded(season: SeasonName, now = Date.now()) {
  return now >= SEASONS[season].endDate.getTime();
}
