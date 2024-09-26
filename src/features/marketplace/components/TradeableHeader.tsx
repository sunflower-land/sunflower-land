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
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getTradeableDisplay, TradeableDisplay } from "../lib/tradeables";

import sflIcon from "assets/icons/sfl.webp";
import walletIcon from "assets/icons/wallet.png";
import { TradeableSummary } from "./TradeableOffers";
import { GameWallet } from "features/wallet/Wallet";
import { Loading } from "features/auth/components";
import { Context } from "features/game/GameProvider";
import { waitFor } from "xstate/lib/waitFor";
import confetti from "canvas-confetti";

const PurchaseModalContent: React.FC<{
  listingId: string;
  tradeable: Tradeable;
  collection: CollectionName;
  price: number;
  onPurchase: () => void;
  onClose: () => void;
}> = ({ tradeable, collection, price, listingId, onClose, onPurchase }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [isBuying, setIsBuying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const display = getTradeableDisplay({
    id: tradeable.id,
    type: collection,
  });

  const confirm = async () => {
    setIsBuying(true);

    gameService.send("POST_EFFECT", {
      effect: {
        type: "marketplace.listingPurchased",
        id: listingId,
      },
    });

    await waitFor(
      gameService,
      (state) => {
        if (state.matches("error")) throw new Error("Purchase failed");

        return state.matches("playing");
      },
      { timeout: 60 * 1000 },
    );

    if (tradeable?.type === "instant") {
      confetti();
      setIsBuying(false);
      setShowSuccess(true);

      return;
    }
    // Handled through transaction UX

    onClose();
    setIsBuying(false);
  };
  // HIT API TO BUY
  // GET THE PURCHASE SIGNATURE BACK
  // SUBMIT A TRANSACTION TO THE CONTRACT

  if (isBuying) {
    return <Loading />;
  }

  if (showSuccess) {
    return (
      <>
        <div className="p-2 flex flex-col">
          <Label type="success" className="mb-2 -ml-1">
            {t("congrats")}
          </Label>
          <p className="mb-3">{t("marketplace.successfulPurchase")}</p>
          <TradeableSummary display={display} sfl={price} />
          <p className="mt-2 mb-1 text-xs">{t("marketplace.sentToFarm")}</p>
        </div>
        <Button onClick={onPurchase}>{t("continue")}</Button>
      </>
    );
  }

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between">
          <Label type="default" className="mb-2 -ml-1">{`Purchase`}</Label>
          {tradeable?.type === "onchain" && (
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
          {tradeable?.type === "onchain" && (
            <img src={walletIcon} className="absolute right-1 top-0.5 h-7" />
          )}
        </Button>
      </div>
    </>
  );
};

type TradeableHeaderProps = {
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
  farmId,
  collection,
  onBack,
  display,
  count,
  tradeable,
  onListClick,
  onPurchase,
}) => {
  const { t } = useAppTranslation();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Filter out my own listings
  const cheapestListing = tradeable?.listings.reduce((cheapest, listing) => {
    if (listing.listedById === farmId) return cheapest;

    return listing.sfl < cheapest.sfl ? listing : cheapest;
  }, tradeable?.listings?.[0]);

  // Remove cheapest listing conditions for buds

  return (
    <>
      {cheapestListing && (
        <Modal show={showPurchaseModal}>
          <Panel>
            {(tradeable as Tradeable).type === "onchain" ? (
              <GameWallet action="marketplace">
                <PurchaseModalContent
                  listingId={cheapestListing.id}
                  price={cheapestListing?.sfl ?? 0}
                  collection={collection}
                  tradeable={tradeable as Tradeable}
                  onPurchase={onPurchase}
                  onClose={() => setShowPurchaseModal(false)}
                />
              </GameWallet>
            ) : (
              <PurchaseModalContent
                listingId={cheapestListing.id}
                price={cheapestListing?.sfl ?? 0}
                collection={collection}
                tradeable={tradeable as Tradeable}
                onPurchase={onPurchase}
                onClose={() => setShowPurchaseModal(false)}
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
            {tradeable?.type === "onchain" && (
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
              <Button onClick={onListClick} className="w-full sm:w-auto">
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
