import { NPC_WEARABLES, NPCName } from "lib/npcs";
import { GameState, InventoryItemName } from "./game";
import { getKeys } from "./decorations";
import { FarmActivityName } from "./farmActivity";
import { BumpkinActivityName } from "./bumpkinActivity";

type ChoreTask = {
  requirement: number;
  progress: (game: GameState) => number;
};

function bumpkinActivityTask({
  activity,
  amount,
}: {
  activity: BumpkinActivityName;
  amount: number;
}): ChoreTask {
  return {
    requirement: amount,
    progress: (game: GameState) => game.bumpkin.activity[activity] ?? 0,
  };
}

function farmActivityTask({
  activity,
  amount,
}: {
  activity: FarmActivityName;
  amount: number;
}): ChoreTask {
  return {
    requirement: amount,
    progress: (game: GameState) => game.farmActivity[activity] ?? 0,
  };
}

export const NPC_CHORES = {
  CHOP_1_TREE: {
    requirement: 1,
    progress: (game: GameState) => game.bumpkin.activity["Tree Chopped"] ?? 0,
  },
  CHOP_2_TREE: {
    requirement: 2,
    progress: (game: GameState) => game.bumpkin.activity["Tree Chopped"] ?? 0,
  },

  "Mine 20 Gold": bumpkinActivityTask({ activity: "Gold Mined", amount: 20 }),
  "Mine 23 Gold": bumpkinActivityTask({ activity: "Gold Mined", amount: 23 }),
  "Mine 25 Gold": bumpkinActivityTask({ activity: "Gold Mined", amount: 25 }),
  "Mine 10 Crimstone": bumpkinActivityTask({
    activity: "Crimstone Mined",
    amount: 10,
  }),
  "Mine 12 Crimstone": bumpkinActivityTask({
    activity: "Crimstone Mined",
    amount: 12,
  }),
  "Mine 15 Crimstone": bumpkinActivityTask({
    activity: "Crimstone Mined",
    amount: 15,
  }),
  "Craft 20 Iron Pickaxe": bumpkinActivityTask({
    activity: "Iron Pickaxe Crafted",
    amount: 20,
  }),
  "Craft 25 Iron Pickaxe": bumpkinActivityTask({
    activity: "Iron Pickaxe Crafted",
    amount: 25,
  }),
  "Craft 15 Gold Pickaxe": bumpkinActivityTask({
    activity: "Gold Pickaxe Crafted",
    amount: 15,
  }),
  "Craft 20 Gold Pickaxe": bumpkinActivityTask({
    activity: "Gold Pickaxe Crafted",
    amount: 20,
  }),
  "Spend 35,000 Coins": bumpkinActivityTask({
    activity: "Coins Spent",
    amount: 35000,
  }),
  "Spend 42,000 Coins": bumpkinActivityTask({
    activity: "Coins Spent",
    amount: 42000,
  }),
  "Spend 55,000 Coins": bumpkinActivityTask({
    activity: "Coins Spent",
    amount: 55000,
  }),

  "Pick 45 Blueberries": bumpkinActivityTask({
    activity: "Blueberry Harvested",
    amount: 45,
  }),
  "Pick 51 Blueberries": bumpkinActivityTask({
    activity: "Blueberry Harvested",
    amount: 51,
  }),
  "Pick 60 Blueberries": bumpkinActivityTask({
    activity: "Blueberry Harvested",
    amount: 60,
  }),
  "Pick 30 Oranges": bumpkinActivityTask({
    activity: "Orange Harvested",
    amount: 30,
  }),
  "Pick 40 Oranges": bumpkinActivityTask({
    activity: "Orange Harvested",
    amount: 40,
  }),
  "Pick 50 Oranges": bumpkinActivityTask({
    activity: "Orange Harvested",
    amount: 50,
  }),
  "Pick 25 Apples": bumpkinActivityTask({
    activity: "Apple Harvested",
    amount: 25,
  }),
  "Pick 30 Apples": bumpkinActivityTask({
    activity: "Apple Harvested",
    amount: 30,
  }),
  "Pick 45 Apples": bumpkinActivityTask({
    activity: "Apple Harvested",
    amount: 45,
  }),
  "Pick 35 Bananas": bumpkinActivityTask({
    activity: "Banana Harvested",
    amount: 35,
  }),
  "Pick 40 Bananas": bumpkinActivityTask({
    activity: "Banana Harvested",
    amount: 40,
  }),
  "Pick 45 Bananas": bumpkinActivityTask({
    activity: "Banana Harvested",
    amount: 45,
  }),
  "Pick 40 Tomatoes": bumpkinActivityTask({
    activity: "Tomato Harvested",
    amount: 40,
  }),
  "Pick 60 Tomatoes": bumpkinActivityTask({
    activity: "Tomato Harvested",
    amount: 60,
  }),
  "Pick 80 Tomatoes": bumpkinActivityTask({
    activity: "Tomato Harvested",
    amount: 80,
  }),
  "Pick 25 Lemons": bumpkinActivityTask({
    activity: "Lemon Harvested",
    amount: 25,
  }),
  "Pick 40 Lemons": bumpkinActivityTask({
    activity: "Lemon Harvested",
    amount: 40,
  }),
  "Pick 65 Lemons": bumpkinActivityTask({
    activity: "Lemon Harvested",
    amount: 65,
  }),

  "Harvest Parsnips 450 times": bumpkinActivityTask({
    activity: "Parsnip Harvested",
    amount: 450,
  }),
  "Harvest Parsnips 500 times": bumpkinActivityTask({
    activity: "Parsnip Harvested",
    amount: 500,
  }),
  "Harvest Eggplants 250 times": bumpkinActivityTask({
    activity: "Eggplant Harvested",
    amount: 250,
  }),
  "Harvest Eggplants 300 times": bumpkinActivityTask({
    activity: "Eggplant Harvested",
    amount: 300,
  }),
  "Harvest Corn 275 times": bumpkinActivityTask({
    activity: "Corn Harvested",
    amount: 275,
  }),
  "Harvest Corn 300 times": bumpkinActivityTask({
    activity: "Corn Harvested",
    amount: 300,
  }),
  "Harvest Radish 200 times": bumpkinActivityTask({
    activity: "Radish Harvested",
    amount: 200,
  }),
  "Harvest Radish 240 times": bumpkinActivityTask({
    activity: "Radish Harvested",
    amount: 240,
  }),
  "Harvest Wheat 200 times": bumpkinActivityTask({
    activity: "Wheat Harvested",
    amount: 200,
  }),
  "Harvest Wheat 240 times": bumpkinActivityTask({
    activity: "Wheat Harvested",
    amount: 240,
  }),
  "Harvest Kale 175 times": bumpkinActivityTask({
    activity: "Kale Harvested",
    amount: 175,
  }),
  "Harvest Kale 200 times": bumpkinActivityTask({
    activity: "Kale Harvested",
    amount: 200,
  }),
  "Cook 15 Honey Cake": bumpkinActivityTask({
    activity: "Honey Cake Cooked",
    amount: 15,
  }),
  "Cook 20 Honey Cake": bumpkinActivityTask({
    activity: "Honey Cake Cooked",
    amount: 20,
  }),
  "Cook 3 Parsnip Cake": bumpkinActivityTask({
    activity: "Parsnip Cake Cooked",
    amount: 3,
  }),
  "Cook 5 Parsnip Cake": bumpkinActivityTask({
    activity: "Parsnip Cake Cooked",
    amount: 5,
  }),
  "Cook 3 Eggplant Cake": bumpkinActivityTask({
    activity: "Eggplant Cake Cooked",
    amount: 3,
  }),
  "Cook 5 Eggplant Cake": bumpkinActivityTask({
    activity: "Eggplant Cake Cooked",
    amount: 5,
  }),
  "Cook 3 Radish Cake": bumpkinActivityTask({
    activity: "Radish Cake Cooked",
    amount: 3,
  }),
  "Cook 5 Radish Cake": bumpkinActivityTask({
    activity: "Radish Cake Cooked",
    amount: 5,
  }),

  "Cook 5 Cauliflower Burger": bumpkinActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 5,
  }),
  "Cook 7 Cauliflower Burger": bumpkinActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 7,
  }),
  "Cook 10 Cauliflower Burger": bumpkinActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 10,
  }),
  "Cook 5 Bumpkin Salad": bumpkinActivityTask({
    activity: "Bumpkin Salad Cooked",
    amount: 5,
  }),
  "Cook 7 Bumpkin Salad": bumpkinActivityTask({
    activity: "Bumpkin Salad Cooked",
    amount: 7,
  }),
  "Cook 10 Bumpkin Salad": bumpkinActivityTask({
    activity: "Bumpkin Salad Cooked",
    amount: 10,
  }),
  "Cook 3 Bumpkin ganoush": bumpkinActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 3,
  }),
  "Cook 5 Bumpkin ganoush": bumpkinActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 5,
  }),
  "Cook 7 Bumpkin ganoush": bumpkinActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 7,
  }),
  "Cook 3 Goblin's Treat": bumpkinActivityTask({
    activity: "Goblin's Treat Cooked",
    amount: 3,
  }),
  "Cook 5 Goblin's Treat": bumpkinActivityTask({
    activity: "Goblin's Treat Cooked",
    amount: 5,
  }),
  "Cook 7 Goblin's Treat": bumpkinActivityTask({
    activity: "Goblin's Treat Cooked",
    amount: 7,
  }),
  "Harvest 250 Beetroot": bumpkinActivityTask({
    activity: "Beetroot Harvested",
    amount: 250,
  }),
  "Harvest 300 Beetroot": bumpkinActivityTask({
    activity: "Beetroot Harvested",
    amount: 300,
  }),
  "Harvest 180 Cauliflower": bumpkinActivityTask({
    activity: "Cauliflower Harvested",
    amount: 180,
  }),
  "Harvest 200 Cauliflower": bumpkinActivityTask({
    activity: "Cauliflower Harvested",
    amount: 200,
  }),
  "Harvest 100 Parsnip": bumpkinActivityTask({
    activity: "Parsnip Harvested",
    amount: 100,
  }),
  "Harvest 150 Parsnip": bumpkinActivityTask({
    activity: "Parsnip Harvested",
    amount: 150,
  }),
  "Harvest 80 Eggplant": bumpkinActivityTask({
    activity: "Eggplant Harvested",
    amount: 80,
  }),
  "Harvest 120 Eggplant": bumpkinActivityTask({
    activity: "Eggplant Harvested",
    amount: 120,
  }),

  "Harvest 150 Sunflowers": bumpkinActivityTask({
    activity: "Sunflower Harvested",
    amount: 150,
  }),
  "Harvest 200 Sunflowers": bumpkinActivityTask({
    activity: "Sunflower Harvested",
    amount: 200,
  }),
  "Harvest 250 Sunflowers": bumpkinActivityTask({
    activity: "Sunflower Harvested",
    amount: 250,
  }),
  "Harvest 100 Potatoes": bumpkinActivityTask({
    activity: "Potato Harvested",
    amount: 100,
  }),
  "Harvest 125 Potatoes": bumpkinActivityTask({
    activity: "Potato Harvested",
    amount: 125,
  }),
  "Harvest 150 Potatoes": bumpkinActivityTask({
    activity: "Potato Harvested",
    amount: 150,
  }),
  "Harvest 75 Pumpkins": bumpkinActivityTask({
    activity: "Pumpkin Harvested",
    amount: 75,
  }),
  "Harvest 100 Pumpkins": bumpkinActivityTask({
    activity: "Pumpkin Harvested",
    amount: 100,
  }),
  "Harvest 125 Pumpkins": bumpkinActivityTask({
    activity: "Pumpkin Harvested",
    amount: 125,
  }),
  "Eat 10 Pumpkin Soup": bumpkinActivityTask({
    activity: "Pumpkin Soup Fed",
    amount: 10,
  }),
  "Eat 12 Pumpkin Soup": bumpkinActivityTask({
    activity: "Pumpkin Soup Fed",
    amount: 12,
  }),
  "Eat 15 Pumpkin Soup": bumpkinActivityTask({
    activity: "Pumpkin Soup Fed",
    amount: 15,
  }),
  "Eat 8 Bumpkin Broth": bumpkinActivityTask({
    activity: "Bumpkin Broth Fed",
    amount: 8,
  }),
  "Eat 12 Bumpkin Broth": bumpkinActivityTask({
    activity: "Bumpkin Broth Fed",
    amount: 12,
  }),
  "Eat 10 Reindeer Carrot": bumpkinActivityTask({
    activity: "Reindeer Carrot Fed",
    amount: 10,
  }),
  "Eat 15 Reindeer Carrot": bumpkinActivityTask({
    activity: "Reindeer Carrot Fed",
    amount: 15,
  }),
  "Cook 3 Bumpkin Broth": bumpkinActivityTask({
    activity: "Bumpkin Broth Cooked",
    amount: 3,
  }),
  "Cook 5 Bumpkin Broth": bumpkinActivityTask({
    activity: "Bumpkin Broth Cooked",
    amount: 5,
  }),
  "Cook 8 Reindeer Carrot": bumpkinActivityTask({
    activity: "Reindeer Carrot Cooked",
    amount: 8,
  }),
  "Cook 12 Reindeer Carrot": bumpkinActivityTask({
    activity: "Reindeer Carrot Cooked",
    amount: 12,
  }),

  "Chop 60 Trees": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 60,
  }),
  "Chop 70 Trees": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 70,
  }),
  "Chop 80 Trees": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 80,
  }),
  "Mine 50 Stones": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 50,
  }),
  "Mine 75 Stones": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 75,
  }),
  "Mine 100 Stones": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 100,
  }),
  "Collect 3 Honey": bumpkinActivityTask({
    activity: "Honey Harvested",
    amount: 3,
  }),
  "Collect 5 Honey": bumpkinActivityTask({
    activity: "Honey Harvested",
    amount: 5,
  }),

  // "Fish 80 times": bumpkinActivityTask({ activity: "Fish Caught", amount: 80 }),
  // "Fish 90 times": bumpkinActivityTask({ activity: "Fish Caught", amount: 90 }),
  // "Fish 100 times": bumpkinActivityTask({ activity: "Fish Caught", amount: 100 }),

  "Cook 3 Fermented Fish": bumpkinActivityTask({
    activity: "Fermented Fish Cooked",
    amount: 3,
  }),
  "Cook 4 Fermented Fish": bumpkinActivityTask({
    activity: "Fermented Fish Cooked",
    amount: 4,
  }),
  "Cook 5 Fermented Fish": bumpkinActivityTask({
    activity: "Fermented Fish Cooked",
    amount: 5,
  }),
  "Cook 10 Chowder": bumpkinActivityTask({
    activity: "Chowder Cooked",
    amount: 10,
  }),
  "Cook 12 Chowder": bumpkinActivityTask({
    activity: "Chowder Cooked",
    amount: 12,
  }),
  "Cook 15 Chowder": bumpkinActivityTask({
    activity: "Chowder Cooked",
    amount: 15,
  }),

  "Craft 30 Fishing Rod": bumpkinActivityTask({
    activity: "Rod Crafted",
    amount: 30,
  }),
  "Craft 40 Fishing Rod": bumpkinActivityTask({
    activity: "Rod Crafted",
    amount: 40,
  }),
  "Craft 50 Fishing Rod": bumpkinActivityTask({
    activity: "Rod Crafted",
    amount: 50,
  }),
  "Cook 5 Gumbo": bumpkinActivityTask({ activity: "Gumbo Cooked", amount: 5 }),
  "Cook 7 Gumbo": bumpkinActivityTask({ activity: "Gumbo Cooked", amount: 7 }),
  "Cook 10 Gumbo": bumpkinActivityTask({
    activity: "Gumbo Cooked",
    amount: 10,
  }),
  "Eat 5 Chowder": bumpkinActivityTask({ activity: "Chowder Fed", amount: 5 }),
  "Eat 7 Chowder": bumpkinActivityTask({ activity: "Chowder Fed", amount: 7 }),
  "Eat 10 Chowder": bumpkinActivityTask({
    activity: "Chowder Fed",
    amount: 10,
  }),

  "Grow 2 Red Pansy": farmActivityTask({
    activity: "Red Pansy Harvested",
    amount: 2,
  }),
  "Grow 3 Red Pansy": farmActivityTask({
    activity: "Red Pansy Harvested",
    amount: 3,
  }),
  "Grow 2 Yellow Pansy": farmActivityTask({
    activity: "Yellow Pansy Harvested",
    amount: 2,
  }),
  "Grow 3 Yellow Pansy": farmActivityTask({
    activity: "Yellow Pansy Harvested",
    amount: 3,
  }),
  "Grow 2 Purple Cosmos": farmActivityTask({
    activity: "Purple Cosmos Harvested",
    amount: 2,
  }),
  "Grow 3 Purple Cosmos": farmActivityTask({
    activity: "Purple Cosmos Harvested",
    amount: 3,
  }),
  "Grow 2 Blue Cosmos": farmActivityTask({
    activity: "Blue Cosmos Harvested",
    amount: 2,
  }),
  "Grow 3 Blue Cosmos": farmActivityTask({
    activity: "Blue Cosmos Harvested",
    amount: 3,
  }),

  "Spend 1,000 Coins": bumpkinActivityTask({
    activity: "Coins Spent",
    amount: 1000,
  }),
  "Spend 2,000 Coins": bumpkinActivityTask({
    activity: "Coins Spent",
    amount: 2000,
  }),
  "Spend 3,000 Coins": bumpkinActivityTask({
    activity: "Coins Spent",
    amount: 3000,
  }),
  "Harvest 50 Carrots": bumpkinActivityTask({
    activity: "Carrot Harvested",
    amount: 50,
  }),
  "Harvest 75 Carrots": bumpkinActivityTask({
    activity: "Carrot Harvested",
    amount: 75,
  }),
  "Harvest 100 Carrots": bumpkinActivityTask({
    activity: "Carrot Harvested",
    amount: 100,
  }),
  "Harvest 25 Cabbage": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 25,
  }),
  "Harvest 50 Cabbage": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 50,
  }),
  "Harvest 75 Cabbage": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 75,
  }),
  "Eat 15 Mashed Potatoes": bumpkinActivityTask({
    activity: "Mashed Potato Fed",
    amount: 15,
  }),
  "Eat 20 Mashed Potatoes": bumpkinActivityTask({
    activity: "Mashed Potato Fed",
    amount: 20,
  }),
  "Eat 25 Mashed Potatoes": bumpkinActivityTask({
    activity: "Mashed Potato Fed",
    amount: 25,
  }),
  "Eat 3 Boiled Eggs": bumpkinActivityTask({
    activity: "Boiled Eggs Fed",
    amount: 3,
  }),
  "Eat 5 Boiled Eggs": bumpkinActivityTask({
    activity: "Boiled Eggs Fed",
    amount: 5,
  }),
  "Eat 7 Boiled Eggs": bumpkinActivityTask({
    activity: "Boiled Eggs Fed",
    amount: 7,
  }),

  "Chop 450 Trees": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 450,
  }),
  "Chop 500 Trees": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 500,
  }),
  "Chop 600 Trees": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 600,
  }),
  "Mine 200 Stones": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 200,
  }),
  "Mine 250 Stones": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 250,
  }),
  "Mine 300 Stones": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 300,
  }),
  "Mine 80 Iron": bumpkinActivityTask({ activity: "Iron Mined", amount: 80 }),
  "Mine 90 Iron": bumpkinActivityTask({ activity: "Iron Mined", amount: 90 }),
  "Mine 100 Iron": bumpkinActivityTask({ activity: "Iron Mined", amount: 100 }),

  "Earn 2,500 Coins": bumpkinActivityTask({
    activity: "Coins Earned",
    amount: 2500,
  }),
  "Earn 3,500 Coins": bumpkinActivityTask({
    activity: "Coins Earned",
    amount: 3500,
  }),
  "Earn 5,000 Coins": bumpkinActivityTask({
    activity: "Coins Earned",
    amount: 5000,
  }),
  "Harvest 15 Soybeans": bumpkinActivityTask({
    activity: "Soybean Harvested",
    amount: 15,
  }),
  "Harvest 30 Soybeans": bumpkinActivityTask({
    activity: "Soybean Harvested",
    amount: 30,
  }),
  "Harvest 50 Soybeans": bumpkinActivityTask({
    activity: "Soybean Harvested",
    amount: 50,
  }),
  "Harvest 15 Beetroots": bumpkinActivityTask({
    activity: "Beetroot Harvested",
    amount: 15,
  }),
  "Harvest 25 Beetroots": bumpkinActivityTask({
    activity: "Beetroot Harvested",
    amount: 25,
  }),
  "Harvest 35 Beetroots": bumpkinActivityTask({
    activity: "Beetroot Harvested",
    amount: 35,
  }),
  "Harvest 10 Cauliflowers": bumpkinActivityTask({
    activity: "Cauliflower Harvested",
    amount: 10,
  }),
  "Harvest 20 Cauliflowers": bumpkinActivityTask({
    activity: "Cauliflower Harvested",
    amount: 20,
  }),
  "Harvest 30 Cauliflowers": bumpkinActivityTask({
    activity: "Cauliflower Harvested",
    amount: 30,
  }),

  "Collect Eggs 10 times": bumpkinActivityTask({
    activity: "Egg Collected",
    amount: 10,
  }),
  "Collect Eggs 15 times": bumpkinActivityTask({
    activity: "Egg Collected",
    amount: 15,
  }),
  "Collect Eggs 20 times": bumpkinActivityTask({
    activity: "Egg Collected",
    amount: 20,
  }),
  // "Collect 5 Wool": bumpkinActivityTask({ activity: "Wool Collected", amount: 5 }),
  // "Collect 10 Wool": bumpkinActivityTask({ activity: "Wool Collected", amount: 10 }),
  // "Collect 15 Wool": bumpkinActivityTask({ activity: "Wool Collected", amount: 15 }),
  // "Collect 5 Milk": bumpkinActivityTask({ activity: "Milk Collected", amount: 5 }),
  // "Collect 7 Milk": bumpkinActivityTask({ activity: "Milk Collected", amount: 7 }),
  // "Collect 10 Milk": bumpkinActivityTask({ activity: "Milk Collected", amount: 10 }),

  // "Fish 10 times": bumpkinActivityTask({ activity: "Fish Caught", amount: 10 }),
  // "Fish 20 times": bumpkinActivityTask({ activity: "Fish Caught", amount: 20 }),
  // "Fish 30 times": bumpkinActivityTask({ activity: "Fish Caught", amount: 30 }),

  "Eat 5 Anchovies": bumpkinActivityTask({
    activity: "Anchovy Fed",
    amount: 5,
  }),
  "Eat 10 Anchovies": bumpkinActivityTask({
    activity: "Anchovy Fed",
    amount: 10,
  }),
  "Eat 15 Anchovies": bumpkinActivityTask({
    activity: "Anchovy Fed",
    amount: 15,
  }),
  "Eat 3 Tunas": bumpkinActivityTask({ activity: "Tuna Fed", amount: 3 }),
  "Eat 6 Tunas": bumpkinActivityTask({ activity: "Tuna Fed", amount: 6 }),
  "Eat 10 Tunas": bumpkinActivityTask({ activity: "Tuna Fed", amount: 10 }),

  "Cook 10 Antipasto": bumpkinActivityTask({
    activity: "Antipasto Cooked",
    amount: 10,
  }),
  "Cook 15 Antipasto": bumpkinActivityTask({
    activity: "Antipasto Cooked",
    amount: 15,
  }),
  "Cook 20 Antipasto": bumpkinActivityTask({
    activity: "Antipasto Cooked",
    amount: 20,
  }),
  "Cook 25 Fruit Salad": bumpkinActivityTask({
    activity: "Fruit Salad Cooked",
    amount: 25,
  }),
  "Cook 35 Fruit Salad": bumpkinActivityTask({
    activity: "Fruit Salad Cooked",
    amount: 35,
  }),
  "Cook 45 Fruit Salad": bumpkinActivityTask({
    activity: "Fruit Salad Cooked",
    amount: 45,
  }),
  "Cook 12 Steamed Red Rice": bumpkinActivityTask({
    activity: "Steamed Red Rice Cooked",
    amount: 12,
  }),
  "Cook 15 Steamed Red Rice": bumpkinActivityTask({
    activity: "Steamed Red Rice Cooked",
    amount: 15,
  }),
  "Cook 17 Steamed Red Rice": bumpkinActivityTask({
    activity: "Steamed Red Rice Cooked",
    amount: 17,
  }),
  "Cook 3 Blueberry Jam": bumpkinActivityTask({
    activity: "Blueberry Jam Cooked",
    amount: 3,
  }),
  "Cook 4 Blueberry Jam": bumpkinActivityTask({
    activity: "Blueberry Jam Cooked",
    amount: 4,
  }),
  "Cook 5 Blueberry Jam": bumpkinActivityTask({
    activity: "Blueberry Jam Cooked",
    amount: 5,
  }),

  "Prepare 10 Banana Blast": bumpkinActivityTask({
    activity: "Banana Blast Cooked",
    amount: 10,
  }),
  "Prepare 20 Banana Blast": bumpkinActivityTask({
    activity: "Banana Blast Cooked",
    amount: 20,
  }),
  "Prepare 30 Banana Blast": bumpkinActivityTask({
    activity: "Banana Blast Cooked",
    amount: 30,
  }),
  "Prepare 15 Bumpkin Detox": bumpkinActivityTask({
    activity: "Bumpkin Detox Cooked",
    amount: 15,
  }),
  "Prepare 25 Bumpkin Detox": bumpkinActivityTask({
    activity: "Bumpkin Detox Cooked",
    amount: 25,
  }),
  "Prepare 35 Bumpkin Detox": bumpkinActivityTask({
    activity: "Bumpkin Detox Cooked",
    amount: 35,
  }),

  "Dig 25 times": bumpkinActivityTask({ activity: "Treasure Dug", amount: 25 }),
  "Dig 35 times": bumpkinActivityTask({ activity: "Treasure Dug", amount: 35 }),
  "Dig 50 times": bumpkinActivityTask({ activity: "Treasure Dug", amount: 50 }),
  "Drink 10 Orange Juice": bumpkinActivityTask({
    activity: "Orange Juice Fed",
    amount: 10,
  }),
  "Drink 20 Orange Juice": bumpkinActivityTask({
    activity: "Orange Juice Fed",
    amount: 20,
  }),
  "Drink 30 Orange Juice": bumpkinActivityTask({
    activity: "Orange Juice Fed",
    amount: 30,
  }),
  "Eat 5 Orange Cake": bumpkinActivityTask({
    activity: "Orange Cake Fed",
    amount: 5,
  }),
  "Eat 6 Orange Cake": bumpkinActivityTask({
    activity: "Orange Cake Fed",
    amount: 6,
  }),
  "Eat 7 Orange Cake": bumpkinActivityTask({
    activity: "Orange Cake Fed",
    amount: 7,
  }),

  // "Collect 10 Sand": bumpkinActivityTask({ activity: "Sand Collected", amount: 10 }),
  // "Collect 15 Sand": bumpkinActivityTask({ activity: "Sand Collected", amount: 15 }),
  // "Collect 20 Sand": bumpkinActivityTask({ activity: "Sand Collected", amount: 20 }),

  // "Dig 150 times": bumpkinActivityTask({ activity: "Treasure Dug", amount: 150 }),
  // "Dig 175 times": bumpkinActivityTask({ activity: "Treasure Dug", amount: 175 }),
  // "Dig 200 times": bumpkinActivityTask({ activity: "Treasure Dug", amount: 200 }),
  // "Craft 5 Sand Drill": bumpkinActivityTask({ activity: "Sand Drill Crafted", amount: 5 }),
  // "Craft 10 Sand Drill": bumpkinActivityTask({ activity: "Sand Drill Crafted", amount: 10 }),
  // "Craft 15 Sand Drill": bumpkinActivityTask({ activity: "Sand Drill Crafted", amount: 15 }),
  // "Complete 3 Digging Puzzle": bumpkinActivityTask({ activity: "Digging Puzzle Completed", amount: 3 }),
  // "Complete 4 Digging Puzzle": bumpkinActivityTask({ activity: "Digging Puzzle Completed", amount: 4 }),
  // "Complete 5 Digging Puzzle": bumpkinActivityTask({ activity: "Digging Puzzle Completed", amount: 5 }),

  // "Drill 8 Oil Reserves": bumpkinActivityTask({ activity: "Oil Reserve Drilled", amount: 8 }),
  // "Drill 9 Oil Reserves": bumpkinActivityTask({ activity: "Oil Reserve Drilled", amount: 9 }),
  // "Drill 10 Oil Reserves": bumpkinActivityTask({ activity: "Oil Reserve Drilled", amount: 10 }),

  "Pick 12 Grapes": bumpkinActivityTask({
    activity: "Grape Harvested",
    amount: 12,
  }),
  "Pick 16 Grapes": bumpkinActivityTask({
    activity: "Grape Harvested",
    amount: 16,
  }),
  "Pick 20 Grapes": bumpkinActivityTask({
    activity: "Grape Harvested",
    amount: 20,
  }),
  "Harvest 8 Rice": bumpkinActivityTask({
    activity: "Rice Harvested",
    amount: 8,
  }),
  "Harvest 10 Rice": bumpkinActivityTask({
    activity: "Rice Harvested",
    amount: 10,
  }),
  "Harvest 12 Rice": bumpkinActivityTask({
    activity: "Rice Harvested",
    amount: 12,
  }),
  "Harvest 4 Olives": bumpkinActivityTask({
    activity: "Olive Harvested",
    amount: 4,
  }),
  "Harvest 6 Olives": bumpkinActivityTask({
    activity: "Olive Harvested",
    amount: 6,
  }),
  "Harvest 8 Olives": bumpkinActivityTask({
    activity: "Olive Harvested",
    amount: 8,
  }),

  // "Play Fruit Dash 5 times": bumpkinActivityTask({ activity: "Fruit Dash Played", amount: 5 }),
  // "Play Fruit Dash 10 times": bumpkinActivityTask({ activity: "Fruit Dash Played", amount: 10 }),
  // "Play Fruit Dash 15 times": bumpkinActivityTask({ activity: "Fruit Dash Played", amount: 15 }),
  // "Play Chicken Rescue 5 times": bumpkinActivityTask({ activity: "Chicken Rescue Played", amount: 5 }),
  // "Play Chicken Rescue 10 times": bumpkinActivityTask({ activity: "Chicken Rescue Played", amount: 10 }),
  // "Play Chicken Rescue 15 times": bumpkinActivityTask({ activity: "Chicken Rescue Played", amount: 15 }),
  // "Play Crops & Chickens 5 times": bumpkinActivityTask({ activity: "Crops & Chickens Played", amount: 5 }),
  // "Play Crops & Chickens 10 times": bumpkinActivityTask({ activity: "Crops & Chickens Played", amount: 10 }),
  // "Play Crops & Chickens 15 times": bumpkinActivityTask({ activity: "Crops & Chickens Played", amount: 15 }),

  // "Rescue 25 Chickens in Chicken Rescue": bumpkinActivityTask({ activity: "Chickens Rescued", amount: 25 }),
  // "Rescue 30 Chickens in Chicken Rescue": bumpkinActivityTask({ activity: "Chickens Rescued", amount: 30 }),
  // "Rescue 35 Chickens in Chicken Rescue": bumpkinActivityTask({ activity: "Chickens Rescued", amount: 35 }),
  // "Rescue 40 Chickens in Chicken Rescue": bumpkinActivityTask({ activity: "Chickens Rescued", amount: 40 }),
  // "Earn 1000 Points in Crops & Chickens": bumpkinActivityTask({ activity: "Points Earned", amount: 1000 }),
  // "Earn 1250 Points in Crops & Chickens": bumpkinActivityTask({ activity: "Points Earned", amount: 1250 }),
  // "Earn 1500 Points in Crops & Chickens": bumpkinActivityTask({ activity: "Points Earned", amount: 1500 }),
  // "Earn 2000 Points in Crops & Chickens": bumpkinActivityTask({ activity: "Points Earned", amount: 2000 }),
  // "Earn 1500 Points in Fruit Dash": bumpkinActivityTask({ activity: "Points Earned", amount: 1500 }),
  // "Earn 2000 Points in Fruit Dash": bumpkinActivityTask({ activity: "Points Earned", amount: 2000 }),
  // "Earn 3000 Points in Fruit Dash": bumpkinActivityTask({ activity: "Points Earned", amount: 3000 }),
  // "Earn 4000 Points in Fruit Dash": bumpkinActivityTask({ activity: "Points Earned", amount: 4000 }),

  // "Play Fruit Dash 25 times": bumpkinActivityTask({ activity: "Fruit Dash Played", amount: 25 }),
  // "Play Fruit Dash 30 times": bumpkinActivityTask({ activity: "Fruit Dash Played", amount: 30 }),
  // "Play Fruit Dash 35 times": bumpkinActivityTask({ activity: "Fruit Dash Played", amount: 35 }),
  // "Play Chicken Rescue 25 times": bumpkinActivityTask({ activity: "Chicken Rescue Played", amount: 25 }),
  // "Play Chicken Rescue 30 times": bumpkinActivityTask({ activity: "Chicken Rescue Played", amount: 30 }),
  // "Play Chicken Rescue 35 times": bumpkinActivityTask({ activity: "Chicken Rescue Played", amount: 35 }),
  // "Play Crops & Chickens 25 times": bumpkinActivityTask({ activity: "Crops & Chickens Played", amount: 25 }),
  // "Play Crops & Chickens 30 times": bumpkinActivityTask({ activity: "Crops & Chickens Played", amount: 30 }),
  // "Play Crops & Chickens 35 times": bumpkinActivityTask({ activity: "Crops & Chickens Played", amount: 35 }),
  // "Rescue 50 Chickens in Chicken Rescue": bumpkinActivityTask({ activity: "Chickens Rescued", amount: 50 }),
  // "Earn 2500 Points in Crops & Chickens": bumpkinActivityTask({ activity: "Points Earned", amount: 2500 }),
  // "Earn 5000 Points in Fruit Dash": bumpkinActivityTask({ activity: "Points Earned", amount: 5000 }),

  "Grow 3 Red Balloon Flower": farmActivityTask({
    activity: "Red Balloon Flower Harvested",
    amount: 3,
  }),
  "Grow 4 Red Balloon Flower": farmActivityTask({
    activity: "Red Balloon Flower Harvested",
    amount: 4,
  }),
  "Grow 5 Red Balloon Flower": farmActivityTask({
    activity: "Red Balloon Flower Harvested",
    amount: 5,
  }),
  "Grow 3 Blue Balloon Flower": farmActivityTask({
    activity: "Blue Balloon Flower Harvested",
    amount: 3,
  }),
  "Grow 4 Blue Balloon Flower": farmActivityTask({
    activity: "Blue Balloon Flower Harvested",
    amount: 4,
  }),
  "Grow 5 Blue Balloon Flower": farmActivityTask({
    activity: "Blue Balloon Flower Harvested",
    amount: 5,
  }),
  "Grow 3 Purple Daffodil": farmActivityTask({
    activity: "Purple Daffodil Harvested",
    amount: 3,
  }),
  "Grow 4 Purple Daffodil": farmActivityTask({
    activity: "Purple Daffodil Harvested",
    amount: 4,
  }),
  "Grow 5 Purple Daffodil": farmActivityTask({
    activity: "Purple Daffodil Harvested",
    amount: 5,
  }),
  "Grow 2 Red Daffodil": farmActivityTask({
    activity: "Red Daffodil Harvested",
    amount: 2,
  }),
  "Grow 3 Red Daffodil": farmActivityTask({
    activity: "Red Daffodil Harvested",
    amount: 3,
  }),

  "Cook 2 Roast Veggies": bumpkinActivityTask({
    activity: "Roast Veggies Cooked",
    amount: 2,
  }),
  "Cook 3 Roast Veggies": bumpkinActivityTask({
    activity: "Roast Veggies Cooked",
    amount: 3,
  }),
  "Cook 4 Roast Veggies": bumpkinActivityTask({
    activity: "Roast Veggies Cooked",
    amount: 4,
  }),
  "Cook 2 Club Sandwich": bumpkinActivityTask({
    activity: "Club Sandwich Cooked",
    amount: 2,
  }),
  "Cook 3 Club Sandwich": bumpkinActivityTask({
    activity: "Club Sandwich Cooked",
    amount: 3,
  }),
  "Cook 4 Club Sandwich": bumpkinActivityTask({
    activity: "Club Sandwich Cooked",
    amount: 4,
  }),
  "Cook 1 Bumpkin ganoush": bumpkinActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 1,
  }),
  "Cook 2 Bumpkin ganoush": bumpkinActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 2,
  }),

  "Craft 10 Axes": bumpkinActivityTask({ activity: "Axe Crafted", amount: 10 }),
  "Craft 12 Axes": bumpkinActivityTask({ activity: "Axe Crafted", amount: 12 }),
  "Craft 15 Axes": bumpkinActivityTask({ activity: "Axe Crafted", amount: 15 }),
  "Craft 3 Pickaxes": bumpkinActivityTask({
    activity: "Pickaxe Crafted",
    amount: 3,
  }),
  "Craft 4 Pickaxes": bumpkinActivityTask({
    activity: "Pickaxe Crafted",
    amount: 4,
  }),
  "Craft 5 Pickaxes": bumpkinActivityTask({
    activity: "Pickaxe Crafted",
    amount: 5,
  }),
  "Chop 3 Trees": bumpkinActivityTask({ activity: "Tree Chopped", amount: 3 }),
  "Chop 4 Trees": bumpkinActivityTask({ activity: "Tree Chopped", amount: 4 }),
  "Chop 5 Trees": bumpkinActivityTask({ activity: "Tree Chopped", amount: 5 }),
  "Mine 2 Stones": bumpkinActivityTask({ activity: "Stone Mined", amount: 2 }),
  "Mine 3 Stones": bumpkinActivityTask({ activity: "Stone Mined", amount: 3 }),
  "Mine 4 Stones": bumpkinActivityTask({ activity: "Stone Mined", amount: 4 }),

  "Grow 3 Yellow Carnation": farmActivityTask({
    activity: "Yellow Carnation Harvested",
    amount: 3,
  }),
  "Grow 3 Blue Carnation": farmActivityTask({
    activity: "Blue Carnation Harvested",
    amount: 3,
  }),
  "Grow 3 White Carnation": farmActivityTask({
    activity: "White Carnation Harvested",
    amount: 3,
  }),
  "Grow 3 Red Lotus": farmActivityTask({
    activity: "Red Lotus Harvested",
    amount: 3,
  }),
  "Grow 3 Yellow Lotus": farmActivityTask({
    activity: "Yellow Lotus Harvested",
    amount: 3,
  }),
  "Grow 3 White Lotus": farmActivityTask({
    activity: "White Lotus Harvested",
    amount: 3,
  }),
  "Grow 3 Blue Pansy": farmActivityTask({
    activity: "Blue Pansy Harvested",
    amount: 3,
  }),
  "Grow 3 White Pansy": farmActivityTask({
    activity: "White Pansy Harvested",
    amount: 3,
  }),
  "Grow 3 White Cosmos": farmActivityTask({
    activity: "White Cosmos Harvested",
    amount: 3,
  }),
  "Grow 6 Purple Daffodil": farmActivityTask({
    activity: "Purple Daffodil Harvested",
    amount: 6,
  }),
  "Grow 6 Red Balloon Flower": farmActivityTask({
    activity: "Red Balloon Flower Harvested",
    amount: 6,
  }),

  "Collect Eggs 40 times": bumpkinActivityTask({
    activity: "Egg Collected",
    amount: 40,
  }),
  "Collect Eggs 60 times": bumpkinActivityTask({
    activity: "Egg Collected",
    amount: 60,
  }),
  "Collect Eggs 80 times": bumpkinActivityTask({
    activity: "Egg Collected",
    amount: 80,
  }),

  // "Collect 20 Wool": bumpkinActivityTask({ activity: "Wool Collected", amount: 20 }),
  // "Collect 30 Wool": bumpkinActivityTask({ activity: "Wool Collected", amount: 30 }),
  // "Collect 40 Wool": bumpkinActivityTask({ activity: "Wool Collected", amount: 40 }),
  // "Collect 10 Milk": bumpkinActivityTask({ activity: "Milk Collected", amount: 10 }),
  // "Collect 20 Milk": bumpkinActivityTask({ activity: "Milk Collected", amount: 20 }),
  // "Collect 30 Milk": bumpkinActivityTask({ activity: "Milk Collected", amount: 30 }),

  "Eat 5 Bumpkin ganoush": bumpkinActivityTask({
    activity: "Bumpkin ganoush Fed",
    amount: 5,
  }),
  "Eat 5 Cauliflower Burger": bumpkinActivityTask({
    activity: "Cauliflower Burger Fed",
    amount: 5,
  }),
  "Eat 4 Club Sandwich": bumpkinActivityTask({
    activity: "Club Sandwich Fed",
    amount: 4,
  }),
  "Eat 6 Cabbers n Mash": bumpkinActivityTask({
    activity: "Cabbers n Mash Fed",
    amount: 6,
  }),
  "Eat 4 Goblin's Treat": bumpkinActivityTask({
    activity: "Goblin's Treat Fed",
    amount: 4,
  }),
  "Eat 3 Pancakes": bumpkinActivityTask({
    activity: "Pancakes Fed",
    amount: 3,
  }),
  "Drink 15 Orange Juice": bumpkinActivityTask({
    activity: "Orange Juice Fed",
    amount: 15,
  }),
  "Drink 15 Purple Smoothies": bumpkinActivityTask({
    activity: "Purple Smoothie Fed",
    amount: 15,
  }),
  "Drink 10 Apple Juice": bumpkinActivityTask({
    activity: "Apple Juice Fed",
    amount: 10,
  }),
  "Drink 5 Power Smoothie": bumpkinActivityTask({
    activity: "Power Smoothie Fed",
    amount: 5,
  }),

  "Cook 10 Kale Stew": bumpkinActivityTask({
    activity: "Kale Stew Cooked",
    amount: 10,
  }),
  "Cook 8 Kale Omelette": bumpkinActivityTask({
    activity: "Kale Omelette Cooked",
    amount: 8,
  }),
  "Cook 3 Mushroom Soup": bumpkinActivityTask({
    activity: "Mushroom Soup Cooked",
    amount: 3,
  }),
  "Cook 20 Boiled Eggs": bumpkinActivityTask({
    activity: "Boiled Eggs Cooked",
    amount: 20,
  }),
  "Cook 2 Beetroot Blaze": bumpkinActivityTask({
    activity: "Beetroot Blaze Cooked",
    amount: 2,
  }),
  "Cook 5 Sushi Roll": bumpkinActivityTask({
    activity: "Sushi Roll Cooked",
    amount: 5,
  }),
  "Cook 5 Fish n Chips": bumpkinActivityTask({
    activity: "Fish n Chips Cooked",
    amount: 5,
  }),
  "Cook 10 Apple Pie": bumpkinActivityTask({
    activity: "Apple Pie Cooked",
    amount: 10,
  }),
  "Cook 10 Orange Cake": bumpkinActivityTask({
    activity: "Orange Cake Cooked",
    amount: 10,
  }),
  "Prepare 20 Bumpkin Detox": bumpkinActivityTask({
    activity: "Bumpkin Detox Cooked",
    amount: 20,
  }),
  "Prepare 25 Banana Blast": bumpkinActivityTask({
    activity: "Banana Blast Cooked",
    amount: 25,
  }),
  "Prepare 25 Carrot Juice": bumpkinActivityTask({
    activity: "Carrot Juice Cooked",
    amount: 25,
  }),
  "Prepare 10 Grape Juice": bumpkinActivityTask({
    activity: "Grape Juice Cooked",
    amount: 10,
  }),
  "Prepare 7 The Lot": bumpkinActivityTask({
    activity: "The Lot Cooked",
    amount: 7,
  }),

  "Cook 2 Mushroom Syrup": bumpkinActivityTask({
    activity: "Shroom Syrup Cooked",
    amount: 2,
  }),
  "Cook 5 Ocean's Olive": bumpkinActivityTask({
    activity: "Ocean's Olive Cooked",
    amount: 5,
  }),
  "Cook 2 Fish n Chips": bumpkinActivityTask({
    activity: "Fish n Chips Cooked",
    amount: 2,
  }),
  "Cook 10 Sushi Roll": bumpkinActivityTask({
    activity: "Sushi Roll Cooked",
    amount: 10,
  }),
  "Cook 5 Bumpkin Roast": bumpkinActivityTask({
    activity: "Bumpkin Roast Cooked",
    amount: 5,
  }),
  "Cook 5 Goblin Brunch": bumpkinActivityTask({
    activity: "Goblin Brunch Cooked",
    amount: 5,
  }),
  "Cook 7 Sunflower Cakes": bumpkinActivityTask({
    activity: "Sunflower Cake Cooked",
    amount: 7,
  }),
  "Cook 6 Potato Cakes": bumpkinActivityTask({
    activity: "Potato Cake Cooked",
    amount: 6,
  }),
  "Cook 6 Pumpkin Cakes": bumpkinActivityTask({
    activity: "Pumpkin Cake Cooked",
    amount: 6,
  }),
  "Cook 5 Carrot Cakes": bumpkinActivityTask({
    activity: "Carrot Cake Cooked",
    amount: 5,
  }),
  "Cook 4 Cabbage Cakes": bumpkinActivityTask({
    activity: "Cabbage Cake Cooked",
    amount: 4,
  }),
} satisfies Record<string, ChoreTask>;

