import { getBumpkinLevel } from "features/game/lib/level";
import { GameState } from "features/game/types/game";

import crown from "assets/sfts/goblin_crown.png";
import thumbs_up from "assets/skills/green_thumb.png";
import suspicious from "assets/icons/suspicious.png";
import levelUp from "assets/icons/level_up.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";

export type ReactionName =
  | "heart"
  | "confused"
  | "tired"
  | "crown"
  | "power_up"
  | "neutral"
  | "happy"
  | "stressed"
  | "attack"
  | "thumbs_up"
  | "suspicious"
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
    name: "tired",
    hasAccess: (game: GameState) =>
      getBumpkinLevel(game.bumpkin?.experience ?? 0) >= 3,
    description: "Lvl 3 Bumpkin",
    icon: SUNNYSIDE.icons.water,
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
    name: "power_up",
    hasAccess: (game: GameState) =>
      getBumpkinLevel(game.bumpkin?.experience ?? 0) >= 40,
    description: "Lvl 40 Bumpkin",
    icon: levelUp,
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
  {
    name: "suspicious",
    hasAccess: (game: GameState) =>
      game.bumpkin?.equipped.body === "Goblin Potion",
    description: "Turn into a Goblin",
    icon: suspicious,
  },
  {
    name: "crown",
    hasAccess: (game: GameState) => !!game.inventory["Goblin Crown"],
    description: "Own a Goblin Crown",
    icon: crown,
  },
];
