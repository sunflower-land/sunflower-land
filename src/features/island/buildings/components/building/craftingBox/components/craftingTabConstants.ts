import { InventoryItemName } from "features/game/types/game";
import { getKeys } from "lib/object";
import {
  CHAPTER_CRAFTING_ITEMS,
  CRAFTABLE_BEARS,
  DOLLS,
  RECIPE_CRAFTABLES,
} from "features/game/lib/crafting";
import { CROPS } from "features/game/types/crops";
import { ANIMAL_RESOURCES, COMMODITIES } from "features/game/types/resources";
import { BED_FARMHAND_COUNT } from "features/game/types/beds";
import { FLOWERS } from "features/game/types/flowers";
import { SELLABLE_TREASURES } from "features/game/types/treasure";
import { ChapterName } from "features/game/types/chapters";
import Decimal from "decimal.js-light";

export const VALID_CRAFTING_RESOURCES: InventoryItemName[] = [
  // Crops
  "Sunflower",
  "Potato",
  "Pumpkin",
  "Carrot",
  "Radish",
  "Turnip",

  // Fruits
  "Tomato",
  "Lunara",
  "Duskberry",
  "Celestine",

  // Resources
  "Wood",
  "Stone",
  "Iron",
  "Gold",
  "Crimstone",
  "Obsidian",
  "Oil",
  "Wild Mushroom",
  "Honey",
  "Feather",
  "Leather",
  "Wool",
  "Merino Wool",

  // Beds
  "Basic Bed",
  "Sturdy Bed",

  // Flowers
  "Red Pansy",
  "Yellow Pansy",
  "Blue Pansy",
  "White Pansy",
  "Celestial Frostbloom",
  "Primula Enigma",
  "Prism Petal",

  // Treasure
  "Coral",
  "Pearl",
  "Pirate Bounty",
  "Seaweed",
  "Vase",

  // Crafting Box
  "Bee Box",
  "Crimsteel",
  "Cushion",
  "Hardened Leather",
  "Kelp Fibre",
  "Merino Cushion",
  "Ocean's Treasure",
  "Royal Bedding",
  "Royal Ornament",
  "Synthetic Fabric",
  "Timber",

  ...getKeys(DOLLS).filter((name) => !(name in CHAPTER_CRAFTING_ITEMS)),
  ...getKeys(CRAFTABLE_BEARS).filter(
    (name) => !(name in CHAPTER_CRAFTING_ITEMS),
  ),
];

// Resources that are only shown in the crafting ingredient picker during a specific chapter,
// and only when the player actually has some in their inventory.
export const CHAPTER_CRAFTING_RESOURCES: Partial<
  Record<ChapterName, InventoryItemName[]>
> = {
  "Salt Awakening": ["Refined Salt", "Pickled Pepper"],
};

export const validCraftingResourcesSorted = (options?: {
  currentChapter?: ChapterName;
  inventory?: Partial<Record<InventoryItemName, Decimal>>;
}): InventoryItemName[] => {
  const { currentChapter, inventory } = options ?? {};

  const crops: InventoryItemName[] = [];
  const resources: InventoryItemName[] = [];
  const beds: InventoryItemName[] = [];
  const flowers: InventoryItemName[] = [];
  const treasures: InventoryItemName[] = [];
  const craftingBox: InventoryItemName[] = [];
  const others: InventoryItemName[] = [];

  VALID_CRAFTING_RESOURCES.forEach((item) => {
    if (item in CROPS) crops.push(item);
    else if (item in { ...COMMODITIES, ...ANIMAL_RESOURCES })
      resources.push(item);
    else if (item in BED_FARMHAND_COUNT) beds.push(item);
    else if (item in FLOWERS) flowers.push(item);
    else if (item in SELLABLE_TREASURES) treasures.push(item);
    else if (item in RECIPE_CRAFTABLES) craftingBox.push(item);
    else others.push(item);
  });

  // Chapter resources: only shown during the right chapter and when the player has some
  const chapterResources: InventoryItemName[] = currentChapter
    ? (CHAPTER_CRAFTING_RESOURCES[currentChapter] ?? []).filter((item) =>
        (inventory?.[item] ?? new Decimal(0)).gt(0),
      )
    : [];

  return [
    ...crops,
    ...resources,
    ...beds,
    ...flowers,
    ...treasures,
    ...craftingBox,
    ...others,
    ...chapterResources,
  ];
};
