import type { PetCategoryName, PetType } from "features/game/types/pets";
import type { PetTraits } from "features/pets/data/types";
import { toTraitValueId } from "features/marketplace/lib/marketplaceFilters";
import type { TranslationKeys } from "lib/i18n/dictionaries/types";
import { translate } from "lib/i18n/translate";

export const getPetTypeLabel = (type: PetType) =>
  translate(`pet.breed.${toTraitValueId(type)}` as TranslationKeys);

export const getPetCategoryLabel = (category: PetCategoryName) =>
  translate(`pet.category.${toTraitValueId(category)}` as TranslationKeys);

const TRAIT_VALUE_PREFIX: Record<Exclude<keyof PetTraits, "type">, string> = {
  fur: "colour",
  accessory: "pet.accessory",
  bib: "pet.bib",
  aura: "pet.aura",
};

const TRAIT_NAME_KEY: Record<
  Exclude<keyof PetTraits, "type" | "aura">,
  TranslationKeys
> = {
  fur: "filter.fur",
  accessory: "filter.accessory",
  bib: "filter.bib",
};

export const getPetTraitValueLabel = (
  trait: Exclude<keyof PetTraits, "type">,
  value: string,
) => {
  // pet.aura.no-aura reads "None" for the marketplace filter, too bare here
  if (trait === "aura" && value === "No Aura") return translate("pets.noAura");

  return translate(
    `${TRAIT_VALUE_PREFIX[trait]}.${toTraitValueId(value)}` as TranslationKeys,
  );
};

export const getPetTraitLabel = (
  trait: Exclude<keyof PetTraits, "type">,
  value: string,
) => {
  const valueLabel = getPetTraitValueLabel(trait, value);

  if (trait === "aura") return valueLabel;

  return translate("pets.traitLabel", {
    value: valueLabel,
    trait: translate(TRAIT_NAME_KEY[trait]),
  });
};
