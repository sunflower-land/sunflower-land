import Decimal from "decimal.js-light";
import { RecipeCollectibleName, getKeys } from "features/game/lib/crafting";
import {
  HarvestEvent,
  CookEvent,
  AnimalResourceEvent,
  OrderDeliveredEvent,
  FarmActivityName,
} from "features/game/types/farmActivity";
import { GameState } from "features/game/types/game";
import { setPrecision } from "lib/utils/formatNumber";
import cloneDeep from "lodash.clonedeep";

export const LEAGUE_NAMES = [
  "Sunflower 1",
  "Sunflower 2",
  "Sunflower 3",
  "Potato 4",
  "Potato 5",
  "Potato 6",
  "Pumpkin 7",
  "Pumpkin 8",
  "Pumpkin 9",
  "Carrot 10",
  "Carrot 11",
  "Carrot 12",
] as const;

export type LeagueName = (typeof LEAGUE_NAMES)[number];
export type LeagueId = `${LeagueName}-${string}`;

export interface League {
  id?: LeagueId;
  currentLeagueStartDate?: string;
  currentLeague: LeagueName;
  points: number;
}

export type LeaguePointsEvent = Extract<
  FarmActivityName,
  | HarvestEvent
  | CookEvent
  | AnimalResourceEvent
  | `${RecipeCollectibleName} Crafted`
  | OrderDeliveredEvent
  | "Tree Chopped"
  | "Stone Mined"
  | "Iron Mined"
  | "Gold Mined"
  | "Crimstone Mined"
  | "Oil Drilled"
  | "Obsidian Collected"
  | "Rod Casted"
  | "Treasure Dug"
  | "Potion Mixed"
  | "Farm Cheered"
  | "Farm Helped"
  | "Chore Completed"
>;

