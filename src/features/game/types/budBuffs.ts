import mainnetBuds from "lib/buds/buds";
import testnetBuds from "lib/buds/testnet-buds";

import { BuffLabel } from ".";
import { translate } from "lib/i18n/translate";

import powerup from "assets/icons/level_up.png";
import lightning from "assets/icons/lightning.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "./images";
import { CONFIG } from "lib/config";

const buds = CONFIG.NETWORK === "amoy" ? testnetBuds : mainnetBuds;

export const getBudTraits = (budId: number) => {
  const bud = buds[budId];

  return bud;
};

const getStemBoost = (stem: string) => {
  const buffs: BuffLabel[] = [];

  if (stem === "3 Leaf Clover") {
    buffs.push({
      shortDescription: translate("budBuff.stem.3leafClover.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  if (stem === "Fish Hat") {
    buffs.push({
      shortDescription: translate("budBuff.stem.fishHat.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    });
  }

  if (stem === "Diamond Gem") {
    buffs.push({
      shortDescription: translate("budBuff.stem.diamondGem.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  if (stem === "Gold Gem") {
    buffs.push({
      shortDescription: translate("budBuff.stem.goldGem.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Gold.image,
    });
  }

  if (stem === "Miner Hat") {
    buffs.push({
      shortDescription: translate("budBuff.stem.minerHat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Iron.image,
    });
  }

  if (stem === "Carrot Head") {
    buffs.push({
      shortDescription: translate("budBuff.stem.carrotHead.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Carrot.image,
    });
  }

  if (stem === "Sunflower Hat") {
    buffs.push({
      shortDescription: translate("budBuff.stem.sunflowerHat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Sunflower.image,
    });
  }

  if (stem === "Basic Leaf") {
    buffs.push({
      shortDescription: translate("budBuff.stem.basicLeafHat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  if (stem === "Ruby Gem") {
    buffs.push({
      shortDescription: translate("budBuff.stem.rubyGem.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Stone.image,
    });
  }

  if (stem === "Mushroom") {
    buffs.push({
      shortDescription: translate("budBuff.stem.mushroom.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.wild_mushroom,
    });
  }

  if (stem === "Magic Mushroom") {
    buffs.push({
      shortDescription: translate("budBuff.stem.magicMushroom.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.magic_mushroom,
    });
  }

  if (stem === "Acorn Hat") {
    buffs.push({
      shortDescription: translate("budBuff.stem.acornHat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Wood.image,
    });
  }

  if (stem === "Banana") {
    buffs.push({
      shortDescription: translate("budBuff.stem.banana.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  if (stem === "Tree Hat") {
    buffs.push({
      shortDescription: translate("budBuff.stem.treeHat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Wood.image,
    });
  }

  if (stem === "Egg Head") {
    buffs.push({
      shortDescription: translate("budBuff.stem.eggHead.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Egg.image,
    });
  }

  if (stem === "Apple Head") {
    buffs.push({
      shortDescription: translate("budBuff.stem.appleHead.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  return buffs;
};

const getAuraBoost = (aura: string) => {
  const buffs: BuffLabel[] = [];

  if (aura === "Basic") {
    buffs.push({
      shortDescription: translate("budBuff.aura.basic.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  if (aura === "Green") {
    buffs.push({
      shortDescription: translate("budBuff.aura.green.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  if (aura === "Rare") {
    buffs.push({
      shortDescription: translate("budBuff.aura.rare.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  if (aura === "Mythical") {
    buffs.push({
      shortDescription: translate("budBuff.aura.mythical.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  return buffs;
};

const getTypeBoost = (type: string) => {
  const buffs: BuffLabel[] = [];

  if (type === "Plaza") {
    buffs.push({
      shortDescription: translate("budBuff.type.plaza.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  if (type === "Woodlands") {
    buffs.push({
      shortDescription: translate("budBuff.type.woodlands.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Wood.image,
    });
  }

  if (type === "Cave") {
    buffs.push({
      shortDescription: translate("budBuff.type.cave.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  if (type === "Sea") {
    buffs.push({
      shortDescription: translate("budBuff.type.sea.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    });
  }

  if (type === "Castle") {
    buffs.push({
      shortDescription: translate("budBuff.type.castle.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  if (type === "Port") {
    buffs.push({
      shortDescription: translate("budBuff.type.port.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
    });
  }

  if (type === "Retreat") {
    buffs.push({
      shortDescription: translate("budBuff.type.retreat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  if (type === "Saphiro") {
    buffs.push({
      shortDescription: translate("budBuff.type.saphiro.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
    });
  }

  if (type === "Snow") {
    buffs.push({
      shortDescription: translate("budBuff.type.snow.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  if (type === "Beach") {
    buffs.push({
      shortDescription: translate("budBuff.type.beach.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
    });
  }

  return buffs;
};

export const getBudBuffs = (budId: number): BuffLabel[] => {
  const { type, stem, aura } = buds[budId];

  const typeBuffs = getTypeBoost(type);
  const stemBuffs = getStemBoost(stem);
  const auraBuffs = getAuraBoost(aura);

  return [...typeBuffs, ...stemBuffs, ...auraBuffs];
};
