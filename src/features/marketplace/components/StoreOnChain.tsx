import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { GameWallet } from "features/wallet/Wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Transaction } from "features/island/hud/Transaction";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const StoreOnChain: React.FC<{
  itemName: string;
  onClose: () => void;
  actionType: "listing" | "offer" | "purchase" | "acceptOffer";
}> = ({ onClose, actionType, itemName }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const storeData = () => {
    gameService.send("TRANSACT", {
      transaction: "transaction.progressSynced",
      request: {
        captcha: "",
      },
    });
    onClose();
  };

  const getActionWarning = () => {
    if (actionType === "listing") {
      return t("marketplace.itemNotStoredOnChain.listing.warning");
    }

    if (actionType === "offer") {
      return t("marketplace.itemNotStoredOnChain.offer.warning");
    }

    if (actionType === "purchase") {
      return t("marketplace.itemNotStoredOnChain.purchase.warning");
    }

    if (actionType === "acceptOffer") {
      return t("marketplace.itemNotStoredOnChain.acceptOffer.warning");
    }
  };

  // Transaction already in progress
  const transaction = gameService.state.context.state.transaction;
  if (transaction) {
    return <Transaction isBlocked onClose={onClose} />;
  }

  return (
    <GameWallet action="sync">
      <>
        <div className="relative flex flex-col px-2 space-y-1 mb-3">
          <div className="flex justify-between">
            <Label type="danger" className="my-1 -ml-1">
              {t("marketplace.itemNotStoredOnChain", {
                name: itemName,
              })}
            </Label>
            <img
              src={SUNNYSIDE.icons.close}
              alt="close"
              className="absolute top-1 right-1 cursor-pointer"
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                height: `${PIXEL_SCALE * 11}px`,
              }}
              onClick={onClose}
            />
          </div>
          <div className="mb-1">{getActionWarning()}</div>
        </div>
        <Button onClick={storeData}>
          {t("gameOptions.blockchainSettings.storeOnChain")}
        </Button>
      </>
    </GameWallet>
  );
};
