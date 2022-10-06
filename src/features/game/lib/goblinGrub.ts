import { ConsumableName } from "../types/consumables";
import { GameState, GoblinGrub, GoblinGrubOrder } from "../types/game";

export const EASY_ORDERS: ConsumableName[] = [
  "Mashed Potato",
  "Bumpkin Broth",
  "Boiled Egg",
  "Pumpkin Soup",
];
export const MEDIUM_ORDERS: ConsumableName[] = [
  "Roasted Cauliflower",
  "Bumpkin Salad",
  "Goblin's Treat",
];

export const HARD_ORDERS: ConsumableName[] = [
  "Sunflower Cake",
  "Potato Cake",
  "Pumpkin Cake",
  "Carrot Cake",
  "Cabbage Cake",
  "Beetroot Cake",
  "Cauliflower Cake",
  "Parsnip Cake",
  "Radish Cake",
  "Wheat Cake",
];

export function generateOrders(): GoblinGrubOrder[] {
  return [];
}
export function getGoblinGrub(gameState: GameState): GoblinGrub {
  // If already
  return {
    closesAt: 0,
    opensAt: 0,
    orders: [],
  };
}
