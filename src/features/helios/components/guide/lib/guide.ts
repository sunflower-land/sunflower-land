import { SUNNYSIDE } from "assets/sunnyside";
import { AchievementName } from "features/game/types/achievements";
import { ITEM_DETAILS } from "features/game/types/images";
import { getSeasonalTicket } from "features/game/types/seasons";
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
        image: SUNNYSIDE.tutorial.workbench,
        text: translate("gathering.guide.one"),
      },

      {
        text: translate("gathering.guide.two"),
      },

      {
        text: translate("gathering.guide.three"),
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
        image: SUNNYSIDE.tutorial.harvesting,
        text: `${translate("crops.guide.one")}

${translate("crops.guide.two")}

${translate("crops.guide.three")}`,
      },
    ],
  },
  building: {
    achievements: ["Well of Prosperity", "Contractor"],
    icon: SUNNYSIDE.icons.hammer,
    docs: "https://docs.sunflower-land.com/player-guides/buildings",
    description: [
      {
        text: `${translate("building.guide.one")}
      
              ${translate("building.guide.two")}`,
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
        image: SUNNYSIDE.tutorial.cooking,
        text: `${translate("cooking.guide.one")}

              ${translate("cooking.guide.two")}

              ${translate("cooking.guide.three")}

              ${translate("cooking.guide.four")}

              ${translate("cooking.guide.five")}`,
      },
    ],
  },
  animals: {
    achievements: ["Egg-cellent Collection"],
    icon: SUNNYSIDE.resource.chicken,
    docs: "https://docs.sunflower-land.com/player-guides/animals",
    description: [
      {
        text: `${translate("animals.guide.one")}

              ${translate("animals.guide.two")}

              ${translate("animals.guide.three")}`,
      },
    ],
  },
  crafting: {
    achievements: ["Scarecrow Maestro", "Big Spender", "Museum", "High Roller"],
    icon: ITEM_DETAILS["Basic Scarecrow"].image,
    description: [
      {
        text: `${translate("crafting.guide.one")}

              ${translate("crafting.guide.two")}

              ${translate("crafting.guide.three")}

              ${translate("crafting.guide.four")}`,
      },
    ],
  },
  deliveries: {
    achievements: ["Delivery Dynamo", "Crowd Favourite"],
    icon: SUNNYSIDE.icons.player,
    docs: "https://docs.sunflower-land.com/player-guides/deliveries",
    description: [
      {
        text: `${translate("deliveries.guide.one")}

              ${translate("deliveries.guide.two")}
              
              ${translate("deliveries.guide.three")}`,
      },
    ],
  },
  scavenger: {
    achievements: ["Treasure Hunter"],
    icon: SUNNYSIDE.resource.crab,
    description: [
      {
        text: `${translate("scavenger.guide.one")}

              ${translate("scavenger.guide.two")}`,
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
    ${translate("fruit.guide.one")}
    
    ${translate("fruit.guide.two")}
    
    ${translate("fruit.guide.three")}`,
      },
    ],
    docs: "https://docs.sunflower-land.com/player-guides/planting-and-harvesting#fruit",
  },

  seasons: {
    achievements: ["Seasoned Farmer"],
    icon: ITEM_DETAILS[getSeasonalTicket()].image,
    description: [
      {
        text: `${translate("seasons.guide.one")}

              ${translate("seasons.guide.two")}
              
              ${translate("seasons.guide.three")}`,
      },
    ],
    docs: "https://docs.sunflower-land.com/player-guides/seasons",
  },
};
