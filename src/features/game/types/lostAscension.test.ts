import { getCurrentChapter, getChapterMarvelFish } from "./chapters";
import { CHAPTER_MUTANTS } from "./chapterMutants";
import { KNOWN_IDS } from "./index";
import { ITEM_DETAILS } from "./images";
import { COLLECTIBLES_DIMENSIONS } from "./craftables";

// Lost Ascension runs [2026-08-03, 2026-11-02).
const IN_CHAPTER = new Date("2026-09-01T00:00:00.000Z").getTime();

describe("Lost Ascension registration", () => {
  it("resolves as the current chapter within its window", () => {
    expect(getCurrentChapter(IN_CHAPTER)).toEqual("Lost Ascension");
  });

  it("maps the chapter to its marvel fish", () => {
    expect(getChapterMarvelFish(IN_CHAPTER)).toEqual("Crocodile");
  });

  it("declares the chapter's mutant set", () => {
    expect(CHAPTER_MUTANTS["Lost Ascension"]).toEqual({
      Chicken: "Ascended Chicken",
      Cow: "Ascended Cow",
      Sheep: "Ascended Sheep",
      Flower: "Ruins Flower",
      Fish: ["Crocodile", "Dumbo Octopus", "Seahorse Dad"],
      banner: "?",
    });
  });

  it("assigns every new item a unique, non-colliding token id", () => {
    const ids = Object.values(KNOWN_IDS);
    expect(new Set(ids).size).toEqual(ids.length);
  });

  const NEW_ITEMS = [
    "Ascended Chicken",
    "Ascended Cow",
    "Ascended Sheep",
    "Ruins Flower",
    "Crocodile",
    "Dumbo Octopus",
    "Seahorse Dad",
    "Lost Ascension Banner",
    "Shiny Feather",
    "Otter Pebble",
    "Lost Ascension Raffle Ticket",
  ] as const;

  it.each(NEW_ITEMS)("registers %s in KNOWN_IDS + ITEM_DETAILS", (name) => {
    expect(KNOWN_IDS[name]).toBeGreaterThanOrEqual(3030);
    expect(ITEM_DETAILS[name]?.image).toBeTruthy();
  });

  const PLACEABLES = [
    "Ascended Chicken",
    "Ascended Cow",
    "Ascended Sheep",
    "Ruins Flower",
    "Crocodile",
    "Dumbo Octopus",
    "Seahorse Dad",
    "Lost Ascension Banner",
  ] as const;

  it.each(PLACEABLES)("gives %s placement dimensions", (name) => {
    expect(COLLECTIBLES_DIMENSIONS[name]).toBeTruthy();
  });
});
