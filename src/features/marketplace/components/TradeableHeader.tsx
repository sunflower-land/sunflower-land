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
  listingId: number;
  tradeable: Tradeable;
  collection: CollectionName;
  price: number;
  onClose: () => void;
}> = ({ tradeable, collection, price, listingId, onClose }) => {
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
        type: "marketplace.",
        id: listing.tradeId,
      },
    });

    await waitFor(
      gameService,
      (state) => {
        if (state.matches("error")) throw new Error("Insert failed");
        return state.matches("playing");
      },
      { timeout: 60 * 1000 },
    );

    if (tradeable?.type === "instant") {
      confetti();
      setShowSuccess(true);
      return;
    } else {
      // Handled through transaction UX
      onClose();
    }

    setIsBuying(false);
  };
  // HIT API TO BUY
  // GET THE PURCHASE SIGNATURE BACK
  // SUBMIT A TRANSACTION TO THE CONTRACT

  if (isBuying) {
    return <Loading />;
  }

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between mb-1">
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

export const TradeableHeader: React.FC<{
  collection: CollectionName;
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
  count: number;
  onBack: () => void;
  onListClick: () => void;
}> = ({ collection, onBack, display, count, tradeable, onListClick }) => {
  const { t } = useAppTranslation();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const cheapestListing = tradeable?.listings.reduce((cheapest, listing) => {
    return listing.sfl < cheapest.sfl ? listing : cheapest;
  }, tradeable?.listings?.[0]);

  return (
    <>
      {cheapestListing && (
        <Modal show={showPurchaseModal}>
          <Panel>
            {(tradeable as Tradeable).type === "onchain" ? (
              <GameWallet action="marketplace">
                <PurchaseModalContent
                  price={cheapestListing?.sfl ?? 0}
                  collection={collection}
                  tradeable={tradeable as Tradeable}
                  onClose={() => setShowPurchaseModal(false)}
                />
              </GameWallet>
            ) : (
              <PurchaseModalContent
                price={cheapestListing?.sfl ?? 0}
                collection={collection}
                tradeable={tradeable as Tradeable}
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
            <div className="flex items-center">
              {tradeable?.type === "onchain" && (
                <Label type="formula" className="mr-2" icon={walletIcon}>
                  {t("marketplace.walletRequired")}
                </Label>
              )}

              {tradeable !== undefined && (
                <Label type="default">
                  {t("marketplace.youOwn", { count })}
                </Label>
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
                onClick={onListClick}
                disabled={!count}
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
