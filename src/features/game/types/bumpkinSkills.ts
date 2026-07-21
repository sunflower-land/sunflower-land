import { getKeys } from "lib/object";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { translate } from "lib/i18n/translate";
import type { Inventory, IslandType, Skills } from "./game";
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
import ager from "assets/icons/skill_icons/ager.webp";
import bacalhau from "assets/icons/skill_icons/bacalhau.webp";
import cheapRakes from "assets/icons/skill_icons/cheap_rakes.webp";
import fishSmoking from "assets/icons/skill_icons/fish_smoking.webp";
import refiner from "assets/icons/skill_icons/refiner.webp";
import saltSurge from "assets/icons/skill_icons/salt_surge.webp";
import saltySeas from "assets/icons/skill_icons/salty_seas.webp";
import seaBlessed from "assets/icons/skill_icons/sea_blessed.webp";
import speedyAging from "assets/icons/skill_icons/speedy_aging.webp";
import wideRakes from "assets/icons/skill_icons/wide_rakes.webp";
import xpIcon from "assets/icons/xp.png";
import type { NPCName } from "lib/npcs";
import type { BuffLabel } from ".";
import type { ToolName } from "./craftables";
import { OIL_DRILL_WOOL_BY_RANK } from "./oilDrill";

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
  | "Compost"
  | "Aging";

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

// Marks a skill as upgradeable to a higher rank. `effect` holds the per-rank
// boost magnitudes; cost per rank-up is derived from tier (getSkillUpgradeCost).
export type SkillUpgrade = {
  maxLevel: number;
  effect: SkillRankEffect;
};

// Skill points charged for a single rank-up, keyed on the skill's tier.
const UPGRADE_POINTS_BY_TIER: Record<BumpkinSkillTier, number> = {
  1: 1,
  2: 3,
  3: 6,
};

// Cost of a single rank-up for a skill of the given tier (flat per upgrade).
export const getSkillUpgradeCost = (tier: BumpkinSkillTier) => ({
  shards: tier,
  points: UPGRADE_POINTS_BY_TIER[tier],
});

// Same-tree tier that must be unlocked (via getUnlockedTierForTree) to buy the
// rank-up FROM `currentRank`. Each rank demands one more tier of tree progression
// beyond the skill's own tier, capped at the max tier (3). So a Tier 1 skill needs
// Tier 2 for Rank 2 and Tier 3 for Rank 3; Tier 2/3 skills need Tier 3 for any rank.
export const getSkillUpgradeTierRequirement = (
  tier: BumpkinSkillTier,
  currentRank: number,
): BumpkinSkillTier => Math.min(3, tier + currentRank) as BumpkinSkillTier;

// Current rank of a skill: 0 = not owned, otherwise 1..maxLevel (the rank is
// stored directly as the skill's value in `bumpkin.skills`). Clamped to a valid
// rank so a malformed / out-of-range persisted value can't produce an undefined
// rank read (NaN yields/growth). For non-upgradeable skills this is a no-op.
export const getSkillLevel = (
  skills: Skills,
  name: BumpkinRevampSkillName,
): number => {
  const level = Math.floor(skills[name] ?? 0);
  const maxLevel =
    (BUMPKIN_REVAMP_SKILL_TREE[name] as BumpkinSkillRevamp).upgrade?.maxLevel ??
    level;
  return Math.max(0, Math.min(level, maxLevel));
};

// A single AOE footprint, expressed as tile extents from the placeable's
// origin. Base (no skill) is {xLeft:1,xRight:1,depth:3} = 3x3 and stays
// implicit in collisionDetection; ranks below are the boosted footprints.
export type AOEExtent = { xLeft: number; xRight: number; depth: number };

// Items whose restock amount an upgradeable skill can raise — tools (More Axes /
// More Picks) plus the two fruit seeds boosted by Crime Fruit.
export type StockBoostName = ToolName | "Tomato Seed" | "Lemon Seed";

// Per-rank effect magnitudes for an upgradeable skill, stored inline on
// the skill's `upgrade.effect` in BUMPKIN_REVAMP_SKILL_TREE (single source of
// truth). `kind` drives both the gameplay consumer read and the UI formatter;
// `ranks` is indexed by (level - 1).
export type SkillRankEffect =
  | { kind: "growthMultiplier"; ranks: readonly [number, number, number] }
  | { kind: "additiveYield"; ranks: readonly [number, number, number] }
  | { kind: "coinBonus"; ranks: readonly [number, number, number] } // fraction: 0.3 = +30%
  | { kind: "dropChance"; ranks: readonly [number, number, number] } // inner prngChance arg
  | { kind: "chance"; ranks: readonly [number, number, number] } // prngChance percent arg
  | { kind: "costMultiplier"; ranks: readonly [number, number, number] } // multiplier on a coin or resource cost
  | { kind: "flatTimeBonus"; ranks: readonly [number, number, number] } // ms shaved off an in-flight production (e.g. composter speed up)
  | {
      kind: "stockBonus";
      ranks: Partial<Record<StockBoostName, readonly [number, number, number]>>;
    } // per-item flat stock add (e.g. axe/pickaxe/seed stock)
  | {
      kind: "aoe";
      ranks: readonly [AOEExtent, AOEExtent, AOEExtent];
      // Marginal crop yield the skill adds for a plot inside its AOE, per rank
      // (matches the sheet's "+0.1 …" wording). For Horror Mike / Laurie's Gains
      // this stacks on the base collectible's +0.2; for Chonky Scarecrow it is a
      // net-new bonus (0 at rank 1, so no yield is applied).
      aoeYield: readonly [number, number, number];
    }
  | { kind: "cooldown"; ranks: readonly [number, number, number] } // ms
  | { kind: "multiplier"; ranks: readonly [number, number, number] } // multiplier on a collectible's base effect (e.g. 2x/3x/4x)
  | { kind: "dailyLimit"; ranks: readonly [number, number, number] } // flat additions to the daily fishing reel limit
  | { kind: "xpBonus"; ranks: readonly [number, number, number] } // fraction: 0.2 = +20% (e.g. Bumpkin XP from fish)
  | { kind: "timeReduction"; ranks: readonly [number, number, number] } // fraction 0..1 shaved off a cooking time (0.3 = -30%)
  | { kind: "flatDebuff"; ranks: readonly [number, number, number] } // a debuff magnitude that shrinks with rank (e.g. wood penalty 1/0.5/0)
  | { kind: "oilReduction"; ranks: readonly [number, number, number] } // fraction subtracted from the crop-machine oil-consumption multiplier (0.1 = -10%)
  | { kind: "flatBonus"; ranks: readonly [number, number, number] } // a flat per-rank quantity (queue/plot additions, or an absolute ingredient amount)
  | {
      kind: "growthWithOilDebuff";
      growth: readonly [number, number, number]; // crop-machine growth-time multiplier for the boosted seed
      oilPenalty: readonly [number, number, number]; // fraction ADDED to the crop-machine oil consumption per hour
    }
  | {
      kind: "yieldWithDebuff";
      buff: readonly [number, number, number];
      debuff: readonly [number, number, number];
    }
  | {
      kind: "growthWithDebuff";
      buff: readonly [number, number, number]; // growth-time multiplier for the favoured fruit
      debuff: readonly [number, number, number]; // growth-time multiplier for the other fruit
    }
  | {
      kind: "frenziedFish";
      flat: readonly [number, number, number]; // guaranteed extra fish during a frenzy
      crit: readonly [number, number, number]; // percent chance (0..100) of one further bonus fish
    }
  | {
      kind: "doubleNom";
      food: readonly [number, number, number]; // guaranteed extra food from cooking
      ingredients: readonly [number, number, number]; // ingredient-cost multiplier debuff (2x/3x/4x)
    }
  | { kind: "flatReduction"; ranks: readonly [number, number, number] } // flat amount subtracted from a cost (e.g. greenhouse Oil usage 1/1.5/2)
  | {
      kind: "yieldWithOilDebuff";
      yield: readonly [number, number, number]; // extra greenhouse produce yield
      oilMultiplier: readonly [number, number, number]; // Oil-usage multiplier debuff (2x/3x/4x)
    }
  | { kind: "productionRate"; ranks: readonly [number, number, number] } // fraction ADDED to the beehive honey production rate (0.1 = +0.1 on the 1.0 base)
  | {
      kind: "rateWithGrowthDebuff";
      rate: readonly [number, number, number]; // fraction ADDED to the honey production rate
      growth: readonly [number, number, number]; // flower growth-time multiplier debuff (1.5 = +50%)
    }
  | {
      kind: "costWithDebuff";
      buff: readonly [number, number, number]; // feed-cost multiplier for the favoured animal
      debuff: readonly [number, number, number]; // feed-cost multiplier for every other animal
    }
  | {
      kind: "xpWithFeedDebuff";
      xp: readonly [number, number, number]; // animal-XP multiplier from feed
      feed: readonly [number, number, number]; // feed-cost multiplier debuff
    }
  | {
      kind: "sicknessWithSpread";
      sickness: readonly [number, number, number]; // multiplier on the whole sickness chance
      // Multiplier on the per-sick-animal spread term, applied BEFORE it is added
      // to the base chance. Rank 1 is a neutral 1, so it reproduces the original
      // "halve everything" behaviour; only ranks 2/3 shrink the spread.
      spread: readonly [number, number, number];
    };

