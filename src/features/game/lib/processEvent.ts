import Decimal from "decimal.js-light";
import { EVENTS, GameEvent } from "../events";
import { FOODS, getKeys } from "../types/craftables";
import {
  GameState,
  Inventory,
  InventoryItemName,
  Wardrobe,
} from "../types/game";
import { LEGACY_BADGE_TREE } from "../types/skills";
import { Announcements } from "../types/announcements";
import { EXOTIC_CROPS } from "../types/beans";
import { getValues } from "../types/decorations";
import { LANDSCAPING_DECORATIONS } from "../types/decorations";
import { ANIMAL_FOODS } from "../types/animals";
import { BumpkinItem } from "../types/bumpkin";
import { MaxedItem } from "./gameMachine";
import { CHAPTER_TICKET_NAME } from "../types/chapters";
import { getOffChainItems } from "./offChainItems";
import { PET_RESOURCES } from "../types/pets";
import { COOKABLES } from "features/game/types/consumables";

export const MAX_INVENTORY_ITEMS: Inventory = {
  ...getKeys(EXOTIC_CROPS).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(50),
    }),
    {},
  ),

  // Max of 1000 food item
  ...getKeys(FOODS()).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(1000),
    }),
    {},
  ),
  ...getKeys(COOKABLES).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(1000),
    }),
    {},
  ),

  // Max of 1 skill badge
  ...getKeys(LEGACY_BADGE_TREE).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(1),
    }),
    {},
  ),

  ...getKeys(EXOTIC_CROPS).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(50),
    }),
    {},
  ),

  "Basic Bear": new Decimal(1000),

  // Max of 1000 landscaping decoration, but only 100 for mushrooms
  ...getKeys(LANDSCAPING_DECORATIONS)
    .filter(
      (name) => !LANDSCAPING_DECORATIONS[name].ingredients["Wild Mushroom"],
    )
    .reduce(
      (acc, name) => ({
        ...acc,
        [name]: new Decimal(1000),
      }),
      {},
    ),
  ...getKeys(LANDSCAPING_DECORATIONS)
    .filter(
      (name) => LANDSCAPING_DECORATIONS[name].ingredients["Wild Mushroom"],
    )
    .reduce(
      (acc, name) => ({
        ...acc,
        [name]: new Decimal(100),
      }),
      {},
    ),

  ...getKeys(ANIMAL_FOODS).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(1500),
    }),
    {},
  ),

  // Max of 1500 Chapter tickets
  ...getValues(CHAPTER_TICKET_NAME).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(1500),
    }),
    {},
  ),
  "Solar Flare Ticket": new Decimal(350),
  "Dawn Breaker Ticket": new Decimal(750),
  "Crow Feather": new Decimal(750),
  "Bud Ticket": new Decimal(1),

  Sunflower: new Decimal(90000),
  Potato: new Decimal(60000),
  Rhubarb: new Decimal(60000),
  Pumpkin: new Decimal(48000),
  Zucchini: new Decimal(48000),
  Carrot: new Decimal(42000),
  Yam: new Decimal(42000),
  Cabbage: new Decimal(36000),
  Broccoli: new Decimal(36000),
  Soybean: new Decimal(36000),
  Beetroot: new Decimal(30000),
  Pepper: new Decimal(30000),
  Cauliflower: new Decimal(30000),
  Parsnip: new Decimal(24000),
  Eggplant: new Decimal(18000),
  Corn: new Decimal(15000),
  Onion: new Decimal(15000),
  Radish: new Decimal(12000),
  Wheat: new Decimal(12000),
  Turnip: new Decimal(12000),
  Artichoke: new Decimal(12000),
  Kale: new Decimal(24000),
  Barley: new Decimal(12150),

  Tomato: new Decimal(3600),
  Lemon: new Decimal(3000),
  Blueberry: new Decimal(2700),
  Orange: new Decimal(2700),
  Apple: new Decimal(2100),
  Banana: new Decimal(2100),

  Olive: new Decimal(1200),
  Grape: new Decimal(2400),
  Rice: new Decimal(1200),
  Duskberry: new Decimal(1200),
  Lunara: new Decimal(1200),
  Celestine: new Decimal(1200),

  Chicken: new Decimal(20),
  Egg: new Decimal(5100),
  Leather: new Decimal(4500),
  Wool: new Decimal(18000),
  "Merino Wool": new Decimal(4500),
  Feather: new Decimal(9000),
  Milk: new Decimal(9000),

  "Speed Chicken": new Decimal(5),
  "Rich Chicken": new Decimal(5),
  "Fat Chicken": new Decimal(5),
  "Banana Chicken": new Decimal(5),
  "Crim Peckster": new Decimal(5),
  "Knight Chicken": new Decimal(5),
  "Desert Rose": new Decimal(5),
  "Pharaoh Chicken": new Decimal(5),
  Chicory: new Decimal(5),
  "Alien Chicken": new Decimal(5),
  "Toxic Tuft": new Decimal(5),
  Mootant: new Decimal(5),
  "Frozen Sheep": new Decimal(5),
  "Summer Chicken": new Decimal(5),

  "Red Pansy": new Decimal(80),
  "Yellow Pansy": new Decimal(80),
  "Purple Pansy": new Decimal(80),
  "White Pansy": new Decimal(80),
  "Blue Pansy": new Decimal(80),
  "Red Cosmos": new Decimal(80),
  "Yellow Cosmos": new Decimal(80),
  "Purple Cosmos": new Decimal(80),
  "White Cosmos": new Decimal(80),
  "Blue Cosmos": new Decimal(80),
  "Red Balloon Flower": new Decimal(80),
  "Yellow Balloon Flower": new Decimal(80),
  "Purple Balloon Flower": new Decimal(80),
  "White Balloon Flower": new Decimal(80),
  "Blue Balloon Flower": new Decimal(80),
  "Red Carnation": new Decimal(80),
  "Yellow Carnation": new Decimal(80),
  "Purple Carnation": new Decimal(80),
  "White Carnation": new Decimal(80),
  "Blue Carnation": new Decimal(80),
  "Red Daffodil": new Decimal(80),
  "Yellow Daffodil": new Decimal(80),
  "Purple Daffodil": new Decimal(80),
  "White Daffodil": new Decimal(80),
  "Blue Daffodil": new Decimal(80),
  "Red Lotus": new Decimal(80),
  "Yellow Lotus": new Decimal(80),
  "Purple Lotus": new Decimal(80),
  "White Lotus": new Decimal(80),
  "Blue Lotus": new Decimal(80),
  "Prism Petal": new Decimal(80),
  "Celestial Frostbloom": new Decimal(80),
  "Primula Enigma": new Decimal(80),
  "Red Edelweiss": new Decimal(80),
  "Yellow Edelweiss": new Decimal(80),
  "Purple Edelweiss": new Decimal(80),
  "White Edelweiss": new Decimal(80),
  "Blue Edelweiss": new Decimal(80),
  "Red Gladiolus": new Decimal(80),
  "Yellow Gladiolus": new Decimal(80),
  "Purple Gladiolus": new Decimal(80),
  "White Gladiolus": new Decimal(80),
  "Blue Gladiolus": new Decimal(80),
  "Red Lavender": new Decimal(80),
  "Yellow Lavender": new Decimal(80),
  "Purple Lavender": new Decimal(80),
  "White Lavender": new Decimal(80),
  "Blue Lavender": new Decimal(80),
  "Red Clover": new Decimal(80),
  "Yellow Clover": new Decimal(80),
  "Purple Clover": new Decimal(80),
  "White Clover": new Decimal(80),
  "Blue Clover": new Decimal(80),

  Sunstone: new Decimal(75),
  Crimstone: new Decimal(3000),
  Obsidian: new Decimal(1500),
  Gold: new Decimal(2400),
  Iron: new Decimal(4800),
  Stone: new Decimal(4800),
  Wood: new Decimal(24000),
  "Wild Mushroom": new Decimal(300),
  "Magic Mushroom": new Decimal(225),
  Honey: new Decimal(700),
  Oil: new Decimal(1500),

  "War Bond": new Decimal(500),
  "Human War Banner": new Decimal(1),
  "Goblin War Banner": new Decimal(1),
  "Chef Hat": new Decimal(1),
  "Rapid Growth": new Decimal(100),
  "Red Envelope": new Decimal(100),
  "Love Letter": new Decimal(400),

  // Emblems
  "Goblin Emblem": new Decimal(90_000),
  "Bumpkin Emblem": new Decimal(90_000),
  "Sunflorian Emblem": new Decimal(90_000),
  "Nightshade Emblem": new Decimal(90_000),

  //Treasure Island Decorations
  "Abandoned Bear": new Decimal(50),

  "Turtle Bear": new Decimal(50),
  "T-Rex Skull": new Decimal(50),
  "Sunflower Coin": new Decimal(50),
  Foliant: new Decimal(50),
  "Skeleton King Staff": new Decimal(50),
  "Lifeguard Bear": new Decimal(50),
  "Snorkel Bear": new Decimal(50),
  "Parasaur Skull": new Decimal(50),
  "Golden Bear Head": new Decimal(50),
  "Pirate Bear": new Decimal(50),
  "Goblin Bear": new Decimal(50),
  Galleon: new Decimal(50),
  "Dinosaur Bone": new Decimal(50),
  "Human Bear": new Decimal(50),
  "Whale Bear": new Decimal(50),

  // Potion House
  "Giant Cabbage": new Decimal(50),
  "Giant Potato": new Decimal(50),
  "Giant Pumpkin": new Decimal(50),
  "Lab Grown Carrot": new Decimal(1),
  "Lab Grown Pumpkin": new Decimal(1),
  "Lab Grown Radish": new Decimal(1),
  "Magic Bean": new Decimal(5),

  // Fertilisers
  "Sprout Mix": new Decimal(500),
  "Fruitful Blend": new Decimal(500),
  "Rapid Root": new Decimal(500),

  // Bait
  Earthworm: new Decimal(200),
  Grub: new Decimal(150),
  "Red Wiggler": new Decimal(100),
  "Fishing Lure": new Decimal(100),

  // Seasonal decorations - Dawnbreaker
  Clementine: new Decimal(1),
  Blossombeard: new Decimal(1),
  "Desert Gnome": new Decimal(1),
  Cobalt: new Decimal(1),
  "Eggplant Grill": new Decimal(1),
  "Giant Dawn Mushroom": new Decimal(5),
  "Dawn Umbrella Seat": new Decimal(100),
  "Shroom Glow": new Decimal(100),

  // Seasonal decorations - Witches" Eve
  Candles: new Decimal(100),
  "Haunted Stump": new Decimal(100),
  "Spooky Tree": new Decimal(100),
  Observer: new Decimal(100),
  "Crow Rock": new Decimal(100),
  "Mini Corn Maze": new Decimal(100),

  // Seasonal decorations - Catch the Kraken
  "Lifeguard Ring": new Decimal(100),
  Surfboard: new Decimal(100),
  "Hideaway Herman": new Decimal(100),
  "Shifty Sheldon": new Decimal(100),
  "Tiki Torch": new Decimal(100),
  "Beach Umbrella": new Decimal(100),

  // Sand Castles
  "Adrift Ark": new Decimal(50),
  Castellan: new Decimal(50),
  "Sunlit Citadel": new Decimal(50),

  "Tomato Bombard": new Decimal(1),
  Cannonball: new Decimal(1),

  // New Blacksmith Equipment
  "Stone Beetle": new Decimal(5),
  "Iron Beetle": new Decimal(5),
  "Gold Beetle": new Decimal(5),
  "Fairy Circle": new Decimal(5),
  Squirrel: new Decimal(5),
  Butterfly: new Decimal(5),
  Macaw: new Decimal(5),

  // Pet resources all 300
  ...getKeys(PET_RESOURCES).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(300),
    }),
    {},
  ),
};
/**
 * Add wearable into array if it requires a hoard limit
 * The hoard limit number will be set in MAX_WEARABLES to 100
 * If the Hoard limit needs to be set more than 100, please set it in MAX_WEARABLES
 */
