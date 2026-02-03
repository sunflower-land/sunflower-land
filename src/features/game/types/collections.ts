import { BumpkinItem } from "./bumpkin";
import {
  CHAPTER_RAFFLE_TICKET_NAME,
  CHAPTER_TICKET_NAME,
  ChapterName,
  ChapterRaffleTicket,
} from "./chapters";
import { InventoryItemName, MutantAnimal } from "./game";
import {
  ChapterCollectibleName,
  ChapterStoreCollectible,
  ChapterStoreItem,
  ChapterStoreTier,
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
import { HOURGLASSES } from "../events/landExpansion/burnCollectible";
import { getKeys } from "./decorations";
import { REWARD_BOXES } from "./rewardBoxes";
import { CHAPTER_TRACKS } from "./tracks";

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
  return Object.values(mutantProperties)
    .filter(
      (mutant): mutant is MutantAnimal | ChapterFish[] | MutantFlowerName =>
        mutant !== undefined,
    )
    .flat();
}

export function getChapterTrackCollectibles(chapter: ChapterName) {
  const excludedItems: InventoryItemName[] = [
    "Treasure Key",
    "Rare Key",
    "Luxury Key",
    ...HOURGLASSES,
    ...getKeys(REWARD_BOXES),
    ...Object.values(CHAPTER_TICKET_NAME),
    ...Object.values(CHAPTER_RAFFLE_TICKET_NAME).filter(
      (ticket): ticket is ChapterRaffleTicket => ticket !== undefined,
    ),
  ];

  const track = CHAPTER_TRACKS[chapter];
  if (!track) {
    return [];
  }

  return track.milestones.flatMap((milestone) => {
    return [
      ...getKeys(milestone.free.items ?? {}),
      ...getKeys(milestone.premium.items ?? {}),
    ].filter((item) => !excludedItems.includes(item));
  });
}

export function getChapterTrackWearables(chapter: ChapterName) {
  const track = CHAPTER_TRACKS[chapter];
  if (!track) {
    return [];
  }
  return track.milestones.flatMap((milestone) => {
    return [
      ...getKeys(milestone.free.wearables ?? {}),
      ...getKeys(milestone.premium.wearables ?? {}),
    ];
  });
}

/** Order used when flattening sources for the grid. Add new source keys here when introducing them. */
const SOURCE_DISPLAY_ORDER = [
  "megastore",
  "mutants",
  "track",
  "auctioneer",
  "vipChest",
  "vipGift",
] as const;

export type ChapterItemSourceKey =
  | (typeof SOURCE_DISPLAY_ORDER)[number]
  | "unknown";

/** Per-source lists of items. Each chapter uses the sources that apply (e.g. megastore, auctioneer). */
export type ChapterCollectionBySource = Partial<
  Record<
    ChapterItemSourceKey,
    {
      collectibles?: InventoryItemName[];
      wearables?: BumpkinItem[];
    }
  >
>;
/**
 * Chapter collections keyed by source. When adding a new chapter:
 * 1. Add a key for your chapter (e.g. "My Chapter").
 * 2. For each source that chapter uses, add megastore/mutants/track (from getters) and/or auctioneer/vipChest/vipGift (list items explicitly).
 * 3. No separate override map needed – the source is the key.
 */
export const CHAPTER_COLLECTIONS: Partial<
  Record<ChapterName, ChapterCollectionBySource>
