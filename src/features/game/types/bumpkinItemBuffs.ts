import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { BuffLabel } from ".";
import { BumpkinItem } from "./bumpkin";

import powerup from "assets/icons/level_up.png";
import lightning from "assets/icons/lightning.png";
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
      boostTypeIcon: ITEM_DETAILS.Banana.image,
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
  };
