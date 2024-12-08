import { Loading } from "features/auth/components";
import React, { useContext } from "react";
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

  return (
    <InnerPanel className="scrollable h-full overflow-y-scroll">
      <div className="flex flex-wrap w-full">
        {items.map((item) => {
          const display = getTradeableDisplay({
            type: item.collection,
            id: item.id,
          });

          return (
            <div
              className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-[14.2%] pr-1 pb-1"
              key={`${item.collection}-${item.id}`}
            >
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
        })}
      </div>
    </InnerPanel>
  );
};
