import { getKeys } from "./craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { PLOT_CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { translate } from "lib/i18n/translate";

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

export type BumpkinRevampSkillName =
  // Crops
  | "Green Thumb 2"
  | "Young Farmer"
  | "Experienced Farmer"
  | "Betty's Friend"
  | "Efficient Bin"
  | "Turbo Charged"
  | "Old Farmer"
  | "Strong Roots"
  | "Coin Swindler"
  | "Golden Sunflower"
  | "Chonky Scarecrow"
  | "Horror Mike"
  | "Instant Growth"
  | "Acre Farm"
  | "Hectare Farm"
  | "Premium Worms"
  | "Laurie's Gains"
  // Fruit
  | "Red Sour"
  | "Fruitful Fumble"
  | "Tropical Orchard"
  | "Catchup"
  | "Fruit Turbocharge"
  | "Prime Produce"
  | "Fruity Profit"
  | "Fruity Rush Hour"
  // Trees
  | "Lumberjack's Extra"
  | "Tree Charge"
  | "More Axes"
  | "Insta-Chop"
  | "Fruity Woody"
  | "Tough Tree"
  | "Feller's Discount"
  | "Money Tree"
  | "Tree Turnaround"
  | "Tree Blitz"
  // Fishing
  | "Swift Decomposer"
  | "Fisherman's 5 Fold"
  | "Wormy Treat"
  | "Fishy Chance"
  | "Grubby Treat"
  | "Wriggly Treat"
  | "Fishy Fortune"
  | "Big Catch"
  | "Composting Bonanza"
  | "Frenzied Fish"
  | "Composting Overhaul"
  | "More With Less"
  // Animals
  | "Eggcellent Production"
  | "Fowl Acceleration"
  | "Bountiful Bales"
  | "Hay Tree"
  | "Cozy Coop"
  | "Egg Rush"
  // Greenhouse
  | "Olive Garden"
  | "Rice and Shine"
  | "Grape Escape"
  | "Olive Express"
  | "Rice Rocket"
  | "Vine Velocity"
  | "Greenhouse Guru"
  | "Greenhouse Gamble"
  | "Slick Saver"
  // Mining
  | "Rock'N'Roll"
  | "Iron Bumpkin"
  | "Speed Miner"
  | "Iron Hustle"
  | "Tap Prospector"
  | "Forge-Ward Profits"
  | "Frugal Miner"
  | "Fireside Alchemist"
  | "Ferrous Favor"
  | "Golden Touch"
  | "Midas Sprint"
  | "More Picks"
  | "Fire Kissed"
  // Cooking
  | "Fast Feasts"
  | "Nom Nom"
  | "Munching Mastery"
  | "Swift Sizzle"
  | "Frosted Cakes"
  | "Juicy Boost"
  | "Double Nom"
  | "Turbo Fry"
  | "Instant Gratification"
  | "Drive-Through Deli"
  | "Fiery Jackpot"
  | "Fry Frenzy"
  // Bees & Flowers
  | "Sweet Bonus"
  | "Hyper Bees"
  | "Blooming Boost"
  | "Buzzworthy Treats"
  | "Blossom Bonding"
  | "Pollen Power Up"
  | "Bee Collective"
  | "Flower Power"
  | "Petalled Perk"
  | "Flowery Abode"
  // Machinery
  | "Crop Processor Unit"
  | "Oil Gadget"
  | "Oil Extraction"
  | "Crop Extension Module"
  | "Rapid Rig"
  | "Oil Be Back"
  | "Field Extension Module"
  | "Efficiency Extension Module"
  | "Grease Lightning";

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
  | "Machinery";

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
  name: BumpkinRevampSkillName;
  tree: BumpkinRevampSkillTree;
  requirements: {
    points: number;
    skill: number; // Number of skills required to unlock this skill (0 means it's a tier 1 skill)
  };
  boosts: string;
  image: string;
  disabled?: boolean;
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
    image: PLOT_CROP_LIFECYCLE.Radish.crop,
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

export const BUMPKIN_REVAMP_SKILL_TREE: Record<
  BumpkinRevampSkillName,
  BumpkinSkillRevamp
