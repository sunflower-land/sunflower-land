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
import { Tradeable } from "features/game/types/marketplace";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _state = (state: MachineState) => state.context.state;
export const WhatsNew: React.FC = () => {
  const { t } = useAppTranslation();
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const token = authState.context.user.rawToken as string;
  const {
    data: collectibles,
    isLoading: collectiblesLoading,
    error: collectiblesError,
  } = useSWR(["collectibles", token], collectionFetcher);

  const {
    data: wearables,
    isLoading: wearablesLoading,
    error: wearablesError,
  } = useSWR(["wearables", token], collectionFetcher);

  if (collectiblesError || wearablesError)
    throw collectiblesError || wearablesError;

  const sortItems = (items: Tradeable[]) => {
    return items
      .sort((a, b) => b.id - a.id)
      .sort(
        (a, b) =>
          (INVENTORY_RELEASES[KNOWN_ITEMS[b.id]]?.tradeAt.getTime() ?? 0) -
          (INVENTORY_RELEASES[KNOWN_ITEMS[a.id]]?.tradeAt.getTime() ?? 0),
      );
  };

  const sortedCollectibles = sortItems(collectibles?.items ?? []);
  const sortedWearables = sortItems(wearables?.items ?? []);

  if (collectiblesLoading || wearablesLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        <Label type="default" className="mb-2 -ml-1">
          {t("collectibles")}
        </Label>
        <ItemsList items={sortedCollectibles} type="collectibles" />
      </div>

      <div className="w-full">
        <Label type="default" className="mb-2 -ml-1">
          {t("wearables")}
        </Label>
        <ItemsList items={sortedWearables} type="wearables" />
      </div>
    </div>
  );
};

const ItemsList: React.FC<{
  items: Tradeable[];
  type: "collectibles" | "wearables";
}> = ({ items, type }) => {
  const isWorldRoute = useLocation().pathname.includes("/world");
  const navigate = useNavigate();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  return (
    <div className="flex flex-wrap">
      {items.slice(0, 6).map(({ id, floor, lastSalePrice, expiresAt }) => {
        const display = getTradeableDisplay({
          type,
          id,
          state,
        });

        return (
          <div
            key={id}
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-[16.66%] pr-1 pb-1"
          >
            <ListViewCard
              details={display}
              price={floor ? new Decimal(floor) : undefined}
              lastSalePrice={
                lastSalePrice ? new Decimal(lastSalePrice) : undefined
              }
              onClick={() => {
                navigate(
                  `${isWorldRoute ? "/world" : ""}/marketplace/${type}/${id}`,
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
