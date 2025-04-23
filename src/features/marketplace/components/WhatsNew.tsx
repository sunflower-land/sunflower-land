import React, { useContext } from "react";
import { getTradeableDisplay } from "../lib/tradeables";
import { useLocation, useNavigate } from "react-router";
import { Loading } from "features/auth/components";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useActor, useSelector } from "@xstate/react";
import { INVENTORY_RELEASES } from "features/game/types/withdrawables";
import { KNOWN_ITEMS } from "features/game/types";
import { ListViewCard } from "./ListViewCard";
import * as Auth from "features/auth/lib/Provider";
import useSWR from "swr";
import { collectionFetcher } from "./Collection";
import Decimal from "decimal.js-light";

const _state = (state: MachineState) => state.context.state;
export const WhatsNew: React.FC = () => {
  const isWorldRoute = useLocation().pathname.includes("/world");
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const navigate = useNavigate();
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const token = authState.context.user.rawToken as string;
  const {
    data: collectibles,
    isLoading,
    error,
  } = useSWR(["collectibles", token], collectionFetcher);

  if (error) throw error;

  const sortedCollectibles =
    collectibles?.items
      .sort((a, b) => b.id - a.id)
      .sort(
        (a, b) =>
          (INVENTORY_RELEASES[KNOWN_ITEMS[b.id]]?.tradeAt.getTime() ?? 0) -
          (INVENTORY_RELEASES[KNOWN_ITEMS[a.id]]?.tradeAt.getTime() ?? 0),
      ) ?? [];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-wrap">
      {sortedCollectibles
        .slice(0, 7)
        .map(({ id, floor, lastSalePrice, expiresAt }) => {
          const display = getTradeableDisplay({
            type: "collectibles",
            id,
            state,
          });

          return (
            <div
              key={id}
              className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-[14.2%] pr-1 pb-1"
            >
              <ListViewCard
                details={display}
                price={floor ? new Decimal(floor) : undefined}
                lastSalePrice={
                  lastSalePrice ? new Decimal(lastSalePrice) : undefined
                }
                onClick={() => {
                  navigate(
                    `${isWorldRoute ? "/world" : ""}/marketplace/collectibles/${id}`,
                  );
                }}
                expiresAt={expiresAt}
              />
            </div>
          );
        })}
    </div>
  );
};
