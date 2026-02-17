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
import crabChapterBanner from "assets/decorations/banners/crap_chapter_banner.webp";
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
  | "Paw Prints"
  | "Crabs and Traps";

type ChapterDates = { startDate: Date; endDate: Date; tasksBegin?: Date };

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
  "Crabs and Traps": {
    startDate: new Date("2026-02-02T00:00:00.000Z"),
    endDate: new Date("2026-05-04T00:00:00.000Z"),
    tasksBegin: new Date("2026-02-09T00:00:00.000Z"), // Visual only
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
  | "Pet Cookie"
  | "Floater";

export type ChapterRaffleTicket =
  | "Paw Prints Raffle Ticket"
  | "Crabs and Traps Raffle Ticket";

export type ChapterBanner = `${ChapterName} Banner`;

export type CollectionChapterName = Exclude<
  ChapterName,
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
  | "Paw Prints"
>;

export type ChapterShedItem = `${CollectionChapterName} Collection Shed`;

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
  "Crabs and Traps Banner": "Crabs and Traps",
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
  "Crabs and Traps": "Floater",
};

export const CHAPTER_RAFFLE_TICKET_NAME: Record<
  ChapterName,
  ChapterRaffleTicket | undefined
> = {
  "Solar Flare": undefined,
  "Dawn Breaker": undefined,
  "Witches' Eve": undefined,
  "Catch the Kraken": undefined,
  "Spring Blossom": undefined,
  "Clash of Factions": undefined,
  "Pharaoh's Treasure": undefined,
  "Bull Run": undefined,
  "Winds of Change": undefined,
  "Great Bloom": undefined,
  "Better Together": undefined,
  "Paw Prints": "Paw Prints Raffle Ticket",
  "Crabs and Traps": "Crabs and Traps Raffle Ticket",
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
  "Crabs and Traps": "Ammonite Shell",
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
  "Crabs and Traps": "Giant Isopod",
};

export function getChapterMarvelFish(now: number): ChapterFish {
  const currentChapter = getCurrentChapter(now);

  return CHAPTER_MARVEL_FISH[currentChapter];
}

export function getCurrentChapter(now: number): ChapterName {
  const chapters = getKeys(CHAPTERS);
  const nowDate = new Date(now);

  const currentChapter = chapters.find((chapter) => {
    const { startDate, endDate } = CHAPTERS[chapter];

    return nowDate >= startDate && nowDate < endDate;
  });

  if (!currentChapter) {
    throw new Error("No Chapter found");
  }

  return currentChapter;
}

export function getChapterTicket(now: number): ChapterTicket {
  const currentChapter = getCurrentChapter(now);

  return CHAPTER_TICKET_NAME[currentChapter];
}

export function getChapterRaffleTicket(
  now: number = Date.now(),
): ChapterRaffleTicket {
  const currentChapter = getCurrentChapter(now);

  const ticket = CHAPTER_RAFFLE_TICKET_NAME[currentChapter];

  if (!ticket) {
    throw new Error("No raffle ticket found");
  }

  return ticket;
}

export function getChapterArtefact(now: number) {
  const currentChapter = getCurrentChapter(now);

  return CHAPTER_ARTEFACT_NAME[currentChapter];
}

export function getChapterBanner(now: number): ChapterBanner {
  const currentChapter = getCurrentChapter(now);

  return `${currentChapter} Banner`;
}

export function secondsLeftInChapter(now: number) {
  const chapter = getCurrentChapter(now);

  const times = CHAPTERS[chapter];

  const secondsLeft = (times.endDate.getTime() - now) / 1000;

  return secondsLeft;
}

export function hasChapterStarted(chapter: ChapterName, now: number) {
  return now >= CHAPTERS[chapter].startDate.getTime();
}

export function hasChapterEnded(chapter: ChapterName, now: number) {
  return now >= CHAPTERS[chapter].endDate.getTime();
}

export function getChapterByBanner(banner: ChapterBanner): ChapterName {
  return CHAPTER_BANNERS[banner];
}

export const CHAPTER_BANNER_IMAGES: Record<ChapterBanner, string> = {
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
  "Crabs and Traps Banner": crabChapterBanner,
};

export function getChapterBannerImage(now: number) {
  return CHAPTER_BANNER_IMAGES[getChapterBanner(now)];
}

function getPreviousChapter(now: number): ChapterName {
  const currentChapter = getCurrentChapter(now);
  const startDateOfCurrentChapter = CHAPTERS[currentChapter].startDate;

  // Find the chapter where the end date matches the start date of the current chapter
  const previousChapter = getObjectEntries(CHAPTERS).find(
    ([, { endDate }]) =>
      endDate.getTime() === startDateOfCurrentChapter.getTime(),
  );

  if (!previousChapter) {
    throw new Error("No previous banner found");
  }

  return previousChapter[0];
}

export function getPreviousChapterBanner(now: number): ChapterBanner {
  const previousChapter = getPreviousChapter(now);

  return `${previousChapter} Banner`;
}
