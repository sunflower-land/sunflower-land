import { ChapterName } from "features/game/types/chapters";
import { BuffLabel } from ".";

export type CodexCategoryName =
  | "Fish"
  | "Flowers"
  | "Season"
  | "Bull Run"
  | "Deliveries"
  | "Chores"
  | "Checklist"
  | "Bumpkins"
  | "Farming"
  | "Treasures"
  | "Leaderboard"
  | "Factions"
  | "Minigames"
  | "Competition"
  | "Marks"
  | "Chore Board"
  | "Social Points"
  | "Leagues";

export type CollectionGroup = "fish";

export interface CodexCategory {
  name: CodexCategoryName;
  icon: string;
  disabled?: boolean;
  count: number;
}

export type AssetType = "collectible" | "wearable" | "bud";

// Extend from this type for more detailed information
export type BaseInformation = {
  id: number;
  name: string;
  season?: ChapterName;
  howToObtain: string[];
  type: AssetType;
  // Leave empty if no boosts
  boosts: BuffLabel[];
};