export const MAX_BUMPKIN_WEARABLES: BumpkinItem[] = [
  "Walrus Onesie",
  "Knight Gambit",
  "Royal Braids",
  "Bumpkin Armor",
  "Bumpkin Helmet",
  "Bumpkin Sword",
  "Bumpkin Pants",
  "Bumpkin Sabatons",
  "Bumpkin Crown",
  "Bumpkin Shield",
  "Bumpkin Quiver",
  "Bumpkin Medallion",
  "Goblin Armor",
  "Goblin Helmet",
  "Goblin Pants",
  "Goblin Sabatons",
  "Goblin Axe",
  "Goblin Crown",
  "Goblin Shield",
  "Goblin Quiver",
  "Goblin Medallion",
  "Sunflorian Armor",
  "Sunflorian Sword",
  "Sunflorian Helmet",
  "Sunflorian Pants",
  "Sunflorian Sabatons",
  "Sunflorian Crown",
  "Sunflorian Shield",
  "Sunflorian Quiver",
  "Sunflorian Medallion",
  "Nightshade Armor",
  "Nightshade Helmet",
  "Nightshade Pants",
  "Nightshade Sabatons",
  "Nightshade Sword",
  "Nightshade Crown",
  "Nightshade Shield",
  "Nightshade Quiver",
  "Nightshade Medallion",
  "Crimstone Armor",
  "Daisy Tee",
  "Beekeeper Suit",
  "Beehive Staff",
  "Blue Monarch Dress",
  "Blue Monarch Shirt",
  "Bee Wings",
  "Beekeeper Hat",
  "Queen Bee Crown",
  "Bee Smoker",
  "Gardening Overalls",
  "Orange Monarch Dress",
  "Orange Monarch Shirt",
  "Full Bloom Shirt",
  "Wellies",
  "Royal Robe",
  "Crown",
  "Butterfly Wings",
  "Olive Royalty Shirt",
  "Mushroom Sweater",
  "Crimstone Pants",
  "Mushroom Shield",
  "Mushroom Shoes",
  "Crimstone Boots",
  "Amber Amulet",
  "Explorer Shirt",
  "Crab Trap",
  "Water Gourd",
  "Ankh Shirt",
  "Explorer Shorts",
  "Explorer Hat",
  "Desert Camel Background",
  "Rock Hammer",
  "Painter's Cap",
  "Festival of Colors Background",
  "Pixel Perfect Hoodie",
  "Gift Giver",
  "Soybean Onesie",
  "Seedling Hat",
  "Golden Seedling",
  "Pumpkin Hat",
  "Victorian Hat",
  "Bat Wings",
  "Fruit Bowl",
  "Fruit Picker Apron",
  "Fruit Picker Shirt",
  "Wise Beard",
  "Wise Robes",
  "Pink Ponytail",
  "Tattered Jacket",
  "Greyed Glory",
  "Love's Topper",
  "Valentine's Field Background",
  "Fox Hat",
  "Grape Pants",
  "Chicken Hat",
  "Pale Potion",
  "Lucky Red Hat",
  "Lucky Red Suit",
  "Banana Onesie",
  "Straw Hat",
  "Beige Farmer Potion",
  "Light Brown Farmer Potion",
  "Dark Brown Farmer Potion",
  "Goblin Potion",
  "Red Farmer Shirt",
  "Blue Farmer Shirt",
  "Yellow Farmer Shirt",
  "Farmer Pants",
  "Farmer Overalls",
  "Lumberjack Overalls",
  "Rancher Hair",
  "Brown Rancher Hair",
  "Explorer Hair",
  "Buzz Cut",
  "Witch's Broom",
  "Witching Wardrobe",
  "Infernal Bumpkin Potion",
  "Infernal Goblin Potion",
  "Ox Costume",
  "Peg Leg",
  "Pirate Potion",
  "Pirate Hat",
  "SFL T-Shirt",
  "Merch Bucket Hat",
  "Merch Coffee Mug",
  "Merch Hoodie",
  "Merch Tee",
  "Witches' Eve Tee",
  "Grey Merch Hoodie",
  "Dawn Breaker Tee",
  "Crow Wings",
  "Halo",
  "Imp Costume",
  "Kama",
  "Birthday Hat",
  "Streamer Helmet",
  "Double Harvest Cap",
  "Potato Suit",
  "Parsnip Horns",
  "Unicorn Horn",
  "Unicorn Hat",
  "Pumpkin Shirt",
  "Skull Shirt",
  "Farm Background",
  "Black Farmer Boots",
  "Farmer Pitchfork",
  "Project Dignity Hoodie",
  "Valoria Wreath",
  "Earn Alliance Sombrero",
  "Ugly Christmas Sweater",
  "Corn Onesie",
  "Sunflower Rod",
  "Bucket O' Worms",
  "Angler Waders",
  "Trident",
  "Fishing Hat",
  "Luminous Anglerfish Topper",
  "Clown Shirt",
  "Fresh Catch Vest",
  "Skinning Knife",
  "Koi Fish Hat",
  "Normal Fish Hat",
  "Tiki Armor",
  "Fishing Pants",
  "Seaside Tank Top",
  "Fish Pro Vest",
  "Tiki Mask",
  "Fishing Spear",
  "Stockeye Salmon Onesie",
  "Reel Fishing Vest",
  "Tiki Pants",
  "Companion Cap",
  "Elf Hat",
  "Elf Suit",
  "Santa Beard",
  "Santa Suit",
  "2026 Tiara",
  "New Years Tiara",
  "New Years Crown",
  "Deep Sea Helm",
  "Bee Suit",
  "Blue Blossom Shirt",
  "Fairy Sandals",
  "Propeller Hat",
  "Green Monarch Dress",
  "Green Monarch Shirt",
  "Rose Dress",
  "Blue Rose Dress",
  "Striped Blue Shirt",
  "Striped Red Shirt",
  "Striped Yellow Shirt",
  "Tofu Mask",
  "Queen's Crown",
  "Cap n Bells",
  "Motley",
  "Royal Dress",
  "Pharaoh Headdress",
  "Camel Onesie",
  "Sun Scarab Amulet",
  "Oil Protection Hat",
  "Desert Merchant Turban",
  "Desert Merchant Shoes",
  "Desert Merchant Suit",
  "Bionic Drill",
  "Pumpkin Plaza Background",
  "Goblin Retreat Background",
  "Kingdom Background",
  "Elf Potion",
  "Scarab Wings",
  "Gam3s Cap",
  "Cowboy Hat",
  "Cowboy Shirt",
  "Cowboy Trouser",
  "Cowgirl Skirt",
  "Dream Scarf",
  "Milk Apron",
  "White Sheep Onesie",
  "Adventurer's Suit",
  "Adventurer's Torch",
  "Pumpkin Head",
  "Candy Cane",
  "Gingerbread Onesie",
  "Blondie",
  "Basic Hair",
  "Parlour Hair",
  "Sun Spots",
  "Brown Long Hair",
  "White Long Hair",
  "Brown Suspenders",
  "Blue Suspenders",
  "Brown Boots",
  "Yellow Boots",
  "Axe",
  "Sword",
  "Forest Background",
  "Seashore Background",
  "Blossom Dumbo",
  "Radiant Dumbo",
  "Maple Dumbo",
  "Gloomy Dumbo",
  "Sickle",
  "Ladybug Suit",
  "Acorn Hat",
  "Crab Hat",
  "Locust Onesie",
];

