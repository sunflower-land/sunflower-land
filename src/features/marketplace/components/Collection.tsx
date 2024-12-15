import { Loading } from "features/auth/components";
import React, { useContext, useRef } from "react";
import { loadMarketplace as loadMarketplace } from "../actions/loadMarketplace";
import * as Auth from "features/auth/lib/Provider";
import { useActor, useSelector } from "@xstate/react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { ListViewCard } from "./ListViewCard";
import Decimal from "decimal.js-light";
import { getTradeableDisplay } from "../lib/tradeables";
import { InnerPanel } from "components/ui/Panel";
import useSWR, { preload } from "swr";
import { CONFIG } from "lib/config";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";

export const collectionFetcher = ([filters, token]: [string, string]) => {
  if (CONFIG.API_URL) return loadMarketplace({ filters, token });
};

export const preloadCollections = (token: string) => {
  preload(["collectibles", token], collectionFetcher);
  preload(["wearables", token], collectionFetcher);
  preload(["resources", token], collectionFetcher);
  preload(["buds", token], collectionFetcher);
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

  if (search) {
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
    data: limited,
    isLoading: isLimitedLoading,
    error: limitedError,
  } = useSWR(
    filters.includes("temporary") ? ["temporary", token] : null,
    collectionFetcher,
  );

  const data = {
    items: [
      ...(collectibles?.items || []),
      ...(resources?.items || []),
      ...(wearables?.items || []),
      ...(buds?.items || []),
      ...(limited?.items || []),
    ],
  };
  const isLoading =
    isWearablesLoading ||
    isCollectiblesLoading ||
    isResourcesLoading ||
    isBudsLoading ||
    isLimitedLoading;

  // Errors are handled by the game machine
  if (
    wearablesError ||
    collectiblesError ||
    resourcesError ||
    budsError ||
    limitedError
  ) {
    throw (
      wearablesError ||
      collectiblesError ||
      resourcesError ||
      budsError ||
      limitedError
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

  const items =
    data?.items.filter((item) => {
      const display = getTradeableDisplay({
        type: item.collection,
        id: item.id,
        state,
      });

      if (filters.includes("utility") && display.buffs.length === 0) {
        return false;
      }

      if (filters.includes("cosmetic") && display.buffs.length > 0) {
        return false;
      }

      return display.name.toLowerCase().includes(search?.toLowerCase() ?? "");
    }) ?? [];

  const getRowHeight = () => {
    if (filters === "resources") return 150;
    if (filters === "buds") return 250;

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
