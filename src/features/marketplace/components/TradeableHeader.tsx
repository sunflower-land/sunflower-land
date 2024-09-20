import React, { useState } from "react";
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
import { TradeableDisplay } from "../lib/tradeables";

import sflIcon from "assets/icons/sfl.webp";
import walletIcon from "assets/icons/wallet.png";

const PurchaseModalContent: React.FC<{ tradeable: Tradeable }> = ({
  tradeable,
}) => {
  const { t } = useAppTranslation();

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between mb-2">
          <Label type="default" className="mb-2">{`Purchase`}</Label>
          {tradeable?.type === "onchain" && (
            <Label type="formula" icon={walletIcon} className="-mr-1">
              {t("marketplace.walletRequired")}
            </Label>
          )}
        </div>
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
      <Modal show={showPurchaseModal}>
        <Panel>
          <PurchaseModalContent tradeable={tradeable as Tradeable} />
        </Panel>
      </Modal>
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
