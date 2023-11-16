import { SUNNYSIDE } from "assets/sunnyside";
import { AchievementName } from "features/game/types/achievements";
import { ITEM_DETAILS } from "features/game/types/images";

import workbench from "assets/tutorials/workbench.png";
import harvesting from "assets/tutorials/harvesting.png";
import cooking from "assets/tutorials/fire_pit.png";
import { translate } from "lib/i18n/translate";

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
3. Level up (2)
4. Complete X Deliveries
5. Build a Well
6. Craft a Scarecrow
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
  "Delivery Dynamo",
  "Well of Prosperity",
  "Scarecrow Maestro",
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
    description: { text: string; image?: string }[];
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
    description: [
      {
        image: workbench,
        text: translate("gathering.description.one"),
      },

      {
        text: translate("gathering.description.two"),
      },

      {
        text: translate("gathering.description.three"),
      },
    ],
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
    description: [
      {
        image: harvesting,
        text: `${translate("crops.description.one")}

${translate("crops.description.two")}

${translate("crops.description.three")}`,
      },
    ],
  },
  building: {
    achievements: ["Well of Prosperity", "Contractor"],
    icon: SUNNYSIDE.icons.hammer,
    docs: "https://docs.sunflower-land.com/player-guides/buildings",
    description: [
      {
        text: `${translate("building.description.one")}
      
              ${translate("building.description.two")}`,
      },
    ],
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
    description: [
      {
        image: cooking,
        text: `${translate("cooking.description.one")}

              ${translate("cooking.description.two")}

              ${translate("cooking.description.three")}

              ${translate("cooking.description.four")}

              ${translate("cooking.description.five")}`,
      },
    ],
  },
  animals: {
    achievements: ["Egg-cellent Collection"],
    icon: SUNNYSIDE.resource.chicken,
    docs: "https://docs.sunflower-land.com/player-guides/animals",
    description: [
      {
        text: `${translate("animals.description.one")}

              ${translate("animals.description.two")}

              ${translate("animals.description.three")}`,
      },
    ],
  },
  crafting: {
    achievements: ["Scarecrow Maestro", "Big Spender", "Museum", "High Roller"],
    icon: ITEM_DETAILS["Basic Scarecrow"].image,
    description: [
      {
        text: `${translate("crafting.description.one")}

              ${translate("crafting.description.two")}

              ${translate("crafting.description.three")}

              ${translate("crafting.description.four")}`,
      },
    ],
  },
  deliveries: {
    achievements: ["Delivery Dynamo", "Crowd Favourite"],
    icon: SUNNYSIDE.icons.player,
    docs: "https://docs.sunflower-land.com/player-guides/deliveries",
    description: [
      {
        text: `${translate("deliveries.description.one")}

              ${translate("deliveries.description.two")}`,
      },
    ],
  },
  scavenger: {
    achievements: ["Treasure Hunter"],
    icon: SUNNYSIDE.resource.crab,
    description: [
      {
        text: `${translate("scavenger.description.one")}

              ${translate("scavenger.description.two")}`,
      },
    ],
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
    description: [
      {
        text: `
    ${translate("fruit.description.one")}
    
    ${translate("fruit.description.two")}
    
    ${translate("fruit.description.three")}`,
      },
    ],
    docs: "https://docs.sunflower-land.com/player-guides/planting-and-harvesting#fruit",
  },

  seasons: {
    achievements: ["Seasoned Farmer"],
    icon: SUNNYSIDE.icons.stopwatch,
    description: [
      {
        text: `${translate("seasons.description.one")}

              ${translate("seasons.description.two")}`,
      },
    ],
    docs: "https://docs.sunflower-land.com/player-guides/seasons",
  },
};
