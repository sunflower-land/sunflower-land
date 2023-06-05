import shuffle from "lodash.shuffle";
import { POTIONS } from "./potions";
import { Combination, GuessFeedback } from "./types";

export function calculateScore(feedback?: GuessFeedback[]): number {
  if (!feedback) return 0;

  const scoreMap: Record<GuessFeedback, number> = {
    correct: 25,
    almost: 15,
    incorrect: -10,
    bombed: 0,
  };

  let score = 0;

  if (feedback.some((type) => type === "bombed")) return scoreMap.bombed;

  const correctCount = feedback.filter((type) => type === "correct").length;
  score = correctCount * scoreMap.correct;

  const almostCount = feedback.filter((type) => type === "almost").length;
  score += almostCount * scoreMap.almost;

  const incorrectCount = feedback.filter((type) => type === "incorrect").length;
  score += incorrectCount * scoreMap.incorrect;

  // Ensure the score is within the range of 0 to 100
  score = Math.max(0, Math.min(100, score));

  return score;
}

// TEMP FUNCTION
export const generatePotionCombination = (): Combination => {
  const VALID_POTIONS = POTIONS.filter(({ name }) => name !== "Golden Syrup");

  const bomb =
    VALID_POTIONS[Math.floor(Math.random() * VALID_POTIONS.length)].name;
  const filteredPotions = VALID_POTIONS.filter(
    (potion) => potion.name !== bomb
  );

  const code = shuffle(filteredPotions)
    .slice(0, 4)
    .map((potion) => potion.name);

  return {
    code,
    bomb,
  };
};

export function getFeedbackText(score: number): string {
  if (score >= 90) {
    const feedbackOptions = [
      "Incredible! You're mastering the art of potion-making!",
      "Magnificent! Your skills are bringing the plant to life!",
      "Astounding! The plant is in awe of your expertise!",
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }

  if (score >= 50) {
    const feedbackOptions = [
      "Great job! Your potion is a hit with the plant!",
      "Well done! The plant thrives on your skillful concoction!",
      "Fantastic! Your potion has worked its magic on the plant!",
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }

  if (score >= 25) {
    const feedbackOptions = [
      "Good work! The plant is pleased with your efforts!",
      "Nice effort! Your potion brings joy to the plant!",
      "Not bad! Your skills are starting to impress the plant!",
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }

  if (score > 0) {
    const feedbackOptions = [
      "Keep trying! The plant recognizes your determination!",
      "You're getting there! The plant sees your progress!",
      "Not quite, but the plant senses your commitment!",
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }

  const feedbackOptions = [
    "Oh no! The plant despises something in your potion! Try again.",
    "Oops! The plant recoils from something in your potion! Try again.",
    "Uh-oh! Something in your potion is a total flop with the plant! Try again.",
  ];
  return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
}
