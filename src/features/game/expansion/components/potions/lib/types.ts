import { SUNNYSIDE } from "assets/sunnyside";
import { PotionName, PotionStatus } from "features/game/types/game";

export type Potion = {
  name: PotionName;
  description: string;
  image: string;
};

export const FeedbackIcons: Omit<Record<PotionStatus, string>, "pending"> = {
  correct: SUNNYSIDE.icons.happy,
  almost: SUNNYSIDE.icons.neutral,
  incorrect: SUNNYSIDE.icons.sad,
  bomb: SUNNYSIDE.icons.angry,
};
