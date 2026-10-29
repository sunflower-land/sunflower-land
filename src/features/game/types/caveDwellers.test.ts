import { CHAPTERS, getCurrentChapter, getChapterTicket } from "./chapters";
import { CHAPTER_MUTANTS } from "./chapterMutants";
import { KNOWN_IDS } from "./index";
import { CHAPTER_TRACKS } from "./tracks";
import { ITEM_IDS } from "./bumpkin";
import { INVENTORY_RELEASES, WEARABLE_RELEASES } from "./withdrawables";
import { ITEM_DETAILS } from "./images";
import { COLLECTIBLES_DIMENSIONS } from "./craftables";
import { REQUIRED_CHEERS } from "./monuments";
import { BED_FARMHAND_COUNT } from "./beds";
import {
  CHAPTER_CRAFTING_ITEMS,
  CRAFTABLE_BEARS,
  DOLLS,
} from "features/game/lib/crafting";
import { CHAPTER_CRAFTING_RESOURCES } from "features/island/buildings/components/building/craftingBox/components/craftingTabConstants";

// Cave Dwellers runs [2026-11-02, 2027-02-01).
const IN_CHAPTER = new Date("2026-12-01T00:00:00.000Z").getTime();

describe("Cave Dwellers registration", () => {
  it("resolves as the current chapter within its window", () => {
    expect(getCurrentChapter(IN_CHAPTER)).toEqual("Cave Dwellers");
  });

  it("uses the Duende Cap as the chapter ticket", () => {
    expect(getChapterTicket(IN_CHAPTER)).toEqual("Duende Cap");
  });

  it("declares the chapter's mutant set", () => {
    expect(CHAPTER_MUTANTS["Cave Dwellers"]).toEqual({
      Chicken: "Mushroom Chicken",
      Cow: "Ladybug Cow",
      Sheep: "Beetle Sheep",
      Flower: "Cyclops Bloom",
      Fish: ["Manatee", "Betta", "Macropinna"],
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

  it("makes the Pig Plush and Pig Doll Crafting Box chapter exclusives", () => {
    expect(CHAPTER_CRAFTING_ITEMS["Pig Plush"]).toEqual("Cave Dwellers");
    expect(CHAPTER_CRAFTING_ITEMS["Pig Doll"]).toEqual("Cave Dwellers");
    expect("Pig Plush" in CRAFTABLE_BEARS).toBe(true);
    expect("Pig Doll" in DOLLS).toBe(true);
    expect(CHAPTER_CRAFTING_RESOURCES["Cave Dwellers"]).toEqual([
      "Pig Bristles",
      "Truffle",
    ]);
  });

  it("makes Miner's Bed the 14th farmhand bed", () => {
    expect(BED_FARMHAND_COUNT["Miner's Bed"]).toEqual(14);
  });

  const NEW_ITEMS = [
    "Manatee",
    "Betta",
    "Macropinna",
    "Clover Coin",
    "Duende Cap",
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
    expect(KNOWN_IDS[name]).toBeLessThanOrEqual(3123);
    expect(ITEM_DETAILS[name]?.image).toBeTruthy();
  });

  // Every new item except the icon-only ticket and the artefact is placeable.
  const PLACEABLES = NEW_ITEMS.filter(
    (name) => name !== "Duende Cap" && name !== "Clover Coin",
  );

  it.each(PLACEABLES)("gives %s placement dimensions", (name) => {
    expect(
      COLLECTIBLES_DIMENSIONS[name as keyof typeof COLLECTIBLES_DIMENSIONS],
    ).toBeTruthy();
  });

  // Track cosmetics (BAU ITEM020/021/023/033/035), after the Rarecrow ids.
  const TRACK_DECORATIONS = {
    "Duende in a Bottle": { id: 3272, width: 2, height: 2 },
    "Mushroom Log": { id: 3273, width: 2, height: 1 },
    "Pot of Luck": { id: 3274, width: 2, height: 2 },
    TNT: { id: 3275, width: 1, height: 1 },
    "Warning Sign": { id: 3276, width: 1, height: 1 },
  } as const;

  it.each(Object.entries(TRACK_DECORATIONS))(
    "registers the %s track decoration",
    (name, { id, width, height }) => {
      const item = name as keyof typeof TRACK_DECORATIONS;
      expect(KNOWN_IDS[item]).toEqual(id);
      expect(ITEM_DETAILS[item]?.image).toBeTruthy();
      expect(COLLECTIBLES_DIMENSIONS[item]).toEqual({ width, height });
    },
  );
});

describe("Cave Dwellers chapter track", () => {
  const milestones = CHAPTER_TRACKS["Cave Dwellers"]?.milestones ?? [];

  it("has 60 levels ending at 60,000 points", () => {
    expect(milestones).toHaveLength(60);
    expect(milestones[59]?.points).toEqual(60000);
  });

  it("raises the points every level", () => {
    milestones.slice(1).forEach((milestone, index) => {
      expect(milestone.points).toBeGreaterThan(milestones[index].points);
    });
  });

  // The fixed rewards from the BAU Track Inputs tab.
  it.each([
    [5, "premium", { items: { TNT: 1 } }],
    [10, "premium", { wearables: { "Pig Onesie": 1 } }],
    [15, "free", { items: { "Mushroom Log": 1 } }],
    [20, "free", { items: { "Pot of Luck": 1 } }],
    [20, "premium", { wearables: { "Traveling Merchant Suit": 1 } }],
    [25, "free", { wearables: { "Beetle Goggles": 1 } }],
    [25, "premium", { items: { "Duende in a Bottle": 1 } }],
    [30, "premium", { wearables: { "Traveling Merchant Bag": 1 } }],
    [35, "premium", { wearables: { "Ascension Staff": 1 } }],
    [40, "free", { items: { "Pet Egg": 1 } }],
    [40, "premium", { items: { "Miner's Bed": 1 } }],
    [45, "premium", { items: { "Warning Sign": 1 } }],
    [60, "free", { items: { "Luxury Key": 1 } }],
    [60, "premium", { items: { "Gold Flower Box": 1 } }],
  ] as const)("rewards level %i %s with %o", (level, track, reward) => {
    expect(milestones[level - 1]?.[track]).toEqual(reward);
  });

  it("only rewards real items and never an auction item", () => {
    const AUCTION_ITEMS = [
      "Piggy Bank",
      "Big Bad Wolf",
      "Stick House",
      "Brick House",
      "Giant Truffle",
      "Hercules Beetle Hat",
      "Firefly Aura",
      "Antique Dress",
      "Harpoon",
    ];

    milestones.forEach((milestone) => {
      (["free", "premium"] as const).forEach((track) => {
        const { items = {}, wearables = {} } = milestone[track];

        Object.keys(items).forEach((name) => {
          expect(KNOWN_IDS[name as keyof typeof KNOWN_IDS]).toBeDefined();
          expect(AUCTION_ITEMS).not.toContain(name);
        });
        Object.keys(wearables).forEach((name) => {
          expect(ITEM_IDS[name as keyof typeof ITEM_IDS]).toBeDefined();
          expect(AUCTION_ITEMS).not.toContain(name);
        });
      });
    });
  });
});

describe("Cave Dwellers track releases", () => {
  const RELEASE = {
    tradeAt: CHAPTERS["Cave Dwellers"].endDate,
    withdrawAt: new Date("2027-03-01T00:00:00Z"),
  };

  it.each([
    "Pig Onesie",
    "Traveling Merchant Suit",
    "Traveling Merchant Bag",
    "Beetle Goggles",
    "Ascension Staff",
  ] as const)("releases the %s after the chapter", (name) => {
    expect(WEARABLE_RELEASES[name]).toEqual(RELEASE);
  });

  it.each([
    "TNT",
    "Mushroom Log",
    "Pot of Luck",
    "Duende in a Bottle",
    "Warning Sign",
  ] as const)("releases the %s after the chapter", (name) => {
    expect(INVENTORY_RELEASES[name]).toEqual(RELEASE);
  });

  it("never releases Miner's Bed", () => {
    expect(INVENTORY_RELEASES["Miner's Bed"]).toBeUndefined();
  });
});
