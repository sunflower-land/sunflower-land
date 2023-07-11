export type SeasonName = "Solar Flare" | "Dawn Breaker" | "Witches' Eve";

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
};

export const SEASONAL_TICKETS_PER_GRUB_SHOP_ORDER = 10;

type SeasonalTicket =
  | "Solar Flare Ticket"
  | "Dawn Breaker Ticket"
  | "Witches' Eve Ticket";

type SeasonalBanner =
  | "Solar Flare Banner"
  | "Dawn Breaker Banner"
  | "Witches' Eve Banner";

export function getCurrentSeason(): SeasonName {
  const now = new Date();

  console.log({ now });

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

  return `${currentSeason} Ticket`;
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