// Set all Wearable hoard limit to 110
export const MAX_WEARABLES: Wardrobe = {
  ...MAX_BUMPKIN_WEARABLES.reduce(
    (acc, name) => ({
      ...acc,
      [name]: 100,
    }),
    {},
  ),
  "Basic Hair": 1000,
};

export function checkProgress({
  state,
  action,
  farmId,
  createdAt,
}: ProcessEventArgs): {
  valid: boolean;
  maxedItem?: MaxedItem;
} {
  let newState: GameState;

  try {
    newState = processEvent({ state, action, farmId, createdAt }) as GameState;
  } catch {
    // Not our responsibility to catch events, pass on to the next handler
    return { valid: true };
  }

  let maxedItem: InventoryItemName | BumpkinItem | undefined = undefined;

  const { inventory, wardrobe } = newState;
  const auctionBid = newState.auctioneer.bid?.ingredients ?? {};

  const offChainItems = new Set(getOffChainItems(createdAt));
  const validProgress = getKeys(inventory)
    .concat(getKeys(auctionBid))
    .filter((name) => !offChainItems.has(name))
    .every((name) => {
      const inventoryAmount = inventory[name] ?? new Decimal(0);
      const auctionAmount = auctionBid[name] ?? new Decimal(0);

      const previousInventoryAmount =
        newState.previousInventory[name] || new Decimal(0);

      const diff = inventoryAmount
        .add(auctionAmount)
        .minus(previousInventoryAmount);

      const max = MAX_INVENTORY_ITEMS[name] ?? new Decimal(0);

      if (max.eq(0)) return true;
      if (diff.gt(max)) {
        maxedItem = name;
        return false;
      }

      return true;
    });

  if (!validProgress) return { valid: validProgress, maxedItem };

  // Check wardrobe amounts
  const validWardrobeProgress = getKeys(wardrobe).every((name) => {
    const wardrobeAmount = wardrobe[name] ?? 0;

    const previousWardrobeAmount = newState.previousWardrobe[name] || 0;

    const diff = wardrobeAmount - previousWardrobeAmount;

    const max = MAX_WEARABLES[name] || 0;

    if (max === 0) return true;
    if (diff > max) {
      maxedItem = name;
      return false;
    }

    return true;
  });

  return { valid: validWardrobeProgress, maxedItem };
}

