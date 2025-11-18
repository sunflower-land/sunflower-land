import { Loading } from "features/auth/components";
import React, { useContext, useMemo, useRef } from "react";
import { loadMarketplace as loadMarketplace } from "../actions/loadMarketplace";
import * as Auth from "features/auth/lib/Provider";
import { useActor, useSelector } from "@xstate/react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { ListViewCard } from "./ListViewCard";
import Decimal from "decimal.js-light";
import { getTradeableDisplay, TradeableDisplay } from "../lib/tradeables";
import { InnerPanel } from "components/ui/Panel";
import useSWR, { preload } from "swr";
import { CONFIG } from "lib/config";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { PetCategory, getPetLevel } from "features/game/types/pets";
import { getNFTTraits } from "./TradeableInfo";
import { PetTraits } from "features/pets/data/types";
import { Bud } from "lib/buds/types";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  BudTrait,
  getLevelFilterByValue,
  groupTraitFilters,
  PetTrait,
  TraitCollection,
  TraitFilter,
  toTraitValueId,
  useTraitFilters,
} from "../lib/marketplaceFilters";
import {
  BUD_TRAIT_GROUPS,
  createTraitLabelLookup,
  PET_TRAIT_GROUPS,
} from "../lib/traitOptions";
import { useTranslation } from "react-i18next";
import { Label } from "components/ui/Label";

const budTraitLabels = createTraitLabelLookup(BUD_TRAIT_GROUPS);
const petTraitLabels = createTraitLabelLookup(PET_TRAIT_GROUPS);

export const collectionFetcher = ([filters, token]: [string, string]) => {
  if (CONFIG.API_URL) return loadMarketplace({ filters, token });
};

export const preloadCollections = (token: string) => {
  preload(["collectibles", token], collectionFetcher);
  preload(["wearables", token], collectionFetcher);
  preload(["resources", token], collectionFetcher);
  preload(["buds", token], collectionFetcher);
  preload(["pets", token], collectionFetcher);
  preload(["temporary", token], collectionFetcher);
};

const _state = (state: MachineState) => state.context.state;

