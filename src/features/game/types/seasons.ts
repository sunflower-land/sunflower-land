// banners
import solarFlareBanner from "assets/decorations/banners/solar_flare_banner.png";
import dawnBreakerBanner from "assets/decorations/banners/dawn_breaker_banner.png";
import witchesEveBanner from "assets/decorations/banners/witches_eve_banner.webp";
import catchTheKrakenBanner from "assets/decorations/banners/catch_the_kraken_banner.webp";
import springBlossomBanner from "assets/decorations/banners/spring_banner.gif";
import clashOfFactionsBanner from "assets/decorations/banners/clash_of_factions_banner.webp";
import pharaohsTreasureBanner from "assets/decorations/banners/pharaohs_treasure_banner.webp";
import { InventoryItemName } from "./game";

export type SeasonName =
  | "Solar Flare"
  | "Dawn Breaker"
  | "Witches' Eve"
  | "Catch the Kraken"
  | "Spring Blossom"
  | "Clash of Factions"
  | "Pharaoh's Treasure";

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
  "Spring Blossom": {
    startDate: new Date("2024-02-01T00:00:00.000Z"),
    endDate: new Date("2024-05-01T00:00:00.000Z"),
  },
  "Clash of Factions": {
    startDate: new Date("2024-05-01T00:00:00.000Z"),
    endDate: new Date("2024-08-01T00:00:00.000Z"),
  },
  "Pharaoh's Treasure": {
    startDate: new Date("2024-08-01T00:00:00.000Z"),
    endDate: new Date("2024-11-01T00:00:00.000Z"),
  },
};

export const SEASONAL_TICKETS_PER_GRUB_SHOP_ORDER = 10;

export type SeasonalTicket =
  | "Solar Flare Ticket"
  | "Dawn Breaker Ticket"
  | "Crow Feather"
  | "Mermaid Scale"
  | "Tulip Bulb"
  | "Scroll"
  | "Amber Fossil";

export type SeasonalBanner =
  | "Solar Flare Banner"
  | "Dawn Breaker Banner"
  | "Witches' Eve Banner"
  | "Catch the Kraken Banner"
  | "Spring Blossom Banner"
  | "Clash of Factions Banner"
  | "Pharaoh's Treasure Banner";

export const SEASONAL_BANNERS: Record<SeasonalBanner, SeasonName> = {
  "Solar Flare Banner": "Solar Flare",
  "Dawn Breaker Banner": "Dawn Breaker",
  "Witches' Eve Banner": "Witches' Eve",
  "Catch the Kraken Banner": "Catch the Kraken",
  "Spring Blossom Banner": "Spring Blossom",
  "Clash of Factions Banner": "Clash of Factions",
  "Pharaoh's Treasure Banner": "Pharaoh's Treasure",
};

export const SEASON_TICKET_NAME: Record<SeasonName, SeasonalTicket> = {
  "Solar Flare": "Solar Flare Ticket",
  "Dawn Breaker": "Dawn Breaker Ticket",
  "Witches' Eve": "Crow Feather",
  "Catch the Kraken": "Mermaid Scale",
  "Spring Blossom": "Tulip Bulb",
  "Clash of Factions": "Scroll",
  "Pharaoh's Treasure": "Amber Fossil",
};

export const SEASON_ARTEFACT_NAME: Record<SeasonName, InventoryItemName> = {
  "Solar Flare": "Scarab",
  "Dawn Breaker": "Scarab",
  "Witches' Eve": "Scarab",
  "Catch the Kraken": "Scarab",
  "Spring Blossom": "Scarab",
  "Clash of Factions": "Scarab",
  "Pharaoh's Treasure": "Scarab",
};

export function getCurrentSeason(now = new Date()): SeasonName {
  const seasons = Object.keys(SEASONS) as SeasonName[];

  const currentSeason = seasons.find((season) => {
    const { startDate, endDate } = SEASONS[season];

    return now >= startDate && now < endDate;
  });

  if (!currentSeason) {
    throw new Error("No Season found");
  }

  return currentSeason;
}

export function getSeasonalTicket(now = new Date()): SeasonalTicket {
  const currentSeason = getCurrentSeason(now);

  return SEASON_TICKET_NAME[currentSeason];
}

export function getSeasonalArtefact(now = new Date()) {
  const currentSeason = getCurrentSeason(now);

  return SEASON_ARTEFACT_NAME[currentSeason];
}

export function getSeasonalBanner(now = new Date()): SeasonalBanner {
  const currentSeason = getCurrentSeason(now);

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

export function getSeasonByBanner(banner: SeasonalBanner): SeasonName {
  return SEASONAL_BANNERS[banner];
}

export function getSeasonalBannerImage() {
  const banners: Record<SeasonalBanner, string> = {
    "Solar Flare Banner": solarFlareBanner,
    "Dawn Breaker Banner": dawnBreakerBanner,
    "Witches' Eve Banner": witchesEveBanner,
    "Catch the Kraken Banner": catchTheKrakenBanner,
    "Spring Blossom Banner": springBlossomBanner,
    "Clash of Factions Banner": clashOfFactionsBanner,
    "Pharaoh's Treasure Banner": pharaohsTreasureBanner,
  };
  return banners[getSeasonalBanner()];
}

function getPreviousSeason(now = new Date()): SeasonName {
  const currentSeason = getCurrentSeason(now);
  const startDateOfCurrentSeason = SEASONS[currentSeason].startDate;

  // Find the season where the end date matches the start date of the current season
  const previousSeason = Object.entries(SEASONS).find(
    ([_, { endDate }]) =>
      endDate.getTime() === startDateOfCurrentSeason.getTime(),
  );

  if (!previousSeason) {
    throw new Error("No previous banner found");
  }

  return previousSeason[0] as SeasonName;
}

export function getPreviousSeasonalBanner(now = new Date()): SeasonalBanner {
  const previousSeason = getPreviousSeason(now);

  return `${previousSeason} Banner`;
}
