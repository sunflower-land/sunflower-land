import { Loading } from "features/auth/components";
import React, { useContext, useRef } from "react";
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
import { PetCategory } from "features/game/types/pets";
import { getNFTTraits } from "./TradeableInfo";
import { PetTraits } from "features/pets/data/types";
import { Bud } from "lib/buds/types";
import camelCase from "lodash.camelcase";

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
  const isWorldRoute = useLocation().pathname.includes("/world");
  // Get query string params
  const [queryParams] = useSearchParams();

  const gridRef = useRef<any>(null);
  const location = useLocation();

  let filters = queryParams.get("filters") ?? "";

  if (search && !filters.includes("buds") && !filters.includes("pets")) {
    filters = "collectibles,wearables,resources";
  }

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

    const searchTerms = searchLower.split(",");

    return searchTerms.every((term) => {
      // Check if name matches
      const nameMatches = display.name.toLowerCase().includes(term);

      // Check if any buff description matches
      const buffMatches = display.buffs.some((buff) =>
        buff.shortDescription.toLowerCase().includes(term),
      );

      const nftTraits = getNFTTraits(display);

      if (display.type === "pets") {
        const petTraits = nftTraits.traits as
          | (PetTraits & PetCategory)
          | undefined;
        const typeMatches = !!petTraits?.type.toLowerCase().includes(term);
        const primaryMatches = !!petTraits?.primary
          .toLowerCase()
          .includes(term);
        const secondaryMatches = !!petTraits?.secondary
          ?.toLowerCase()
          .includes(term);
        const tertiaryMatches = !!petTraits?.tertiary
          ?.toLowerCase()
          .includes(term);
        const auraMatches = !!petTraits?.aura?.toLowerCase().includes(term);
        const furMatches = !!petTraits?.fur?.toLowerCase().includes(term);
        const accessoryMatches = !!petTraits?.accessory
          ?.toLowerCase()
          .includes(term);
        const bibMatches = !!petTraits?.bib?.toLowerCase().includes(term);

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
        const typeMatches = !!budTraits?.type.toLowerCase().includes(term);
        const colourMatches = !!budTraits?.colour.toLowerCase().includes(term);
        const stemMatches = !!budTraits?.stem.toLowerCase().includes(term);
        const auraMatches = !!budTraits?.aura.toLowerCase().includes(term);
        const earsMatches = !!budTraits?.ears.toLowerCase().includes(term);
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
    });
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
      const matchesSearch = matchesSearchCriteria(display, search ?? "");

      if (filters.includes("pets")) {
        const filterValue = filters.split("=")[1]?.toLowerCase() ?? "";
        const petTraits = nftTraits.traits as
          | (PetTraits & PetCategory)
          | undefined;
        const includesFilterValue = (value?: string | null) =>
          value?.includes(filterValue) ?? false;

        const petTraitChecks = [
          {
            key: "type",
            matches: includesFilterValue(petTraits?.type?.toLowerCase()),
          },
          {
            key: "category",
            matches: ["primary", "secondary", "tertiary"].some((trait) =>
              includesFilterValue(
                petTraits?.[trait as keyof PetCategory]?.toLowerCase(),
              ),
            ),
          },
          {
            key: "aura",
            matches: includesFilterValue(
              camelCase(petTraits?.aura)?.toLowerCase(),
            ),
          },
          {
            key: "bib",
            matches: includesFilterValue(
              camelCase(petTraits?.bib)?.toLowerCase(),
            ),
          },
          {
            key: "fur",
            matches: includesFilterValue(
              camelCase(petTraits?.fur)?.toLowerCase(),
            ),
          },
          {
            key: "accessory",
            matches: includesFilterValue(
              camelCase(petTraits?.accessory)?.toLowerCase(),
            ),
          },
        ];

        const activePetFilter = petTraitChecks.find(({ key }) =>
          filters.includes(key),
        );

        if (activePetFilter) {
          return activePetFilter.matches && matchesSearch;
        }
      }

      if (filters.includes("buds")) {
        const filterValue = filters.split("=")[1]?.toLowerCase() ?? "";
        const budTraits = nftTraits.traits as Bud | undefined;
        const includesFilterValue = (value?: string | null) =>
          value?.includes(filterValue) ?? false;

        const budTraitChecks = [
          {
            key: "type",
            matches: includesFilterValue(budTraits?.type?.toLowerCase()),
          },
          {
            key: "aura",
            matches: includesFilterValue(
              camelCase(budTraits?.aura)?.toLowerCase(),
            ),
          },
          {
            key: "stem",
            matches: includesFilterValue(
              camelCase(budTraits?.stem)?.toLowerCase(),
            ),
          },
          {
            key: "colour",
            matches: includesFilterValue(budTraits?.colour?.toLowerCase()),
          },
        ];

        const activeBudFilter = budTraitChecks.find(({ key }) =>
          filters.includes(key),
        );

        if (activeBudFilter) {
          return activeBudFilter.matches && matchesSearch;
        }
      }

      return matchesSearch;
    }) ?? [];

  const getRowHeight = () => {
    if (filters === "resources") return 150;
    if (filters.includes("buds") || filters.includes("pets")) return 250;
    return 180;
  };

  return (
    <InnerPanel className="h-full">
      <div className="h-full w-full">
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
