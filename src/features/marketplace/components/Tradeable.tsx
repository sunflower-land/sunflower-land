import {
  CollectionName,
  TradeableDetails,
} from "features/game/types/marketplace";
import React, { useContext, useEffect, useState } from "react";
import * as Auth from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { useNavigate, useParams } from "react-router-dom";
import { loadTradeable } from "../actions/loadTradeable";
import { getTradeableDisplay } from "../lib/tradeables";

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
import { TradeableInfo } from "./TradeableInfo";
import { TradeableListings } from "./TradeableListings";
import { MyListings } from "./profile/MyListings";
import { MyOffers } from "./profile/MyOffers";

export const Tradeable: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const farmId = gameState.context.farmId;
  const authToken = authState.context.user.rawToken as string;
  const inventory = gameState.context.state.inventory;

  const { collection, id } = useParams<{
    collection: CollectionName;
    id: string;
  }>();
  const navigate = useNavigate();

  const [tradeable, setTradeable] = useState<TradeableDetails | null>();
  const [showListItem, setShowListItem] = useState(false);

  const display = getTradeableDisplay({
    id: Number(id),
    type: collection as CollectionName,
  });

  let count = 0;

  const game = gameState.context.state;
  if (display.type === "collectibles") {
    const name = KNOWN_ITEMS[Number(id)];
    count = getChestItems(game)[name]?.toNumber() ?? 0;
  }

  if (display.type === "wearables") {
    const name = ITEM_NAMES[Number(id)];
    count = availableWardrobe(game)[name] ?? 0;
  }

  if (display.type === "buds") {
    count = getChestBuds(game)[Number(id)] ? 1 : 0;
  }

  if (display.type === "resources") {
    const name = KNOWN_ITEMS[Number(id)];
    count = getBasketItems(inventory)[name]?.toNumber() ?? 0;
  }

  const load = async () => {
    try {
      setTradeable(undefined);

      const data = await loadTradeable({
        type: collection as CollectionName,
        id: Number(id),
        token: authState.context.user.rawToken as string,
      });

      setTradeable(data);
    } catch {
      setTradeable(null);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.value === "loading"]);

  // TODO 404 view
  if (tradeable === null) {
    return <p>{`404`}</p>;
  }

  const onBack = () => {
    navigate(`/marketplace/collection?filters=${collection}`);
  };

  return (
    <div className="flex sm:flex-row flex-col w-full scrollable overflow-y-auto h-[calc(100vh-112px)] pr-1 pb-8">
      <div className="flex flex-col w-full sm:w-1/3 mr-1 mb-1">
        <div className="block sm:hidden">
          <TradeableHeader
            authToken={authToken}
            farmId={farmId}
            collection={collection as CollectionName}
            display={display}
            count={count}
            tradeable={tradeable}
            onBack={onBack}
            reload={load}
            onListClick={() => setShowListItem(true)}
          />
        </div>
        <TradeableInfo display={display} tradeable={tradeable} />
      </div>
      <div className="w-full">
        <div className="hidden sm:block">
          <TradeableHeader
            authToken={authToken}
            farmId={farmId}
            collection={collection as CollectionName}
            display={display}
            tradeable={tradeable}
            count={count}
            reload={load}
            onBack={onBack}
            onListClick={() => setShowListItem(true)}
          />
        </div>

        <MyListings />
        <MyOffers />

        {/* <PriceHistory history={tradeable?.history} /> */}

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
          reload={load}
        />

        <TradeableOffers
          itemId={Number(id)}
          tradeable={tradeable}
          display={display}
          farmId={farmId}
          reload={load}
        />
      </div>
    </div>
  );
};
