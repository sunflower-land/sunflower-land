import {
  CollectionName,
  getMarketPrice,
  MarketplaceTradeableName,
} from "features/game/types/marketplace";
import React, { useContext, useState } from "react";
import * as Auth from "features/auth/lib/Provider";
import { useActor, useSelector } from "@xstate/react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { loadTradeable } from "../actions/loadTradeable";
import { getTradeableDisplay } from "../lib/tradeables";
import { isMobile } from "mobile-device-detect";

import { SaleHistory } from "./PriceHistory";
import { TradeableOffers } from "./TradeableOffers";
import { Context } from "features/game/GameProvider";
import { TradeableHeader } from "./TradeableHeader";
import { TradeableInfo, TradeableMobileInfo } from "./TradeableInfo";
import { MyListings } from "./profile/MyListings";
import { MyOffers } from "./profile/MyOffers";
import { TradeableListings } from "./TradeableListings";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { TradeableStats } from "./TradeableStats";
import { getKeys } from "lib/object";
import { tradeToId } from "../lib/offers";
import useSWR from "swr";
import { getWeekKey } from "features/game/lib/factions";
import { MachineState } from "features/game/lib/gameMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _trades = (state: MachineState) => state.context.state.trades;
const _farmId = (state: MachineState) => state.context.farmId;
const _state = (state: MachineState) => state.context.state;
export const MAX_LIMITED_SALES = 1;
export const getMaxPurchases = (
  item: MarketplaceTradeableName,
  hideLimited?: boolean,
) => (item === "Obsidian" ? (hideLimited ? 5 : 9) : 3);

export const Tradeable: React.FC<{ hideLimited?: boolean }> = ({
  hideLimited,
}) => {
  const { t } = useAppTranslation();
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(Context);
  const location = useLocation();

  const farmId = useSelector(gameService, _farmId);
  const authToken = authState.context.user.rawToken as string;
  const state = useSelector(gameService, _state);

  const { collection, id } = useParams<{
    collection: CollectionName;
    id: string;
  }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const minigameSlug = searchParams.get("minigameSlug") ?? undefined;

  const [showListItem, setShowListItem] = useState(false);

  const {
    data: tradeable,
    error,
    mutate: reload,
  } = useSWR(
    collection === "minigames"
      ? minigameSlug
        ? [collection, id, authState.context.user.rawToken as string, minigameSlug]
        : null
      : [collection, id, authState.context.user.rawToken as string],
    (
      key:
        | readonly [CollectionName, string, string]
        | readonly [CollectionName, string, string, string],
    ) => {
      const [col, itemId, token, slug] = key;
      return loadTradeable({
        type: col,
        id: Number(itemId),
        token,
        minigameSlug: slug,
      });
    },
  );

  const display = getTradeableDisplay({
    id: Number(id),
    type: collection as CollectionName,
    state,
    tradeableDetails: tradeable ?? undefined,
  });

  if (collection === "minigames" && !minigameSlug) {
    return (
      <InnerPanel className="m-2 p-4">
        <p className="text-sm">{t("marketplace.minigames.missingSlug")}</p>
      </InnerPanel>
    );
  }

  const count = tradeable?.balance ?? 0;

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

  const isStoneBeetle = collection === "collectibles" && Number(id) === 2129;

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
          />
        ) : (
          <TradeableInfo
            display={display}
            tradeable={tradeable}
            hideLimited={hideLimited}
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

        {!isStoneBeetle && (
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
        )}

        <SaleHistory history={tradeable?.history} />
      </div>
    </div>
  );
};
