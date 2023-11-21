import Decimal from "decimal.js-light";
import { EVENTS, GameEvent } from "../events";
import { FOODS, getKeys } from "../types/craftables";
import { GameState, Inventory, InventoryItemName } from "../types/game";
import { SKILL_TREE } from "../types/skills";
import { Announcements } from "../types/conversations";
import { EXOTIC_CROPS } from "../types/beans";
import { BASIC_DECORATIONS, BasicDecorationName } from "../types/decorations";

export const maxItems: Inventory = {
  Sunflower: new Decimal("15000"),
  Potato: new Decimal("10000"),
  Pumpkin: new Decimal("8000"),
  Carrot: new Decimal("7000"),
  Cabbage: new Decimal("6000"),
  Beetroot: new Decimal("5000"),
  Cauliflower: new Decimal("5000"),
  Parsnip: new Decimal("4000"),
  Eggplant: new Decimal("3000"),
  Corn: new Decimal("2500"),
  Radish: new Decimal("2000"),
  Wheat: new Decimal("2000"),
  Kale: new Decimal("2000"),

  Apple: new Decimal("300"),
  Orange: new Decimal("400"),
  Blueberry: new Decimal("400"),
  Banana: new Decimal("300"),

  Chicken: new Decimal("20"),
  Egg: new Decimal("800"),

  "Speed Chicken": new Decimal("5"),
  "Rich Chicken": new Decimal("5"),
  "Fat Chicken": new Decimal("5"),
  "Banana Chicken": new Decimal("5"),

  // Seed limits + buffer
  "Sunflower Seed": new Decimal(1250),
  "Potato Seed": new Decimal(650),
  "Pumpkin Seed": new Decimal(530),
  "Carrot Seed": new Decimal(350),
  "Cabbage Seed": new Decimal(350),
  "Beetroot Seed": new Decimal(320),
  "Cauliflower Seed": new Decimal(290),
  "Parsnip Seed": new Decimal(230),
  "Eggplant Seed": new Decimal(200),
  "Corn Seed": new Decimal(200),
  "Radish Seed": new Decimal(170),
  "Wheat Seed": new Decimal(170),
  "Kale Seed": new Decimal(150),
  "Apple Seed": new Decimal(100),
  "Orange Seed": new Decimal(100),
  "Blueberry Seed": new Decimal(100),
  "Banana Plant": new Decimal(100),

  Gold: new Decimal("200"),
  Iron: new Decimal("400"),
  Stone: new Decimal("800"),
  Wood: new Decimal("4000"),
  "Wild Mushroom": new Decimal("100"),

  "War Bond": new Decimal(500),
  "Human War Banner": new Decimal(1),
  "Goblin War Banner": new Decimal(1),
  "Chef Hat": new Decimal(1),
  "Rapid Growth": new Decimal(100),
  "Red Envelope": new Decimal(100),
  "Love Letter": new Decimal(400),

  // Stock limits
  Axe: new Decimal("900"),
  Pickaxe: new Decimal("300"),
  "Stone Pickaxe": new Decimal("150"),
  "Iron Pickaxe": new Decimal("50"),
  "Rusty Shovel": new Decimal("100"),
  "Sand Shovel": new Decimal(50),
  "Sand Drill": new Decimal(30),
  Rod: new Decimal("200"),

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

  // Bait
  Earthworm: new Decimal(100),
  Grub: new Decimal(100),
  "Red Wiggler": new Decimal(100),
  "Fishing Lure": new Decimal(100),

  //Treasure Island Beach Bounty
  "Pirate Bounty": new Decimal(50),
  Pearl: new Decimal(50),
  Coral: new Decimal(50),
  "Clam Shell": new Decimal(50),
  Pipi: new Decimal(50),
  Starfish: new Decimal(50),
  Seaweed: new Decimal(50),
  "Sea Cucumber": new Decimal(50),
  Crab: new Decimal(100),

  ...(Object.keys(EXOTIC_CROPS) as InventoryItemName[]).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(50),
    }),
    {}
  ),

  // Max of 1000 food item
  ...(Object.keys(FOODS()) as InventoryItemName[]).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(1000),
    }),
    {}
  ),

  // Max of 1 skill badge
  ...(Object.keys(SKILL_TREE) as InventoryItemName[]).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(1),
    }),
    {}
  ),

  ...(Object.keys(EXOTIC_CROPS) as InventoryItemName[]).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(50),
    }),
    {}
  ),

  // Max of 100 basic decoration
  ...(Object.keys(BASIC_DECORATIONS()) as BasicDecorationName[]).reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Decimal(100),
    }),
    {}
  ),
};

/**
 * Humanly possible SFL in a single session
 */
const MAX_SESSION_SFL = 255;

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
  const progress = newState.balance.add(auctionSFL).sub(newState.balance);

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

  const listedItems: Partial<Record<InventoryItemName, number>> = {};

  Object.values(newState.trades.listings ?? {}).forEach((listing) => {
    const items = listing.items;

    Object.entries(items).forEach(([itemName, amount]) => {
      listedItems[itemName as InventoryItemName] =
        (listedItems[itemName as InventoryItemName] ?? 0) + amount;
    });
  });

  // Check inventory amounts
  const validProgress = getKeys(inventory)
    .concat(getKeys(auctionBid))
    .concat(getKeys(listedItems))
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

      const max = maxItems[name] || new Decimal(0);

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

    const max = maxItems[name] || new Decimal(0);

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
