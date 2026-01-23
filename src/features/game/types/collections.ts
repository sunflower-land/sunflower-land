import { BumpkinItem } from "./bumpkin";
import { ChapterName } from "./chapters";
import { InventoryItemName, MutantAnimal } from "./game";
import {
  ChapterCollectibleName,
  ChapterStoreCollectible,
  MEGASTORE,
  ChapterWearableName,
} from "./megastore";
import {
  isCollectible,
  isWearable,
} from "../events/landExpansion/buyChapterItem";
import { CHAPTER_MUTANTS, MutantsChapterName } from "./chapterMutants";
import { ChapterFish } from "./fishing";
import { MutantFlowerName } from "./flowers";

export function getChapterMegastoreCollectibles(
  chapter: ChapterName,
): ChapterCollectibleName[] {
  const excludedItems: ChapterStoreCollectible["collectible"][] = [
    "Treasure Key",
    "Rare Key",
    "Luxury Key",
    "Pet Egg",
    "Bronze Flower Box",
    "Silver Flower Box",
    "Gold Flower Box",
  ];
  // Runtime type guard to ensure result is ChapterCollectibleName
  function isChapterCollectible(
    collectible: ChapterStoreCollectible["collectible"],
  ): collectible is ChapterCollectibleName {
    return !excludedItems.includes(collectible);
  }

  return Object.values(MEGASTORE[chapter])
    .flatMap((tier) =>
      tier.items.map((item) =>
        isCollectible(item) && isChapterCollectible(item.collectible)
          ? item.collectible
          : undefined,
      ),
    )
    .filter((item): item is ChapterCollectibleName => item !== undefined);
}

export function getChapterMegastoreWearables(
  chapter: ChapterName,
): ChapterWearableName[] {
  return Object.values(MEGASTORE[chapter])
    .flatMap((tier) =>
      tier.items.map((item) => {
        if (isWearable(item)) {
          return item.wearable;
        }
      }),
    )
    .filter((item): item is ChapterWearableName => item !== undefined);
}

export function getChapterMutants(
  chapter: ChapterName,
): (MutantFlowerName | ChapterFish | MutantAnimal)[] {
  const mutants = CHAPTER_MUTANTS[chapter as MutantsChapterName];
  // type cast is fine here since we check for undefined below
  if (!mutants) {
    return [];
  }

  const { banner: _banner, ...mutantProperties } = mutants;

  // Extract mutant properties explicitly, excluding banner and undefined values
  return Object.values(mutantProperties).filter(
    (mutant): mutant is MutantAnimal | ChapterFish | MutantFlowerName =>
      mutant !== undefined,
  );
}

export const CHAPTER_COLLECTIONS: Partial<
  Record<
    ChapterName,
    {
      collectibles: InventoryItemName[];
      wearables: BumpkinItem[];
    }
  >
> = {
  // Better Together - Aug 2025 - Nov 2025
  "Better Together": {
    collectibles: [
      // Megastore
      ...getChapterMegastoreCollectibles("Better Together"),
      // Mutants
      ...getChapterMutants("Better Together"),

      // Auctioneer
      "Rocket Statue",
      "Ant Queen",
      "Jurassic Droplet",
      "Giant Onion",
      "Giant Turnip",
      "Groovy Gramophone",

      // VIP Chest
      "Wheat Whiskers",
    ],
    wearables: [
      // Megastore
      ...getChapterMegastoreWearables("Better Together"),

      // Auctioneer
      "Oil Gallon",
      "Lava Swimwear",

      // VIP Chest
      "Turd Topper",
    ],
  },
  // Paw Prints - Nov 2025 - Feb 2026
  "Paw Prints": {
    collectibles: [
      ...getChapterMegastoreCollectibles("Paw Prints"),
      ...getChapterMutants("Paw Prints"),

      // Auctioneer
      "Paw Prints Rug",
      "Pet Bed",
      "Moon Fox Statue",
      // VIP gift
      "Squeaky Chicken",
      "Pet Bowls",
    ],
    wearables: [
      // Megastore
      ...getChapterMegastoreWearables("Paw Prints"),

      // Auctioneer
      "Luna's Crescent",
      "Master Chef's Cleaver",
      "Training Whistle",
      "Chef Shirt",
      "Squirrel Onesie",
    ],
  },
};
