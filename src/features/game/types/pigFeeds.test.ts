import Decimal from "decimal.js-light";
import { CRUSTACEANS } from "./crustaceans";
import { FISH, getFishNamesByTier } from "./fishing";
import {
  PIG_FEEDS,
  PIG_FEED_INGREDIENTS,
  getPigFeedIngredients,
  isPigFeed,
  isPigFeedIngredient,
  type PigFeedName,
} from "./pigFeeds";

// Both repos keep this file byte-identical.

const SLOPS = Object.keys(PIG_FEEDS) as PigFeedName[];

describe("PIG_FEEDS", () => {
  it("has one Slop per tier", () => {
    expect(SLOPS.map((slop) => [slop, PIG_FEEDS[slop].tier])).toEqual([
      ["Basic Slop", 1],
      ["Hearty Slop", 2],
      ["Rich Slop", 3],
      ["Gourmet Slop", 4],
    ]);
  });

  it("uses the #7721 crop and fruit quantities, doubled", () => {
    expect(PIG_FEEDS["Basic Slop"].ingredients).toEqual({
      Sunflower: 1000,
      Potato: 160,
      Rhubarb: 80,
      Pumpkin: 40,
      Zucchini: 40,
      Carrot: 20,
      Yam: 20,
      Cabbage: 10,
      Broccoli: 10,
      Soybean: 6,
    });
    expect(PIG_FEEDS["Hearty Slop"].ingredients).toEqual({
      Beetroot: 10,
      Pepper: 10,
      Cauliflower: 6,
      Parsnip: 4,
      Tomato: 18,
      Lemon: 8,
      Blueberry: 4,
    });
  });

  it("takes two of each tier 3 crop and one of each foraged item", () => {
    expect(PIG_FEEDS["Rich Slop"].ingredients).toEqual({
      ...Object.fromEntries(
        [
          "Eggplant",
          "Corn",
          "Onion",
          "Wheat",
          "Turnip",
          "Radish",
          "Kale",
          "Artichoke",
          "Barley",
          "Orange",
          "Apple",
          "Banana",
        ].map((item) => [item, 2]),
      ),
      ...Object.fromEntries(
        [
          ...getFishNamesByTier("basic"),
          "Wild Mushroom",
          "Isopod",
          "Barnacle",
        ].map((item) => [item, 1]),
      ),
    });
  });

  it("takes two of each tier 4 crop and one of each foraged item", () => {
    expect(PIG_FEEDS["Gourmet Slop"].ingredients).toEqual({
      ...Object.fromEntries(
        ["Rice", "Olive", "Grape", "Celestine", "Lunara", "Duskberry"].map(
          (item) => [item, 2],
        ),
      ),
      ...Object.fromEntries(
        [
          ...getFishNamesByTier("advanced"),
          ...getFishNamesByTier("expert"),
          "Magic Mushroom",
          ...CRUSTACEANS.filter(
            (crustacean) =>
              crustacean !== "Isopod" && crustacean !== "Barnacle",
          ),
        ].map((item) => [item, 1]),
      ),
    });
  });

  it("puts every input in exactly one Slop", () => {
    const listings = SLOPS.flatMap((slop) =>
      Object.keys(PIG_FEEDS[slop].ingredients),
    );
    expect(new Set(listings).size).toBe(listings.length);
    expect([...PIG_FEED_INGREDIENTS].sort()).toEqual([...listings].sort());
  });

  it("leaves out event crops, marine marvels and chapter fish", () => {
    const otherFish = (Object.keys(FISH) as (keyof typeof FISH)[]).filter(
      (fish) => !["basic", "advanced", "expert"].includes(FISH[fish].type),
    );
    expect(otherFish.length).toBeGreaterThan(0);

    for (const item of ["Saltwort", "Crystal Leaf", ...otherFish]) {
      expect(PIG_FEED_INGREDIENTS).not.toContain(item);
    }
  });
});

describe("isPigFeed", () => {
  it("recognises the four Slops only", () => {
    expect(SLOPS.every(isPigFeed)).toBe(true);
    expect(isPigFeed("Hay")).toBe(false);
    expect(isPigFeed("constructor")).toBe(false);
    expect(isPigFeed(undefined)).toBe(false);
  });
});

describe("getPigFeedIngredients", () => {
  it("costs the chosen input in its own quantity", () => {
    expect(getPigFeedIngredients("Basic Slop", "Sunflower")).toEqual({
      Sunflower: new Decimal(1000),
    });
    expect(getPigFeedIngredients("Gourmet Slop", "Lobster")).toEqual({
      Lobster: new Decimal(1),
    });
  });

  it("rejects an input from another tier or outside the table", () => {
    expect(getPigFeedIngredients("Basic Slop", "Wheat")).toBeUndefined();
    expect(getPigFeedIngredients("Rich Slop", "Saltwort")).toBeUndefined();
    expect(getPigFeedIngredients("Rich Slop", undefined)).toBeUndefined();
    expect(isPigFeedIngredient("Rich Slop", "constructor")).toBe(false);
    expect(getPigFeedIngredients("Rich Slop", "constructor")).toBeUndefined();
  });
});
