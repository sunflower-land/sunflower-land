import { getBumpkinLevel } from "features/game/lib/level";
import { GameState } from "features/game/types/game";

import crown from "assets/sfts/goblin_crown.png";
import thumbs_up from "assets/skills/green_thumb.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";

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
    icon: SUNNYSIDE.icons.heart,
  },
  {
    name: "confused",
    hasAccess: () => true,
    description: "What is this?",
    icon: SUNNYSIDE.icons.expression_confused,
  },

  {
    name: "happy",
    hasAccess: () => true,
    icon: SUNNYSIDE.icons.happy,
    description: "Happy!",
  },
  {
    name: "neutral",
    hasAccess: () => true,
    icon: SUNNYSIDE.icons.neutral,
    description: "Neutral :/",
  },
  {
    name: "unhappy",
    hasAccess: () => true,
    icon: SUNNYSIDE.icons.unhappy,
    description: "Happy!",
  },
  {
    name: "tired",
    hasAccess: (game: GameState) =>
      getBumpkinLevel(game.bumpkin?.experience ?? 0) >= 3,
    description: "Lvl 3 Bumpkin",
    icon: SUNNYSIDE.icons.water,
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
    icon: SUNNYSIDE.icons.stressed,
  },
  {
    name: "attack",
    hasAccess: (game: GameState) =>
      getBumpkinLevel(game.bumpkin?.experience ?? 0) >= 30,
    description: "Lvl 30 Bumpkin",
    icon: SUNNYSIDE.icons.death,
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
    icon: CROP_LIFECYCLE.Sunflower.crop,
  },
];
