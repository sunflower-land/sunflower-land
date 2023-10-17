import { SeasonName } from "features/game/types/seasons";
import { categories } from "./Codex";

export type CodexCategoryName = "My Farm" | "Fish" | "Mutants" | "Guide";
export type CollectionGroup = "mutants" | "fish";

export interface CodexCategory {
  name: CodexCategoryName;
  icon: string;
}

type BoostType = "speed" | "quantity" | "critical hit" | "special";

type Boost = {
  item: string;
  /**
   * Short clear description of the boost eg. +0.1 Carrots -10% Grow Time
   */
  boost: string;
  type: BoostType;
};

export type AssetType = "collectible" | "wearable" | "bud";

export type CodexTabIndex = keyof typeof categories;

// Extend from this type for more detailed information
export type BaseInformation = {
  id: number;
  name: string;
  season?: SeasonName;
  howToObtain: string[];
  type: AssetType;
  // Leave empty if no boosts
  boosts: Boost[];
};
