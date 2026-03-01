import {
  CollectionName,
  getMarketPrice,
  MarketplaceTradeableName,
} from "features/game/types/marketplace";
import React, { useContext, useState } from "react";
import * as Auth from "features/auth/lib/Provider";
import { useActor, useSelector } from "@xstate/react";
import { useLocation, useNavigate, useParams } from "react-router";
import { loadTradeable } from "../actions/loadTradeable";
import { getTradeableDisplay } from "../lib/tradeables";
import { isMobile } from "mobile-device-detect";

import { SaleHistory } from "./PriceHistory";
import { TradeableOffers } from "./TradeableOffers";
import { Context } from "features/game/GameProvider";
import { KNOWN_ITEMS } from "features/game/types";
import { getBasketItems } from "features/island/hud/components/inventory/utils/inventory";
import { ITEM_NAMES } from "features/game/types/bumpkin";
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
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import useSWR from "swr";
import { getWeekKey } from "features/game/lib/factions";
import { MachineState } from "features/game/lib/gameMachine";

const _trades = (state: MachineState) => state.context.state.trades;
const _farmId = (state: MachineState) => state.context.farmId;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _state = (state: MachineState) => state.context.state;
const _wardrobe = (state: MachineState) => state.context.state.wardrobe;
const _buds = (state: MachineState) => state.context.state.buds;
const _pets = (state: MachineState) => state.context.state.pets;
export const MAX_LIMITED_SALES = 1;
export const getMaxPurchases = (
  item: MarketplaceTradeableName,
  hideLimited?: boolean,
) => (item === "Obsidian" ? (hideLimited ? 5 : 9) : 3);

export const Tradeable: React.FC<{ hideLimited?: boolean }> = ({
  hideLimited,
}) => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(Context);
  const location = useLocation();

  const farmId = useSelector(gameService, _farmId);
  const authToken = authState.context.user.rawToken as string;
  const inventory = useSelector(gameService, _inventory);
  const state = useSelector(gameService, _state);
  const wardrobe = useSelector(gameService, _wardrobe);
  const buds = useSelector(gameService, _buds);
  const pets = useSelector(gameService, _pets);

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
      count = inventory[name]?.toNumber() ?? 0;
    } else {
      count = getBasketItems(inventory)[name]?.toNumber() ?? 0;
    }
  }

  if (display.type === "wearables") {
    const name = ITEM_NAMES[Number(id)];
    count = wardrobe[name] ?? 0;
  }

  if (display.type === "buds") {
    count = buds?.[Number(id)] ? 1 : 0;
  }

  if (display.type === "pets") {
    count = pets?.nfts?.[Number(id)] ? 1 : 0;
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

  const trades = useSelector(gameService, _trades);
  const currentWeek = getWeekKey({ date: new Date() });
  // Weekly sales count
  const weeklySalesCount =
    trades.weeklySales?.[currentWeek]?.[display.name] ?? 0;
  const listingsCount = Object.values(trades.listings ?? {}).filter(
    (listing) => listing.items[display.name],
  ).length;
  const isLimited = !!tradeable?.expiresAt;
  const limitedTradesLeft = isLimited
    ? MAX_LIMITED_SALES - weeklySalesCount - listingsCount
    : Infinity;

  // Weekly purchases count
  const weeklyPurchasesCount = Math.max(
    0,
    trades.weeklyPurchases?.[currentWeek]?.[display.name] ?? 0,
  );
  const offersCount = Math.max(
    0,
    Object.values(trades.offers ?? {}).filter(
      (offer) => offer.items[display.name],
    ).length,
  );
  const limitedPurchasesLeft = isLimited
    ? getMaxPurchases(display.name, hideLimited) -
      weeklyPurchasesCount -
      offersCount
    : Infinity;

  if (error) throw error;

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
              <p className="capitalize underline">
                {display.translatedName ?? display.name}
              </p>
            </div>
          </div>
        </InnerPanel>
        {isMobile ? (
          <TradeableMobileInfo
            hideLimited={hideLimited}
            display={display}
            tradeable={tradeable}
            state={state}
          />
        ) : (
          <TradeableInfo
            display={display}
            tradeable={tradeable}
            hideLimited={hideLimited}
            state={state}
          />
        )}
      </div>
      <div className="w-full">
        <TradeableHeader
          authToken={authToken}
          farmId={farmId}
          limitedTradesLeft={limitedTradesLeft}
          limitedPurchasesLeft={limitedPurchasesLeft}
          collection={collection as CollectionName}
          count={count}
          tradeable={tradeable}
          display={display}
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
          authToken={authState.context.user.rawToken as string}
          limitedTradesLeft={limitedTradesLeft}
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
          hideLimited={hideLimited}
          itemId={Number(id)}
          limitedTradesLeft={limitedTradesLeft}
          limitedPurchasesLeft={limitedPurchasesLeft}
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
