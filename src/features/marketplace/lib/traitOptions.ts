import {
  FETCHES_BY_CATEGORY,
  PET_CATEGORY_NAMES,
  PET_NFT_TYPES,
} from "features/game/types/pets";
import { ITEM_DETAILS } from "features/game/types/images";
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
  type BudTrait,
  type PetTrait,
  PET_LEVEL_FILTERS,
  toTraitValueId,
} from "./marketplaceFilters";
import { BUD_BOOST_FILTER_OPTIONS } from "./budBoostFilters";
import type { TranslationKeys } from "lib/i18n/dictionaries/types";
import ENGLISH_TERMS from "lib/i18n/dictionaries/dictionary.json";

type Translate = (key: TranslationKeys) => string;

export interface TraitOptionDefinition {
  label: string;
  value: string;
  icon?: string;
}

export interface TraitGroupDefinition<T extends string> {
  trait: T;
  label: string;
  options: TraitOptionDefinition[];
}

const toCamelCase = (value: string) =>
  value
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join("");

// Converts a string list (often readonly) into label/value pairs used by the UI.
const mapOptions = (values: readonly string[], prefix: string, t: Translate) =>
  values.map((value) => ({
    label: t(`${prefix}.${toTraitValueId(value)}` as TranslationKeys),
    value: toTraitValueId(value),
  }));

export const getBudTraitGroups = (
  t: Translate,
): TraitGroupDefinition<BudTrait>[] => [
  {
    trait: "type",
    label: t("filter.type"),
    options: BUD_TYPES.map((type) => ({
      label: t(`bud.type.${toTraitValueId(type.name)}` as TranslationKeys),
      value: toTraitValueId(type.name),
    })),
  },
  {
    trait: "aura",
    label: t("filter.aura"),
    options: BUD_AURAS.map((aura) => ({
      label: t(`bud.aura.${toTraitValueId(aura.name)}` as TranslationKeys),
      value: toTraitValueId(aura.name),
    })),
  },
  {
    trait: "stem",
    label: t("bud.trait.stem"),
    options: BUD_STEMS.map((stem) => ({
      label: t(`bud.stem.${toTraitValueId(stem.name)}` as TranslationKeys),
      value: toTraitValueId(stem.name),
    })),
  },
  {
    trait: "colour",
    label: t("filter.colour"),
    options: BUD_COLOURS.map((colour) => ({
      label: t(`colour.${toTraitValueId(colour.name)}` as TranslationKeys),
      value: toTraitValueId(colour.name),
    })),
  },
  {
    trait: "boost",
    label: t("filter.boost"),
    options: BUD_BOOST_FILTER_OPTIONS.map((boost) => ({
      label: t(`bud.boost.${toTraitValueId(boost)}` as TranslationKeys),
      value: toTraitValueId(boost),
    })),
  },
];

export const getPetTraitGroups = (
  t: Translate,
): TraitGroupDefinition<PetTrait>[] => [
  {
    trait: "type",
    label: t("filter.breed"),
    options: mapOptions(PET_NFT_TYPES, "pet.breed", t),
  },
  {
    trait: "category",
    label: t("filter.category"),
    options: mapOptions(PET_CATEGORY_NAMES, "pet.category", t),
  },
  {
    trait: "resource",
    label: t("filter.resource"),
    options: Object.values(FETCHES_BY_CATEGORY).map((resource) => ({
      label: t(`resource.${toCamelCase(resource)}` as TranslationKeys),
      value: toTraitValueId(resource),
      icon: ITEM_DETAILS[resource].image,
    })),
  },
  {
    trait: "aura",
    label: t("filter.aura"),
    options: AURA_TRAITS.map((aura) => ({
      label: t(`pet.aura.${toTraitValueId(aura)}` as TranslationKeys),
      value: toTraitValueId(aura),
    })),
  },
  {
    trait: "bib",
    label: t("filter.bib"),
    options: mapOptions(BIB_TRAITS, "pet.bib", t),
  },
  {
    trait: "fur",
    label: t("filter.fur"),
    options: mapOptions(FUR_TRAITS, "colour", t),
  },
  {
    trait: "accessory",
    label: t("filter.accessory"),
    options: mapOptions(ACCESSORY_TRAITS, "pet.accessory", t),
  },
  {
    trait: "level",
    label: t("filter.level"),
    options: PET_LEVEL_FILTERS.map((range) => ({
      label: t(`pet.level.${range.value}` as TranslationKeys),
      value: range.value,
    })),
  },
];

const englishT: Translate = (key) => ENGLISH_TERMS[key];

// The collection view keeps its existing static English labels. The filters
// receive the current locale through the factories above.
export const BUD_TRAIT_GROUPS = getBudTraitGroups(englishT);
export const PET_TRAIT_GROUPS = getPetTraitGroups(englishT);

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
