import { RecipeCollectibleName } from "features/game/lib/crafting";
import {
  BumpkinActivityName,
  HarvestEvent,
  CookEvent,
  AnimalResourceEvent,
  OrderDeliveredEvent,
} from "../bumpkinActivity";
import { getKeys } from "../decorations";
import { Bumpkin, GameState } from "../game";
import cloneDeep from "lodash.clonedeep";

export type LeaguePointsEvent = Extract<
  BumpkinActivityName,
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
  | "Farms Cheered"
  | "Farms Helped"
  | "Chore Completed"
>;

export const LEAGUE_POINTS_EVENTS: Record<LeaguePointsEvent, number> = {
  "Sunflower Harvested": 0.01,
  "Potato Harvested": 0.05,
  "Pumpkin Harvested": 0.3,
  "Carrot Harvested": 0.6,
  "Cabbage Harvested": 1.2,
  "Beetroot Harvested": 2.4,
  "Cauliflower Harvested": 4.8,
  "Parsnip Harvested": 7.2,
  "Eggplant Harvested": 9.6,
  "Corn Harvested": 12,
  "Radish Harvested": 14.4,
  "Wheat Harvested": 14.4,
  "Kale Harvested": 21.6,
  "Soybean Harvested": 1.8,
  "Barley Harvested": 28.8,
  "Rhubarb Harvested": 0.1,
  "Zucchini Harvested": 0.6,
  "Yam Harvested": 0.6,
  "Broccoli Harvested": 1.2,
  "Pepper Harvested": 2.4,
  "Onion Harvested": 12,
  "Turnip Harvested": 14.4,
  "Artichoke Harvested": 21.6,
  "Apple Harvested": 28.8,
  "Blueberry Harvested": 14.4,
  "Orange Harvested": 19.2,
  "Banana Harvested": 28.8,
  "Tomato Harvested": 4.8,
  "Lemon Harvested": 9.6,
  "Celestine Harvested": 72,
  "Lunara Harvested": 144,
  "Duskberry Harvested": 288,
  "Red Pansy Harvested": 200,
  "Yellow Pansy Harvested": 200,
  "Purple Pansy Harvested": 200,
  "White Pansy Harvested": 200,
  "Blue Pansy Harvested": 200,
  "Red Cosmos Harvested": 200,
  "Yellow Cosmos Harvested": 200,
  "Purple Cosmos Harvested": 200,
  "White Cosmos Harvested": 200,
  "Blue Cosmos Harvested": 200,
  "Prism Petal Harvested": 300,
  "Red Balloon Flower Harvested": 400,
  "Yellow Balloon Flower Harvested": 400,
  "Purple Balloon Flower Harvested": 400,
  "White Balloon Flower Harvested": 400,
  "Blue Balloon Flower Harvested": 400,
  "Red Daffodil Harvested": 400,
  "Yellow Daffodil Harvested": 400,
  "Purple Daffodil Harvested": 400,
  "White Daffodil Harvested": 400,
  "Blue Daffodil Harvested": 400,
  "Celestial Frostbloom Harvested": 500,
  "Red Carnation Harvested": 1000,
  "Yellow Carnation Harvested": 1000,
  "Purple Carnation Harvested": 1000,
  "White Carnation Harvested": 1000,
  "Blue Carnation Harvested": 1000,
  "Red Lotus Harvested": 1000,
  "Yellow Lotus Harvested": 1000,
  "Purple Lotus Harvested": 1000,
  "White Lotus Harvested": 1000,
  "Blue Lotus Harvested": 1000,
  "Primula Enigma Harvested": 1500,
  "Red Edelweiss Harvested": 600,
  "Yellow Edelweiss Harvested": 600,
  "Purple Edelweiss Harvested": 600,
  "White Edelweiss Harvested": 600,
  "Blue Edelweiss Harvested": 600,
  "Red Gladiolus Harvested": 600,
  "Yellow Gladiolus Harvested": 600,
  "Purple Gladiolus Harvested": 600,
  "White Gladiolus Harvested": 600,
  "Blue Gladiolus Harvested": 600,
  "Red Lavender Harvested": 600,
  "Yellow Lavender Harvested": 600,
  "Purple Lavender Harvested": 600,
  "White Lavender Harvested": 600,
  "Blue Lavender Harvested": 600,
  "Red Clover Harvested": 600,
  "Yellow Clover Harvested": 600,
  "Purple Clover Harvested": 600,
  "White Clover Harvested": 600,
  "Blue Clover Harvested": 600,
  "Honey Harvested": 0,
  "Grape Harvested": 108,
  "Olive Harvested": 288,
  "Rice Harvested": 396,

  // Cook Events
  "Pumpkin Soup Cooked": 0.9,
  "Roasted Cauliflower Cooked": 0,
  "Sauerkraut Cooked": 2,
  "Radish Pie Cooked": 0,
  "Sunflower Cake Cooked": 85,
  "Potato Cake Cooked": 90,
  "Pumpkin Cake Cooked": 80,
  "Carrot Cake Cooked": 85,
  "Cabbage Cake Cooked": 80,
  "Beetroot Cake Cooked": 115,
  "Cauliflower Cake Cooked": 100,
  "Parsnip Cake Cooked": 110,
  "Radish Cake Cooked": 95,
  "Wheat Cake Cooked": 95,
  "Steamed Red Rice Cooked": 110,
  "Tofu Scramble Cooked": 50,
  "Antipasto Cooked": 140,
  "Rice Bun Cooked": 110,
  "Fried Tofu Cooked": 7,
  "Rapid Roast Cooked": 4,
  "Beetroot Blaze Cooked": 25,
  "Shroom Syrup Cooked": 120,
  "Mashed Potato Cooked": 0.3,
  "Bumpkin Broth Cooked": 2,
  "Boiled Eggs Cooked": 20,
  "Mushroom Soup Cooked": 0.2,
  "Roast Veggies Cooked": 10,
  "Bumpkin Salad Cooked": 20,
  "Cauliflower Burger Cooked": 15,
  "Mushroom Jacket Potatoes Cooked": 0.2,
  "Goblin's Treat Cooked": 20,
  "Club Sandwich Cooked": 10,
  "Kale Stew Cooked": 15,
  "Pancakes Cooked": 65,
  "Kale & Mushroom Pie Cooked": 10,
  "Fermented Carrots Cooked": 3,
  "Blueberry Jam Cooked": 5,
  "Apple Pie Cooked": 60,
  "Orange Cake Cooked": 75,
  "Honey Cake Cooked": 110,
  "Sunflower Crunch Cooked": 6,
  "Reindeer Carrot Cooked": 0.7,
  "Apple Juice Cooked": 9,
  "Orange Juice Cooked": 7,
  "Purple Smoothie Cooked": 6,
  "Power Smoothie Cooked": 15,
  "Bumpkin Detox Cooked": 20,
  "Banana Blast Cooked": 40,
  "Grape Juice Cooked": 160,
  "Quick Juice Cooked": 5,
  "Slow Juice Cooked": 425,
  "The Lot Cooked": 35,
  "Carrot Juice Cooked": 4,
  "Bumpkin Roast Cooked": 55,
  "Goblin Brunch Cooked": 120,
  "Fruit Salad Cooked": 4,
  "Kale Omelette Cooked": 85,
  "Cabbers n Mash Cooked": 6,
  "Fancy Fries Cooked": 30,
  "Bumpkin ganoush Cooked": 35,
  "Eggplant Cake Cooked": 90,
  "Cornbread Cooked": 45,
  "Popcorn Cooked": 9,
  "Chowder Cooked": 30,
  "Gumbo Cooked": 20,
  "Fermented Fish Cooked": 25,
  "Fried Calamari Cooked": 25,
  "Fish Burger Cooked": 20,
  "Fish Omelette Cooked": 90,
  "Ocean's Olive Cooked": 90,
  "Seafood Basket Cooked": 25,
  "Fish n Chips Cooked": 30,
  "Sushi Roll Cooked": 65,
  "Cheese Cooked": 30,
  "Pizza Margherita Cooked": 170,
  "Blue Cheese Cooked": 65,
  "Honey Cheddar Cooked": 110,
  "Caprese Salad Cooked": 70,
  "Sour Shake Cooked": 15,
  "Spaghetti al Limone Cooked": 105,
  "Lemon Cheesecake Cooked": 220,
  "Rhubarb Tart Cooked": 0.2,

  // Crafting Events
  "Doll Crafted": 100,
  "Buzz Doll Crafted": 400,
  "Lunar Doll Crafted": 400,
  "Juicy Doll Crafted": 400,
  "Crude Doll Crafted": 400,
  "Cluck Doll Crafted": 400,
  "Wooly Doll Crafted": 400,
  "Moo Doll Crafted": 400,
  "Bloom Doll Crafted": 400,
  "Shadow Doll Crafted": 400,
  "Ember Doll Crafted": 400,
  "Gilded Doll Crafted": 400,
  "Lumber Doll Crafted": 400,
  "Harvest Doll Crafted": 400,
  "Sizzle Doll Crafted": 400,
  "Angler Doll Crafted": 400,
  "Dune Doll Crafted": 400,
  "Mouse Doll Crafted": 400,
  "Grubby Doll Crafted": 400,
  "Nefari Doll Crafted": 400,
  "Frosty Doll Crafted": 400,
  "Cosmo Doll Crafted": 400,
  "Bigfin Doll Crafted": 400,
  "Solar Doll Crafted": 400,
  "Basic Bed Crafted": 300,
  "Sturdy Bed Crafted": 300,
  "Floral Bed Crafted": 300,
  "Fisher Bed Crafted": 300,
  "Pirate Bed Crafted": 300,
  "Cow Bed Crafted": 300,
  "Desert Bed Crafted": 300,
  "Royal Bed Crafted": 300,
  "Cushion Crafted": 0,
  "Timber Crafted": 0,
  "Bee Box Crafted": 0,
  "Crimsteel Crafted": 0,
  "Merino Cushion Crafted": 0,
  "Kelp Fibre Crafted": 0,
  "Hardened Leather Crafted": 0,
  "Synthetic Fabric Crafted": 0,
  "Ocean's Treasure Crafted": 0,
  "Royal Bedding Crafted": 0,
  "Royal Ornament Crafted": 0,

  // Animal Resource Events
  "Egg Collected": 10,
  "Leather Collected": 20,
  "Wool Collected": 15,
  "Merino Wool Collected": 35,
  "Feather Collected": 30,
  "Milk Collected": 40,

  // Resource Events
  "Tree Chopped": 5,
  "Stone Mined": 10,
  "Iron Mined": 30,
  "Gold Mined": 100,
  "Crimstone Mined": 170,
  "Oil Drilled": 180,
  "Obsidian Collected": 1000,

  "Rod Casted": 200,
  "Treasure Dug": 200,
  "Potion Mixed": 320,
  "Farms Cheered": 300,
  "Farms Helped": 300,
  "Ticket Order Delivered": 500,
  "Coins Order Delivered": 100,
  "FLOWER Order Delivered": 300,
  "Chore Completed": 500,
};

