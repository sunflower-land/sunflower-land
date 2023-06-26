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
