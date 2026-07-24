import { getCurrentChapter, getChapterMarvelFish } from "./chapters";
import { CHAPTER_MUTANTS } from "./chapterMutants";
import { KNOWN_IDS } from "./index";
import { ITEM_DETAILS } from "./images";
import { COLLECTIBLES_DIMENSIONS } from "./craftables";
import { MAP_PIECE_MARVELS } from "./fishing";

// Ascension Age runs [2026-08-03, 2026-11-02).
const IN_CHAPTER = new Date("2026-09-01T00:00:00.000Z").getTime();

describe("Ascension Age registration", () => {
  it("resolves as the current chapter within its window", () => {
    expect(getCurrentChapter(IN_CHAPTER)).toEqual("Ascension Age");
  });

  it("maps the chapter to its marvel fish", () => {
    expect(getChapterMarvelFish(IN_CHAPTER)).toEqual("Crocodile");
  });

  it("declares the chapter's mutant set", () => {
    expect(CHAPTER_MUTANTS["Ascension Age"]).toEqual({
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
    "Ascension Age Banner",
    "Shiny Feather",
    "Otter Pebble",
    "Ascension Age Raffle Ticket",
    "Cloud Bed",
    "Ascension Monument",
    "Salt Rug",
    "Ascended Idol",
    "Ascended Wheel",
    "Astrolabe",
    "Coat Rack",
    "Lampshade",
    "Marble Head",
    "Otty the Otter",
    "Salt Worker Gnome",
    "Shards Turtle",
    "Vibraphone",
    "Winged Vase",
  ] as const;

  it.each(NEW_ITEMS)("registers %s in KNOWN_IDS + ITEM_DETAILS", (name) => {
    expect(KNOWN_IDS[name]).toBeGreaterThanOrEqual(3030);
    expect(KNOWN_IDS[name]).toBeLessThanOrEqual(3054);
    expect(ITEM_DETAILS[name]?.image).toBeTruthy();
  });

  it("exposes the chapter fish as derived map-piece marvels", () => {
    expect(MAP_PIECE_MARVELS).toEqual(
      expect.arrayContaining(["Crocodile", "Dumbo Octopus", "Seahorse Dad"]),
    );
  });

  // Every new item except the icon-only coupons/artefact is placeable.
  const NON_PLACEABLE = new Set<(typeof NEW_ITEMS)[number]>([
    "Shiny Feather",
    "Otter Pebble",
    "Ascension Age Raffle Ticket",
  ]);
  const PLACEABLES = NEW_ITEMS.filter((name) => !NON_PLACEABLE.has(name));

  it.each(PLACEABLES)("gives %s placement dimensions", (name) => {
    expect(
      COLLECTIBLES_DIMENSIONS[name as keyof typeof COLLECTIBLES_DIMENSIONS],
    ).toBeTruthy();
  });
});