// Shared AOE footprint progression — Chonky Scarecrow / Horror Mike / Laurie's
// Gains all grow their placeable's AOE identically per rank (7x7 / 8x8 / 9x9).
const AOE_RANKS: readonly [AOEExtent, AOEExtent, AOEExtent] = [
  { xLeft: 3, xRight: 3, depth: 7 },
  { xLeft: 4, xRight: 3, depth: 8 },
  { xLeft: 4, xRight: 4, depth: 9 },
];

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
  upgrade?: SkillUpgrade;
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "growthMultiplier", ranks: [0.95, 0.94, 0.925] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [0.1, 0.125, 0.15] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [0.1, 0.125, 0.15] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [0.1, 0.125, 0.15] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "aoe", ranks: AOE_RANKS, aoeYield: [0, 0.05, 0.1] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "coinBonus", ranks: [0.3, 0.45, 0.6] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "growthMultiplier", ranks: [0.9, 0.875, 0.85] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "coinBonus", ranks: [0.1, 0.2, 0.3] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "dropChance", ranks: [1 / 7, 1 / 5.5, 1 / 4] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "aoe", ranks: AOE_RANKS, aoeYield: [0.1, 0.15, 0.2] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "aoe", ranks: AOE_RANKS, aoeYield: [0.1, 0.15, 0.2] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "cooldown",
        ranks: [1000 * 60 * 60 * 72, 1000 * 60 * 60 * 60, 1000 * 60 * 60 * 48],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "yieldWithDebuff",
        buff: [1, 1.4, 1.8],
        debuff: [0.5, 0.6, 0.7],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "yieldWithDebuff",
        buff: [1, 1.4, 1.8],
        debuff: [0.5, 0.6, 0.7],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [0.1, 0.15, 0.2] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "costMultiplier", ranks: [0.9, 0.85, 0.8] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "coinBonus", ranks: [0.5, 0.75, 1.0] },
    },
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
    upgrade: {
      maxLevel: 3,
      // Macaw's base +0.1 yield doubled/tripled/quadrupled, stored as the
      // resulting yield so there is no lossy 0.1 x rank at runtime.
      effect: { kind: "additiveYield", ranks: [0.2, 0.25, 0.3] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "flatDebuff", ranks: [1, 0.75, 0.5] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "growthMultiplier", ranks: [0.9, 0.85, 0.8] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [1, 1.5, 2] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "multiplier", ranks: [2, 3, 4] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "stockBonus",
        ranks: {
          "Tomato Seed": [10, 25, 50],
          "Lemon Seed": [10, 25, 50],
        },
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "chance", ranks: [20, 30, 50] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "growthWithDebuff",
        buff: [0.75, 0.65, 0.55],
        debuff: [1.1, 1.125, 1.15],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "growthWithDebuff",
        buff: [0.75, 0.65, 0.55],
        debuff: [1.1, 1.125, 1.15],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "yieldWithDebuff",
        buff: [1, 1.5, 2],
        debuff: [0.25, 0.4, 0.5],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [0.1, 0.15, 0.2] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "growthMultiplier", ranks: [0.9, 0.875, 0.85] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "stockBonus", ranks: { Axe: [50, 100, 150] } } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "chance", ranks: [10, 20, 30] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "costMultiplier", ranks: [0.8, 0.75, 0.7] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "chance", ranks: [1, 2, 3] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "chance", ranks: [15, 25, 40] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "cooldown",
        ranks: [1000 * 60 * 60 * 24, 1000 * 60 * 60 * 18, 1000 * 60 * 60 * 12],
      } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "dailyLimit",
        ranks: [5, 7, 10],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "chance",
        ranks: [10, 12.5, 15],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "chance",
        ranks: [10, 12.5, 15],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "costMultiplier",
        ranks: [0.5, 0.45, 0.4],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "dailyLimit",
        ranks: [10, 18, 25],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "coinBonus",
        ranks: [1, 1.25, 1.5],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "chance",
        ranks: [20, 25, 30],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "frenziedFish",
        flat: [1, 2, 3],
        crit: [50, 50, 0],
      },
    },
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
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    },
    disabled: false,
    image: moreWithLess,
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "dailyLimit",
        ranks: [10, 25, 50],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "xpBonus",
        ranks: [0.2, 0.3, 0.4],
      },
    },
  },

  // Animals - Tier 1
  "Efficient Feeding": {
    name: "Efficient Feeding",
    tree: "Animals",
    // -5% / -6% / -7.5% feed to feed all animals.
    upgrade: {
      maxLevel: 3,
      effect: { kind: "costMultiplier", ranks: [0.95, 0.94, 0.925] },
    },
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
    // -10% / -15% / -20% animal sleep time.
    upgrade: {
      maxLevel: 3,
      effect: { kind: "growthMultiplier", ranks: [0.9, 0.85, 0.8] },
    },
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
    // +0.1 / +0.15 / +0.2 Feather, Leather and Merino Wool yield.
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [0.1, 0.15, 0.2] },
    },
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
    // +50% / +75% / +100% Coins from Animal Bounties.
    upgrade: {
      maxLevel: 3,
      effect: { kind: "coinBonus", ranks: [0.5, 0.75, 1] },
    },
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
    // 2x / 2.5x / 3x Bale's effect. Bale's base boost is a decimal (0.1), so the
    // consumer must scale it in Decimal — 0.1 * 3 drifts to 0.30000000000000004
    // in float.
    upgrade: {
      maxLevel: 3,
      effect: { kind: "multiplier", ranks: [2, 2.5, 3] },
    },
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
    // +0.35 / +0.45 / +0.55 Feather yield; the debuff is subtracted from BOTH
    // Leather and Merino Wool.
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "yieldWithDebuff",
        buff: [0.35, 0.45, 0.55],
        debuff: [0.1, 0.15, 0.2],
      },
    },
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
    // +0.2 / +0.35 / +0.5 Egg, Wool and Milk yield.
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [0.2, 0.35, 0.5] },
    },
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
    // +50% / +60% / +70% Animal XP from affection tools.
    upgrade: {
      maxLevel: 3,
      effect: { kind: "xpBonus", ranks: [0.5, 0.6, 0.7] },
    },
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
    // Mixed Grain requires 3 / 2.5 / 2 Kale instead. An absolute ingredient
    // amount, not a delta — the consumer builds a Decimal, so 2.5 is exact.
    upgrade: {
      maxLevel: 3,
      effect: { kind: "flatBonus", ranks: [3, 2.5, 2] },
    },
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
    // Not upgradeable yet. Ranks 2/3 add a produce boost for the next 3 harvests
    // on top of the (rank-invariant) ingredient discount, which needs the animal
    // feedBuff slot and a conflict rule against Salt Lick / Honey Treat. Left
    // un-ranked rather than shipping ranks that charge shards for no effect.
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
    // -50% sickness chance at every rank; only the spread shrinks (-0% / -50% /
    // -99%). Consumed server-side only (the sickness roll lives on the API), so
    // there is no FE read of these ranks.
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "sicknessWithSpread",
        sickness: [0.5, 0.5, 0.5],
        spread: [1, 0.5, 0.01],
      },
    },
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
    // +0.35 / +0.6 / +0.9 Merino Wool yield; the debuff is subtracted from BOTH
    // Leather and Feather.
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "yieldWithDebuff",
        buff: [0.35, 0.6, 0.9],
        debuff: [0.1, 0.15, 0.2],
      },
    },
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
    // -25% / -35% / -50% feed for Chickens; +50% / +55% / +65% for every other
    // animal.
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "costWithDebuff",
        buff: [0.75, 0.65, 0.5],
        debuff: [1.5, 1.55, 1.65],
      },
    },
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
    // -25% / -35% / -50% feed for Sheep; +50% / +55% / +65% for every other
    // animal.
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "costWithDebuff",
        buff: [0.75, 0.65, 0.5],
        debuff: [1.5, 1.55, 1.65],
      },
    },
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
    // -25% / -35% / -50% feed for Cows; +50% / +55% / +65% for every other
    // animal.
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "costWithDebuff",
        buff: [0.75, 0.65, 0.5],
        debuff: [1.5, 1.55, 1.65],
      },
    },
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
    // 2x / 2.5x / 3x animal XP from feed; +50% / +75% / +100% feed cost. Every
    // ANIMAL_FOOD_EXPERIENCE value is even, so the 2.5x rank stays integral.
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "xpWithFeedDebuff",
        xp: [2, 2.5, 3],
        feed: [1.5, 1.75, 2],
      },
    },
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
    // +0.35 / +0.6 / +0.8 Leather yield; the debuff is subtracted from BOTH
    // Feather and Merino Wool. Rank 3 is 0.8 (not 0.9) per the sheet — the
    // asymmetry with Merino Whisperer is intentional.
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "yieldWithDebuff",
        buff: [0.35, 0.6, 0.8],
        debuff: [0.1, 0.15, 0.2],
      },
    },
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
    // 5 / 4 / 3.5 day cooldown. Resolved generically by getSkillCooldown, so no
    // consumer change is needed.
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "cooldown",
        ranks: [
          1000 * 60 * 60 * 24 * 5,
          1000 * 60 * 60 * 24 * 4,
          1000 * 60 * 60 * 24 * 3.5,
        ],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [0.1, 0.15, 0.2] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "costMultiplier", ranks: [0.85, 0.8, 0.75] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "growthMultiplier", ranks: [0.95, 0.94, 0.925] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "coinBonus", ranks: [0.5, 0.75, 1.0] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "growthMultiplier", ranks: [0.9, 0.85, 0.8] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "growthMultiplier", ranks: [0.9, 0.85, 0.8] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "growthMultiplier", ranks: [0.9, 0.85, 0.8] },
    },
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
    upgrade: {
      // Only the yield leg scales; the "+1 seed to plant" debuff is fixed.
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [0.5, 0.75, 1] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "cooldown",
        // 4 day / 3.5 day / 3 day cooldown
        ranks: [1000 * 60 * 60 * 96, 1000 * 60 * 60 * 84, 1000 * 60 * 60 * 72],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "chance", ranks: [25, 35, 45] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "flatReduction", ranks: [1, 1.5, 2] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "yieldWithOilDebuff",
        yield: [1, 1.5, 2],
        oilMultiplier: [2, 3, 4],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "additiveYield",
        ranks: [0.1, 0.15, 0.2],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "additiveYield",
        ranks: [0.1, 0.15, 0.2],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "growthMultiplier",
        ranks: [0.8, 0.75, 0.7],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "coinBonus",
        ranks: [0.2, 0.3, 0.4],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "growthMultiplier",
        ranks: [0.7, 0.65, 0.6],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "costMultiplier",
        ranks: [0.8, 0.7, 0.6],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "yieldWithDebuff",
        buff: [1, 1.4, 1.8],
        debuff: [0.5, 0.6, 0.7],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "additiveYield",
        ranks: [1, 1.35, 1.75],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "growthMultiplier",
        ranks: [0.9, 0.875, 0.85],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "yieldWithDebuff",
        buff: [1, 1.5, 2],
        debuff: [0.5, 0.6, 0.7],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [0.5, 0.75, 1] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "stockBonus",
        ranks: {
          Pickaxe: [70, 140, 280],
          "Stone Pickaxe": [20, 40, 80],
          "Iron Pickaxe": [7, 14, 28],
          "Gold Pickaxe": [2, 4, 8],
        },
      } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "growthMultiplier",
        ranks: [0.85, 0.75, 0.6],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "growthMultiplier",
        ranks: [0.8, 0.75, 0.7],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "timeReduction",
        ranks: [0.1, 0.15, 0.2],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "coinBonus",
        ranks: [0.1, 0.3, 0.5],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "xpBonus",
        ranks: [0.05, 0.075, 0.1],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "timeReduction",
        ranks: [0.4, 0.45, 0.5],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "timeReduction",
        ranks: [0.1, 0.2, 0.3],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "xpBonus",
        ranks: [0.1, 0.2, 0.3],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "timeReduction",
        ranks: [0.5, 0.55, 0.6],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "xpBonus",
        ranks: [0.15, 0.2, 0.25],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "cooldown",
        // 4 day / 3.5 day / 3 day cooldown
        ranks: [1000 * 60 * 60 * 96, 1000 * 60 * 60 * 84, 1000 * 60 * 60 * 72],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "doubleNom",
        food: [1, 2, 3],
        ingredients: [2, 3, 4],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "chance",
        ranks: [20, 35, 50],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "timeReduction",
        ranks: [0.6, 0.65, 0.7],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [0.1, 0.15, 0.2] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "productionRate", ranks: [0.1, 0.15, 0.2] },
    },
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
    upgrade: {
      maxLevel: 3,
      // -10% / -12.5% / -15% flower growth time
      effect: { kind: "growthMultiplier", ranks: [0.9, 0.875, 0.85] },
    },
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
    upgrade: {
      maxLevel: 3,
      // -20% / -25% / -30% flower seed cost
      effect: { kind: "costMultiplier", ranks: [0.8, 0.75, 0.7] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "xpBonus", ranks: [0.1, 0.2, 0.3] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "flatBonus", ranks: [2, 3, 4] },
    },
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
    upgrade: {
      maxLevel: 3,
      // Marginal crop yield per swarm, on top of the base +0.2 Bee Swarm bonus
      // (total +0.3 / +0.35 / +0.4).
      effect: { kind: "additiveYield", ranks: [0.1, 0.15, 0.2] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "chance", ranks: [10, 17.5, 25] },
    },
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
    upgrade: {
      maxLevel: 3,
      // Percentage points ADDED to the bee swarm chance
      effect: { kind: "chance", ranks: [20, 27.5, 35] },
    },
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
    upgrade: {
      maxLevel: 3,
      // -20% / -30% / -40% flower growth time
      effect: { kind: "growthMultiplier", ranks: [0.8, 0.7, 0.6] },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "rateWithGrowthDebuff",
        rate: [0.5, 0.75, 1],
        // +50% / +60% / +70% flower growth time
        growth: [1.5, 1.6, 1.7],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "cooldown",
        // 4 day / 3.5 day / 3 day cooldown
        ranks: [1000 * 60 * 60 * 96, 1000 * 60 * 60 * 84, 1000 * 60 * 60 * 72],
      },
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "growthWithOilDebuff",
        growth: [0.95, 0.9, 0.85],
        oilPenalty: [0.1, 0.15, 0.2],
      } as const,
    },
    requirements: {
      points: 1,
      tier: 1,
      island: "desert",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.cropProcessorUnit.buff"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "oilReduction", ranks: [0.1, 0.15, 0.2] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [1, 1.5, 2] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "multiplier", ranks: [3, 4, 5] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "growthWithOilDebuff",
        growth: [0.8, 0.7, 0.6],
        oilPenalty: [0.4, 0.5, 0.6],
      } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "growthMultiplier", ranks: [0.8, 0.7, 0.6] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      // Wool required to craft the Oil Drill per rank (replaces Leather).
      // Sourced from tools.ts so the recipe and description can't drift.
      effect: { kind: "flatBonus", ranks: OIL_DRILL_WOOL_BY_RANK } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "flatBonus", ranks: [5, 7, 10] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "flatBonus", ranks: [5, 7, 10] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "oilReduction", ranks: [0.3, 0.4, 0.5] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: {
        kind: "cooldown",
        // 4 day / 3.5 day / 3 day cooldown
        ranks: [1000 * 60 * 60 * 96, 1000 * 60 * 60 * 84, 1000 * 60 * 60 * 72],
      } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [5, 7, 9] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [5, 7, 9] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [1, 2, 3] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      // Feather cost multiplier for the composter speed up. Rank 3 removes the
      // penalty entirely (1x), so the debuff line is dropped from the panel.
      effect: { kind: "costMultiplier", ranks: [2, 1.5, 1] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [10, 15, 20] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      // Multiplier applied to Fruitful Blend's base +0.1 fruit effect.
      effect: { kind: "multiplier", ranks: [2, 3, 4] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      // -10% / -12.5% / -15% compost time.
      effect: { kind: "growthMultiplier", ranks: [0.9, 0.875, 0.85] } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      // Extra time the composter speed up removes: +1hr / +1.5hr / +2hr.
      // The 2x resource debuff is flat across ranks, so it stays in the tree's
      // static debuff copy rather than the effect.
      effect: {
        kind: "flatTimeBonus",
        ranks: [1 * 60 * 60 * 1000, 1.5 * 60 * 60 * 1000, 2 * 60 * 60 * 1000],
      } as const,
    },
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
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [2, 5, 8] } as const,
    },
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
    },
    image: compostingOverhaul,
    disabled: false,
  },
  "Composting Revamp": {
    name: "Composting Revamp",
    tree: "Compost",
    upgrade: {
      maxLevel: 3,
      // +fertilisers per compost, at the cost of fewer worms.
      effect: {
        kind: "yieldWithDebuff",
        buff: [5, 8, 10],
        debuff: [2, 3, 4],
      } as const,
    },
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

  // Salt - Tier 1
  "Cheap Rakes": {
    name: "Cheap Rakes",
    tree: "Aging",
    upgrade: {
      maxLevel: 3,
      // Salt Rake coin cost multiplier: -20% / -30% / -40%.
      effect: { kind: "costMultiplier", ranks: [0.8, 0.7, 0.6] } as const,
    },
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.cheapRakes"),
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.ui.coins,
        boostedItemIcon: ITEM_DETAILS["Salt Rake"].image,
      },
    },
    image: cheapRakes,
  },
  "Speedy Aging": {
    name: "Speedy Aging",
    tree: "Aging",
    upgrade: {
      maxLevel: 3,
      // -10% / -15% / -20% fish aging time.
      effect: { kind: "growthMultiplier", ranks: [0.9, 0.85, 0.8] } as const,
    },
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.speedyAging"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    },
    image: speedyAging,
  },
  "Salty Seas": {
    name: "Salty Seas",
    tree: "Aging",
    upgrade: {
      maxLevel: 3,
      // -10% / -15% / -20% salt charge replenishment time.
      effect: { kind: "growthMultiplier", ranks: [0.9, 0.85, 0.8] } as const,
    },
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.saltySeas"),
        labelType: "info",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
        boostedItemIcon: ITEM_DETAILS["Salt"].image,
      },
    },
    image: saltySeas,
  },
  "Wide Rakes": {
    name: "Wide Rakes",
    tree: "Aging",
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [2, 3, 4] } as const,
    },
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.wideRakes"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: ITEM_DETAILS["Salt"].image,
      },
    },
    image: wideRakes,
  },
  Bacalhau: {
    name: "Bacalhau",
    tree: "Aging",
    upgrade: {
      maxLevel: 3,
      effect: { kind: "additiveYield", ranks: [1, 2, 3] } as const,
    },
    disabled: false,
    requirements: {
      points: 1,
      tier: 1,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.bacalhau"),
        labelType: "success",
        boostTypeIcon: powerup,
        boostedItemIcon: bacalhau,
      },
    },
    image: bacalhau,
  },

  // Salt - Tier 2
  "Fish Smoking": {
    name: "Fish Smoking",
    tree: "Aging",
    upgrade: {
      maxLevel: 3,
      // Multiplier on the base 10% Prime Aged chance: doubled / tripled /
      // quadrupled.
      effect: { kind: "multiplier", ranks: [2, 3, 4] } as const,
    },
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.fishSmoking"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: SUNNYSIDE.icons.fish,
      },
    },
    image: fishSmoking,
  },
  Refiner: {
    name: "Refiner",
    tree: "Aging",
    upgrade: {
      maxLevel: 3,
      // prngChance percent of +1 Refined Salt.
      effect: { kind: "chance", ranks: [15, 25, 35] } as const,
    },
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.refiner"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
      },
    },
    image: refiner,
  },
  "Sea Blessed": {
    name: "Sea Blessed",
    tree: "Aging",
    upgrade: {
      maxLevel: 3,
      // prngChance percent of restoring a charge to 4 Salt Nodes. Rank 2 is a
      // fractional 7.5% — prngChance compares a continuous prngValue * 100
      // against this, so it needs no tenths workaround.
      effect: { kind: "chance", ranks: [5, 7.5, 10] } as const,
    },
    disabled: false,
    requirements: {
      points: 2,
      tier: 2,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.seaBlessed"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS["Salt"].image,
      },
    },
    image: seaBlessed,
  },

  // Salt - Tier 3
  Ager: {
    name: "Ager",
    tree: "Aging",
    upgrade: {
      maxLevel: 3,
      // Both legs share one multiplier: 2x/3x/4x output from the aging racks
      // for 2x/3x/4x the inputs. The sheet keeps them equal at every rank, so
      // storing a single value keeps the buff and its debuff from drifting.
      effect: { kind: "multiplier", ranks: [2, 3, 4] } as const,
    },
    disabled: false,
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.ager.buff"),
        labelType: "success",
        boostTypeIcon: powerup,
      },
      debuff: {
        shortDescription: translate("skill.ager.debuff"),
        labelType: "danger",
        boostTypeIcon: redArrowDown,
      },
    },
    image: ager,
  },
  "Salt Surge": {
    name: "Salt Surge",
    tree: "Aging",
    upgrade: {
      maxLevel: 3,
      // Power skill cooldown: 3 days / 2.5 days / 2 days.
      effect: {
        kind: "cooldown",
        ranks: [1000 * 60 * 60 * 72, 1000 * 60 * 60 * 60, 1000 * 60 * 60 * 48],
      } as const,
    },
    disabled: false,
    power: true,
    requirements: {
      points: 3,
      tier: 3,
      island: "basic",
      cooldown: 1000 * 60 * 60 * 72,
    },
    boosts: {
      buff: {
        shortDescription: translate("skill.saltSurge"),
        labelType: "vibrant",
        boostTypeIcon: SUNNYSIDE.icons.lightning,
        boostedItemIcon: ITEM_DETAILS["Salt"].image,
      },
    },
    image: saltSurge,
  },
} satisfies Record<string, BumpkinSkillRevamp>;

