import { getKeys } from "./craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { translate } from "lib/i18n/translate";
import { IslandType } from "./game";

export type BumpkinSkillName =
  | "Green Thumb"
  | "Cultivator"
  | "Master Farmer"
  | "Golden Flowers"
  | "Plant Whisperer"
  | "Happy Crop"
  | "Lumberjack"
  | "Tree Hugger"
  | "Tough Tree"
  | "Money Tree"
  | "Digger"
  | "Coal Face"
  | "Seeker"
  | "Gold Rush"
  | "Rush Hour"
  | "Kitchen Hand"
  | "Michelin Stars"
  | "Curer"
  | "Stable Hand"
  | "Free Range"
  | "Horse Whisperer"
  | "Buckaroo";

export type BumpkinSkillTree =
  | "Crops"
  | "Trees"
  | "Rocks"
  | "Cooking"
  | "Animals";

export type BumpkinRevampSkillTree =
  | "Crops"
  | "Fruit"
  | "Trees"
  | "Fishing"
  | "Animals"
  | "Greenhouse"
  | "Mining"
  | "Cooking"
  | "Bees & Flowers"
  | "Machinery"
  | "Compost";

export type BumpkinSkill = {
  name: BumpkinSkillName;
  tree: BumpkinSkillTree;
  requirements: {
    skill?: BumpkinSkillName;
    points: number;
  };
  boosts: string;
  image: string;
  disabled?: boolean;
};

export type BumpkinSkillRevamp = {
  name: string;
  tree: BumpkinRevampSkillTree;
  requirements: {
    points: number;
    tier: 1 | 2 | 3;
    island: IslandType;
  };
  boosts: string;
  image: string;
  disabled: boolean;
  power?: boolean;
};

