import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import * as Auth from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import useSWR, { preload } from "swr";
import { CONFIG } from "lib/config";
import { loadTrends } from "features/marketplace/actions/loadTrends";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";
import { ListViewCard } from "features/marketplace/components/ListViewCard";
import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";

const hotNowFetcher = ([, token]: [string, string]) => {
  if (CONFIG.API_URL) return loadTrends({ token });
};
export const preloadHotNow = (token: string) =>
  preload(["/marketplace/trends", token], hotNowFetcher);

export const DashboardMarketplace: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const navigate = useNavigate();

  const { t } = useAppTranslation();

  const { data, error } = useSWR(
    ["/marketplace/trends", authState.context.user.rawToken as string],
    hotNowFetcher,
  );

  // Errors are handled by the game machine
  if (error) throw error;

  const isWorldRoute = useLocation().pathname.includes("/world");

  return (
    <div className="pr-1">
      <div className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap">
            {data?.topTrades
              .slice(0, 6)
              .map(({ buyer, collection, itemId, quantity, sfl }) => {
                const display = getTradeableDisplay({
                  type: collection,
                  id: itemId,
                  state: INITIAL_FARM,
                });

                return (
                  <div
                    key={itemId}
                    className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-[16.66%] pr-1 pb-1"
                  >
                    <ListViewCard
                      details={display}
                      price={sfl ? new Decimal(sfl) : undefined}
                      lastSalePrice={sfl ? new Decimal(sfl) : undefined}
                      onClick={() => {
                        navigate(
                          `${isWorldRoute ? "/world" : ""}/marketplace/${collection}/${itemId}`,
                        );
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
