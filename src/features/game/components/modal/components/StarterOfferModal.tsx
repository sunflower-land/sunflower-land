import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
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
  starterOfferSecondsLeftSelector,
} from "./BuyGems";
import { ModalContext } from "../ModalProvider";
import { secondsToString } from "lib/utils/time";
import { setStarterOfferShown } from "features/game/lib/starterOfferStorage";
import { MachineState } from "features/game/lib/gameMachine";

const farmIdSelector = (state: MachineState) => state.context.farmId;

export const StarterOfferModal: React.FC = () => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();
  const farmId = useSelector(gameService, farmIdSelector);
  const starterOfferSecondsLeft = useSelector(
    gameService,
    starterOfferSecondsLeftSelector,
  );

  const acknowledgeAndClose = () => {
    setStarterOfferShown(farmId);
    gameService.send("CLOSE");
  };

  const onClose = () => {
    acknowledgeAndClose();
  };

  const onBuyNow = () => {
    acknowledgeAndClose();
    openModal("BUY_GEMS");
  };

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <Label type="vibrant">{t("transaction.starterOffer")}</Label>
        <div className="flex items-center gap-2">
          <Label icon={SUNNYSIDE.icons.stopwatch} type="info">
            {`${secondsToString(starterOfferSecondsLeft, {
              length: "short",
            })} left`}
          </Label>
          <img
            src={SUNNYSIDE.icons.close}
            className="w-6 h-6 cursor-pointer"
            onClick={onClose}
            alt="close"
          />
        </div>
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
        <div className="flex flex-col items-start pt-1">
          <span className="text-sm mb-0.5 line-through">{`$4.49`}</span>
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
