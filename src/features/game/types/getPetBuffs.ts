import { getPetTraits } from "features/pets/data/getPetTraits";
import { BuffLabel } from ".";
import { translate } from "lib/i18n/translate";
import powerup from "assets/icons/level_up.png";
import lightning from "assets/icons/lightning.png";
import xpIcon from "assets/icons/xp.png";
import { AuraTrait, BibTrait } from "features/pets/data/types";

const getPetAuraBoost = (aura: AuraTrait) => {
  const buffs: BuffLabel[] = [];

  if (aura === "Basic Aura") {
    buffs.push({
      shortDescription: translate("petBuff.aura.basic"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: lightning,
    });
  }

  if (aura === "Epic Aura") {
    buffs.push({
      shortDescription: translate("petBuff.aura.epic"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: lightning,
    });
  }

  if (aura === "Mega Aura") {
    buffs.push({
      shortDescription: translate("petBuff.aura.mega"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: lightning,
    });
  }

  return buffs;
};

const getPetBibBoost = (bib: BibTrait) => {
  const buffs: BuffLabel[] = [];

  if (bib === "Collar") {
    buffs.push({
      shortDescription: translate("petBuff.bib.mid"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: xpIcon,
    });
  }

  if (bib === "Gold Necklace") {
    buffs.push({
      shortDescription: translate("petBuff.bib.great"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: xpIcon,
    });
  }

  return buffs;
};

export function getPetBuffs(petId: number): BuffLabel[] {
  const pet = getPetTraits(petId);
  if (!pet) return [];

  const { aura, bib } = pet;
  const auraBuffs = getPetAuraBoost(aura);
  const bibBuffs = getPetBibBoost(bib);

  return [...auraBuffs, ...bibBuffs];
}
