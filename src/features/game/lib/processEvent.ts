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
import { BASIC_DECORATIONS } from "../types/decorations";
import { FISH } from "../types/fishing";
import { LANDSCAPING_DECORATIONS } from "../types/decorations";
import { getActiveListedItems } from "features/island/hud/components/inventory/utils/inventory";
import { KNOWN_IDS } from "../types";
import { ANIMAL_FOODS } from "../types/animals";
import { BumpkinItem, ITEM_IDS } from "../types/bumpkin";
import { MaxedItem } from "./gameMachine";

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

  // Max of 100 basic decoration
  ...getKeys(BASIC_DECORATIONS()).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(100),
    }),
    {},
  ),

  "Basic Bear": new Decimal(1000),

  // Max of 100 fish
  ...getKeys(FISH).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(100),
    }),
    {},
  ),

  Anchovy: new Decimal(300),
  Tuna: new Decimal(250),
  "Red Snapper": new Decimal(200),

  // Max of 1000 landscaping decoration, but only 100 for mushrooms
  ...getKeys(LANDSCAPING_DECORATIONS())
    .filter(
      (name) => !LANDSCAPING_DECORATIONS()[name].ingredients["Wild Mushroom"],
    )
    .reduce(
      (acc, name) => ({
        ...acc,
        [name]: new Decimal(1000),
      }),
      {},
    ),
  ...getKeys(LANDSCAPING_DECORATIONS())
    .filter(
      (name) => LANDSCAPING_DECORATIONS()[name].ingredients["Wild Mushroom"],
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
  Sunflower: new Decimal(30000),
  Potato: new Decimal(20000),
  Rhubarb: new Decimal(20000),
  Pumpkin: new Decimal(16000),
  Zucchini: new Decimal(16000),
  Carrot: new Decimal(14000),
  Yam: new Decimal(14000),
  Cabbage: new Decimal(12000),
  Broccoli: new Decimal(12000),
  Soybean: new Decimal(12000),
  Beetroot: new Decimal(10000),
  Pepper: new Decimal(10000),
  Cauliflower: new Decimal(10000),
  Parsnip: new Decimal(8000),
  Eggplant: new Decimal(6000),
  Corn: new Decimal(5000),
  Onion: new Decimal(5000),
  Radish: new Decimal(4000),
  Wheat: new Decimal(4000),
  Turnip: new Decimal(4000),
  Artichoke: new Decimal(4000),
  Kale: new Decimal(4000),
  Barley: new Decimal(4050),

  Tomato: new Decimal(1200),
  Lemon: new Decimal(1000),
  Blueberry: new Decimal(900),
  Orange: new Decimal(900),
  Apple: new Decimal(700),
  Banana: new Decimal(700),

  Olive: new Decimal(400),
  Grape: new Decimal(400),
  Rice: new Decimal(400),
  Duskberry: new Decimal(400),
  Lunara: new Decimal(400),
  Celestine: new Decimal(400),

  Chicken: new Decimal(20),
  Egg: new Decimal(1700),
  Leather: new Decimal(1500),
  Wool: new Decimal(1500),
  "Merino Wool": new Decimal(1500),
  Feather: new Decimal(3000),
  Milk: new Decimal(1500),

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

  // Seed limits + buffer
  "Sunflower Seed": new Decimal(1250),
  "Potato Seed": new Decimal(650),
  "Pumpkin Seed": new Decimal(530),
  "Carrot Seed": new Decimal(350),
  "Cabbage Seed": new Decimal(350),
  "Soybean Seed": new Decimal(350),
  "Beetroot Seed": new Decimal(320),
  "Cauliflower Seed": new Decimal(290),
  "Parsnip Seed": new Decimal(230),
  "Eggplant Seed": new Decimal(200),
  "Corn Seed": new Decimal(200),
  "Radish Seed": new Decimal(170),
  "Wheat Seed": new Decimal(170),
  "Kale Seed": new Decimal(150),
  "Barley Seed": new Decimal(150),
  "Duskberry Seed": new Decimal(150),
  "Lunara Seed": new Decimal(150),
  "Celestine Seed": new Decimal(150),

  "Tomato Seed": new Decimal(100),
  "Apple Seed": new Decimal(100),
  "Orange Seed": new Decimal(100),
  "Blueberry Seed": new Decimal(100),
  "Banana Plant": new Decimal(100),
  "Lemon Seed": new Decimal(100),

  "Sunpetal Seed": new Decimal(100),
  "Bloom Seed": new Decimal(100),
  "Lily Seed": new Decimal(100),
  "Edelweiss Seed": new Decimal(100),
  "Gladiolus Seed": new Decimal(100),
  "Lavender Seed": new Decimal(100),
  "Clover Seed": new Decimal(100),

  "Olive Seed": new Decimal(100),
  "Grape Seed": new Decimal(100),
  "Rice Seed": new Decimal(100),

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

  Sunstone: new Decimal(25),
  Crimstone: new Decimal(500),
  Obsidian: new Decimal(500),
  Gold: new Decimal(400),
  Iron: new Decimal(800),
  Stone: new Decimal(1600),
  Wood: new Decimal(8000),
  "Wild Mushroom": new Decimal(100),
  "Magic Mushroom": new Decimal(75),
  Honey: new Decimal(350),
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

  // Stock limits
  Axe: new Decimal(900),
  Pickaxe: new Decimal(450),
  "Stone Pickaxe": new Decimal(150),
  "Iron Pickaxe": new Decimal(50),
  "Gold Pickaxe": new Decimal(50),
  "Oil Drill": new Decimal(50),
  "Rusty Shovel": new Decimal(100),
  "Sand Shovel": new Decimal(300),
  "Sand Drill": new Decimal(60),
  Rod: new Decimal(200),

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

  // Seasonal Tickets
  "Solar Flare Ticket": new Decimal(350),
  "Dawn Breaker Ticket": new Decimal(750),
  "Crow Feather": new Decimal(750),
  "Mermaid Scale": new Decimal(1500),
  "Tulip Bulb": new Decimal(1500),
  Scroll: new Decimal(1500),
  "Amber Fossil": new Decimal(1500),
  Horseshoe: new Decimal(1500),
  "Bud Ticket": new Decimal(1),

  // Potion House
  "Potion Ticket": new Decimal(7500),
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
};
/**
 * Add wearable into array if it requires a hoard limit
 * The hoard limit number will be set in MAX_WEARABLES to 100
 * If the Hoard limit needs to be set more than 100, please set it in MAX_WEARABLES
 */
