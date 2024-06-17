import React, { useContext, useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";
import ticket from "assets/icons/block_buck_detailed.png";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { NPC_WEARABLES } from "lib/npcs";

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

  const canRestock = gameState.context.state.inventory["Block Buck"]?.gte(1);

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
    openModal("BUY_BLOCK_BUCKS");
  };

  const handleRestock = () => {
    gameService.send("shops.restocked");

    gameAnalytics.trackSink({
      currency: "Block Buck",
      amount: 1,
      item: "Stock",
      type: "Fee",
    });

    () => setShowConfirm(false);
  };
  return (
    <>
      <div className="my-1 flex flex-col mb-1 flex-1 items-center justify-end">
        <div className="flex items-center">
          <p
            className="text-xs mr-1.5 mb-0.5 font-secondary"
            style={{ wordSpacing: "-3px" }}
          >
            {t("restock")} {"= 1 x"}
          </p>
          <SquareIcon icon={ITEM_DETAILS["Block Buck"].image} width={7} />
        </div>
      </div>
      <Button
        disabled={isDisabled}
        className="mt-1"
        onClick={() => setShowConfirm(true)}
      >
        <div className="flex items-center h-4">
          <p>{t("restock")}</p>
        </div>
      </Button>
      {!canRestock && (
        <Button className="mt-1" onClick={handleBuy} disabled={disableBuy}>
          <div className="flex items-center h-4">
            <p className="mr-1.5">{t("buy")}</p>

            <img src={ITEM_DETAILS["Block Buck"].image} className="h-5 -mb-1" />
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
