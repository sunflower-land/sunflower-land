import { Loading } from "features/auth/components";
import {
  CollectionName,
  TradeableDetails,
} from "features/game/types/marketplace";
import React, { useContext, useEffect, useState } from "react";
import * as Auth from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { useNavigate, useParams } from "react-router-dom";
import { loadTradeable } from "../actions/loadTradeable";
import { InnerPanel, Panel } from "components/ui/Panel";
import { getTradeableDisplay, TradeableDisplay } from "../lib/tradeables";

import bg from "assets/ui/3x3_bg.png";
import walletIcon from "assets/icons/wallet.png";
import sflIcon from "assets/icons/sfl.webp";
import tradeIcon from "assets/icons/trade.png";

import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { PriceHistory } from "./PriceHistory";
import { TradeTable } from "./TradeTable";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { TradeableOffers, YourOffer } from "./TradeableOffers";
import { Context } from "features/game/GameProvider";
import { KNOWN_ITEMS } from "features/game/types";
import {
  getChestBuds,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { ITEM_NAMES } from "features/game/types/bumpkin";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { TradeableListItem } from "./TradeableList";
import { Modal } from "components/ui/Modal";

export const Tradeable: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const farmId = gameState.context.farmId;

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
    const name = KNOWN_ITEMS[tradeable?.id as number];
    count = getChestItems(game)[name]?.toNumber() ?? 0;
  }

  if (display.type === "wearables") {
    const name = ITEM_NAMES[tradeable?.id as number];
    count = availableWardrobe(game)[name] ?? 0;
  }

  if (display.type === "buds") {
    count = getChestBuds(game)[tradeable?.id as number] ? 1 : 0;
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
  }, []);

  // TODO 404 view
  if (tradeable === null) {
    return <p>{`404`}</p>;
  }

  const onBack = () => {
    navigate(`/marketplace/${collection}`);
  };

  return (
    <div className="flex sm:flex-row flex-col w-full scrollable overflow-y-auto h-full overflow-x-none pr-1 pb-8">
      <div className="flex flex-col w-full sm:w-1/3 mr-1 mb-1">
        <div className="block sm:hidden">
          <TradeableHeader
            collection={collection as CollectionName}
            display={display}
            count={count}
            tradeable={tradeable}
            onBack={onBack}
            onListClick={() => setShowListItem(true)}
          />
        </div>

        <TradeableInfo display={display} tradeable={tradeable} />
      </div>
      <div className="w-full">
        <div className="hidden sm:block">
          <TradeableHeader
            collection={collection as CollectionName}
            display={display}
            tradeable={tradeable}
            count={count}
            onBack={onBack}
            onListClick={() => setShowListItem(true)}
          />
        </div>

        <YourOffer
          onOfferRemoved={load}
          collection={collection as CollectionName}
          id={Number(id)}
        />

        <PriceHistory />

        <TradeableListings
          id={Number(id)}
          tradeable={tradeable}
          display={display}
          farmId={farmId}
          collection={collection as CollectionName}
          showListItem={showListItem}
          count={count}
          onListingMade={load}
          onListClick={() => {
            setShowListItem(true);
          }}
          onListClose={() => {
            setShowListItem(false);
          }}
        />

        <TradeableOffers
          id={Number(id)}
          tradeable={tradeable}
          display={display}
          farmId={farmId}
          onOfferMade={load}
        />
      </div>
    </div>
  );
};