export type ChoreName = keyof typeof NPC_CHORES;

type ChoreDetails = {
  name: ChoreName;
  reward: { items: Partial<Record<InventoryItemName, number>>; coins?: number };
};

export type NpcChore = ChoreDetails & {
  initialProgress: number;
  startedAt: number;
  completedAt?: number;
};

export type ChoreBoard = {
  chores: Partial<Record<NPCName, NpcChore>>;
};

const WEEKLY_CHORES: Record<string, Partial<Record<NPCName, ChoreDetails>>> = {
  "2024-10-14": {
    "pumpkin' pete": { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    bert: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    raven: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    timmy: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    tywin: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    cornwell: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    finn: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    finley: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    miranda: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    jester: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    pharaoh: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    betty: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    peggy: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    tango: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    corale: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    blacksmith: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    victoria: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    "old salty": { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    grimbly: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    grimtooth: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    grubnuk: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    gambit: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
  },
};

export function getChoreProgress({
  chore,
  game,
}: {
  chore: NpcChore;
  game: GameState;
}) {
  const progress = NPC_CHORES[chore.name].progress(game);

  return progress - chore.initialProgress;
}

export const NPC_CHORE_UNLOCKS: Record<NPCName, number> = {
  // Default all to 0
  ...getKeys(NPC_WEARABLES).reduce(
    (acc, npc) => {
      acc[npc] = 0;
      return acc;
    },
    {} as Record<NPCName, number>,
  ),
  "pumpkin' pete": 1,
  betty: 1,
  blacksmith: 1,
  peggy: 3,
  corale: 7,
  tango: 13,
  "old salty": 15,
  victoria: 30,
  grimbly: 10,
  grimtooth: 10,
  gambit: 10,
  jester: 10,
  pharaoh: 10,
  timmy: 10,
  tywin: 10,
  cornwell: 10,
  finn: 10,
  finley: 10,
  miranda: 10,
  raven: 10,
  grubnuk: 10,
  bert: 10,
};
