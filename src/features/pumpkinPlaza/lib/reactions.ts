import { getBumpkinLevel } from "features/game/lib/level";
import { GameState } from "features/game/types/game";

import happy from "assets/icons/happy.png";
import unhappy from "assets/icons/unhappy.png";
import neutral from "assets/icons/neutral.png";
import heartIcon from "assets/icons/heart.png";
import confusedIcon from "assets/icons/expression_confused.png";
import stressed from "assets/icons/expression_stress.png";
import tiredIcon from "assets/icons/water.png";
import attackIcon from "assets/icons/expression_attack.png";
import sunflower from "assets/crops/sunflower/crop.png";
import crown from "assets/sfts/goblin_crown.png";
import thumbs_up from "assets/skills/green_thumb.png";

export type ReactionName =
  | "heart"
  | "confused"
  | "tired"
  | "crown"
  | "unhappy"
  | "neutral"
  | "happy"
  | "stressed"
  | "attack"
  | "thumbs_up"
  | "sunflower";

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
    name: "happy",
    hasAccess: () => true,
    icon: happy,
    description: "Happy!",
  },
  {
    name: "neutral",
    hasAccess: () => true,
    icon: neutral,
    description: "Neutral :/",
  },
  {
    name: "unhappy",
    hasAccess: () => true,
    icon: unhappy,
    description: "Happy!",
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
  {
    name: "stressed",
    hasAccess: (game: GameState) =>
      getBumpkinLevel(game.bumpkin?.experience ?? 0) >= 10,
    description: "Lvl 10 Bumpkin",
    icon: stressed,
  },
  {
    name: "attack",
    hasAccess: (game: GameState) =>
      getBumpkinLevel(game.bumpkin?.experience ?? 0) >= 30,
    description: "Lvl 30 Bumpkin",
    icon: attackIcon,
  },
  {
    name: "thumbs_up",
    hasAccess: (game: GameState) => !!game.bumpkin?.achievements?.["Farm Hand"],
    description: "Harvest 10,000 crops",
    icon: thumbs_up,
  },
  {
    name: "sunflower",
    hasAccess: (game: GameState) =>
      !!game.bumpkin?.achievements?.["Sunflower Superstar"],
    description: "Harvest 100,000 Sunflowers",
    icon: sunflower,
  },
];
