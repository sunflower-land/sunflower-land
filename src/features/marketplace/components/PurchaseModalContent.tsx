import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import {
  CollectionName,
  Tradeable,
  Listing,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getTradeableDisplay } from "../lib/tradeables";
import walletIcon from "assets/icons/wallet.png";
import { Context } from "features/game/GameProvider";
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

export const PurchaseModalContent: React.FC<PurchaseModalContentProps> = ({
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
