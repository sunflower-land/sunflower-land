// banners
import solarFlareBanner from "assets/decorations/banners/solar_flare_banner.png";
import dawnBreakerBanner from "assets/decorations/banners/dawn_breaker_banner.png";
import witchesEveBanner from "assets/decorations/banners/witches_eve_banner.webp";
import catchTheKrakenBanner from "assets/decorations/banners/catch_the_kraken_banner.webp";
import springBlossomBanner from "assets/decorations/banners/spring_banner.gif";
import clashOfFactionsBanner from "assets/decorations/banners/clash_of_factions_banner.webp";
import pharaohsTreasureBanner from "assets/decorations/banners/pharaohs_treasure_banner.webp";
import bullsRunBanner from "assets/decorations/banners/bull_run_banner.webp";
import windsOfChangeBanner from "assets/decorations/banners/winds-of-change_banner_loop.gif";
import greatBloomBanner from "assets/decorations/banners/great_bloom_banner.png";
import betterTogetherBanner from "assets/decorations/banners/better_together_banner.webp";
import pawPrintsBanner from "assets/decorations/banners/paw_prints_banner.webp";
import { BeachBountyChapterArtefact } from "./treasure";
import { getKeys } from "./decorations";
import { ChapterFish } from "./fishing";
import { getObjectEntries } from "../expansion/lib/utils";

export type ChapterName =
  | "Solar Flare"
  | "Dawn Breaker"
  | "Witches' Eve"
  | "Catch the Kraken"
  | "Spring Blossom"
  | "Clash of Factions"
  | "Pharaoh's Treasure"
  | "Bull Run"
  | "Winds of Change"
  | "Great Bloom"
  | "Better Together"
  | "Paw Prints";

type ChapterDates = { startDate: Date; endDate: Date };

export const CHAPTERS: Record<ChapterName, ChapterDates> = {
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
  "Bull Run": {
    startDate: new Date("2024-11-01T00:00:00.000Z"),
    endDate: new Date("2025-02-03T00:00:00.000Z"),
  },
  "Winds of Change": {
    startDate: new Date("2025-02-03T00:00:00.000Z"),
    endDate: new Date("2025-05-01T00:00:00.000Z"),
  },
  "Great Bloom": {
    startDate: new Date("2025-05-01T00:00:00.000Z"),
    endDate: new Date("2025-08-04T00:00:00.000Z"),
  },
  "Better Together": {
    startDate: new Date("2025-08-04T00:00:00.000Z"),
    endDate: new Date("2025-11-03T00:00:00.000Z"),
  },
  "Paw Prints": {
    startDate: new Date("2025-11-03T00:00:00.000Z"),
    endDate: new Date("2026-02-02T00:00:00.000Z"),
  },
};

export type ChapterTicket =
  | "Solar Flare Ticket"
  | "Dawn Breaker Ticket"
  | "Crow Feather"
  | "Mermaid Scale"
  | "Tulip Bulb"
  | "Scroll"
  | "Amber Fossil"
  | "Horseshoe"
  | "Timeshard"
  | "Geniseed"
  | "Bracelet"
  | "Pet Cookie";

export type ChapterBanner = `${ChapterName} Banner`;

export const CHAPTER_BANNERS: Record<ChapterBanner, ChapterName> = {
  "Solar Flare Banner": "Solar Flare",
  "Dawn Breaker Banner": "Dawn Breaker",
  "Witches' Eve Banner": "Witches' Eve",
  "Catch the Kraken Banner": "Catch the Kraken",
  "Spring Blossom Banner": "Spring Blossom",
  "Clash of Factions Banner": "Clash of Factions",
  "Pharaoh's Treasure Banner": "Pharaoh's Treasure",
  "Bull Run Banner": "Bull Run",
  "Winds of Change Banner": "Winds of Change",
  "Great Bloom Banner": "Great Bloom",
  "Better Together Banner": "Better Together",
  "Paw Prints Banner": "Paw Prints",
};

export const CHAPTER_TICKET_NAME: Record<ChapterName, ChapterTicket> = {
  "Solar Flare": "Solar Flare Ticket",
  "Dawn Breaker": "Dawn Breaker Ticket",
  "Witches' Eve": "Crow Feather",
  "Catch the Kraken": "Mermaid Scale",
  "Spring Blossom": "Tulip Bulb",
  "Clash of Factions": "Scroll",
  "Pharaoh's Treasure": "Amber Fossil",
  "Bull Run": "Horseshoe",
  "Winds of Change": "Timeshard",
  "Great Bloom": "Geniseed",
  "Better Together": "Bracelet",
  "Paw Prints": "Pet Cookie",
};

