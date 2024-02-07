import { translate } from "lib/i18n/translate";
export function getFeedbackText(score: number): string {
  if (score >= 90) {
    const feedbackOptions = [
      translate("helper.highScore1"),
      translate("helper.highScore2"),
      translate("helper.highScore3"),
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }

  if (score >= 50) {
    const feedbackOptions = [
      translate("helper.midScore1"),
      translate("helper.midScore2"),
      translate("helper.midScore3"),
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }

  if (score >= 25) {
    const feedbackOptions = [
      translate("helper.lowScore1"),
      translate("helper.lowScore2"),
      translate("helper.lowScore3"),
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }

  if (score > 0) {
    const feedbackOptions = [
      translate("helper.veryLowScore1"),
      translate("helper.veryLowScore2"),
      translate("helper.veryLowScore3"),
    ];
    return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
  }

  const feedbackOptions = [
    translate("helper.noScore1"),
    translate("helper.noScore2"),
    translate("helper.noScore3"),
  ];
  return feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
}