export const LEAGUE_POINTS_EVENTS: Record<LeaguePointsEvent, Decimal> = {
  "Sunflower Harvested": new Decimal(0.001),
  "Potato Harvested": new Decimal(0.005),
  "Pumpkin Harvested": new Decimal(0.03),
  "Carrot Harvested": new Decimal(0.06),
  "Cabbage Harvested": new Decimal(0.12),
  "Beetroot Harvested": new Decimal(0.24),
  "Cauliflower Harvested": new Decimal(0.48),
  "Parsnip Harvested": new Decimal(0.72),
  "Eggplant Harvested": new Decimal(0.96),
  "Corn Harvested": new Decimal(1.2),
  "Radish Harvested": new Decimal(1.44),
  "Wheat Harvested": new Decimal(1.44),
  "Kale Harvested": new Decimal(2.16),
  "Soybean Harvested": new Decimal(0.18),
  "Barley Harvested": new Decimal(2.88),
  "Rhubarb Harvested": new Decimal(0.01),
  "Zucchini Harvested": new Decimal(0.06),
  "Yam Harvested": new Decimal(0.06),
  "Broccoli Harvested": new Decimal(0.12),
  "Pepper Harvested": new Decimal(0.24),
  "Onion Harvested": new Decimal(1.2),
  "Turnip Harvested": new Decimal(1.44),
  "Artichoke Harvested": new Decimal(2.16),
  "Honey Harvested": new Decimal(20),
  "Apple Harvested": new Decimal(2.88),
  "Blueberry Harvested": new Decimal(1.44),
  "Orange Harvested": new Decimal(1.92),
  "Banana Harvested": new Decimal(2.88),
  "Tomato Harvested": new Decimal(0.48),
  "Lemon Harvested": new Decimal(0.96),
  "Celestine Harvested": new Decimal(7.2),
  "Lunara Harvested": new Decimal(14.4),
  "Duskberry Harvested": new Decimal(28.8),
  "Red Pansy Harvested": new Decimal(20),
  "Yellow Pansy Harvested": new Decimal(20),
  "Purple Pansy Harvested": new Decimal(20),
  "White Pansy Harvested": new Decimal(20),
  "Blue Pansy Harvested": new Decimal(20),
  "Red Cosmos Harvested": new Decimal(20),
  "Yellow Cosmos Harvested": new Decimal(20),
  "Purple Cosmos Harvested": new Decimal(20),
  "White Cosmos Harvested": new Decimal(20),
  "Blue Cosmos Harvested": new Decimal(20),
  "Prism Petal Harvested": new Decimal(30),
  "Red Balloon Flower Harvested": new Decimal(40),
  "Yellow Balloon Flower Harvested": new Decimal(40),
  "Purple Balloon Flower Harvested": new Decimal(40),
  "White Balloon Flower Harvested": new Decimal(40),
  "Blue Balloon Flower Harvested": new Decimal(40),
  "Red Daffodil Harvested": new Decimal(40),
  "Yellow Daffodil Harvested": new Decimal(40),
  "Purple Daffodil Harvested": new Decimal(40),
  "White Daffodil Harvested": new Decimal(40),
  "Blue Daffodil Harvested": new Decimal(40),
  "Celestial Frostbloom Harvested": new Decimal(50),
  "Red Carnation Harvested": new Decimal(100),
  "Yellow Carnation Harvested": new Decimal(100),
  "Purple Carnation Harvested": new Decimal(100),
  "White Carnation Harvested": new Decimal(100),
  "Blue Carnation Harvested": new Decimal(100),
  "Red Lotus Harvested": new Decimal(100),
  "Yellow Lotus Harvested": new Decimal(100),
  "Purple Lotus Harvested": new Decimal(100),
  "White Lotus Harvested": new Decimal(100),
  "Blue Lotus Harvested": new Decimal(100),
  "Primula Enigma Harvested": new Decimal(150),
  "Red Edelweiss Harvested": new Decimal(60),
  "Yellow Edelweiss Harvested": new Decimal(60),
  "Purple Edelweiss Harvested": new Decimal(60),
  "White Edelweiss Harvested": new Decimal(60),
  "Blue Edelweiss Harvested": new Decimal(60),
  "Red Gladiolus Harvested": new Decimal(60),
  "Yellow Gladiolus Harvested": new Decimal(60),
  "Purple Gladiolus Harvested": new Decimal(60),
  "White Gladiolus Harvested": new Decimal(60),
  "Blue Gladiolus Harvested": new Decimal(60),
  "Red Lavender Harvested": new Decimal(60),
  "Yellow Lavender Harvested": new Decimal(60),
  "Purple Lavender Harvested": new Decimal(60),
  "White Lavender Harvested": new Decimal(60),
  "Blue Lavender Harvested": new Decimal(60),
  "Red Clover Harvested": new Decimal(60),
  "Yellow Clover Harvested": new Decimal(60),
  "Purple Clover Harvested": new Decimal(60),
  "White Clover Harvested": new Decimal(60),
  "Blue Clover Harvested": new Decimal(60),
  "Grape Harvested": new Decimal(10.8),
  "Rice Harvested": new Decimal(28.8),
  "Olive Harvested": new Decimal(39.6),

  // Cook Events
  "Pumpkin Soup Cooked": new Decimal(0.09),
  "Roasted Cauliflower Cooked": new Decimal(0),
  "Sauerkraut Cooked": new Decimal(0.2),
  "Radish Pie Cooked": new Decimal(0),
  "Sunflower Cake Cooked": new Decimal(8.5),
  "Potato Cake Cooked": new Decimal(9),
  "Pumpkin Cake Cooked": new Decimal(8),
  "Carrot Cake Cooked": new Decimal(8.5),
  "Cabbage Cake Cooked": new Decimal(8),
  "Beetroot Cake Cooked": new Decimal(11.5),
  "Cauliflower Cake Cooked": new Decimal(10),
  "Parsnip Cake Cooked": new Decimal(11),
  "Radish Cake Cooked": new Decimal(9.5),
  "Wheat Cake Cooked": new Decimal(9.5),
  "Steamed Red Rice Cooked": new Decimal(11),
  "Tofu Scramble Cooked": new Decimal(5),
  "Antipasto Cooked": new Decimal(14),
  "Rice Bun Cooked": new Decimal(11),
  "Fried Tofu Cooked": new Decimal(0.7),
  "Rapid Roast Cooked": new Decimal(0.4),
  "Beetroot Blaze Cooked": new Decimal(2.5),
  "Shroom Syrup Cooked": new Decimal(12),
  "Mashed Potato Cooked": new Decimal(0.03),
  "Bumpkin Broth Cooked": new Decimal(0.2),
  "Boiled Eggs Cooked": new Decimal(2),
  "Mushroom Soup Cooked": new Decimal(0.02),
  "Roast Veggies Cooked": new Decimal(1),
  "Bumpkin Salad Cooked": new Decimal(2),
  "Cauliflower Burger Cooked": new Decimal(1.5),
  "Mushroom Jacket Potatoes Cooked": new Decimal(0.02),
  "Goblin's Treat Cooked": new Decimal(2),
  "Club Sandwich Cooked": new Decimal(1),
  "Kale Stew Cooked": new Decimal(1.5),
  "Pancakes Cooked": new Decimal(6.5),
  "Kale & Mushroom Pie Cooked": new Decimal(1),
  "Fermented Carrots Cooked": new Decimal(0.3),
  "Blueberry Jam Cooked": new Decimal(0.5),
  "Apple Pie Cooked": new Decimal(6),
  "Orange Cake Cooked": new Decimal(7.5),
  "Honey Cake Cooked": new Decimal(11),
  "Sunflower Crunch Cooked": new Decimal(0.6),
  "Reindeer Carrot Cooked": new Decimal(0.07),
  "Apple Juice Cooked": new Decimal(0.9),
  "Orange Juice Cooked": new Decimal(0.7),
  "Purple Smoothie Cooked": new Decimal(0.6),
  "Power Smoothie Cooked": new Decimal(1.5),
  "Bumpkin Detox Cooked": new Decimal(2),
  "Banana Blast Cooked": new Decimal(4),
  "Grape Juice Cooked": new Decimal(16),
  "Quick Juice Cooked": new Decimal(0.5),
  "Slow Juice Cooked": new Decimal(42.5),
  "The Lot Cooked": new Decimal(3.5),
  "Carrot Juice Cooked": new Decimal(0.4),
  "Bumpkin Roast Cooked": new Decimal(5.5),
  "Goblin Brunch Cooked": new Decimal(12),
  "Fruit Salad Cooked": new Decimal(0.4),
  "Kale Omelette Cooked": new Decimal(8.5),
  "Cabbers n Mash Cooked": new Decimal(0.6),
  "Fancy Fries Cooked": new Decimal(3),
  "Bumpkin ganoush Cooked": new Decimal(3.5),
  "Eggplant Cake Cooked": new Decimal(9),
  "Cornbread Cooked": new Decimal(4.5),
  "Popcorn Cooked": new Decimal(0.9),
  "Chowder Cooked": new Decimal(3),
  "Gumbo Cooked": new Decimal(2),
  "Fermented Fish Cooked": new Decimal(2.5),
  "Fried Calamari Cooked": new Decimal(2.5),
  "Fish Burger Cooked": new Decimal(2),
  "Fish Omelette Cooked": new Decimal(9),
  "Ocean's Olive Cooked": new Decimal(9),
  "Seafood Basket Cooked": new Decimal(2.5),
  "Fish n Chips Cooked": new Decimal(3),
  "Sushi Roll Cooked": new Decimal(6.5),
  "Cheese Cooked": new Decimal(3),
  "Pizza Margherita Cooked": new Decimal(17),
  "Blue Cheese Cooked": new Decimal(6.5),
  "Honey Cheddar Cooked": new Decimal(11),
  "Caprese Salad Cooked": new Decimal(7),
  "Sour Shake Cooked": new Decimal(1.5),
  "Spaghetti al Limone Cooked": new Decimal(10.5),
  "Lemon Cheesecake Cooked": new Decimal(22),
  "Rhubarb Tart Cooked": new Decimal(0.02),

  // Crafting Events
  "Doll Crafted": new Decimal(10),
  "Buzz Doll Crafted": new Decimal(40),
  "Lunar Doll Crafted": new Decimal(40),
  "Juicy Doll Crafted": new Decimal(40),
  "Crude Doll Crafted": new Decimal(40),
  "Cluck Doll Crafted": new Decimal(40),
  "Wooly Doll Crafted": new Decimal(40),
  "Moo Doll Crafted": new Decimal(40),
  "Bloom Doll Crafted": new Decimal(40),
  "Shadow Doll Crafted": new Decimal(40),
  "Ember Doll Crafted": new Decimal(40),
  "Gilded Doll Crafted": new Decimal(40),
  "Lumber Doll Crafted": new Decimal(40),
  "Harvest Doll Crafted": new Decimal(40),
  "Sizzle Doll Crafted": new Decimal(40),
  "Angler Doll Crafted": new Decimal(40),
  "Dune Doll Crafted": new Decimal(40),
  "Mouse Doll Crafted": new Decimal(40),
  "Grubby Doll Crafted": new Decimal(40),
  "Nefari Doll Crafted": new Decimal(40),
  "Frosty Doll Crafted": new Decimal(40),
  "Cosmo Doll Crafted": new Decimal(40),
  "Bigfin Doll Crafted": new Decimal(40),
  "Solar Doll Crafted": new Decimal(40),
  "Basic Bed Crafted": new Decimal(30),
  "Sturdy Bed Crafted": new Decimal(30),
  "Floral Bed Crafted": new Decimal(30),
  "Fisher Bed Crafted": new Decimal(30),
  "Pirate Bed Crafted": new Decimal(30),
  "Cow Bed Crafted": new Decimal(30),
  "Desert Bed Crafted": new Decimal(30),
  "Royal Bed Crafted": new Decimal(30),
  "Cushion Crafted": new Decimal(0),
  "Timber Crafted": new Decimal(0),
  "Bee Box Crafted": new Decimal(0),
  "Crimsteel Crafted": new Decimal(0),
  "Merino Cushion Crafted": new Decimal(0),
  "Kelp Fibre Crafted": new Decimal(0),
  "Hardened Leather Crafted": new Decimal(0),
  "Synthetic Fabric Crafted": new Decimal(0),
  "Ocean's Treasure Crafted": new Decimal(0),
  "Royal Bedding Crafted": new Decimal(0),
  "Royal Ornament Crafted": new Decimal(0),

  // Animal Resource Events
  "Egg Collected": new Decimal(1),
  "Feather Collected": new Decimal(3),
  "Milk Collected": new Decimal(2),
  "Leather Collected": new Decimal(4),
  "Wool Collected": new Decimal(1.5),
  "Merino Wool Collected": new Decimal(3.5),

  // Resource Events
  "Tree Chopped": new Decimal(0.5),
  "Stone Mined": new Decimal(1),
  "Iron Mined": new Decimal(3),
  "Gold Mined": new Decimal(10),
  "Crimstone Mined": new Decimal(17),
  "Oil Drilled": new Decimal(18),
  "Obsidian Collected": new Decimal(100),

  "Rod Casted": new Decimal(20),
  "Treasure Dug": new Decimal(20),
  "Potion Mixed": new Decimal(3.2),
  "Farm Cheered": new Decimal(5),
  "Farm Helped": new Decimal(5),
  "Ticket Order Delivered": new Decimal(10),
  "Coins Order Delivered": new Decimal(2),
  "FLOWER Order Delivered": new Decimal(6),
  "Chore Completed": new Decimal(50),
};

