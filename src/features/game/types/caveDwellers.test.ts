import { getCurrentChapter, getChapterTicket } from "./chapters";
import { CHAPTER_MUTANTS } from "./chapterMutants";
import { KNOWN_IDS } from "./index";
import { ITEM_DETAILS } from "./images";
import { COLLECTIBLES_DIMENSIONS } from "./craftables";
import { REQUIRED_CHEERS } from "./monuments";
import { BED_FARMHAND_COUNT } from "./beds";

// Cave Dwellers runs [2026-11-02, 2027-02-01).
const IN_CHAPTER = new Date("2026-12-01T00:00:00.000Z").getTime();

describe("Cave Dwellers registration", () => {
  it("resolves as the current chapter within its window", () => {
    expect(getCurrentChapter(IN_CHAPTER)).toEqual("Cave Dwellers");
  });

  it("uses the Beetle Wing as the chapter ticket", () => {
    expect(getChapterTicket(IN_CHAPTER)).toEqual("Beetle Wing");
  });

  it("declares the chapter's mutant set", () => {
    expect(CHAPTER_MUTANTS["Cave Dwellers"]).toEqual({
      Chicken: "Mushroom Chicken",
      Cow: "Ladybug Cow",
      Sheep: "Beetle Sheep",
      Flower: "Cyclops Bloom",
      Fish: ["Cave Dwellers Fish"],
      banner: "?",
    });
  });

  it("assigns every item a unique, non-colliding token id", () => {
    const ids = Object.values(KNOWN_IDS);
    expect(new Set(ids).size).toEqual(ids.length);
  });

  it("needs 1000 cheers to complete the Duende Monument", () => {
    expect(REQUIRED_CHEERS["Duende Monument"]).toEqual(1000);
  });

  it("makes Miner's Bed the 14th farmhand bed", () => {
    expect(BED_FARMHAND_COUNT["Miner's Bed"]).toEqual(14);
  });

  const NEW_ITEMS = [
    "Beetle Wing",
    "Cave Dwellers Banner",
    "Mushroom Chicken",
    "Ladybug Cow",
    "Beetle Sheep",
    "Cyclops Bloom",
    "Duende Monument",
    "Miner's Bed",
    "Giant Truffle",
    "Mining Drill",
    "Piggy Bank",
    "Straw House",
    "Stick House",
    "Brick House",
    "Big Bad Wolf",
    "Pig Plush",
    "Pig Doll",
  ] as const;

  it.each(NEW_ITEMS)("registers %s in KNOWN_IDS + ITEM_DETAILS", (name) => {
    expect(KNOWN_IDS[name]).toBeGreaterThanOrEqual(3102);
    expect(KNOWN_IDS[name]).toBeLessThanOrEqual(3121);
    expect(ITEM_DETAILS[name]?.image).toBeTruthy();
  });

  // Every new item except the icon-only ticket is placeable.
  const PLACEABLES = NEW_ITEMS.filter((name) => name !== "Beetle Wing");

  it.each(PLACEABLES)("gives %s placement dimensions", (name) => {
    expect(
      COLLECTIBLES_DIMENSIONS[name as keyof typeof COLLECTIBLES_DIMENSIONS],
    ).toBeTruthy();
  });
});
