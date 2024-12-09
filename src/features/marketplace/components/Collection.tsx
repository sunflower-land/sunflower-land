import { Loading } from "features/auth/components";
import AutoSizer from "react-virtualized-auto-sizer";
import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { loadMarketplace as loadMarketplace } from "../actions/loadMarketplace";
import * as Auth from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { ListViewCard } from "./ListViewCard";
import Decimal from "decimal.js-light";
import { getTradeableDisplay } from "../lib/tradeables";
import { InnerPanel } from "components/ui/Panel";
import useSWR, { preload } from "swr";
import { CONFIG } from "lib/config";
import { FixedSizeGrid as Grid } from "react-window";

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

export const Collection: React.FC<{
  search?: string;
  onNavigated?: () => void;
}> = ({ search, onNavigated }) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const isWorldRoute = useLocation().pathname.includes("/world");
  // Get query string params
  const [queryParams] = useSearchParams();
  const [containerHeight, setContainerHeight] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight);

      // Optional: Update on resize
      const resizeObserver = new ResizeObserver((entries) => {
        setContainerHeight(entries[0].contentRect.height);
      });

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

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
      });
      if (filters.includes("utility") && !display.buff) return false;
      if (filters.includes("cosmetic") && display.buff) return false;

      return display.name.toLowerCase().includes(search?.toLowerCase() ?? "");
    }) ?? [];

  const getRowHeight = () => {
    if (filters === "resources") return 150;
    if (filters === "buds") return 200;

    return 160;
  };

  const SCROLLBAR_WIDTH = 10; // Width of the scrollbar in pixels

  // Function to determine number of columns based on width
  const getColumnCount = (width: number) => {
    // Subtract scrollbar width from total width for accurate column calculation
    const adjustedWidth = width - SCROLLBAR_WIDTH;

    // Matching your Tailwind classes:
    // w-1/2 (2 columns) - default
    // sm:w-1/3 (3 columns) - 640px+
    // md:w-1/4 (4 columns) - 768px+
    // lg:w-1/5 (5 columns) - 1024px+
    // xl:w-[14.2%] (7 columns) - 1280px+
    if (adjustedWidth >= 1280) return 7; // xl
    if (adjustedWidth >= 1024) return 5; // lg
    if (adjustedWidth >= 768) return 4; // md
    if (adjustedWidth >= 640) return 3; // sm
    return 2; // default
  };

  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const columnCount = getColumnCount(style.width);
    const itemIndex = rowIndex * columnCount + columnIndex;
    const item = items[itemIndex];

    if (!item) return null;

    const display = getTradeableDisplay({
      type: item.collection,
      id: item.id,
    });

    return (
      <div style={style} className="pr-1 pb-1">
        <ListViewCard
          details={display}
          price={new Decimal(item.floor)}
          onClick={() => {
            navigate(
              `${isWorldRoute ? "/world" : ""}/marketplace/${item.collection}/${item.id}`,
            );
            onNavigated?.();
          }}
          expiresAt={item.expiresAt}
        />
      </div>
    );
  };

  return (
    <div className="h-full w-full">
      <InnerPanel className="h-full">
        <div className="h-full w-full">
          <AutoSizer>
            {({ height, width }) => {
              const columnCount = getColumnCount(width - 5);
              const rowCount = Math.ceil(items.length / columnCount);

              return (
                <Grid
                  columnCount={columnCount}
                  columnWidth={(width - SCROLLBAR_WIDTH) / columnCount}
                  height={height}
                  rowCount={rowCount}
                  rowHeight={getRowHeight()}
                  width={width}
                  className="scrollable"
                >
                  {Cell}
                </Grid>
              );
            }}
          </AutoSizer>
        </div>
      </InnerPanel>
    </div>
  );
};