export function hasMaxItems({
  currentInventory,
  oldInventory,
  currentWardrobe,
  oldWardrobe,
  now,
}: {
  currentInventory: Inventory;
  oldInventory: Inventory;
  currentWardrobe: Wardrobe;
  oldWardrobe: Wardrobe;
  now: number;
}) {
  const offChainItems = new Set(getOffChainItems(now));
  const validInventoryProgress = getKeys(currentInventory)
    .filter((name) => !offChainItems.has(name))
    .every((name) => {
      const oldAmount = oldInventory[name] || new Decimal(0);
      const diff = currentInventory[name]?.minus(oldAmount) || new Decimal(0);
      const max = MAX_INVENTORY_ITEMS[name] || new Decimal(0);

      if (max.eq(0)) return true;
      if (diff.gt(max)) return false;

      return true;
    });

  if (!validInventoryProgress) return true;

  // Check wardrobe amounts
  const validWardrobeProgress = getKeys(currentWardrobe).every((name) => {
    const oldAmount = oldWardrobe[name] || 0;
    const diff = (currentWardrobe[name] ?? 0) - oldAmount;
    const max = MAX_WEARABLES[name] || 0;

    if (max === 0) return true;
    if (diff > max) return false;

    return true;
  });

  return !validWardrobeProgress;
}

type ProcessEventArgs = {
  state: GameState;
  action: GameEvent;
  createdAt: number;
  announcements?: Announcements;
  farmId: number;
  visitorState?: GameState;
};

export function processEvent({
  state,
  action,
  announcements,
  farmId,
  visitorState,
  createdAt,
}: ProcessEventArgs): GameState | [GameState, GameState] {
  const handler = EVENTS[action.type];

  if (!handler) {
    throw new Error(`Unknown event type: ${action}`);
  }

  const newState = handler({
    state,
    // TODO - fix type error
    action: action as never,
    announcements,
    farmId,
    visitorState,
    createdAt,
  });

  return newState;
}
