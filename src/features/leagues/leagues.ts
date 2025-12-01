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
  "Sunflower Harvested": new Decimal(0.01),
  "Potato Harvested": new Decimal(0.05),
  "Pumpkin Harvested": new Decimal(0.3),
  "Carrot Harvested": new Decimal(0.6),
  "Cabbage Harvested": new Decimal(1.2),
  "Beetroot Harvested": new Decimal(2.4),
  "Cauliflower Harvested": new Decimal(4.8),
  "Parsnip Harvested": new Decimal(7.2),
  "Eggplant Harvested": new Decimal(9.6),
  "Corn Harvested": new Decimal(12),
  "Radish Harvested": new Decimal(14.4),
  "Wheat Harvested": new Decimal(14.4),
  "Kale Harvested": new Decimal(21.6),
  "Soybean Harvested": new Decimal(1.8),
  "Barley Harvested": new Decimal(28.8),
  "Rhubarb Harvested": new Decimal(0.1),
  "Zucchini Harvested": new Decimal(0.6),
  "Yam Harvested": new Decimal(0.6),
  "Broccoli Harvested": new Decimal(1.2),
  "Pepper Harvested": new Decimal(2.4),
  "Onion Harvested": new Decimal(12),
  "Turnip Harvested": new Decimal(14.4),
  "Artichoke Harvested": new Decimal(21.6),
  "Honey Harvested": new Decimal(200),
  "Apple Harvested": new Decimal(28.8),
  "Blueberry Harvested": new Decimal(14.4),
  "Orange Harvested": new Decimal(19.2),
  "Banana Harvested": new Decimal(28.8),
  "Tomato Harvested": new Decimal(4.8),
  "Lemon Harvested": new Decimal(9.6),
  "Celestine Harvested": new Decimal(72),
  "Lunara Harvested": new Decimal(144),
  "Duskberry Harvested": new Decimal(288),
  "Red Pansy Harvested": new Decimal(200),
  "Yellow Pansy Harvested": new Decimal(200),
  "Purple Pansy Harvested": new Decimal(200),
  "White Pansy Harvested": new Decimal(200),
  "Blue Pansy Harvested": new Decimal(200),
  "Red Cosmos Harvested": new Decimal(200),
  "Yellow Cosmos Harvested": new Decimal(200),
  "Purple Cosmos Harvested": new Decimal(200),
  "White Cosmos Harvested": new Decimal(200),
  "Blue Cosmos Harvested": new Decimal(200),
  "Prism Petal Harvested": new Decimal(300),
  "Red Balloon Flower Harvested": new Decimal(400),
  "Yellow Balloon Flower Harvested": new Decimal(400),
  "Purple Balloon Flower Harvested": new Decimal(400),
  "White Balloon Flower Harvested": new Decimal(400),
  "Blue Balloon Flower Harvested": new Decimal(400),
  "Red Daffodil Harvested": new Decimal(400),
  "Yellow Daffodil Harvested": new Decimal(400),
  "Purple Daffodil Harvested": new Decimal(400),
  "White Daffodil Harvested": new Decimal(400),
  "Blue Daffodil Harvested": new Decimal(400),
  "Celestial Frostbloom Harvested": new Decimal(500),
  "Red Carnation Harvested": new Decimal(1000),
  "Yellow Carnation Harvested": new Decimal(1000),
  "Purple Carnation Harvested": new Decimal(1000),
  "White Carnation Harvested": new Decimal(1000),
  "Blue Carnation Harvested": new Decimal(1000),
  "Red Lotus Harvested": new Decimal(1000),
  "Yellow Lotus Harvested": new Decimal(1000),
  "Purple Lotus Harvested": new Decimal(1000),
  "White Lotus Harvested": new Decimal(1000),
  "Blue Lotus Harvested": new Decimal(1000),
  "Primula Enigma Harvested": new Decimal(1500),
  "Red Edelweiss Harvested": new Decimal(600),
  "Yellow Edelweiss Harvested": new Decimal(600),
  "Purple Edelweiss Harvested": new Decimal(600),
  "White Edelweiss Harvested": new Decimal(600),
  "Blue Edelweiss Harvested": new Decimal(600),
  "Red Gladiolus Harvested": new Decimal(600),
  "Yellow Gladiolus Harvested": new Decimal(600),
  "Purple Gladiolus Harvested": new Decimal(600),
  "White Gladiolus Harvested": new Decimal(600),
  "Blue Gladiolus Harvested": new Decimal(600),
  "Red Lavender Harvested": new Decimal(600),
  "Yellow Lavender Harvested": new Decimal(600),
  "Purple Lavender Harvested": new Decimal(600),
  "White Lavender Harvested": new Decimal(600),
  "Blue Lavender Harvested": new Decimal(600),
  "Red Clover Harvested": new Decimal(600),
  "Yellow Clover Harvested": new Decimal(600),
  "Purple Clover Harvested": new Decimal(600),
  "White Clover Harvested": new Decimal(600),
  "Blue Clover Harvested": new Decimal(600),
  "Grape Harvested": new Decimal(108),
  "Rice Harvested": new Decimal(288),
  "Olive Harvested": new Decimal(396),

  // Cook Events
  "Pumpkin Soup Cooked": new Decimal(0.9),
  "Roasted Cauliflower Cooked": new Decimal(0),
  "Sauerkraut Cooked": new Decimal(2),
  "Radish Pie Cooked": new Decimal(0),
  "Sunflower Cake Cooked": new Decimal(85),
  "Potato Cake Cooked": new Decimal(90),
  "Pumpkin Cake Cooked": new Decimal(80),
  "Carrot Cake Cooked": new Decimal(85),
  "Cabbage Cake Cooked": new Decimal(80),
  "Beetroot Cake Cooked": new Decimal(115),
  "Cauliflower Cake Cooked": new Decimal(100),
  "Parsnip Cake Cooked": new Decimal(110),
  "Radish Cake Cooked": new Decimal(95),
  "Wheat Cake Cooked": new Decimal(95),
  "Steamed Red Rice Cooked": new Decimal(110),
  "Tofu Scramble Cooked": new Decimal(50),
  "Antipasto Cooked": new Decimal(140),
  "Rice Bun Cooked": new Decimal(110),
  "Fried Tofu Cooked": new Decimal(7),
  "Rapid Roast Cooked": new Decimal(4),
  "Beetroot Blaze Cooked": new Decimal(25),
  "Shroom Syrup Cooked": new Decimal(120),
  "Mashed Potato Cooked": new Decimal(0.3),
  "Bumpkin Broth Cooked": new Decimal(2),
  "Boiled Eggs Cooked": new Decimal(20),
  "Mushroom Soup Cooked": new Decimal(0.2),
  "Roast Veggies Cooked": new Decimal(10),
  "Bumpkin Salad Cooked": new Decimal(20),
  "Cauliflower Burger Cooked": new Decimal(15),
  "Mushroom Jacket Potatoes Cooked": new Decimal(0.2),
  "Goblin's Treat Cooked": new Decimal(20),
  "Club Sandwich Cooked": new Decimal(10),
  "Kale Stew Cooked": new Decimal(15),
  "Pancakes Cooked": new Decimal(65),
  "Kale & Mushroom Pie Cooked": new Decimal(10),
  "Fermented Carrots Cooked": new Decimal(3),
  "Blueberry Jam Cooked": new Decimal(5),
  "Apple Pie Cooked": new Decimal(60),
  "Orange Cake Cooked": new Decimal(75),
  "Honey Cake Cooked": new Decimal(110),
  "Sunflower Crunch Cooked": new Decimal(6),
  "Reindeer Carrot Cooked": new Decimal(0.7),
  "Apple Juice Cooked": new Decimal(9),
  "Orange Juice Cooked": new Decimal(7),
  "Purple Smoothie Cooked": new Decimal(6),
  "Power Smoothie Cooked": new Decimal(15),
  "Bumpkin Detox Cooked": new Decimal(20),
  "Banana Blast Cooked": new Decimal(40),
  "Grape Juice Cooked": new Decimal(160),
  "Quick Juice Cooked": new Decimal(5),
  "Slow Juice Cooked": new Decimal(425),
  "The Lot Cooked": new Decimal(35),
  "Carrot Juice Cooked": new Decimal(4),
  "Bumpkin Roast Cooked": new Decimal(55),
  "Goblin Brunch Cooked": new Decimal(120),
  "Fruit Salad Cooked": new Decimal(4),
  "Kale Omelette Cooked": new Decimal(85),
  "Cabbers n Mash Cooked": new Decimal(6),
  "Fancy Fries Cooked": new Decimal(30),
  "Bumpkin ganoush Cooked": new Decimal(35),
  "Eggplant Cake Cooked": new Decimal(90),
  "Cornbread Cooked": new Decimal(45),
  "Popcorn Cooked": new Decimal(9),
  "Chowder Cooked": new Decimal(30),
  "Gumbo Cooked": new Decimal(20),
  "Fermented Fish Cooked": new Decimal(25),
  "Fried Calamari Cooked": new Decimal(25),
  "Fish Burger Cooked": new Decimal(20),
  "Fish Omelette Cooked": new Decimal(90),
  "Ocean's Olive Cooked": new Decimal(90),
  "Seafood Basket Cooked": new Decimal(25),
  "Fish n Chips Cooked": new Decimal(30),
  "Sushi Roll Cooked": new Decimal(65),
  "Cheese Cooked": new Decimal(30),
  "Pizza Margherita Cooked": new Decimal(170),
  "Blue Cheese Cooked": new Decimal(65),
  "Honey Cheddar Cooked": new Decimal(110),
  "Caprese Salad Cooked": new Decimal(70),
  "Sour Shake Cooked": new Decimal(15),
  "Spaghetti al Limone Cooked": new Decimal(105),
  "Lemon Cheesecake Cooked": new Decimal(220),
  "Rhubarb Tart Cooked": new Decimal(0.2),

  // Crafting Events
  "Doll Crafted": new Decimal(100),
  "Buzz Doll Crafted": new Decimal(400),
  "Lunar Doll Crafted": new Decimal(400),
  "Juicy Doll Crafted": new Decimal(400),
  "Crude Doll Crafted": new Decimal(400),
  "Cluck Doll Crafted": new Decimal(400),
  "Wooly Doll Crafted": new Decimal(400),
  "Moo Doll Crafted": new Decimal(400),
  "Bloom Doll Crafted": new Decimal(400),
  "Shadow Doll Crafted": new Decimal(400),
  "Ember Doll Crafted": new Decimal(400),
  "Gilded Doll Crafted": new Decimal(400),
  "Lumber Doll Crafted": new Decimal(400),
  "Harvest Doll Crafted": new Decimal(400),
  "Sizzle Doll Crafted": new Decimal(400),
  "Angler Doll Crafted": new Decimal(400),
  "Dune Doll Crafted": new Decimal(400),
  "Mouse Doll Crafted": new Decimal(400),
  "Grubby Doll Crafted": new Decimal(400),
  "Nefari Doll Crafted": new Decimal(400),
  "Frosty Doll Crafted": new Decimal(400),
  "Cosmo Doll Crafted": new Decimal(400),
  "Bigfin Doll Crafted": new Decimal(400),
  "Solar Doll Crafted": new Decimal(400),
  "Basic Bed Crafted": new Decimal(300),
  "Sturdy Bed Crafted": new Decimal(300),
  "Floral Bed Crafted": new Decimal(300),
  "Fisher Bed Crafted": new Decimal(300),
  "Pirate Bed Crafted": new Decimal(300),
  "Cow Bed Crafted": new Decimal(300),
  "Desert Bed Crafted": new Decimal(300),
  "Royal Bed Crafted": new Decimal(300),
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
  "Egg Collected": new Decimal(10),
  "Feather Collected": new Decimal(30),
  "Milk Collected": new Decimal(20),
  "Leather Collected": new Decimal(40),
  "Wool Collected": new Decimal(15),
  "Merino Wool Collected": new Decimal(35),

  // Resource Events
  "Tree Chopped": new Decimal(5),
  "Stone Mined": new Decimal(10),
  "Iron Mined": new Decimal(30),
  "Gold Mined": new Decimal(100),
  "Crimstone Mined": new Decimal(170),
  "Oil Drilled": new Decimal(180),
  "Obsidian Collected": new Decimal(1000),

  "Rod Casted": new Decimal(200),
  "Treasure Dug": new Decimal(200),
  "Potion Mixed": new Decimal(32),
  "Farm Cheered": new Decimal(50),
  "Farm Helped": new Decimal(50),
  "Ticket Order Delivered": new Decimal(500),
  "Coins Order Delivered": new Decimal(100),
  "FLOWER Order Delivered": new Decimal(300),
  "Chore Completed": new Decimal(500),
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
    2,
  ).toNumber();

  return stateCopy;
}
