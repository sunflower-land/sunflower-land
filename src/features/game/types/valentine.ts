import { Bumpkin } from "./game";

export type ValentineFoodName =
  | "Mashed Potato"
  | "Pumpkin Soup"
  | "Bumpkin Broth"
  | "Reindeer Carrot"
  | "Sunflower Crunch";

export const VALENTINE_CONSUMABLES: ValentineFoodName[] = [
  "Mashed Potato",
  "Pumpkin Soup",
  "Bumpkin Broth",
  "Reindeer Carrot",
  "Pumpkin Soup",
  "Bumpkin Broth",
  "Pumpkin Soup",
  "Bumpkin Broth",
  "Reindeer Carrot",
  "Mashed Potato",
  "Mashed Potato",
  "Reindeer Carrot",
  "Sunflower Crunch",
  "Reindeer Carrot",
  "Pumpkin Soup",
  "Pumpkin Soup",
  "Mashed Potato",
  "Mashed Potato",
  "Mashed Potato",
  "Bumpkin Broth",
  "Sunflower Crunch",
];

export const getValentineFood = (bumpkin?: Bumpkin) => {
  const loveLettersCollected =
    bumpkin?.activity?.["Love Letter Collected"] || 0;
  return VALENTINE_CONSUMABLES[
    loveLettersCollected % VALENTINE_CONSUMABLES.length
  ];
};
