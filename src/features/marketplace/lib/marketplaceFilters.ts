import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

export type TraitCollection = "buds" | "pets";

export type BudTrait = "type" | "aura" | "stem" | "colour";
export type PetTrait =
  | "type"
  | "category"
  | "aura"
  | "bib"
  | "fur"
  | "accessory"
  | "level";

export type TraitKey = BudTrait | PetTrait;

export interface TraitFilter {
  collection: TraitCollection;
  trait: TraitKey;
  value: string;
}

// Defines which trait keys are valid for each collection.
const COLLECTION_TRAIT_KEYS: Record<TraitCollection, TraitKey[]> = {
  buds: ["type", "aura", "stem", "colour"],
  pets: ["type", "category", "aura", "bib", "fur", "accessory", "level"],
};

const TRAIT_QUERY_KEYS = new Set<TraitKey>(
  Object.values(COLLECTION_TRAIT_KEYS).flat(),
);

const getTraitKeys = (collection?: TraitCollection) =>
  collection ? (COLLECTION_TRAIT_KEYS[collection] ?? []) : [];

const shouldPreserveCommaEncoding = (key: string) =>
  key === "filters" || TRAIT_QUERY_KEYS.has(key as TraitKey);

const stringifySearchParams = (params: URLSearchParams) => {
  const entries: string[] = [];

  params.forEach((value, key) => {
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(value);
    const finalValue =
      shouldPreserveCommaEncoding(key) && encodedValue.includes("%2C")
        ? encodedValue.replace(/%2C/g, ",")
        : encodedValue;

    entries.push(`${encodedKey}=${finalValue}`);
  });

  return entries.join("&");
};

export const getTraitParamKeys = (collection: TraitCollection) => [
  ...getTraitKeys(collection),
];

/**
 * Reads `?type=a,b&stem=c` style query params into TraitFilter objects.
 */
const parseTraitFilters = (
  params: URLSearchParams,
  activeCollection?: TraitCollection,
) => {
  if (!activeCollection) return [];

  const traits = getTraitKeys(activeCollection);
  const filters: TraitFilter[] = [];

  traits.forEach((trait) => {
    const raw = params.get(trait);
    if (!raw) return;

    raw
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .forEach((value) => {
        filters.push({
          collection: activeCollection,
          trait,
          value,
        });
      });
  });

  return filters;
};

/**
 * Adds/removes values from a trait query param (type, stem, etc.).
 */
const updateTraitParamValues = ({
  params,
  collection,
  trait,
  updater,
}: {
  params: URLSearchParams;
  collection: TraitCollection;
  trait: TraitKey;
  updater: (current: string[]) => string[];
}) => {
  if (!getTraitKeys(collection).includes(trait)) {
    return params;
  }

  const key = trait;
  const currentValues =
    params
      .get(key)
      ?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) ?? [];

  const updated = updater(currentValues);

  if (!updated.length) {
    params.delete(key);
  } else {
    params.set(key, updated.join(","));
  }

  return params;
};

export const toTraitValueId = (input?: string | number | null) => {
  if (input === undefined || input === null) return "";

  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

type LevelRange = {
  label: string;
  value: string;
  min: number;
  max?: number;
};

// Pet level ranges behave like synthetic trait groups in the UI.
export const PET_LEVEL_FILTERS: ReadonlyArray<LevelRange> = [
  { label: "Level 1-10", value: "level-1-10", min: 1, max: 10 },
  { label: "Level 11-25", value: "level-11-25", min: 11, max: 25 },
  { label: "Level 26-50", value: "level-26-50", min: 26, max: 50 },
  { label: "Level 51-100", value: "level-51-100", min: 51, max: 100 },
  { label: "Level 101+", value: "level-101-plus", min: 101 },
] as const;

export type LevelFilterValue = (typeof PET_LEVEL_FILTERS)[number]["value"];

export const getLevelFilterByValue = (value: string) =>
  PET_LEVEL_FILTERS.find((option) => option.value === value);

export type TraitFilterMap = Partial<
  Record<TraitCollection, Partial<Record<TraitKey, string[]>>>
>;

export const groupTraitFilters = (filters: TraitFilter[]): TraitFilterMap => {
  return filters.reduce<TraitFilterMap>((acc, filter) => {
    if (!acc[filter.collection]) {
      acc[filter.collection] = {};
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!acc[filter.collection]![filter.trait]) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      acc[filter.collection]![filter.trait] = [];
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    acc[filter.collection]![filter.trait]!.push(filter.value);

    return acc;
  }, {});
};

export const useTraitFilters = (activeCollection?: TraitCollection) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const previousCollection = useRef<TraitCollection | undefined>(undefined);

  const commitSearchParams = useCallback(
    (mutator: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(location.search);
      mutator(next);

      const search = stringifySearchParams(next);
      const nextSearch = search ? `?${search}` : "";

      if (nextSearch === location.search) {
        return;
      }

      navigate(`${location.pathname}${nextSearch}${location.hash}`, {
        replace: false,
      });
    },
    [location.hash, location.pathname, location.search, navigate],
  );

  // Clear trait params when switching between buds and pets so we do not carry
  // incompatible filters across.
  useEffect(() => {
    const prevDefined = previousCollection.current;

    if (prevDefined && activeCollection && prevDefined !== activeCollection) {
      commitSearchParams((next) => {
        getTraitKeys(prevDefined).forEach((trait) => next.delete(trait));
      });
    }

    if (activeCollection) {
      previousCollection.current = activeCollection;
    }
  }, [activeCollection, commitSearchParams]);

  const traitFilters = useMemo(
    () => parseTraitFilters(searchParams, activeCollection),
    [searchParams, activeCollection],
  );

  const updateTraitFilters = useCallback(
    (
      collection: TraitCollection,
      trait: TraitKey,
      updater: (current: string[]) => string[],
    ) => {
      commitSearchParams((params) => {
        updateTraitParamValues({
          params,
          collection,
          trait,
          updater,
        });
      });
    },
    [commitSearchParams],
  );

  const addFilter = useCallback(
    (filter: TraitFilter) => {
      updateTraitFilters(filter.collection, filter.trait, (current) => {
        if (current.includes(filter.value)) {
          return current;
        }

        return [...current, filter.value];
      });
    },
    [updateTraitFilters],
  );

  const removeFilter = useCallback(
    (filter: TraitFilter) => {
      updateTraitFilters(filter.collection, filter.trait, (current) =>
        current.filter((value) => value !== filter.value),
      );
    },
    [updateTraitFilters],
  );

  const clearFilters = useCallback(
    (collection?: TraitCollection) => {
      commitSearchParams((params) => {
        const collections = collection
          ? [collection]
          : (Object.keys(COLLECTION_TRAIT_KEYS) as TraitCollection[]);

        collections.forEach((col) => {
          getTraitKeys(col).forEach((trait) => params.delete(trait));
        });
      });
    },
    [commitSearchParams],
  );

  const hasFilter = useCallback(
    (filter: TraitFilter) =>
      traitFilters.some(
        (entry) =>
          entry.collection === filter.collection &&
          entry.trait === filter.trait &&
          entry.value === filter.value,
      ),
    [traitFilters],
  );

  return {
    traitFilters,
    addFilter,
    removeFilter,
    clearFilters,
    hasFilter,
  };
};
