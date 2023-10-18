import { SeasonName } from "features/game/types/seasons";
import { categories } from "features/island/hud/components/codex/Codex";
import { BuffLabel } from ".";

export type CodexCategoryName = "Fish";
export type CollectionGroup = "fish";

export interface CodexCategory {
  name: CodexCategoryName;
  icon: string;
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
  buffs: BuffLabel[];
};