const TradeableHeader: React.FC<{
  collection: CollectionName;
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
  count: number;
  onBack: () => void;
  onListClick: () => void;
}> = ({ collection, onBack, display, count, tradeable, onListClick }) => {
  const { t } = useAppTranslation();

  const cheapestListing = tradeable?.listings.reduce((cheapest, listing) => {
    return listing.sfl < cheapest.sfl ? listing : cheapest;
  }, tradeable?.listings?.[0]);

  return (
    <InnerPanel className="w-full mb-1">
      <div className="p-2">
        <div className="flex flex-wrap items-center justify-between">
          <div
            className="flex cursor-pointer items-center w-fit mb-2"
            onClick={onBack}
          >
            <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
            <p className="capitalize underline">{collection}</p>
          </div>
          <div className="flex items-center">
            {tradeable?.type === "onchain" && (
              <Label type="formula" className="mr-2" icon={walletIcon}>
                {t("marketplace.walletRequired")}
              </Label>
            )}

            {tradeable !== undefined && (
              <Label type="default">{t("marketplace.youOwn", { count })}</Label>
            )}
          </div>
        </div>
        <div className="flex">
          <p className="text-lg mr-0.5 mb-1">{display.name}</p>
        </div>
        <div className="flex items-center justify-between flex-wrap">
          {cheapestListing ? (
            <div className="flex items-center mr-2 sm:mb-0.5 -ml-1">
              <>
                <img src={sflIcon} className="h-8 mr-2" />
                <p className="text-base">{`${cheapestListing.sfl} SFL`}</p>
              </>
            </div>
          ) : (
            // Dummy div to keep the layout consistent
            <div className="flex items-center mr-2 sm:mb-0.5 -ml-1"></div>
          )}
          <div className="items-center justify-between hidden sm:flex sm:visible w-full sm:w-auto">
            {cheapestListing && (
              <Button className="mr-1 w-full sm:w-auto">
                {t("marketplace.buyNow")}
              </Button>
            )}
            <Button
              onClick={onListClick}
              disabled={!count}
              className="w-full sm:w-auto"
            >
              {t("marketplace.listForSale")}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between sm:hidden w-full sm:w-auto">
        {cheapestListing && (
          <Button className="mr-1 w-full sm:w-auto">
            {t("marketplace.buyNow")}
          </Button>
        )}
        <Button
          onClick={onListClick}
          disabled={!count}
          className="w-full sm:w-auto"
        >
          {t("marketplace.listForSale")}
        </Button>
      </div>
    </InnerPanel>
  );
};

const TradeableInfo: React.FC<{
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
}> = ({ display, tradeable }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <InnerPanel className="w-full flex relative mb-1">
        {tradeable && (
          <Label
            className="absolute top-2 right-2"
            type="default"
          >{`Supply: ${tradeable.supply}`}</Label>
        )}

        <img src={bg} className="w-full rounded-sm" />
        <img
          src={display.image}
          className="w-1/3 absolute"
          style={{
            left: "50%",
            transform: "translate(-50%, 50%)",
            bottom: "50%",
          }}
        />
      </InnerPanel>
      <InnerPanel>
        <div className="p-2">
          <Label type="default" className="mb-1" icon={SUNNYSIDE.icons.search}>
            {t("marketplace.description")}
          </Label>
          <p className="text-sm mb-2">{display.description}</p>
          {display.buff && (
            <Label
              icon={display.buff.boostTypeIcon}
              type={display.buff.labelType}
              className="mb-2"
            >
              {display.buff.shortDescription}
            </Label>
          )}
        </div>
      </InnerPanel>
    </>
  );
};

const TradeableListings: React.FC<{
  tradeable?: TradeableDetails;
  display: TradeableDisplay;
  farmId: number;
  collection: CollectionName;
  id: number;
  showListItem: boolean;
  count: number;
  onListClick: () => void;
  onListClose: () => void;
  onListingMade: () => void;
}> = ({
  tradeable,
  farmId,
  display,
  id,
  count,
  showListItem,
  onListingMade,
  onListClick,
  onListClose,
}) => {
  const { t } = useAppTranslation();

  return (
    <>
      <Modal show={showListItem} onHide={onListClose}>
        <Panel>
          <TradeableListItem
            display={display}
            tradeable={tradeable}
            farmId={farmId}
            id={id}
            onListingMade={onListingMade}
            onClose={onListClose}
          />
        </Panel>
      </Modal>
      <InnerPanel className="mb-1">
        <div className="p-2">
          <Label icon={tradeIcon} type="default" className="mb-2">
            {t("marketplace.listings")}
          </Label>
          <div className="mb-2">
            {!tradeable && <Loading />}
            {tradeable?.listings.length === 0 && (
              <p className="text-sm">{t("marketplace.noListings")}</p>
            )}
            {!!tradeable?.listings.length && (
              <TradeTable
                items={tradeable.listings.map((listing) => ({
                  price: listing.sfl,
                  expiresAt: "30 days", // TODO,
                  createdById: listing.listedById,
                }))}
                id={farmId}
              />
            )}
          </div>
          <div className="w-full justify-end hidden sm:flex sm:visible">
            <Button
              className="w-full sm:w-fit"
              disabled={!count}
              onClick={onListClick}
            >
              {t("marketplace.listForSale")}
            </Button>
          </div>
        </div>
        <Button
          className="w-full sm:hidden"
          disabled={!count}
          onClick={onListClick}
        >
          {t("marketplace.listForSale")}
        </Button>
      </InnerPanel>
    </>
  );
};
