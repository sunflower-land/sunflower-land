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
  // Keep for testing
  CHOP_1_TREE: {
    requirement: 1,
    progress: (game: GameState) => game.bumpkin.activity["Tree Chopped"] ?? 0,
  },
  CHOP_2_TREE: {
    requirement: 2,
    progress: (game: GameState) => game.bumpkin.activity["Tree Chopped"] ?? 0,
  },
  // Harvest
  "Harvest Sunflowers 150 times": bumpkinActivityTask({
    activity: "Sunflower Harvested",
    amount: 150,
  }),
  "Harvest Sunflowers 200 times": bumpkinActivityTask({
    activity: "Sunflower Harvested",
    amount: 200,
  }),
  "Harvest Sunflowers 250 times": bumpkinActivityTask({
    activity: "Sunflower Harvested",
    amount: 250,
  }),
  "Harvest Potatoes 100 times": bumpkinActivityTask({
    activity: "Potato Harvested",
    amount: 100,
  }),
  "Harvest Potatoes 125 times": bumpkinActivityTask({
    activity: "Potato Harvested",
    amount: 125,
  }),
  "Harvest Potatoes 130 times": bumpkinActivityTask({
    activity: "Potato Harvested",
    amount: 130,
  }),
  "Harvest Potatoes 150 times": bumpkinActivityTask({
    activity: "Potato Harvested",
    amount: 150,
  }),
  "Harvest Potatoes 200 times": bumpkinActivityTask({
    activity: "Potato Harvested",
    amount: 200,
  }),
  "Harvest Potatoes 250 times": bumpkinActivityTask({
    activity: "Potato Harvested",
    amount: 250,
  }),
  "Harvest Rhubarbs 100 times": bumpkinActivityTask({
    activity: "Rhubarb Harvested",
    amount: 100,
  }),
  "Harvest Rhubarbs 125 times": bumpkinActivityTask({
    activity: "Rhubarb Harvested",
    amount: 125,
  }),
  "Harvest Rhubarbs 150 times": bumpkinActivityTask({
    activity: "Rhubarb Harvested",
    amount: 150,
  }),
  "Harvest Pumpkins 100 times": bumpkinActivityTask({
    activity: "Pumpkin Harvested",
    amount: 100,
  }),
  "Harvest Pumpkins 130 times": bumpkinActivityTask({
    activity: "Pumpkin Harvested",
    amount: 130,
  }),
  "Harvest Pumpkins 150 times": bumpkinActivityTask({
    activity: "Pumpkin Harvested",
    amount: 150,
  }),
  "Harvest Pumpkins 200 times": bumpkinActivityTask({
    activity: "Pumpkin Harvested",
    amount: 200,
  }),
  "Harvest Pumpkins 250 times": bumpkinActivityTask({
    activity: "Pumpkin Harvested",
    amount: 250,
  }),
  "Harvest Zucchini 50 times": bumpkinActivityTask({
    activity: "Zucchini Harvested",
    amount: 50,
  }),
  "Harvest Zucchini 75 times": bumpkinActivityTask({
    activity: "Zucchini Harvested",
    amount: 75,
  }),
  "Harvest Zucchini 100 times": bumpkinActivityTask({
    activity: "Zucchini Harvested",
    amount: 100,
  }),
  "Harvest Carrots 50 times": bumpkinActivityTask({
    activity: "Carrot Harvested",
    amount: 50,
  }),
  "Harvest Carrots 60 times": bumpkinActivityTask({
    activity: "Carrot Harvested",
    amount: 60,
  }),
  "Harvest Carrots 75 times": bumpkinActivityTask({
    activity: "Carrot Harvested",
    amount: 75,
  }),
  "Harvest Carrots 100 times": bumpkinActivityTask({
    activity: "Carrot Harvested",
    amount: 100,
  }),
  "Harvest Carrots 120 times": bumpkinActivityTask({
    activity: "Carrot Harvested",
    amount: 120,
  }),
  "Harvest Yam 125 times": bumpkinActivityTask({
    activity: "Yam Harvested",
    amount: 125,
  }),
  "Harvest Yam 150 times": bumpkinActivityTask({
    activity: "Yam Harvested",
    amount: 150,
  }),
  "Harvest Yam 175 times": bumpkinActivityTask({
    activity: "Yam Harvested",
    amount: 175,
  }),
  "Harvest Cabbage 25 times": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 25,
  }),
  "Harvest Cabbage 30 times": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 30,
  }),
  "Harvest Cabbage 40 times": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 40,
  }),
  "Harvest Cabbage 50 times": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 50,
  }),
  "Harvest Cabbage 60 times": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 60,
  }),
  "Harvest Cabbage 75 times": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 75,
  }),
  "Harvest Cabbage 80 times": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 80,
  }),
  "Harvest Cabbage 90 times": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 90,
  }),
  "Harvest Cabbage 100 times": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 100,
  }),
  "Harvest Cabbage 125 times": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 125,
  }),
  "Harvest Cabbage 150 times": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 150,
  }),
  "Harvest Cabbage 175 times": bumpkinActivityTask({
    activity: "Cabbage Harvested",
    amount: 175,
  }),
  "Harvest Broccoli 40 times": bumpkinActivityTask({
    activity: "Broccoli Harvested",
    amount: 40,
  }),
  "Harvest Broccoli 80 times": bumpkinActivityTask({
    activity: "Broccoli Harvested",
    amount: 80,
  }),
  "Harvest Broccoli 100 times": bumpkinActivityTask({
    activity: "Broccoli Harvested",
    amount: 100,
  }),
  "Harvest Soybeans 30 times": bumpkinActivityTask({
    activity: "Soybean Harvested",
    amount: 30,
  }),
  "Harvest Soybeans 60 times": bumpkinActivityTask({
    activity: "Soybean Harvested",
    amount: 60,
  }),
  "Harvest Soybeans 90 times": bumpkinActivityTask({
    activity: "Soybean Harvested",
    amount: 90,
  }),
  "Harvest Beetroot 30 times": bumpkinActivityTask({
    activity: "Beetroot Harvested",
    amount: 30,
  }),
  "Harvest Beetroot 50 times": bumpkinActivityTask({
    activity: "Beetroot Harvested",
    amount: 50,
  }),
  "Harvest Beetroot 60 times": bumpkinActivityTask({
    activity: "Beetroot Harvested",
    amount: 60,
  }),
  "Harvest Beetroot 75 times": bumpkinActivityTask({
    activity: "Beetroot Harvested",
    amount: 75,
  }),
  "Harvest Beetroot 90 times": bumpkinActivityTask({
    activity: "Beetroot Harvested",
    amount: 90,
  }),
  "Harvest Beetroot 100 times": bumpkinActivityTask({
    activity: "Beetroot Harvested",
    amount: 100,
  }),
  "Harvest Beetroot 120 times": bumpkinActivityTask({
    activity: "Beetroot Harvested",
    amount: 120,
  }),
  "Harvest Pepper 25 times": bumpkinActivityTask({
    activity: "Pepper Harvested",
    amount: 25,
  }),
  "Harvest Pepper 40 times": bumpkinActivityTask({
    activity: "Pepper Harvested",
    amount: 40,
  }),
  "Harvest Pepper 50 times": bumpkinActivityTask({
    activity: "Pepper Harvested",
    amount: 50,
  }),
  "Harvest Pepper 75 times": bumpkinActivityTask({
    activity: "Pepper Harvested",
    amount: 75,
  }),
  "Harvest Pepper 80 times": bumpkinActivityTask({
    activity: "Pepper Harvested",
    amount: 80,
  }),
  "Harvest Pepper 100 times": bumpkinActivityTask({
    activity: "Pepper Harvested",
    amount: 100,
  }),
  "Harvest Cauliflower 30 times": bumpkinActivityTask({
    activity: "Cauliflower Harvested",
    amount: 30,
  }),
  "Harvest Cauliflower 60 times": bumpkinActivityTask({
    activity: "Cauliflower Harvested",
    amount: 60,
  }),
  "Harvest Cauliflower 90 times": bumpkinActivityTask({
    activity: "Cauliflower Harvested",
    amount: 90,
  }),
  "Harvest Cauliflower 400 times": bumpkinActivityTask({
    activity: "Cauliflower Harvested",
    amount: 400,
  }),
  "Harvest Cauliflower 450 times": bumpkinActivityTask({
    activity: "Cauliflower Harvested",
    amount: 450,
  }),
  "Harvest Cauliflower 500 times": bumpkinActivityTask({
    activity: "Cauliflower Harvested",
    amount: 500,
  }),
  "Harvest Eggplant 300 times": bumpkinActivityTask({
    activity: "Eggplant Harvested",
    amount: 300,
  }),
  "Harvest Eggplant 360 times": bumpkinActivityTask({
    activity: "Eggplant Harvested",
    amount: 360,
  }),
  "Harvest Eggplant 420 times": bumpkinActivityTask({
    activity: "Eggplant Harvested",
    amount: 420,
  }),
  "Harvest Corn 300 times": bumpkinActivityTask({
    activity: "Corn Harvested",
    amount: 300,
  }),
  "Harvest Corn 360 times": bumpkinActivityTask({
    activity: "Corn Harvested",
    amount: 360,
  }),
  "Harvest Corn 420 times": bumpkinActivityTask({
    activity: "Corn Harvested",
    amount: 420,
  }),
  "Harvest Onions 300 times": bumpkinActivityTask({
    activity: "Onion Harvested",
    amount: 300,
  }),
  "Harvest Onions 360 times": bumpkinActivityTask({
    activity: "Onion Harvested",
    amount: 360,
  }),
  "Harvest Onions 420 times": bumpkinActivityTask({
    activity: "Onion Harvested",
    amount: 420,
  }),
  "Harvest Wheat 240 times": bumpkinActivityTask({
    activity: "Wheat Harvested",
    amount: 240,
  }),
  "Harvest Wheat 250 times": bumpkinActivityTask({
    activity: "Wheat Harvested",
    amount: 250,
  }),
  "Harvest Wheat 300 times": bumpkinActivityTask({
    activity: "Wheat Harvested",
    amount: 300,
  }),
  "Harvest Wheat 360 times": bumpkinActivityTask({
    activity: "Wheat Harvested",
    amount: 360,
  }),
  "Harvest Radish 240 times": bumpkinActivityTask({
    activity: "Radish Harvested",
    amount: 240,
  }),
  "Harvest Radish 280 times": bumpkinActivityTask({
    activity: "Radish Harvested",
    amount: 280,
  }),
  "Harvest Radish 340 times": bumpkinActivityTask({
    activity: "Radish Harvested",
    amount: 340,
  }),
  "Harvest Turnip 250 times": bumpkinActivityTask({
    activity: "Turnip Harvested",
    amount: 250,
  }),
  "Harvest Turnip 300 times": bumpkinActivityTask({
    activity: "Turnip Harvested",
    amount: 300,
  }),
  "Harvest Turnip 360 times": bumpkinActivityTask({
    activity: "Turnip Harvested",
    amount: 360,
  }),
  "Harvest Kale 120 times": bumpkinActivityTask({
    activity: "Kale Harvested",
    amount: 120,
  }),
  "Harvest Kale 180 times": bumpkinActivityTask({
    activity: "Kale Harvested",
    amount: 180,
  }),
  "Harvest Kale 200 times": bumpkinActivityTask({
    activity: "Kale Harvested",
    amount: 200,
  }),
  "Harvest Kale 240 times": bumpkinActivityTask({
    activity: "Kale Harvested",
    amount: 240,
  }),
  "Harvest Artichoke 150 times": bumpkinActivityTask({
    activity: "Artichoke Harvested",
    amount: 150,
  }),
  "Harvest Artichoke 200 times": bumpkinActivityTask({
    activity: "Artichoke Harvested",
    amount: 200,
  }),
  "Harvest Artichoke 260 times": bumpkinActivityTask({
    activity: "Artichoke Harvested",
    amount: 260,
  }),
  "Harvest Barley 100 times": bumpkinActivityTask({
    activity: "Barley Harvested",
    amount: 100,
  }),
  "Harvest Barley 120 times": bumpkinActivityTask({
    activity: "Barley Harvested",
    amount: 120,
  }),
  "Harvest Barley 150 times": bumpkinActivityTask({
    activity: "Barley Harvested",
    amount: 150,
  }),
  "Harvest Barley 180 times": bumpkinActivityTask({
    activity: "Barley Harvested",
    amount: 180,
  }),
  "Harvest Barley 200 times": bumpkinActivityTask({
    activity: "Barley Harvested",
    amount: 200,
  }),
  "Harvest Rice 16 times": bumpkinActivityTask({
    activity: "Rice Harvested",
    amount: 16,
  }),
  "Harvest Rice 20 times": bumpkinActivityTask({
    activity: "Rice Harvested",
    amount: 20,
  }),
  "Harvest Rice 24 times": bumpkinActivityTask({
    activity: "Rice Harvested",
    amount: 24,
  }),
  "Harvest Olives 12 times": bumpkinActivityTask({
    activity: "Olive Harvested",
    amount: 12,
  }),
  "Harvest Olives 16 times": bumpkinActivityTask({
    activity: "Olive Harvested",
    amount: 16,
  }),
  "Harvest Olives 20 times": bumpkinActivityTask({
    activity: "Olive Harvested",
    amount: 20,
  }),

  // Eat
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
  "Eat 10 Boiled Eggs": bumpkinActivityTask({
    activity: "Boiled Eggs Fed",
    amount: 10,
  }),
  "Eat 15 Boiled Eggs": bumpkinActivityTask({
    activity: "Boiled Eggs Fed",
    amount: 15,
  }),
  "Eat 10 Reindeer Carrot": bumpkinActivityTask({
    activity: "Reindeer Carrot Fed",
    amount: 10,
  }),
  "Eat 15 Reindeer Carrot": bumpkinActivityTask({
    activity: "Reindeer Carrot Fed",
    amount: 15,
  }),
  "Eat 20 Anchovies": bumpkinActivityTask({
    activity: "Anchovy Fed",
    amount: 20,
  }),
  "Eat 40 Anchovies": bumpkinActivityTask({
    activity: "Anchovy Fed",
    amount: 40,
  }),
  "Eat 60 Anchovies": bumpkinActivityTask({
    activity: "Anchovy Fed",
    amount: 60,
  }),
  "Eat 10 Tunas": bumpkinActivityTask({
    activity: "Tuna Fed",
    amount: 10,
  }),
  "Eat 20 Tunas": bumpkinActivityTask({
    activity: "Tuna Fed",
    amount: 20,
  }),
  "Eat 30 Tunas": bumpkinActivityTask({
    activity: "Tuna Fed",
    amount: 30,
  }),
  "Eat 5 Cauliflower Burgers": bumpkinActivityTask({
    activity: "Cauliflower Burger Fed",
    amount: 5,
  }),
  "Eat 5 Club Sandwiches": bumpkinActivityTask({
    activity: "Club Sandwich Fed",
    amount: 5,
  }),
  "Eat 5 Pancakes": bumpkinActivityTask({
    activity: "Pancakes Fed",
    amount: 5,
  }),
  "Eat 20 Chowder": bumpkinActivityTask({
    activity: "Chowder Fed",
    amount: 20,
  }),
  "Eat 25 Chowder": bumpkinActivityTask({
    activity: "Chowder Fed",
    amount: 25,
  }),
  "Eat 30 Chowder": bumpkinActivityTask({
    activity: "Chowder Fed",
    amount: 30,
  }),
  "Eat 5 Orange Cake": bumpkinActivityTask({
    activity: "Orange Cake Fed",
    amount: 5,
  }),
  "Eat 7 Orange Cake": bumpkinActivityTask({
    activity: "Orange Cake Fed",
    amount: 7,
  }),
  "Eat 10 Orange Cake": bumpkinActivityTask({
    activity: "Orange Cake Fed",
    amount: 10,
  }),
  "Eat 15 Orange Cake": bumpkinActivityTask({
    activity: "Orange Cake Fed",
    amount: 15,
  }),
  "Eat 10 Mashed Potatoes": bumpkinActivityTask({
    activity: "Mashed Potato Fed",
    amount: 10,
  }),
  "Eat 15 Mashed Potatoes": bumpkinActivityTask({
    activity: "Mashed Potato Fed",
    amount: 15,
  }),
  "Eat 20 Mashed Potatoes": bumpkinActivityTask({
    activity: "Mashed Potato Fed",
    amount: 20,
  }),
  "Eat 30 Mashed Potatoes": bumpkinActivityTask({
    activity: "Mashed Potato Fed",
    amount: 30,
  }),
  "Eat 20 Pumpkin Soup": bumpkinActivityTask({
    activity: "Pumpkin Soup Fed",
    amount: 20,
  }),
  "Eat 30 Pumpkin Soup": bumpkinActivityTask({
    activity: "Pumpkin Soup Fed",
    amount: 30,
  }),
  "Eat 5 Bumpkin Salad": bumpkinActivityTask({
    activity: "Bumpkin Salad Fed",
    amount: 5,
  }),

  // Drink
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
  "Drink 5 Power Smoothies": bumpkinActivityTask({
    activity: "Power Smoothie Fed",
    amount: 5,
  }),
  "Drink 25 Orange Juice": bumpkinActivityTask({
    activity: "Orange Juice Fed",
    amount: 25,
  }),
  "Drink 35 Orange Juice": bumpkinActivityTask({
    activity: "Orange Juice Fed",
    amount: 35,
  }),
  "Drink 40 Orange Juice": bumpkinActivityTask({
    activity: "Orange Juice Fed",
    amount: 40,
  }),
  "Drink 50 Orange Juice": bumpkinActivityTask({
    activity: "Orange Juice Fed",
    amount: 50,
  }),
  "Drink 15 Sour Shakes": bumpkinActivityTask({
    activity: "Sour Shake Fed",
    amount: 15,
  }),
  "Drink 15 Banana Blast": bumpkinActivityTask({
    activity: "Banana Blast Fed",
    amount: 15,
  }),
  "Drink 5 Grape Juice": bumpkinActivityTask({
    activity: "Grape Juice Fed",
    amount: 5,
  }),
  "Drink 10 Orange Juice": bumpkinActivityTask({
    activity: "Orange Juice Fed",
    amount: 10,
  }),
  "Drink 15 Carrot Juice": bumpkinActivityTask({
    activity: "Carrot Juice Fed",
    amount: 15,
  }),

  // Cook
  "Cook Boiled Eggs 3 times": bumpkinActivityTask({
    activity: "Boiled Eggs Cooked",
    amount: 3,
  }),
  "Cook Boiled Eggs 5 times": bumpkinActivityTask({
    activity: "Boiled Eggs Cooked",
    amount: 5,
  }),
  "Cook Reindeer Carrot 8 times": bumpkinActivityTask({
    activity: "Reindeer Carrot Cooked",
    amount: 8,
  }),
  "Cook Reindeer Carrot 12 times": bumpkinActivityTask({
    activity: "Reindeer Carrot Cooked",
    amount: 12,
  }),
  "Cook Mashed Potatoes 15 times": bumpkinActivityTask({
    activity: "Mashed Potato Cooked",
    amount: 15,
  }),
  "Cook Mashed Potatoes 18 times": bumpkinActivityTask({
    activity: "Mashed Potato Cooked",
    amount: 18,
  }),
  "Cook Mashed Potatoes 20 times": bumpkinActivityTask({
    activity: "Mashed Potato Cooked",
    amount: 20,
  }),
  "Cook Roast Veggies 5 times": bumpkinActivityTask({
    activity: "Roast Veggies Cooked",
    amount: 5,
  }),
  "Cook Roast Veggies 6 times": bumpkinActivityTask({
    activity: "Roast Veggies Cooked",
    amount: 6,
  }),
  "Cook Roast Veggies 7 times": bumpkinActivityTask({
    activity: "Roast Veggies Cooked",
    amount: 7,
  }),
  "Cook Club Sandwich 5 times": bumpkinActivityTask({
    activity: "Club Sandwich Cooked",
    amount: 5,
  }),
  "Cook Club Sandwich 6 times": bumpkinActivityTask({
    activity: "Club Sandwich Cooked",
    amount: 6,
  }),
  "Cook Club Sandwich 7 times": bumpkinActivityTask({
    activity: "Club Sandwich Cooked",
    amount: 7,
  }),
  "Cook Pancakes 3 times": bumpkinActivityTask({
    activity: "Pancakes Cooked",
    amount: 3,
  }),
  "Cook Pancakes 4 times": bumpkinActivityTask({
    activity: "Pancakes Cooked",
    amount: 4,
  }),
  "Cook Pancakes 5 times": bumpkinActivityTask({
    activity: "Pancakes Cooked",
    amount: 5,
  }),
  "Cook Pancakes 6 times": bumpkinActivityTask({
    activity: "Pancakes Cooked",
    amount: 6,
  }),
  "Cook Fried Calamari 1 time": bumpkinActivityTask({
    activity: "Fried Calamari Cooked",
    amount: 1,
  }),
  "Cook Fried Calamari 2 times": bumpkinActivityTask({
    activity: "Fried Calamari Cooked",
    amount: 2,
  }),
  "Cook Fried Calamari 3 times": bumpkinActivityTask({
    activity: "Fried Calamari Cooked",
    amount: 3,
  }),
  "Cook Fried Calamari 4 times": bumpkinActivityTask({
    activity: "Fried Calamari Cooked",
    amount: 4,
  }),
  "Cook Cauliflower Burger 5 times": bumpkinActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 5,
  }),
  "Cook Cauliflower Burger 7 times": bumpkinActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 7,
  }),
  "Cook Cauliflower Burger 10 times": bumpkinActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 10,
  }),
  "Cook Bumpkin Salad 5 times": bumpkinActivityTask({
    activity: "Bumpkin Salad Cooked",
    amount: 5,
  }),
  "Cook Bumpkin Salad 7 times": bumpkinActivityTask({
    activity: "Bumpkin Salad Cooked",
    amount: 7,
  }),
  "Cook Bumpkin Salad 10 times": bumpkinActivityTask({
    activity: "Bumpkin Salad Cooked",
    amount: 10,
  }),
  "Cook Bumpkin ganoush 3 times": bumpkinActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 3,
  }),
  "Cook Bumpkin ganoush 5 times": bumpkinActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 5,
  }),
  "Cook Bumpkin ganoush 7 times": bumpkinActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 7,
  }),
  "Cook Goblin's Treat 3 times": bumpkinActivityTask({
    activity: "Goblin's Treat Cooked",
    amount: 3,
  }),
  "Cook Goblin's Treat 5 times": bumpkinActivityTask({
    activity: "Goblin's Treat Cooked",
    amount: 5,
  }),
  "Cook Goblin's Treat 7 times": bumpkinActivityTask({
    activity: "Goblin's Treat Cooked",
    amount: 7,
  }),
  "Cook Gumbo 20 times": bumpkinActivityTask({
    activity: "Gumbo Cooked",
    amount: 20,
  }),
  "Cook Gumbo 25 times": bumpkinActivityTask({
    activity: "Gumbo Cooked",
    amount: 25,
  }),
  "Cook Gumbo 30 times": bumpkinActivityTask({
    activity: "Gumbo Cooked",
    amount: 30,
  }),
  "Cook Sunflower Cake 7 times": bumpkinActivityTask({
    activity: "Sunflower Cake Cooked",
    amount: 7,
  }),
  "Cook Carrot Cake 5 times": bumpkinActivityTask({
    activity: "Carrot Cake Cooked",
    amount: 5,
  }),
  "Cook Cabbage Cake 5 times": bumpkinActivityTask({
    activity: "Cabbage Cake Cooked",
    amount: 5,
  }),
  "Cook Wheat Cake 5 times": bumpkinActivityTask({
    activity: "Wheat Cake Cooked",
    amount: 5,
  }),
  "Cook Honey Cake 10 times": bumpkinActivityTask({
    activity: "Honey Cake Cooked",
    amount: 10,
  }),
  "Cook Honey Cake 15 times": bumpkinActivityTask({
    activity: "Honey Cake Cooked",
    amount: 15,
  }),
  "Cook Honey Cake 20 times": bumpkinActivityTask({
    activity: "Honey Cake Cooked",
    amount: 20,
  }),
  "Cook Cornbread 10 times": bumpkinActivityTask({
    activity: "Cornbread Cooked",
    amount: 10,
  }),
  "Cook Lemon Cheesecakes 3 times": bumpkinActivityTask({
    activity: "Lemon Cheesecake Cooked",
    amount: 3,
  }),
  "Cook Lemon Cheesecakes 5 times": bumpkinActivityTask({
    activity: "Lemon Cheesecake Cooked",
    amount: 5,
  }),
  "Cook Fermented Fish 10 times": bumpkinActivityTask({
    activity: "Fermented Fish Cooked",
    amount: 10,
  }),
  "Cook Fermented Fish 12 times": bumpkinActivityTask({
    activity: "Fermented Fish Cooked",
    amount: 12,
  }),
  "Cook Fermented Fish 15 times": bumpkinActivityTask({
    activity: "Fermented Fish Cooked",
    amount: 15,
  }),
  "Cook Chowder 15 times": bumpkinActivityTask({
    activity: "Chowder Cooked",
    amount: 15,
  }),
  "Cook Chowder 18 times": bumpkinActivityTask({
    activity: "Chowder Cooked",
    amount: 18,
  }),
  "Cook Chowder 21 times": bumpkinActivityTask({
    activity: "Chowder Cooked",
    amount: 21,
  }),
  "Cook Antipasto 25 times": bumpkinActivityTask({
    activity: "Antipasto Cooked",
    amount: 25,
  }),
  "Cook Antipasto 30 times": bumpkinActivityTask({
    activity: "Antipasto Cooked",
    amount: 30,
  }),
  "Cook Antipasto 35 times": bumpkinActivityTask({
    activity: "Antipasto Cooked",
    amount: 35,
  }),
  "Cook Fruit Salad 50 times": bumpkinActivityTask({
    activity: "Fruit Salad Cooked",
    amount: 50,
  }),
  "Cook Fruit Salad 75 times": bumpkinActivityTask({
    activity: "Fruit Salad Cooked",
    amount: 75,
  }),
  "Cook Fruit Salad 100 times": bumpkinActivityTask({
    activity: "Fruit Salad Cooked",
    amount: 100,
  }),
  "Cook Steamed Red Rice 20 times": bumpkinActivityTask({
    activity: "Steamed Red Rice Cooked",
    amount: 20,
  }),
  "Cook Steamed Red Rice 25 times": bumpkinActivityTask({
    activity: "Steamed Red Rice Cooked",
    amount: 25,
  }),
  "Cook Steamed Red Rice 30 times": bumpkinActivityTask({
    activity: "Steamed Red Rice Cooked",
    amount: 30,
  }),
  "Cook Rice Bun 20 times": bumpkinActivityTask({
    activity: "Rice Bun Cooked",
    amount: 20,
  }),
  "Cook Rice Bun 25 times": bumpkinActivityTask({
    activity: "Rice Bun Cooked",
    amount: 25,
  }),
  "Cook Rice Bun 30 times": bumpkinActivityTask({
    activity: "Rice Bun Cooked",
    amount: 30,
  }),
  "Cook Shroom Syrup 2 times": bumpkinActivityTask({
    activity: "Shroom Syrup Cooked",
    amount: 2,
  }),
  "Cook Cheese 50 times": bumpkinActivityTask({
    activity: "Cheese Cooked",
    amount: 50,
  }),
  "Cook Honey Cheddar 5 times": bumpkinActivityTask({
    activity: "Honey Cheddar Cooked",
    amount: 5,
  }),
  "Cook Honey Cheddar 7 times": bumpkinActivityTask({
    activity: "Honey Cheddar Cooked",
    amount: 7,
  }),
  "Cook Honey Cheddar 10 times": bumpkinActivityTask({
    activity: "Honey Cheddar Cooked",
    amount: 10,
  }),
  "Cook Blue Cheese 20 times": bumpkinActivityTask({
    activity: "Blue Cheese Cooked",
    amount: 20,
  }),
  "Cook Blue Cheese 25 times": bumpkinActivityTask({
    activity: "Blue Cheese Cooked",
    amount: 25,
  }),
  "Cook Blue Cheese 30 times": bumpkinActivityTask({
    activity: "Blue Cheese Cooked",
    amount: 30,
  }),
  "Cook Goblin Brunch 1 time": bumpkinActivityTask({
    activity: "Goblin Brunch Cooked",
    amount: 1,
  }),
  "Cook Goblin Brunch 2 times": bumpkinActivityTask({
    activity: "Goblin Brunch Cooked",
    amount: 2,
  }),
  "Cook Goblin Brunch 3 times": bumpkinActivityTask({
    activity: "Goblin Brunch Cooked",
    amount: 3,
  }),
  "Cook Sushi Roll 3 times": bumpkinActivityTask({
    activity: "Sushi Roll Cooked",
    amount: 3,
  }),
  "Cook Sushi Roll 4 times": bumpkinActivityTask({
    activity: "Sushi Roll Cooked",
    amount: 4,
  }),
  "Cook Sushi Roll 5 times": bumpkinActivityTask({
    activity: "Sushi Roll Cooked",
    amount: 5,
  }),
  "Cook Caprese Salad 4 times": bumpkinActivityTask({
    activity: "Caprese Salad Cooked",
    amount: 4,
  }),
  "Cook Caprese Salad 5 times": bumpkinActivityTask({
    activity: "Caprese Salad Cooked",
    amount: 5,
  }),
  "Cook Caprese Salad 6 times": bumpkinActivityTask({
    activity: "Caprese Salad Cooked",
    amount: 6,
  }),
  "Cook Caprese Salad 7 times": bumpkinActivityTask({
    activity: "Caprese Salad Cooked",
    amount: 7,
  }),
  "Cook Caprese Salad 8 times": bumpkinActivityTask({
    activity: "Caprese Salad Cooked",
    amount: 8,
  }),
  "Cook Caprese Salad 10 times": bumpkinActivityTask({
    activity: "Caprese Salad Cooked",
    amount: 10,
  }),
  "Cook Ocean's Olive 3 times": bumpkinActivityTask({
    activity: "Ocean's Olive Cooked",
    amount: 3,
  }),
  "Cook Ocean's Olive 5 times": bumpkinActivityTask({
    activity: "Ocean's Olive Cooked",
    amount: 5,
  }),
  "Cook Ocean's Olive 7 times": bumpkinActivityTask({
    activity: "Ocean's Olive Cooked",
    amount: 7,
  }),
  "Cook Eggplant Cake 5 times": bumpkinActivityTask({
    activity: "Eggplant Cake Cooked",
    amount: 5,
  }),
  "Cook Radish Cake 5 times": bumpkinActivityTask({
    activity: "Radish Cake Cooked",
    amount: 5,
  }),
  "Cook Beetroot Cake 5 times": bumpkinActivityTask({
    activity: "Beetroot Cake Cooked",
    amount: 5,
  }),
  "Cook Pumpkin Soup 5 times": bumpkinActivityTask({
    activity: "Pumpkin Soup Cooked",
    amount: 5,
  }),
  "Cook Pumpkin Soup 7 times": bumpkinActivityTask({
    activity: "Pumpkin Soup Cooked",
    amount: 7,
  }),
  "Cook Pumpkin Soup 10 times": bumpkinActivityTask({
    activity: "Pumpkin Soup Cooked",
    amount: 10,
  }),
  "Cook Bumpkin Roast 5 times": bumpkinActivityTask({
    activity: "Bumpkin Roast Cooked",
    amount: 5,
  }),
  "Cook Bumpkin Roast 7 times": bumpkinActivityTask({
    activity: "Bumpkin Roast Cooked",
    amount: 7,
  }),
  "Cook Bumpkin Roast 10 times": bumpkinActivityTask({
    activity: "Bumpkin Roast Cooked",
    amount: 10,
  }),
  "Cook Pizza Margherita 5 times": bumpkinActivityTask({
    activity: "Pizza Margherita Cooked",
    amount: 5,
  }),
  "Cook Pizza Margherita 7 times": bumpkinActivityTask({
    activity: "Pizza Margherita Cooked",
    amount: 7,
  }),
  "Cook Pizza Margherita 10 times": bumpkinActivityTask({
    activity: "Pizza Margherita Cooked",
    amount: 10,
  }),
  "Cook Apple Pie 15 times": bumpkinActivityTask({
    activity: "Apple Pie Cooked",
    amount: 15,
  }),
  "Cook Potato Cake 7 times": bumpkinActivityTask({
    activity: "Potato Cake Cooked",
    amount: 7,
  }),
  "Cook Carrot Cake 7 times": bumpkinActivityTask({
    activity: "Carrot Cake Cooked",
    amount: 7,
  }),
  "Cook Wheat Cake 7 times": bumpkinActivityTask({
    activity: "Wheat Cake Cooked",
    amount: 7,
  }),
  "Cook Spaghetti al Limone 4 times": bumpkinActivityTask({
    activity: "Spaghetti al Limone Cooked",
    amount: 4,
  }),
  "Cook Spaghetti al Limone 6 times": bumpkinActivityTask({
    activity: "Spaghetti al Limone Cooked",
    amount: 6,
  }),
  "Cook Spaghetti al Limone 8 times": bumpkinActivityTask({
    activity: "Spaghetti al Limone Cooked",
    amount: 8,
  }),
  "Cook Beetroot Cake 7 times": bumpkinActivityTask({
    activity: "Beetroot Cake Cooked",
    amount: 7,
  }),
  "Cook Cabbage Cake 7 times": bumpkinActivityTask({
    activity: "Cabbage Cake Cooked",
    amount: 7,
  }),
  "Cook Parsnip Cake 7 times": bumpkinActivityTask({
    activity: "Parsnip Cake Cooked",
    amount: 7,
  }),
  "Cook Cauliflower Cake 7 times": bumpkinActivityTask({
    activity: "Cauliflower Cake Cooked",
    amount: 7,
  }),

  // Prepare
  "Prepare Power Smoothie 20 times": bumpkinActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 20,
  }),
  "Prepare Power Smoothie 35 times": bumpkinActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 35,
  }),
  "Prepare Power Smoothie 50 times": bumpkinActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 50,
  }),
  "Prepare Slow Juice 5 times": bumpkinActivityTask({
    activity: "Slow Juice Cooked",
    amount: 5,
  }),
  "Prepare Slow Juice 6 times": bumpkinActivityTask({
    activity: "Slow Juice Cooked",
    amount: 6,
  }),
  "Prepare Slow Juice 7 times": bumpkinActivityTask({
    activity: "Slow Juice Cooked",
    amount: 7,
  }),
  "Prepare Banana Blast 20 times": bumpkinActivityTask({
    activity: "Banana Blast Cooked",
    amount: 20,
  }),
  "Prepare Banana Blast 35 times": bumpkinActivityTask({
    activity: "Banana Blast Cooked",
    amount: 35,
  }),
  "Prepare Banana Blast 50 times": bumpkinActivityTask({
    activity: "Banana Blast Cooked",
    amount: 50,
  }),
  "Prepare Grape Juice 10 times": bumpkinActivityTask({
    activity: "Grape Juice Cooked",
    amount: 10,
  }),
  "Prepare Grape Juice 12 times": bumpkinActivityTask({
    activity: "Grape Juice Cooked",
    amount: 12,
  }),
  "Prepare Grape Juice 15 times": bumpkinActivityTask({
    activity: "Grape Juice Cooked",
    amount: 15,
  }),
  "Prepare Apple Juice 5 times": bumpkinActivityTask({
    activity: "Apple Juice Cooked",
    amount: 5,
  }),
  "Prepare Apple Juice 6 times": bumpkinActivityTask({
    activity: "Apple Juice Cooked",
    amount: 6,
  }),
  "Prepare Apple Juice 7 times": bumpkinActivityTask({
    activity: "Apple Juice Cooked",
    amount: 7,
  }),
  "Prepare Apple Juice 15 times": bumpkinActivityTask({
    activity: "Apple Juice Cooked",
    amount: 15,
  }),
  "Prepare Apple Juice 20 times": bumpkinActivityTask({
    activity: "Apple Juice Cooked",
    amount: 20,
  }),
  "Prepare Apple Juice 25 times": bumpkinActivityTask({
    activity: "Apple Juice Cooked",
    amount: 25,
  }),
  "Prepare Carrot Juice 2 times": bumpkinActivityTask({
    activity: "Carrot Juice Cooked",
    amount: 2,
  }),
  "Prepare Carrot Juice 3 times": bumpkinActivityTask({
    activity: "Carrot Juice Cooked",
    amount: 3,
  }),
  "Prepare Carrot Juice 4 times": bumpkinActivityTask({
    activity: "Carrot Juice Cooked",
    amount: 4,
  }),
  "Prepare Purple Smoothie 5 times": bumpkinActivityTask({
    activity: "Purple Smoothie Cooked",
    amount: 5,
  }),
  "Prepare Purple Smoothie 6 times": bumpkinActivityTask({
    activity: "Purple Smoothie Cooked",
    amount: 6,
  }),
  "Prepare Purple Smoothie 7 times": bumpkinActivityTask({
    activity: "Purple Smoothie Cooked",
    amount: 7,
  }),
  "Prepare Power Smoothie 2 times": bumpkinActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 2,
  }),
  "Prepare Power Smoothie 3 times": bumpkinActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 3,
  }),
  "Prepare Power Smoothie 4 times": bumpkinActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 4,
  }),
  // Grow
  "Grow Red Pansy 2 times": bumpkinActivityTask({
    activity: "Red Pansy Harvested",
    amount: 2,
  }),
  "Grow Red Pansy 3 times": bumpkinActivityTask({
    activity: "Red Pansy Harvested",
    amount: 3,
  }),
  "Grow Yellow Pansy 2 times": bumpkinActivityTask({
    activity: "Yellow Pansy Harvested",
    amount: 2,
  }),
  "Grow Yellow Pansy 3 times": bumpkinActivityTask({
    activity: "Yellow Pansy Harvested",
    amount: 3,
  }),
  "Grow Purple Cosmos 2 times": bumpkinActivityTask({
    activity: "Purple Cosmos Harvested",
    amount: 2,
  }),
  "Grow Purple Cosmos 3 times": bumpkinActivityTask({
    activity: "Purple Cosmos Harvested",
    amount: 3,
  }),
  "Grow Blue Cosmos 2 times": bumpkinActivityTask({
    activity: "Blue Cosmos Harvested",
    amount: 2,
  }),
  "Grow Blue Cosmos 3 times": bumpkinActivityTask({
    activity: "Blue Cosmos Harvested",
    amount: 3,
  }),
  "Grow Red Balloon Flower 3 times": bumpkinActivityTask({
    activity: "Red Balloon Flower Harvested",
    amount: 3,
  }),
  "Grow Red Balloon Flower 4 times": bumpkinActivityTask({
    activity: "Red Balloon Flower Harvested",
    amount: 4,
  }),
  "Grow Red Balloon Flower 5 times": bumpkinActivityTask({
    activity: "Red Balloon Flower Harvested",
    amount: 5,
  }),
  "Grow Blue Balloon Flower 3 times": bumpkinActivityTask({
    activity: "Blue Balloon Flower Harvested",
    amount: 3,
  }),
  "Grow Blue Balloon Flower 4 times": bumpkinActivityTask({
    activity: "Blue Balloon Flower Harvested",
    amount: 4,
  }),
  "Grow Blue Balloon Flower 5 times": bumpkinActivityTask({
    activity: "Blue Balloon Flower Harvested",
    amount: 5,
  }),
  "Grow Purple Daffodil 3 times": bumpkinActivityTask({
    activity: "Purple Daffodil Harvested",
    amount: 3,
  }),
  "Grow Purple Daffodil 4 times": bumpkinActivityTask({
    activity: "Purple Daffodil Harvested",
    amount: 4,
  }),
  "Grow Purple Daffodil 5 times": bumpkinActivityTask({
    activity: "Purple Daffodil Harvested",
    amount: 5,
  }),
  "Grow Red Daffodil 2 times": bumpkinActivityTask({
    activity: "Red Daffodil Harvested",
    amount: 2,
  }),
  "Grow Red Daffodil 3 times": bumpkinActivityTask({
    activity: "Red Daffodil Harvested",
    amount: 3,
  }),
  "Grow Yellow Carnation 3 times": bumpkinActivityTask({
    activity: "Yellow Carnation Harvested",
    amount: 3,
  }),
  "Grow Blue Carnation 3 times": bumpkinActivityTask({
    activity: "Blue Carnation Harvested",
    amount: 3,
  }),
  "Grow White Carnation 3 times": bumpkinActivityTask({
    activity: "White Carnation Harvested",
    amount: 3,
  }),
  "Grow Red Lotus 3 times": bumpkinActivityTask({
    activity: "Red Lotus Harvested",
    amount: 3,
  }),
  "Grow Yellow Lotus 3 times": bumpkinActivityTask({
    activity: "Yellow Lotus Harvested",
    amount: 3,
  }),
  "Grow White Lotus 3 times": bumpkinActivityTask({
    activity: "White Lotus Harvested",
    amount: 3,
  }),
  "Grow Blue Pansy 6 times": bumpkinActivityTask({
    activity: "Blue Pansy Harvested",
    amount: 6,
  }),
  "Grow White Pansy 6 times": bumpkinActivityTask({
    activity: "White Pansy Harvested",
    amount: 6,
  }),
  "Grow White Cosmos 3 times": bumpkinActivityTask({
    activity: "White Cosmos Harvested",
    amount: 3,
  }),
  "Grow Purple Daffodil 6 times": bumpkinActivityTask({
    activity: "Purple Daffodil Harvested",
    amount: 6,
  }),
  "Grow Red Balloon Flower 6 times": bumpkinActivityTask({
    activity: "Red Balloon Flower Harvested",
    amount: 6,
  }),

  // Fish
  "Fish 20 times": bumpkinActivityTask({
    activity: "Rod Casted",
    amount: 20,
  }),
  "Fish 40 times": bumpkinActivityTask({
    activity: "Rod Casted",
    amount: 40,
  }),
  "Fish 60 times": bumpkinActivityTask({
    activity: "Rod Casted",
    amount: 60,
  }),
  "Fish 200 times": bumpkinActivityTask({
    activity: "Rod Casted",
    amount: 200,
  }),
  "Fish 250 times": bumpkinActivityTask({
    activity: "Rod Casted",
    amount: 250,
  }),
  "Fish 275 times": bumpkinActivityTask({
    activity: "Rod Casted",
    amount: 275,
  }),

  // Craft
  "Craft 10 Axes": bumpkinActivityTask({
    activity: "Axe Crafted",
    amount: 10,
  }),
  "Craft 12 Axes": bumpkinActivityTask({
    activity: "Axe Crafted",
    amount: 12,
  }),
  "Craft 15 Axes": bumpkinActivityTask({
    activity: "Axe Crafted",
    amount: 15,
  }),
  "Craft 6 Pickaxes": bumpkinActivityTask({
    activity: "Pickaxe Crafted",
    amount: 6,
  }),
  "Craft 8 Pickaxes": bumpkinActivityTask({
    activity: "Pickaxe Crafted",
    amount: 8,
  }),
  "Craft 10 Pickaxes": bumpkinActivityTask({
    activity: "Pickaxe Crafted",
    amount: 10,
  }),
  "Craft 100 Rods": bumpkinActivityTask({
    activity: "Rod Crafted",
    amount: 100,
  }),
  "Craft 150 Rods": bumpkinActivityTask({
    activity: "Rod Crafted",
    amount: 150,
  }),
  "Craft 200 Rods": bumpkinActivityTask({
    activity: "Rod Crafted",
    amount: 200,
  }),
  "Craft 25 Gold Pickaxes": bumpkinActivityTask({
    activity: "Gold Pickaxe Crafted",
    amount: 25,
  }),
  "Craft 30 Gold Pickaxes": bumpkinActivityTask({
    activity: "Gold Pickaxe Crafted",
    amount: 30,
  }),
  "Craft 35 Gold Pickaxes": bumpkinActivityTask({
    activity: "Gold Pickaxe Crafted",
    amount: 35,
  }),
  "Craft 40 Gold Pickaxes": bumpkinActivityTask({
    activity: "Gold Pickaxe Crafted",
    amount: 40,
  }),
  "Craft 5 Sand Drill": bumpkinActivityTask({
    activity: "Sand Drill Crafted",
    amount: 5,
  }),
  "Craft 10 Sand Drill": bumpkinActivityTask({
    activity: "Sand Drill Crafted",
    amount: 10,
  }),
  "Craft 15 Sand Drill": bumpkinActivityTask({
    activity: "Sand Drill Crafted",
    amount: 15,
  }),

  // Chop
  "Chop Trees 10 times": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 10,
  }),
  "Chop Trees 15 times": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 15,
  }),
  "Chop Trees 20 times": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 20,
  }),
  "Chop Trees 100 times": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 100,
  }),
  "Chop Trees 120 times": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 120,
  }),
  "Chop Trees 150 times": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 150,
  }),
  "Chop Trees 450 times": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 450,
  }),
  "Chop Trees 500 times": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 500,
  }),
  "Chop Trees 600 times": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 600,
  }),

  // Mine
  "Mine Stones 5 times": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 5,
  }),
  "Mine Stones 7 times": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 7,
  }),
  "Mine Stones 8 times": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 8,
  }),
  "Mine Stones 50 times": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 50,
  }),
  "Mine Stones 60 times": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 60,
  }),
  "Mine Stones 100 times": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 100,
  }),
  "Mine Gold 30 times": bumpkinActivityTask({
    activity: "Gold Mined",
    amount: 30,
  }),
  "Mine Gold 38 times": bumpkinActivityTask({
    activity: "Gold Mined",
    amount: 38,
  }),
  "Mine Gold 45 times": bumpkinActivityTask({
    activity: "Gold Mined",
    amount: 45,
  }),
  "Mine Crimstone 20 times": bumpkinActivityTask({
    activity: "Crimstone Mined",
    amount: 20,
  }),
  "Mine Crimstone 22 times": bumpkinActivityTask({
    activity: "Crimstone Mined",
    amount: 22,
  }),
  "Mine Crimstone 24 times": bumpkinActivityTask({
    activity: "Crimstone Mined",
    amount: 24,
  }),
  "Mine Iron 150 times": bumpkinActivityTask({
    activity: "Iron Mined",
    amount: 150,
  }),
  "Mine Iron 175 times": bumpkinActivityTask({
    activity: "Iron Mined",
    amount: 175,
  }),
  "Mine Iron 200 times": bumpkinActivityTask({
    activity: "Iron Mined",
    amount: 200,
  }),
  "Mine Iron 225 times": bumpkinActivityTask({
    activity: "Iron Mined",
    amount: 225,
  }),
  "Mine Stones 200 times": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 200,
  }),
  "Mine Stones 250 times": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 250,
  }),
  "Mine Stones 300 times": bumpkinActivityTask({
    activity: "Stone Mined",
    amount: 300,
  }),

  // Drill
  "Drill Oil Reserves 15 times": bumpkinActivityTask({
    activity: "Oil Drilled",
    amount: 15,
  }),
  "Drill Oil Reserves 18 times": bumpkinActivityTask({
    activity: "Oil Drilled",
    amount: 18,
  }),
  "Drill Oil Reserves 21 times": bumpkinActivityTask({
    activity: "Oil Drilled",
    amount: 21,
  }),

  // Pick
  "Pick Blueberries 120 times": bumpkinActivityTask({
    activity: "Blueberry Harvested",
    amount: 120,
  }),
  "Pick Blueberries 150 times": bumpkinActivityTask({
    activity: "Blueberry Harvested",
    amount: 150,
  }),
  "Pick Blueberries 200 times": bumpkinActivityTask({
    activity: "Blueberry Harvested",
    amount: 200,
  }),
  "Pick Oranges 100 times": bumpkinActivityTask({
    activity: "Orange Harvested",
    amount: 100,
  }),
  "Pick Oranges 125 times": bumpkinActivityTask({
    activity: "Orange Harvested",
    amount: 125,
  }),
  "Pick Oranges 160 times": bumpkinActivityTask({
    activity: "Orange Harvested",
    amount: 160,
  }),
  "Pick Apples 60 times": bumpkinActivityTask({
    activity: "Apple Harvested",
    amount: 60,
  }),
  "Pick Apples 75 times": bumpkinActivityTask({
    activity: "Apple Harvested",
    amount: 75,
  }),
  "Pick Apples 90 times": bumpkinActivityTask({
    activity: "Apple Harvested",
    amount: 90,
  }),
  "Pick Tomatoes 150 times": bumpkinActivityTask({
    activity: "Tomato Harvested",
    amount: 150,
  }),
  "Pick Tomatoes 200 times": bumpkinActivityTask({
    activity: "Tomato Harvested",
    amount: 200,
  }),
  "Pick Tomatoes 250 times": bumpkinActivityTask({
    activity: "Tomato Harvested",
    amount: 250,
  }),
  "Pick Grapes 36 times": bumpkinActivityTask({
    activity: "Grape Harvested",
    amount: 36,
  }),
  "Pick Grapes 44 times": bumpkinActivityTask({
    activity: "Grape Harvested",
    amount: 44,
  }),
  "Pick Grapes 52 times": bumpkinActivityTask({
    activity: "Grape Harvested",
    amount: 52,
  }),
  "Pick Bananas 80 times": bumpkinActivityTask({
    activity: "Banana Harvested",
    amount: 80,
  }),
  "Pick Bananas 90 times": bumpkinActivityTask({
    activity: "Banana Harvested",
    amount: 90,
  }),
  "Pick Bananas 100 times": bumpkinActivityTask({
    activity: "Banana Harvested",
    amount: 100,
  }),
  "Pick Bananas 120 times": bumpkinActivityTask({
    activity: "Banana Harvested",
    amount: 120,
  }),
  "Pick Bananas 150 times": bumpkinActivityTask({
    activity: "Banana Harvested",
    amount: 150,
  }),
  "Pick Lemons 150 times": bumpkinActivityTask({
    activity: "Lemon Harvested",
    amount: 150,
  }),
  "Pick Lemons 200 times": bumpkinActivityTask({
    activity: "Lemon Harvested",
    amount: 200,
  }),
  "Pick Lemons 250 times": bumpkinActivityTask({
    activity: "Lemon Harvested",
    amount: 250,
  }),

  // Collect
  "Collect 15 Honey": bumpkinActivityTask({
    activity: "Honey Harvested",
    amount: 15,
  }),
  "Collect 18 Honey": bumpkinActivityTask({
    activity: "Honey Harvested",
    amount: 18,
  }),
  "Collect 21 Honey": bumpkinActivityTask({
    activity: "Honey Harvested",
    amount: 21,
  }),
  "Collect Eggs 60 times": bumpkinActivityTask({
    activity: "Egg Collected",
    amount: 60,
  }),
  "Collect Eggs 80 times": bumpkinActivityTask({
    activity: "Egg Collected",
    amount: 80,
  }),
  "Collect Eggs 100 times": bumpkinActivityTask({
    activity: "Egg Collected",
    amount: 100,
  }),
  "Collect Eggs 125 times": bumpkinActivityTask({
    activity: "Egg Collected",
    amount: 125,
  }),
  "Collect Eggs 150 times": bumpkinActivityTask({
    activity: "Egg Collected",
    amount: 150,
  }),
  "Collect Wool 30 times": bumpkinActivityTask({
    activity: "Wool Collected",
    amount: 30,
  }),
  "Collect Wool 40 times": bumpkinActivityTask({
    activity: "Wool Collected",
    amount: 40,
  }),
  "Collect Wool 50 times": bumpkinActivityTask({
    activity: "Wool Collected",
    amount: 50,
  }),
  "Collect Wool 60 times": bumpkinActivityTask({
    activity: "Wool Collected",
    amount: 60,
  }),
  "Collect Wool 75 times": bumpkinActivityTask({
    activity: "Wool Collected",
    amount: 75,
  }),
  "Collect Milk 30 times": bumpkinActivityTask({
    activity: "Milk Collected",
    amount: 30,
  }),
  "Collect Milk 40 times": bumpkinActivityTask({
    activity: "Milk Collected",
    amount: 40,
  }),
  "Collect Milk 50 times": bumpkinActivityTask({
    activity: "Milk Collected",
    amount: 50,
  }),
  "Collect Milk 60 times": bumpkinActivityTask({
    activity: "Milk Collected",
    amount: 60,
  }),
  "Collect Milk 75 times": bumpkinActivityTask({
    activity: "Milk Collected",
    amount: 75,
  }),

  // Dig
  "Dig 50 times": bumpkinActivityTask({
    activity: "Treasure Dug",
    amount: 50,
  }),
  "Dig 75 times": bumpkinActivityTask({
    activity: "Treasure Dug",
    amount: 75,
  }),
  "Dig 100 times": bumpkinActivityTask({
    activity: "Treasure Dug",
    amount: 100,
  }),
  "Dig 125 times": bumpkinActivityTask({
    activity: "Treasure Dug",
    amount: 125,
  }),
  "Dig 150 times": bumpkinActivityTask({
    activity: "Treasure Dug",
    amount: 150,
  }),
  "Dig 175 times": bumpkinActivityTask({
    activity: "Treasure Dug",
    amount: 175,
  }),
  "Dig 200 times": bumpkinActivityTask({
    activity: "Treasure Dug",
    amount: 200,
  }),
  "Dig 225 times": bumpkinActivityTask({
    activity: "Treasure Dug",
    amount: 225,
  }),

  // Spend
  "Spend 32,000 Coins": bumpkinActivityTask({
    activity: "Coins Spent",
    amount: 32000,
  }),
  "Spend 48,000 Coins": bumpkinActivityTask({
    activity: "Coins Spent",
    amount: 48000,
  }),
  "Spend 64,000 Coins": bumpkinActivityTask({
    activity: "Coins Spent",
    amount: 64000,
  }),

  // To Remove
  "Cook 5 Cauliflower Burger": bumpkinActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 5,
  }),
  "Harvest Potato 100 times": bumpkinActivityTask({
    activity: "Potato Harvested",
    amount: 100,
  }),
  "Eat 15 Pumpkin Soup": bumpkinActivityTask({
    activity: "Pumpkin Soup Fed",
    amount: 15,
  }),
  "Grow 3 Blue Cosmos": bumpkinActivityTask({
    activity: "Blue Cosmos Harvested",
    amount: 3,
  }),
  "Chop 80 Trees": bumpkinActivityTask({
    activity: "Tree Chopped",
    amount: 80,
  }),
  "Pick 60 Blueberries": bumpkinActivityTask({
    activity: "Blueberry Harvested",
    amount: 60,
  }),
  "Cook 10 Sushi Roll": bumpkinActivityTask({
    activity: "Sushi Roll Cooked",
    amount: 10,
  }),
  "Eat 7 Chowder": bumpkinActivityTask({
    activity: "Chowder Fed",
    amount: 7,
  }),
  "Harvest Olives 8 times": bumpkinActivityTask({
    activity: "Olive Harvested",
    amount: 8,
  }),
  "Mine 10 Crimstone": bumpkinActivityTask({
    activity: "Crimstone Mined",
    amount: 10,
  }),
  "Prepare 15 Bumpkin Detox": bumpkinActivityTask({
    activity: "Bumpkin Detox Cooked",
    amount: 15,
  }),
  "Grow White Pansy 3 times": bumpkinActivityTask({
    activity: "White Pansy Harvested",
    amount: 3,
  }),
  "Cook 5 Fermented Fish": bumpkinActivityTask({
    activity: "Fermented Fish Cooked",
    amount: 5,
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
