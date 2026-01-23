import {
  MutantChicken,
  MutantCow,
  MutantSheep,
} from "features/game/types/game";
import { ChapterName } from "features/game/types/chapters";
import { ChapterFish } from "features/game/types/fishing";
import { MutantFlowerName } from "features/game/types/flowers";
import { SUNNYSIDE } from "assets/sunnyside";

export type ChapterMutantsData = {
  banner: string;
  Chicken: MutantChicken;
  Flower: MutantFlowerName;
  Fish: ChapterFish;
  Cow: MutantCow | undefined;
  Sheep: MutantSheep | undefined;
};

export type MutantsChapterName = Exclude<
  ChapterName,
  | "Solar Flare"
  | "Dawn Breaker"
  | "Witches' Eve"
  | "Catch the Kraken"
  | "Spring Blossom"
  | "Clash of Factions"
>;

export const CHAPTER_MUTANTS: Record<MutantsChapterName, ChapterMutantsData> = {
  "Pharaoh's Treasure": {
    Chicken: "Pharaoh Chicken",
    Flower: "Desert Rose",
    Fish: "Lemon Shark",
    Cow: undefined,
    Sheep: undefined,
    banner: SUNNYSIDE.announcement.pharaohSeasonRares,
  },
  "Bull Run": {
    Chicken: "Alien Chicken",
    Flower: "Chicory",
    Fish: "Longhorn Cowfish",
    Cow: "Mootant",
    Sheep: "Toxic Tuft",
    banner: SUNNYSIDE.announcement.bullRunSeasonRares,
  },
  "Winds of Change": {
    Chicken: "Summer Chicken",
    Flower: "Chamomile",
    Fish: "Jellyfish",
    Cow: "Frozen Cow",
    Sheep: "Frozen Sheep",
    banner: SUNNYSIDE.announcement.windsOfChangeSeasonRares,
  },
  "Better Together": {
    Chicken: "Janitor Chicken",
    Flower: "Venus Bumpkin Trap",
    Fish: "Poseidon",
    Cow: "Baby Cow",
    Sheep: "Baby Sheep",
    banner: SUNNYSIDE.announcement.betterTogetherSeasonRares,
  },
  "Paw Prints": {
    Chicken: "Sleepy Chicken",
    Flower: "Black Hole Flower",
    Fish: "Super Star",
    Cow: "Astronaut Cow",
    Sheep: "Astronaut Sheep",
    banner: SUNNYSIDE.announcement.pawPrintsSeasonRares,
  },
  "Crabs and Traps": {
    Chicken: "Squid Chicken",
    Flower: "Anemone Flower",
    Fish: "Giant Isopod",
    Cow: "Mermaid Cow",
    Sheep: "Mermaid Sheep",
    banner: "?",
  },
  "Great Bloom": {
    Chicken: "Love Chicken",
    Cow: "Dr Cow",
    Sheep: "Nurse Sheep",
    Flower: "Lunalist",
    Fish: "Pink Dolphin",
    banner: "?",
  },
};
