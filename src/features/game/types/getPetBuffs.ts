import { getPetTraits } from "features/pets/data/getPetTraits";
import { BuffLabel } from ".";
import { translate } from "lib/i18n/translate";
import powerup from "assets/icons/level_up.png";
import lightning from "assets/icons/lightning.png";
import xpIcon from "assets/icons/xp.png";
import { AuraTrait, BibTrait, PetTraits } from "features/pets/data/types";

export const getPetAuraBoost = (aura: AuraTrait) => {
  const buffs: (BuffLabel & { trait: keyof PetTraits })[] = [];

  if (aura === "Common Aura") {
    buffs.push({
      trait: "aura",
      shortDescription: translate("petBuff.aura.basic"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: lightning,
    });
  }

  if (aura === "Rare Aura") {
    buffs.push({
      trait: "aura",
      shortDescription: translate("petBuff.aura.epic"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: lightning,
    });
  }

  if (aura === "Mythic Aura") {
    buffs.push({
      trait: "aura",
      shortDescription: translate("petBuff.aura.mega"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: lightning,
    });
  }

  return buffs;
};

export const getPetBibBoost = (bib: BibTrait) => {
  const buffs: (BuffLabel & { trait: keyof PetTraits })[] = [];

  if (bib === "Collar") {
    buffs.push({
      trait: "bib",
      shortDescription: translate("petBuff.bib.mid"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: xpIcon,
    });
  }

  if (bib === "Gold Necklace") {
    buffs.push({
      trait: "bib",
      shortDescription: translate("petBuff.bib.great"),
      labelType: "success",
      boostTypeIcon: powerup,
      boostedItemIcon: xpIcon,
    });
  }

  return buffs;
};

export function getPetBuffs(
  petId: number,
): (BuffLabel & { trait: keyof PetTraits })[] {
  const pet = getPetTraits(petId);
  if (!pet) return [];

  const { aura, bib } = pet;
  const auraBuffs = getPetAuraBoost(aura);
  const bibBuffs = getPetBibBoost(bib);

  return [...auraBuffs, ...bibBuffs];
}
