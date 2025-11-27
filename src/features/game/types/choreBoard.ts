import { NPC_WEARABLES, NPCName } from "lib/npcs";
import { GameState, InventoryItemName } from "./game";
import { getKeys } from "./decorations";
import { FarmActivityName } from "./farmActivity";

type ChoreTask = {
  requirement: number;
  progress: (game: GameState) => number;
};

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
    progress: (game: GameState) => game.farmActivity["Tree Chopped"] ?? 0,
  },
  CHOP_2_TREE: {
    requirement: 2,
    progress: (game: GameState) => game.farmActivity["Tree Chopped"] ?? 0,
  },
  // Harvest
  "Harvest Sunflowers 150 times": farmActivityTask({
    activity: "Sunflower Harvested",
    amount: 150,
  }),
  "Harvest Sunflowers 200 times": farmActivityTask({
    activity: "Sunflower Harvested",
    amount: 200,
  }),
  "Harvest Sunflowers 250 times": farmActivityTask({
    activity: "Sunflower Harvested",
    amount: 250,
  }),
  "Harvest Sunflowers 300 times": farmActivityTask({
    activity: "Sunflower Harvested",
    amount: 300,
  }),
  "Harvest Sunflowers 350 times": farmActivityTask({
    activity: "Sunflower Harvested",
    amount: 350,
  }),
  "Harvest Potatoes 100 times": farmActivityTask({
    activity: "Potato Harvested",
    amount: 100,
  }),
  "Harvest Potatoes 125 times": farmActivityTask({
    activity: "Potato Harvested",
    amount: 125,
  }),
  "Harvest Potatoes 130 times": farmActivityTask({
    activity: "Potato Harvested",
    amount: 130,
  }),
  "Harvest Potatoes 150 times": farmActivityTask({
    activity: "Potato Harvested",
    amount: 150,
  }),
  "Harvest Potatoes 175 times": farmActivityTask({
    activity: "Potato Harvested",
    amount: 175,
  }),
  "Harvest Potatoes 200 times": farmActivityTask({
    activity: "Potato Harvested",
    amount: 200,
  }),
  "Harvest Potatoes 225 times": farmActivityTask({
    activity: "Potato Harvested",
    amount: 225,
  }),
  "Harvest Potatoes 250 times": farmActivityTask({
    activity: "Potato Harvested",
    amount: 250,
  }),
  "Harvest Rhubarbs 100 times": farmActivityTask({
    activity: "Rhubarb Harvested",
    amount: 100,
  }),
  "Harvest Rhubarbs 125 times": farmActivityTask({
    activity: "Rhubarb Harvested",
    amount: 125,
  }),
  "Harvest Rhubarbs 150 times": farmActivityTask({
    activity: "Rhubarb Harvested",
    amount: 150,
  }),
  "Harvest Rhubarbs 200 times": farmActivityTask({
    activity: "Rhubarb Harvested",
    amount: 200,
  }),
  "Harvest Rhubarbs 250 times": farmActivityTask({
    activity: "Rhubarb Harvested",
    amount: 250,
  }),
  "Harvest Rhubarbs 300 times": farmActivityTask({
    activity: "Rhubarb Harvested",
    amount: 300,
  }),
  "Harvest Pumpkins 100 times": farmActivityTask({
    activity: "Pumpkin Harvested",
    amount: 100,
  }),
  "Harvest Pumpkins 130 times": farmActivityTask({
    activity: "Pumpkin Harvested",
    amount: 130,
  }),
  "Harvest Pumpkins 150 times": farmActivityTask({
    activity: "Pumpkin Harvested",
    amount: 150,
  }),
  "Harvest Pumpkins 200 times": farmActivityTask({
    activity: "Pumpkin Harvested",
    amount: 200,
  }),
  "Harvest Pumpkins 250 times": farmActivityTask({
    activity: "Pumpkin Harvested",
    amount: 250,
  }),
  "Harvest Zucchini 50 times": farmActivityTask({
    activity: "Zucchini Harvested",
    amount: 50,
  }),
  "Harvest Zucchini 75 times": farmActivityTask({
    activity: "Zucchini Harvested",
    amount: 75,
  }),
  "Harvest Zucchini 100 times": farmActivityTask({
    activity: "Zucchini Harvested",
    amount: 100,
  }),
  "Harvest Zucchini 125 times": farmActivityTask({
    activity: "Zucchini Harvested",
    amount: 125,
  }),
  "Harvest Zucchini 150 times": farmActivityTask({
    activity: "Zucchini Harvested",
    amount: 150,
  }),
  "Harvest Zucchini 175 times": farmActivityTask({
    activity: "Zucchini Harvested",
    amount: 175,
  }),
  "Harvest Carrots 50 times": farmActivityTask({
    activity: "Carrot Harvested",
    amount: 50,
  }),
  "Harvest Carrots 60 times": farmActivityTask({
    activity: "Carrot Harvested",
    amount: 60,
  }),
  "Harvest Carrots 75 times": farmActivityTask({
    activity: "Carrot Harvested",
    amount: 75,
  }),
  "Harvest Carrots 100 times": farmActivityTask({
    activity: "Carrot Harvested",
    amount: 100,
  }),
  "Harvest Carrots 120 times": farmActivityTask({
    activity: "Carrot Harvested",
    amount: 120,
  }),
  "Harvest Carrots 125 times": farmActivityTask({
    activity: "Carrot Harvested",
    amount: 125,
  }),
  "Harvest Carrots 130 times": farmActivityTask({
    activity: "Carrot Harvested",
    amount: 130,
  }),
  "Harvest Carrots 150 times": farmActivityTask({
    activity: "Carrot Harvested",
    amount: 150,
  }),
  "Harvest Carrots 170 times": farmActivityTask({
    activity: "Carrot Harvested",
    amount: 170,
  }),
  "Harvest Carrots 175 times": farmActivityTask({
    activity: "Carrot Harvested",
    amount: 175,
  }),
  "Harvest Carrots 200 times": farmActivityTask({
    activity: "Carrot Harvested",
    amount: 200,
  }),
  "Harvest Yam 30 times": farmActivityTask({
    activity: "Yam Harvested",
    amount: 30,
  }),
  "Harvest Yam 60 times": farmActivityTask({
    activity: "Yam Harvested",
    amount: 60,
  }),
  "Harvest Yam 90 times": farmActivityTask({
    activity: "Yam Harvested",
    amount: 90,
  }),
  "Harvest Yam 125 times": farmActivityTask({
    activity: "Yam Harvested",
    amount: 125,
  }),
  "Harvest Yam 150 times": farmActivityTask({
    activity: "Yam Harvested",
    amount: 150,
  }),
  "Harvest Yam 175 times": farmActivityTask({
    activity: "Yam Harvested",
    amount: 175,
  }),
  "Harvest Yam 200 times": farmActivityTask({
    activity: "Yam Harvested",
    amount: 200,
  }),
  "Harvest Yam 225 times": farmActivityTask({
    activity: "Yam Harvested",
    amount: 225,
  }),
  "Harvest Yam 250 times": farmActivityTask({
    activity: "Yam Harvested",
    amount: 250,
  }),
  "Harvest Yam 275 times": farmActivityTask({
    activity: "Yam Harvested",
    amount: 275,
  }),
  "Harvest Cabbage 25 times": farmActivityTask({
    activity: "Cabbage Harvested",
    amount: 25,
  }),
  "Harvest Cabbage 30 times": farmActivityTask({
    activity: "Cabbage Harvested",
    amount: 30,
  }),
  "Harvest Cabbage 40 times": farmActivityTask({
    activity: "Cabbage Harvested",
    amount: 40,
  }),
  "Harvest Cabbage 50 times": farmActivityTask({
    activity: "Cabbage Harvested",
    amount: 50,
  }),
  "Harvest Cabbage 60 times": farmActivityTask({
    activity: "Cabbage Harvested",
    amount: 60,
  }),
  "Harvest Cabbage 75 times": farmActivityTask({
    activity: "Cabbage Harvested",
    amount: 75,
  }),
  "Harvest Cabbage 80 times": farmActivityTask({
    activity: "Cabbage Harvested",
    amount: 80,
  }),
  "Harvest Cabbage 90 times": farmActivityTask({
    activity: "Cabbage Harvested",
    amount: 90,
  }),
  "Harvest Cabbage 100 times": farmActivityTask({
    activity: "Cabbage Harvested",
    amount: 100,
  }),
  "Harvest Cabbage 125 times": farmActivityTask({
    activity: "Cabbage Harvested",
    amount: 125,
  }),
  "Harvest Cabbage 150 times": farmActivityTask({
    activity: "Cabbage Harvested",
    amount: 150,
  }),
  "Harvest Cabbage 175 times": farmActivityTask({
    activity: "Cabbage Harvested",
    amount: 175,
  }),
  "Harvest Cabbage 200 times": farmActivityTask({
    activity: "Cabbage Harvested",
    amount: 200,
  }),
  "Harvest Cabbage 220 times": farmActivityTask({
    activity: "Cabbage Harvested",
    amount: 220,
  }),
  "Harvest Broccoli 40 times": farmActivityTask({
    activity: "Broccoli Harvested",
    amount: 40,
  }),
  "Harvest Broccoli 80 times": farmActivityTask({
    activity: "Broccoli Harvested",
    amount: 80,
  }),
  "Harvest Broccoli 100 times": farmActivityTask({
    activity: "Broccoli Harvested",
    amount: 100,
  }),
  "Harvest Broccoli 125 times": farmActivityTask({
    activity: "Broccoli Harvested",
    amount: 125,
  }),
  "Harvest Broccoli 150 times": farmActivityTask({
    activity: "Broccoli Harvested",
    amount: 150,
  }),
  "Harvest Broccoli 175 times": farmActivityTask({
    activity: "Broccoli Harvested",
    amount: 175,
  }),
  "Harvest Soybeans 30 times": farmActivityTask({
    activity: "Soybean Harvested",
    amount: 30,
  }),
  "Harvest Soybeans 60 times": farmActivityTask({
    activity: "Soybean Harvested",
    amount: 60,
  }),
  "Harvest Soybeans 90 times": farmActivityTask({
    activity: "Soybean Harvested",
    amount: 90,
  }),
  "Harvest Soybeans 75 times": farmActivityTask({
    activity: "Soybean Harvested",
    amount: 75,
  }),
  "Harvest Soybeans 100 times": farmActivityTask({
    activity: "Soybean Harvested",
    amount: 100,
  }),
  "Harvest Soybeans 125 times": farmActivityTask({
    activity: "Soybean Harvested",
    amount: 125,
  }),
  "Harvest Soybeans 150 times": farmActivityTask({
    activity: "Soybean Harvested",
    amount: 150,
  }),
  "Harvest Beetroot 30 times": farmActivityTask({
    activity: "Beetroot Harvested",
    amount: 30,
  }),
  "Harvest Beetroot 50 times": farmActivityTask({
    activity: "Beetroot Harvested",
    amount: 50,
  }),
  "Harvest Beetroot 60 times": farmActivityTask({
    activity: "Beetroot Harvested",
    amount: 60,
  }),
  "Harvest Beetroot 75 times": farmActivityTask({
    activity: "Beetroot Harvested",
    amount: 75,
  }),
  "Harvest Beetroot 90 times": farmActivityTask({
    activity: "Beetroot Harvested",
    amount: 90,
  }),
  "Harvest Beetroot 100 times": farmActivityTask({
    activity: "Beetroot Harvested",
    amount: 100,
  }),
  "Harvest Beetroot 120 times": farmActivityTask({
    activity: "Beetroot Harvested",
    amount: 120,
  }),
  "Harvest Beetroot 125 times": farmActivityTask({
    activity: "Beetroot Harvested",
    amount: 125,
  }),
  "Harvest Beetroot 150 times": farmActivityTask({
    activity: "Beetroot Harvested",
    amount: 150,
  }),
  "Harvest Beetroot 175 times": farmActivityTask({
    activity: "Beetroot Harvested",
    amount: 175,
  }),
  "Harvest Beetroots 125 times": farmActivityTask({
    activity: "Beetroot Harvested",
    amount: 125,
  }),
  "Harvest Beetroots 150 times": farmActivityTask({
    activity: "Beetroot Harvested",
    amount: 150,
  }),
  "Harvest Beetroots 200 times": farmActivityTask({
    activity: "Beetroot Harvested",
    amount: 200,
  }),
  "Harvest Beetroots 220 times": farmActivityTask({
    activity: "Beetroot Harvested",
    amount: 220,
  }),
  "Harvest Pepper 25 times": farmActivityTask({
    activity: "Pepper Harvested",
    amount: 25,
  }),
  "Harvest Pepper 40 times": farmActivityTask({
    activity: "Pepper Harvested",
    amount: 40,
  }),
  "Harvest Pepper 50 times": farmActivityTask({
    activity: "Pepper Harvested",
    amount: 50,
  }),
  "Harvest Pepper 75 times": farmActivityTask({
    activity: "Pepper Harvested",
    amount: 75,
  }),
  "Harvest Pepper 80 times": farmActivityTask({
    activity: "Pepper Harvested",
    amount: 80,
  }),
  "Harvest Pepper 100 times": farmActivityTask({
    activity: "Pepper Harvested",
    amount: 100,
  }),
  "Harvest Pepper 125 times": farmActivityTask({
    activity: "Pepper Harvested",
    amount: 125,
  }),
  "Harvest Pepper 150 times": farmActivityTask({
    activity: "Pepper Harvested",
    amount: 150,
  }),
  "Harvest Cauliflower 30 times": farmActivityTask({
    activity: "Cauliflower Harvested",
    amount: 30,
  }),
  "Harvest Cauliflower 60 times": farmActivityTask({
    activity: "Cauliflower Harvested",
    amount: 60,
  }),
  "Harvest Cauliflower 90 times": farmActivityTask({
    activity: "Cauliflower Harvested",
    amount: 90,
  }),
  "Harvest Cauliflower 400 times": farmActivityTask({
    activity: "Cauliflower Harvested",
    amount: 400,
  }),
  "Harvest Cauliflower 450 times": farmActivityTask({
    activity: "Cauliflower Harvested",
    amount: 450,
  }),
  "Harvest Cauliflower 500 times": farmActivityTask({
    activity: "Cauliflower Harvested",
    amount: 500,
  }),
  "Harvest Cauliflowers 75 times": farmActivityTask({
    activity: "Cauliflower Harvested",
    amount: 75,
  }),
  "Harvest Cauliflowers 100 times": farmActivityTask({
    activity: "Cauliflower Harvested",
    amount: 100,
  }),
  "Harvest Cauliflowers 125 times": farmActivityTask({
    activity: "Cauliflower Harvested",
    amount: 125,
  }),
  "Harvest Cauliflowers 150 times": farmActivityTask({
    activity: "Cauliflower Harvested",
    amount: 150,
  }),
  "Harvest Cauliflowers 175 times": farmActivityTask({
    activity: "Cauliflower Harvested",
    amount: 175,
  }),
  "Harvest Parsnips 50 times": farmActivityTask({
    activity: "Parsnip Harvested",
    amount: 50,
  }),
  "Harvest Parsnips 75 times": farmActivityTask({
    activity: "Parsnip Harvested",
    amount: 75,
  }),
  "Harvest Parsnips 100 times": farmActivityTask({
    activity: "Parsnip Harvested",
    amount: 100,
  }),
  "Harvest Parsnips 125 times": farmActivityTask({
    activity: "Parsnip Harvested",
    amount: 125,
  }),
  "Harvest Eggplant 300 times": farmActivityTask({
    activity: "Eggplant Harvested",
    amount: 300,
  }),
  "Harvest Eggplant 360 times": farmActivityTask({
    activity: "Eggplant Harvested",
    amount: 360,
  }),
  "Harvest Eggplant 420 times": farmActivityTask({
    activity: "Eggplant Harvested",
    amount: 420,
  }),
  "Harvest Eggplant 480 times": farmActivityTask({
    activity: "Eggplant Harvested",
    amount: 480,
  }),
  "Harvest Corn 50 times": farmActivityTask({
    activity: "Corn Harvested",
    amount: 50,
  }),
  "Harvest Corn 100 times": farmActivityTask({
    activity: "Corn Harvested",
    amount: 100,
  }),
  "Harvest Corn 125 times": farmActivityTask({
    activity: "Corn Harvested",
    amount: 125,
  }),
  "Harvest Corn 150 times": farmActivityTask({
    activity: "Corn Harvested",
    amount: 150,
  }),
  "Harvest Corn 300 times": farmActivityTask({
    activity: "Corn Harvested",
    amount: 300,
  }),
  "Harvest Corn 350 times": farmActivityTask({
    activity: "Corn Harvested",
    amount: 350,
  }),
  "Harvest Corn 360 times": farmActivityTask({
    activity: "Corn Harvested",
    amount: 360,
  }),
  "Harvest Corn 400 times": farmActivityTask({
    activity: "Corn Harvested",
    amount: 400,
  }),
  "Harvest Corn 420 times": farmActivityTask({
    activity: "Corn Harvested",
    amount: 420,
  }),
  "Harvest Corn 450 times": farmActivityTask({
    activity: "Corn Harvested",
    amount: 450,
  }),
  "Harvest Onion 360 times": farmActivityTask({
    activity: "Onion Harvested",
    amount: 360,
  }),
  "Harvest Onion 420 times": farmActivityTask({
    activity: "Onion Harvested",
    amount: 420,
  }),
  "Harvest Onion 460 times": farmActivityTask({
    activity: "Onion Harvested",
    amount: 460,
  }),
  "Harvest Onions 300 times": farmActivityTask({
    activity: "Onion Harvested",
    amount: 300,
  }),
  "Harvest Onions 360 times": farmActivityTask({
    activity: "Onion Harvested",
    amount: 360,
  }),
  "Harvest Onions 420 times": farmActivityTask({
    activity: "Onion Harvested",
    amount: 420,
  }),
  "Harvest Wheat 240 times": farmActivityTask({
    activity: "Wheat Harvested",
    amount: 240,
  }),
  "Harvest Wheat 250 times": farmActivityTask({
    activity: "Wheat Harvested",
    amount: 250,
  }),
  "Harvest Wheat 275 times": farmActivityTask({
    activity: "Wheat Harvested",
    amount: 275,
  }),
  "Harvest Wheat 300 times": farmActivityTask({
    activity: "Wheat Harvested",
    amount: 300,
  }),
  "Harvest Wheat 325 times": farmActivityTask({
    activity: "Wheat Harvested",
    amount: 325,
  }),
  "Harvest Wheat 350 times": farmActivityTask({
    activity: "Wheat Harvested",
    amount: 350,
  }),
  "Harvest Wheat 360 times": farmActivityTask({
    activity: "Wheat Harvested",
    amount: 360,
  }),
  "Harvest Wheat 400 times": farmActivityTask({
    activity: "Wheat Harvested",
    amount: 400,
  }),
  "Harvest Wheat 420 times": farmActivityTask({
    activity: "Wheat Harvested",
    amount: 420,
  }),
  "Harvest Radish 240 times": farmActivityTask({
    activity: "Radish Harvested",
    amount: 240,
  }),
  "Harvest Radish 275 times": farmActivityTask({
    activity: "Radish Harvested",
    amount: 275,
  }),
  "Harvest Radish 280 times": farmActivityTask({
    activity: "Radish Harvested",
    amount: 280,
  }),
  "Harvest Radish 325 times": farmActivityTask({
    activity: "Radish Harvested",
    amount: 325,
  }),
  "Harvest Radish 340 times": farmActivityTask({
    activity: "Radish Harvested",
    amount: 340,
  }),
  "Harvest Radish 400 times": farmActivityTask({
    activity: "Radish Harvested",
    amount: 400,
  }),
  "Harvest Turnip 250 times": farmActivityTask({
    activity: "Turnip Harvested",
    amount: 250,
  }),
  "Harvest Turnip 300 times": farmActivityTask({
    activity: "Turnip Harvested",
    amount: 300,
  }),
  "Harvest Turnip 350 times": farmActivityTask({
    activity: "Turnip Harvested",
    amount: 350,
  }),
  "Harvest Turnip 360 times": farmActivityTask({
    activity: "Turnip Harvested",
    amount: 360,
  }),
  "Harvest Turnip 400 times": farmActivityTask({
    activity: "Turnip Harvested",
    amount: 400,
  }),
  "Harvest Kale 120 times": farmActivityTask({
    activity: "Kale Harvested",
    amount: 120,
  }),
  "Harvest Kale 150 times": farmActivityTask({
    activity: "Kale Harvested",
    amount: 150,
  }),
  "Harvest Kale 180 times": farmActivityTask({
    activity: "Kale Harvested",
    amount: 180,
  }),
  "Harvest Kale 200 times": farmActivityTask({
    activity: "Kale Harvested",
    amount: 200,
  }),
  "Harvest Kale 220 times": farmActivityTask({
    activity: "Kale Harvested",
    amount: 220,
  }),
  "Harvest Kale 240 times": farmActivityTask({
    activity: "Kale Harvested",
    amount: 240,
  }),
  "Harvest Kale 250 times": farmActivityTask({
    activity: "Kale Harvested",
    amount: 250,
  }),
  "Harvest Kale 300 times": farmActivityTask({
    activity: "Kale Harvested",
    amount: 300,
  }),
  "Harvest Artichoke 150 times": farmActivityTask({
    activity: "Artichoke Harvested",
    amount: 150,
  }),
  "Harvest Artichoke 200 times": farmActivityTask({
    activity: "Artichoke Harvested",
    amount: 200,
  }),
  "Harvest Artichoke 250 times": farmActivityTask({
    activity: "Artichoke Harvested",
    amount: 250,
  }),
  "Harvest Artichoke 260 times": farmActivityTask({
    activity: "Artichoke Harvested",
    amount: 260,
  }),
  "Harvest Artichoke 300 times": farmActivityTask({
    activity: "Artichoke Harvested",
    amount: 300,
  }),
  "Harvest Barley 100 times": farmActivityTask({
    activity: "Barley Harvested",
    amount: 100,
  }),
  "Harvest Barley 120 times": farmActivityTask({
    activity: "Barley Harvested",
    amount: 120,
  }),
  "Harvest Barley 125 times": farmActivityTask({
    activity: "Barley Harvested",
    amount: 125,
  }),
  "Harvest Barley 150 times": farmActivityTask({
    activity: "Barley Harvested",
    amount: 150,
  }),
  "Harvest Barley 175 times": farmActivityTask({
    activity: "Barley Harvested",
    amount: 175,
  }),
  "Harvest Barley 180 times": farmActivityTask({
    activity: "Barley Harvested",
    amount: 180,
  }),
  "Harvest Barley 200 times": farmActivityTask({
    activity: "Barley Harvested",
    amount: 200,
  }),
  "Harvest Barley 250 times": farmActivityTask({
    activity: "Barley Harvested",
    amount: 250,
  }),
  "Harvest Rice 16 times": farmActivityTask({
    activity: "Rice Harvested",
    amount: 16,
  }),
  "Harvest Rice 20 times": farmActivityTask({
    activity: "Rice Harvested",
    amount: 20,
  }),
  "Harvest Rice 24 times": farmActivityTask({
    activity: "Rice Harvested",
    amount: 24,
  }),
  "Harvest Rice 28 times": farmActivityTask({
    activity: "Rice Harvested",
    amount: 28,
  }),
  "Harvest Olives 12 times": farmActivityTask({
    activity: "Olive Harvested",
    amount: 12,
  }),
  "Harvest Olives 16 times": farmActivityTask({
    activity: "Olive Harvested",
    amount: 16,
  }),
  "Harvest Olives 20 times": farmActivityTask({
    activity: "Olive Harvested",
    amount: 20,
  }),
  "Harvest Olives 24 times": farmActivityTask({
    activity: "Olive Harvested",
    amount: 24,
  }),

  // Eat
  "Eat 3 Boiled Eggs": farmActivityTask({
    activity: "Boiled Eggs Fed",
    amount: 3,
  }),
  "Eat 5 Boiled Eggs": farmActivityTask({
    activity: "Boiled Eggs Fed",
    amount: 5,
  }),
  "Eat 7 Boiled Eggs": farmActivityTask({
    activity: "Boiled Eggs Fed",
    amount: 7,
  }),
  "Eat 10 Boiled Eggs": farmActivityTask({
    activity: "Boiled Eggs Fed",
    amount: 10,
  }),
  "Eat 15 Boiled Eggs": farmActivityTask({
    activity: "Boiled Eggs Fed",
    amount: 15,
  }),
  "Eat 10 Reindeer Carrot": farmActivityTask({
    activity: "Reindeer Carrot Fed",
    amount: 10,
  }),
  "Eat 15 Reindeer Carrot": farmActivityTask({
    activity: "Reindeer Carrot Fed",
    amount: 15,
  }),
  "Eat 20 Anchovies": farmActivityTask({
    activity: "Anchovy Fed",
    amount: 20,
  }),
  "Eat 35 Anchovies": farmActivityTask({
    activity: "Anchovy Fed",
    amount: 35,
  }),
  "Eat 40 Anchovies": farmActivityTask({
    activity: "Anchovy Fed",
    amount: 40,
  }),
  "Eat 50 Anchovies": farmActivityTask({
    activity: "Anchovy Fed",
    amount: 50,
  }),
  "Eat 60 Anchovies": farmActivityTask({
    activity: "Anchovy Fed",
    amount: 60,
  }),
  "Eat 65 Anchovies": farmActivityTask({
    activity: "Anchovy Fed",
    amount: 65,
  }),
  "Eat 10 Tunas": farmActivityTask({
    activity: "Tuna Fed",
    amount: 10,
  }),
  "Eat 20 Tunas": farmActivityTask({
    activity: "Tuna Fed",
    amount: 20,
  }),
  "Eat 25 Tunas": farmActivityTask({
    activity: "Tuna Fed",
    amount: 25,
  }),
  "Eat 30 Tunas": farmActivityTask({
    activity: "Tuna Fed",
    amount: 30,
  }),
  "Eat 50 Tunas": farmActivityTask({
    activity: "Tuna Fed",
    amount: 50,
  }),
  "Eat 75 Tunas": farmActivityTask({
    activity: "Tuna Fed",
    amount: 75,
  }),
  "Eat 15 Red Snappers": farmActivityTask({
    activity: "Red Snapper Fed",
    amount: 15,
  }),
  "Eat 30 Red Snappers": farmActivityTask({
    activity: "Red Snapper Fed",
    amount: 30,
  }),
  "Eat 45 Red Snappers": farmActivityTask({
    activity: "Red Snapper Fed",
    amount: 45,
  }),
  "Eat 5 Cauliflower Burgers": farmActivityTask({
    activity: "Cauliflower Burger Fed",
    amount: 5,
  }),
  "Eat 5 Club Sandwiches": farmActivityTask({
    activity: "Club Sandwich Fed",
    amount: 5,
  }),
  "Eat 5 Pancakes": farmActivityTask({
    activity: "Pancakes Fed",
    amount: 5,
  }),
  "Eat 20 Chowder": farmActivityTask({
    activity: "Chowder Fed",
    amount: 20,
  }),
  "Eat 25 Chowder": farmActivityTask({
    activity: "Chowder Fed",
    amount: 25,
  }),
  "Eat 30 Chowder": farmActivityTask({
    activity: "Chowder Fed",
    amount: 30,
  }),
  "Eat 5 Orange Cake": farmActivityTask({
    activity: "Orange Cake Fed",
    amount: 5,
  }),
  "Eat 7 Orange Cake": farmActivityTask({
    activity: "Orange Cake Fed",
    amount: 7,
  }),
  "Eat 10 Orange Cake": farmActivityTask({
    activity: "Orange Cake Fed",
    amount: 10,
  }),
  "Eat 13 Orange Cake": farmActivityTask({
    activity: "Orange Cake Fed",
    amount: 13,
  }),
  "Eat 15 Orange Cake": farmActivityTask({
    activity: "Orange Cake Fed",
    amount: 15,
  }),
  "Eat 16 Orange Cake": farmActivityTask({
    activity: "Orange Cake Fed",
    amount: 16,
  }),
  "Eat 20 Orange Cake": farmActivityTask({
    activity: "Orange Cake Fed",
    amount: 20,
  }),
  "Eat 10 Mashed Potatoes": farmActivityTask({
    activity: "Mashed Potato Fed",
    amount: 10,
  }),
  "Eat 15 Mashed Potatoes": farmActivityTask({
    activity: "Mashed Potato Fed",
    amount: 15,
  }),
  "Eat 20 Mashed Potatoes": farmActivityTask({
    activity: "Mashed Potato Fed",
    amount: 20,
  }),
  "Eat 30 Mashed Potatoes": farmActivityTask({
    activity: "Mashed Potato Fed",
    amount: 30,
  }),
  "Eat 20 Pumpkin Soup": farmActivityTask({
    activity: "Pumpkin Soup Fed",
    amount: 20,
  }),
  "Eat 30 Pumpkin Soup": farmActivityTask({
    activity: "Pumpkin Soup Fed",
    amount: 30,
  }),
  "Eat 5 Bumpkin Salad": farmActivityTask({
    activity: "Bumpkin Salad Fed",
    amount: 5,
  }),

  // Drink
  "Drink 15 Orange Juice": farmActivityTask({
    activity: "Orange Juice Fed",
    amount: 15,
  }),
  "Drink 15 Purple Smoothies": farmActivityTask({
    activity: "Purple Smoothie Fed",
    amount: 15,
  }),
  "Drink Purple Smoothies 15 times": farmActivityTask({
    activity: "Purple Smoothie Fed",
    amount: 15,
  }),
  "Drink Purple Smoothies 20 times": farmActivityTask({
    activity: "Purple Smoothie Fed",
    amount: 20,
  }),
  "Drink 10 Apple Juice": farmActivityTask({
    activity: "Apple Juice Fed",
    amount: 10,
  }),
  "Drink Apple Juice 10 times": farmActivityTask({
    activity: "Apple Juice Fed",
    amount: 10,
  }),
  "Drink Apple Juice 15 times": farmActivityTask({
    activity: "Apple Juice Fed",
    amount: 15,
  }),
  "Drink 5 Power Smoothies": farmActivityTask({
    activity: "Power Smoothie Fed",
    amount: 5,
  }),
  "Drink 25 Orange Juice": farmActivityTask({
    activity: "Orange Juice Fed",
    amount: 25,
  }),
  "Drink 35 Orange Juice": farmActivityTask({
    activity: "Orange Juice Fed",
    amount: 35,
  }),
  "Drink 40 Orange Juice": farmActivityTask({
    activity: "Orange Juice Fed",
    amount: 40,
  }),
  "Drink 50 Orange Juice": farmActivityTask({
    activity: "Orange Juice Fed",
    amount: 50,
  }),
  "Drink 45 Orange Juice": farmActivityTask({
    activity: "Orange Juice Fed",
    amount: 45,
  }),
  "Drink 55 Orange Juice": farmActivityTask({
    activity: "Orange Juice Fed",
    amount: 55,
  }),
  "Drink Orange Juice 15 times": farmActivityTask({
    activity: "Orange Juice Fed",
    amount: 15,
  }),
  "Drink Orange Juice 20 times": farmActivityTask({
    activity: "Orange Juice Fed",
    amount: 20,
  }),
  "Drink 15 Sour Shakes": farmActivityTask({
    activity: "Sour Shake Fed",
    amount: 15,
  }),
  "Drink 15 Banana Blast": farmActivityTask({
    activity: "Banana Blast Fed",
    amount: 15,
  }),
  "Drink 5 Grape Juice": farmActivityTask({
    activity: "Grape Juice Fed",
    amount: 5,
  }),
  "Drink 10 Orange Juice": farmActivityTask({
    activity: "Orange Juice Fed",
    amount: 10,
  }),
  "Drink 15 Carrot Juice": farmActivityTask({
    activity: "Carrot Juice Fed",
    amount: 15,
  }),

  // Cook
  "Cook Boiled Eggs 3 times": farmActivityTask({
    activity: "Boiled Eggs Cooked",
    amount: 3,
  }),
  "Cook Boiled Eggs 5 times": farmActivityTask({
    activity: "Boiled Eggs Cooked",
    amount: 5,
  }),
  "Cook Boiled Eggs 10 times": farmActivityTask({
    activity: "Boiled Eggs Cooked",
    amount: 10,
  }),
  "Cook Boiled Eggs 15 times": farmActivityTask({
    activity: "Boiled Eggs Cooked",
    amount: 15,
  }),
  "Cook Boiled Eggs 25 times": farmActivityTask({
    activity: "Boiled Eggs Cooked",
    amount: 25,
  }),
  "Cook Reindeer Carrot 8 times": farmActivityTask({
    activity: "Reindeer Carrot Cooked",
    amount: 8,
  }),
  "Cook Reindeer Carrot 12 times": farmActivityTask({
    activity: "Reindeer Carrot Cooked",
    amount: 12,
  }),
  "Cook Reindeer Carrot 20 times": farmActivityTask({
    activity: "Reindeer Carrot Cooked",
    amount: 20,
  }),
  "Cook Reindeer Carrot 25 times": farmActivityTask({
    activity: "Reindeer Carrot Cooked",
    amount: 25,
  }),
  "Cook Mashed Potatoes 15 times": farmActivityTask({
    activity: "Mashed Potato Cooked",
    amount: 15,
  }),
  "Cook Mashed Potatoes 18 times": farmActivityTask({
    activity: "Mashed Potato Cooked",
    amount: 18,
  }),
  "Cook Mashed Potatoes 20 times": farmActivityTask({
    activity: "Mashed Potato Cooked",
    amount: 20,
  }),
  "Cook Mashed Potatoes 50 times": farmActivityTask({
    activity: "Mashed Potato Cooked",
    amount: 50,
  }),
  "Cook Mashed Potatoes 65 times": farmActivityTask({
    activity: "Mashed Potato Cooked",
    amount: 65,
  }),
  "Cook Roast Veggies 5 times": farmActivityTask({
    activity: "Roast Veggies Cooked",
    amount: 5,
  }),
  "Cook Roast Veggies 6 times": farmActivityTask({
    activity: "Roast Veggies Cooked",
    amount: 6,
  }),
  "Cook Roast Veggies 7 times": farmActivityTask({
    activity: "Roast Veggies Cooked",
    amount: 7,
  }),
  "Cook Club Sandwich 5 times": farmActivityTask({
    activity: "Club Sandwich Cooked",
    amount: 5,
  }),
  "Cook Club Sandwich 6 times": farmActivityTask({
    activity: "Club Sandwich Cooked",
    amount: 6,
  }),
  "Cook Club Sandwich 7 times": farmActivityTask({
    activity: "Club Sandwich Cooked",
    amount: 7,
  }),
  "Cook Pancakes 3 times": farmActivityTask({
    activity: "Pancakes Cooked",
    amount: 3,
  }),
  "Cook Pancakes 4 times": farmActivityTask({
    activity: "Pancakes Cooked",
    amount: 4,
  }),
  "Cook Pancakes 5 times": farmActivityTask({
    activity: "Pancakes Cooked",
    amount: 5,
  }),
  "Cook Pancakes 6 times": farmActivityTask({
    activity: "Pancakes Cooked",
    amount: 6,
  }),
  "Cook Pancakes 7 times": farmActivityTask({
    activity: "Pancakes Cooked",
    amount: 7,
  }),
  "Cook Pancakes 10 times": farmActivityTask({
    activity: "Pancakes Cooked",
    amount: 10,
  }),
  "Cook Pancakes 12 times": farmActivityTask({
    activity: "Pancakes Cooked",
    amount: 12,
  }),
  "Cook Pancakes 15 times": farmActivityTask({
    activity: "Pancakes Cooked",
    amount: 15,
  }),
  "Cook Fried Calamari 1 time": farmActivityTask({
    activity: "Fried Calamari Cooked",
    amount: 1,
  }),
  "Cook Fried Calamari 2 times": farmActivityTask({
    activity: "Fried Calamari Cooked",
    amount: 2,
  }),
  "Cook Fried Calamari 3 times": farmActivityTask({
    activity: "Fried Calamari Cooked",
    amount: 3,
  }),
  "Cook Fried Calamari 4 times": farmActivityTask({
    activity: "Fried Calamari Cooked",
    amount: 4,
  }),
  "Cook Fried Calamari 5 times": farmActivityTask({
    activity: "Fried Calamari Cooked",
    amount: 5,
  }),
  "Cook Cauliflower Burger 5 times": farmActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 5,
  }),
  "Cook Cauliflower Burger 7 times": farmActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 7,
  }),
  "Cook Cauliflower Burger 10 times": farmActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 10,
  }),
  "Cook Cauliflower Burger 15 times": farmActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 15,
  }),
  "Cook Cauliflower Burger 17 times": farmActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 17,
  }),
  "Cook Cauliflower Burger 20 times": farmActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 20,
  }),
  "Cook Cauliflower Burger 25 times": farmActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 25,
  }),
  "Cook Cauliflower Burger 30 times": farmActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 30,
  }),
  "Cook Cauliflower Burger 35 times": farmActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 35,
  }),
  "Cook Bumpkin Salad 5 times": farmActivityTask({
    activity: "Bumpkin Salad Cooked",
    amount: 5,
  }),
  "Cook Bumpkin Salad 7 times": farmActivityTask({
    activity: "Bumpkin Salad Cooked",
    amount: 7,
  }),
  "Cook Bumpkin Salad 10 times": farmActivityTask({
    activity: "Bumpkin Salad Cooked",
    amount: 10,
  }),
  "Cook Bumpkin Salad 15 times": farmActivityTask({
    activity: "Bumpkin Salad Cooked",
    amount: 15,
  }),
  "Cook Bumpkin Salad 17 times": farmActivityTask({
    activity: "Bumpkin Salad Cooked",
    amount: 17,
  }),
  "Cook Bumpkin Salad 20 times": farmActivityTask({
    activity: "Bumpkin Salad Cooked",
    amount: 20,
  }),
  "Cook Bumpkin ganoush 3 times": farmActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 3,
  }),
  "Cook Bumpkin ganoush 5 times": farmActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 5,
  }),
  "Cook Bumpkin ganoush 7 times": farmActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 7,
  }),
  "Cook Bumpkin ganoush 10 times": farmActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 10,
  }),
  "Cook Bumpkin ganoush 12 times": farmActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 12,
  }),
  "Cook Bumpkin ganoush 15 times": farmActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 15,
  }),
  "Cook Bumpkin ganoush 20 times": farmActivityTask({
    activity: "Bumpkin ganoush Cooked",
    amount: 20,
  }),
  "Cook Goblin's Treat 3 times": farmActivityTask({
    activity: "Goblin's Treat Cooked",
    amount: 3,
  }),
  "Cook Goblin's Treat 5 times": farmActivityTask({
    activity: "Goblin's Treat Cooked",
    amount: 5,
  }),
  "Cook Goblin's Treat 7 times": farmActivityTask({
    activity: "Goblin's Treat Cooked",
    amount: 7,
  }),
  "Cook Goblin's Treat 10 times": farmActivityTask({
    activity: "Goblin's Treat Cooked",
    amount: 10,
  }),
  "Cook Goblin's Treat 12 times": farmActivityTask({
    activity: "Goblin's Treat Cooked",
    amount: 12,
  }),
  "Cook Gumbo 20 times": farmActivityTask({
    activity: "Gumbo Cooked",
    amount: 20,
  }),
  "Cook Gumbo 25 times": farmActivityTask({
    activity: "Gumbo Cooked",
    amount: 25,
  }),
  "Cook Gumbo 30 times": farmActivityTask({
    activity: "Gumbo Cooked",
    amount: 30,
  }),
  "Cook Gumbo 45 times": farmActivityTask({
    activity: "Gumbo Cooked",
    amount: 45,
  }),
  "Cook Gumbo 60 times": farmActivityTask({
    activity: "Gumbo Cooked",
    amount: 60,
  }),
  "Cook Gumbo 35 times": farmActivityTask({
    activity: "Gumbo Cooked",
    amount: 35,
  }),
  "Cook Gumbo 50 times": farmActivityTask({
    activity: "Gumbo Cooked",
    amount: 50,
  }),
  "Cook Sunflower Cake 7 times": farmActivityTask({
    activity: "Sunflower Cake Cooked",
    amount: 7,
  }),
  "Cook 10 Sunflower Cakes": farmActivityTask({
    activity: "Sunflower Cake Cooked",
    amount: 10,
  }),
  "Cook 15 Sunflower Cakes": farmActivityTask({
    activity: "Sunflower Cake Cooked",
    amount: 15,
  }),
  "Cook Sunflower Cakes 10 times": farmActivityTask({
    activity: "Sunflower Cake Cooked",
    amount: 10,
  }),
  "Cook Sunflower Cakes 15 times": farmActivityTask({
    activity: "Sunflower Cake Cooked",
    amount: 15,
  }),
  "Cook Carrot Cake 5 times": farmActivityTask({
    activity: "Carrot Cake Cooked",
    amount: 5,
  }),
  "Cook 7 Carrot Cakes": farmActivityTask({
    activity: "Carrot Cake Cooked",
    amount: 7,
  }),
  "Cook 10 Carrot Cakes": farmActivityTask({
    activity: "Carrot Cake Cooked",
    amount: 10,
  }),
  "Cook Cabbage Cake 5 times": farmActivityTask({
    activity: "Cabbage Cake Cooked",
    amount: 5,
  }),
  "Cook 7 Cabbage Cakes": farmActivityTask({
    activity: "Cabbage Cake Cooked",
    amount: 7,
  }),
  "Cook 10 Cabbage Cakes": farmActivityTask({
    activity: "Cabbage Cake Cooked",
    amount: 10,
  }),
  "Cook Wheat Cake 5 times": farmActivityTask({
    activity: "Wheat Cake Cooked",
    amount: 5,
  }),
  "Cook Honey Cake 10 times": farmActivityTask({
    activity: "Honey Cake Cooked",
    amount: 10,
  }),
  "Cook Honey Cake 15 times": farmActivityTask({
    activity: "Honey Cake Cooked",
    amount: 15,
  }),
  "Cook Honey Cake 20 times": farmActivityTask({
    activity: "Honey Cake Cooked",
    amount: 20,
  }),
  "Cook Cornbread 10 times": farmActivityTask({
    activity: "Cornbread Cooked",
    amount: 10,
  }),
  "Cook Cornbread 15 times": farmActivityTask({
    activity: "Cornbread Cooked",
    amount: 15,
  }),
  "Cook Lemon Cheesecakes 3 times": farmActivityTask({
    activity: "Lemon Cheesecake Cooked",
    amount: 3,
  }),
  "Cook Lemon Cheesecakes 5 times": farmActivityTask({
    activity: "Lemon Cheesecake Cooked",
    amount: 5,
  }),
  "Cook Wheat Cakes 7 times": farmActivityTask({
    activity: "Wheat Cake Cooked",
    amount: 7,
  }),
  "Cook Wheat Cakes 10 times": farmActivityTask({
    activity: "Wheat Cake Cooked",
    amount: 10,
  }),
  "Cook Wheat Cakes 5 times": farmActivityTask({
    activity: "Wheat Cake Cooked",
    amount: 5,
  }),
  "Cook Honey Cakes 10 times": farmActivityTask({
    activity: "Honey Cake Cooked",
    amount: 10,
  }),
  "Cook Honey Cakes 15 times": farmActivityTask({
    activity: "Honey Cake Cooked",
    amount: 15,
  }),
  "Cook Honey Cakes 20 times": farmActivityTask({
    activity: "Honey Cake Cooked",
    amount: 20,
  }),
  "Cook Fermented Fish 10 times": farmActivityTask({
    activity: "Fermented Fish Cooked",
    amount: 10,
  }),
  "Cook Fermented Fish 12 times": farmActivityTask({
    activity: "Fermented Fish Cooked",
    amount: 12,
  }),
  "Cook Fermented Fish 15 times": farmActivityTask({
    activity: "Fermented Fish Cooked",
    amount: 15,
  }),
  "Cook Fermented Fish 20 times": farmActivityTask({
    activity: "Fermented Fish Cooked",
    amount: 20,
  }),
  "Cook Fermented Fish 25 times": farmActivityTask({
    activity: "Fermented Fish Cooked",
    amount: 25,
  }),
  "Cook Fermented Fish 30 times": farmActivityTask({
    activity: "Fermented Fish Cooked",
    amount: 30,
  }),
  "Cook Fermented Fish 35 times": farmActivityTask({
    activity: "Fermented Fish Cooked",
    amount: 35,
  }),
  "Cook Chowder 15 times": farmActivityTask({
    activity: "Chowder Cooked",
    amount: 15,
  }),
  "Cook Chowder 18 times": farmActivityTask({
    activity: "Chowder Cooked",
    amount: 18,
  }),
  "Cook Chowder 21 times": farmActivityTask({
    activity: "Chowder Cooked",
    amount: 21,
  }),
  "Cook 20 Chowder times": farmActivityTask({
    activity: "Chowder Cooked",
    amount: 20,
  }),
  "Cook 25 Chowder times": farmActivityTask({
    activity: "Chowder Cooked",
    amount: 25,
  }),
  "Cook 30 Chowder times": farmActivityTask({
    activity: "Chowder Cooked",
    amount: 30,
  }),
  "Cook 35 Chowder times": farmActivityTask({
    activity: "Chowder Cooked",
    amount: 35,
  }),
  "Cook 50 Chowder times": farmActivityTask({
    activity: "Chowder Cooked",
    amount: 50,
  }),
  "Cook Antipasto 25 times": farmActivityTask({
    activity: "Antipasto Cooked",
    amount: 25,
  }),
  "Cook Antipasto 30 times": farmActivityTask({
    activity: "Antipasto Cooked",
    amount: 30,
  }),
  "Cook Antipasto 35 times": farmActivityTask({
    activity: "Antipasto Cooked",
    amount: 35,
  }),
  "Cook Antipasto 40 times": farmActivityTask({
    activity: "Antipasto Cooked",
    amount: 40,
  }),
  "Cook Antipasto 45 times": farmActivityTask({
    activity: "Antipasto Cooked",
    amount: 45,
  }),
  "Cook Antipasto 50 times": farmActivityTask({
    activity: "Antipasto Cooked",
    amount: 50,
  }),
  "Cook Fruit Salad 50 times": farmActivityTask({
    activity: "Fruit Salad Cooked",
    amount: 50,
  }),
  "Cook Fruit Salad 75 times": farmActivityTask({
    activity: "Fruit Salad Cooked",
    amount: 75,
  }),
  "Cook Fruit Salad 100 times": farmActivityTask({
    activity: "Fruit Salad Cooked",
    amount: 100,
  }),
  "Cook Steamed Red Rice 20 times": farmActivityTask({
    activity: "Steamed Red Rice Cooked",
    amount: 20,
  }),
  "Cook Steamed Red Rice 25 times": farmActivityTask({
    activity: "Steamed Red Rice Cooked",
    amount: 25,
  }),
  "Cook Steamed Red Rice 30 times": farmActivityTask({
    activity: "Steamed Red Rice Cooked",
    amount: 30,
  }),
  "Cook Rice Bun 20 times": farmActivityTask({
    activity: "Rice Bun Cooked",
    amount: 20,
  }),
  "Cook Rice Bun 25 times": farmActivityTask({
    activity: "Rice Bun Cooked",
    amount: 25,
  }),
  "Cook Rice Bun 30 times": farmActivityTask({
    activity: "Rice Bun Cooked",
    amount: 30,
  }),
  "Cook Rice Bun 35 times": farmActivityTask({
    activity: "Rice Bun Cooked",
    amount: 35,
  }),
  "Cook Rice Bun 40 times": farmActivityTask({
    activity: "Rice Bun Cooked",
    amount: 40,
  }),
  "Cook Rice Bun 45 times": farmActivityTask({
    activity: "Rice Bun Cooked",
    amount: 45,
  }),
  "Cook Shroom Syrup 2 times": farmActivityTask({
    activity: "Shroom Syrup Cooked",
    amount: 2,
  }),
  "Cook Cheese 50 times": farmActivityTask({
    activity: "Cheese Cooked",
    amount: 50,
  }),
  "Cook Cheese 75 times": farmActivityTask({
    activity: "Cheese Cooked",
    amount: 75,
  }),
  "Cook Cheese 100 times": farmActivityTask({
    activity: "Cheese Cooked",
    amount: 100,
  }),
  "Cook Honey Cheddar 5 times": farmActivityTask({
    activity: "Honey Cheddar Cooked",
    amount: 5,
  }),
  "Cook Honey Cheddar 7 times": farmActivityTask({
    activity: "Honey Cheddar Cooked",
    amount: 7,
  }),
  "Cook Honey Cheddar 10 times": farmActivityTask({
    activity: "Honey Cheddar Cooked",
    amount: 10,
  }),
  "Cook Honey Cheddar 12 times": farmActivityTask({
    activity: "Honey Cheddar Cooked",
    amount: 12,
  }),
  "Cook Honey Cheddar 15 times": farmActivityTask({
    activity: "Honey Cheddar Cooked",
    amount: 15,
  }),
  "Cook Blue Cheese 20 times": farmActivityTask({
    activity: "Blue Cheese Cooked",
    amount: 20,
  }),
  "Cook Blue Cheese 25 times": farmActivityTask({
    activity: "Blue Cheese Cooked",
    amount: 25,
  }),
  "Cook Blue Cheese 30 times": farmActivityTask({
    activity: "Blue Cheese Cooked",
    amount: 30,
  }),
  "Cook Blue Cheese 33 times": farmActivityTask({
    activity: "Blue Cheese Cooked",
    amount: 33,
  }),
  "Cook Blue Cheese 40 times": farmActivityTask({
    activity: "Blue Cheese Cooked",
    amount: 40,
  }),
  "Cook Goblin Brunch 1 time": farmActivityTask({
    activity: "Goblin Brunch Cooked",
    amount: 1,
  }),
  "Cook Goblin Brunch 2 times": farmActivityTask({
    activity: "Goblin Brunch Cooked",
    amount: 2,
  }),
  "Cook Goblin Brunch 3 times": farmActivityTask({
    activity: "Goblin Brunch Cooked",
    amount: 3,
  }),
  "Cook Goblin Brunch 4 times": farmActivityTask({
    activity: "Goblin Brunch Cooked",
    amount: 4,
  }),
  "Cook Goblin Brunch 5 times": farmActivityTask({
    activity: "Goblin Brunch Cooked",
    amount: 5,
  }),
  "Cook Sushi Roll 3 times": farmActivityTask({
    activity: "Sushi Roll Cooked",
    amount: 3,
  }),
  "Cook Sushi Roll 4 times": farmActivityTask({
    activity: "Sushi Roll Cooked",
    amount: 4,
  }),
  "Cook Sushi Roll 5 times": farmActivityTask({
    activity: "Sushi Roll Cooked",
    amount: 5,
  }),
  "Cook Sushi Roll 7 times": farmActivityTask({
    activity: "Sushi Roll Cooked",
    amount: 7,
  }),
  "Cook Sushi Roll 10 times": farmActivityTask({
    activity: "Sushi Roll Cooked",
    amount: 10,
  }),
  "Cook Sushi Roll 12 times": farmActivityTask({
    activity: "Sushi Roll Cooked",
    amount: 12,
  }),
  "Cook Caprese Salad 4 times": farmActivityTask({
    activity: "Caprese Salad Cooked",
    amount: 4,
  }),
  "Cook Caprese Salad 5 times": farmActivityTask({
    activity: "Caprese Salad Cooked",
    amount: 5,
  }),
  "Cook Caprese Salad 6 times": farmActivityTask({
    activity: "Caprese Salad Cooked",
    amount: 6,
  }),
  "Cook Caprese Salad 7 times": farmActivityTask({
    activity: "Caprese Salad Cooked",
    amount: 7,
  }),
  "Cook Caprese Salad 8 times": farmActivityTask({
    activity: "Caprese Salad Cooked",
    amount: 8,
  }),
  "Cook Caprese Salad 10 times": farmActivityTask({
    activity: "Caprese Salad Cooked",
    amount: 10,
  }),
  "Cook Caprese Salad 12 times": farmActivityTask({
    activity: "Caprese Salad Cooked",
    amount: 12,
  }),
  "Cook Caprese Salad 15 times": farmActivityTask({
    activity: "Caprese Salad Cooked",
    amount: 15,
  }),
  "Cook Ocean's Olive 3 times": farmActivityTask({
    activity: "Ocean's Olive Cooked",
    amount: 3,
  }),
  "Cook Ocean's Olive 5 times": farmActivityTask({
    activity: "Ocean's Olive Cooked",
    amount: 5,
  }),
  "Cook Ocean's Olive 7 times": farmActivityTask({
    activity: "Ocean's Olive Cooked",
    amount: 7,
  }),
  "Cook Ocean's Olive 10 times": farmActivityTask({
    activity: "Ocean's Olive Cooked",
    amount: 10,
  }),
  "Cook Ocean's Olive 12 times": farmActivityTask({
    activity: "Ocean's Olive Cooked",
    amount: 12,
  }),
  "Cook Eggplant Cake 5 times": farmActivityTask({
    activity: "Eggplant Cake Cooked",
    amount: 5,
  }),
  "Cook Eggplant Cakes 5 times": farmActivityTask({
    activity: "Eggplant Cake Cooked",
    amount: 5,
  }),
  "Cook Eggplant Cakes 10 times": farmActivityTask({
    activity: "Eggplant Cake Cooked",
    amount: 10,
  }),
  "Cook Radish Cake 5 times": farmActivityTask({
    activity: "Radish Cake Cooked",
    amount: 5,
  }),
  "Cook Radish Cakes 5 times": farmActivityTask({
    activity: "Radish Cake Cooked",
    amount: 5,
  }),
  "Cook Radish Cakes 10 times": farmActivityTask({
    activity: "Radish Cake Cooked",
    amount: 10,
  }),
  "Cook Beetroot Cake 5 times": farmActivityTask({
    activity: "Beetroot Cake Cooked",
    amount: 5,
  }),
  "Cook Beetroot Cakes 5 times": farmActivityTask({
    activity: "Beetroot Cake Cooked",
    amount: 5,
  }),
  "Cook Beetroot Cakes 10 times": farmActivityTask({
    activity: "Beetroot Cake Cooked",
    amount: 10,
  }),
  "Cook Pumpkin Soup 5 times": farmActivityTask({
    activity: "Pumpkin Soup Cooked",
    amount: 5,
  }),
  "Cook Pumpkin Soup 7 times": farmActivityTask({
    activity: "Pumpkin Soup Cooked",
    amount: 7,
  }),
  "Cook Pumpkin Soup 10 times": farmActivityTask({
    activity: "Pumpkin Soup Cooked",
    amount: 10,
  }),
  "Cook Bumpkin Roast 5 times": farmActivityTask({
    activity: "Bumpkin Roast Cooked",
    amount: 5,
  }),
  "Cook Bumpkin Roast 7 times": farmActivityTask({
    activity: "Bumpkin Roast Cooked",
    amount: 7,
  }),
  "Cook Bumpkin Roast 10 times": farmActivityTask({
    activity: "Bumpkin Roast Cooked",
    amount: 10,
  }),
  "Cook Bumpkin Roast 12 times": farmActivityTask({
    activity: "Bumpkin Roast Cooked",
    amount: 12,
  }),
  "Cook Bumpkin Roast 15 times": farmActivityTask({
    activity: "Bumpkin Roast Cooked",
    amount: 15,
  }),
  "Cook Pizza Margherita 5 times": farmActivityTask({
    activity: "Pizza Margherita Cooked",
    amount: 5,
  }),
  "Cook Pizza Margherita 7 times": farmActivityTask({
    activity: "Pizza Margherita Cooked",
    amount: 7,
  }),
  "Cook Pizza Margherita 10 times": farmActivityTask({
    activity: "Pizza Margherita Cooked",
    amount: 10,
  }),
  "Cook Pizza Margherita 12 times": farmActivityTask({
    activity: "Pizza Margherita Cooked",
    amount: 12,
  }),
  "Cook Apple Pie 15 times": farmActivityTask({
    activity: "Apple Pie Cooked",
    amount: 15,
  }),
  "Cook Apple Pie 20 times": farmActivityTask({
    activity: "Apple Pie Cooked",
    amount: 20,
  }),
  "Cook Potato Cake 7 times": farmActivityTask({
    activity: "Potato Cake Cooked",
    amount: 7,
  }),
  "Cook Potato Cakes 7 times": farmActivityTask({
    activity: "Potato Cake Cooked",
    amount: 7,
  }),
  "Cook Potato Cakes 10 times": farmActivityTask({
    activity: "Potato Cake Cooked",
    amount: 10,
  }),
  "Cook Carrot Cake 7 times": farmActivityTask({
    activity: "Carrot Cake Cooked",
    amount: 7,
  }),
  "Cook Carrot Cakes 7 times": farmActivityTask({
    activity: "Carrot Cake Cooked",
    amount: 7,
  }),
  "Cook Carrot Cakes 10 times": farmActivityTask({
    activity: "Carrot Cake Cooked",
    amount: 10,
  }),
  "Cook Wheat Cake 7 times": farmActivityTask({
    activity: "Wheat Cake Cooked",
    amount: 7,
  }),
  "Cook Spaghetti al Limone 4 times": farmActivityTask({
    activity: "Spaghetti al Limone Cooked",
    amount: 4,
  }),
  "Cook Spaghetti al Limone 6 times": farmActivityTask({
    activity: "Spaghetti al Limone Cooked",
    amount: 6,
  }),
  "Cook Spaghetti al Limone 7 times": farmActivityTask({
    activity: "Spaghetti al Limone Cooked",
    amount: 7,
  }),
  "Cook Spaghetti al Limone 8 times": farmActivityTask({
    activity: "Spaghetti al Limone Cooked",
    amount: 8,
  }),
  "Cook Spaghetti al Limone 10 times": farmActivityTask({
    activity: "Spaghetti al Limone Cooked",
    amount: 10,
  }),
  "Cook Spaghetti al Limone 12 times": farmActivityTask({
    activity: "Spaghetti al Limone Cooked",
    amount: 12,
  }),
  "Cook Beetroot Cake 7 times": farmActivityTask({
    activity: "Beetroot Cake Cooked",
    amount: 7,
  }),
  "Cook Beetroot Cakes 7 times": farmActivityTask({
    activity: "Beetroot Cake Cooked",
    amount: 7,
  }),
  "Cook Cabbage Cake 7 times": farmActivityTask({
    activity: "Cabbage Cake Cooked",
    amount: 7,
  }),
  "Cook Cabbage Cakes 7 times": farmActivityTask({
    activity: "Cabbage Cake Cooked",
    amount: 7,
  }),
  "Cook Cabbage Cakes 10 times": farmActivityTask({
    activity: "Cabbage Cake Cooked",
    amount: 10,
  }),
  "Cook Parsnip Cake 7 times": farmActivityTask({
    activity: "Parsnip Cake Cooked",
    amount: 7,
  }),
  "Cook Parsnip Cakes 7 times": farmActivityTask({
    activity: "Parsnip Cake Cooked",
    amount: 7,
  }),
  "Cook Parsnip Cakes 10 times": farmActivityTask({
    activity: "Parsnip Cake Cooked",
    amount: 10,
  }),
  "Cook Cauliflower Cake 7 times": farmActivityTask({
    activity: "Cauliflower Cake Cooked",
    amount: 7,
  }),
  "Cook Cauliflower Cakes 7 times": farmActivityTask({
    activity: "Cauliflower Cake Cooked",
    amount: 7,
  }),
  "Cook Cauliflower Cakes 10 times": farmActivityTask({
    activity: "Cauliflower Cake Cooked",
    amount: 10,
  }),

  // Prepare
  "Prepare Power Smoothie 20 times": farmActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 20,
  }),
  "Prepare Power Smoothie 30 times": farmActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 30,
  }),
  "Prepare Power Smoothie 35 times": farmActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 35,
  }),
  "Prepare Power Smoothie 45 times": farmActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 45,
  }),
  "Prepare Power Smoothie 50 times": farmActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 50,
  }),
  "Prepare Power Smoothie 60 times": farmActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 60,
  }),
  "Prepare Slow Juice 5 times": farmActivityTask({
    activity: "Slow Juice Cooked",
    amount: 5,
  }),
  "Prepare Slow Juice 6 times": farmActivityTask({
    activity: "Slow Juice Cooked",
    amount: 6,
  }),
  "Prepare Slow Juice 7 times": farmActivityTask({
    activity: "Slow Juice Cooked",
    amount: 7,
  }),
  "Prepare Slow Juice 10 times": farmActivityTask({
    activity: "Slow Juice Cooked",
    amount: 10,
  }),
  "Prepare Slow Juice 12 times": farmActivityTask({
    activity: "Slow Juice Cooked",
    amount: 12,
  }),
  "Prepare Slow Juice 15 times": farmActivityTask({
    activity: "Slow Juice Cooked",
    amount: 15,
  }),
  "Prepare Banana Blast 15 times": farmActivityTask({
    activity: "Banana Blast Cooked",
    amount: 15,
  }),
  "Prepare Banana Blast 17 times": farmActivityTask({
    activity: "Banana Blast Cooked",
    amount: 17,
  }),
  "Prepare Banana Blast 20 times": farmActivityTask({
    activity: "Banana Blast Cooked",
    amount: 20,
  }),
  "Prepare Banana Blast 35 times": farmActivityTask({
    activity: "Banana Blast Cooked",
    amount: 35,
  }),
  "Prepare Banana Blast 50 times": farmActivityTask({
    activity: "Banana Blast Cooked",
    amount: 50,
  }),
  "Prepare Grape Juice 5 times": farmActivityTask({
    activity: "Grape Juice Cooked",
    amount: 5,
  }),
  "Prepare Grape Juice 10 times": farmActivityTask({
    activity: "Grape Juice Cooked",
    amount: 10,
  }),
  "Prepare Grape Juice 12 times": farmActivityTask({
    activity: "Grape Juice Cooked",
    amount: 12,
  }),
  "Prepare Grape Juice 15 times": farmActivityTask({
    activity: "Grape Juice Cooked",
    amount: 15,
  }),
  "Prepare Apple Juice 5 times": farmActivityTask({
    activity: "Apple Juice Cooked",
    amount: 5,
  }),
  "Prepare Apple Juice 6 times": farmActivityTask({
    activity: "Apple Juice Cooked",
    amount: 6,
  }),
  "Prepare Apple Juice 7 times": farmActivityTask({
    activity: "Apple Juice Cooked",
    amount: 7,
  }),
  "Cook Apple Juice 10 times": farmActivityTask({
    activity: "Apple Juice Cooked",
    amount: 10,
  }),
  "Cook Apple Juice 12 times": farmActivityTask({
    activity: "Apple Juice Cooked",
    amount: 12,
  }),
  "Cook Apple Juice 15 times": farmActivityTask({
    activity: "Apple Juice Cooked",
    amount: 15,
  }),
  "Prepare Apple Juice 10 times": farmActivityTask({
    activity: "Apple Juice Cooked",
    amount: 10,
  }),
  "Prepare Apple Juice 12 times": farmActivityTask({
    activity: "Apple Juice Cooked",
    amount: 12,
  }),
  "Prepare Apple Juice 15 times": farmActivityTask({
    activity: "Apple Juice Cooked",
    amount: 15,
  }),
  "Prepare Apple Juice 17 times": farmActivityTask({
    activity: "Apple Juice Cooked",
    amount: 17,
  }),
  "Prepare Apple Juice 20 times": farmActivityTask({
    activity: "Apple Juice Cooked",
    amount: 20,
  }),
  "Prepare Apple Juice 25 times": farmActivityTask({
    activity: "Apple Juice Cooked",
    amount: 25,
  }),
  "Prepare Orange Juice 15 times": farmActivityTask({
    activity: "Orange Juice Cooked",
    amount: 15,
  }),
  "Prepare Orange Juice 20 times": farmActivityTask({
    activity: "Orange Juice Cooked",
    amount: 20,
  }),
  "Prepare Carrot Juice 2 times": farmActivityTask({
    activity: "Carrot Juice Cooked",
    amount: 2,
  }),
  "Prepare Carrot Juice 3 times": farmActivityTask({
    activity: "Carrot Juice Cooked",
    amount: 3,
  }),
  "Prepare Carrot Juice 4 times": farmActivityTask({
    activity: "Carrot Juice Cooked",
    amount: 4,
  }),
  "Cook Carrot Juice 15 times": farmActivityTask({
    activity: "Carrot Juice Cooked",
    amount: 15,
  }),
  "Cook Carrot Juice 20 times": farmActivityTask({
    activity: "Carrot Juice Cooked",
    amount: 20,
  }),
  "Cook Carrot Juice 25 times": farmActivityTask({
    activity: "Carrot Juice Cooked",
    amount: 25,
  }),
  "Prepare Purple Smoothie 5 times": farmActivityTask({
    activity: "Purple Smoothie Cooked",
    amount: 5,
  }),
  "Prepare Purple Smoothie 6 times": farmActivityTask({
    activity: "Purple Smoothie Cooked",
    amount: 6,
  }),
  "Prepare Purple Smoothie 7 times": farmActivityTask({
    activity: "Purple Smoothie Cooked",
    amount: 7,
  }),
  "Prepare Purple Smoothie 10 times": farmActivityTask({
    activity: "Purple Smoothie Cooked",
    amount: 10,
  }),
  "Prepare Purple Smoothie 12 times": farmActivityTask({
    activity: "Purple Smoothie Cooked",
    amount: 12,
  }),
  "Prepare Purple Smoothie 15 times": farmActivityTask({
    activity: "Purple Smoothie Cooked",
    amount: 15,
  }),
  "Prepare Sour Shake 15 times": farmActivityTask({
    activity: "Sour Shake Cooked",
    amount: 15,
  }),
  "Prepare Sour Shake 20 times": farmActivityTask({
    activity: "Sour Shake Cooked",
    amount: 20,
  }),
  "Prepare Sour Shake 25 times": farmActivityTask({
    activity: "Sour Shake Cooked",
    amount: 25,
  }),
  "Prepare Power Smoothie 2 times": farmActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 2,
  }),
  "Prepare Power Smoothie 3 times": farmActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 3,
  }),
  "Prepare Power Smoothie 4 times": farmActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 4,
  }),
  "Prepare Power Smoothie 5 times": farmActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 5,
  }),
  "Prepare Power Smoothie 6 times": farmActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 6,
  }),
  "Prepare Power Smoothie 7 times": farmActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 7,
  }),
  "Prepare Power Smoothie 15 times": farmActivityTask({
    activity: "Power Smoothie Cooked",
    amount: 15,
  }),
  // Grow
  "Grow Yellow Gladiolus 3 times": farmActivityTask({
    activity: "Yellow Gladiolus Harvested",
    amount: 3,
  }),
  "Grow Yellow Gladiolus 4 times": farmActivityTask({
    activity: "Yellow Gladiolus Harvested",
    amount: 4,
  }),
  "Grow Purple Gladiolus 3 times": farmActivityTask({
    activity: "Purple Gladiolus Harvested",
    amount: 3,
  }),
  "Grow Purple Gladiolus 4 times": farmActivityTask({
    activity: "Purple Gladiolus Harvested",
    amount: 4,
  }),
  "Grow Purple Edelweiss 3 times": farmActivityTask({
    activity: "Purple Edelweiss Harvested",
    amount: 3,
  }),
  "Grow Purple Edelweiss 4 times": farmActivityTask({
    activity: "Purple Edelweiss Harvested",
    amount: 4,
  }),
  "Grow Yellow Edelweiss 3 times": farmActivityTask({
    activity: "Yellow Edelweiss Harvested",
    amount: 3,
  }),
  "Grow Yellow Edelweiss 4 times": farmActivityTask({
    activity: "Yellow Edelweiss Harvested",
    amount: 4,
  }),
  "Grow Blue Clover 3 times": farmActivityTask({
    activity: "Blue Clover Harvested",
    amount: 3,
  }),
  "Grow Blue Clover 4 times": farmActivityTask({
    activity: "Blue Clover Harvested",
    amount: 4,
  }),
  "Grow Yellow Clover 3 times": farmActivityTask({
    activity: "Yellow Clover Harvested",
    amount: 3,
  }),
  "Grow Yellow Clover 4 times": farmActivityTask({
    activity: "Yellow Clover Harvested",
    amount: 4,
  }),
  "Grow Red Pansy 2 times": farmActivityTask({
    activity: "Red Pansy Harvested",
    amount: 2,
  }),
  "Grow Red Pansy 3 times": farmActivityTask({
    activity: "Red Pansy Harvested",
    amount: 3,
  }),
  "Grow Yellow Pansy 2 times": farmActivityTask({
    activity: "Yellow Pansy Harvested",
    amount: 2,
  }),
  "Grow Yellow Pansy 3 times": farmActivityTask({
    activity: "Yellow Pansy Harvested",
    amount: 3,
  }),
  "Grow Red Lavender 3 times": farmActivityTask({
    activity: "Red Lavender Harvested",
    amount: 3,
  }),
  "Grow Red Lavender 4 times": farmActivityTask({
    activity: "Red Lavender Harvested",
    amount: 4,
  }),
  "Grow White Lavender 3 times": farmActivityTask({
    activity: "White Lavender Harvested",
    amount: 3,
  }),
  "Grow White Lavender 4 times": farmActivityTask({
    activity: "White Lavender Harvested",
    amount: 4,
  }),
  "Grow Purple Cosmos 2 times": farmActivityTask({
    activity: "Purple Cosmos Harvested",
    amount: 2,
  }),
  "Grow Purple Cosmos 3 times": farmActivityTask({
    activity: "Purple Cosmos Harvested",
    amount: 3,
  }),
  "Grow Purple Cosmos 5 times": farmActivityTask({
    activity: "Purple Cosmos Harvested",
    amount: 5,
  }),
  "Grow Purple Cosmos 6 times": farmActivityTask({
    activity: "Purple Cosmos Harvested",
    amount: 6,
  }),
  "Grow Blue Cosmos 2 times": farmActivityTask({
    activity: "Blue Cosmos Harvested",
    amount: 2,
  }),
  "Grow Blue Cosmos 3 times": farmActivityTask({
    activity: "Blue Cosmos Harvested",
    amount: 3,
  }),
  "Grow Blue Cosmos 5 times": farmActivityTask({
    activity: "Blue Cosmos Harvested",
    amount: 5,
  }),
  "Grow Blue Cosmos 6 times": farmActivityTask({
    activity: "Blue Cosmos Harvested",
    amount: 6,
  }),
  "Grow Red Balloon Flower 3 times": farmActivityTask({
    activity: "Red Balloon Flower Harvested",
    amount: 3,
  }),
  "Grow Red Balloon Flower 4 times": farmActivityTask({
    activity: "Red Balloon Flower Harvested",
    amount: 4,
  }),
  "Grow Red Balloon Flower 5 times": farmActivityTask({
    activity: "Red Balloon Flower Harvested",
    amount: 5,
  }),
  "Grow Blue Balloon Flower 3 times": farmActivityTask({
    activity: "Blue Balloon Flower Harvested",
    amount: 3,
  }),
  "Grow Blue Balloon Flower 4 times": farmActivityTask({
    activity: "Blue Balloon Flower Harvested",
    amount: 4,
  }),
  "Grow Blue Balloon Flower 5 times": farmActivityTask({
    activity: "Blue Balloon Flower Harvested",
    amount: 5,
  }),
  "Grow Purple Daffodil 3 times": farmActivityTask({
    activity: "Purple Daffodil Harvested",
    amount: 3,
  }),
  "Grow Purple Daffodil 4 times": farmActivityTask({
    activity: "Purple Daffodil Harvested",
    amount: 4,
  }),
  "Grow Purple Daffodil 5 times": farmActivityTask({
    activity: "Purple Daffodil Harvested",
    amount: 5,
  }),
  "Grow Red Daffodil 2 times": farmActivityTask({
    activity: "Red Daffodil Harvested",
    amount: 2,
  }),
  "Grow Red Daffodil 3 times": farmActivityTask({
    activity: "Red Daffodil Harvested",
    amount: 3,
  }),
  "Grow Yellow Carnation 3 times": farmActivityTask({
    activity: "Yellow Carnation Harvested",
    amount: 3,
  }),
  "Grow Yellow Carnation 4 times": farmActivityTask({
    activity: "Yellow Carnation Harvested",
    amount: 4,
  }),
  "Grow Blue Carnation 3 times": farmActivityTask({
    activity: "Blue Carnation Harvested",
    amount: 3,
  }),
  "Grow Blue Carnation 4 times": farmActivityTask({
    activity: "Blue Carnation Harvested",
    amount: 4,
  }),
  "Grow White Carnation 3 times": farmActivityTask({
    activity: "White Carnation Harvested",
    amount: 3,
  }),
  "Grow White Carnation 4 times": farmActivityTask({
    activity: "White Carnation Harvested",
    amount: 4,
  }),
  "Grow Red Lotus 3 times": farmActivityTask({
    activity: "Red Lotus Harvested",
    amount: 3,
  }),
  "Grow Red Lotus 4 times": farmActivityTask({
    activity: "Red Lotus Harvested",
    amount: 4,
  }),
  "Grow Yellow Lotus 3 times": farmActivityTask({
    activity: "Yellow Lotus Harvested",
    amount: 3,
  }),
  "Grow Yellow Lotus 4 times": farmActivityTask({
    activity: "Yellow Lotus Harvested",
    amount: 4,
  }),
  "Grow White Lotus 3 times": farmActivityTask({
    activity: "White Lotus Harvested",
    amount: 3,
  }),
  "Grow White Lotus 4 times": farmActivityTask({
    activity: "White Lotus Harvested",
    amount: 4,
  }),
  "Grow Blue Pansy 6 times": farmActivityTask({
    activity: "Blue Pansy Harvested",
    amount: 6,
  }),
  "Grow White Pansy 6 times": farmActivityTask({
    activity: "White Pansy Harvested",
    amount: 6,
  }),
  "Grow White Cosmos 3 times": farmActivityTask({
    activity: "White Cosmos Harvested",
    amount: 3,
  }),
  "Grow White Cosmos 4 times": farmActivityTask({
    activity: "White Cosmos Harvested",
    amount: 4,
  }),
  "Grow Purple Daffodil 6 times": farmActivityTask({
    activity: "Purple Daffodil Harvested",
    amount: 6,
  }),
  "Grow Red Balloon Flower 6 times": farmActivityTask({
    activity: "Red Balloon Flower Harvested",
    amount: 6,
  }),

  // Fish
  "Fish 20 times": farmActivityTask({
    activity: "Rod Casted",
    amount: 20,
  }),
  "Fish 40 times": farmActivityTask({
    activity: "Rod Casted",
    amount: 40,
  }),
  "Fish 60 times": farmActivityTask({
    activity: "Rod Casted",
    amount: 60,
  }),
  "Fish 200 times": farmActivityTask({
    activity: "Rod Casted",
    amount: 200,
  }),
  "Fish 250 times": farmActivityTask({
    activity: "Rod Casted",
    amount: 250,
  }),
  "Fish 275 times": farmActivityTask({
    activity: "Rod Casted",
    amount: 275,
  }),
  "Fish 300 times": farmActivityTask({
    activity: "Rod Casted",
    amount: 300,
  }),

  // Craft
  "Craft 10 Axes": farmActivityTask({
    activity: "Axe Crafted",
    amount: 10,
  }),
  "Craft 12 Axes": farmActivityTask({
    activity: "Axe Crafted",
    amount: 12,
  }),
  "Craft 15 Axes": farmActivityTask({
    activity: "Axe Crafted",
    amount: 15,
  }),
  "Craft Axes 20 times": farmActivityTask({
    activity: "Axe Crafted",
    amount: 20,
  }),
  "Craft Axes 25 times": farmActivityTask({
    activity: "Axe Crafted",
    amount: 25,
  }),
  "Craft Axes 30 times": farmActivityTask({
    activity: "Axe Crafted",
    amount: 30,
  }),
  "Craft 6 Pickaxes": farmActivityTask({
    activity: "Pickaxe Crafted",
    amount: 6,
  }),
  "Craft 8 Pickaxes": farmActivityTask({
    activity: "Pickaxe Crafted",
    amount: 8,
  }),
  "Craft 10 Pickaxes": farmActivityTask({
    activity: "Pickaxe Crafted",
    amount: 10,
  }),
  "Craft Pickaxes 10 times": farmActivityTask({
    activity: "Pickaxe Crafted",
    amount: 10,
  }),
  "Craft Pickaxes 15 times": farmActivityTask({
    activity: "Pickaxe Crafted",
    amount: 15,
  }),
  "Craft Pickaxes 20 times": farmActivityTask({
    activity: "Pickaxe Crafted",
    amount: 20,
  }),
  "Craft 100 Rods": farmActivityTask({
    activity: "Rod Crafted",
    amount: 100,
  }),
  "Craft 150 Rods": farmActivityTask({
    activity: "Rod Crafted",
    amount: 150,
  }),
  "Craft 200 Rods": farmActivityTask({
    activity: "Rod Crafted",
    amount: 200,
  }),
  "Craft 100 Fishing Rods": farmActivityTask({
    activity: "Rod Crafted",
    amount: 100,
  }),
  "Craft 150 Fishing Rods": farmActivityTask({
    activity: "Rod Crafted",
    amount: 150,
  }),
  "Craft 200 Fishing Rods": farmActivityTask({
    activity: "Rod Crafted",
    amount: 200,
  }),
  "Craft 25 Gold Pickaxes": farmActivityTask({
    activity: "Gold Pickaxe Crafted",
    amount: 25,
  }),
  "Craft 30 Gold Pickaxes": farmActivityTask({
    activity: "Gold Pickaxe Crafted",
    amount: 30,
  }),
  "Craft 35 Gold Pickaxes": farmActivityTask({
    activity: "Gold Pickaxe Crafted",
    amount: 35,
  }),
  "Craft 40 Gold Pickaxes": farmActivityTask({
    activity: "Gold Pickaxe Crafted",
    amount: 40,
  }),
  "Craft 5 Sand Drill": farmActivityTask({
    activity: "Sand Drill Crafted",
    amount: 5,
  }),
  "Craft 10 Sand Drill": farmActivityTask({
    activity: "Sand Drill Crafted",
    amount: 10,
  }),
  "Craft 15 Sand Drill": farmActivityTask({
    activity: "Sand Drill Crafted",
    amount: 15,
  }),
  "Craft 20 Sand Drill": farmActivityTask({
    activity: "Sand Drill Crafted",
    amount: 20,
  }),
  "Craft 25 Sand Drill": farmActivityTask({
    activity: "Sand Drill Crafted",
    amount: 25,
  }),
  "Craft 30 Sand Drill": farmActivityTask({
    activity: "Sand Drill Crafted",
    amount: 30,
  }),
  "Craft 35 Sand Drill": farmActivityTask({
    activity: "Sand Drill Crafted",
    amount: 35,
  }),

  // Chop
  "Chop Trees 10 times": farmActivityTask({
    activity: "Tree Chopped",
    amount: 10,
  }),
  "Chop Trees 15 times": farmActivityTask({
    activity: "Tree Chopped",
    amount: 15,
  }),
  "Chop Trees 20 times": farmActivityTask({
    activity: "Tree Chopped",
    amount: 20,
  }),
  "Chop Trees 25 times": farmActivityTask({
    activity: "Tree Chopped",
    amount: 25,
  }),
  "Chop Trees 30 times": farmActivityTask({
    activity: "Tree Chopped",
    amount: 30,
  }),
  "Chop Trees 100 times": farmActivityTask({
    activity: "Tree Chopped",
    amount: 100,
  }),
  "Chop Trees 120 times": farmActivityTask({
    activity: "Tree Chopped",
    amount: 120,
  }),
  "Chop Trees 150 times": farmActivityTask({
    activity: "Tree Chopped",
    amount: 150,
  }),
  "Chop Trees 200 times": farmActivityTask({
    activity: "Tree Chopped",
    amount: 200,
  }),
  "Chop Trees 250 times": farmActivityTask({
    activity: "Tree Chopped",
    amount: 250,
  }),
  "Chop Trees 450 times": farmActivityTask({
    activity: "Tree Chopped",
    amount: 450,
  }),
  "Chop Trees 500 times": farmActivityTask({
    activity: "Tree Chopped",
    amount: 500,
  }),
  "Chop Trees 550 times": farmActivityTask({
    activity: "Tree Chopped",
    amount: 550,
  }),
  "Chop Trees 600 times": farmActivityTask({
    activity: "Tree Chopped",
    amount: 600,
  }),

  // Mine
  "Mine Stones 5 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 5,
  }),
  "Mine Stones 7 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 7,
  }),
  "Mine Stones 8 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 8,
  }),
  "Mine Stones 10 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 10,
  }),
  "Mine Stones 12 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 12,
  }),
  "Mine Stones 20 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 20,
  }),
  "Mine Stones 50 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 50,
  }),
  "Mine Stones 60 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 60,
  }),
  "Mine Stones 100 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 100,
  }),
  "Mine Stones 135 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 135,
  }),
  "Mine Stones 175 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 175,
  }),
  "Mine Gold 30 times": farmActivityTask({
    activity: "Gold Mined",
    amount: 30,
  }),
  "Mine Gold 38 times": farmActivityTask({
    activity: "Gold Mined",
    amount: 38,
  }),
  "Mine Gold 45 times": farmActivityTask({
    activity: "Gold Mined",
    amount: 45,
  }),
  "Mine Gold 50 times": farmActivityTask({
    activity: "Gold Mined",
    amount: 50,
  }),
  "Mine Gold 55 times": farmActivityTask({
    activity: "Gold Mined",
    amount: 55,
  }),
  "Mine Gold 60 times": farmActivityTask({
    activity: "Gold Mined",
    amount: 60,
  }),
  "Mine Crimstone 20 times": farmActivityTask({
    activity: "Crimstone Mined",
    amount: 20,
  }),
  "Mine Crimstone 22 times": farmActivityTask({
    activity: "Crimstone Mined",
    amount: 22,
  }),
  "Mine Crimstone 24 times": farmActivityTask({
    activity: "Crimstone Mined",
    amount: 24,
  }),
  "Mine Crimstone 28 times": farmActivityTask({
    activity: "Crimstone Mined",
    amount: 28,
  }),
  "Mine Crimstone 32 times": farmActivityTask({
    activity: "Crimstone Mined",
    amount: 32,
  }),
  "Mine Crimstone 36 times": farmActivityTask({
    activity: "Crimstone Mined",
    amount: 36,
  }),
  "Mine Iron 150 times": farmActivityTask({
    activity: "Iron Mined",
    amount: 150,
  }),
  "Mine Iron 175 times": farmActivityTask({
    activity: "Iron Mined",
    amount: 175,
  }),
  "Mine Iron 200 times": farmActivityTask({
    activity: "Iron Mined",
    amount: 200,
  }),
  "Mine Iron 225 times": farmActivityTask({
    activity: "Iron Mined",
    amount: 225,
  }),
  "Mine Iron 250 times": farmActivityTask({
    activity: "Iron Mined",
    amount: 250,
  }),
  "Mine Iron 300 times": farmActivityTask({
    activity: "Iron Mined",
    amount: 300,
  }),
  "Mine Stones 200 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 200,
  }),
  "Mine Stones 250 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 250,
  }),
  "Mine Stones 275 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 275,
  }),
  "Mine Stones 300 times": farmActivityTask({
    activity: "Stone Mined",
    amount: 300,
  }),

  // Drill
  "Drill Oil Reserves 15 times": farmActivityTask({
    activity: "Oil Drilled",
    amount: 15,
  }),
  "Drill Oil Reserves 18 times": farmActivityTask({
    activity: "Oil Drilled",
    amount: 18,
  }),
  "Drill Oil Reserves 21 times": farmActivityTask({
    activity: "Oil Drilled",
    amount: 21,
  }),

  // Pick
  "Pick Blueberries 120 times": farmActivityTask({
    activity: "Blueberry Harvested",
    amount: 120,
  }),
  "Pick Blueberries 150 times": farmActivityTask({
    activity: "Blueberry Harvested",
    amount: 150,
  }),
  "Pick Blueberries 180 times": farmActivityTask({
    activity: "Blueberry Harvested",
    amount: 180,
  }),
  "Pick Blueberries 200 times": farmActivityTask({
    activity: "Blueberry Harvested",
    amount: 200,
  }),
  "Pick Blueberries 250 times": farmActivityTask({
    activity: "Blueberry Harvested",
    amount: 250,
  }),
  "Pick Oranges 100 times": farmActivityTask({
    activity: "Orange Harvested",
    amount: 100,
  }),
  "Pick Oranges 125 times": farmActivityTask({
    activity: "Orange Harvested",
    amount: 125,
  }),
  "Pick Oranges 150 times": farmActivityTask({
    activity: "Orange Harvested",
    amount: 150,
  }),
  "Pick Oranges 160 times": farmActivityTask({
    activity: "Orange Harvested",
    amount: 160,
  }),
  "Pick Oranges 175 times": farmActivityTask({
    activity: "Orange Harvested",
    amount: 175,
  }),
  "Pick Oranges 205 times": farmActivityTask({
    activity: "Orange Harvested",
    amount: 205,
  }),
  "Pick Oranges 250 times": farmActivityTask({
    activity: "Orange Harvested",
    amount: 250,
  }),
  "Pick Apples 60 times": farmActivityTask({
    activity: "Apple Harvested",
    amount: 60,
  }),
  "Pick Apples 75 times": farmActivityTask({
    activity: "Apple Harvested",
    amount: 75,
  }),
  "Pick Apples 90 times": farmActivityTask({
    activity: "Apple Harvested",
    amount: 90,
  }),
  "Pick Apples 125 times": farmActivityTask({
    activity: "Apple Harvested",
    amount: 125,
  }),
  "Pick Apples 150 times": farmActivityTask({
    activity: "Apple Harvested",
    amount: 150,
  }),
  "Pick Apples 175 times": farmActivityTask({
    activity: "Apple Harvested",
    amount: 175,
  }),
  "Pick Tomatoes 150 times": farmActivityTask({
    activity: "Tomato Harvested",
    amount: 150,
  }),
  "Pick Tomatoes 200 times": farmActivityTask({
    activity: "Tomato Harvested",
    amount: 200,
  }),
  "Pick Tomatoes 250 times": farmActivityTask({
    activity: "Tomato Harvested",
    amount: 250,
  }),
  "Pick Tomatoes 300 times": farmActivityTask({
    activity: "Tomato Harvested",
    amount: 300,
  }),
  "Pick Tomatoes 350 times": farmActivityTask({
    activity: "Tomato Harvested",
    amount: 350,
  }),
  "Pick Grapes 36 times": farmActivityTask({
    activity: "Grape Harvested",
    amount: 36,
  }),
  "Pick Grapes 44 times": farmActivityTask({
    activity: "Grape Harvested",
    amount: 44,
  }),
  "Pick Grapes 48 times": farmActivityTask({
    activity: "Grape Harvested",
    amount: 48,
  }),
  "Pick Grapes 52 times": farmActivityTask({
    activity: "Grape Harvested",
    amount: 52,
  }),
  "Pick Grapes 60 times": farmActivityTask({
    activity: "Grape Harvested",
    amount: 60,
  }),
  "Pick Grapes 72 times": farmActivityTask({
    activity: "Grape Harvested",
    amount: 72,
  }),
  "Pick Bananas 80 times": farmActivityTask({
    activity: "Banana Harvested",
    amount: 80,
  }),
  "Pick Bananas 90 times": farmActivityTask({
    activity: "Banana Harvested",
    amount: 90,
  }),
  "Pick Bananas 100 times": farmActivityTask({
    activity: "Banana Harvested",
    amount: 100,
  }),
  "Pick Bananas 120 times": farmActivityTask({
    activity: "Banana Harvested",
    amount: 120,
  }),
  "Pick Bananas 125 times": farmActivityTask({
    activity: "Banana Harvested",
    amount: 125,
  }),
  "Pick Bananas 150 times": farmActivityTask({
    activity: "Banana Harvested",
    amount: 150,
  }),
  "Pick Bananas 175 times": farmActivityTask({
    activity: "Banana Harvested",
    amount: 175,
  }),
  "Pick Bananas 200 times": farmActivityTask({
    activity: "Banana Harvested",
    amount: 200,
  }),
  "Pick Lemons 150 times": farmActivityTask({
    activity: "Lemon Harvested",
    amount: 150,
  }),
  "Pick Lemons 200 times": farmActivityTask({
    activity: "Lemon Harvested",
    amount: 200,
  }),
  "Pick Lemons 250 times": farmActivityTask({
    activity: "Lemon Harvested",
    amount: 250,
  }),
  "Pick Lemons 300 times": farmActivityTask({
    activity: "Lemon Harvested",
    amount: 300,
  }),
  "Pick Lemons 350 times": farmActivityTask({
    activity: "Lemon Harvested",
    amount: 350,
  }),

  // Collect
  "Collect 15 Honey": farmActivityTask({
    activity: "Honey Harvested",
    amount: 15,
  }),
  "Collect 18 Honey": farmActivityTask({
    activity: "Honey Harvested",
    amount: 18,
  }),
  "Collect 21 Honey": farmActivityTask({
    activity: "Honey Harvested",
    amount: 21,
  }),
  "Collect 20 Honey": farmActivityTask({
    activity: "Honey Harvested",
    amount: 20,
  }),
  "Collect 25 Honey": farmActivityTask({
    activity: "Honey Harvested",
    amount: 25,
  }),
  "Collect 30 Honey": farmActivityTask({
    activity: "Honey Harvested",
    amount: 30,
  }),
  "Collect Eggs 60 times": farmActivityTask({
    activity: "Egg Collected",
    amount: 60,
  }),
  "Collect Eggs 75 times": farmActivityTask({
    activity: "Egg Collected",
    amount: 75,
  }),
  "Collect Eggs 80 times": farmActivityTask({
    activity: "Egg Collected",
    amount: 80,
  }),
  "Collect Eggs 100 times": farmActivityTask({
    activity: "Egg Collected",
    amount: 100,
  }),
  "Collect Eggs 125 times": farmActivityTask({
    activity: "Egg Collected",
    amount: 125,
  }),
  "Collect Eggs 150 times": farmActivityTask({
    activity: "Egg Collected",
    amount: 150,
  }),
  "Collect Eggs 175 times": farmActivityTask({
    activity: "Egg Collected",
    amount: 175,
  }),
  "Collect Eggs 200 times": farmActivityTask({
    activity: "Egg Collected",
    amount: 200,
  }),
  "Collect Eggs 225 times": farmActivityTask({
    activity: "Egg Collected",
    amount: 225,
  }),
  "Collect Wool 30 times": farmActivityTask({
    activity: "Wool Collected",
    amount: 30,
  }),
  "Collect Wool 40 times": farmActivityTask({
    activity: "Wool Collected",
    amount: 40,
  }),
  "Collect Wool 50 times": farmActivityTask({
    activity: "Wool Collected",
    amount: 50,
  }),
  "Collect Wool 60 times": farmActivityTask({
    activity: "Wool Collected",
    amount: 60,
  }),
  "Collect Wool 70 times": farmActivityTask({
    activity: "Wool Collected",
    amount: 70,
  }),
  "Collect Wool 75 times": farmActivityTask({
    activity: "Wool Collected",
    amount: 75,
  }),
  "Collect Wool 80 times": farmActivityTask({
    activity: "Wool Collected",
    amount: 80,
  }),
  "Collect Wool 100 times": farmActivityTask({
    activity: "Wool Collected",
    amount: 100,
  }),
  "Collect Wool 125 times": farmActivityTask({
    activity: "Wool Collected",
    amount: 125,
  }),
  "Collect Milk 30 times": farmActivityTask({
    activity: "Milk Collected",
    amount: 30,
  }),
  "Collect Milk 40 times": farmActivityTask({
    activity: "Milk Collected",
    amount: 40,
  }),
  "Collect Milk 50 times": farmActivityTask({
    activity: "Milk Collected",
    amount: 50,
  }),
  "Collect Milk 60 times": farmActivityTask({
    activity: "Milk Collected",
    amount: 60,
  }),
  "Collect Milk 75 times": farmActivityTask({
    activity: "Milk Collected",
    amount: 75,
  }),
  "Collect Milk 100 times": farmActivityTask({
    activity: "Milk Collected",
    amount: 100,
  }),
  "Collect Milk 125 times": farmActivityTask({
    activity: "Milk Collected",
    amount: 125,
  }),

  // Dig
  "Dig 50 times": farmActivityTask({
    activity: "Treasure Dug",
    amount: 50,
  }),
  "Dig 75 times": farmActivityTask({
    activity: "Treasure Dug",
    amount: 75,
  }),
  "Dig 100 times": farmActivityTask({
    activity: "Treasure Dug",
    amount: 100,
  }),
  "Dig 125 times": farmActivityTask({
    activity: "Treasure Dug",
    amount: 125,
  }),
  "Dig 150 times": farmActivityTask({
    activity: "Treasure Dug",
    amount: 150,
  }),
  "Dig 175 times": farmActivityTask({
    activity: "Treasure Dug",
    amount: 175,
  }),
  "Dig 200 times": farmActivityTask({
    activity: "Treasure Dug",
    amount: 200,
  }),
  "Dig 225 times": farmActivityTask({
    activity: "Treasure Dug",
    amount: 225,
  }),

  // Spend
  "Spend 32,000 Coins": farmActivityTask({
    activity: "Coins Spent",
    amount: 32000,
  }),
  "Spend 48,000 Coins": farmActivityTask({
    activity: "Coins Spent",
    amount: 48000,
  }),
  "Spend 64,000 Coins": farmActivityTask({
    activity: "Coins Spent",
    amount: 64000,
  }),
  "Spend 60,606 Coins": farmActivityTask({
    activity: "Coins Spent",
    amount: 60606,
  }),
  "Spend 70,707 Coins": farmActivityTask({
    activity: "Coins Spent",
    amount: 70707,
  }),
  "Spend 80,808 Coins": farmActivityTask({
    activity: "Coins Spent",
    amount: 80808,
  }),

  // To Remove
  "Cook 5 Cauliflower Burger": farmActivityTask({
    activity: "Cauliflower Burger Cooked",
    amount: 5,
  }),
  "Harvest Potato 100 times": farmActivityTask({
    activity: "Potato Harvested",
    amount: 100,
  }),
  "Eat 15 Pumpkin Soup": farmActivityTask({
    activity: "Pumpkin Soup Fed",
    amount: 15,
  }),
  "Grow 3 Blue Cosmos": farmActivityTask({
    activity: "Blue Cosmos Harvested",
    amount: 3,
  }),
  "Chop 80 Trees": farmActivityTask({
    activity: "Tree Chopped",
    amount: 80,
  }),
  "Pick 60 Blueberries": farmActivityTask({
    activity: "Blueberry Harvested",
    amount: 60,
  }),
  "Cook 10 Sushi Roll": farmActivityTask({
    activity: "Sushi Roll Cooked",
    amount: 10,
  }),
  "Eat 7 Chowder": farmActivityTask({
    activity: "Chowder Fed",
    amount: 7,
  }),
  "Harvest Olives 8 times": farmActivityTask({
    activity: "Olive Harvested",
    amount: 8,
  }),
  "Mine 10 Crimstone": farmActivityTask({
    activity: "Crimstone Mined",
    amount: 10,
  }),
  "Prepare 15 Bumpkin Detox": farmActivityTask({
    activity: "Bumpkin Detox Cooked",
    amount: 15,
  }),
  "Grow White Pansy 3 times": farmActivityTask({
    activity: "White Pansy Harvested",
    amount: 3,
  }),
  "Cook 5 Fermented Fish": farmActivityTask({
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
