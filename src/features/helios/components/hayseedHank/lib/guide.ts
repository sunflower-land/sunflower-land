import cake from "assets/sfts/cakes/carrot_cake.png";

import { SUNNYSIDE } from "assets/sunnyside";
import { AchievementName } from "features/game/types/achievements";
import { ITEM_DETAILS } from "features/game/types/images";

export type GuidePath =
  | "gathering"
  | "building"
  | "crops"
  | "cooking"
  | "crafting"
  | "deliveries"
  | "animals"
  | "scavenger"
  | "fruit"
  | "seasons";

/*
Walkthrough:

1. Expand Land
2. Earn X SFL
3. Level up (3)
4. Build a Well
5. Craft a Scarecrow
6. Complete X Deliveries
7. Expand land
8. Collect X Seasonal Tickets
9. Expand Land
10. Dig for Treasure
11. Collect Eggs
12. Expand Land
13. Collect Fruit
*/

const WALKTHROUGH: AchievementName[] = [
  "Explorer",
  "Bread Winner",
  "Busy Bumpkin",
  "Well of Prosperity",
  "Scarecrow Maestro",
  "Delivery Dynamo",
  "Land Baron",
  "Seasoned Farmer",
  "Land Expansion Enthusiast",
  "Treasure Hunter",
  "Egg-cellent Collection",
  "Land Expansion Extraordinaire",
  "Fruit Aficionado",
];
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

  fruit: {
    achievements: ["Fruit Aficionado"],
    icon: ITEM_DETAILS.Blueberry.image,
    description: "TODO",
  },

  seasons: {
    achievements: ["Seasoned Farmer"],
    icon: SUNNYSIDE.icons.heart,
    description: "TODO",
  },
};
