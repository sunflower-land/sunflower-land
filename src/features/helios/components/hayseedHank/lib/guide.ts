import cake from "assets/sfts/cakes/carrot_cake.png";

import { SUNNYSIDE } from "assets/sunnyside";
import { AchievementName } from "features/game/types/achievements";

export type GuidePath =
  | "gathering"
  | "building"
  | "crops"
  | "cooking"
  | "crafting"
  | "deliveries"
  | "animals"
  | "scavenger";

export const GUIDE_PATHS: Record<
  GuidePath,
  { icon: string; achievements: AchievementName[]; description: string }
> = {
  building: {
    achievements: ["Explorer", "Apple of my Eye"],
    icon: SUNNYSIDE.icons.hammer,
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },
  gathering: {
    achievements: [],
    icon: SUNNYSIDE.tools.axe,
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },
  crops: {
    achievements: ["Bakers Dozen", "Cabbage King"],
    icon: SUNNYSIDE.icons.plant,
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },
  cooking: {
    achievements: [],
    icon: cake,
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },
  animals: {
    achievements: [],
    icon: cake,
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },
  crafting: {
    achievements: [],
    icon: cake,
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },
  deliveries: {
    achievements: [],
    icon: cake,
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },

  scavenger: {
    achievements: [],
    icon: SUNNYSIDE.resource.clam_shell,
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },
};
