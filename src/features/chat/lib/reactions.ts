import { getBumpkinLevel } from "features/game/lib/level";
import { GameState } from "features/game/types/game";

import heartIcon from "assets/icons/heart.png";
import confusedIcon from "assets/icons/expression_confused.png";
import tiredIcon from "assets/icons/water.png";
import crown from "assets/sfts/goblin_crown.png";

export type ReactionName = "heart" | "confused" | "tired" | "crown";

type Reaction = {
  name: ReactionName;
  hasAccess: (game: GameState) => boolean;
  description: string;
  icon: string;
};

export const REACTIONS: Reaction[] = [
  {
    name: "heart",
    hasAccess: () => true,
    description: "Show your love!",
    icon: heartIcon,
  },
  {
    name: "confused",
    hasAccess: () => true,
    description: "What is this?",
    icon: confusedIcon,
  },
  {
    name: "tired",
    hasAccess: (game: GameState) =>
      getBumpkinLevel(game.bumpkin?.experience ?? 0) >= 3,
    description: "Lvl 3 Bumpkin",
    icon: tiredIcon,
  },
  {
    name: "crown",
    hasAccess: (game: GameState) => !!game.inventory["Goblin Crown"],
    description: "Owns Goblin Crown",
    icon: crown,
  },
];