> = {
  // Crops - Tier 1
  "Green Thumb 2": {
    name: "Green Thumb 2",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "5% reduced crop growth duration",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Young Farmer": {
    name: "Young Farmer",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+0.1 Basic Crop Yield (Sunflowers, Potatoes, Pumpkins)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Experienced Farmer": {
    name: "Experienced Farmer",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts:
      "+0.1 Medium Crop Yield (Carrots, Cabbages, Soybeans, Beetroots, Cauliflowers, Parsnips)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Betty's Friend": {
    name: "Betty's Friend",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "Betty Coin delivery revenue increased by 30%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Efficient Bin": {
    name: "Efficient Bin",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+3 Sprout Mix when collecting from Compost Bin",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Turbo Charged": {
    name: "Turbo Charged",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+5 Fruitful Blend when collecting from Turbo Composter",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Old Farmer": {
    name: "Old Farmer",
    tree: "Crops",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+0.1 Advanded Crop Yield (Eggplants, Corn, Radish, Wheat, Kale)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Crops - Tier 2
  "Strong Roots": {
    name: "Strong Roots",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Radish, Wheat, Kale grow 10% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Coin Swindler": {
    name: "Coin Swindler",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "+10% coins to base value of plot crops in Betty's Market",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Golden Sunflower": {
    name: "Golden Sunflower",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts:
      "Chance of getting +0.35 gold when manually harvesting sunflowers (0.15%)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Chonky Scarecrow": {
    name: "Chonky Scarecrow",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Basic Scarecrow AOE increase size to 7x7",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Horror Mike": {
    name: "Horror Mike",
    tree: "Crops",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Scary Mike AOE increase size to 7x7",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Crops - Tier 3
  "Instant Growth": {
    name: "Instant Growth",
    tree: "Crops",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts:
      "Ability to make all crops currently growing ready to be harvested (1/72h)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    power: true,
  },
  "Acre Farm": {
    name: "Acre Farm",
    tree: "Crops",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "+1 Advanced crop yeild, -0.5 Basic and Medium crop yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Hectare Farm": {
    name: "Hectare Farm",
    tree: "Crops",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "+1 Basic and Medium crop yield, -0.5 Advanced crop yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Premium Worms": {
    name: "Premium Worms",
    tree: "Crops",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "+10 Rapid Root when collecting from Premium Composter",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Laurie's Gains": {
    name: "Laurie's Gains",
    tree: "Crops",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "Laurie Crow AOE increase size to 7x7",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },

  // Fruit - Tier 1
  "Red Sour": {
    name: "Red Sour",
    tree: "Fruit",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+0.1 Fruit Yield (Tomatoes, Lemons)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Fruitful Fumble": {
    name: "Fruitful Fumble",
    tree: "Fruit",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+0.1 Basic Fruit Yield (Blueberries, Oranges)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Tropical Orchard": {
    name: "Tropical Orchard",
    tree: "Fruit",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+0.1 Advanced Fruit Yield (Apples, Bananas)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Fruit - Tier 2
  Catchup: {
    name: "Catchup",
    tree: "Fruit",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Tomatoes & Lemons grows 10% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Fruit Turbocharge": {
    name: "Fruit Turbocharge",
    tree: "Fruit",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Basic Fruit grows 10% faster (Blueberries, Oranges)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Prime Produce": {
    name: "Prime Produce",
    tree: "Fruit",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Advanced Fruit grows 10% faster (Apples, Bananas)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Fruit - Tier 3
  "Fruity Profit": {
    name: "Fruity Profit",
    tree: "Fruit",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "Tango Coin delivery revenue +50%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Fruity Rush Hour": {
    name: "Fruity Rush Hour",
    tree: "Fruit",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts:
      "Ability to make all fruit currently growing ready to be harvested (1/72h)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    power: true,
  },

  // Trees - Tier 1
  "Lumberjack's Extra": {
    name: "Lumberjack's Extra",
    tree: "Trees",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "Trees drop +0.1 wood",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Tree Charge": {
    name: "Tree Charge",
    tree: "Trees",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "Trees grow 10% quicker",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "More Axes": {
    name: "More Axes",
    tree: "Trees",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "Increased axe quantites per BB (?%)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Insta-Chop": {
    name: "Insta-Chop",
    tree: "Trees",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "1 Tap Tree Chop",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Trees - Tier 2
  "Fruity Woody": {
    name: "Fruity Woody",
    tree: "Trees",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Fruit Trees and Bushes drop +1 wood when chopped",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Tough Tree": {
    name: "Tough Tree",
    tree: "Trees",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "1/10 chance of +3 wood yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Feller's Discount": {
    name: "Feller's Discount",
    tree: "Trees",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Axes cost 10% less coins",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Money Tree": {
    name: "Money Tree",
    tree: "Trees",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "1% chance of finding 200 Coins when chopping trees",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Trees - Tier 3
  "Tree Turnaround": {
    name: "Tree Turnaround",
    tree: "Trees",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "Insta Grow Chance (10%)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Tree Blitz": {
    name: "Tree Blitz",
    tree: "Trees",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "Ability to make all trees instantly grow (1/24h)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    power: true,
  },

  // Fishing - Tier 1
  "Swift Decomposer": {
    name: "Swift Decomposer",
    tree: "Fishing",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "Composter speed 10% quicker",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Fisherman's 5 Fold": {
    name: "Fisherman's 5 Fold",
    tree: "Fishing",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+5 Fishing daily limit",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Wormy Treat": {
    name: "Wormy Treat",
    tree: "Fishing",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+1 EarthWorm bait from composting",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Fishy Chance": {
    name: "Fishy Chance",
    tree: "Fishing",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "10% chance of +1 fish when fishing",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Fishing - Tier 2
  "Grubby Treat": {
    name: "Grubby Treat",
    tree: "Fishing",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "+1 Grub bait from composting",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Wriggly Treat": {
    name: "Wriggly Treat",
    tree: "Fishing",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "+1 Red Wriggler bait from composting",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Fishy Fortune": {
    name: "Fishy Fortune",
    tree: "Fishing",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "+50% Fish deliveries SFL profit",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Big Catch": {
    name: "Big Catch",
    tree: "Fishing",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Increase bar for catching game",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Fishing - Tier 3
  "Composting Bonanza": {
    name: "Composting Bonanza",
    tree: "Fishing",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "+1 Bait from all composters",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Frenzied Fish": {
    name: "Frenzied Fish",
    tree: "Fishing",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "+1 Yield furing fish frenzy",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Composting Overhaul": {
    name: "Composting Overhaul",
    tree: "Fishing",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts:
      "+2 Baits from all composters but reduced fertiliser drop (-5 Sprout Mixes, -5 Rapid Growth, -1 Fruit Blend)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "More With Less": {
    name: "More With Less",
    tree: "Fishing",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "+10 daily fishing limit but -1 bait from all composters",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },

  // Animals - Tier 1
  "Eggcellent Production": {
    name: "Eggcellent Production",
    tree: "Animals",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+0.1 Egg Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Fowl Acceleration": {
    name: "Fowl Acceleration",
    tree: "Animals",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "Chickens lay eggs 10% quicker",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Animals - Tier 2
  "Bountiful Bales": {
    name: "Bountiful Bales",
    tree: "Animals",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Hay Bale effect increased to +0.4",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Hay Tree": {
    name: "Hay Tree",
    tree: "Animals",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Unlock 2nd Hay Bale",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Animals - Tier 3
  "Cozy Coop": {
    name: "Cozy Coop",
    tree: "Animals",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "+5 Hen capacity per House",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Egg Rush": {
    name: "Egg Rush",
    tree: "Animals",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts:
      "Ability to instantly reduce egg laying time by 10hours to chickens currently laying eggs (1/96h)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    power: true,
  },

  // Greenhouse - Tier 1
  "Olive Garden": {
    name: "Olive Garden",
    tree: "Greenhouse",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+0.2 Olive Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Rice and Shine": {
    name: "Rice and Shine",
    tree: "Greenhouse",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+0.2 Rice Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Grape Escape": {
    name: "Grape Escape",
    tree: "Greenhouse",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+0.2 Grape Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Greenhouse - Tier 2
  "Olive Express": {
    name: "Olive Express",
    tree: "Greenhouse",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "20% faster Olive growth",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Rice Rocket": {
    name: "Rice Rocket",
    tree: "Greenhouse",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "20% faster Rice growth",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Vine Velocity": {
    name: "Vine Velocity",
    tree: "Greenhouse",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "20% faster Grape growth",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Greenhouse - Tier 3
  "Greenhouse Guru": {
    name: "Greenhouse Guru",
    tree: "Greenhouse",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts:
      "Ability to make all Greenhouse crops currently growing ready to be harvested (1/96h)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    power: true,
  },
  "Greenhouse Gamble": {
    name: "Greenhouse Gamble",
    tree: "Greenhouse",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "5% Chances of +1 yield for Greenhouse crops/fruits",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Slick Saver": {
    name: "Slick Saver",
    tree: "Greenhouse",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "Greenhouse plants need 1 less oil",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },

  // Mining - Tier 1
  "Rock'N'Roll": {
    name: "Rock'N'Roll",
    tree: "Mining",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+0.1 Stone Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Iron Bumpkin": {
    name: "Iron Bumpkin",
    tree: "Mining",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+0.1 Iron Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Speed Miner": {
    name: "Speed Miner",
    tree: "Mining",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "Stone recovers 10% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Iron Hustle": {
    name: "Iron Hustle",
    tree: "Mining",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "Iron recovers 10% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Tap Prospector": {
    name: "Tap Prospector",
    tree: "Mining",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "1 tap small mineral nodes",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Mining - Tier 2
  "Forge-Ward Profits": {
    name: "Forge-Ward Profits",
    tree: "Mining",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "+20% Blacksmith deliveries revenue",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Frugal Miner": {
    name: "Frugal Miner",
    tree: "Mining",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Pickaxes cost 20% less Coins",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Fireside Alchemist": {
    name: "Fireside Alchemist",
    tree: "Mining",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Crimstone recovers 5% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Ferrous Favor": {
    name: "Ferrous Favor",
    tree: "Mining",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "+1 Iron yield, -0.5 Stone yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Mining - Tier 3
  "Golden Touch": {
    name: "Golden Touch",
    tree: "Mining",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "+0.5 Gold Yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Midas Sprint": {
    name: "Midas Sprint",
    tree: "Mining",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "Gold Recovers 10% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "More Picks": {
    name: "More Picks",
    tree: "Mining",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts:
      "Increase stock of pickaxe by 70, stone pickaxe by 20, iron pickaxe by 7",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Fire Kissed": {
    name: "Fire Kissed",
    tree: "Mining",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "+1 Crimstone yield on 5th consecutive day",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },

  // Cooking - Tier 1
  "Fast Feasts": {
    name: "Fast Feasts",
    tree: "Cooking",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "Meals from Firepit, Kitchen cook 10% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Nom Nom": {
    name: "Nom Nom",
    tree: "Cooking",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+5% Food deliveries revenue",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Munching Mastery": {
    name: "Munching Mastery",
    tree: "Cooking",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+5% Experience from eating meals",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Swift Sizzle": {
    name: "Swift Sizzle",
    tree: "Cooking",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "Firepit cooking speed with oil increased by 40%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Cooking - Tier 2
  "Frosted Cakes": {
    name: "Frosted Cakes",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Cakes cook 10% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Juicy Boost": {
    name: "Juicy Boost",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "+10% experience from drinking juices",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Double Nom": {
    name: "Double Nom",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts:
      "x1.5% more experience from eating food but requires 2x the ingredients",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Turbo Fry": {
    name: "Turbo Fry",
    tree: "Cooking",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Kitchen cooking speed with oil increased by 50%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Cooking - Tier 3
  "Instant Gratification": {
    name: "Instant Gratification",
    tree: "Cooking",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts:
      "Ability make all meals currently cooking ready to be eaten (1/72h)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    power: true,
  },
  "Drive-Through Deli": {
    name: "Drive-Through Deli",
    tree: "Cooking",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "Eating meals from Deli adds +15% experience",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Fiery Jackpot": {
    name: "Fiery Jackpot",
    tree: "Cooking",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "+20% Chance of +1 food from Firepit",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Fry Frenzy": {
    name: "Fry Frenzy",
    tree: "Cooking",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "Deli cooking speed with oil increased by 60%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },

  // Bees & Flowers - Tier 1
  "Sweet Bonus": {
    name: "Sweet Bonus",
    tree: "Bees & Flowers",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+10% Honey on claim",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Hyper Bees": {
    name: "Hyper Bees",
    tree: "Bees & Flowers",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+0.1 Honey production speed",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Blooming Boost": {
    name: "Blooming Boost",
    tree: "Bees & Flowers",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "Flowers grow 10% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Bees & Flowers - Tier 2
  "Buzzworthy Treats": {
    name: "Buzzworthy Treats",
    tree: "Bees & Flowers",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "+10% Experience on food made with Honey",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Blossom Bonding": {
    name: "Blossom Bonding",
    tree: "Bees & Flowers",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Increased gifting effect of flowers, +2 relationship",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Pollen Power Up": {
    name: "Pollen Power Up",
    tree: "Bees & Flowers",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Pollination effect increases to +0.3 yield",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Bees & Flowers - Tier 3
  "Bee Collective": {
    name: "Bee Collective",
    tree: "Bees & Flowers",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "Increased Bee Swarm chance by 20%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Flower Power": {
    name: "Flower Power",
    tree: "Bees & Flowers",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "Flowers grow 20% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Petalled Perk": {
    name: "Petalled Perk",
    tree: "Bees & Flowers",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "10% chance of +1 Flower",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Flowery Abode": {
    name: "Flowery Abode",
    tree: "Bees & Flowers",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "Honey speed increased by +0.5 but yield reduced by -0.5",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },

  // Machinery - Tier 1
  "Crop Processor Unit": {
    name: "Crop Processor Unit",
    tree: "Machinery",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "Crop grow 10% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Oil Gadget": {
    name: "Oil Gadget",
    tree: "Machinery",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "Machine uses 10% less oil",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Oil Extraction": {
    name: "Oil Extraction",
    tree: "Machinery",
    requirements: {
      points: 1,
      skill: 0,
    },
    boosts: "+1 Oil",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Machinery - Tier 2
  "Crop Extension Module": {
    name: "Crop Extension Module",
    tree: "Machinery",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Add Carrot and Cabbage seeds to machine",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Rapid Rig": {
    name: "Rapid Rig",
    tree: "Machinery",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Crops grow 20% faster",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Oil Be Back": {
    name: "Oil Be Back",
    tree: "Machinery",
    requirements: {
      points: 2,
      skill: 2,
    },
    boosts: "Oil refill time reduced by 20%",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  // Machinery - Tier 3
  "Field Extension Module": {
    name: "Field Extension Module",
    tree: "Machinery",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "+5 plots added to machine",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Efficiency Extension Module": {
    name: "Efficiency Extension Module",
    tree: "Machinery",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "Machine uses 15% less oil",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
  },
  "Grease Lightning": {
    name: "Grease Lightning",
    tree: "Machinery",
    requirements: {
      points: 3,
      skill: 5,
    },
    boosts: "Ability to make empty oil wells instantly refill (1/96h)",
    image: SUNNYSIDE?.skills?.green_thumb_LE,
    power: true,
  },
};

export const SKILL_TREE_CATEGORIES = Array.from(
  new Set(
    getKeys(BUMPKIN_SKILL_TREE).map((skill) => BUMPKIN_SKILL_TREE[skill].tree),
  ),
);

export const REVAMP_SKILL_TREE_CATEGORIES = Array.from(
  new Set(
    getKeys(BUMPKIN_REVAMP_SKILL_TREE).map(
      (skill) => BUMPKIN_REVAMP_SKILL_TREE[skill].tree,
    ),
  ),
);

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
    if (!skillsByTier[requirements.skill]) {
      skillsByTier[requirements.skill] = [];
    }

    skillsByTier[requirements.skill].push(skill);
  });

  return skillsByTier;
};
