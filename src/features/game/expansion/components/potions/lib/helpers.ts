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
      "Almost! Your potion has had a positive impact on your plant!",
      "Keep it up! The plant is starting to thrive on your skillful concoction!",
      "Nice one! Your potion is starting to work its magic on the plant!",
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }

  if (score >= 25) {
    const feedbackOptions = [
      "Getting there. The plant is showing signs of happiness.",
      "Nice effort. Your potion has brought a bit of joy to the plant.",
      "Not bad. Your skills are starting to make a good impression on the plant.",
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }

  if (score > 0) {
    const feedbackOptions = [
      "Keep trying. The plant recognizes your determination.",
      "You're getting there. The plant sees your progress.",
      "Not quite, but the plant senses your commitment.",
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
