import { getKeys } from "./craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { translate } from "lib/i18n/translate";
import { Inventory, IslandType } from "./game";
import { BuffLabel } from ".";
import { ITEM_DETAILS } from "./images";
import powerup from "assets/icons/level_up.png";
import redArrowDown from "assets/icons/decrease_arrow.png";
import bee from "assets/icons/bee.webp";
import baits from "assets/composters/baits.png";
import fertilisers from "assets/composters/fertilisers.png";
import pickaxes from "assets/icons/skill_icons/pickaxes.png";
import rockOres from "assets/icons/skill_icons/1tap.png";
import tomato_lemon from "assets/fruit/tomato_lemon.png";
import orange_blueberry from "assets/fruit/orange_blueberry.png";
import apple_banana from "assets/fruit/apple_banana.png";
import field_expansion_module from "assets/icons/skill_icons/field_expansion_module.png";
import field_extension_module from "assets/icons/skill_icons/field_extension_module.png";
import glass_room from "assets/icons/skill_icons/glass_room.png";
import seedy_business from "assets/icons/skill_icons/seedybusiness.png";
import greasy_plants from "assets/icons/skill_icons/greasy.png";
import greenhouse_gamble from "assets/icons/skill_icons/gamble.png";
import greenhouse_guru from "assets/icons/skill_icons/guru.png";
import hyperBees from "assets/icons/skill_icons/Hyperbees.png";
import flower_sale from "assets/icons/skill_icons/flowersale.png";
import blossom_bonding from "assets/icons/skill_icons/Bonding.png";
import abode from "assets/icons/skill_icons/Abode.png";
import pollen from "assets/icons/skill_icons/Pollen.png";
import fishermans10fold from "assets/icons/skill_icons/fishermans_10_fold.png";
import fryFrenzy from "assets/icons/skill_icons/fry_frenzy.png";
import instaChop from "assets/icons/skill_icons/insta_chop.png";
import moreAxes from "assets/icons/skill_icons/more_axes.png";
import moreWithLess from "assets/icons/skill_icons/more_with_less.png";
import nomNom from "assets/icons/skill_icons/nom_nom.png";
import reelDeal from "assets/icons/skill_icons/reel_deal.png";
import swiftSizzle from "assets/icons/skill_icons/swift_sizzle.png";
import treeTurnaround from "assets/icons/skill_icons/tree_turnaround.png";
import turboFry from "assets/icons/skill_icons/turbo_fry.png";
import blendTastic from "assets/icons/skill_icons/Blend-tastic.png";
import sproutSurge from "assets/icons/skill_icons/Sproutsurge.png";
import rootRocket from "assets/icons/skill_icons/Rootrocket.png";
import greaseLightning from "assets/icons/skill_icons/grease_lightning.png";
import instantGratification from "assets/icons/skill_icons/InstantGratification.webp";
import treeBlitz from "assets/icons/skill_icons/Treeblitz.png";
import fellerDiscount from "assets/icons/skill_icons/fellers_discount.png";
import doubleNom from "assets/icons/skill_icons/double_nom.png";
import abundantHarvest from "assets/icons/skill_icons/abundant_harvest.png";
import barnyardRouse from "assets/icons/skill_icons/barnyard_rouse.png";
import baleEconomy from "assets/icons/skill_icons/bale_economy.png";
import catchup from "assets/icons/skill_icons/catchup.png";
import chonkyFeed from "assets/icons/skill_icons/chonky_feed.png";
import compostingOverhaul from "assets/icons/skill_icons/composting_overhaul.png";
import crimeFruit from "assets/icons/skill_icons/crime_fruit.png";
import cropExtensionModule from "assets/icons/skill_icons/crop_extension_module.png";
import rhubarb_zucchini from "assets/icons/skill_icons/rhubarb_zucchini.png";
import yam_broccoli from "assets/icons/skill_icons/yam_broccoli.png";
import doubleBale from "assets/icons/skill_icons/double_bale.png";
import efficiencyExtensionModule from "assets/icons/skill_icons/efficiency_extension_module.png";
import ferrousFavor from "assets/icons/skill_icons/ferrous_favor.png";
import fieryJackpot from "assets/icons/skill_icons/fiery_jackpot.png";
import fineFibers from "assets/icons/skill_icons/fine_fibers.png";
import fireKissed from "assets/resources/crimstone/crimstone_rock_5.webp";
import firesideAlchemist from "assets/icons/skill_icons/fireside_alchemist.png";
import fishFrenzy from "assets/icons/fish_frenzy.webp";
import fishyFeast from "assets/icons/skill_icons/fishy_feast.png";
import frugalMiner from "assets/icons/skill_icons/frugal_miner.png";
import fruitfulBounty from "assets/icons/skill_icons/fruitful_bounty.png";
import fruityHeaven from "assets/icons/skill_icons/fruity_heaven.png";
import generousOrchard from "assets/icons/skill_icons/generous_orchard.png";
import goldenTouch from "assets/icons/skill_icons/golden_touch.png";
import heartwarmingInstruments from "assets/icons/skill_icons/heartwarming_instruments.png";
import kaleMix from "assets/icons/skill_icons/kale_mix.png";
import midasRush from "assets/icons/skill_icons/midas_rush.png";
import midasSprint from "assets/icons/skill_icons/midas_sprint.png";
import oilBeBack from "assets/icons/skill_icons/oil_be_back.png";
import oilGadget from "assets/icons/skill_icons/oil_gadget.png";
import oilTank from "assets/icons/skill_icons/oil_tank.png";
import riceAndShine from "assets/icons/skill_icons/riceandshine.png";
import restlessAnimals from "assets/icons/skill_icons/restless_animals.png";
import rockyFavor from "assets/icons/skill_icons/rocky_favor.png";
import seededBounty from "assets/icons/skill_icons/seedybounty.png";
import strongRoots from "assets/icons/skill_icons/strong_roots.png";
import xpIcon from "assets/icons/xp.png";
import { NPCName } from "lib/npcs";

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
  | "Fruit Patch"
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

