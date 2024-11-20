import { useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel, InnerPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components";
import {
  CollectionName,
  TradeableDetails,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { TradeableDisplay } from "../lib/tradeables";
import { TradeableListItem } from "./TradeableList";
import { TradeTable } from "./TradeTable";
import { Context } from "features/game/GameProvider";

import tradeIcon from "assets/icons/trade.png";
import {
  Context as ContextType,
  BlockchainEvent,
  MachineState,
} from "features/game/lib/gameMachine";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";
import confetti from "canvas-confetti";
import * as Auth from "features/auth/lib/Provider";
import { getKeys } from "features/game/types/decorations";
import { RemoveListing } from "./RemoveListing";
import { AuthMachineState } from "features/auth/lib/authMachine";

import sflIcon from "assets/icons/sfl.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { getListingCollection, getListingItem } from "../lib/listings";

type TradeableListingsProps = {
  authToken: string;
  tradeable?: TradeableDetails;
  display: TradeableDisplay;
  farmId: number;
  id: number;
  showListItem: boolean;
  count: number;
  floorPrice: number;
  onListClick: () => void;
  onListClose: () => void;
  onListing: () => void;
  onPurchase: () => void;
};

const _isListing = (state: MachineState) => state.matches("marketplaceListing");

// CONFETTI

export const TradeableListings: React.FC<TradeableListingsProps> = ({
  authToken,
  tradeable,
  farmId,
  display,
  id,
  count,
  floorPrice,
  showListItem,
  onListing,
  onListClick,
  onListClose,
  onPurchase,
}) => {
  const { gameService, showAnimations } = useContext(Context);
  const { t } = useAppTranslation();

  const isListing = useSelector(gameService, _isListing);

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceListingSuccess",
    "playing",
    () => {
      onListing();
    },
  );

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceListing",
    "marketplaceListingSuccess",
    () => {
      if (showAnimations) confetti();
    },
  );

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplacePurchasing",
    "marketplacePurchasingSuccess",
    () => {
      onPurchase();
    },
  );

  return (
    <>
      <Modal show={showListItem} onHide={!isListing ? onListClose : undefined}>
        <Panel>
          <TradeableListItem
            authToken={authToken}
            display={display}
            id={id}
            floorPrice={floorPrice ?? 0}
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

const _isCancellingOffer = (state: MachineState) =>
  state.matches("marketplaceListingCancelling");
const _trades = (state: MachineState) => state.context.state.trades;
const _authToken = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const YourListings: React.FC<{
  onListingRemoved: () => void;
  collection: CollectionName;
  id: number;
}> = ({ onListingRemoved, collection, id }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { authService } = useContext(Auth.Context);

  const isCancellingListing = useSelector(gameService, _isCancellingOffer);
  const trades = useSelector(gameService, _trades);
  const authToken = useSelector(authService, _authToken);

  const [removeListingId, setRemoveListingId] = useState<string>();

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceCancellingListingSuccess",
    "playing",
    onListingRemoved,
  );

  const listings = trades.listings ?? {};

  const listingIds = getKeys(listings).filter((listingId) => {
    const listing = listings[listingId];
    if (listing.boughtAt) return false;

    const itemId = getListingItem({ listing });
    const listingCollection = getListingCollection({ listing });

    // Make sure the offer is for this item
    return listingCollection === collection && itemId === id;
  });

  if (listingIds.length === 0) return null;

  const handleHide = () => {
    if (isCancellingListing) return;

    setRemoveListingId(undefined);
  };

  return (
    <>
      <Modal show={!!removeListingId} onHide={handleHide}>
        <RemoveListing
          listingIds={removeListingId ? [removeListingId] : []}
          authToken={authToken}
          onClose={() => setRemoveListingId(undefined)}
        />
      </Modal>
      <InnerPanel className="mb-1">
        <div className="p-2">
          <div className="flex justify-between mb-2">
            <Label icon={SUNNYSIDE.icons.player_small} type="default">
              {t("marketplace.yourListings")}
            </Label>
          </div>
          {listingIds.map((listingId) => {
            const listing = listings[listingId];
            return (
              <div
                className="flex items-center justify-between"
                key={listingId}
              >
                <div className="flex items-center">
                  <img src={sflIcon} className="h-8 mr-2" />
                  <p className="text-base">{`${listing.sfl} SFL`}</p>
                </div>
                <Button
                  className="w-fit"
                  onClick={() => setRemoveListingId(listingId)}
                >
                  {t("marketplace.cancelListing")}
                </Button>
              </div>
            );
          })}
        </div>
      </InnerPanel>
    </>
  );
};