export const BUMPKIN_SKILL_TREE: Record<BumpkinSkillName, BumpkinSkill> = {
  "Green Thumb": {
    name: "Green Thumb",
    tree: "Crops",
    requirements: {
      points: 1,
    },
    boosts: translate("description.green.thumb"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  Cultivator: {
    name: "Cultivator",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: "Green Thumb",
    },
    boosts: translate("description.cultivator"),
    image: SUNNYSIDE?.skills?.cultivator,
  },
  "Master Farmer": {
    name: "Master Farmer",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: "Cultivator",
    },
    boosts: translate("description.master.farmer"),
    image: SUNNYSIDE?.skills?.master_farmer,
  },
  "Golden Flowers": {
    name: "Golden Flowers",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: "Master Farmer",
    },
    boosts: translate("description.golden.flowers"),
    image: SUNNYSIDE?.skills?.golden_flowers,
  },
  "Plant Whisperer": {
    name: "Plant Whisperer",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: "Master Farmer",
    },
    boosts: translate("coming.soon"),
    image: CROP_LIFECYCLE.Radish.crop,
    disabled: true,
  },
  "Happy Crop": {
    name: "Happy Crop",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: "Master Farmer",
    },
    boosts: translate("description.happy.crop"),
    image: SUNNYSIDE?.skills?.happy_crop,
  },
  Lumberjack: {
    name: "Lumberjack",
    tree: "Trees",
    requirements: {
      points: 1,
    },
    boosts: translate("description.lumberjack"),
    image: SUNNYSIDE?.skills?.lumberjack_LE,
  },
  "Tree Hugger": {
    name: "Tree Hugger",
    tree: "Trees",
    requirements: {
      points: 2,
      skill: "Lumberjack",
    },
    boosts: translate("description.tree.hugger"),
    image: SUNNYSIDE?.skills?.tree_hugger,
  },
  "Tough Tree": {
    name: "Tough Tree",
    tree: "Trees",
    requirements: {
      points: 3,
      skill: "Tree Hugger",
    },
    boosts: translate("description.tough.tree"),
    image: SUNNYSIDE?.skills?.tough_tree,
  },
  "Money Tree": {
    name: "Money Tree",
    tree: "Trees",
    requirements: {
      points: 2,
      skill: "Tree Hugger",
    },
    boosts: translate("description.money.tree"),
    image: SUNNYSIDE?.skills?.money_tree,
  },
  Digger: {
    name: "Digger",
    tree: "Rocks",
    requirements: {
      points: 1,
    },
    boosts: translate("description.digger"),
    image: SUNNYSIDE?.skills?.digger,
  },
  "Coal Face": {
    name: "Coal Face",
    tree: "Rocks",
    requirements: {
      points: 2,
      skill: "Digger",
    },
    boosts: translate("description.coal.face"),
    image: SUNNYSIDE?.skills?.coal_face,
  },
  Seeker: {
    name: "Seeker",
    tree: "Rocks",
    requirements: {
      points: 3,
      skill: "Coal Face",
    },
    boosts: translate("description.seeker"),
    image: SUNNYSIDE?.skills?.seeker,
    disabled: true,
  },
  "Gold Rush": {
    name: "Gold Rush",
    tree: "Rocks",
    requirements: {
      points: 2,
      skill: "Coal Face",
    },
    boosts: translate("description.gold.rush"),
    image: SUNNYSIDE?.skills?.gold_rush_LE,
  },
  "Rush Hour": {
    name: "Rush Hour",
    tree: "Cooking",
    requirements: {
      points: 1,
    },
    boosts: translate("description.rush.hour"),
    image: SUNNYSIDE?.skills?.rush_hour,
  },
  "Kitchen Hand": {
    name: "Kitchen Hand",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: "Rush Hour",
    },
    boosts: translate("description.kitchen.hand"),
    image: SUNNYSIDE?.skills?.kitchen_hand,
  },
  "Michelin Stars": {
    name: "Michelin Stars",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: "Kitchen Hand",
    },
    boosts: translate("description.michelin.stars"),
    image: SUNNYSIDE?.skills?.michelin_stars,
  },
  Curer: {
    name: "Curer",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: "Michelin Stars",
    },
    boosts: translate("description.curer"),
    image: SUNNYSIDE?.skills?.curer,
  },
  "Stable Hand": {
    name: "Stable Hand",
    tree: "Animals",
    requirements: {
      points: 1,
    },
    boosts: translate("description.stable.hand"),
    image: SUNNYSIDE?.skills?.stable_hand,
  },
  "Free Range": {
    name: "Free Range",
    tree: "Animals",
    requirements: {
      points: 2,
      skill: "Stable Hand",
    },
    boosts: translate("description.free.range"),
    image: SUNNYSIDE?.skills?.free_range,
  },
  "Horse Whisperer": {
    name: "Horse Whisperer",
    tree: "Animals",
    requirements: {
      points: 2,
      skill: "Free Range",
    },
    boosts: translate("description.horse.whisperer"),
    image: SUNNYSIDE?.skills?.horse_whisperer,
  },
  Buckaroo: {
    name: "Buckaroo",
    tree: "Animals",
    requirements: {
      points: 2,
      skill: "Horse Whisperer",
    },
    boosts: translate("description.buckaroo"),
    image: SUNNYSIDE?.skills?.buckaroo,
  },
};