export type BumpkinSkillTier = 1 | 2 | 3;

export type BumpkinSkillRevamp = {
  name: string;
  tree: BumpkinRevampSkillTree;
  requirements: {
    points: number;
    tier: BumpkinSkillTier;
    island: IslandType;
    cooldown?: number;
    items?: Inventory;
  };
  boosts: {
    buff: BuffLabel;
    debuff?: BuffLabel;
  };
  image?: string;
  npc?: NPCName;
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
    image: CROP_LIFECYCLE["Basic Biome"].Radish.crop,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.greenThumb"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.youngFarmer"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    image: ITEM_DETAILS.Sunflower.image,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.experiencedFarmer"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    image: ITEM_DETAILS.Cauliflower.image,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.oldFarmer"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    disabled: false,
    image: ITEM_DETAILS.Wheat.image,
  },
  "Chonky Scarecrow": {
    name: "Chonky Scarecrow",
    tree: "Crops",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.chonkyScarecrow"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Basic Scarecrow"].image,
      },
    },
    disabled: false,
    image: ITEM_DETAILS["Basic Scarecrow"].image,
  },
  "Betty's Friend": {
    name: "Betty's Friend",
    tree: "Crops",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.bettysFriend"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
    npc: "betty",
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
    boosts: {
      buff: {
        shortDescription: translate("skill.strongRoots"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
    image: strongRoots,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.coinSwindler"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
    image: ITEM_DETAILS.Market.image,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.goldenSunflower"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: SUNNYSIDE.skills.golden_flowers,
      },
    },
    image: SUNNYSIDE?.skills?.golden_flowers,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.horrorMike"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Scary Mike"].image,
      },
    },
    disabled: false,
    image: ITEM_DETAILS["Scary Mike"].image,
  },
  "Laurie's Gains": {
    name: "Laurie's Gains",
    tree: "Crops",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.lauriesGains"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Laurie the Chuckle Crow"].image,
      },
    },
    disabled: false,
    image: ITEM_DETAILS["Laurie the Chuckle Crow"].image,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.instantGrowth"),
        labelType: "transparent",
      },
    },
    disabled: false,
    power: true,
    image: SUNNYSIDE.skills.cultivator,
  },
  "Acre Farm": {
    name: "Acre Farm",
    tree: "Crops",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.acreFarm.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      debuff: {
        shortDescription: translate("skill.acreFarm.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
    disabled: false,
    image: ITEM_DETAILS.Kale.image,
  },
  "Hectare Farm": {
    name: "Hectare Farm",
    tree: "Crops",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.hectareFarm.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      debuff: {
        shortDescription: translate("skill.hectareFarm.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
    disabled: false,
    image: ITEM_DETAILS.Carrot.image,
  },

  // Fruit - Tier 1
  "Fruitful Fumble": {
    name: "Fruitful Fumble",
    tree: "Fruit Patch",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fruitfulFumble"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    disabled: false,
  },
  "Fruity Heaven": {
    name: "Fruity Heaven",
    tree: "Fruit Patch",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fruityHeaven"),
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.ui.coins,
      },
    },
    image: fruityHeaven,
    disabled: false,
  },
  "Fruity Profit": {
    name: "Fruity Profit",
    tree: "Fruit Patch",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fruityProfit"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
    disabled: false,
    npc: "tango",
  },
  "Loyal Macaw": {
    name: "Loyal Macaw",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.loyalMacaw"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Macaw"].image,
      },
    },
  },
  "No Axe No Worries": {
    name: "No Axe No Worries",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.noAxeNoWorries.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      debuff: {
        shortDescription: translate("skill.noAxeNoWorries.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: SUNNYSIDE.resource.wood,
      },
    },
    image: ITEM_DETAILS.Axe.image,
  },
  // Fruit - Tier 2
  Catchup: {
    name: "Catchup",
    tree: "Fruit Patch",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.catchup"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
    image: catchup,
    disabled: false,
  },
  "Fruity Woody": {
    name: "Fruity Woody",
    tree: "Fruit Patch",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fruityWoody"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.wood,
      },
    },
    disabled: false,
  },
  "Pear Turbocharge": {
    name: "Pear Turbocharge",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.pearTurbocharge"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Immortal Pear"].image,
      },
    },
  },
  "Crime Fruit": {
    name: "Crime Fruit",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.crimeFruit"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: tomato_lemon,
      },
    },
    image: crimeFruit,
  },
  // Fruit - Tier 3
  "Generous Orchard": {
    name: "Generous Orchard",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.generousOrchard"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    image: generousOrchard,
  },
  "Long Pickings": {
    name: "Long Pickings",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.longPickings.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.stopwatch,
      },
      debuff: {
        shortDescription: translate("skill.longPickings.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
    image: apple_banana,
  },
  "Short Pickings": {
    name: "Short Pickings",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.shortPickings.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.stopwatch,
      },
      debuff: {
        shortDescription: translate("skill.shortPickings.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
    image: orange_blueberry,
  },
  "Zesty Vibes": {
    name: "Zesty Vibes",
    tree: "Fruit Patch",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.zestyVibes.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: tomato_lemon,
      },
      debuff: {
        shortDescription: translate("skill.zestyVibes.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
    image: tomato_lemon,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.lumberjacksExtra"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.resource.wood,
      },
    },
    image: SUNNYSIDE.skills.lumberjack_LE,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.treeCharge"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: SUNNYSIDE.resource.tree,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.moreAxes"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.tools.axe,
      },
    },
    disabled: false,
    image: moreAxes,
  },
  "Insta-Chop": {
    name: "Insta-Chop",
    tree: "Trees",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.instaChop"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    disabled: false,
    image: instaChop,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.toughTree"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: SUNNYSIDE.tools.axe,
      },
    },
    image: SUNNYSIDE?.skills?.tough_tree,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.fellersDiscount"),
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.ui.coins,
        boostedItemIcon: SUNNYSIDE.tools.axe,
      },
    },
    disabled: false,
    image: fellerDiscount,
  },
  "Money Tree": {
    name: "Money Tree",
    tree: "Trees",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.moneyTree"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    image: SUNNYSIDE?.skills?.money_tree,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.treeTurnaround"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    disabled: false,
    image: treeTurnaround,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.treeBlitz"),
        labelType: "transparent",
      },
    },
    disabled: false,
    image: treeBlitz,
    power: true,
  },

  // Fishing - Tier 1
  "Fisherman's 5 Fold": {
    name: "Fisherman's 5 Fold",
    tree: "Fishing",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fishermansFiveFold"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Rod"].image,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.fishyChance"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    },
    disabled: false,
    image: ITEM_DETAILS.Anchovy.image,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.fishyRoll"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    },
    image: ITEM_DETAILS["Red Snapper"].image,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.reelDeal"),
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.ui.coins,
        boostedItemIcon: ITEM_DETAILS["Rod"].image,
      },
    },
    image: reelDeal,
  },
  // Fishing - Tier 2
  "Fisherman's 10 Fold": {
    name: "Fisherman's 10 Fold",
    tree: "Fishing",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fishermansTenFold"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Rod"].image,
      },
    },
    disabled: false,
    image: fishermans10fold,
  },
  "Fishy Fortune": {
    name: "Fishy Fortune",
    tree: "Fishing",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fishyFortune"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
    disabled: false,
    npc: "corale",
  },
  "Big Catch": {
    name: "Big Catch",
    tree: "Fishing",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.bigCatch"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    disabled: true,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.fishyGamble"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    },
    image: ITEM_DETAILS.Tuna.image,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.frenziedFish"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    },
    image: fishFrenzy,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.moreWithLess.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Rod.image,
      },
      debuff: {
        shortDescription: translate("skill.moreWithLess.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: baits,
      },
    },
    disabled: false,
    image: moreWithLess,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.fishyFeast"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    },
    image: fishyFeast,
  },

  // Animals - Tier 1
  "Efficient Feeding": {
    name: "Efficient Feeding",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.efficientFeeding"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Hay.image,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.restlessAnimals"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
    image: restlessAnimals,
  },
  "Fine Fibers": {
    name: "Fine Fibers",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fineFibers"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: fineFibers,
      },
    },
    image: fineFibers,
  },
  "Bountiful Bounties": {
    name: "Bountiful Bounties",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.bountifulBounties"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.doubleBale"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Bale.image,
      },
    },
    image: doubleBale,
  },
  "Bale Economy": {
    name: "Bale Economy",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.baleEconomy"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS.Bale.image,
      },
    },
    image: baleEconomy,
  },
  Featherweight: {
    name: "Featherweight",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.featherweightBuff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Feather.image,
      },
      debuff: {
        shortDescription: translate("skill.featherweightDebuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
  },

  // Animals - Tier 2
  "Abundant Harvest": {
    name: "Abundant Harvest",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.abundantHarvest"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: abundantHarvest,
      },
    },
    image: abundantHarvest,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.heartwarmingInstruments"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: heartwarmingInstruments,
      },
    },
    image: heartwarmingInstruments,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.kaleMix"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS["Mixed Grain"].image,
      },
    },
    image: kaleMix,
  },
  "Alternate Medicine": {
    tree: "Animals",
    name: "Alternate Medicine",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.alternateMedicine"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS["Barn Delight"].image,
      },
    },
  },
  "Healthy Livestock": {
    name: "Healthy Livestock",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.healthyLivestock"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    image: SUNNYSIDE.animals.chickenSick,
  },
  "Merino Whisperer": {
    name: "Merino Whisperer",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.merinoWhispererBuff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Merino Wool"].image,
      },
      debuff: {
        shortDescription: translate("skill.merinoWhispererDebuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
  },

  // Animals - Tier 3
  "Clucky Grazing": {
    name: "Clucky Grazing",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.cluckyGrazing.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.animals.chickenReady,
      },
      debuff: {
        shortDescription: translate("skill.cluckyGrazing.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.sheepwiseDiet.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.animals.sheepReady,
      },
      debuff: {
        shortDescription: translate("skill.sheepwiseDiet.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.cowSmartNutrition.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.animals.cowReady,
      },
      debuff: {
        shortDescription: translate("skill.cowSmartNutrition.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
  },
  "Chonky Feed": {
    name: "Chonky Feed",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.chonkyFeed.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Hay.image,
      },
      debuff: {
        shortDescription: translate("skill.chonkyFeed.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
    image: chonkyFeed,
  },

  "Leathercraft Mastery": {
    name: "Leathercraft Mastery",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.leathercraftMasteryBuff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Leather.image,
      },
      debuff: {
        shortDescription: translate("skill.leathercraftMasteryDebuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
  },
  "Barnyard Rouse": {
    name: "Barnyard Rouse",
    tree: "Animals",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
      cooldown: 1000 * 60 * 60 * 24 * 5,
    },
    power: true,
    boosts: {
      buff: {
        shortDescription: translate("skill.barnyardRouse"),
        labelType: "transparent",
      },
    },
    image: barnyardRouse,
  },

  // Greenhouse - Tier 1
  "Glass Room": {
    name: "Glass Room",
    tree: "Greenhouse",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.glassRoom"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    image: glass_room,
  },
  "Seedy Business": {
    name: "Seedy Business",
    tree: "Greenhouse",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.seedyBusiness"),
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.ui.coins,
      },
    },
    image: seedy_business,
  },
  "Rice and Shine": {
    name: "Rice and Shine",
    tree: "Greenhouse",
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.riceAndShine"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
    image: riceAndShine,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.victoriasSecretary"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
    npc: "victoria",
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
    boosts: {
      buff: {
        shortDescription: translate("skill.oliveExpress"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Olive.image,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.riceRocket"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Rice.image,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.vineVelocity"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Grape.image,
      },
    },
    disabled: false,
  },
  "Seeded Bounty": {
    name: "Seeded Bounty",
    tree: "Greenhouse",
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.seededBounty.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      debuff: {
        shortDescription: translate("skill.seededBounty.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
    image: seededBounty,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.greenhouseGuru"),
        labelType: "transparent",
      },
    },
    disabled: false,
    power: true,
    image: greenhouse_guru,
  },
  "Greenhouse Gamble": {
    name: "Greenhouse Gamble",
    tree: "Greenhouse",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.greenhouseGamble"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    disabled: false,
    image: greenhouse_gamble,
  },
  "Slick Saver": {
    name: "Slick Saver",
    tree: "Greenhouse",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.slickSaver"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Oil.image,
      },
    },
    disabled: false,
  },
  "Greasy Plants": {
    name: "Greasy Plants",
    tree: "Greenhouse",
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.greasyPlants.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      debuff: {
        shortDescription: translate("skill.greasyPlants.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS.Oil.image,
      },
    },
    image: greasy_plants,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.rockAndRoll"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Stone.image,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.ironBumpkin"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Iron.image,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.speedMiner"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Stone.image,
      },
    },
    image: SUNNYSIDE.resource.stone_small,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.tapProspector"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: rockOres,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.forgeWardProfits"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
    disabled: false,
    npc: "blacksmith",
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
    boosts: {
      buff: {
        shortDescription: translate("skill.ironHustle"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Iron.image,
      },
    },
    image: SUNNYSIDE.resource.ironStone,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.frugalMiner"),
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.ui.coins,
        boostedItemIcon: pickaxes,
      },
    },
    image: frugalMiner,
    disabled: false,
  },
  "Rocky Favor": {
    name: "Rocky Favor",
    tree: "Mining",
    requirements: { points: 2, tier: 2, island: "basic" },
    boosts: {
      buff: {
        shortDescription: translate("skill.rockyFavor.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Stone.image,
      },
      debuff: {
        shortDescription: translate("skill.rockyFavor.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS.Iron.image,
      },
    },
    image: rockyFavor,
    disabled: false,
  },
  "Fire Kissed": {
    name: "Fire Kissed",
    tree: "Mining",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fireKissed"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Crimstone.image,
      },
    },
    image: fireKissed,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.midasSprint"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Gold.image,
      },
    },
    image: midasSprint,
    disabled: false,
  },
  // Mining - Tier 3
  "Ferrous Favor": {
    name: "Ferrous Favor",
    tree: "Mining",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.ferrousFavor.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Iron.image,
      },
      debuff: {
        shortDescription: translate("skill.ferrousFavor.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS.Stone.image,
      },
    },
    image: ferrousFavor,
    disabled: false,
  },
  "Golden Touch": {
    name: "Golden Touch",
    tree: "Mining",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.goldenTouch"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS.Gold.image,
      },
    },
    image: goldenTouch,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.morePicks"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: pickaxes,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.firesideAlchemist"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Crimstone.image,
      },
    },
    image: firesideAlchemist,
    disabled: false,
  },
  "Midas Rush": {
    name: "Midas Rush",
    tree: "Mining",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.midasRush"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS.Gold.image,
      },
    },
    image: midasRush,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.fastFeasts"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Chef Hat"].image,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.nomNom"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.ui.coins,
      },
    },
    disabled: false,
    image: nomNom,
  },
  "Munching Mastery": {
    name: "Munching Mastery",
    tree: "Cooking",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.munchingMastery"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    image: xpIcon,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.swiftSizzle"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    disabled: false,
    image: swiftSizzle,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.frostedCakes"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Radish Cake"].image,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.juicyBoost"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.smoothieIcon,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.turboFry"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    disabled: false,
    image: turboFry,
  },
  "Drive-Through Deli": {
    name: "Drive-Through Deli",
    tree: "Cooking",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.driveThroughDeli"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.deliIcon,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.instantGratification"),
        labelType: "transparent",
      },
    },
    disabled: false,
    power: true,
    image: instantGratification,
  },
  "Double Nom": {
    name: "Double Nom",
    tree: "Cooking",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.doubleNom.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      debuff: {
        shortDescription: translate("skill.doubleNom.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
    disabled: false,
    image: doubleNom,
  },
  "Fiery Jackpot": {
    name: "Fiery Jackpot",
    tree: "Cooking",
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fieryJackpot"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS["Chef Hat"].image,
      },
    },
    image: fieryJackpot,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.fryFrenzy"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    disabled: false,
    image: fryFrenzy,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.sweetBonus"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Honey"].image,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.hyperBees"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Honey"].image,
      },
    },
    disabled: false,
    image: hyperBees,
  },
  "Blooming Boost": {
    name: "Blooming Boost",
    tree: "Bees & Flowers",
    requirements: {
      points: 1,
      tier: 1,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.bloomingBoost"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.flowerSale"),
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.ui.coins,
        boostedItemIcon: ITEM_DETAILS["Sunpetal Seed"].image,
      },
    },
    image: flower_sale,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.buzzworthyTreats"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Honey"].image,
      },
    },
    disabled: false,
    image: ITEM_DETAILS["Honey Cake"].image,
  },
  "Blossom Bonding": {
    name: "Blossom Bonding",
    tree: "Bees & Flowers",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.blossomBonding"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    disabled: false,
    image: blossom_bonding,
  },
  "Pollen Power Up": {
    name: "Pollen Power Up",
    tree: "Bees & Flowers",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.pollenPowerUp"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    disabled: false,
    image: pollen,
  },
  "Petalled Perk": {
    name: "Petalled Perk",
    tree: "Bees & Flowers",
    requirements: {
      points: 2,
      tier: 2,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.petalledPerk"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    disabled: false,
    image: ITEM_DETAILS["Red Lotus"].image,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.beeCollective"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: bee,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.flowerPower"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
      },
    },
    disabled: false,
    image: ITEM_DETAILS["Dawn Flower"].image,
  },
  "Flowery Abode": {
    name: "Flowery Abode",
    tree: "Bees & Flowers",
    requirements: {
      points: 3,
      tier: 3,
      island: "spring",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.floweryAbode.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Honey"].image,
      },
      debuff: {
        shortDescription: translate("skill.floweryAbode.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
      },
    },
    disabled: false,
    image: abode,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.petalBlessed"),
        labelType: "transparent",
      },
    },
    image: ITEM_DETAILS["Prism Petal"].image,
  },

  // Machinery - Tier 1
  "Crop Extension Module I": {
    name: "Crop Extension Module I",
    tree: "Machinery",
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.cropExtensionModuleI"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: rhubarb_zucchini,
      },
    },
    image: rhubarb_zucchini,
    disabled: false,
  },
  "Crop Processor Unit": {
    name: "Crop Processor Unit",
    tree: "Machinery",
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.cropProcessorUnit.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.stopwatch,
      },
      debuff: {
        shortDescription: translate("skill.cropProcessorUnit.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    image: SUNNYSIDE.icons.timer,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.oilGadget"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    image: oilGadget,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.oilExtraction"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.leakProofTank"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: oilTank,
      },
    },
    image: oilTank,
    disabled: false,
  },

  // Machinery - Tier 2
  "Crop Extension Module II": {
    name: "Crop Extension Module II",
    tree: "Machinery",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.cropExtensionModuleII"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: cropExtensionModule,
      },
    },
    image: cropExtensionModule,
    disabled: false,
  },

  "Crop Extension Module III": {
    name: "Crop Extension Module III",
    tree: "Machinery",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.cropExtensionModuleIII"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: yam_broccoli,
      },
    },
    image: yam_broccoli,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.rapidRig.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.stopwatch,
      },
      debuff: {
        shortDescription: translate("skill.rapidRig.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.oilBeBack"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Oil Reserve"].image,
      },
    },
    image: oilBeBack,
    disabled: false,
  },
  "Oil Rig": {
    name: "Oil Rig",
    tree: "Machinery",
    requirements: {
      points: 2,
      tier: 2,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.oilRig.buff"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS["Oil Drill"].image,
      },
    },
    image: ITEM_DETAILS["Oil Drill"].image,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.fieldExpansionModule"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    image: field_expansion_module,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.fieldExtensionModule"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
    },
    disabled: false,
    image: field_extension_module,
  },
  "Efficiency Extension Module": {
    name: "Efficiency Extension Module",
    tree: "Machinery",
    requirements: {
      points: 3,
      tier: 3,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.efficiencyExtensionModule"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Oil"].image,
      },
    },
    image: efficiencyExtensionModule,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.greaseLightning"),
        labelType: "transparent",
      },
    },
    disabled: false,
    power: true,
    image: greaseLightning,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.efficientBin"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Sprout Mix"].image,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.turboCharged"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Fruitful Blend"].image,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.wormyTreat"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: baits,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.featheryBusiness.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Feather"].image,
      },
      debuff: {
        shortDescription: translate("skill.featheryBusiness.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: ITEM_DETAILS["Feather"].image,
      },
    },
    disabled: false,
  },
  "Sprout Surge": {
    name: "Sprout Surge",
    tree: "Compost",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    disabled: false,
    power: true,
    boosts: {
      buff: {
        shortDescription: "Put Sprout Mix on all plots",
        labelType: "transparent",
      },
    },
    image: sproutSurge,
  },
  "Blend-tastic": {
    name: "Blend-tastic",
    tree: "Compost",
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    disabled: false,
    power: true,
    boosts: {
      buff: {
        shortDescription: "Put Fruitful Blend on all plots",
        labelType: "transparent",
      },
    },
    image: blendTastic,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.premiumWorms"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Rapid Root"].image,
      },
    },
    disabled: false,
  },
  "Fruitful Bounty": {
    name: "Fruitful Bounty",
    tree: "Compost",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    disabled: false,
    boosts: {
      buff: {
        shortDescription: translate("skill.fruitfulBounty"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Fruitful Blend"].image,
      },
    },
    image: fruitfulBounty,
  },
  "Swift Decomposer": {
    name: "Swift Decomposer",
    tree: "Compost",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.swiftDecomposer"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    },
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
    boosts: {
      buff: {
        shortDescription: translate("skill.compostingBonanza.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: SUNNYSIDE.icons.stopwatch,
      },
      debuff: {
        shortDescription: translate("skill.compostingBonanza.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
    disabled: false,
  },
  "Root Rocket": {
    name: "Root Rocket",
    tree: "Compost",
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    disabled: false,
    power: true,
    boosts: {
      buff: {
        shortDescription: "Put Rapid Root on all plots",
        labelType: "transparent",
      },
    },
    image: rootRocket,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.compostingOverhaul.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: baits,
      },
      debuff: {
        shortDescription: translate("skill.compostingOverhaul.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: fertilisers,
      },
    },
    image: compostingOverhaul,
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
    boosts: {
      buff: {
        shortDescription: translate("skill.compostingRevamp.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: fertilisers,
      },
      debuff: {
        shortDescription: translate("skill.compostingRevamp.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
        boostedItemIcon: baits,
      },
    },
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