> = {
  "Better Together": {
    megastore: {
      collectibles: getChapterMegastoreCollectibles("Better Together"),
      wearables: getChapterMegastoreWearables("Better Together"),
    },
    mutants: {
      collectibles: getChapterMutants("Better Together"),
    },
    auctioneer: {
      collectibles: [
        "Rocket Statue",
        "Ant Queen",
        "Jurassic Droplet",
        "Giant Onion",
        "Giant Turnip",
        "Groovy Gramophone",
      ],
      wearables: ["Oil Gallon", "Lava Swimwear"],
    },
    vipChest: {
      collectibles: ["Wheat Whiskers"],
      wearables: ["Turd Topper"],
    },
  },
  "Paw Prints": {
    megastore: {
      collectibles: getChapterMegastoreCollectibles("Paw Prints"),
      wearables: getChapterMegastoreWearables("Paw Prints"),
    },
    mutants: {
      collectibles: getChapterMutants("Paw Prints"),
    },
    auctioneer: {
      collectibles: ["Paw Prints Rug", "Pet Bed", "Moon Fox Statue"],
      wearables: [
        "Luna's Crescent",
        "Master Chef's Cleaver",
        "Training Whistle",
        "Squirrel Onesie",
      ],
    },
    vipGift: {
      collectibles: ["Squeaky Chicken", "Pet Bowls"],
    },
  },
  "Crabs and Traps": {
    megastore: {
      collectibles: getChapterMegastoreCollectibles("Crabs and Traps"),
      wearables: getChapterMegastoreWearables("Crabs and Traps"),
    },
    mutants: {
      collectibles: getChapterMutants("Crabs and Traps"),
    },
    track: {
      collectibles: getChapterTrackCollectibles("Crabs and Traps"),
      wearables: getChapterTrackWearables("Crabs and Traps"),
    },
    auctioneer: {
      collectibles: ["Speckled Kissing Fish", "Fisherman's Boat", "Sea Arch"],
      wearables: [
        "Crimstone Spikes Hair",
        "Paw Aura",
        "Victoria's Apron",
        "Beast Shoes",
      ],
    },
  },
};

/** Flattens source-keyed collection into collectibles and wearables arrays for the grid. */
export function getChapterCollectionForDisplay(chapter: ChapterName): {
  collectibles: InventoryItemName[];
  wearables: BumpkinItem[];
} {
  const bySource = CHAPTER_COLLECTIONS[chapter];
  if (!bySource) {
    return { collectibles: [], wearables: [] };
  }
  const collectibles: InventoryItemName[] = [];
  const wearables: BumpkinItem[] = [];
  for (const source of SOURCE_DISPLAY_ORDER) {
    const entry = bySource[source];
    if (entry?.collectibles) collectibles.push(...entry.collectibles);
    if (entry?.wearables) wearables.push(...entry.wearables);
  }
  return { collectibles, wearables };
}

export function findMegastoreItemByChapter(
  chapter: ChapterName,
  itemName: string,
  type: "collectible" | "wearable",
): { item: ChapterStoreItem; tier: ChapterStoreTier } | undefined {
  const store = MEGASTORE[chapter];
  if (!store) return undefined;

  const tiers: ChapterStoreTier[] = ["basic", "rare", "epic", "mega"];
  for (const tier of tiers) {
    const items = store[tier].items;
    for (const item of items) {
      if (
        type === "collectible" &&
        isCollectible(item) &&
        item.collectible === itemName
      ) {
        return { item, tier };
      }
      if (
        type === "wearable" &&
        isWearable(item) &&
        item.wearable === itemName
      ) {
        return { item, tier };
      }
    }
  }
  return undefined;
}

export function getChapterItemSource(
  chapter: ChapterName,
  itemName: InventoryItemName | BumpkinItem,
  type: "collectible" | "wearable",
): {
  source: ChapterItemSourceKey;
  storeItem?: ChapterStoreItem;
  tier?: ChapterStoreTier;
} {
  const bySource = CHAPTER_COLLECTIONS[chapter];
  if (!bySource) return { source: "unknown" };

  for (const source of SOURCE_DISPLAY_ORDER) {
    const entry = bySource[source];
    if (!entry) continue;
    if (
      type === "collectible" &&
      entry.collectibles?.includes(itemName as InventoryItemName)
    ) {
      if (source === "megastore") {
        const megastoreResult = findMegastoreItemByChapter(
          chapter,
          itemName,
          type,
        );
        return {
          source: "megastore",
          storeItem: megastoreResult?.item,
          tier: megastoreResult?.tier,
        };
      }
      return { source };
    }
    if (
      type === "wearable" &&
      entry.wearables?.includes(itemName as BumpkinItem)
    ) {
      if (source === "megastore") {
        const megastoreResult = findMegastoreItemByChapter(
          chapter,
          itemName,
          type,
        );
        return {
          source: "megastore",
          storeItem: megastoreResult?.item,
          tier: megastoreResult?.tier,
        };
      }
      return { source };
    }
  }

  return { source: "unknown" };
}
