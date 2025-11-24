import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { BuffLabel } from ".";
import { BumpkinItem } from "./bumpkin";

import powerup from "assets/icons/level_up.png";
import lightning from "assets/icons/lightning.png";
import bee from "assets/icons/bee.webp";
import chefHat from "assets/icons/chef_hat.png";
import baits from "assets/composters/baits.png";
import { ITEM_DETAILS } from "./images";
import { translate } from "lib/i18n/translate";
import { getCurrentSeason, getSeasonalTicket, SEASONS } from "./seasons";
import { SEASON_ICONS } from "features/island/buildings/components/building/market/SeasonalSeeds";
import { isCollectible } from "../events/landExpansion/garbageSold";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { CHAPTER_TICKET_BOOST_ITEMS } from "../events/landExpansion/completeNPCChore";
import { getObjectEntries } from "../expansion/lib/utils";

export const SPECIAL_ITEM_LABELS: Partial<Record<BumpkinItem, BuffLabel[]>> = {
  Halo: [
    {
      shortDescription: translate("description.halo.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Gift Giver": [
    {
      shortDescription: translate("description.gift.giver.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Streamer Hat": [
    {
      shortDescription: translate("description.streamer.hat.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
};

export const BUMPKIN_ITEM_BUFF_LABELS: Partial<
  Record<BumpkinItem, BuffLabel[]>
> = {
  "Deep Sea Helm": [
    {
      shortDescription: translate("bumpkinItemBuff.deep.sea.helm"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Banana Onesie": [
    {
      shortDescription: translate("bumpkinItemBuff.banana.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Banana.image,
    },
  ],
  "Chef Apron": [
    {
      shortDescription: translate("bumpkinItemBuff.chef.apron.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Fruit Picker Apron": [
    {
      shortDescription: translate("bumpkinItemBuff.fruit.picker.apron.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Angel Wings": [
    {
      shortDescription: translate("bumpkinItemBuff.angel.wings.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Devil Wings": [
    {
      shortDescription: translate("bumpkinItemBuff.devil.wings.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Eggplant Onesie": [
    {
      shortDescription: translate("bumpkinItemBuff.eggplant.onesie.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Eggplant.crop,
    },
  ],
  "Golden Spatula": [
    {
      shortDescription: translate("bumpkinItemBuff.golden.spatula.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Mushroom Hat": [
    {
      shortDescription: translate("bumpkinItemBuff.mushroom.hat.boost"),
      boostTypeIcon: powerup,
      labelType: "success",
      boostedItemIcon: SUNNYSIDE.resource.wild_mushroom,
    },
  ],
  Parsnip: [
    {
      shortDescription: translate("bumpkinItemBuff.parsnip.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Parsnip.crop,
    },
  ],
  "Sunflower Shield": [
    {
      shortDescription: translate("bumpkinItemBuff.sunflower.shield.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Sunflower.crop,
    },
  ],
  "Sunflower Amulet": [
    {
      shortDescription: translate("bumpkinItemBuff.sunflower.amulet.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Sunflower.crop,
    },
  ],
  "Carrot Amulet": [
    {
      shortDescription: translate("bumpkinItemBuff.carrot.amulet.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Carrot.crop,
    },
  ],
  "Beetroot Amulet": [
    {
      shortDescription: translate("bumpkinItemBuff.beetroot.amulet.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Beetroot.crop,
    },
  ],
  "Green Amulet": [
    {
      shortDescription: translate("bumpkinItemBuff.green.amulet.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Luna's Hat": [
    {
      shortDescription: translate("bumpkinItemBuff.Luna.s.hat.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: chefHat,
    },
  ],
  "Infernal Pitchfork": [
    {
      shortDescription: translate("bumpkinItemBuff.infernal.pitchfork.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  Cattlegrim: [
    {
      shortDescription: translate("bumpkinItemBuff.cattlegrim.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Corn Onesie": [
    {
      shortDescription: translate("bumpkinItemBuff.corn.onesie.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Corn.crop,
    },
  ],
  "Sunflower Rod": [
    {
      shortDescription: translate("bumpkinItemBuff.sunflower.rod.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
  ],
  Trident: [
    {
      shortDescription: translate("bumpkinItemBuff.trident.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
  ],
  "Bucket O' Worms": [
    {
      shortDescription: translate("bumpkinItemBuff.bucket.o.worms.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Luminous Anglerfish Topper": [
    {
      shortDescription: translate(
        "bumpkinItemBuff.luminous.anglerfish.topper.boost",
      ),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
  ],
  "Angler Waders": [
    {
      shortDescription: translate("bumpkinItemBuff.angler.waders.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS["Rod"].image,
    },
  ],
  "Ancient Rod": [
    {
      shortDescription: translate("bumpkinItemBuff.ancient.rod.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
  ],
  "Banana Amulet": [
    {
      shortDescription: translate("bumpkinItemBuff.banana.amulet.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Banana.image,
    },
  ],
  "Bee Suit": [
    {
      shortDescription: translate("bumpkinItemBuff.bee.suit"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Honey.image,
    },
  ],
  "Crimstone Hammer": [
    {
      shortDescription: translate("bumpkinItemBuff.crimstone.hammer"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Crimstone.image,
    },
  ],
  "Crimstone Amulet": [
    {
      shortDescription: translate("bumpkinItemBuff.crimstone.amulet"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Crimstone.image,
    },
  ],
  "Crimstone Armor": [
    {
      shortDescription: translate("bumpkinItemBuff.crimstone.armor"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Crimstone.image,
    },
  ],
  "Hornet Mask": [
    {
      shortDescription: translate("bumpkinItemBuff.hornet.mask"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: bee,
    },
  ],
  "Honeycomb Shield": [
    {
      shortDescription: translate("bumpkinItemBuff.honeycomb.shield"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Honey.image,
    },
  ],
  "Flower Crown": [
    {
      shortDescription: translate("bumpkinItemBuff.flower.crown"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
    },
  ],
  "Beekeeper Hat": [
    {
      shortDescription: translate("description.beekeeper.hat.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Honey.image,
    },
  ],
  "Non La Hat": [
    {
      shortDescription: translate("description.non.la.hat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Rice.image,
    },
  ],
  "Oil Can": [
    {
      shortDescription: translate("description.oil.can.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Oil.image,
    },
  ],
  "Paw Shield": [
    {
      shortDescription: translate("description.paw.shield.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Olive Shield": [
    {
      shortDescription: translate("description.olive.shield.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Olive.image,
    },
  ],
  Pan: [
    {
      shortDescription: translate("description.pan.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Olive Royalty Shirt": [
    {
      shortDescription: translate("description.olive.shirt.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Olive.image,
    },
  ],
  "Tofu Mask": [
    {
      shortDescription: translate("description.tofu.mask.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Soybean.image,
    },
  ],
  "Goblin Armor": [
    {
      shortDescription: translate("bumpkinItemBuff.goblin.armor"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Goblin Helmet": [
    {
      shortDescription: translate("bumpkinItemBuff.goblin.helmet"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Goblin Pants": [
    {
      shortDescription: translate("bumpkinItemBuff.goblin.pants"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Goblin Sabatons": [
    {
      shortDescription: translate("bumpkinItemBuff.goblin.sabatons"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Goblin Axe": [
    {
      shortDescription: translate("bumpkinItemBuff.goblin.axe"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Nightshade Armor": [
    {
      shortDescription: translate("bumpkinItemBuff.nightshade.armor"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Nightshade Helmet": [
    {
      shortDescription: translate("bumpkinItemBuff.nightshade.helmet"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Nightshade Pants": [
    {
      shortDescription: translate("bumpkinItemBuff.nightshade.pants"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Nightshade Sabatons": [
    {
      shortDescription: translate("bumpkinItemBuff.nightshade.sabatons"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Nightshade Sword": [
    {
      shortDescription: translate("bumpkinItemBuff.nightshade.sword"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Bumpkin Armor": [
    {
      shortDescription: translate("bumpkinItemBuff.bumpkin.armor"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Bumpkin Helmet": [
    {
      shortDescription: translate("bumpkinItemBuff.bumpkin.helmet"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Bumpkin Sword": [
    {
      shortDescription: translate("bumpkinItemBuff.bumpkin.sword"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Bumpkin Pants": [
    {
      shortDescription: translate("bumpkinItemBuff.bumpkin.pants"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Bumpkin Sabatons": [
    {
      shortDescription: translate("bumpkinItemBuff.bumpkin.sabatons"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Sunflorian Armor": [
    {
      shortDescription: translate("bumpkinItemBuff.sunflorian.armor"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Sunflorian Sword": [
    {
      shortDescription: translate("bumpkinItemBuff.sunflorian.sword"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Sunflorian Helmet": [
    {
      shortDescription: translate("bumpkinItemBuff.sunflorian.helmet"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Sunflorian Pants": [
    {
      shortDescription: translate("bumpkinItemBuff.sunflorian.pants"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Sunflorian Sabatons": [
    {
      shortDescription: translate("bumpkinItemBuff.sunflorian.sabatons"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Camel Onesie": [
    {
      shortDescription: translate("description.camel.onesie.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Crab Trap": [
    {
      shortDescription: translate("bumpkinItemBuff.crab.trap"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Crab.image,
    },
  ],
  "Lemon Shield": [
    {
      shortDescription: translate("bumpkinItemBuff.lemon.shield.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Lemon.image,
    },
  ],
  "Infernal Drill": [
    {
      shortDescription: translate("bumpkinItemBuff.infernal.drill.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: ITEM_DETAILS.Oil.image,
    },
  ],
  "Ancient Shovel": [
    {
      shortDescription: translate("bumpkinItemBuff.ancient.shovel.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: ITEM_DETAILS["Sand Shovel"].image,
    },
  ],
  "Oil Overalls": [
    {
      shortDescription: translate("bumpkinItemBuff.oil.overalls.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Oil.image,
    },
  ],
  "Dev Wrench": [
    {
      shortDescription: translate("bumpkinItemBuff.dev.wrench.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Oil.image,
    },
  ],
  "Bionic Drill": [
    {
      shortDescription: translate("bumpkinItemBuff.bionic.drill"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.tools.sand_shovel,
    },
  ],
  "Grape Pants": [
    {
      shortDescription: translate("bumpkinItemBuff.grape.pants"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Grape.image,
    },
  ],
  "Pirate Potion": [
    {
      shortDescription: translate("bumpkinItemBuff.pirate.potion"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: ITEM_DETAILS["Pirate Bounty"].image,
    },
  ],
  "Bumpkin Crown": [
    {
      shortDescription: translate("bumpkinItemBuff.bumpkin.crown.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.ui.coins,
    },
    {
      shortDescription: translate("bumpkinItemBuff.bumpkin.crown.boost.two"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Goblin Crown": [
    {
      shortDescription: translate("bumpkinItemBuff.goblin.crown.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.ui.coins,
    },
    {
      shortDescription: translate("bumpkinItemBuff.goblin.crown.boost.two"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Nightshade Crown": [
    {
      shortDescription: translate("bumpkinItemBuff.nightshade.crown.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.ui.coins,
    },
    {
      shortDescription: translate("bumpkinItemBuff.nightshade.crown.boost.two"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Sunflorian Crown": [
    {
      shortDescription: translate("bumpkinItemBuff.sunflorian.crown.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.ui.coins,
    },
    {
      shortDescription: translate("bumpkinItemBuff.sunflorian.crown.boost.two"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  ],
  "Bumpkin Shield": [
    {
      shortDescription: translate("bumpkinItemBuff.bumpkin.shield.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Wood.image,
    },
  ],
  "Goblin Shield": [
    {
      shortDescription: translate("bumpkinItemBuff.goblin.shield.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Wood.image,
    },
  ],
  "Nightshade Shield": [
    {
      shortDescription: translate("bumpkinItemBuff.nightshade.shield.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Wood.image,
    },
  ],
  "Sunflorian Shield": [
    {
      shortDescription: translate("bumpkinItemBuff.sunflorian.shield.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Wood.image,
    },
  ],
  "Bumpkin Quiver": [
    {
      shortDescription: translate("bumpkinItemBuff.bumpkin.quiver.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Sunflower.image,
    },
  ],
  "Goblin Quiver": [
    {
      shortDescription: translate("bumpkinItemBuff.goblin.quiver.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Sunflower.image,
    },
  ],
  "Nightshade Quiver": [
    {
      shortDescription: translate("bumpkinItemBuff.nightshade.quiver.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Sunflower.image,
    },
  ],
  "Sunflorian Quiver": [
    {
      shortDescription: translate("bumpkinItemBuff.sunflorian.quiver.boost"),
      labelType: "vibrant",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Sunflower.image,
    },
  ],
  "Bumpkin Medallion": [
    {
      shortDescription: translate("bumpkinItemBuff.bumpkin.medallion.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: chefHat,
    },
  ],
  "Goblin Medallion": [
    {
      shortDescription: translate("bumpkinItemBuff.goblin.medallion.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: chefHat,
    },
  ],
  "Nightshade Medallion": [
    {
      shortDescription: translate("bumpkinItemBuff.nightshade.medallion.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: chefHat,
    },
  ],
  "Sunflorian Medallion": [
    {
      shortDescription: translate("bumpkinItemBuff.sunflorian.medallion.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: chefHat,
    },
  ],
  "Milk Apron": [
    {
      shortDescription: translate("description.milkApron.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.milk,
    },
  ],
  "Dream Scarf": [
    {
      shortDescription: translate("description.dreamScarf.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: SUNNYSIDE.animals.sheepSleeping,
    },
  ],
  "Infernal Bullwhip": [
    {
      shortDescription: translate("description.infernalBullwhip.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.animalFoods.kernel_blend,
    },
  ],
  "Chicken Suit": [
    {
      shortDescription: translate("description.chickenSuit.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.feather,
    },
  ],
  "Cowbell Necklace": [
    {
      shortDescription: translate("description.cowbellNecklace.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.milk,
    },
  ],
  "Black Sheep Onesie": [
    {
      shortDescription: translate("description.blackSheepOnesie.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.wool,
    },
  ],
  "Merino Jumper": [
    {
      shortDescription: translate("description.merinoJumper.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.merino_wool,
    },
  ],
  "White Sheep Onesie": [
    {
      shortDescription: translate("description.whiteSheepOnesie.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.wool,
    },
  ],
  "Ladybug Suit": [
    {
      shortDescription: translate("description.ladybugSuit.boost"),
      labelType: "success",
      boostTypeIcon: SUNNYSIDE.ui.coins,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Onion.crop,
    },
  ],
  "Crab Hat": [
    {
      shortDescription: translate("description.crabHat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
  ],
  Sickle: [
    {
      shortDescription: translate("description.sickle.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE["Basic Biome"].Wheat.crop,
    },
  ],
  "Sol & Luna": [
    {
      shortDescription: translate("description.solAndLuna.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Crafting Box"].image,
    },
  ],
  "Blossom Ward": [
    {
      shortDescription: translate("description.blossomWard.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SEASON_ICONS["spring"],
    },
  ],
  "Solflare Aegis": [
    {
      shortDescription: translate("description.solflareAegis.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SEASON_ICONS["summer"],
    },
  ],
  "Autumn's Embrace": [
    {
      shortDescription: translate("description.autumnsEmbrace.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: SEASON_ICONS["autumn"],
    },
  ],
  "Frozen Heart": [
    {
      shortDescription: translate("description.frozenHeart.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: SEASON_ICONS["winter"],
    },
  ],
  "Oracle Syringe": [
    {
      shortDescription: translate("description.oracleSyringe.boost"),
      labelType: "success",
      boostTypeIcon: lightning,
    },
  ],
  "Obsidian Necklace": [
    {
      shortDescription: translate("description.obsidianNecklace.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Medic Apron": [
    {
      shortDescription: translate("description.medicApron.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
  ],
  "Broccoli Hat": [
    {
      shortDescription: translate("description.broccoliHat.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Red Pepper Onesie": [
    {
      shortDescription: translate("description.redPepperOnesie.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Turd Topper": [
    {
      shortDescription: translate("description.turdTopper.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS["Rapid Root"].image,
    },
  ],
  "Lava Swimwear": [
    {
      shortDescription: translate("bumpkinItemBuff.lava.swimwear.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: ITEM_DETAILS["Lava Pit"].image,
    },
  ],
  "Oil Gallon": [
    {
      shortDescription: translate("bumpkinItemBuff.oil.gallon.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS["Oil"].image,
    },
  ],
  "Architect Ruler": [
    {
      shortDescription: translate("description.architectRuler.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Crafting Box"].image,
    },
  ],
  "Pickaxe Shark": [
    {
      shortDescription: translate("description.pickaxeShark.boost.1"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Gold"].image,
    },
    {
      shortDescription: translate("description.pickaxeShark.boost.2"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Gold"].image,
    },
  ],

  "Saw Fish": [
    {
      shortDescription: translate("description.sawFish.boost.one"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
    {
      shortDescription: translate("description.sawFish.boost.two"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: baits,
    },
  ],
  "Luna's Crescent": [
    {
      shortDescription: translate("description.lunarWeapon.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
  ],
  "Master Chef's Cleaver": [
    {
      shortDescription: translate("description.cleaverKnife.boost.1"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    {
      shortDescription: translate("description.cleaverKnife.boost.2"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
  ],
  "Training Whistle": [
    {
      shortDescription: translate("description.trainingWhistle.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.leather,
    },
  ],
  "Squirrel Onesie": [
    {
      shortDescription: translate("description.squirrelOnesie.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.acorn,
    },
  ],
  ...SPECIAL_ITEM_LABELS,
  ...Object.fromEntries(
    getObjectEntries(CHAPTER_TICKET_BOOST_ITEMS)
      .filter(([chapter]) => getCurrentSeason() === chapter)
      .flatMap(([chapter, items]) => {
        const ticket = getSeasonalTicket(new Date(SEASONS[chapter].startDate));
        const translationKey =
          `description.bonus${ticket.replace(/\s+/g, "")}.boost` as TranslationKeys;

        return Object.values(items)
          .filter((item) => !isCollectible(item))
          .map((item) => [
            item,
            [
              {
                shortDescription: translate(translationKey),
                labelType: "success",
                boostTypeIcon: powerup,
                boostedItemIcon: ITEM_DETAILS[ticket].image,
              },
            ],
          ]);
      }),
  ),
};
