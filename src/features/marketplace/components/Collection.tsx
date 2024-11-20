import { Loading } from "features/auth/components";
import { Marketplace as ICollection } from "features/game/types/marketplace";
import React, { useContext, useEffect, useState } from "react";
import { loadMarketplace as loadMarketplace } from "../actions/loadMarketplace";
import * as Auth from "features/auth/lib/Provider";
import { useActor, useSelector } from "@xstate/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ListViewCard } from "./ListViewCard";
import Decimal from "decimal.js-light";
import { getTradeableDisplay } from "../lib/tradeables";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { InnerPanel } from "components/ui/Panel";
import debounce from "lodash.debounce";

const _listings = (state: MachineState) => state.context.state.trades.listings;

export const Collection: React.FC<{
  search?: string;
  onNavigated?: () => void;
}> = ({ search, onNavigated }) => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const [authState] = useActor(authService);

  // Get type from query params

  // Get query string params
  const [queryParams] = useSearchParams();

  let filters = queryParams.get("filters") ?? "";

  if (search) {
    filters = "collectibles,wearables,resources";
  }

  const listings = useSelector(gameService, _listings);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [collection, setCollection] = useState<ICollection>();
  const [removeListingIds, setRemoveListingIds] = useState<string[]>([]);

  const load = async () => {
    setIsLoading(true);

    const data = await loadMarketplace({
      filters: filters ?? "",
      token: authState.context.user.rawToken as string,
    });

    setCollection(data);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, [filters]);

  // Debounce search and load
  useEffect(() => {
    if (!search) return;
    const debouncedSearch = debounce(() => {
      load();
    }, 500);

    debouncedSearch();

    return () => debouncedSearch.cancel();
  }, [search]);

  if (isLoading) {
    return (
      <InnerPanel className="h-full flex ">
        <Loading />
      </InnerPanel>
    );
  }

  const items =
    collection?.items.filter((item) => {
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
                name={display.name}
                price={new Decimal(item.floor)}
                image={display.image}
                buff={display.buff}
                onClick={() => {
                  navigate(`/marketplace/${item.collection}/${item.id}`);
                  onNavigated?.();
                }}
              />
            </div>
          );
        })}
      </div>
    </InnerPanel>
  );
};
