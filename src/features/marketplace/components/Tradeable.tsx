import {
  CollectionName,
  getMarketPrice,
} from "features/game/types/marketplace";
import React, { useContext, useState } from "react";
import * as Auth from "features/auth/lib/Provider";
import { useSelector } from "@xstate/react";
import { useLocation, useNavigate, useParams } from "react-router";
import { loadTradeable } from "../actions/loadTradeable";
import { getTradeableDisplay } from "../lib/tradeables";
import { isMobile } from "mobile-device-detect";

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
import { TradeableInfo, TradeableMobileInfo } from "./TradeableInfo";
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
import { AuthMachineState } from "features/auth/lib/authMachine";
import { MachineState } from "features/game/lib/gameMachine";

const _rawToken = (state: AuthMachineState) =>
  state.context.user.rawToken as string;
const _state = (state: MachineState) => state.context.state;
const _farmId = (state: MachineState) => state.context.farmId;

export const Tradeable: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const location = useLocation();

  const rawToken = useSelector(authService, _rawToken);
  const state = useSelector(gameService, _state);
  const farmId = useSelector(gameService, _farmId);

  const inventory = state.inventory;

  const { collection, id } = useParams<{
    collection: CollectionName;
    id: string;
  }>();
  const navigate = useNavigate();

  const [showListItem, setShowListItem] = useState(false);

  const display = getTradeableDisplay({
    id: Number(id),
    type: collection as CollectionName,
    state,
  });

  let count = 0;

  if (display.type === "collectibles") {
    const name = KNOWN_ITEMS[Number(id)];

    if (name in COLLECTIBLES_DIMENSIONS) {
      count = getChestItems(state)[name]?.toNumber() ?? 0;
    } else {
      count = getBasketItems(inventory)[name]?.toNumber() ?? 0;
    }
  }

  if (display.type === "wearables") {
    const name = ITEM_NAMES[Number(id)];
    count = availableWardrobe(state)[name] ?? 0;
  }

  if (display.type === "buds") {
    count = getChestBuds(state)[Number(id)] ? 1 : 0;
  }

  const {
    data: tradeable,
    error,
    mutate: reload,
  } = useSWR([collection, id, rawToken], ([collection, id, token]) =>
    loadTradeable({
      type: collection as CollectionName,
      id: Number(id),
      token,
    }),
  );
  if (error) throw error;

  const getDailyListings = () => {
    const today = getDayOfYear(new Date());
    const dailyListings = state.trades.dailyListings ?? {
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
    const { route, scrollPosition } = location.state ?? {};

    if (route) {
      navigate(route, { state: { scrollPosition } });
    } else {
      navigate(-1);
    }
  };

  const trades = state.trades;
  const hasListings = getKeys(trades.listings ?? {}).some(
    (listing) =>
      tradeToId({ details: trades.listings![listing] }) === Number(id),
  );

  const hasOffers = getKeys(trades.offers ?? {}).some(
    (offer) => tradeToId({ details: trades.offers![offer] }) === Number(id),
  );

  const marketPrice = getMarketPrice({ tradeable });

  return (
    <div className="flex sm:flex-row flex-col w-full scrollable overflow-y-auto h-[calc(100vh-112px)] pr-1 pb-8">
      <div className="flex flex-col w-full sm:w-1/3 mr-1 mb-1">
        <InnerPanel
          className="mb-1  z-10 sticky top-0 cursor-pointer"
          onClick={onBack}
        >
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex cursor-pointer items-center w-fit">
              <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2 mt-1" />
              <p className="capitalize underline">{display.name}</p>
            </div>
          </div>
        </InnerPanel>
        {isMobile ? (
          <TradeableMobileInfo display={display} tradeable={tradeable} />
        ) : (
          <TradeableInfo display={display} tradeable={tradeable} />
        )}
      </div>
      <div className="w-full">
        <TradeableHeader
          dailyListings={getDailyListings()}
          authToken={rawToken}
          farmId={farmId}
          collection={collection as CollectionName}
          display={display}
          count={count}
          tradeable={tradeable}
          onBack={onBack}
          reload={reload}
          onListClick={() => setShowListItem(true)}
        />

        {!isMobile && (
          <TradeableStats
            history={tradeable?.history}
            marketPrice={marketPrice}
          />
        )}

        {hasListings && <MyListings />}
        {hasOffers && <MyOffers />}

        <TradeableListings
          id={Number(id)}
          authToken={rawToken}
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