export const CHAPTER_ARTEFACT_NAME: Record<
  ChapterName,
  BeachBountyChapterArtefact
> = {
  "Solar Flare": "Scarab",
  "Dawn Breaker": "Scarab",
  "Witches' Eve": "Scarab",
  "Catch the Kraken": "Scarab",
  "Spring Blossom": "Scarab",
  "Clash of Factions": "Scarab",
  "Pharaoh's Treasure": "Scarab",
  "Bull Run": "Cow Skull",
  "Winds of Change": "Ancient Clock",
  "Great Bloom": "Broken Pillar",
  "Better Together": "Coprolite",
  "Paw Prints": "Moon Crystal",
};

export const CHAPTER_MARVEL_FISH: Record<ChapterName, ChapterFish> = {
  "Solar Flare": "Crimson Carp",
  "Dawn Breaker": "Crimson Carp",
  "Witches' Eve": "Crimson Carp",
  "Catch the Kraken": "Crimson Carp",
  "Spring Blossom": "Crimson Carp",
  "Clash of Factions": "Battle Fish",
  "Pharaoh's Treasure": "Lemon Shark",
  "Bull Run": "Longhorn Cowfish",
  "Winds of Change": "Jellyfish",
  "Great Bloom": "Pink Dolphin",
  "Better Together": "Poseidon",
  "Paw Prints": "Super Star",
};

export function getChapterMarvelFish(now = new Date()): ChapterFish {
  const currentChapter = getCurrentChapter(now);

  return CHAPTER_MARVEL_FISH[currentChapter];
}

export function getCurrentChapter(now = new Date()): ChapterName {
  const chapters = getKeys(CHAPTERS);

  const currentChapter = chapters.find((chapter) => {
    const { startDate, endDate } = CHAPTERS[chapter];

    return now >= startDate && now < endDate;
  });

  if (!currentChapter) {
    throw new Error("No Season found");
  }

  return currentChapter;
}

export function getChapterTicket(now = new Date()): ChapterTicket {
  const currentChapter = getCurrentChapter(now);

  return CHAPTER_TICKET_NAME[currentChapter];
}

export function getChapterArtefact(now = new Date()) {
  const currentChapter = getCurrentChapter(now);

  return CHAPTER_ARTEFACT_NAME[currentChapter];
}

export function getChapterBanner(now = new Date()): ChapterBanner {
  const currentSeason = getCurrentChapter(now);

  return `${currentSeason} Banner`;
}

export function secondsLeftInSeason() {
  const season = getCurrentChapter();

  const times = CHAPTERS[season];

  const secondsLeft = (times.endDate.getTime() - Date.now()) / 1000;

  return secondsLeft;
}

export function hasSeasonStarted(season: ChapterName, now = Date.now()) {
  return now >= CHAPTERS[season].startDate.getTime();
}

export function hasSeasonEnded(season: ChapterName, now = Date.now()) {
  return now >= CHAPTERS[season].endDate.getTime();
}

export function getSeasonByBanner(banner: ChapterBanner): ChapterName {
  return CHAPTER_BANNERS[banner];
}

export function getSeasonalBannerImage() {
  const banners: Record<ChapterBanner, string> = {
    "Solar Flare Banner": solarFlareBanner,
    "Dawn Breaker Banner": dawnBreakerBanner,
    "Witches' Eve Banner": witchesEveBanner,
    "Catch the Kraken Banner": catchTheKrakenBanner,
    "Spring Blossom Banner": springBlossomBanner,
    "Clash of Factions Banner": clashOfFactionsBanner,
    "Pharaoh's Treasure Banner": pharaohsTreasureBanner,
    "Bull Run Banner": bullsRunBanner,
    "Winds of Change Banner": windsOfChangeBanner,
    "Great Bloom Banner": greatBloomBanner,
    "Better Together Banner": betterTogetherBanner,
    "Paw Prints Banner": pawPrintsBanner,
  };
  return banners[getChapterBanner()];
}

function getPreviousSeason(now = new Date()): ChapterName {
  const currentSeason = getCurrentChapter(now);
  const startDateOfCurrentSeason = CHAPTERS[currentSeason].startDate;

  // Find the season where the end date matches the start date of the current season
  const previousSeason = getObjectEntries(CHAPTERS).find(
    ([, { endDate }]) =>
      endDate.getTime() === startDateOfCurrentSeason.getTime(),
  );

  if (!previousSeason) {
    throw new Error("No previous banner found");
  }

  return previousSeason[0];
}

export function getPreviousSeasonalBanner(now = new Date()): ChapterBanner {
  const previousSeason = getPreviousSeason(now);

  return `${previousSeason} Banner`;
}
