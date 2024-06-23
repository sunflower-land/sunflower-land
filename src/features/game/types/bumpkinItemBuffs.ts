import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { BuffLabel } from ".";
import { BumpkinItem } from "./bumpkin";

import powerup from "assets/icons/level_up.png";
import lightning from "assets/icons/lightning.png";
import bee from "assets/icons/bee.webp";
import { ITEM_DETAILS } from "./images";
import { translate } from "lib/i18n/translate";

export const BUMPKIN_ITEM_BUFF_LABELS: Partial<Record<BumpkinItem, BuffLabel>> =
  {
    "Deep Sea Helm": {
      shortDescription: translate("bumpkinItemBuff.deep.sea.helm"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
    "Banana Onesie": {
      shortDescription: translate("bumpkinItemBuff.banana.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Banana.image,
    },
    "Chef Apron": {
      shortDescription: translate("bumpkinItemBuff.chef.apron.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    "Fruit Picker Apron": {
      shortDescription: translate("bumpkinItemBuff.fruit.picker.apron.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    "Angel Wings": {
      shortDescription: translate("bumpkinItemBuff.angel.wings.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
    "Devil Wings": {
      shortDescription: translate("bumpkinItemBuff.devil.wings.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
    "Eggplant Onesie": {
      shortDescription: translate("bumpkinItemBuff.eggplant.onesie.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE.Eggplant.crop,
    },
    "Golden Spatula": {
      shortDescription: translate("bumpkinItemBuff.golden.spatula.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    "Mushroom Hat": {
      shortDescription: translate("bumpkinItemBuff.mushroom.hat.boost"),
      boostTypeIcon: powerup,
      labelType: "success",
      boostedItemIcon: SUNNYSIDE.resource.wild_mushroom,
    },
    Parsnip: {
      shortDescription: translate("bumpkinItemBuff.parsnip.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE.Parsnip.crop,
    },
    "Sunflower Amulet": {
      shortDescription: translate("bumpkinItemBuff.sunflower.amulet.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE.Sunflower.crop,
    },
    "Carrot Amulet": {
      shortDescription: translate("bumpkinItemBuff.carrot.amulet.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: CROP_LIFECYCLE.Carrot.crop,
    },
    "Beetroot Amulet": {
      shortDescription: translate("bumpkinItemBuff.beetroot.amulet.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE.Beetroot.crop,
    },
    "Green Amulet": {
      shortDescription: translate("bumpkinItemBuff.green.amulet.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
    },
    "Luna's Hat": {
      shortDescription: translate("bumpkinItemBuff.Luna.s.hat.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    },
    "Infernal Pitchfork": {
      shortDescription: translate("bumpkinItemBuff.infernal.pitchfork.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    Cattlegrim: {
      shortDescription: translate("bumpkinItemBuff.cattlegrim.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    "Corn Onesie": {
      shortDescription: translate("bumpkinItemBuff.corn.onesie.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: CROP_LIFECYCLE.Corn.crop,
    },
    "Sunflower Rod": {
      shortDescription: translate("bumpkinItemBuff.sunflower.rod.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
    Trident: {
      shortDescription: translate("bumpkinItemBuff.trident.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
    "Bucket O' Worms": {
      shortDescription: translate("bumpkinItemBuff.bucket.o.worms.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    "Luminous Anglerfish Topper": {
      shortDescription: translate(
        "bumpkinItemBuff.luminous.anglerfish.topper.boost"
      ),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
    "Angler Waders": {
      shortDescription: translate("bumpkinItemBuff.angler.waders.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
    "Ancient Rod": {
      shortDescription: translate("bumpkinItemBuff.ancient.rod.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    },
    "Banana Amulet": {
      shortDescription: translate("bumpkinItemBuff.banana.amulet.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Banana.image,
    },
    "Bee Suit": {
      shortDescription: translate("bumpkinItemBuff.bee.suit"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Honey.image,
    },
    "Crimstone Hammer": {
      shortDescription: translate("bumpkinItemBuff.crimstone.hammer"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Crimstone.image,
    },
    "Crimstone Amulet": {
      shortDescription: translate("bumpkinItemBuff.crimstone.amulet"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Crimstone.image,
    },
    "Crimstone Armor": {
      shortDescription: translate("bumpkinItemBuff.crimstone.armor"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Crimstone.image,
    },
    "Hornet Mask": {
      shortDescription: translate("bumpkinItemBuff.hornet.mask"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: bee,
    },
    "Honeycomb Shield": {
      shortDescription: translate("bumpkinItemBuff.honeycomb.shield"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Honey.image,
    },
    "Flower Crown": {
      shortDescription: translate("bumpkinItemBuff.flower.crown"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS["Red Pansy"].image,
    },
    "Beekeeper Hat": {
      shortDescription: translate("description.beekeeper.hat.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostedItemIcon: ITEM_DETAILS.Honey.image,
    },
    "Non La Hat": {
      shortDescription: translate("description.non.la.hat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Rice.image,
    },
    "Oil Can": {
      shortDescription: translate("description.oil.can.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Oil.image,
    },
    "Paw Shield": {
      shortDescription: translate("description.paw.shield.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    "Olive Shield": {
      shortDescription: translate("description.olive.shield.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Olive.image,
    },
    Pan: {
      shortDescription: translate("description.pan.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    },
    "Olive Royalty Shirt": {
      shortDescription: translate("description.olive.shirt.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Olive.image,
    },
    "Tofu Mask": {
      shortDescription: translate("description.tofu.mask.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Soybean.image,
    },
    "Goblin Armor": {
      shortDescription: translate("bumpkinItemBuff.goblin.armor"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Goblin Helmet": {
      shortDescription: translate("bumpkinItemBuff.goblin.helmet"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Goblin Pants": {
      shortDescription: translate("bumpkinItemBuff.goblin.pants"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Goblin Sabatons": {
      shortDescription: translate("bumpkinItemBuff.goblin.sabatons"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Goblin Axe": {
      shortDescription: translate("bumpkinItemBuff.goblin.axe"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Nightshade Armor": {
      shortDescription: translate("bumpkinItemBuff.nightshade.armor"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Nightshade Helmet": {
      shortDescription: translate("bumpkinItemBuff.nightshade.helmet"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Nightshade Pants": {
      shortDescription: translate("bumpkinItemBuff.nightshade.pants"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Nightshade Sabatons": {
      shortDescription: translate("bumpkinItemBuff.nightshade.sabatons"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Nightshade Sword": {
      shortDescription: translate("bumpkinItemBuff.nightshade.sword"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Bumpkin Armor": {
      shortDescription: translate("bumpkinItemBuff.bumpkin.armor"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Bumpkin Helmet": {
      shortDescription: translate("bumpkinItemBuff.bumpkin.helmet"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Bumpkin Sword": {
      shortDescription: translate("bumpkinItemBuff.bumpkin.sword"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Bumpkin Pants": {
      shortDescription: translate("bumpkinItemBuff.bumpkin.pants"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Bumpkin Sabatons": {
      shortDescription: translate("bumpkinItemBuff.bumpkin.sabatons"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Sunflorian Armor": {
      shortDescription: translate("bumpkinItemBuff.sunflorian.armor"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Sunflorian Sword": {
      shortDescription: translate("bumpkinItemBuff.sunflorian.sword"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Sunflorian Helmet": {
      shortDescription: translate("bumpkinItemBuff.sunflorian.helmet"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Sunflorian Pants": {
      shortDescription: translate("bumpkinItemBuff.sunflorian.pants"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
    "Sunflorian Sabatons": {
      shortDescription: translate("bumpkinItemBuff.sunflorian.sabatons"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Mark.image,
    },
  };