/**
 * Calculates league points based on the delta between previous and current bumpkin activities.
 * Only awards points for activities that are tracked in LEAGUE_POINTS_EVENTS.
 * @param previousActivity - Previous bumpkin activity record
 * @param currentActivity - Current bumpkin activity record
 * @returns Total league points to award based on activity increases
 */
export function calculateLeaguePointsFromActivityDelta(
  previousActivity: Bumpkin["activity"],
  currentActivity: Bumpkin["activity"],
): number {
  let totalPoints = 0;

  const previous = previousActivity || {};
  const current = currentActivity || {};

  // Iterate through all tracked league point events
  for (const activityName of getKeys(LEAGUE_POINTS_EVENTS)) {
    const previousCount = previous[activityName] || 0;
    const currentCount = current[activityName] || 0;
    const delta = currentCount - previousCount;

    if (delta > 0) {
      const pointsPerActivity = LEAGUE_POINTS_EVENTS[activityName];
      totalPoints += pointsPerActivity * delta;
    }
  }

  return totalPoints;
}

export function updateLeaguePoints(
  state: GameState,
  previousState: GameState,
): GameState {
  const previousActivity = previousState.bumpkin?.activity;
  const currentActivity = state.bumpkin?.activity;
  const pointsDelta = calculateLeaguePointsFromActivityDelta(
    previousActivity,
    currentActivity,
  );

  if (pointsDelta > 0) {
    // Use cloneDeep to create a mutable copy
    const stateCopy = cloneDeep(state);

    // Initialize leagues structure if it doesn't exist
    if (!stateCopy.prototypes) {
      stateCopy.prototypes = {};
    }
    if (!stateCopy.prototypes.leagues) {
      stateCopy.prototypes.leagues = {
        currentLeague: "Sunflower 1",
        points: 0,
      };
    }

    // Add points
    stateCopy.prototypes.leagues.points =
      (stateCopy.prototypes.leagues.points || 0) + pointsDelta;

    return stateCopy;
  }

  return state;
}
