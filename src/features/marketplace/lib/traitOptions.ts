import { PET_CATEGORY_NAMES, PET_NFT_TYPES } from "features/game/types/pets";
import {
  ACCESSORY_TRAITS,
  AURA_TRAITS,
  BIB_TRAITS,
  FUR_TRAITS,
} from "features/pets/data/types";
import {
  auras as BUD_AURAS,
  colours as BUD_COLOURS,
  stems as BUD_STEMS,
  types as BUD_TYPES,
} from "lib/buds/types";
import {
  BudTrait,
  PetTrait,
  PET_LEVEL_FILTERS,
  toTraitValueId,
} from "./marketplaceFilters";

export interface TraitOptionDefinition {
  label: string;
  value: string;
}

export interface TraitGroupDefinition<T extends string> {
  trait: T;
  label: string;
  options: TraitOptionDefinition[];
}

// Converts a string list (often readonly) into label/value pairs used by the UI.
const mapOptions = (values: readonly string[]) =>
  values.map((value) => ({
    label: value,
    value: toTraitValueId(value),
  }));

export const BUD_TRAIT_GROUPS: TraitGroupDefinition<BudTrait>[] = [
  {
    trait: "type",
    label: "Type",
    options: BUD_TYPES.map((type) => ({
      label: type.name,
      value: toTraitValueId(type.name),
    })),
  },
  {
    trait: "aura",
    label: "Aura",
    options: BUD_AURAS.map((aura) => ({
      label: aura.name === "No Aura" ? "None" : aura.name,
      value: toTraitValueId(aura.name),
    })),
  },
  {
    trait: "stem",
    label: "Stem",
    options: BUD_STEMS.map((stem) => ({
      label: stem.name,
      value: toTraitValueId(stem.name),
    })),
  },
  {
    trait: "colour",
    label: "Colour",
    options: BUD_COLOURS.map((colour) => ({
      label: colour.name,
      value: toTraitValueId(colour.name),
    })),
  },
];

export const PET_TRAIT_GROUPS: TraitGroupDefinition<PetTrait>[] = [
  {
    trait: "type",
    label: "Breed",
    options: mapOptions(PET_NFT_TYPES),
  },
  {
    trait: "category",
    label: "Category",
    options: mapOptions(PET_CATEGORY_NAMES),
  },
  {
    trait: "aura",
    label: "Aura",
    options: AURA_TRAITS.map((aura) => ({
      label: aura === "No Aura" ? "None" : aura,
      value: toTraitValueId(aura),
    })),
  },
  {
    trait: "bib",
    label: "Bib",
    options: mapOptions(BIB_TRAITS),
  },
  {
    trait: "fur",
    label: "Fur",
    options: mapOptions(FUR_TRAITS),
  },
  {
    trait: "accessory",
    label: "Accessory",
    options: mapOptions(ACCESSORY_TRAITS),
  },
  {
    trait: "level",
    label: "Level",
    options: PET_LEVEL_FILTERS.map((range) => ({
      label: range.label,
      value: range.value,
    })),
  },
];

export const createTraitLabelLookup = <T extends string>(
  groups: TraitGroupDefinition<T>[],
) => {
  return groups.reduce<Record<T, Record<string, string>>>(
    (acc, group) => {
      acc[group.trait] = group.options.reduce<Record<string, string>>(
        (optionAcc, option) => {
          optionAcc[option.value] = option.label;
          return optionAcc;
        },
        {},
      );

      return acc;
    },
    {} as Record<T, Record<string, string>>,
  );
};
