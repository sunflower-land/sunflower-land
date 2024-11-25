import { Loading } from "features/auth/components";
import { Marketplace as ICollection } from "features/game/types/marketplace";
import React, { useContext, useEffect, useState } from "react";
import { loadMarketplace as loadMarketplace } from "../actions/loadMarketplace";
import * as Auth from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { useNavigate } from "react-router-dom";
import { ListViewCard } from "./ListViewCard";
import Decimal from "decimal.js-light";
import { getTradeableDisplay } from "../lib/tradeables";

export const WhatsNew: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const filters = "collectibles,wearables";

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [collection, setCollection] = useState<ICollection>();

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
                navigate(`/marketplace/${item.collection}/${item.id}`);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
