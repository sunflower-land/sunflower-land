import { CollectionName } from "features/game/types/marketplace";
import React, { useContext, useState } from "react";
import * as Auth from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { useNavigate, useParams } from "react-router";
import { loadTradeable } from "../actions/loadTradeable";
import { getTradeableDisplay } from "../lib/tradeables";

import { SaleHistory } from "./PriceHistory";
import { TradeableOffers } from "./TradeableOffers";
import { Context } from "features/game/GameProvider";
import { KNOWN_ITEMS } from "features/game/types";
import {
  getBasketItems,
  getChestBuds,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { ITEM_NAMES } from "features/game/types/bumpkin";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { TradeableHeader } from "./TradeableHeader";
import { TradeableDescription, TradeableImage } from "./TradeableInfo";
import { MyListings } from "./profile/MyListings";
import { MyOffers } from "./profile/MyOffers";
import { TradeableListings } from "./TradeableListings";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { TradeableStats } from "./TradeableStats";
import { getKeys } from "features/game/types/decorations";
import { tradeToId } from "../lib/offers";
import { getDayOfYear } from "lib/utils/time";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import useSWR from "swr";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Tradeable: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();

  const farmId = gameState.context.farmId;
  const authToken = authState.context.user.rawToken as string;
  const inventory = gameState.context.state.inventory;

  const { collection, id } = useParams<{
    collection: CollectionName;
    id: string;
  }>();
  const navigate = useNavigate();

  const [showListItem, setShowListItem] = useState(false);

  const display = getTradeableDisplay({
    id: Number(id),
    type: collection as CollectionName,
  });

  let count = 0;

  const game = gameState.context.state;
  if (display.type === "collectibles") {
    const name = KNOWN_ITEMS[Number(id)];

    if (name in COLLECTIBLES_DIMENSIONS) {
      count = getChestItems(game)[name]?.toNumber() ?? 0;
    } else {
      count = getBasketItems(inventory)[name]?.toNumber() ?? 0;
    }
  }

  if (display.type === "wearables") {
    const name = ITEM_NAMES[Number(id)];
    count = availableWardrobe(game)[name] ?? 0;
  }

  if (display.type === "buds") {
    count = getChestBuds(game)[Number(id)] ? 1 : 0;
  }

  const {
    data: tradeable,
    error,
    mutate: reload,
  } = useSWR(
    [collection, id, authState.context.user.rawToken as string],
    ([collection, id, token]) =>
      loadTradeable({
        type: collection as CollectionName,
        id: Number(id),
        token,
      }),
  );
  if (error) throw error;

  const getDailyListings = () => {
    const today = getDayOfYear(new Date());
    const dailyListings = gameState.context.state.trades.dailyListings ?? {
      date: 0,
      count: 0,
    };

    return dailyListings.date === today ? dailyListings.count : 0;
  };

  // TODO 404 view
  if (tradeable === null) {
    return <p>{`404`}</p>;
  }

  const onBack = () => {
    navigate(-1);
  };

  const trades = gameState.context.state.trades;
  const hasListings = getKeys(trades.listings ?? {}).some(
    (listing) =>
      tradeToId({ details: trades.listings![listing] }) === Number(id),
  );

  const hasOffers = getKeys(trades.offers ?? {}).some(
    (offer) => tradeToId({ details: trades.offers![offer] }) === Number(id),
  );

  let latestSale = 0;
  if (tradeable?.history.sales.length) {
    latestSale =
      tradeable.history.sales[0].sfl / tradeable.history.sales[0].quantity;
  }

  return (
    <div className="flex  flex-col w-full scrollable overflow-y-auto h-[calc(100vh-112px)] pr-1 pb-8">
      <InnerPanel
        className="mb-1  z-10 sticky top-0 cursor-pointer"
        onClick={onBack}
      >
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex cursor-pointer items-center w-fit">
            <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2 mt-1" />
            <p className="capitalize underline">{display.name}</p>
          </div>
          <p className="text-xs mr-4">
            {t("marketplace.youOwn", {
              count: Math.floor(count),
            })}
          </p>
        </div>
      </InnerPanel>
      <InnerPanel className="flex flex-col sm:flex-row w-full mb-1">
        <div className="w-full sm:w-1/3 md:w-1/4 sm:max-w-[300px] mr-2">
          <TradeableImage display={display} supply={tradeable?.supply} />
        </div>
        <div className="flex-1 flex flex-col">
          <TradeableHeader
            dailyListings={getDailyListings()}
            authToken={authToken}
            farmId={farmId}
            collection={collection as CollectionName}
            display={display}
            count={count}
            tradeable={tradeable}
            onBack={onBack}
            reload={reload}
            onListClick={() => setShowListItem(true)}
          />

          <TradeableDescription display={display} tradeable={tradeable} />

          <div className="flex flex-1 items-end">
            <TradeableStats history={tradeable?.history} price={latestSale} />
          </div>
        </div>
      </InnerPanel>
      <div className="w-full">
        {hasListings && <MyListings />}
        {hasOffers && <MyOffers />}

        <TradeableListings
          id={Number(id)}
          authToken={authState.context.user.rawToken as string}
          tradeable={tradeable}
          display={display}
          farmId={farmId}
          showListItem={showListItem}
          count={count}
          onListClick={() => {
            setShowListItem(true);
          }}
          onListClose={() => {
            setShowListItem(false);
          }}
          reload={reload}
        />

        <TradeableOffers
          itemId={Number(id)}
          tradeable={tradeable}
          display={display}
          farmId={farmId}
          reload={reload}
        />

        <SaleHistory history={tradeable?.history} />
      </div>
    </div>
  );
};
