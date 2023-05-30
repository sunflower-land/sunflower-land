import { SUNNYSIDE } from "assets/sunnyside";
import { InventoryItemName } from "features/game/types/game";

export type GuessFeedback = "correct" | "almost" | "incorrect" | "bombed";

export type Potion = {
  name: PotionName;
  ingredients: Partial<Record<InventoryItemName, number>>;

  image: string;
};

export type PotionName =
  | "Bloom Boost"
  | "Happy Hooch"
  | "Earth Essence"
  | "Flower Power"
  | "Organic Oasis"
  | "Dream Drip"
  | "Ember Elixir"
  | "Whisper Brew"
  | "Miracle Mix"
  | "Golden Syrup";

export type Combination = {
  code: PotionName[];
  bomb: PotionName;
};

export type Turn = {
  guess: PotionName[];
  feedback: GuessFeedback[];
};

export const FeedbackIcons: Record<GuessFeedback, string> = {
  correct: SUNNYSIDE.icons.happy,
  almost: SUNNYSIDE.icons.neutral,
  incorrect: SUNNYSIDE.icons.sad,
  bombed: SUNNYSIDE.icons.angry,
};
