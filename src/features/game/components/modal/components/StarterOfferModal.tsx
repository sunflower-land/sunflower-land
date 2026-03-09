import React, { useContext } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";
import {
  STARTER_PACK_GEMS,
  STARTER_PACK_COINS,
  STARTER_PACK_USD,
} from "./BuyGems";
import { ModalContext } from "../ModalProvider";

export const StarterOfferModal: React.FC = () => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();

  const onClose = () => {
    gameService.send("CLOSE");
  };

  const onBuyNow = () => {
    gameService.send("CLOSE");
    openModal("BUY_GEMS");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <Label type="vibrant">{t("transaction.starterOffer")}</Label>
        <img
          src={SUNNYSIDE.icons.close}
          className="w-6 h-6 cursor-pointer"
          onClick={onClose}
          alt="close"
        />
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center">
          <SquareIcon icon={ITEM_DETAILS.Gem.image} width={10} />
          <span className="ml-1 text-sm">{`${STARTER_PACK_GEMS} x Gems`}</span>
        </div>
        <div className="flex items-center">
          <img
            src={SUNNYSIDE.ui.coinsImg}
            alt="coins"
            className="w-5 h-5 object-contain"
          />
          <span className="ml-1 text-sm">{`${STARTER_PACK_COINS} x ${t("coins")}`}</span>
        </div>
        <div className="flex items-center pt-1">
          <Label type="warning">{`US$${STARTER_PACK_USD}`}</Label>
        </div>
      </div>
      <div className="flex gap-2">
        <Button className="flex-1" onClick={onClose}>
          {t("close")}
        </Button>
        <Button className="flex-1" onClick={onBuyNow}>
          {t("offer.getStarterPack")}
        </Button>
      </div>
    </>
  );
};