export type BumpkinRevampSkillName = keyof typeof BUMPKIN_REVAMP_SKILL_TREE;

// The upgradeable skills — derived from which skills carry `upgrade`, so
// this set can never drift from the tree.
export type UpgradeableSkillName = {
  [K in BumpkinRevampSkillName]: (typeof BUMPKIN_REVAMP_SKILL_TREE)[K] extends {
    upgrade: SkillUpgrade;
  }
    ? K
    : never;
}[BumpkinRevampSkillName];

// Per-rank effect values, indexed by skill name — a typed view over each
// skill's `upgrade.effect` (the single source of truth in the tree). Reading by
// literal key keeps each skill's exact effect type (fully narrowed, no cast),
// and `satisfies Record<UpgradeableSkillName, ...>` forces every upgradeable
// skill to be listed here, so the two can never drift.
export const SKILL_RANKS = {
  "Green Thumb": BUMPKIN_REVAMP_SKILL_TREE["Green Thumb"].upgrade.effect,
  "Young Farmer": BUMPKIN_REVAMP_SKILL_TREE["Young Farmer"].upgrade.effect,
  "Experienced Farmer":
    BUMPKIN_REVAMP_SKILL_TREE["Experienced Farmer"].upgrade.effect,
  "Old Farmer": BUMPKIN_REVAMP_SKILL_TREE["Old Farmer"].upgrade.effect,
  "Betty's Friend": BUMPKIN_REVAMP_SKILL_TREE["Betty's Friend"].upgrade.effect,
  "Chonky Scarecrow":
    BUMPKIN_REVAMP_SKILL_TREE["Chonky Scarecrow"].upgrade.effect,
  "Strong Roots": BUMPKIN_REVAMP_SKILL_TREE["Strong Roots"].upgrade.effect,
  "Coin Swindler": BUMPKIN_REVAMP_SKILL_TREE["Coin Swindler"].upgrade.effect,
  "Golden Sunflower":
    BUMPKIN_REVAMP_SKILL_TREE["Golden Sunflower"].upgrade.effect,
  "Horror Mike": BUMPKIN_REVAMP_SKILL_TREE["Horror Mike"].upgrade.effect,
  "Laurie's Gains": BUMPKIN_REVAMP_SKILL_TREE["Laurie's Gains"].upgrade.effect,
  "Instant Growth": BUMPKIN_REVAMP_SKILL_TREE["Instant Growth"].upgrade.effect,
  "Acre Farm": BUMPKIN_REVAMP_SKILL_TREE["Acre Farm"].upgrade.effect,
  "Hectare Farm": BUMPKIN_REVAMP_SKILL_TREE["Hectare Farm"].upgrade.effect,
  "Lumberjack's Extra":
    BUMPKIN_REVAMP_SKILL_TREE["Lumberjack's Extra"].upgrade.effect,
  "Tree Charge": BUMPKIN_REVAMP_SKILL_TREE["Tree Charge"].upgrade.effect,
  "More Axes": BUMPKIN_REVAMP_SKILL_TREE["More Axes"].upgrade.effect,
  "Tough Tree": BUMPKIN_REVAMP_SKILL_TREE["Tough Tree"].upgrade.effect,
  "Feller's Discount":
    BUMPKIN_REVAMP_SKILL_TREE["Feller's Discount"].upgrade.effect,
  "Money Tree": BUMPKIN_REVAMP_SKILL_TREE["Money Tree"].upgrade.effect,
  "Tree Turnaround":
    BUMPKIN_REVAMP_SKILL_TREE["Tree Turnaround"].upgrade.effect,
  "Tree Blitz": BUMPKIN_REVAMP_SKILL_TREE["Tree Blitz"].upgrade.effect,
  "Rock'N'Roll": BUMPKIN_REVAMP_SKILL_TREE["Rock'N'Roll"].upgrade.effect,
  "Iron Bumpkin": BUMPKIN_REVAMP_SKILL_TREE["Iron Bumpkin"].upgrade.effect,
  "Speed Miner": BUMPKIN_REVAMP_SKILL_TREE["Speed Miner"].upgrade.effect,
  "Forge-Ward Profits":
    BUMPKIN_REVAMP_SKILL_TREE["Forge-Ward Profits"].upgrade.effect,
  "Iron Hustle": BUMPKIN_REVAMP_SKILL_TREE["Iron Hustle"].upgrade.effect,
  "Frugal Miner": BUMPKIN_REVAMP_SKILL_TREE["Frugal Miner"].upgrade.effect,
  "Rocky Favor": BUMPKIN_REVAMP_SKILL_TREE["Rocky Favor"].upgrade.effect,
  "Fire Kissed": BUMPKIN_REVAMP_SKILL_TREE["Fire Kissed"].upgrade.effect,
  "Midas Sprint": BUMPKIN_REVAMP_SKILL_TREE["Midas Sprint"].upgrade.effect,
  "Ferrous Favor": BUMPKIN_REVAMP_SKILL_TREE["Ferrous Favor"].upgrade.effect,
  "Golden Touch": BUMPKIN_REVAMP_SKILL_TREE["Golden Touch"].upgrade.effect,
  "More Picks": BUMPKIN_REVAMP_SKILL_TREE["More Picks"].upgrade.effect,
  "Fireside Alchemist":
    BUMPKIN_REVAMP_SKILL_TREE["Fireside Alchemist"].upgrade.effect,
  "Midas Rush": BUMPKIN_REVAMP_SKILL_TREE["Midas Rush"].upgrade.effect,
  "Fruitful Fumble":
    BUMPKIN_REVAMP_SKILL_TREE["Fruitful Fumble"].upgrade.effect,
  "Fruity Heaven": BUMPKIN_REVAMP_SKILL_TREE["Fruity Heaven"].upgrade.effect,
  "Fruity Profit": BUMPKIN_REVAMP_SKILL_TREE["Fruity Profit"].upgrade.effect,
  Catchup: BUMPKIN_REVAMP_SKILL_TREE["Catchup"].upgrade.effect,
  "Fruity Woody": BUMPKIN_REVAMP_SKILL_TREE["Fruity Woody"].upgrade.effect,
  "Crime Fruit": BUMPKIN_REVAMP_SKILL_TREE["Crime Fruit"].upgrade.effect,
  "Generous Orchard":
    BUMPKIN_REVAMP_SKILL_TREE["Generous Orchard"].upgrade.effect,
  "Zesty Vibes": BUMPKIN_REVAMP_SKILL_TREE["Zesty Vibes"].upgrade.effect,
  "Loyal Macaw": BUMPKIN_REVAMP_SKILL_TREE["Loyal Macaw"].upgrade.effect,
  "No Axe No Worries":
    BUMPKIN_REVAMP_SKILL_TREE["No Axe No Worries"].upgrade.effect,
  "Pear Turbocharge":
    BUMPKIN_REVAMP_SKILL_TREE["Pear Turbocharge"].upgrade.effect,
  "Long Pickings": BUMPKIN_REVAMP_SKILL_TREE["Long Pickings"].upgrade.effect,
  "Short Pickings": BUMPKIN_REVAMP_SKILL_TREE["Short Pickings"].upgrade.effect,
  "Fisherman's 5 Fold":
    BUMPKIN_REVAMP_SKILL_TREE["Fisherman's 5 Fold"].upgrade.effect,
  "Fishy Chance": BUMPKIN_REVAMP_SKILL_TREE["Fishy Chance"].upgrade.effect,
  "Fishy Roll": BUMPKIN_REVAMP_SKILL_TREE["Fishy Roll"].upgrade.effect,
  "Reel Deal": BUMPKIN_REVAMP_SKILL_TREE["Reel Deal"].upgrade.effect,
  "Fisherman's 10 Fold":
    BUMPKIN_REVAMP_SKILL_TREE["Fisherman's 10 Fold"].upgrade.effect,
  "Fishy Fortune": BUMPKIN_REVAMP_SKILL_TREE["Fishy Fortune"].upgrade.effect,
  "Fishy Gamble": BUMPKIN_REVAMP_SKILL_TREE["Fishy Gamble"].upgrade.effect,
  "Frenzied Fish": BUMPKIN_REVAMP_SKILL_TREE["Frenzied Fish"].upgrade.effect,
  "More With Less": BUMPKIN_REVAMP_SKILL_TREE["More With Less"].upgrade.effect,
  "Fishy Feast": BUMPKIN_REVAMP_SKILL_TREE["Fishy Feast"].upgrade.effect,
  "Fast Feasts": BUMPKIN_REVAMP_SKILL_TREE["Fast Feasts"].upgrade.effect,
  "Nom Nom": BUMPKIN_REVAMP_SKILL_TREE["Nom Nom"].upgrade.effect,
  "Munching Mastery":
    BUMPKIN_REVAMP_SKILL_TREE["Munching Mastery"].upgrade.effect,
  "Swift Sizzle": BUMPKIN_REVAMP_SKILL_TREE["Swift Sizzle"].upgrade.effect,
  "Frosted Cakes": BUMPKIN_REVAMP_SKILL_TREE["Frosted Cakes"].upgrade.effect,
  "Juicy Boost": BUMPKIN_REVAMP_SKILL_TREE["Juicy Boost"].upgrade.effect,
  "Turbo Fry": BUMPKIN_REVAMP_SKILL_TREE["Turbo Fry"].upgrade.effect,
  "Drive-Through Deli":
    BUMPKIN_REVAMP_SKILL_TREE["Drive-Through Deli"].upgrade.effect,
  "Instant Gratification":
    BUMPKIN_REVAMP_SKILL_TREE["Instant Gratification"].upgrade.effect,
  "Double Nom": BUMPKIN_REVAMP_SKILL_TREE["Double Nom"].upgrade.effect,
  "Fiery Jackpot": BUMPKIN_REVAMP_SKILL_TREE["Fiery Jackpot"].upgrade.effect,
  "Fry Frenzy": BUMPKIN_REVAMP_SKILL_TREE["Fry Frenzy"].upgrade.effect,
  "Glass Room": BUMPKIN_REVAMP_SKILL_TREE["Glass Room"].upgrade.effect,
  "Seedy Business": BUMPKIN_REVAMP_SKILL_TREE["Seedy Business"].upgrade.effect,
  "Rice and Shine": BUMPKIN_REVAMP_SKILL_TREE["Rice and Shine"].upgrade.effect,
  "Victoria's Secretary":
    BUMPKIN_REVAMP_SKILL_TREE["Victoria's Secretary"].upgrade.effect,
  "Olive Express": BUMPKIN_REVAMP_SKILL_TREE["Olive Express"].upgrade.effect,
  "Rice Rocket": BUMPKIN_REVAMP_SKILL_TREE["Rice Rocket"].upgrade.effect,
  "Vine Velocity": BUMPKIN_REVAMP_SKILL_TREE["Vine Velocity"].upgrade.effect,
  "Seeded Bounty": BUMPKIN_REVAMP_SKILL_TREE["Seeded Bounty"].upgrade.effect,
  "Greenhouse Guru":
    BUMPKIN_REVAMP_SKILL_TREE["Greenhouse Guru"].upgrade.effect,
  "Greenhouse Gamble":
    BUMPKIN_REVAMP_SKILL_TREE["Greenhouse Gamble"].upgrade.effect,
  "Slick Saver": BUMPKIN_REVAMP_SKILL_TREE["Slick Saver"].upgrade.effect,
  "Greasy Plants": BUMPKIN_REVAMP_SKILL_TREE["Greasy Plants"].upgrade.effect,
  "Crop Processor Unit":
    BUMPKIN_REVAMP_SKILL_TREE["Crop Processor Unit"].upgrade.effect,
  "Oil Gadget": BUMPKIN_REVAMP_SKILL_TREE["Oil Gadget"].upgrade.effect,
  "Oil Extraction": BUMPKIN_REVAMP_SKILL_TREE["Oil Extraction"].upgrade.effect,
  "Leak-Proof Tank":
    BUMPKIN_REVAMP_SKILL_TREE["Leak-Proof Tank"].upgrade.effect,
  "Rapid Rig": BUMPKIN_REVAMP_SKILL_TREE["Rapid Rig"].upgrade.effect,
  "Oil Be Back": BUMPKIN_REVAMP_SKILL_TREE["Oil Be Back"].upgrade.effect,
  "Oil Rig": BUMPKIN_REVAMP_SKILL_TREE["Oil Rig"].upgrade.effect,
  "Field Expansion Module":
    BUMPKIN_REVAMP_SKILL_TREE["Field Expansion Module"].upgrade.effect,
  "Field Extension Module":
    BUMPKIN_REVAMP_SKILL_TREE["Field Extension Module"].upgrade.effect,
  "Efficiency Extension Module":
    BUMPKIN_REVAMP_SKILL_TREE["Efficiency Extension Module"].upgrade.effect,
  "Grease Lightning":
    BUMPKIN_REVAMP_SKILL_TREE["Grease Lightning"].upgrade.effect,
  "Sweet Bonus": BUMPKIN_REVAMP_SKILL_TREE["Sweet Bonus"].upgrade.effect,
  "Hyper Bees": BUMPKIN_REVAMP_SKILL_TREE["Hyper Bees"].upgrade.effect,
  "Blooming Boost": BUMPKIN_REVAMP_SKILL_TREE["Blooming Boost"].upgrade.effect,
  "Flower Sale": BUMPKIN_REVAMP_SKILL_TREE["Flower Sale"].upgrade.effect,
  "Buzzworthy Treats":
    BUMPKIN_REVAMP_SKILL_TREE["Buzzworthy Treats"].upgrade.effect,
  "Blossom Bonding":
    BUMPKIN_REVAMP_SKILL_TREE["Blossom Bonding"].upgrade.effect,
  "Pollen Power Up":
    BUMPKIN_REVAMP_SKILL_TREE["Pollen Power Up"].upgrade.effect,
  "Petalled Perk": BUMPKIN_REVAMP_SKILL_TREE["Petalled Perk"].upgrade.effect,
  "Bee Collective": BUMPKIN_REVAMP_SKILL_TREE["Bee Collective"].upgrade.effect,
  "Flower Power": BUMPKIN_REVAMP_SKILL_TREE["Flower Power"].upgrade.effect,
  "Flowery Abode": BUMPKIN_REVAMP_SKILL_TREE["Flowery Abode"].upgrade.effect,
  "Petal Blessed": BUMPKIN_REVAMP_SKILL_TREE["Petal Blessed"].upgrade.effect,
  "Efficient Bin": BUMPKIN_REVAMP_SKILL_TREE["Efficient Bin"].upgrade.effect,
  "Turbo Charged": BUMPKIN_REVAMP_SKILL_TREE["Turbo Charged"].upgrade.effect,
  "Wormy Treat": BUMPKIN_REVAMP_SKILL_TREE["Wormy Treat"].upgrade.effect,
  "Feathery Business":
    BUMPKIN_REVAMP_SKILL_TREE["Feathery Business"].upgrade.effect,
  "Premium Worms": BUMPKIN_REVAMP_SKILL_TREE["Premium Worms"].upgrade.effect,
  "Fruitful Bounty":
    BUMPKIN_REVAMP_SKILL_TREE["Fruitful Bounty"].upgrade.effect,
  "Swift Decomposer":
    BUMPKIN_REVAMP_SKILL_TREE["Swift Decomposer"].upgrade.effect,
  "Composting Bonanza":
    BUMPKIN_REVAMP_SKILL_TREE["Composting Bonanza"].upgrade.effect,
  "Composting Overhaul":
    BUMPKIN_REVAMP_SKILL_TREE["Composting Overhaul"].upgrade.effect,
  "Composting Revamp":
    BUMPKIN_REVAMP_SKILL_TREE["Composting Revamp"].upgrade.effect,
  "Cheap Rakes": BUMPKIN_REVAMP_SKILL_TREE["Cheap Rakes"].upgrade.effect,
  "Speedy Aging": BUMPKIN_REVAMP_SKILL_TREE["Speedy Aging"].upgrade.effect,
  "Salty Seas": BUMPKIN_REVAMP_SKILL_TREE["Salty Seas"].upgrade.effect,
  "Wide Rakes": BUMPKIN_REVAMP_SKILL_TREE["Wide Rakes"].upgrade.effect,
  Bacalhau: BUMPKIN_REVAMP_SKILL_TREE["Bacalhau"].upgrade.effect,
  "Fish Smoking": BUMPKIN_REVAMP_SKILL_TREE["Fish Smoking"].upgrade.effect,
  Refiner: BUMPKIN_REVAMP_SKILL_TREE["Refiner"].upgrade.effect,
  "Sea Blessed": BUMPKIN_REVAMP_SKILL_TREE["Sea Blessed"].upgrade.effect,
  Ager: BUMPKIN_REVAMP_SKILL_TREE["Ager"].upgrade.effect,
  "Salt Surge": BUMPKIN_REVAMP_SKILL_TREE["Salt Surge"].upgrade.effect,
  "Efficient Feeding":
    BUMPKIN_REVAMP_SKILL_TREE["Efficient Feeding"].upgrade.effect,
  "Restless Animals":
    BUMPKIN_REVAMP_SKILL_TREE["Restless Animals"].upgrade.effect,
  "Fine Fibers": BUMPKIN_REVAMP_SKILL_TREE["Fine Fibers"].upgrade.effect,
  "Bountiful Bounties":
    BUMPKIN_REVAMP_SKILL_TREE["Bountiful Bounties"].upgrade.effect,
  "Double Bale": BUMPKIN_REVAMP_SKILL_TREE["Double Bale"].upgrade.effect,
  Featherweight: BUMPKIN_REVAMP_SKILL_TREE["Featherweight"].upgrade.effect,
  "Abundant Harvest":
    BUMPKIN_REVAMP_SKILL_TREE["Abundant Harvest"].upgrade.effect,
  "Heartwarming Instruments":
    BUMPKIN_REVAMP_SKILL_TREE["Heartwarming Instruments"].upgrade.effect,
  "Kale Mix": BUMPKIN_REVAMP_SKILL_TREE["Kale Mix"].upgrade.effect,
  "Healthy Livestock":
    BUMPKIN_REVAMP_SKILL_TREE["Healthy Livestock"].upgrade.effect,
  "Merino Whisperer":
    BUMPKIN_REVAMP_SKILL_TREE["Merino Whisperer"].upgrade.effect,
  "Clucky Grazing": BUMPKIN_REVAMP_SKILL_TREE["Clucky Grazing"].upgrade.effect,
  "Sheepwise Diet": BUMPKIN_REVAMP_SKILL_TREE["Sheepwise Diet"].upgrade.effect,
  "Cow-Smart Nutrition":
    BUMPKIN_REVAMP_SKILL_TREE["Cow-Smart Nutrition"].upgrade.effect,
  "Chonky Feed": BUMPKIN_REVAMP_SKILL_TREE["Chonky Feed"].upgrade.effect,
  "Leathercraft Mastery":
    BUMPKIN_REVAMP_SKILL_TREE["Leathercraft Mastery"].upgrade.effect,
  "Barnyard Rouse": BUMPKIN_REVAMP_SKILL_TREE["Barnyard Rouse"].upgrade.effect,
} satisfies Record<UpgradeableSkillName, SkillRankEffect>;