export const BUMPKIN_REVAMP_SKILL_TREE = {
  // Crops - Tier 1
  "Green Thumb": {
    name: "Green Thumb",
    tree: "Crops",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: translate("skill.greenThumb"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Young Farmer": {
    name: "Young Farmer",
    tree: "Crops",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: translate("skill.youngFarmer"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Experienced Farmer": {
    name: "Experienced Farmer",
    tree: "Crops",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: translate("skill.experiencedFarmer"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Betty's Friend": {
    name: "Betty's Friend",
    tree: "Crops",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: translate("skill.bettysFriend"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Old Farmer": {
    name: "Old Farmer",
    tree: "Crops",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: translate("skill.oldFarmer"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },

  // Crops - Tier 2
  "Strong Roots": {
    name: "Strong Roots",
    tree: "Crops",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: translate("skill.strongRoots"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Coin Swindler": {
    name: "Coin Swindler",
    tree: "Crops",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: translate("skill.coinSwindler"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Golden Sunflower": {
    name: "Golden Sunflower",
    tree: "Crops",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: translate("skill.goldenSunflower"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Chonky Scarecrow": {
    name: "Chonky Scarecrow",
    tree: "Crops",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: translate("skill.chonkyScarecrow"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Horror Mike": {
    name: "Horror Mike",
    tree: "Crops",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: translate("skill.horrorMike"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  // Crops - Tier 3
  "Instant Growth": {
    name: "Instant Growth",
    tree: "Crops",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: translate("skill.instantGrowth"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
    power: true,
  },
  "Acre Farm": {
    name: "Acre Farm",
    tree: "Crops",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: translate("skill.acreFarm"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Hectare Farm": {
    name: "Hectare Farm",
    tree: "Crops",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: translate("skill.hectareFarm"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Laurie's Gains": {
    name: "Laurie's Gains",
    tree: "Crops",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: translate("skill.lauriesGains"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },

  // Fruit - Tier 1
  "Fruitful Fumble": {
    name: "Fruitful Fumble",
    tree: "Fruit",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: "+0.1 Fruit Patch Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Fruity Heaven": {
    name: "Fruity Heaven",
    tree: "Fruit",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: "Fruit Patch seeds cost 10% less",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Fruity Profit": {
    name: "Fruity Profit",
    tree: "Fruit",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: "Tango coins deliveries revenue +50%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Loyal Macaw": {
    name: "Loyal Macaw",
    tree: "Fruit",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: "Macaw's effect doubled",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Fruit - Tier 2
  Catchup: {
    name: "Catchup",
    tree: "Fruit",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: "-10% patch fruit growth time",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "No Axe No Worries": {
    name: "No Axe No Worries",
    tree: "Fruit",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: "Chop fruit branches without axes, but get no wood drops",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Fruity Woody": {
    name: "Fruity Woody",
    tree: "Fruit",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: "Fruit plants drop +1 wood when chopped",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Pear Turbocharge": {
    name: "Pear Turbocharge",
    tree: "Fruit",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: "Double Immortal Pear's effect",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Crime Fruit": {
    name: "Crime Fruit",
    tree: "Fruit",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: "Increase Tomato and Lemon stock by 10",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Fruit - Tier 3
  "Generous Orchard": {
    name: "Generous Orchard",
    tree: "Fruit",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: "10% chance to get +1 patch fruit yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Long Pickings": {
    name: "Long Pickings",
    tree: "Fruit",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts:
      "Apple and Banana grow 2x faster, but Tomato, Lemon, Blueberry and Orange take 2x longer to grow",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Short Pickings": {
    name: "Short Pickings",
    tree: "Fruit",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts:
      "Blueberry and Orange grow 2x faster, but Tomato, Lemon, Apple and Banana take 2x longer to grow",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },

  // Trees - Tier 1
  "Lumberjack's Extra": {
    name: "Lumberjack's Extra",
    tree: "Trees",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "Trees drop +0.1 wood",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Tree Charge": {
    name: "Tree Charge",
    tree: "Trees",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "Trees grow 10% quicker",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "More Axes": {
    name: "More Axes",
    tree: "Trees",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "Increase stock of axes by 50",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Insta-Chop": {
    name: "Insta-Chop",
    tree: "Trees",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "1 Tap Trees",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  // Trees - Tier 2
  "Tough Tree": {
    name: "Tough Tree",
    tree: "Trees",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "1/10 chance of +3 wood yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Feller's Discount": {
    name: "Feller's Discount",
    tree: "Trees",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "Axes cost 20% less coins",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Money Tree": {
    name: "Money Tree",
    tree: "Trees",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "1% chance of finding 200 Coins when chopping trees",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  // Trees - Tier 3
  "Tree Turnaround": {
    name: "Tree Turnaround",
    tree: "Trees",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: "Insta Grow Chance (10%)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Tree Blitz": {
    name: "Tree Blitz",
    tree: "Trees",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: "Ability to make all trees instantly grow (1/24h)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
    power: true,
  },

  // Fishing - Tier 1
  "Fisherman's 2 Fold": {
    name: "Fisherman's 2 Fold",
    tree: "Fishing",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "+2 Fishing daily limit",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },

  "Fishy Chance": {
    name: "Fishy Chance",
    tree: "Fishing",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "10% chance of +1 basic fish",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Fishy Roll": {
    name: "Fishy Roll",
    tree: "Fishing",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "10% chance of +1 advanced fish",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Reel Deal": {
    name: "Reel Deal",
    tree: "Fishing",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "Rods cost 50% less coins",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Fishing - Tier 2
  "Fisherman's 5 Fold": {
    name: "Fisherman's 5 Fold",
    tree: "Fishing",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "+5 Fishing daily limit",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Fishy Fortune": {
    name: "Fishy Fortune",
    tree: "Fishing",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "Corale deliveries coin revenue increased by 50%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Big Catch": {
    name: "Big Catch",
    tree: "Fishing",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "Increase bar for catching game",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Fishy Gamble": {
    name: "Fishy Gamble",
    tree: "Fishing",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "10% chance of +1 expert fish",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Fishing - Tier 3
  "Frenzied Fish": {
    name: "Frenzied Fish",
    tree: "Fishing",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: "+1 fish and 50% chance of +1 fish during fish frenzy",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "More With Less": {
    name: "More With Less",
    tree: "Fishing",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: "+10 daily fishing limit but -1 worm from all composters",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Fishy Feast": {
    name: "Fishy Feast",
    tree: "Fishing",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: "+20% Fish XP",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },

  // Animals - Tier 1
  "Eggcellent Production": {
    name: "Eggcellent Production",
    tree: "Animals",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "+0.1 Egg Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Fowl Acceleration": {
    name: "Fowl Acceleration",
    tree: "Animals",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "Chickens lay eggs 10% quicker",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  // Animals - Tier 2
  "Bountiful Bales": {
    name: "Bountiful Bales",
    tree: "Animals",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "Hay Bale effect increased to +0.4",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Hay Tree": {
    name: "Hay Tree",
    tree: "Animals",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "Unlock 2nd Hay Bale",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  // Animals - Tier 3
  "Cozy Coop": {
    name: "Cozy Coop",
    tree: "Animals",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: "+5 Hen capacity per House",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Egg Rush": {
    name: "Egg Rush",
    tree: "Animals",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts:
      "Ability to instantly reduce egg laying time by 10hours to chickens currently laying eggs (1/96h)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
    power: true,
  },

  // Greenhouse - Tier 1
  "Olive Garden": {
    name: "Olive Garden",
    tree: "Greenhouse",
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: "+0.2 Olive Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Rice and Shine": {
    name: "Rice and Shine",
    tree: "Greenhouse",
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: "+0.2 Rice Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Grape Escape": {
    name: "Grape Escape",
    tree: "Greenhouse",
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: "+0.2 Grape Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Victoria's Secretary": {
    name: "Victoria's Secretary",
    tree: "Greenhouse",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: "Victoria's coin delivery revenue increased by 50%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Greenhouse - Tier 2
  "Olive Express": {
    name: "Olive Express",
    tree: "Greenhouse",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: "10% faster Olive growth",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Rice Rocket": {
    name: "Rice Rocket",
    tree: "Greenhouse",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: "10% faster Rice growth",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Vine Velocity": {
    name: "Vine Velocity",
    tree: "Greenhouse",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: "10% faster Grape growth",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  // Greenhouse - Tier 3
  "Greenhouse Guru": {
    name: "Greenhouse Guru",
    tree: "Greenhouse",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts:
      "Ability to make all Greenhouse crops currently growing ready to be harvested (1/96h)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
    power: true,
  },
  "Greenhouse Gamble": {
    name: "Greenhouse Gamble",
    tree: "Greenhouse",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: "5% Chances of +1 yield for Greenhouse crops/fruits",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Slick Saver": {
    name: "Slick Saver",
    tree: "Greenhouse",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: "Greenhouse plants need 1 less oil",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },

  // Mining - Tier 1
  "Rock'N'Roll": {
    name: "Rock'N'Roll",
    tree: "Mining",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "+0.1 Stone Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Iron Bumpkin": {
    name: "Iron Bumpkin",
    tree: "Mining",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "+0.1 Iron Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Speed Miner": {
    name: "Speed Miner",
    tree: "Mining",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "Stone recovers 20% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Tap Prospector": {
    name: "Tap Prospector",
    tree: "Mining",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "1 tap small mineral nodes",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Forge-Ward Profits": {
    name: "Forge-Ward Profits",
    tree: "Mining",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "+20% Blacksmith deliveries revenue",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  // Mining - Tier 2
  "Iron Hustle": {
    name: "Iron Hustle",
    tree: "Mining",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "Iron recovers 30% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Frugal Miner": {
    name: "Frugal Miner",
    tree: "Mining",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "Pickaxes cost 20% less Coins",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Rocky Favor": {
    name: "Rocky Favor",
    tree: "Mining",
    requirements: { points: 2, tier: 2, island: "basic" },
    boosts: "+1 Stone yield, -0.5 Iron yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Ferrous Favor": {
    name: "Ferrous Favor",
    tree: "Mining",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "+1 Iron yield, -0.5 Stone yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Midas Sprint": {
    name: "Midas Sprint",
    tree: "Mining",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "Gold Recovers 10% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  // Mining - Tier 3
  "Golden Touch": {
    name: "Golden Touch",
    tree: "Mining",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: "+0.5 Gold Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "More Picks": {
    name: "More Picks",
    tree: "Mining",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts:
      "Increase stock of pickaxe by 70, stone pickaxe by 20, iron pickaxe by 7",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Fire Kissed": {
    name: "Fire Kissed",
    tree: "Mining",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: "+1 Crimstone yield on 5th consecutive day",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Fireside Alchemist": {
    name: "Fireside Alchemist",
    tree: "Mining",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: "Crimstone recovers 15% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },

  // Cooking - Tier 1
  "Fast Feasts": {
    name: "Fast Feasts",
    tree: "Cooking",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "Meals from Firepit, Kitchen cook 10% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Nom Nom": {
    name: "Nom Nom",
    tree: "Cooking",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "+10% Food deliveries revenue",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Munching Mastery": {
    name: "Munching Mastery",
    tree: "Cooking",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "+5% Experience from eating meals",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Swift Sizzle": {
    name: "Swift Sizzle",
    tree: "Cooking",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "Firepit cooking speed with oil increased by 40%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  // Cooking - Tier 2
  "Frosted Cakes": {
    name: "Frosted Cakes",
    tree: "Cooking",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "Cakes cook 10% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Juicy Boost": {
    name: "Juicy Boost",
    tree: "Cooking",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "+10% experience from drinking smoothies",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Double Nom": {
    name: "Double Nom",
    tree: "Cooking",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "+1 food but requires 2x the ingredients",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Turbo Fry": {
    name: "Turbo Fry",
    tree: "Cooking",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "Kitchen cooking speed with oil increased by 50%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  // Cooking - Tier 3
  "Instant Gratification": {
    name: "Instant Gratification",
    tree: "Cooking",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts:
      "Ability make all meals currently cooking ready to be eaten (1/96h)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
    power: true,
  },
  "Drive-Through Deli": {
    name: "Drive-Through Deli",
    tree: "Cooking",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: "Eating meals from Deli adds +15% experience",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Fiery Jackpot": {
    name: "Fiery Jackpot",
    tree: "Cooking",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: "+20% Chance of +1 food from Firepit",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Fry Frenzy": {
    name: "Fry Frenzy",
    tree: "Cooking",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: "Deli cooking speed with oil increased by 60%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },

  // Bees & Flowers - Tier 1
  "Sweet Bonus": {
    name: "Sweet Bonus",
    tree: "Bees & Flowers",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: "+0.1 Honey on claim",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Hyper Bees": {
    name: "Hyper Bees",
    tree: "Bees & Flowers",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: "+0.1 Honey production speed",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Blooming Boost": {
    name: "Blooming Boost",
    tree: "Bees & Flowers",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: "Flowers grow 10% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Flower Sale": {
    name: "Flower Sale",
    tree: "Bees & Flowers",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: "Flowers Seeds cost 20% less coins",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Bees & Flowers - Tier 2
  "Buzzworthy Treats": {
    name: "Buzzworthy Treats",
    tree: "Bees & Flowers",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: "+10% Experience on food made with Honey",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Blossom Bonding": {
    name: "Blossom Bonding",
    tree: "Bees & Flowers",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: "Increased gifting effect of flowers, +2 relationship",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Pollen Power Up": {
    name: "Pollen Power Up",
    tree: "Bees & Flowers",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: "Pollination effect increases to +0.3 yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Petalled Perk": {
    name: "Petalled Perk",
    tree: "Bees & Flowers",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: "10% chance of +1 Flower",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  // Bees & Flowers - Tier 3
  "Bee Collective": {
    name: "Bee Collective",
    tree: "Bees & Flowers",
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: "Increased Bee Swarm chance by 20%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Flower Power": {
    name: "Flower Power",
    tree: "Bees & Flowers",
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: "Flowers grow 20% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Flowery Abode": {
    name: "Flowery Abode",
    tree: "Bees & Flowers",
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts:
      "Honey speed increased by +0.5 but flower growth time increased by 50%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Petal Blessed": {
    name: "Petal Blessed",
    tree: "Bees & Flowers",
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    disabled: false,
    boosts:
      "[Action] Ability to make all flowers currently growing ready to be harvested (Cooldown: 96 hours)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },

  // Machinery - Tier 1
  "Crop Processor Unit": {
    name: "Crop Processor Unit",
    tree: "Machinery",
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: "Crop Machine grow time reduced by 5% but consumes 10% more oil",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Oil Gadget": {
    name: "Oil Gadget",
    tree: "Machinery",
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: "Machine uses 10% less oil",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Oil Extraction": {
    name: "Oil Extraction",
    tree: "Machinery",
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: "+1 Oil when collecting from reserves",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Leak-Proof Tank": {
    name: "Leak-Proof Tank",
    tree: "Machinery",
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: "Triple oil tank capacity",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  // Machinery - Tier 2
  "Crop Extension Module": {
    name: "Crop Extension Module",
    tree: "Machinery",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: "Add Carrot and Cabbage seeds to machine",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Rapid Rig": {
    name: "Rapid Rig",
    tree: "Machinery",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: "Crops grow 20% faster but consumes 40% more oil",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Oil Be Back": {
    name: "Oil Be Back",
    tree: "Machinery",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: "Oil refill time reduced by 20%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  // Machinery - Tier 3
  "Field Expansion Module": {
    name: "Field Expansion Module",
    tree: "Machinery",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: "+5 packs added to machine",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Field Extension Module": {
    name: "Field Extension Module",
    tree: "Machinery",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: "+5 plots added to machine",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Efficiency Extension Module": {
    name: "Efficiency Extension Module",
    tree: "Machinery",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: "Machine uses 30% less oil",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Grease Lightning": {
    name: "Grease Lightning",
    tree: "Machinery",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: "Ability to make empty oil wells instantly refill (1/96h)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
    power: true,
  },

  // Compost - Tier 1
  "Efficient Bin": {
    name: "Efficient Bin",
    tree: "Compost",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: translate("skill.efficientBin"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Turbo Charged": {
    name: "Turbo Charged",
    tree: "Compost",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: translate("skill.turboCharged"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Wormy Treat": {
    name: "Wormy Treat",
    tree: "Compost",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: "+1 Worm from composting",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Feathery Business": {
    name: "Feathery Business",
    tree: "Compost",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts:
      "Use feathers to speed up composters instead of eggs but requires 2x feathers to boost",
    image: SUNNYSIDE.skills.green_thumb_LE,
    disabled: false,
  },
  // Compost - Tier 2
  "Premium Worms": {
    name: "Premium Worms",
    tree: "Compost",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: translate("skill.premiumWorms"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Swift Decomposer": {
    name: "Swift Decomposer",
    tree: "Compost",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: "-10% compost time",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Composting Bonanza": {
    name: "Composting Bonanza",
    tree: "Compost",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts:
      "Additional 1 hour reduction in composting time but double resources when boosting composters",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  // Compost - Tier 3
  "Composting Overhaul": {
    name: "Composting Overhaul",
    tree: "Compost",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: "+2 worms but -5 fertilisers from all composters",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Composting Revamp": {
    name: "Composting Revamp",
    tree: "Compost",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: "+5 fertilisers but -3 worms from all composters",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
} satisfies Record<string, BumpkinSkillRevamp>;

export type BumpkinRevampSkillName = keyof typeof BUMPKIN_REVAMP_SKILL_TREE;

export const SKILL_TREE_CATEGORIES = Array.from(
  new Set(
    getKeys(BUMPKIN_SKILL_TREE).map((skill) => BUMPKIN_SKILL_TREE[skill].tree),
  ),
);

export const getRevampSkillTreeCategoriesByIsland = (
  islandType: IslandType,
) => {
  const skillTreeCategoriesByIsland = Array.from(
    new Set(
      getKeys(BUMPKIN_REVAMP_SKILL_TREE)
        .filter(
          (skill) =>
            BUMPKIN_REVAMP_SKILL_TREE[skill].requirements.island === islandType,
        )
        .map((skill) => BUMPKIN_REVAMP_SKILL_TREE[skill].tree),
    ),
  );
  return skillTreeCategoriesByIsland;
};

export const getSkills = (treeName: BumpkinSkillTree) => {
  return Object.values(BUMPKIN_SKILL_TREE).filter(
    (skill) => skill.tree === treeName,
  );
};

export const getRevampSkills = (treeName: BumpkinRevampSkillTree) => {
  return Object.values(BUMPKIN_REVAMP_SKILL_TREE).filter(
    (skill) => skill.tree === treeName,
  );
};

export const createSkillPath = (skills: BumpkinSkill[]) => {
  const startingSkill = skills.find((item) => !item.requirements.skill);
  const path = [[startingSkill?.name as BumpkinSkillName]];

  const remainingLevels = new Set(
    skills.map((item) => item.requirements.skill),
  );

  for (let index = 0; index < remainingLevels.size - 1; index++) {
    const lastSkillLevelName = path[path.length - 1][0];

    const skillsInCurrentLevel: BumpkinSkillName[] = skills
      .filter((item) => item.requirements.skill === lastSkillLevelName)
      .map((item) => item.name);

    path.push(skillsInCurrentLevel);
  }

  return path;
};

export const createRevampSkillPath = (skills: BumpkinSkillRevamp[]) => {
  const skillsByTier: { [key: number]: BumpkinSkillRevamp[] } = {};

  skills.forEach((skill) => {
    const { requirements } = skill;
    if (!skillsByTier[requirements.tier]) {
      skillsByTier[requirements.tier] = [];
    }

    skillsByTier[requirements.tier].push(skill);
  });

  return skillsByTier;
};
