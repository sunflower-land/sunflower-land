import { SUNNYSIDE } from "assets/sunnyside";
import Decimal from "decimal.js-light";
import {
  InventoryItemName,
  PotionName,
  PotionStatus,
} from "features/game/types/game";

export type Potion = {
  name: PotionName;
  ingredients: Partial<Record<InventoryItemName, Decimal>>;
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
