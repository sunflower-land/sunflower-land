import { InventoryItemName } from "features/game/types/game";
import { getKeys } from "features/game/expansion/lib/utils";
import { DOLLS, RECIPE_CRAFTABLES } from "features/game/lib/crafting";
import { CROPS } from "features/game/types/crops";
import { ANIMAL_RESOURCES, COMMODITIES } from "features/game/types/resources";
import { BED_FARMHAND_COUNT } from "features/game/types/beds";
import { FLOWERS } from "features/game/types/flowers";
import { SELLABLE_TREASURES } from "features/game/types/treasure";

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

  ...getKeys(DOLLS),
];

export const validCraftingResourcesSorted = (): InventoryItemName[] => {
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

  return [
    ...crops,
    ...resources,
    ...beds,
    ...flowers,
    ...treasures,
    ...craftingBox,
    ...others,
  ];
};
