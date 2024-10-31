import { getBumpkinLevel } from "features/game/lib/level";
import { GameState } from "features/game/types/game";

import crown from "assets/sfts/goblin_crown.png";

import levelUp from "assets/icons/level_up.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { PLOT_CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { translate } from "lib/i18n/translate";

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
    description: translate("reaction.bumpkin"),
    icon: SUNNYSIDE.icons.water,
  },

  {
    name: "stressed",
    hasAccess: (game: GameState) =>
      getBumpkinLevel(game.bumpkin?.experience ?? 0) >= 10,
    description: translate("reaction.bumpkin.10"),
    icon: SUNNYSIDE.icons.stressed,
  },
  {
    name: "attack",
    hasAccess: (game: GameState) =>
      getBumpkinLevel(game.bumpkin?.experience ?? 0) >= 30,
    description: translate("reaction.bumpkin.30"),
    icon: SUNNYSIDE.icons.death,
  },
  {
    name: "power_up",
    hasAccess: (game: GameState) =>
      getBumpkinLevel(game.bumpkin?.experience ?? 0) >= 40,
    description: translate("reaction.bumpkin.40"),
    icon: levelUp,
  },
  {
    name: "thumbs_up",
    hasAccess: (game: GameState) => !!game.bumpkin?.achievements?.["Farm Hand"],
    description: translate("reaction.crops"),
    icon: SUNNYSIDE.badges.greenThumb,
  },
  {
    name: "sunflower",
    hasAccess: (game: GameState) =>
      !!game.bumpkin?.achievements?.["Sunflower Superstar"],
    description: translate("reaction.sunflowers"),
    icon: PLOT_CROP_LIFECYCLE.Sunflower.crop,
  },
  {
    name: "suspicious",
    hasAccess: (game: GameState) =>
      game.bumpkin?.equipped.body === "Goblin Potion",
    description: translate("reaction.goblin"),
    icon: SUNNYSIDE.icons.suspicious,
  },
  {
    name: "crown",
    hasAccess: (game: GameState) => !!game.inventory["Goblin Crown"],
    description: translate("reaction.crown"),
    icon: crown,
  },
];
