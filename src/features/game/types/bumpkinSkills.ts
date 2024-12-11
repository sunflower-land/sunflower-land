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
    cooldown?: number;
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
      cooldown: 1000 * 60 * 60 * 72,
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
    boosts: translate("skill.fruitfulFumble"),
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
    boosts: translate("skill.fruityHeaven"),
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
    boosts: translate("skill.fruityProfit"),
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
    boosts: translate("skill.loyalMacaw"),
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
    boosts: translate("skill.catchup"),
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
    boosts: translate("skill.noAxeNoWorries"),
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
    boosts: translate("skill.fruityWoody"),
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
    boosts: translate("skill.pearTurbocharge"),
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
    boosts: translate("skill.crimeFruit"),
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
    boosts: translate("skill.generousOrchard"),
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
    boosts: translate("skill.longPickings"),
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
    boosts: translate("skill.shortPickings"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Zesty Vibes": {
    name: "Zesty Vibes",
    tree: "Fruit",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: translate("skill.zestyVibes"),
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
    boosts: translate("skill.lumberjacksExtra"),
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
    boosts: translate("skill.treeCharge"),
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
    boosts: translate("skill.moreAxes"),
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
    boosts: translate("skill.instaChop"),
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
    boosts: translate("skill.toughTree"),
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
    boosts: translate("skill.fellersDiscount"),
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
    boosts: translate("skill.moneyTree"),
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
    boosts: translate("skill.treeTurnaround"),
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
      cooldown: 1000 * 60 * 60 * 24,
    },
    boosts: translate("skill.treeBlitz"),
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
    boosts: translate("skill.fishermansTwoFold"),
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
    boosts: translate("skill.fishyChance"),
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
    boosts: translate("skill.fishyRoll"),
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
    boosts: translate("skill.reelDeal"),
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
    boosts: translate("skill.fishermansFiveFold"),
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
    boosts: translate("skill.fishyFortune"),
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
    boosts: translate("skill.bigCatch"),
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
    boosts: translate("skill.fishyGamble"),
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
    boosts: translate("skill.frenziedFish"),
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
    boosts: translate("skill.moreWithLess"),
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
    boosts: translate("skill.fishyFeast"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },

  // Animals - Tier 1
  "Abundant Harvest": {
    name: "Abundant Harvest",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: translate("skill.abundantHarvest"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Efficient Feeding": {
    name: "Efficient Feeding",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: translate("skill.efficientFeeding"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Restless Animals": {
    name: "Restless Animals",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: translate("skill.restlessAnimals"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Double Bale": {
    name: "Double Bale",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: translate("skill.doubleBale"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Animals - Tier 2
  "Fine Fibers": {
    name: "Fine Fibers",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: translate("skill.fineFibers"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Bountiful Bounties": {
    name: "Bountiful Bounties",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: translate("skill.bountifulBounties"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Heartwarming Instruments": {
    name: "Heartwarming Instruments",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: translate("skill.heartwarmingInstruments"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Kale Mix": {
    name: "Kale Mix",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: translate("skill.kaleMix"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Alternate Medicine": {
    tree: "Animals",
    name: "Alternate Medicine",
    disabled: true,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: translate("skill.alternateMedicine"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Animals - Tier 3
  "Healthy Livestock": {
    name: "Healthy Livestock",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: translate("skill.healthyLivestock"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Clucky Grazing": {
    name: "Clucky Grazing",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: translate("skill.cluckyGrazing"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Sheepwise Diet": {
    name: "Sheepwise Diet",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: translate("skill.sheepwiseDiet"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Cow-Smart Nutrition": {
    name: "Cow-Smart Nutrition",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: translate("skill.cowSmartNutrition"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
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
    boosts: translate("skill.oliveGarden"),
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
    boosts: translate("skill.riceAndShine"),
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
    boosts: translate("skill.grapeEscape"),
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
    boosts: translate("skill.victoriasSecretary"),
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
    boosts: translate("skill.oliveExpress"),
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
    boosts: translate("skill.riceRocket"),
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
    boosts: translate("skill.vineVelocity"),
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
      cooldown: 96 * 60 * 60 * 1000,
    },
    boosts: translate("skill.greenhouseGuru"),
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
    boosts: translate("skill.greenhouseGamble"),
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
    boosts: translate("skill.slickSaver"),
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
    boosts: translate("skill.ironBumpkin"),
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
    boosts: translate("skill.speedMiner"),
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
    boosts: translate("skill.tapProspector"),
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
    boosts: translate("skill.forgeWardProfits"),
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
    boosts: translate("skill.ironHustle"),
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
    boosts: translate("skill.frugalMiner"),
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    disabled: false,
  },
  "Rocky Favor": {
    name: "Rocky Favor",
    tree: "Mining",
    requirements: { points: 2, tier: 2, island: "basic" },
    boosts: translate("skill.rockyFavor"),
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
    boosts: translate("skill.ferrousFavor"),
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
    boosts: translate("skill.midasSprint"),
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
    boosts: translate("skill.goldenTouch"),
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
    boosts: translate("skill.morePicks"),
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
    boosts: translate("skill.fireKissed"),
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
    boosts: translate("skill.firesideAlchemist"),
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
    boosts: translate("skill.fastFeasts"),
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
    boosts: translate("skill.nomNom"),
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
    boosts: translate("skill.munchingMastery"),
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
    boosts: translate("skill.swiftSizzle"),
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
    boosts: translate("skill.frostedCakes"),
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
    boosts: translate("skill.juicyBoost"),
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
    boosts: translate("skill.doubleNom"),
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
    boosts: translate("skill.turboFry"),
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
      cooldown: 1000 * 60 * 60 * 96, // 96 hours
    },
    boosts: translate("skill.instantGratification"),
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
    boosts: translate("skill.driveThroughDeli"),
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
    boosts: translate("skill.fieryJackpot"),
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
    boosts: translate("skill.fryFrenzy"),
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
    boosts: translate("skill.sweetBonus"),
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
    boosts: translate("skill.hyperBees"),
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
    boosts: translate("skill.bloomingBoost"),
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
    boosts: translate("skill.flowerSale"),
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
    boosts: translate("skill.buzzworthyTreats"),
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
    boosts: translate("skill.blossomBonding"),
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
    boosts: translate("skill.pollenPowerUp"),
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
    boosts: translate("skill.petalledPerk"),
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
    boosts: translate("skill.beeCollective"),
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
    boosts: translate("skill.flowerPower"),
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
    boosts: translate("skill.floweryAbode"),
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
      cooldown: 1000 * 60 * 60 * 96, // 96 hours
    },
    disabled: false,
    power: true,
    boosts: translate("skill.petalBlessed"),
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
    boosts: translate("skill.cropProcessorUnit"),
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
    boosts: translate("skill.oilGadget"),
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
    boosts: translate("skill.oilExtraction"),
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
    boosts: translate("skill.leakProofTank"),
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
    boosts: translate("skill.cropExtensionModule"),
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
    boosts: translate("skill.rapidRig"),
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
    boosts: translate("skill.oilBeBack"),
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
    boosts: translate("skill.fieldExpansionModule"),
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
    boosts: translate("skill.fieldExtensionModule"),
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
    boosts: translate("skill.efficiencyExtensionModule"),
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
      cooldown: 1000 * 60 * 60 * 96, // 96 hours
    },
    boosts: translate("skill.greaseLightning"),
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
    boosts: translate("skill.wormyTreat"),
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
    boosts: translate("skill.featheryBusiness"),
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
    boosts: translate("skill.swiftDecomposer"),
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
    boosts: translate("skill.compostingBonanza"),
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
    boosts: translate("skill.compostingOverhaul"),
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
    boosts: translate("skill.compostingRevamp"),
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

export const getPowerSkills = () =>
  Object.values(BUMPKIN_REVAMP_SKILL_TREE).filter(
    (skill: BumpkinSkillRevamp) => skill.power,
  );
