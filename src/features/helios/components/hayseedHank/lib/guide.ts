import { SUNNYSIDE } from "assets/sunnyside";
import { AchievementName } from "features/game/types/achievements";
import { ITEM_DETAILS } from "features/game/types/images";

import workbench from "assets/tutorials/workbench.png";
import harvesting from "assets/tutorials/harvesting.png";
import cooking from "assets/tutorials/fire_pit.png";

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
        text: `To thrive in Sunflower Land, mastering the art of resource gathering is essential. Start by equipping the appropriate tools to collect different resources. Use the trusty Axe to chop down trees and acquire wood. To craft tools, visit the local workbench & exchange your SFL/resources for the desired tool.`,
      },

      {
        text: `As you progress and gather sufficient resources, you'll unlock the ability to expand your territory. Expanding your land opens up new horizons in Sunflower Land.  Land expansions reveal a treasure trove of resources, including fertile soil for planting crops, majestic trees, valuable stone deposits, precious iron veins, shimmering gold deposits, delightful fruit patches and much more`,
      },

      {
        text: `Remember, resource gathering and land expansion are the backbone of your farming journey. Embrace the challenges and rewards that come with each step, and watch your Sunflower Land flourish with bountiful resources and endless possibilities`,
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
        text: `In Sunflower Land, crops play a crucial role in your journey towards prosperity. By planting and harvesting crops, you can earn SFL (Sunflower Token) or utilize them to craft valuable recipes and items within the game.

To grow crops, you need to purchase the respective seeds from the in-game shop. Each crop has a different growth time, ranging from just 1 minute for Sunflowers to 36 hours for Kale. Once the crops are fully grown, you can harvest them and reap the rewards.

Remember, as you expand your land and progress in the game, more crops will become available, offering greater opportunities for earning SFL and exploring the vast potential of Sunflower Land's farming economy. So get your hands dirty, plant those seeds, and watch your crops flourish as you harvest your way to success!`,
      },
    ],
  },
  building: {
    achievements: ["Well of Prosperity", "Contractor"],
    icon: SUNNYSIDE.icons.hammer,
    docs: "https://docs.sunflower-land.com/player-guides/buildings",
    description: [
      {
        text: `Explore the diverse range of buildings available as you progress in Sunflower Land. From hen houses to workshops and beyond, each structure brings unique advantages to your farm. Take advantage of these buildings to streamline your farming operations, increase productivity, and unlock new possibilities. Plan your layout carefully and enjoy the rewards that come with constructing a thriving farm in Sunflower Land.
      
      In Sunflower Land, buildings are the cornerstone of your farming journey. To access the buildings menu, click the Inventory icon and select the Buildings tab. Choose the desired structure and return to your farm screen. Find an open space, marked in green, and confirm the placement. Wait for the timer to complete, and your new building will be ready to use. Buildings provide various benefits and unlock exciting gameplay features. Strategically position them on your farm to maximize efficiency and watch as your farming empire grows and prospers.
      `,
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
        text: `Cooking allows you to nourish your Bumpkin and help them gain valuable experience points (XP). By utilizing the crops you've harvested, you can prepare delicious food at different buildings dedicated to cooking.

Starting with the Fire Pit, every farm has access to basic cooking facilities from the beginning. However, as you progress, you can unlock and upgrade more advanced buildings such as the Kitchen, Bakery, and Deli, each offering a wider variety of recipes and culinary delights.

To cook, simply select a building and choose a recipe you wish to prepare. The recipe will provide details about the required ingredients, the XP gained upon consumption, and the preparation time. After initiating the cooking process, keep an eye on the timer to know when the food will be ready to collect.

Once the food is ready, retrieve it from the building by clicking on it and moving it into your inventory. From there, you can interact with your Bumpkin NPC on the farm and feed them the prepared food, helping them gain XP and progress further in the game.

Experiment with different recipes, unlock new buildings, and discover the joy of cooking as you nurture your Bumpkin and embark on a delicious culinary adventure in Sunflower Land.`,
      },
    ],
  },
  animals: {
    achievements: ["Egg-cellent Collection"],
    icon: SUNNYSIDE.resource.chicken,
    docs: "https://docs.sunflower-land.com/player-guides/animals",
    description: [
      {
        text: `Chickens in Sunflower Land are a delightful addition to your farm, serving as a source of eggs that can be used in various recipes and crafting. To start with chickens, you'll need to reach Bumpkin level 9 and build the Hen House. From there, you have the option to purchase chickens or place the ones you already have. Simply drag and drop them onto your farm, just like placing buildings. On a standard farm, you can have up to 10 chickens, and if you own the Chicken Coop NFT, this limit extends to 15.

      Each chicken has an indicator above its head, displaying its current mood or needs. This can range from being hungry, tired, happy, or ready to hatch. To keep your chickens content and productive, feed them by selecting wheat from your inventory and interacting with the chicken. Feeding initiates the egg timer, which takes 48 hours for the eggs to be ready to hatch. Once the eggs are ready, visit your farm, check the icon above each chicken, and interact with them to find out the type of egg that has hatched. Occasionally, you may even discover rare mutant chickens, which offer special boosts such as faster egg production, increased yield, or reduced food consumption.
      
      Nurturing your chickens and collecting their eggs adds a dynamic and rewarding element to your farm in Sunflower Land. Experiment with recipes, make use of the eggs in your crafting endeavors, and enjoy the surprises that come with rare mutant chickens. Build a thriving poultry operation and reap the benefits of your hard work as you embrace the charming world of chickens in Sunflower Land.`,
      },
    ],
  },
  crafting: {
    achievements: ["Scarecrow Maestro", "Big Spender", "Museum", "High Roller"],
    icon: ITEM_DETAILS["Basic Scarecrow"].image,
    description: [
      {
        text: `In Sunflower Land, crafting NFTs is a crucial aspect of boosting your farming output and accelerating your progress. These special items provide various bonuses, such as crop growth boosts, cooking enhancements, and resource boosts, which can greatly expedite your journey. By maximizing your SFL (Sunflower Token), you can craft tools, gather resources, and expand your land to further establish your farming empire.

      To begin crafting items, we'll visit Igor, a skilled craftsman in Sunfloria. After hopping on the boat and arriving at Sunfloria, head to the top of the island to have a conversation with Igor. He is currently offering a Basic Scarecrow, which boosts the speed of Sunflowers, Potatoes, and Pumpkins. This is an excellent deal that requires exchanging your resources for the scarecrow. Once obtained, return to your main island and enter design mode by clicking on the white hand icon in the top right corner of the game.
      
      In design mode, you can strategically place items and rearrange resources on your farm to optimize its layout and enhance its visual appeal. This step is crucial in maximizing the effectiveness of your crafted equipment. For example, place the Scarecrow over the plots you want to boost. Additionally, consider purchasing decorations to add charm and tidiness to your land. By crafting equipment and placing it strategically, you can amplify your farming abilities, create an island home to be proud of, and accelerate your progress in Sunflower Land.`,
      },
    ],
  },
  deliveries: {
    achievements: ["Delivery Dynamo", "Crowd Favourite"],
    icon: SUNNYSIDE.icons.player,
    docs: "https://docs.sunflower-land.com/player-guides/deliveries",
    description: [
      {
        text: `Deliveries in Sunflower Land provide an exciting opportunity to help hungry Goblins and fellow Bumpkins while earning rewards. Everyday you will be able to see all the orders you have by clicking on the delivery board on the bottom left of the screen. The orders have been placed by some local NPC's that can be found hanging around Pumpkin Plaza. To fulfill an order, you will need to take boat ride to Pumpkin Plaza and look for the NPC expecting the delivery. Once you find them, click on them to deliver the order and receive your reward.

      As a new player, you start with three order slots, but as you expand your farm, you will unlock additional slots, allowing advanced players to take on more orders. New orders come in every 24 hours, offering a range of tasks from farming produce to cooking food and gathering resources. Completing orders will earn you milestone bonuses, including Block Bucks, SFL, delicious cakes, and other rewards. The reward system is based on the difficulty of the request, so consider prioritizing orders that offer greater rewards to maximize your gains. Keep an eye on the board and challenge yourself with a variety of orders, leveling up and unlocking new buildings as needed to fulfill more demanding requests.`,
      },
    ],
  },
  scavenger: {
    achievements: ["Treasure Hunter"],
    icon: SUNNYSIDE.resource.crab,
    description: [
      {
        text: `Scavenging in Sunflower Land offers exciting opportunities to uncover hidden treasures and gather valuable resources. The first aspect of scavenging is digging for treasure on Treasure Island, where you can become a pirate treasure hunter. By crafting a sand shovel and venturing to Treasure Island, you can dig in dark sandy areas to uncover a variety of treasures, including bounty, decorations, and even ancient SFTs with utility. These treasures can be sold for SFL, used as decorations, or put to other creative uses on your farm. The rare Wooden Compass and Sand Drill provide additional tools to enhance your treasure hunting experience and increase your chances of finding valuable items.

      Another form of scavenging involves gathering wild mushrooms that appear spontaneously on your farm and surrounding islands. These mushrooms can be collected for free and used in recipes, quests, and crafting items. Keep an eye out for these mushrooms, as they replenish every 16 hours, with a maximum limit of 5 mushrooms on your farm. If your land is full, mushrooms will appear on the surrounding islands, ensuring you don't miss out on these valuable resources. Embrace the thrill of scavenging, dig deep for hidden treasures, and collect mushrooms to enhance your farming journey in Sunflower Land.`,
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
    Fruit plays a significant role in Sunflower Land as a valuable resource that can be sold for SFL or utilized in various recipes and crafting. Unlike crops, fruit patches have the unique ability to replenish multiple times after each harvest, providing a sustainable source of fruit for players. To plant fruit, you'll need to acquire larger fruit patches, which become available on the 7th expansion of your farm. By cultivating fruit and incorporating it into your farming strategies, you can maximize your profits, create delicious recipes, and unlock new possibilities in Sunflower Land.`,
      },
    ],
    docs: "https://docs.sunflower-land.com/player-guides/planting-and-harvesting#fruit",
  },

  seasons: {
    achievements: ["Seasoned Farmer"],
    icon: SUNNYSIDE.icons.stopwatch,
    description: [
      {
        text: `Seasons in Sunflower Land bring excitement and freshness to the game, offering players new challenges and opportunities. With the introduction of each season, players can look forward to a variety of new craftable items, limited edition decorations, mutant animals, and rare treasures. These seasonal changes create a dynamic and evolving gameplay experience, encouraging players to adapt their strategies and explore new possibilities on their farms. Additionally, seasonal tickets add a strategic element to the game, as players must decide how to allocate their tickets wisely, whether it's collecting rare items, opting for higher supply decorations, or exchanging tickets for SFL. The seasonal mechanic keeps the game engaging and ensures that there's always something to look forward to in Sunflower Land.

    The availability of seasonal items at the Goblin Blacksmith adds another layer of excitement. Players must gather the required resources and seasonal tickets to craft these limited-supply items, creating a sense of competition and urgency. Planning ahead and strategizing become crucial as players aim to secure their desired items before the supply runs out. Moreover, the option to swap seasonal tickets for SFL provides flexibility and allows players to make choices that align with their specific gameplay goals. With each season's unique offerings and the anticipation of surprise events, Sunflower Land keeps players engaged and entertained throughout the year, fostering a vibrant and ever-evolving farming experience.`,
      },
    ],
    docs: "https://docs.sunflower-land.com/player-guides/seasons",
  },
};
