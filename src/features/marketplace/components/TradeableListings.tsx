import { useSelector } from "@xstate/react";
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
import { ListingTable } from "./TradeTable";
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
import { KNOWN_ITEMS } from "features/game/types";
import { getKeys } from "features/game/types/craftables";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";

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
  reload: () => void;
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
  reload,
  onListClose,
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
    reload,
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
      reload();
      if (showAnimations) confetti();
    },
  );

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceListingCancellingSuccess",
    "playing",
    () => {
      reload();
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

  const isResource =
    getKeys(TRADE_LIMITS).includes(KNOWN_ITEMS[Number(params.id)]) &&
    params.collection === "collectibles";

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
          <div className="flex items-center justify-between mb-1">
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
                  itemName={KNOWN_ITEMS[Number(params.id)]}
                  items={tradeable?.listings.map((listing) => ({
                    id: listing.id,
                    price: listing.sfl,
                    quantity: listing.quantity,
                    pricePerUnit: Number(
                      formatNumber(listing.sfl / listing.quantity, {
                        decimalPlaces: 4,
                      }),
                    ),
                    createdBy: listing.listedBy,
                  }))}
                  inventoryCount={count}
                  id={farmId}
                  tableType="listings"
                  onClick={(listingId) => {
                    handleSelectListing(listingId);
                    setShowPurchaseModal(true);
                  }}
                />
              ) : (
                <ListingTable
                  listings={tradeable?.listings}
                  collection={tradeable?.collection}
                  details={display}
                />
              ))}
          </div>
          {/* {!isResource && (
            <div className="w-full justify-end hidden sm:flex sm:visible">
              <Button
                className="w-full sm:w-fit"
                disabled={!count}
                onClick={onListClick}
              >
                {t("marketplace.listForSale")}
              </Button>
            </div>
          )} */}
        </div>
        {/* {!isResource && (
          <Button
            className="w-full sm:hidden"
            disabled={!count}
            onClick={onListClick}
          >
            {t("marketplace.listForSale")}
          </Button>
        )} */}
      </InnerPanel>
    </>
  );
};
