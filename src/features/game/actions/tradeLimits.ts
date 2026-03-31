import { CropName, GreenHouseCropName } from "../types/crops";
import { FermentationBait } from "../types/fishing";
import { GreenHouseFruitName, PatchFruitName } from "../types/fruits";
import {
  AnimalResource,
  FactionEmblem,
  InventoryItemName,
} from "../types/game";
import { PetResourceName } from "../types/pets";
import { CommodityName } from "../types/resources";

export const EMBLEM_TRADE_LIMITS: Record<FactionEmblem, number> = {
  "Goblin Emblem": 200,
  "Sunflorian Emblem": 200,
  "Bumpkin Emblem": 200,
  "Nightshade Emblem": 200,
};

export const EMBLEM_TRADE_MINIMUMS: Record<FactionEmblem, number> = {
  "Goblin Emblem": 1,
  "Sunflorian Emblem": 1,
  "Bumpkin Emblem": 1,
  "Nightshade Emblem": 1,
};

export type TradeResource = Extract<
  InventoryItemName,
  | CropName
  | PatchFruitName
  | GreenHouseFruitName
  | GreenHouseCropName
  | Exclude<
      CommodityName,
      | "Diamond"
      | "Sunstone"
      | "Oil"
      | "Obsidian"
      | "Refined Salt"
      | "Wild Mushroom"
      | "Magic Mushroom"
      | "Chicken"
    >
  | AnimalResource
  | FactionEmblem
  | Exclude<PetResourceName, "Acorn" | "Fossil Shell">
  | FermentationBait
>;

export const TRADE_LIMITS: Record<TradeResource, number> = {
  // Crops
  Sunflower: 4000,
  Potato: 3000,
  Rhubarb: 2000,
  Pumpkin: 2000,
  Zucchini: 2000,
  Carrot: 2000,
  Yam: 2000,
  Cabbage: 2000,
  Broccoli: 2000,
  Soybean: 2000,
  Beetroot: 1000,
  Pepper: 1000,
  Cauliflower: 1000,
  Parsnip: 1000,
  Eggplant: 1000,
  Corn: 1000,
  Onion: 1000,
  Radish: 500,
  Wheat: 500,
  Turnip: 500,
  Kale: 500,
  Artichoke: 500,
  Barley: 500,

  // Fruits
  Tomato: 400,
  Lemon: 300,
  Blueberry: 300,
  Orange: 300,
  Apple: 200,
  Banana: 200,
  Celestine: 20,
  Lunara: 15,
  Duskberry: 10,

  // Greenhouse
  Grape: 100,
  Rice: 100,
  Olive: 100,

  // Resources
  Wood: 500,
  Stone: 200,
  Iron: 200,
  Gold: 100,
  Crimstone: 20,
  Salt: 100,

  // Animal Produce
  Egg: 500,
  Feather: 1000,
  Honey: 100,
  Milk: 100,
  Leather: 100,
  Wool: 1000,
  "Merino Wool": 400,
  ...EMBLEM_TRADE_LIMITS,

  Ruffroot: 100,
  "Chewed Bone": 100,
  "Heart leaf": 100,
  "Frost Pebble": 100,
  "Wild Grass": 100,
  Ribbon: 100,
  Dewberry: 100,
  Moonfur: 100,
  "Garden Bait": 10,
  "Crock Bait": 10,
  "Vine Bait": 10,
};

export const TRADE_MINIMUMS: Record<TradeResource, number> = {
  Sunflower: 200,
  Potato: 200,
  Rhubarb: 200,
  Pumpkin: 100,
  Zucchini: 100,
  Carrot: 100,
  Yam: 100,
  Cabbage: 100,
  Broccoli: 100,
  Soybean: 50,
  Beetroot: 50,
  Pepper: 50,
  Cauliflower: 50,
  Parsnip: 20,
  Eggplant: 20,
  Corn: 20,
  Onion: 20,
  Radish: 10,
  Wheat: 10,
  Turnip: 10,
  Kale: 10,
  Artichoke: 10,
  Barley: 10,

  Tomato: 20,
  Lemon: 10,
  Blueberry: 10,
  Orange: 10,
  Apple: 5,
  Banana: 5,
  Celestine: 3,
  Lunara: 2,
  Duskberry: 1,

  Grape: 5,
  Rice: 5,
  Olive: 5,

  Wood: 50,
  Stone: 10,
  Iron: 5,
  Gold: 3,
  Crimstone: 1,
  Salt: 10,

  Honey: 5,
  Feather: 20,
  Egg: 10,
  Milk: 5,
  Leather: 5,
  Wool: 10,
  "Merino Wool": 5,

  Ruffroot: 1,
  "Chewed Bone": 1,
  "Heart leaf": 1,
  "Frost Pebble": 1,
  "Wild Grass": 1,
  Ribbon: 1,
  Dewberry: 1,
  Moonfur: 1,

  "Garden Bait": 1,
  "Crock Bait": 1,
  "Vine Bait": 1,
  ...EMBLEM_TRADE_MINIMUMS,
};

export const isTradeResource = (
  item: InventoryItemName,
): item is TradeResource => item in TRADE_LIMITS;