// Runtime guard co-located with SKILL_RANKS so callers can narrow to an
// upgradeable skill without casting.
export const isUpgradeableSkillName = (
  name: BumpkinRevampSkillName,
): name is UpgradeableSkillName => name in SKILL_RANKS;

// Upgradeable Cooking/Crops skills whose upgraded rank is neutralised on the
// CHAPTER_CROP_WEEK event items (the Saltwort crop and the Saltbite recipe).
// Derived from the tree (tree === Cooking/Crops + an `upgrade` block) so it can
// never drift from which skills are actually upgradeable.
// Module-private so no other module can mutate this shared set (it drives the
// event-item downgrade + the "boosts paused" notice); callers use the helpers below.
const CHAPTER_CROP_WEEK_DOWNGRADED_SKILLS: Set<UpgradeableSkillName> = new Set(
  getKeys(BUMPKIN_REVAMP_SKILL_TREE).filter(
    (name): name is UpgradeableSkillName => {
      const { tree } = BUMPKIN_REVAMP_SKILL_TREE[name];
      return (tree === "Cooking" || tree === "Crops") && name in SKILL_RANKS;
    },
  ),
);

// Returns `skills` with every upgradeable Cooking/Crops skill capped at rank 1
// (the base skill still applies, but the upgraded rank grants no extra bonus).
// Used to neutralise upgraded skill effects on the CHAPTER_CROP_WEEK event items
// WITHOUT mutating the player's real ranks — callers pass the result only into the
// Saltwort/Saltbite boost math and keep the original ranks everywhere else. Returns
// the original object untouched when nothing needs capping (the common case).
export const downgradeChapterCropWeekSkills = (skills: Skills): Skills => {
  let result: Skills | undefined;
  for (const name of CHAPTER_CROP_WEEK_DOWNGRADED_SKILLS) {
    if ((skills[name] ?? 0) > 1) {
      result = result ?? { ...skills };
      result[name] = 1;
    }
  }
  return result ?? skills;
};

