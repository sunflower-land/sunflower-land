import { SeasonName } from "features/game/types/seasons";
import { BuffLabel } from ".";

export type CodexCategoryName =
  | "Fish"
  | "Flowers"
  | "Season"
  | "Deliveries"
  | "Chores"
  | "Bumpkins"
  | "Farming"
  | "Treasures"
  | "Leaderboard"
  | "Factions";

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
  season?: SeasonName;
  howToObtain: string[];
  type: AssetType;
  // Leave empty if no boosts
  boosts: BuffLabel[];
};
