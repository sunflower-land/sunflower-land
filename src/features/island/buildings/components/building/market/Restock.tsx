import React, { useContext, useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";
import ticket from "assets/icons/block_buck_detailed.png";
import stockIcon from "assets/icons/stock.webp";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { NPC_WEARABLES } from "lib/npcs";
import { BB_TO_GEM_RATIO } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import {
  canRestockShipment,
  secondsUntilShipment,
} from "features/game/events/landExpansion/shipmentRestocked";

interface Props {
  onClose: () => void;
}

export const Restock: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isDisabled, setIsDisabled] = useState(true);
  const [disableBuy, setDisableBuy] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const { openModal } = useContext(ModalContext);

  const canRestock = gameState.context.state.inventory["Gem"]?.gte(1);

  const hasGemExperiment = hasFeatureAccess(
    gameState.context.state,
    "GEM_EXPERIMENT",
  );

  const shipmentAt = useCountdown(
    secondsUntilShipment({ game: gameState.context.state }),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (canRestock) {
        setIsDisabled(false);
      } else {
        setDisableBuy(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleBuy = () => {
    onClose();
    openModal("BUY_GEMS");
  };

  const handleRestock = () => {
    gameService.send("shops.restocked");

    gameAnalytics.trackSink({
      currency: "Gem",
      amount: 1 * BB_TO_GEM_RATIO,
      item: "Stock",
      type: "Fee",
    });

    () => setShowConfirm(false);
  };

  const shipmentIsReady = canRestockShipment({ game: gameState.context.state });
  const { days, ...shipmentTime } = shipmentAt;

  return (
    <>
      <div className="flex justify-center items-center">
        {/* <img src={stockIcon} className="h-5 mr-1" /> */}
        <p className="text-xxs">Next stock shipment:</p>
      </div>
      <div className="flex justify-center items-center">
        <img src={stockIcon} className="h-5 mr-1" />
        <TimerDisplay time={shipmentTime} />
      </div>
      <div className="my-1 flex flex-col mb-1 flex-1 items-center justify-end">
        <div className="flex items-center"></div>
      </div>
      <Button
        disabled={isDisabled}
        className="mt-1 relative"
        onClick={() => setShowConfirm(true)}
      >
        <div className="flex items-center h-4 ">
          <p>{t("restock")}</p>
          <img
            src={ITEM_DETAILS["Block Buck"].image}
            className="h-5 absolute right-1 top-1"
          />
        </div>
      </Button>
      {!canRestock && (
        <Button className="mt-1" onClick={handleBuy} disabled={disableBuy}>
          <div className="flex items-center h-4">
            <p className="mr-1.5">{t("buy")}</p>

            <img src={ITEM_DETAILS["Gem"].image} className="h-5 -mb-1" />
          </div>
        </Button>
      )}
      <ConfirmationModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        messages={[t("restock.one.buck"), t("restock.sure")]}
        icon={ticket}
        imageStyle={{
          width: `${PIXEL_SCALE * 19}px`,
        }}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleRestock}
        confirmButtonLabel={t("restock")}
        bumpkinParts={NPC_WEARABLES.betty}
      />
    </>
  );
};
