import { SUNNYSIDE } from "assets/sunnyside";
import chefHat from "assets/icons/chef_hat.png";
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

export const WALKTHROUGH: AchievementName[] = [
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
  "Crowd Favourite",
  "Chef de Cuisine",
  "High Roller",
  "Gold Fever",
  "Crop Champion",
  "Fruit Platter",
];
export const GUIDE_PATHS: Record<
  GuidePath,
  {
    icon: string;
    achievements: AchievementName[];
    description: string;
    docs?: string;
  }
> = {
  gathering: {
    achievements: [
      "Explorer",
      "Land Baron",
      "Timbeerrr",
      "Craftmanship",
      "Land Expansion Enthusiast",
      "El Dorado",
      "Land Expansion Extraordinaire",
      "Gold Fever",
    ],
    icon: SUNNYSIDE.icons.basket,
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
    docs: "https://docs.sunflower-land.com/player-guides/gather-resources",
  },
  crops: {
    achievements: [
      "Bread Winner",
      "Sun Seeker",
      "Jack O'Latern",
      "Farm Hand",
      "Rapid Radish",
      "Sunflower Superstar",
      "Bumpkin Billionaire",
      "Crop Champion",
    ],
    icon: SUNNYSIDE.icons.plant,
    docs: "https://docs.sunflower-land.com/player-guides/planting-and-harvesting",
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },
  building: {
    achievements: ["Well of Prosperity", "Contractor"],
    icon: SUNNYSIDE.icons.hammer,
    docs: "https://docs.sunflower-land.com/player-guides/buildings",
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },
  cooking: {
    achievements: [
      "Busy Bumpkin",
      "Kiss the Cook",
      "Bakers Dozen",
      "Brilliant Bumpkin",
      "Chef de Cuisine",
    ],
    icon: SUNNYSIDE.icons.heart,
    docs: "https://docs.sunflower-land.com/player-guides/cooking",
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },
  animals: {
    achievements: ["Egg-cellent Collection"],
    icon: SUNNYSIDE.resource.chicken,
    docs: "https://docs.sunflower-land.com/player-guides/animals",
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },
  crafting: {
    achievements: ["Scarecrow Maestro", "Big Spender", "Museum", "High Roller"],
    icon: ITEM_DETAILS["Basic Scarecrow"].image,
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },
  deliveries: {
    achievements: ["Delivery Dynamo", "Crowd Favourite"],
    icon: SUNNYSIDE.icons.player,
    docs: "https://docs.sunflower-land.com/player-guides/deliveries",
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },

  scavenger: {
    achievements: ["Treasure Hunter"],
    icon: SUNNYSIDE.resource.crab,
    description:
      "In Sunflower Land, gathering resources is the foundation of your farming journey. The first step is to venture into the lush surroundings and gather essential materials like wood and stones. You'll come across tall trees scattered across the island, and with the right tool in hand, you can start chopping them down. Harvesting wood will provide you with a valuable resource for crafting buildings, tools, and decorative items. Similarly, keep an eye out for stones as you explore the land. They can be gathered and used in various crafting recipes. Visit the marketplace to browse and purchase different tools that suit your needs. Experiment with different tools to find the most efficient way to gather resources and make the most of your time in Sunflower Land.",
  },

  fruit: {
    achievements: [
      "Fruit Aficionado",
      "Orange Squeeze",
      "Apple of my Eye",
      "Blue Chip",
      "Fruit Platter",
    ],
    icon: ITEM_DETAILS.Apple.image,
    description: "TODO",
    docs: "https://docs.sunflower-land.com/player-guides/planting-and-harvesting#fruit",
  },

  seasons: {
    achievements: ["Seasoned Farmer"],
    icon: SUNNYSIDE.icons.stopwatch,
    description: "TODO",
    docs: "https://docs.sunflower-land.com/player-guides/seasons",
  },
};
