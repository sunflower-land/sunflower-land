import Decimal from "decimal.js-light";
import { EVENTS, GameEvent } from "../events";
import { FOODS, getKeys } from "../types/craftables";
import { GameState, Inventory, InventoryItemName } from "../types/game";
import { SKILL_TREE } from "../types/skills";
import { Announcements } from "../types/announcements";
import { EXOTIC_CROPS } from "../types/beans";
import { BASIC_DECORATIONS, BasicDecorationName } from "../types/decorations";
import { FISH, FishName, MarineMarvelName } from "../types/fishing";
import {
  LANDSCAPING_DECORATIONS,
  LandscapingDecorationName,
} from "../types/decorations";
import { getActiveListedItems } from "features/island/hud/components/inventory/utils/inventory";
import { KNOWN_IDS } from "../types";
import { ANIMAL_FOODS } from "../types/animals";

export const MAX_ITEMS: Inventory = {
  Sunflower: new Decimal(30000),
  Potato: new Decimal(20000),
  Pumpkin: new Decimal(16000),
  Carrot: new Decimal(14000),
  Cabbage: new Decimal(12000),
  Soybean: new Decimal(12000),
  Beetroot: new Decimal(10000),
  Cauliflower: new Decimal(10000),
  Parsnip: new Decimal(8000),
  Eggplant: new Decimal(6000),
  Corn: new Decimal(5000),
  Radish: new Decimal(4000),
  Wheat: new Decimal(4000),
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

  Chicken: new Decimal(20),
  Egg: new Decimal(1700),
  Leather: new Decimal(1500),
  Wool: new Decimal(1500),
  "Merino Wool": new Decimal(1500),
  Feather: new Decimal(1500),
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

  "Tomato Seed": new Decimal(100),
  "Apple Seed": new Decimal(100),
  "Orange Seed": new Decimal(100),
  "Blueberry Seed": new Decimal(100),
  "Banana Plant": new Decimal(100),
  "Lemon Seed": new Decimal(100),

  "Sunpetal Seed": new Decimal(100),
  "Bloom Seed": new Decimal(100),
  "Lily Seed": new Decimal(100),

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

  Sunstone: new Decimal(20),
  Crimstone: new Decimal(100),
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

  ...(Object.keys(EXOTIC_CROPS) as InventoryItemName[]).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(50),
    }),
    {},
  ),

  // Max of 1000 food item
  ...(Object.keys(FOODS()) as InventoryItemName[]).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(1000),
    }),
    {},
  ),

  // Max of 1 skill badge
  ...(Object.keys(SKILL_TREE) as InventoryItemName[]).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(1),
    }),
    {},
  ),

  ...(Object.keys(EXOTIC_CROPS) as InventoryItemName[]).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(50),
    }),
    {},
  ),

  // Max of 100 basic decoration
  ...(Object.keys(BASIC_DECORATIONS()) as BasicDecorationName[]).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(100),
    }),
    {},
  ),

  // Max of 100 fish
  ...(Object.keys(FISH) as (FishName | MarineMarvelName)[]).reduce(
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
  ...(Object.keys(LANDSCAPING_DECORATIONS()) as LandscapingDecorationName[])
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
  ...(Object.keys(LANDSCAPING_DECORATIONS()) as LandscapingDecorationName[])
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

  ...(Object.keys(ANIMAL_FOODS) as InventoryItemName[]).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(1500),
    }),
    {},
  ),
};

/**
 * Humanly possible SFL in a single session
 */
export const MAX_SESSION_SFL = 255;

export function checkProgress({ state, action, farmId }: ProcessEventArgs): {
  valid: boolean;
  maxedItem?: InventoryItemName | "SFL";
} {
  let newState: GameState;

  try {
    newState = processEvent({ state, action, farmId });
  } catch {
    // Not our responsibility to catch events, pass on to the next handler
    return { valid: true };
  }

  const auctionSFL = newState.auctioneer.bid?.sfl ?? new Decimal(0);
  const progress = newState.balance
    .add(auctionSFL)
    .sub(newState.previousBalance ?? new Decimal(0));

  /**
   * Contract enforced SFL caps
   * Just in case a player gets in a corrupt state and manages to earn extra SFL
   */
  if (progress.gt(MAX_SESSION_SFL)) {
    return { valid: false, maxedItem: "SFL" };
  }

  let maxedItem: InventoryItemName | undefined = undefined;

  const inventory = newState.inventory;
  const auctionBid = newState.auctioneer.bid?.ingredients ?? {};

  const listedItems = getActiveListedItems(newState);
  const listedInventoryItemNames = getKeys(listedItems).filter(
    (name) => name in KNOWN_IDS,
  ) as InventoryItemName[];

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

      const max = MAX_ITEMS[name] || new Decimal(0);

      if (max.eq(0)) return true;

      if (diff.gt(max)) {
        maxedItem = name;

        return false;
      }

      return true;
    });

  return { valid: validProgress, maxedItem };
}

export function hasMaxItems({
  current,
  old,
}: {
  current: Inventory;
  old: Inventory;
}) {
  let maxedItem: InventoryItemName | undefined = undefined;

  // Check inventory amounts
  const validProgress = getKeys(current).every((name) => {
    const oldAmount = old[name] || new Decimal(0);

    const diff = current[name]?.minus(oldAmount) || new Decimal(0);

    const max = MAX_ITEMS[name] || new Decimal(0);

    if (max.eq(0)) return true;

    if (diff.gt(max)) {
      maxedItem = name;

      return false;
    }

    return true;
  });

  return !validProgress;
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
