import { InventoryItemName } from "./game";
import { BuffLabel } from ".";
import powerup from "assets/icons/level_up.png";
import lightning from "assets/icons/lightning.png";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "./images";
import { translate } from "lib/i18n/translate";

export const COLLECTIBLE_BUFF_LABELS: Partial<
  Record<InventoryItemName, BuffLabel>
> = {
  // Crop Boosts
  "Basic Scarecrow": {
    shortDescription: translate("description.basic.scarecrow.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },
  "Scary Mike": {
    shortDescription: translate("description.scary.mike.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Laurie the Chuckle Crow": {
    shortDescription: translate("description.laurie.chuckle.crow.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Nancy: {
    shortDescription: "-15% Crop Growth Time",
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },
  Scarecrow: {
    shortDescription: "-15% Crop Growth Time; +20% Crop Yield",
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  Kuebiko: {
    shortDescription: "-15% Crop Growth Time; +20% Crop Yield; Free Seeds",
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  Gnome: {
    shortDescription: "+10 Yield to Medium/Advanced Crops (AOE plot below)",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Sir Goldensnout": {
    shortDescription: translate("description.sir.goldensnout.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Lunar Calendar": {
    shortDescription: "-10% Crop Growth Time",
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },
  "Peeled Potato": {
    shortDescription: "20% Chance for +1 Potato",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Potato.crop,
  },
  "Victoria Sisters": {
    shortDescription: "+20% Pumpkin",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Pumpkin.crop,
  },
  "Freya Fox": {
    shortDescription: translate("description.freya.fox.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Pumpkin.crop,
  },
  "Easter Bunny": {
    shortDescription: "+20% Carrot",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Carrot.crop,
  },
  "Pablo The Bunny": {
    shortDescription: "+0.1 Carrot",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Carrot.crop,
  },
  "Cabbage Boy": {
    shortDescription: "+0.25 Cabbage (+0.5 with Cabbage Girl)",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Cabbage.crop,
  },
  "Cabbage Girl": {
    shortDescription: "-50% Cabbage Growth Time",
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: CROP_LIFECYCLE.Cabbage.crop,
  },
  Karkinos: {
    shortDescription: translate("description.Karkinos.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Cabbage.crop,
  },
  "Golden Cauliflower": {
    shortDescription: "+100% Cauliflower",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Cauliflower.crop,
  },
  "Mysterious Parsnip": {
    shortDescription: "-50% Parsnip Growth Time",
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: CROP_LIFECYCLE.Parsnip.crop,
  },
  "Purple Trail": {
    shortDescription: translate("description.purple.trail.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Eggplant.crop,
  },
  Obie: {
    shortDescription: translate("description.obie.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: CROP_LIFECYCLE.Eggplant.crop,
  },
  Maximus: {
    shortDescription: translate("description.maximus.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Eggplant.crop,
  },
  Poppy: {
    shortDescription: translate("description.poppy.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
  },
  Kernaldo: {
    shortDescription: translate("description.kernaldo.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
  },
  "Queen Cornelia": {
    shortDescription: "+1 Corn (AOE 3x4)",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
  },
  Foliant: {
    shortDescription: "+0.2 Kale",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Kale.crop,
  },
  Hoot: {
    shortDescription: "+0.5 Wheat, Radish, Kale",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Hungry Caterpillar": {
    shortDescription: "Free flower seeds",
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },

  // Fruit Boosts
  "Immortal Pear": {
    shortDescription: translate("description.immortal.pear.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Black Bearry": {
    shortDescription: "+1 Blueberry",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Blueberry.image,
  },
  "Squirrel Monkey": {
    shortDescription: "-50% Orange Growth Time",
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: ITEM_DETAILS.Orange.image,
  },
  "Lady Bug": {
    shortDescription: "+0.25 Apple",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Apple.image,
  },
  "Banana Chicken": {
    shortDescription: "+0.1 Banana",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Banana.image,
  },
  Nana: {
    shortDescription: translate("description.nana.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: ITEM_DETAILS.Banana.image,
  },

  // Mutant Crops
  "Carrot Sword": {
    shortDescription: "4x Chance of Mutant Crop",
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  "Stellar Sunflower": {
    shortDescription: "3% Chance of +10 Sunflower",
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: CROP_LIFECYCLE.Sunflower.crop,
  },
  "Potent Potato": {
    shortDescription: "3% Chance of +10 Potato",
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: CROP_LIFECYCLE.Potato.crop,
  },
  "Radical Radish": {
    shortDescription: "3% Chance of +10 Radish",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Radish.crop,
  },
  "Lab Grown Pumpkin": {
    shortDescription: "+0.3 Pumpkin",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Pumpkin.crop,
  },
  "Lab Grown Carrot": {
    shortDescription: "+0.2 Carrot",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Carrot.crop,
  },
  "Lab Grown Radish": {
    shortDescription: "+0.4 Radish",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Radish.crop,
  },

  // Animals
  "Fat Chicken": {
    shortDescription: "-0.1 Wheat to Feed Chickens",
    labelType: "info",
    boostTypeIcon: powerup,
    boostedItemIcon: CROP_LIFECYCLE.Wheat.crop,
  },
  "Rich Chicken": {
    shortDescription: "+0.1 Egg",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },
  "Speed Chicken": {
    shortDescription: "-10% Egg Production Time",
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },
  "Ayam Cemani": {
    shortDescription: "+0.2 Egg",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },
  "El Pollo Veloz": {
    shortDescription: "-4h Egg Production Time",
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },
  Rooster: {
    shortDescription: "2x Chance of Mutant Chicken",
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  "Undead Rooster": {
    shortDescription: "+0.1 Egg",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },
  "Chicken Coop": {
    shortDescription: "+1 Egg Yield; +5 Chicken Limit per Hen House",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Gold Egg": {
    shortDescription: "Feed Chickens without Wheat",
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  Bale: {
    shortDescription: translate("description.bale.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.egg,
  },

  // Resources
  "Woody the Beaver": {
    shortDescription: "+20% Wood",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Apprentice Beaver": {
    shortDescription: "+20% Wood; -50% Tree Recovery Time",
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Foreman Beaver": {
    shortDescription:
      "+20% Wood; -50% Tree Recovery Time; Chop Trees without Axes",
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Wood Nymph Wendy": {
    shortDescription: "+0.2 Wood",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Tiki Totem": {
    shortDescription: "+0.1 Wood",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wood,
  },
  "Tunnel Mole": {
    shortDescription: "+0.25 Stone",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.stone,
  },
  "Rocky the Mole": {
    shortDescription: "+0.25 Iron",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Iron.image,
  },
  Nugget: {
    shortDescription: "+0.25 Gold",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Gold.image,
  },
  "Rock Golem": {
    shortDescription: "10% Chance of +2 Stone",
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: SUNNYSIDE.resource.stone,
  },
  "Iron Idol": {
    shortDescription: translate("description.iron.idol.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Iron.image,
  },
  "Tin Turtle": {
    shortDescription: translate("description.tin.turtle.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.stone,
  },
  "Emerald Turtle": {
    shortDescription: translate("description.emerald.turtle.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  "Crimson Carp": {
    labelType: "success",
    shortDescription: "+0.05 Crimstone",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Crimstone.image,
  },
  "Crim Peckster": {
    shortDescription: "+0.1 Crimstone",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Crimstone.image,
  },
  "Mushroom House": {
    shortDescription: translate("description.mushroom.house.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.resource.wild_mushroom,
  },
  "Queen Bee": {
    shortDescription: "Doubles Honey Production Speed",
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: ITEM_DETAILS.Honey.image,
  },
  "Humming Bird": {
    shortDescription: "20% Chance for +1 Flower",
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
  },
  Beehive: {
    shortDescription: "10% Chance for +0.2 Crop when Beehive is full",
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },

  // Fish
  "Skill Shrimpy": {
    shortDescription: translate("description.skill.shrimpy.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.icons.fish,
  },
  Walrus: {
    shortDescription: "+1 Fish",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.icons.fish,
  },
  Alba: {
    shortDescription: "50% Chance of +1 Basic Fish",
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: SUNNYSIDE.icons.fish,
  },

  // Other
  "Soil Krabby": {
    shortDescription: translate("description.soil.krabby.boost"),
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },
  "Knowledge Crab": {
    shortDescription: "Double Sprout Mix Effect",
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: ITEM_DETAILS["Sprout Mix"].image,
  },
  "Maneki Neko": {
    shortDescription: "1 Free Food per Day",
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: ITEM_DETAILS["Pumpkin Soup"].image,
  },
  "Treasure Map": {
    shortDescription: translate("description.treasure.map.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS["Pirate Bounty"].image,
  },
  "Heart of Davy Jones": {
    shortDescription: translate("description.heart.of.davy.jones.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: SUNNYSIDE.tools.sand_shovel,
  },
  "Genie Lamp": {
    shortDescription: "Grants 3 Wishes",
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  "Grain Grinder": {
    shortDescription: translate("description.grain.grinder.boost"),
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Observatory: {
    shortDescription: "+5% XP",
    labelType: "success",
    boostTypeIcon: powerup,
  },
  Blossombeard: {
    labelType: "vibrant",
    shortDescription: "+10% XP",
    boostTypeIcon: lightning,
  },
  "Christmas Tree": {
    shortDescription: "Free Gift at Christmas",
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  "Festive Tree": {
    shortDescription: "Free Gift at Christmas",
    labelType: "vibrant",
    boostTypeIcon: lightning,
  },
  "Grinx's Hammer": {
    shortDescription: "Halves expansion costs",
    labelType: "vibrant",
    boostTypeIcon: lightning,
    boostedItemIcon: SUNNYSIDE.tools.hammer,
  },
  "Time Warp Totem": {
    shortDescription: "50% Reduction to Crop, Mineral, Cooking and Tree Time",
    labelType: "info",
    boostTypeIcon: SUNNYSIDE.icons.stopwatch,
  },

  // Marine Marvels with Boosts
  "Radiant Ray": {
    shortDescription: "+0.1 Iron",
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Iron.image,
  },
  "Gilded Swordfish": {
    shortDescription: translate("description.boost.gilded.swordfish"),
    labelType: "success",
    boostTypeIcon: powerup,
    boostedItemIcon: ITEM_DETAILS.Gold.image,
  },
};
