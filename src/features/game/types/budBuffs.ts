import mainnetBuds from "lib/buds/buds";
import testnetBuds from "lib/buds/testnet-buds";

import { BuffLabel } from ".";
import type { Bud } from "./buds";
import { AdditionalBoostInfoBuffLabel } from "./collectibleItemBuffs";
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
  const buffs: AdditionalBoostInfoBuffLabel[] = [];

  if (stem === "3 Leaf Clover") {
    buffs.push({
      shortDescription: translate("budBuff.stem.3leafClover.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "yield",
      boostValue: "+0.5",
      boostOn: "crops",
    });
  }

  if (stem === "Fish Hat") {
    buffs.push({
      shortDescription: translate("budBuff.stem.fishHat.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.fish,
      boostType: "other",
    });
  }

  if (stem === "Diamond Gem") {
    buffs.push({
      shortDescription: translate("budBuff.stem.diamondGem.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "yield",
      boostValue: "+0.2",
    });
  }

  if (stem === "Gold Gem") {
    buffs.push({
      shortDescription: translate("budBuff.stem.goldGem.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Gold.image,
      boostType: "yield",
      boostValue: "+0.2",
    });
  }

  if (stem === "Miner Hat") {
    buffs.push({
      shortDescription: translate("budBuff.stem.minerHat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Iron.image,
      boostType: "yield",
      boostValue: "+0.2",
    });
  }

  if (stem === "Carrot Head") {
    buffs.push({
      shortDescription: translate("budBuff.stem.carrotHead.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Carrot.image,
      boostType: "yield",
      boostValue: "+0.3",
      boostOn: "crops",
    });
  }

  if (stem === "Sunflower Hat") {
    buffs.push({
      shortDescription: translate("budBuff.stem.sunflowerHat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Sunflower.image,
      boostType: "yield",
      boostValue: "+0.5",
      boostOn: "crops",
    });
  }

  if (stem === "Basic Leaf") {
    buffs.push({
      shortDescription: translate("budBuff.stem.basicLeafHat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "yield",
      boostValue: "+0.2",
      boostOn: "crops",
    });
  }

  if (stem === "Ruby Gem") {
    buffs.push({
      shortDescription: translate("budBuff.stem.rubyGem.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Stone.image,
      boostType: "yield",
      boostValue: "+0.2",
    });
  }

  if (stem === "Mushroom") {
    buffs.push({
      shortDescription: translate("budBuff.stem.mushroom.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.wild_mushroom,
      boostType: "yield",
      boostValue: "+0.3",
    });
  }

  if (stem === "Magic Mushroom") {
    buffs.push({
      shortDescription: translate("budBuff.stem.magicMushroom.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.resource.magic_mushroom,
      boostType: "yield",
      boostValue: "+0.2",
    });
  }

  if (stem === "Acorn Hat") {
    buffs.push({
      shortDescription: translate("budBuff.stem.acornHat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Wood.image,
      boostType: "yield",
      boostValue: "+0.1",
    });
  }

  if (stem === "Banana") {
    buffs.push({
      shortDescription: translate("budBuff.stem.banana.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "yield",
      boostValue: "+0.2",
      boostOn: "fruits",
    });
  }

  if (stem === "Tree Hat") {
    buffs.push({
      shortDescription: translate("budBuff.stem.treeHat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Wood.image,
      boostType: "yield",
      boostValue: "+0.2",
    });
  }

  if (stem === "Egg Head") {
    buffs.push({
      shortDescription: translate("budBuff.stem.eggHead.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Egg.image,
      boostType: "yield",
      boostValue: "+0.2",
    });
  }

  if (stem === "Apple Head") {
    buffs.push({
      shortDescription: translate("budBuff.stem.appleHead.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "yield",
      boostValue: "+0.2",
      boostOn: "fruits",
    });
  }

  return buffs;
};

/** Numeric multiplier used in game logic (getBudYieldBoosts). Used to show effective % in modal. */
const getAuraMultiplier = (aura: string): number => {
  if (aura === "Basic") return 1.05;
  if (aura === "Green") return 1.2;
  if (aura === "Rare") return 2;
  if (aura === "Mythical") return 5;
  return 1;
};

/**
 * Apply aura multiplier to a boostValue string so the modal shows effective boost.
 * - x0.9-style time multipliers use: 1 - (1 - mult) * aura (e.g. x0.9 with aura 1.2 → x0.88).
 * - Other formats (+/-, %, plain decimals) are scaled by the aura multiplier unchanged.
 */
const applyAuraToBoostValue = (
  boostValue: string,
  auraMultiplier: number,
): string => {
  if (auraMultiplier === 1) return boostValue;

  const xMatch = boostValue.match(/^x(\d+(?:\.\d+)?)$/);
  if (xMatch) {
    const multiplier = Number(xMatch[1]);
    const effective = 1 - (1 - multiplier) * auraMultiplier;
    const clamped = Math.max(0.01, Math.min(1, effective));
    return `x${clamped.toFixed(2)}`;
  }

  const match = boostValue.match(/^([+-]?)(\d+(?:\.\d+)?)(%?)$/);
  if (!match) return boostValue;
  const [, _sign, numStr, pct] = match;
  const num = Number(numStr);
  const isPercent = pct === "%";
  const decimal = isPercent ? num / 100 : num;
  const effective = decimal * auraMultiplier;
  const signChar = effective >= 0 ? "+" : "";
  return isPercent
    ? `${signChar}${(effective * 100).toFixed(1)}%`
    : `${signChar}${effective.toFixed(2)}`;
};

const getAuraBoost = (aura: string) => {
  const buffs: AdditionalBoostInfoBuffLabel[] = [];

  if (aura === "Basic") {
    buffs.push({
      shortDescription: translate("budBuff.aura.basic.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "other",
      boostValue: "+5%",
    });
  }

  if (aura === "Green") {
    buffs.push({
      shortDescription: translate("budBuff.aura.green.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "other",
      boostValue: "+20%",
    });
  }

  if (aura === "Rare") {
    buffs.push({
      shortDescription: translate("budBuff.aura.rare.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "other",
      boostValue: "+100%",
    });
  }

  if (aura === "Mythical") {
    buffs.push({
      shortDescription: translate("budBuff.aura.mythical.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "other",
      boostValue: "+400%",
    });
  }

  return buffs;
};

const getTypeBoost = (type: string) => {
  const buffs: AdditionalBoostInfoBuffLabel[] = [];

  if (type === "Plaza") {
    buffs.push({
      shortDescription: translate("budBuff.type.plaza.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "yield",
      boostValue: "+0.3",
      boostOn: "crops",
    });
  }

  if (type === "Woodlands") {
    buffs.push({
      shortDescription: translate("budBuff.type.woodlands.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: ITEM_DETAILS.Wood.image,
      boostType: "yield",
      boostValue: "+0.2",
    });
  }

  if (type === "Cave") {
    buffs.push({
      shortDescription: translate("budBuff.type.cave.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "yield",
      boostValue: "+0.2",
    });
  }

  if (type === "Sea") {
    buffs.push({
      shortDescription: translate("budBuff.type.sea.boost"),
      labelType: "vibrant",
      boostTypeIcon: lightning,
      boostedItemIcon: SUNNYSIDE.icons.fish,
      boostType: "other",
    });
  }

  if (type === "Castle") {
    buffs.push({
      shortDescription: translate("budBuff.type.castle.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "yield",
      boostValue: "+0.3",
      boostOn: "crops",
    });
  }

  if (type === "Port") {
    buffs.push({
      shortDescription: translate("budBuff.type.port.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: SUNNYSIDE.icons.fish,
      boostType: "xp",
      boostValue: "+10%",
      boostOn: "food",
    });
  }

  if (type === "Retreat") {
    buffs.push({
      shortDescription: translate("budBuff.type.retreat.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "yield",
      boostValue: "+0.2",
    });
  }

  if (type === "Saphiro") {
    buffs.push({
      shortDescription: translate("budBuff.type.saphiro.boost"),
      labelType: "info",
      boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      boostType: "time",
      boostValue: "x0.9",
      boostOn: "crops",
    });
  }

  if (type === "Snow") {
    buffs.push({
      shortDescription: translate("budBuff.type.snow.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "yield",
      boostValue: "+0.3",
      boostOn: "crops",
    });
  }

  if (type === "Beach") {
    buffs.push({
      shortDescription: translate("budBuff.type.beach.boost"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostType: "yield",
      boostValue: "+0.2",
      boostOn: "fruits",
    });
  }

  return buffs;
};

/**
 * Returns buff labels for display (e.g. boost modal).
 * Uses budFromState when provided (player's actual traits) so aura percentage
 * is correct; otherwise falls back to mainnet bud data.
 */
export const getBudBuffs = (budId: number, budFromState?: Bud): BuffLabel[] => {
  const bud = budFromState ?? buds[budId];
  if (!bud) {
    return [];
  }

  const { type, stem, aura } = bud;

  const typeBuffs = getTypeBoost(type);
  const stemBuffs = getStemBoost(stem);
  const auraBuffs = getAuraBoost(aura);

  const auraMultiplier = getAuraMultiplier(aura);
  const applyAura = (buffs: AdditionalBoostInfoBuffLabel[]) =>
    buffs.map((buff) =>
      buff.boostValue
        ? {
            ...buff,
            boostValue: applyAuraToBoostValue(buff.boostValue, auraMultiplier),
          }
        : buff,
    );

  return [...applyAura(typeBuffs), ...applyAura(stemBuffs), ...auraBuffs];
};
