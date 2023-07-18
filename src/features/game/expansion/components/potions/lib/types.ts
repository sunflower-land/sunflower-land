import { SUNNYSIDE } from "assets/sunnyside";
import { PotionName, PotionStatus } from "features/game/types/game";

export type Potion = {
  name: PotionName;
  description: string;
  image: string;
};

export const FeedbackIcons: Record<PotionStatus, string> = {
  pending: SUNNYSIDE.icons.neutral,
  correct: SUNNYSIDE.icons.happy,
  almost: SUNNYSIDE.icons.neutral,
  incorrect: SUNNYSIDE.icons.sad,
  bomb: SUNNYSIDE.icons.angry,
};
