import Decimal from "decimal.js-light";
import { GameState } from "../types/game";

export type AchievementName =
  | "Explorer"
  | "Busy Bumpkin"
  | "Brilliant Bumpkin"
  | "Sun Seeker"
  | "Sunflower Superstar"
  | "My life is potato"
  | "Jack O'Latern"
  | "20/20 Vision"
  | "Cabbage King"
  | "Beetroot Beast"
  | "Cool Flower"
  | "Patient Parsnips"
  | "Rapid Radish"
  | "Staple Crop"
  | "Farm Hand"
  | "Crop Champion"
  | "Bread Winner"
  | "Bumpkin Billionaire"
  | "Big Spender"
  | "High Roller"
  | "Timbeerrr"
  | "Bumpkin Chainsaw Amateur"
  | "Driller"
  | "Canary"
  | "Iron Eyes"
  | "Something Shiny"
  | "El Dorado"
  | "Gold Fever"
  | "Kiss the Cook"
  | "Bakers Dozen"
  | "Chef de Cuisine"
  | "Craftmanship"
  | "Time to chop"
  | "Contractor"
  | "Museum";

export type Achievement = {
  description: string;
  progress: (game: GameState) => number;
  requirement: number;
  sflReward: Decimal;
  experienceReward: number;
};
