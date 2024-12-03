import { Loading } from "features/auth/components";
import React, { useContext } from "react";
import { loadMarketplace as loadMarketplace } from "../actions/loadMarketplace";
import * as Auth from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLocation, ListViewCard } from "./ListViewCard";
import Decimal from "decimal.js-light";
import { getTradeableDisplay } from "../lib/tradeables";
import { InnerPanel } from "components/ui/Panel";
import useSWR from "swr";

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

  const { data, error, isLoading } = useSWR(
    [filters, authState.context.user.rawToken as string],
    ([filters, token]) =>
      loadMarketplace({
        filters,
        token,
      }),
  );

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
              />
            </div>
          );
        })}
      </div>
    </InnerPanel>
  );
};