export const Collection: React.FC<{
  search?: string;
  onNavigated?: () => void;
}> = ({ search, onNavigated }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const { t } = useTranslation();
  const isWorldRoute = useLocation().pathname.includes("/world");
  // Get query string params
  const [queryParams] = useSearchParams();
  let filters = queryParams.get("filters") ?? "";
  const activeCollection: TraitCollection | undefined = filters.includes("pets")
    ? "pets"
    : filters.includes("buds")
      ? "buds"
      : undefined;
  const { traitFilters, removeFilter, clearFilters } =
    useTraitFilters(activeCollection);
  const groupedTraitFilters = useMemo(
    () => groupTraitFilters(traitFilters),
    [traitFilters],
  );
  const petTraitFilters = groupedTraitFilters.pets ?? {};
  const budTraitFilters = groupedTraitFilters.buds ?? {};

  const gridRef = useRef<any>(null);
  const location = useLocation();

  if (search && !filters.includes("buds") && !filters.includes("pets")) {
    filters = "collectibles,wearables,resources";
  }

  const activeTraitFilters = traitFilters;
  const getTraitLabel = (filter: TraitFilter) => {
    if (filter.collection === "pets") {
      const trait = filter.trait as PetTrait;
      return petTraitLabels[trait]?.[filter.value] ?? filter.value;
    }

    const trait = filter.trait as BudTrait;
    return budTraitLabels[trait]?.[filter.value] ?? filter.value;
  };

  const navigate = useNavigate();

  const token = authState.context.user.rawToken as string;

  const {
    data: wearables,
    isLoading: isWearablesLoading,
    error: wearablesError,
  } = useSWR(
    filters.includes("wearables") ? ["wearables", token] : null,
    collectionFetcher,
  );

  const {
    data: collectibles,
    isLoading: isCollectiblesLoading,
    error: collectiblesError,
  } = useSWR(
    filters.includes("collectibles") ? ["collectibles", token] : null,
    collectionFetcher,
  );
  const {
    data: resources,
    isLoading: isResourcesLoading,
    error: resourcesError,
  } = useSWR(
    filters.includes("resources") ? ["resources", token] : null,
    collectionFetcher,
  );
  const {
    data: buds,
    isLoading: isBudsLoading,
    error: budsError,
  } = useSWR(
    filters.includes("buds") ? ["buds", token] : null,
    collectionFetcher,
  );
  const {
    data: pets,
    isLoading: isPetsLoading,
    error: petsError,
  } = useSWR(
    filters.includes("pets") ? ["pets", token] : null,
    collectionFetcher,
  );
  const {
    data: limited,
    isLoading: isLimitedLoading,
    error: limitedError,
  } = useSWR(
    filters.includes("temporary") ? ["temporary", token] : null,
    collectionFetcher,
  );

  const data = {
    items: [
      ...(resources?.items || []),
      ...(collectibles?.items || []),
      ...(wearables?.items || []),
      ...(buds?.items || []),
      ...(limited?.items || []),
      ...(pets?.items || []),
    ],
  };

  if (!filters.includes("resources")) {
    // Sort by floor, then lastSalePrice, then id
    data.items.sort((a, b) => {
      if (a.floor === b.floor) {
        if (a.lastSalePrice === 0 && b.lastSalePrice === 0) return a.id - b.id;
        if (a.lastSalePrice === 0) return 1;
        if (b.lastSalePrice === 0) return -1;
        return a.lastSalePrice - b.lastSalePrice;
      }

      // If floor price is empty, order last
      if (a.floor === 0) return 1;
      if (b.floor === 0) return -1;

      return a.floor - b.floor;
    });
  }

  const isLoading =
    isWearablesLoading ||
    isCollectiblesLoading ||
    isResourcesLoading ||
    isBudsLoading ||
    isLimitedLoading ||
    isPetsLoading;

  // Errors are handled by the game machine
  if (
    wearablesError ||
    collectiblesError ||
    resourcesError ||
    budsError ||
    limitedError ||
    petsError
  ) {
    throw (
      wearablesError ||
      collectiblesError ||
      resourcesError ||
      budsError ||
      limitedError ||
      petsError
    );
  }

  // Get scroll position from location state if it exists
  const savedScrollPosition = location.state?.scrollPosition;

  if (isLoading) {
    return (
      <InnerPanel className="h-full flex ">
        <Loading />
      </InnerPanel>
    );
  }

  // Determines if an item matches the search criteria
  const matchesSearchCriteria = (
    display: TradeableDisplay,
    searchTerm: string,
  ): boolean => {
    const searchLower = searchTerm.toLowerCase();

    // Check if name matches
    const nameMatches = display.name.toLowerCase().includes(searchLower);

    // Check if any buff description matches
    const buffMatches = display.buffs.some((buff) =>
      buff.shortDescription.toLowerCase().includes(searchLower),
    );

    const nftTraits = getNFTTraits(display);

    if (display.type === "pets") {
      const petTraits = nftTraits.traits as
        | (PetTraits & PetCategory)
        | undefined;
      const typeMatches = !!petTraits?.type.toLowerCase().includes(searchLower);
      const primaryMatches = !!petTraits?.primary
        .toLowerCase()
        .includes(searchLower);
      const secondaryMatches = !!petTraits?.secondary
        ?.toLowerCase()
        .includes(searchLower);
      const tertiaryMatches = !!petTraits?.tertiary
        ?.toLowerCase()
        .includes(searchLower);
      const auraMatches = !!petTraits?.aura
        ?.toLowerCase()
        .includes(searchLower);
      const furMatches = !!petTraits?.fur?.toLowerCase().includes(searchLower);
      const accessoryMatches = !!petTraits?.accessory
        ?.toLowerCase()
        .includes(searchLower);
      const bibMatches = !!petTraits?.bib?.toLowerCase().includes(searchLower);

      return (
        nameMatches ||
        buffMatches ||
        typeMatches ||
        primaryMatches ||
        secondaryMatches ||
        tertiaryMatches ||
        auraMatches ||
        furMatches ||
        accessoryMatches ||
        bibMatches
      );
    }

    if (display.type === "buds") {
      const budTraits = nftTraits.traits as Bud | undefined;
      const typeMatches = !!budTraits?.type.toLowerCase().includes(searchLower);
      const colourMatches = !!budTraits?.colour
        .toLowerCase()
        .includes(searchLower);
      const stemMatches = !!budTraits?.stem.toLowerCase().includes(searchLower);
      const auraMatches = !!budTraits?.aura.toLowerCase().includes(searchLower);
      const earsMatches = !!budTraits?.ears.toLowerCase().includes(searchLower);
      return (
        nameMatches ||
        buffMatches ||
        typeMatches ||
        colourMatches ||
        stemMatches ||
        auraMatches ||
        earsMatches
      );
    }

    return nameMatches || buffMatches;
  };

  const items =
    data?.items.filter((item) => {
      const display = getTradeableDisplay({
        id: item.id,
        type: item.collection,
        state,
      });

      if (filters.includes("utility") && display.buffs.length === 0) {
        return false;
      }

      if (filters.includes("cosmetic") && display.buffs.length > 0) {
        return false;
      }

      const nftTraits = getNFTTraits(display);
      if (filters.includes("pets") && item.collection === "pets") {
        const petTraits = nftTraits.traits as
          | (PetTraits & PetCategory)
          | undefined;
        const hasPetTraitFilters = Object.values(petTraitFilters).some(
          (values) => values && values.length > 0,
        );

        if (hasPetTraitFilters) {
          const petLevel = getPetLevel(item.experience ?? 0).level;
          const matchesPetTraits = (
            Object.entries(petTraitFilters) as [PetTrait, string[]][]
          ).every(([trait, selectedValues]) => {
            if (!selectedValues?.length) return true;
            if (!petTraits) return false;

            switch (trait) {
              case "type":
                return selectedValues.includes(
                  toTraitValueId(petTraits.type ?? ""),
                );
              case "category": {
                const categories = [
                  petTraits.primary,
                  petTraits.secondary,
                  petTraits.tertiary,
                ]
                  .map((value) => toTraitValueId(value ?? ""))
                  .filter(Boolean);

                return categories.some((category) =>
                  selectedValues.includes(category),
                );
              }
              case "aura":
                return selectedValues.includes(
                  toTraitValueId(petTraits.aura ?? ""),
                );
              case "bib":
                return selectedValues.includes(
                  toTraitValueId(petTraits.bib ?? ""),
                );
              case "fur":
                return selectedValues.includes(
                  toTraitValueId(petTraits.fur ?? ""),
                );
              case "accessory":
                return selectedValues.includes(
                  toTraitValueId(petTraits.accessory ?? ""),
                );
              case "level":
                // Level “traits” are stored as labels, convert to range and compare.
                return selectedValues.some((value) => {
                  const range = getLevelFilterByValue(value);
                  if (!range) return false;

                  if (typeof range.max === "number") {
                    return petLevel >= range.min && petLevel <= range.max;
                  }

                  return petLevel >= range.min;
                });
              default:
                return true;
            }
          });

          if (!matchesPetTraits) {
            return false;
          }
        }
      }

      if (filters.includes("buds") && item.collection === "buds") {
        const budTraits = nftTraits.traits as Bud | undefined;
        const hasBudTraitFilters = Object.values(budTraitFilters).some(
          (values) => values && values.length > 0,
        );

        if (hasBudTraitFilters) {
          const matchesBudTraits = (
            Object.entries(budTraitFilters) as [BudTrait, string[]][]
          ).every(([trait, selectedValues]) => {
            if (!selectedValues?.length) return true;
            if (!budTraits) return false;

            switch (trait) {
              case "type":
                return selectedValues.includes(
                  toTraitValueId(budTraits.type ?? ""),
                );
              case "aura":
                return selectedValues.includes(
                  toTraitValueId(budTraits.aura ?? ""),
                );
              case "stem":
                return selectedValues.includes(
                  toTraitValueId(budTraits.stem ?? ""),
                );
              case "colour":
                return selectedValues.includes(
                  toTraitValueId(budTraits.colour ?? ""),
                );
              default:
                return true;
            }
          });

          if (!matchesBudTraits) {
            return false;
          }
        }
      }

      return matchesSearchCriteria(display, search ?? "");
    }) ?? [];

  const getRowHeight = () => {
    if (filters === "resources") return 150;
    if (filters.includes("buds") || filters.includes("pets")) return 250;
    return 180;
  };

  return (
    <InnerPanel className="h-full flex flex-col">
      {activeTraitFilters.length > 0 && (
        <div className="flex flex-col gap-2 border-b border-brown-300 p-2 pt-0.5 pb-1">
          <div className="flex items-center gap-2">
            <span className="text-xxs uppercase tracking-wider text-brown-700">
              {t("marketplace.filters.applied")}
            </span>
            {activeCollection && (
              <button
                className="text-xxs underline ml-auto"
                onClick={() => clearFilters(activeCollection)}
              >
                {t("marketplace.filters.clear")}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1 -ml-1">
            {activeTraitFilters.map((filter) => (
              <Label
                type="default"
                key={`${filter.collection}-${filter.trait}-${filter.value}`}
                onClick={() => removeFilter(filter)}
                className="flex items-center gap-1 rounded-full border border-brown-400 bg-brown-200 px-2 text-xxs"
              >
                <span className="mb-0.5">{getTraitLabel(filter)}</span>
                <img
                  src={SUNNYSIDE.icons.close}
                  className="h-3 w-3"
                  alt={t("remove")}
                />
              </Label>
            ))}
          </div>
        </div>
      )}
      <div className="h-full w-full flex-1">
        <AutoSizer>
          {({ height, width }) => {
            const SCROLLBAR_WIDTH = 10;

            // Function to determine number of columns based on width
            const getColumnCount = (width: number) => {
              if (width >= 1280) return 7; // xl
              if (width >= 1024) return 5; // lg
              if (width >= 768) return 4; // md
              if (width >= 640) return 3; // sm
              return 2; // default
            };

            const columnCount = getColumnCount(width);
            const rowCount = Math.ceil(items.length / columnCount);
            const adjustedWidth = width - SCROLLBAR_WIDTH;
            const columnWidth = adjustedWidth / columnCount;

            const Cell = ({
              columnIndex,
              rowIndex,
              style,
            }: {
              columnIndex: number;
              rowIndex: number;
              style: React.CSSProperties;
            }) => {
              const itemIndex = rowIndex * columnCount + columnIndex;
              const item = items[itemIndex];

              if (!item) return null;

              const display = getTradeableDisplay({
                type: item.collection,
                id: item.id,
                state,
                experience:
                  item.collection === "pets" ? item.experience : undefined,
              });

              return (
                <div key={item.id} style={style} className="pr-1 pb-1">
                  <ListViewCard
                    details={display}
                    price={new Decimal(item.floor)}
                    lastSalePrice={new Decimal(item.lastSalePrice)}
                    onClick={() => {
                      const scrollPosition =
                        gridRef.current?._outerRef.scrollTop;
                      navigate(
                        `${isWorldRoute ? "/world" : ""}/marketplace/${item.collection}/${item.id}`,
                        {
                          state: {
                            scrollPosition,
                            route: `${location.pathname}${location.search}`,
                          },
                        },
                      );
                      onNavigated?.();
                    }}
                    expiresAt={item.expiresAt}
                  />
                </div>
              );
            };

            return (
              <Grid
                ref={gridRef}
                columnCount={columnCount}
                columnWidth={columnWidth}
                height={height}
                rowCount={rowCount}
                rowHeight={getRowHeight()}
                width={width}
                className="scrollable"
                initialScrollTop={savedScrollPosition}
                itemData={{ width }}
              >
                {Cell}
              </Grid>
            );
          }}
        </AutoSizer>
      </div>
    </InnerPanel>
  );
};
