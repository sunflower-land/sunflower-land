import React, { useContext, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel, InnerPanel } from "components/ui/Panel";
import {
  CollectionName,
  TradeableDetails,
  Tradeable,
  Listing,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getTradeableDisplay, TradeableDisplay } from "../lib/tradeables";

import sflIcon from "assets/icons/sfl.webp";
import walletIcon from "assets/icons/wallet.png";
import { GameWallet } from "features/wallet/Wallet";
import { Context } from "features/game/GameProvider";
import confetti from "canvas-confetti";
import {
  BlockchainEvent,
  Context as ContextType,
} from "features/game/lib/gameMachine";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";
import { TradeableSummary } from "./TradeableSummary";

type PurchaseModalContentProps = {
  authToken: string;
  listingId: string;
  tradeable: Tradeable;
  listing: Listing;
  collection: CollectionName;
  price: number;
  onClose: () => void;
};

const PurchaseModalContent: React.FC<PurchaseModalContentProps> = ({
  authToken,
  tradeable,
  collection,
  price,
  listingId,
  onClose,
  listing,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const display = getTradeableDisplay({
    id: tradeable.id,
    type: collection,
  });

  const confirm = async () => {
    gameService.send("marketplace.listingPurchased", {
      effect: {
        type: "marketplace.listingPurchased",
        id: listingId,
      },
      authToken,
    });

    onClose();
  };

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between">
          <Label type="default" className="mb-2 -ml-1">{`Purchase`}</Label>
          {listing.type === "onchain" && (
            <Label type="formula" icon={walletIcon} className="-mr-1 mb-2">
              {t("marketplace.walletRequired")}
            </Label>
          )}
        </div>
        <p className="mb-3">{t("marketplace.areYouSureYouWantToBuy")}</p>
        <TradeableSummary display={display} sfl={price} />
      </div>
      <div className="flex space-x-1">
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button onClick={() => confirm()} className="relative">
          <span>{t("confirm")}</span>
          {listing.type === "onchain" && (
            <img src={walletIcon} className="absolute right-1 top-0.5 h-7" />
          )}
        </Button>
      </div>
    </>
  );
};

type TradeableHeaderProps = {
  authToken: string;
  farmId: number;
  collection: CollectionName;
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
  count: number;
  onBack: () => void;
  onListClick: () => void;
  onPurchase: () => void;
};

export const TradeableHeader: React.FC<TradeableHeaderProps> = ({
  authToken,
  farmId,
  collection,
  onBack,
  display,
  count,
  tradeable,
  onListClick,
  onPurchase,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  // Remove listings that are mine
  const filteredListings =
    tradeable?.listings.filter((listing) => listing.listedById !== farmId) ??
    [];

  // Filter out my own listings
  const cheapestListing = filteredListings.reduce((cheapest, listing) => {
    return listing.sfl < cheapest.sfl ? listing : cheapest;
  }, filteredListings[0]);

  // TODO: Remove cheapest listing conditions for buds

  // Handle instant purchase
  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplacePurchasingSuccess",
    "playing",
    onPurchase,
    cheapestListing?.type === "instant",
  );

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplacePurchasing",
    "marketplacePurchasingSuccess",
    confetti,
    cheapestListing?.type === "instant",
  );

  // Auto close this success modal because the transaction modal will be shown
  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplacePurchasing",
    "marketplacePurchasingSuccess",
    () => {
      gameService.send("CONTINUE");
      setShowPurchaseModal(false);
    },
  );

  return (
    <>
      {cheapestListing && (
        <Modal show={showPurchaseModal}>
          <Panel>
            {cheapestListing.type === "onchain" ? (
              <GameWallet action="marketplace">
                <PurchaseModalContent
                  authToken={authToken}
                  listingId={cheapestListing.id}
                  price={cheapestListing?.sfl ?? 0}
                  collection={collection}
                  tradeable={tradeable as Tradeable}
                  onClose={() => setShowPurchaseModal(false)}
                  listing={cheapestListing}
                />
              </GameWallet>
            ) : (
              <PurchaseModalContent
                authToken={authToken}
                listingId={cheapestListing.id}
                price={cheapestListing?.sfl ?? 0}
                collection={collection}
                tradeable={tradeable as Tradeable}
                onClose={() => setShowPurchaseModal(false)}
                listing={cheapestListing}
              />
            )}
          </Panel>
        </Modal>
      )}
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
            {cheapestListing?.type === "onchain" && (
              <Label type="formula" className="mr-2" icon={walletIcon}>
                {t("marketplace.walletRequired")}
              </Label>
            )}
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
              <div className="flex items-center mr-2 sm:mb-0.5 -ml-1" />
            )}
            {/* Desktop display */}
            <div className="items-center justify-between hidden sm:flex sm:visible w-full sm:w-auto">
              {cheapestListing && (
                <Button
                  onClick={() => setShowPurchaseModal(true)}
                  className="mr-1 w-full sm:w-auto"
                >
                  {t("marketplace.buyNow")}
                </Button>
              )}
              <Button
                disabled={!count}
                onClick={onListClick}
                className="w-full sm:w-auto"
              >
                {t("marketplace.listForSale")}
              </Button>
            </div>
          </div>
        </div>
        {/* Mobile display */}
        <div className="flex items-center justify-between sm:hidden w-full sm:w-auto">
          {cheapestListing && (
            <Button
              onClick={() => setShowPurchaseModal(true)}
              className="mr-1 w-full sm:w-auto"
            >
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
    </>
  );
};