// The upgradeable skills whose downgrade actually changes a CHAPTER_CROP_WEEK
// event item's result: Saltwort is a MEDIUM plot crop and Saltbite is a Fire-Pit
// (non-cake) recipe, so only the skills that mechanically apply to those are
// listed — e.g. Frosted Cakes (cakes only) and basic/advanced farmer skills are
// excluded because they can never affect Saltbite / medium Saltwort.
//
// `downgradeChapterCropWeekSkills` intentionally caps the WHOLE Crops/Cooking tree
// (a correct superset — capping an inapplicable skill is a no-op for the event
// item), so mechanics stay robust to crop/recipe tweaks; this list is a subset of
// it, so the notice can never claim a suppression the mechanics don't make.
const CHAPTER_CROP_WEEK_NOTICE_SKILLS: Record<
  "Crops" | "Cooking",
  readonly UpgradeableSkillName[]
> = {
  // Green Thumb (growth, all crops), Experienced Farmer (medium yield), Acre Farm
  // (debuffs medium), Hectare Farm (buffs medium), Horror Mike (Scary Mike AOE,
  // medium). See getCropYieldAmount / getCropPlotTime for the class gates.
  Crops: [
    "Green Thumb",
    "Experienced Farmer",
    "Acre Farm",
    "Hectare Farm",
    "Horror Mike",
  ],
  // Double Nom (cost + food, all recipes), Fast Feasts (Fire Pit time), Swift
  // Sizzle (Fire Pit oil), Fiery Jackpot (Fire Pit crit). See cook / collectRecipe.
  Cooking: ["Double Nom", "Fast Feasts", "Swift Sizzle", "Fiery Jackpot"],
};

