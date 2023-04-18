import { Equipped } from "features/game/types/bumpkin";

export type NPCName = "betty" | "bruce" | "hank" | "blacksmith" | "grimbly";

export const NPC_WEARABLES: Record<NPCName, Equipped> = {
  betty: {
    body: "Beige Farmer Potion",
    hair: "Rancher Hair",
    pants: "Farmer Overalls",
    shirt: "Red Farmer Shirt",
    tool: "Parsnip",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  },
  blacksmith: {
    body: "Light Brown Farmer Potion",
    hair: "Blacksmith Hair",
    pants: "Lumberjack Overalls",
    shirt: "SFL T-Shirt",
    tool: "Hammer",
    background: "Farm Background",
    shoes: "Brown Boots",
  },
  bruce: {
    body: "Beige Farmer Potion",
    hair: "Buzz Cut",
    pants: "Farmer Pants",
    shirt: "Yellow Farmer Shirt",
    coat: "Chef Apron",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  },
  hank: {
    body: "Light Brown Farmer Potion",
    shirt: "Red Farmer Shirt",
    pants: "Brown Suspenders",
    hair: "Sun Spots",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  },
  grimbly: {
    body: "Goblin Potion",
    pants: "Brown Suspenders",
    tool: "Hammer",
    hair: "Blacksmith Hair",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
    shirt: "Yellow Farmer Shirt",
  },
};
