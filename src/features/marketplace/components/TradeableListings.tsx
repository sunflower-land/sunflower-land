import { useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel, InnerPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components";
import {
  Listing,
  Tradeable,
  TradeableDetails,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
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
import { ResourceTable } from "./ResourceTable";
import { formatNumber, shortenCount } from "lib/utils/formatNumber";
import { useParams } from "react-router-dom";
import { PurchaseModalContent } from "./PurchaseModalContent";
import { TradeableDisplay } from "../lib/tradeables";

type TradeableListingsProps = {
  authToken: string;
  tradeable?: TradeableDetails;
  display: TradeableDisplay;
  farmId: number;
  id: number;
  showListItem: boolean;
  count: number;
  onListClick: () => void;
  onListClose: () => void;
  onListing: () => void;
  onPurchase: () => void;
};

const _isListing = (state: MachineState) => state.matches("marketplaceListing");
const _balance = (state: MachineState) => state.context.state.balance;

export const TradeableListings: React.FC<TradeableListingsProps> = ({
  authToken,
  tradeable,
  farmId,
  display,
  id,
  count,
  showListItem,
  onListing,
  onListClick,
  onListClose,
  onPurchase,
}) => {
  const { gameService, showAnimations } = useContext(Context);
  const { t } = useAppTranslation();
  const params = useParams();

  const isListing = useSelector(gameService, _isListing);
  const balance = useSelector(gameService, _balance);
  const [selectedListing, setSelectedListing] = useState<Listing>();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

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
      if (showAnimations) confetti();
    },
  );

  const handleSelectListing = (id: string) => {
    const selectedListing = tradeable?.listings.find(
      (listing) => listing.id === id,
    ) as Listing;

    setSelectedListing(selectedListing);
    setShowPurchaseModal(true);
  };

  const isResource = params.collection === "resources";

  const loading = !tradeable;

  return (
    <>
      <Modal
        show={showPurchaseModal}
        onHide={() => setShowPurchaseModal(false)}
      >
        <Panel>
          <PurchaseModalContent
            authToken={authToken}
            listingId={selectedListing?.id as string}
            price={selectedListing?.sfl ?? 0}
            tradeable={tradeable as Tradeable}
            onClose={() => setShowPurchaseModal(false)}
            listing={selectedListing as Listing}
          />
        </Panel>
      </Modal>
      <Modal show={showListItem} onHide={!isListing ? onListClose : undefined}>
        <Panel>
          <TradeableListItem
            authToken={authToken}
            display={display}
            id={id}
            floorPrice={tradeable?.floor ?? 0}
            onClose={onListClose}
          />
        </Panel>
      </Modal>
      <InnerPanel className="mb-1">
        <div className="p-2">
          <div className="flex items-center justify-between">
            <Label icon={tradeIcon} type="default" className="mb-2">
              {t("marketplace.listings")}
            </Label>
            <Label type="default" className="mb-2">
              {t("marketplace.availableListings", {
                count: shortenCount(tradeable?.listings.length ?? 0),
              })}
            </Label>
          </div>
          <div className="mb-2">
            {loading && <Loading />}
            {!loading && tradeable?.listings.length === 0 && (
              <p className="text-sm">{t("marketplace.noListings")}</p>
            )}
            {!!tradeable?.listings.length &&
              (isResource ? (
                <ResourceTable
                  balance={balance}
                  items={tradeable?.listings.map((listing) => ({
                    id: listing.id,
                    price: listing.sfl,
                    quantity: listing.quantity,
                    pricePerUnit: Number(
                      formatNumber(listing.sfl / listing.quantity, {
                        decimalPlaces: 4,
                      }),
                    ),
                    createdById: listing.listedById,
                  }))}
                  id={farmId}
                  tableType="listings"
                  onClick={(listingId) => {
                    handleSelectListing(listingId);
                    setShowPurchaseModal(true);
                  }}
                />
              ) : (
                <TradeTable
                  items={tradeable?.listings.map((listing) => ({
                    price: listing.sfl,
                    expiresAt: "30 days", // TODO,
                    createdById: listing.listedById,
                  }))}
                  id={farmId}
                />
              ))}
          </div>
<<<<<<< HEAD
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
=======
          {!isResource && (
            <div className="w-full justify-end hidden sm:flex sm:visible">
              <Button
                className="w-full sm:w-fit"
                disabled={!count}
                onClick={onListClick}
>>>>>>> 09b8a2dc0 ([FEAT] Update offers)
              >
                {t("marketplace.listForSale")}
              </Button>
            </div>
          )}
        </div>
        {!isResource && (
          <Button
            className="w-full sm:hidden"
            disabled={!count}
            onClick={onListClick}
          >
            {t("marketplace.listForSale")}
          </Button>
        )}
      </InnerPanel>
    </>
  );
};