// Whether the player owns an UPGRADED (rank 2+) skill that the CHAPTER_CROP_WEEK
// event actually neutralises for its item. Drives the "ascension boosts paused"
// notice in the Market (Crops → Saltwort) and Fire Pit (Cooking → Saltbite) — a
// rank-1 skill still applies its base effect, and a skill that can't affect the
// event item never counts, so the notice only shows a real, suppressed boost.
export const hasUpgradedChapterCropWeekSkill = (
  skills: Skills,
  tree: "Crops" | "Cooking",
): boolean =>
  CHAPTER_CROP_WEEK_NOTICE_SKILLS[tree].some(
    (name) => (skills[name] ?? 0) >= 2,
  );

// Effective "1 in N" gold chance shown to players for Golden Sunflower per rank.
// Derived from the mechanical dropChance so the display can't drift: prngChance
// fires when prngValue*100 < chance, so the player-facing odds are 100 / chance
// (1/7 -> 700, 1/6 -> 600, 1/5 -> 500).
export const GOLDEN_SUNFLOWER_DISPLAY = SKILL_RANKS[
  "Golden Sunflower"
].ranks.map((chance) => Math.round(100 / chance));

export const SKILL_TREE_CATEGORIES = Array.from(
  new Set(
    getKeys(BUMPKIN_SKILL_TREE).map((skill) => BUMPKIN_SKILL_TREE[skill].tree),
  ),
);

export const getRevampSkillTreeCategoriesByIsland = (
  islandType: IslandType,
) => {
  return Array.from(
    new Set(
      getKeys(BUMPKIN_REVAMP_SKILL_TREE)
        .filter((skillName) => {
          const skill = BUMPKIN_REVAMP_SKILL_TREE[skillName];
          return skill.requirements.island === islandType;
        })
        .map((skill) => BUMPKIN_REVAMP_SKILL_TREE[skill].tree),
    ),
  );
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
