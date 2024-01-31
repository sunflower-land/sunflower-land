import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { BuffLabel } from ".";
import { BumpkinItem } from "./bumpkin";

import powerup from "assets/icons/level_up.png";
import lightning from "assets/icons/lightning.png";
import bee from "assets/icons/bee.webp";
import { ITEM_DETAILS } from "./images";

export const BUMPKIN_ITEM_BUFF_LABELS: Partial<Record<BumpkinItem, BuffLabel>> =
  {
    "Deep Sea Helm": {
      shortDescription: "3x chance Marine Marvels",
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
    "Banana Onesie": {
      shortDescription: "+20% Banana Speed",
      labelType: "info",
      boostTypeIcon: ITEM_DETAILS.Banana.image,
    },
    "Chef Apron": {
      shortDescription: "+20% Cake Profit",
      labelType: "success",
      boostTypeIcon: powerup,
    },
    "Fruit Picker Apron": {
      shortDescription: "+0.1 Fruit",
      labelType: "success",
      boostTypeIcon: powerup,
    },
    "Angel Wings": {
      shortDescription: "Instant Crops",
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
    "Devil Wings": {
      shortDescription: "Instant Crops",
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
    "Eggplant Onesie": {
      shortDescription: "+0.1 Eggplant",
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE.Eggplant.crop,
    },
    "Golden Spatula": {
      shortDescription: "+10% XP",
      labelType: "success",
      boostTypeIcon: powerup,
    },
    "Mushroom Hat": {
      shortDescription: "+0.1 Mushrooms",
      boostTypeIcon: powerup,
      labelType: "success",
      boostedItemIcon: SUNNYSIDE.resource.wild_mushroom,
    },
    Parsnip: {
      shortDescription: "+20% Parsnip",
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE.Parsnip.crop,
    },
    "Sunflower Amulet": {
      shortDescription: "+10% Sunflower",
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE.Sunflower.crop,
    },
    "Carrot Amulet": {
      shortDescription: "-20% Carrot growth time",
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: CROP_LIFECYCLE.Carrot.crop,
    },
    "Beetroot Amulet": {
      shortDescription: "+20% Beetroot",
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE.Beetroot.crop,
    },
    "Green Amulet": {
      shortDescription: "Chance 10x Crops",
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
    "Luna's Hat": {
      shortDescription: "-50% Cooking Time",
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    "Infernal Pitchfork": {
      shortDescription: "+3 Crops",
      labelType: "success",
      boostTypeIcon: powerup,
    },
    Cattlegrim: {
      shortDescription: "+0.25 Animal Produce",
      labelType: "success",
      boostTypeIcon: powerup,
    },
    "Corn Onesie": {
      shortDescription: "+0.1 Corn",
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
    },
    "Sunflower Rod": {
      shortDescription: "10% Chance +1 Fish",
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
    Trident: {
      shortDescription: "20% Chance +1 Fish",
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
    "Bucket O' Worms": {
      shortDescription: "+1 Worm",
      labelType: "success",
      boostTypeIcon: powerup,
    },
    "Luminous Anglerfish Topper": {
      shortDescription: "+50% Fish XP",
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
    "Angler Waders": {
      shortDescription: "+10 Fishing Limit",
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
    "Ancient Rod": {
      shortDescription: "Cast without rod",
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
    "Banana Amulet": {
      shortDescription: "+0.5 Bananas",
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Banana.image,
    },
    "Bee Suit": {
      shortDescription: "+0.1 Honey",
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Honey.image,
    },
    "Crimstone Hammer": {
      shortDescription: "+3 Crimstones on last mine",
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Crimstone.image,
    },
    "Crimstone Amulet": {
      shortDescription: "20% Crimstone speed ",
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Crimstone.image,
    },
    "Crimstone Armor": {
      shortDescription: "+0.1 Crimstones",
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Crimstone.image,
    },
    "Hornet Mask": {
      shortDescription: "2x chance Bee Swarm",
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: bee,
    },
  };