export const MAX_BUMPKIN_WEARABLES: BumpkinItem[] = [
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

/**
 * Humanly possible SFL in a single session
 */
export const MAX_SESSION_SFL = 255;

export function checkProgress({ state, action, farmId }: ProcessEventArgs): {
  valid: boolean;
  maxedItem?: MaxedItem;
} {
  let newState: GameState;

  try {
    newState = processEvent({ state, action, farmId });
  } catch {
    // Not our responsibility to catch events, pass on to the next handler
    return { valid: true };
  }

  const auctionSFL = newState.auctioneer.bid?.sfl ?? new Decimal(0);

  const offerSFL = Object.values(newState.trades.offers ?? {}).reduce(
    (acc, offer) => {
      return acc.add(offer.sfl);
    },
    new Decimal(0),
  );

  const progress = newState.balance
    .add(auctionSFL)
    .add(offerSFL)
    .sub(newState.previousBalance ?? new Decimal(0));

  /**
   * Contract enforced SFL caps
   * Just in case a player gets in a corrupt state and manages to earn extra SFL
   */
  if (progress.gt(MAX_SESSION_SFL)) {
    return { valid: false, maxedItem: "SFL" };
  }

  let maxedItem: InventoryItemName | BumpkinItem | undefined = undefined;

  const { inventory, wardrobe } = newState;
  const auctionBid = newState.auctioneer.bid?.ingredients ?? {};

  const listedItems = getActiveListedItems(newState);
  const listedInventoryItemNames = getKeys(listedItems).filter(
    (name) => name in KNOWN_IDS,
  ) as InventoryItemName[];
  const listedWardrobeItemNames = getKeys(listedItems).filter(
    (name) => name in ITEM_IDS,
  ) as BumpkinItem[];

  // Check inventory amounts
  const validProgress = getKeys(inventory)
    .concat(getKeys(auctionBid))
    .concat(listedInventoryItemNames)
    .every((name) => {
      const inventoryAmount = inventory[name] ?? new Decimal(0);
      const auctionAmount = auctionBid[name] ?? new Decimal(0);
      const listingAmount = listedItems[name] ?? new Decimal(0);

      const previousInventoryAmount =
        newState.previousInventory[name] || new Decimal(0);

      const diff = inventoryAmount
        .add(auctionAmount)
        .add(listingAmount)
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
  const validWardrobeProgress = getKeys(wardrobe)
    .concat(listedWardrobeItemNames)
    .every((name) => {
      const wardrobeAmount = wardrobe[name] ?? 0;
      const listedAmount = listedItems[name] ?? 0;

      const previousWardrobeAmount = newState.previousWardrobe[name] || 0;

      const diff = wardrobeAmount + listedAmount - previousWardrobeAmount;

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
}: {
  currentInventory: Inventory;
  oldInventory: Inventory;
  currentWardrobe: Wardrobe;
  oldWardrobe: Wardrobe;
}) {
  // Check inventory amounts
  const validInventoryProgress = getKeys(currentInventory).every((name) => {
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
  announcements?: Announcements;
  farmId: number;
};

export function processEvent({
  state,
  action,
  announcements,
  farmId,
}: ProcessEventArgs): GameState {
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
  });

  return newState;
}
