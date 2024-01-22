import { SeasonName } from "features/game/types/seasons";
import { categories } from "features/island/hud/components/codex/Codex";
import { BuffLabel } from ".";

export type CodexCategoryName =
  | "Fish"
  | "Flowers"
  | "Season"
  | "Bumpkins"
  | "Farming"
  | "Treasures";

export type CollectionGroup = "fish";

export interface CodexCategory {
  name: CodexCategoryName;
  icon: string;
  disabled?: boolean;
}

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
  boosts: BuffLabel[];
};