/**
 * Calculates league points based on the delta between previous and current bumpkin activities.
 * Only awards points for activities that are tracked in LEAGUE_POINTS_EVENTS.
 * @param previousActivity - Previous bumpkin activity record
 * @param currentActivity - Current bumpkin activity record
 * @returns Total league points to award based on activity increases
 */
export function calculateLeaguePointsFromActivityDelta(
  previousActivity: GameState["farmActivity"],
  currentActivity: GameState["farmActivity"],
): Decimal {
  let totalPoints = new Decimal(0);

  const previous = previousActivity || {};
  const current = currentActivity || {};

  // Iterate through all tracked league point events
  for (const activityName of getKeys(LEAGUE_POINTS_EVENTS)) {
    const previousCount = previous[activityName] || 0;
    const currentCount = current[activityName] || 0;
    const delta = currentCount - previousCount;

    if (delta > 0) {
      const pointsPerActivity = LEAGUE_POINTS_EVENTS[activityName];
      totalPoints = totalPoints.add(pointsPerActivity.mul(delta));
    }
  }

  return totalPoints;
}

export function updateLeaguePoints(
  state: GameState,
  previousState: GameState,
  now: number,
): GameState {
  const previousActivity = previousState.farmActivity;
  const currentActivity = state.farmActivity;
  const pointsDelta = calculateLeaguePointsFromActivityDelta(
    previousActivity,
    currentActivity,
  );

  if (pointsDelta.lte(new Decimal(0))) return state;

  const nowDate = new Date(now);
  const utcHours = nowDate.getUTCHours();
  const utcMinutes = nowDate.getUTCMinutes();
  if (utcHours === 0 && utcMinutes < 30) return state;

  // Use cloneDeep to create a mutable copy
  const stateCopy = cloneDeep(state);

  // Initialize leagues structure if it doesn't exist
  if (!stateCopy.prototypes) {
    stateCopy.prototypes = {};
  }
  if (!stateCopy.prototypes.leagues) {
    const currentLeagueDate = new Date(now).toISOString().split("T")[0];
    stateCopy.prototypes.leagues = {
      id: `Sunflower 1-${currentLeagueDate}`,
      currentLeague: "Sunflower 1",
      points: 0,
    };
  }

  // Add points
  stateCopy.prototypes.leagues.points = setPrecision(
    pointsDelta.add(stateCopy.prototypes.leagues.points),
    3,
  ).toNumber();

  return stateCopy;
}
