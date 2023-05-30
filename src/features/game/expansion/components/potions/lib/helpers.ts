import shuffle from "lodash.shuffle";
import { BASIC_POTIONS } from "./potions";
import { Combination, GuessFeedback } from "./types";

export function calculateScore(feedback?: GuessFeedback[]): number {
  if (!feedback) return 0;

  const scoreMap: Record<GuessFeedback, number> = {
    correct: 25,
    almost: 5,
    incorrect: -10,
    bombed: 0,
  };

  let score = 0;

  for (const feedbackType of feedback) {
    score += scoreMap[feedbackType];
  }

  // Ensure the score is within the range of 0 to 100
  score = Math.max(0, Math.min(100, score));

  return score;
}

// TEMP FUNCTION
export const generatePotionCombination = (): Combination => {
  const bomb =
    BASIC_POTIONS[Math.floor(Math.random() * BASIC_POTIONS.length)].name;
  const filteredPotions = BASIC_POTIONS.filter(
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

export function getFeedbackText(turns: number, score: number): string {
  if (turns === 0) {
    return "Welcome, apprentice! Select your potions and unveil the secrets of the plants!";
  }

  if (score >= 90) {
    const feedbackOptions = [
      "Incredible! You've mastered the art of potion-making!",
      "Magnificent! Your skills have brought the plant to life!",
      "Astounding! The plant is in awe of your expertise!",
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }

  if (score >= 70) {
    const feedbackOptions = [
      "Great job! Your potion is a hit with the plant!",
      "Well done! The plant thrives on your skillful concoction!",
      "Fantastic! Your potion has worked its magic on the plant!",
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }

  if (score >= 50) {
    const feedbackOptions = [
      "Good work! The plant is pleased with your efforts!",
      "Nice effort! Your potion brings joy to the plant!",
      "Not bad! Your skills are starting to impress the plant!",
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }

  if (score >= 30) {
    const feedbackOptions = [
      "Keep trying! The plant recognizes your determination!",
      "You're getting there! The plant sees your progress!",
      "Not quite, but the plant senses your commitment!",
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }

  const feedbackOptions = [
    "Oh no! Your potion didn't have the desired effect on the plant.",
    "Oops! The plant seems unimpressed with your potion.",
    "Uh-oh! Your potion didn't quite hit the mark with the plant.",
  ];
  return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
}
