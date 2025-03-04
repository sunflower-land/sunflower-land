import { Loading } from "features/auth/components";
import { Marketplace as ICollection } from "features/game/types/marketplace";
import React, { useContext, useEffect, useState } from "react";
import { loadMarketplace as loadMarketplace } from "../actions/loadMarketplace";
import * as Auth from "features/auth/lib/Provider";
import { useSelector } from "@xstate/react";
import { useNavigate, useLocation } from "react-router";
import { ListViewCard } from "./ListViewCard";
import Decimal from "decimal.js-light";
import { getTradeableDisplay } from "../lib/tradeables";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { AuthMachineState } from "features/auth/lib/authMachine";

const _state = (state: MachineState) => state.context.state;
const _rawToken = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const WhatsNew: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const rawToken = useSelector(authService, _rawToken);

  const filters = "collectibles,wearables";

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [collection, setCollection] = useState<ICollection>();
  const isWorldRoute = useLocation().pathname.includes("/world");
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const load = async () => {
    setIsLoading(true);

    const data = await loadMarketplace({
      filters: filters ?? "",
      token: rawToken,
    });

    setCollection(data);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const items = collection?.items?.slice(0, 4) ?? [];

  return (
    <div className="flex flex-wrap w-full">
      {items.map((item) => {
        const display = getTradeableDisplay({
          type: item.collection,
          id: item.id,
          state,
        });

        return (
          <div
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-[14.2%] pr-1 pb-1"
            key={`${item.collection}-${item.id}`}
          >
            <ListViewCard
              details={display}
              price={new Decimal(item.floor)}
              lastSalePrice={new Decimal(item.lastSalePrice)}
              onClick={() => {
                navigate(
                  `${isWorldRoute ? "/world" : ""}/marketplace/${item.collection}/${item.id}`,
                );
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
